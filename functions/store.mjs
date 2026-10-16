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
    async recordVisitorSession(data) {
      const id = data.sessionId;
      const ref = db.collection('visitorSessions').doc(id);
      return db.runTransaction(async (transaction) => {
        const snap = await transaction.get(ref);
        const existing = snap.data();
        if (!existing) {
          const session = {
            id,
            sessionId: id,
            visitorId: data.visitorId || id,
            startedAt: data.startedAt || now(),
            lastActivityAt: data.lastActivityAt || now(),
            durationSeconds: 0,
            timezone: data.timezone || 'UTC',
            country: data.country || 'Bilinmiyor',
            city: data.city || 'Bilinmiyor',
            region: data.region || 'Bilinmiyor',
            isVpnOrProxy: Boolean(data.isVpnOrProxy),
            deviceType: data.deviceType || 'desktop',
            deviceBrand: data.deviceBrand || 'Bilinmiyor',
            deviceModel: data.deviceModel || 'Model belirlenemedi',
            os: data.os || 'Bilinmiyor',
            browser: data.browser || 'Bilinmiyor',
            browserLanguage: data.browserLanguage || 'Bilinmiyor',
            screenResolution: data.screenResolution || 'Bilinmiyor',
            entryPage: data.path || '/',
            exitPage: data.path || '/',
            pageviewsCount: 1,
            pagesVisited: [{
              path: data.path || '/',
              title: data.title || '',
              timestamp: data.startedAt || now(),
            }],
            events: [],
            referrer: data.referrer || 'Doğrudan Giriş',
            utmSource: data.utm?.source || null,
            utmMedium: data.utm?.medium || null,
            utmCampaign: data.utm?.campaign || null,
            utmTerm: data.utm?.term || null,
            utmContent: data.utm?.content || null,
            hasConverted: Boolean(data.hasConverted),
            conversionKind: data.conversionKind || null,
            conversionReferenceCode: data.conversionReferenceCode || null,
            isBot: Boolean(data.isBot),
            botName: data.botName || null,
            isTest: Boolean(data.isTest),
            anonymous: Boolean(data.anonymous),
          };
          transaction.set(ref, session);
          return session;
        }

        const currentActivity = data.lastActivityAt || now();
        const durationSeconds = Math.max(0, Math.floor((currentActivity - existing.startedAt) / 1000));
        const pages = Array.isArray(existing.pagesVisited) ? [...existing.pagesVisited] : [];
        let newPageviewsCount = existing.pageviewsCount || 1;

        if (data.path && !data.isHeartbeat) {
          const lastPage = pages[pages.length - 1];
          const isRapidRepeat = lastPage && lastPage.path === data.path && (currentActivity - lastPage.timestamp < 3000);
          if (!isRapidRepeat) {
            pages.push({
              path: data.path,
              title: data.title || '',
              timestamp: currentActivity,
            });
            newPageviewsCount += 1;
          }
        }

        const updates = {
          lastActivityAt: currentActivity,
          durationSeconds,
          exitPage: data.path && !data.isHeartbeat ? data.path : existing.exitPage,
          pageviewsCount: newPageviewsCount,
          pagesVisited: pages.slice(-50),
        };

        if (data.hasConverted && !existing.hasConverted) {
          updates.hasConverted = true;
          updates.conversionKind = data.conversionKind || 'rfq';
          updates.conversionReferenceCode = data.conversionReferenceCode || null;
        }

        transaction.update(ref, updates);
        return { ...existing, ...updates };
      });
    },
    async markSessionConverted(sessionId, { kind, referenceCode }) {
      if (!sessionId) return;
      const ref = db.collection('visitorSessions').doc(sessionId);
      try {
        await db.runTransaction(async (transaction) => {
          const snap = await transaction.get(ref);
          if (snap.data()) {
            transaction.update(ref, {
              hasConverted: true,
              conversionKind: kind || 'rfq',
              conversionReferenceCode: referenceCode || null,
              lastActivityAt: now(),
            });
          }
        });
      } catch {
        // Non-blocking conversion update
      }
    },
    async recordAuthLog(authData) {
      const id = randomUUID();
      const doc = {
        id,
        timestamp: new Date(now()).toISOString(),
        email: authData.email || 'Bilinmiyor',
        status: authData.status || 'FAILED',
        reason: authData.reason || '',
        country: authData.country || 'Bilinmiyor',
        city: authData.city || 'Bilinmiyor',
        deviceType: authData.deviceType || 'desktop',
        os: authData.os || 'Bilinmiyor',
        browser: authData.browser || 'Bilinmiyor',
      };
      const col = db.collection('authLogs');
      if (typeof col.doc(id).create === 'function') {
        await col.doc(id).create(doc);
      } else if (typeof col.doc(id).set === 'function') {
        await col.doc(id).set(doc);
      } else {
        await db.runTransaction(async (tx) => { tx.set(col.doc(id), doc); });
      }
      return doc;
    },
    async listAuthLogs({ page = 1, limit = 25 } = {}) {
      const p = Math.max(1, parseInt(page, 10) || 1);
      const l = Math.min(100, Math.max(1, parseInt(limit, 10) || 25));
      const col = db.collection('authLogs');
      let all = [];
      if (typeof col.orderBy === 'function') {
        const snap = await col.orderBy('timestamp', 'desc').limit(500).get();
        all = snap.docs.map((d) => ({ ...d.data(), id: d.id }));
      }
      const total = all.length;
      const start = (p - 1) * l;
      const items = all.slice(start, start + l);
      return { items, total, page: p, limit: l, totalPages: Math.ceil(total / l) || 1 };
    },
    async getVisitorAnalytics({ range = '7d', country, device, browser, converted, bot, pagePath, page = 1, limit = 25 } = {}) {
      const currentTime = now();
      let since = 0;
      if (range === 'today') {
        const d = new Date(currentTime);
        d.setHours(0, 0, 0, 0);
        since = d.getTime();
      } else if (range === '7d') {
        since = currentTime - 7 * 24 * 60 * 60 * 1000;
      } else if (range === '30d') {
        since = currentTime - 30 * 24 * 60 * 60 * 1000;
      }

      const col = db.collection('visitorSessions');
      let allDocs = [];
      if (typeof col.orderBy === 'function') {
        let q = col;
        if (since > 0 && typeof q.where === 'function') {
          q = q.where('startedAt', '>=', since);
        }
        q = q.orderBy('startedAt', 'desc').limit(1000);
        const snap = await q.get();
        allDocs = snap.docs.map((d) => ({ ...d.data(), id: d.id }));
      }

      const activeThreshold = currentTime - (5 * 60 * 1000);
      const uniqueVisitorsSet = new Set();
      let totalPageviews = 0;
      let activeVisitorsCount = 0;
      let conversionCount = 0;

      const countriesMap = {};
      const devicesMap = {};
      const osMap = {};
      const browsersMap = {};
      const sourcesMap = {};
      const pagesMap = {};
      const dailyMap = {};

      allDocs.forEach((s) => {
        // Anonymous sessions have no persistent identity, so they cannot be counted as unique visitors.
        if (s.visitorId && !s.anonymous) uniqueVisitorsSet.add(s.visitorId);
        totalPageviews += (s.pageviewsCount || 1);
        if (s.lastActivityAt >= activeThreshold) activeVisitorsCount += 1;
        if (s.hasConverted) conversionCount += 1;

        const c = s.country || 'Bilinmiyor';
        countriesMap[c] = (countriesMap[c] || 0) + 1;

        const dev = s.deviceType || 'desktop';
        devicesMap[dev] = (devicesMap[dev] || 0) + 1;

        const osName = (s.os || 'Bilinmiyor').split(' ')[0];
        osMap[osName] = (osMap[osName] || 0) + 1;

        const brName = (s.browser || 'Bilinmiyor').split(' ')[0];
        browsersMap[brName] = (browsersMap[brName] || 0) + 1;

        const src = s.utmSource || (s.referrer && s.referrer.startsWith('http') ? new URL(s.referrer).hostname : 'Doğrudan Giriş');
        sourcesMap[src] = (sourcesMap[src] || 0) + 1;

        (s.pagesVisited || []).forEach((p) => {
          if (p.path) pagesMap[p.path] = (pagesMap[p.path] || 0) + 1;
        });

        const dayKey = new Date(s.startedAt).toISOString().slice(0, 10);
        if (!dailyMap[dayKey]) dailyMap[dayKey] = { date: dayKey, sessions: 0, pageviews: 0, unique: new Set() };
        dailyMap[dayKey].sessions += 1;
        dailyMap[dayKey].pageviews += (s.pageviewsCount || 1);
        if (s.visitorId && !s.anonymous) dailyMap[dayKey].unique.add(s.visitorId);
      });

      const summary = {
        totalSessions: allDocs.length,
        totalPageviews,
        uniqueVisitors: uniqueVisitorsSet.size,
        activeVisitors: activeVisitorsCount,
        activeWindowMinutes: 5,
        conversionCount,
        conversionRate: allDocs.length > 0 ? Number(((conversionCount / allDocs.length) * 100).toFixed(1)) : 0,
        breakdowns: {
          countries: Object.entries(countriesMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 10),
          devices: Object.entries(devicesMap).map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count),
          os: Object.entries(osMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 6),
          browsers: Object.entries(browsersMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 6),
          sources: Object.entries(sourcesMap).map(([source, count]) => ({ source, count })).sort((a, b) => b.count - a.count).slice(0, 8),
          topPages: Object.entries(pagesMap).map(([path, count]) => ({ path, count })).sort((a, b) => b.count - a.count).slice(0, 10),
          daily: Object.values(dailyMap).map((d) => ({ date: d.date, sessions: d.sessions, pageviews: d.pageviews, uniqueVisitors: d.unique.size })).sort((a, b) => a.date.localeCompare(b.date)),
        },
      };

      let filtered = allDocs;
      if (country && country !== 'all') filtered = filtered.filter((s) => s.country === country);
      if (device && device !== 'all') filtered = filtered.filter((s) => s.deviceType === device);
      if (browser && browser !== 'all') filtered = filtered.filter((s) => (s.browser || '').toLowerCase().includes(browser.toLowerCase()));
      if (converted === 'yes') filtered = filtered.filter((s) => s.hasConverted === true);
      else if (converted === 'no') filtered = filtered.filter((s) => !s.hasConverted);
      if (bot === 'bot') filtered = filtered.filter((s) => s.isBot === true);
      else if (bot === 'human') filtered = filtered.filter((s) => !s.isBot);
      if (pagePath && pagePath.trim()) filtered = filtered.filter((s) => (s.pagesVisited || []).some((p) => p.path?.includes(pagePath.trim())));

      const p = Math.max(1, parseInt(page, 10) || 1);
      const l = Math.min(100, Math.max(1, parseInt(limit, 10) || 25));
      const totalFiltered = filtered.length;
      const start = (p - 1) * l;
      const paginatedSessions = filtered.slice(start, start + l);

      return {
        summary,
        sessions: {
          items: paginatedSessions,
          total: totalFiltered,
          page: p,
          limit: l,
          totalPages: Math.ceil(totalFiltered / l) || 1,
        },
      };
    },
    async getVisitorSession(id) {
      const snap = await db.collection('visitorSessions').doc(id).get();
      if (!snap || typeof snap.data !== 'function' || !snap.data()) {
        throw new HttpError(404, 'Session not found.');
      }
      return { ...snap.data(), id };
    },
    async cleanupOldAnalytics(retentionDays = 90) {
      const cutoff = now() - (retentionDays * 24 * 60 * 60 * 1000);
      let deleted = 0;
      const col = db.collection('visitorSessions');
      if (typeof col.where === 'function') {
        const snap = await col.where('startedAt', '<', cutoff).limit(200).get();
        for (const doc of snap.docs) {
          if (doc.ref && typeof doc.ref.delete === 'function') {
            await doc.ref.delete();
            deleted += 1;
          }
        }
      }
      return { deleted, cutoff: new Date(cutoff).toISOString() };
    },
  };
}
