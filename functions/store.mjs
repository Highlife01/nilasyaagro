import { createHash, randomUUID } from 'node:crypto';
import { HttpError } from './validation.mjs';

export const notificationPolicy = { maxAttempts: 8, leaseMs: 60000, retryDeadlineMs: 23 * 60 * 60 * 1000 };

export function retryDelay(attempt) { return Math.min(60 * 60 * 1000, 60000 * 2 ** Math.max(0, attempt - 1)); }

export function createFirestoreStore(db, { Timestamp, FieldValue, now = () => Date.now() }) {
  const outbox = (id) => db.collection('notificationOutbox').doc(id);
  const inquiry = (id) => db.collection('inquiries').doc(id);
  const deleteField = () => FieldValue.delete();
  async function updateLeased(id, token, updates) {
    return db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(outbox(id));
      const job = snapshot.data();
      if (!job || job.leaseToken !== token) throw new Error('Notification lease is no longer held.');
      return updates(transaction, job);
    });
  }
  return {
    async rateLimit(action, address, limit, windowMs) {
      const bucket = Math.floor(now() / windowMs);
      const hash = createHash('sha256').update(`${action}:${address}:${bucket}`).digest('hex');
      const reference = db.collection('rateLimits').doc(hash);
      await db.runTransaction(async (transaction) => {
        const snapshot = await transaction.get(reference);
        const count = snapshot.data()?.count || 0;
        if (count >= limit) throw new HttpError(429, 'Too many requests. Please try again later.');
        transaction.set(reference, { count: count + 1, expiresAt: Timestamp.fromMillis((bucket + 2) * windowMs) });
      });
    },
    async saveInquiry({ id, requestKey, fingerprint, inquiry: data, timestamp }) {
      const key = db.collection('submissionKeys').doc(requestKey);
      return db.runTransaction(async (transaction) => {
        const previous = (await transaction.get(key)).data();
        if (previous) {
          if (previous.fingerprint !== fingerprint) throw new HttpError(409, 'This request ID was already used. Start a new inquiry after changing its details.');
          return { id: previous.inquiryId, referenceCode: previous.referenceCode };
        }
        transaction.create(inquiry(id), { ...data, notification: { status: 'pending', updatedAt: data.createdAt } });
        // Reservation makes the human-facing reference unique even on a UUID-prefix collision.
        transaction.create(db.collection('inquiryReferences').doc(data.referenceCode), { inquiryId: id });
        transaction.create(key, { fingerprint, inquiryId: id, referenceCode: data.referenceCode, createdAt: data.createdAt });
        transaction.create(outbox(id), { inquiryId: id, referenceCode: data.referenceCode, status: 'pending', createdAt: timestamp, attempts: 0, nextAttemptAt: timestamp, accepted: {}, attemptLog: [] });
        return { id, referenceCode: data.referenceCode };
      });
    },
    async claimNotification(id, timestamp) {
      return db.runTransaction(async (transaction) => {
        const job = (await transaction.get(outbox(id))).data();
        if (!job) return { status: 'failed' };
        if (['sent', 'failed'].includes(job.status)) return { status: job.status };
        if (job.nextAttemptAt > timestamp) return { status: job.status };
        const savedInquiry = (await transaction.get(inquiry(id))).data();
        // A crash after saving both provider receipts must not turn a delivered
        // inquiry into a failure when its final attempt or retry deadline expires.
        if (savedInquiry && job.accepted?.team && job.accepted?.customer) {
          transaction.update(outbox(id), { status: 'sent', nextAttemptAt: deleteField(), leaseToken: deleteField(), lastErrorCode: deleteField(), updatedAt: timestamp, attemptLog: [...job.attemptLog, { attempt: job.attempts, status: 'sent', timestamp }] });
          transaction.update(inquiry(id), { notification: { status: 'sent', updatedAt: new Date(timestamp).toISOString(), accepted: job.accepted } });
          return { status: 'sent' };
        }
        if (!savedInquiry || job.attempts >= notificationPolicy.maxAttempts || timestamp - job.createdAt >= notificationPolicy.retryDeadlineMs) {
          const code = savedInquiry ? 'retry_limit_reached' : 'inquiry_missing';
          transaction.update(outbox(id), { status: 'failed', lastErrorCode: code, nextAttemptAt: deleteField(), leaseToken: deleteField(), updatedAt: timestamp });
          if (savedInquiry) transaction.update(inquiry(id), { notification: { status: 'failed', updatedAt: new Date(timestamp).toISOString(), lastErrorCode: code } });
          return { status: 'failed' };
        }
        const leaseToken = randomUUID();
        transaction.update(outbox(id), { status: 'sending', leaseToken, attempts: job.attempts + 1, nextAttemptAt: timestamp + notificationPolicy.leaseMs, updatedAt: timestamp });
        return { ...job, leaseToken, inquiry: savedInquiry };
      });
    },
    async prepareNotificationMessages(id, token, messages) {
      return updateLeased(id, token, (transaction, job) => {
        if (job.messages) return job.messages;
        transaction.update(outbox(id), { messages });
        return messages;
      });
    },
    async acceptNotification(id, token, audience, providerId, timestamp) {
      if (!['team', 'customer'].includes(audience) || typeof providerId !== 'string' || !providerId || providerId.length > 200) throw new Error('Invalid notification receipt.');
      return updateLeased(id, token, (transaction, job) => {
        const accepted = { ...job.accepted, [audience]: { providerId, acceptedAt: new Date(timestamp).toISOString() } };
        transaction.update(outbox(id), { accepted, updatedAt: timestamp });
      });
    },
    async completeNotification(id, token, timestamp) {
      return updateLeased(id, token, (transaction, job) => {
        if (!job.accepted?.team || !job.accepted?.customer) throw new Error('Notification receipts are incomplete.');
        transaction.update(outbox(id), { status: 'sent', nextAttemptAt: deleteField(), leaseToken: deleteField(), lastErrorCode: deleteField(), updatedAt: timestamp, attemptLog: [...job.attemptLog, { attempt: job.attempts, status: 'sent', timestamp }] });
        transaction.update(inquiry(id), { notification: { status: 'sent', updatedAt: new Date(timestamp).toISOString(), accepted: job.accepted } });
      });
    },
    async failNotification(id, token, { code, retryable, timestamp }) {
      return updateLeased(id, token, (transaction, job) => {
        const failed = !retryable || job.attempts >= notificationPolicy.maxAttempts || timestamp - job.createdAt >= notificationPolicy.retryDeadlineMs;
        const status = failed ? 'failed' : 'pending';
        transaction.update(outbox(id), { status, lastErrorCode: code, leaseToken: deleteField(), nextAttemptAt: failed ? deleteField() : timestamp + retryDelay(job.attempts), updatedAt: timestamp, attemptLog: [...job.attemptLog, { attempt: job.attempts, status, code, timestamp }] });
        transaction.update(inquiry(id), { notification: { status, updatedAt: new Date(timestamp).toISOString(), lastErrorCode: code, accepted: job.accepted } });
        return status;
      });
    },
    async dueNotifications(timestamp, limit = 25) {
      const snapshot = await db.collection('notificationOutbox').where('nextAttemptAt', '<=', timestamp).orderBy('nextAttemptAt').limit(limit).get();
      return snapshot.docs.map((doc) => doc.id);
    },
    async create(collection, id, data) { await db.collection(collection).doc(id).create(data); },
    async set(collection, id, data) { await db.collection(collection).doc(id).set(data); },
    async update(collection, id, data) {
      try { await db.collection(collection).doc(id).update(data); }
      catch (error) { if (error.code === 5) throw new HttpError(404, 'Record not found.'); throw error; }
    },
    async remove(collection, id) { await db.collection(collection).doc(id).delete(); },
    async list(collection) {
      const orderField = collection === 'inquiries' ? 'createdAt' : collection === 'audit' ? 'timestamp' : null;
      const query = orderField ? db.collection(collection).orderBy(orderField, 'desc') : db.collection(collection);
      const snapshot = await query.limit(500).get();
      return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    },
    async audit(claims, action, details) {
      await db.collection('audit').doc(randomUUID()).create({ action, details, user: claims.email || claims.uid, timestamp: new Date(now()).toISOString(), ip: '' });
    },
  };
}
