import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { createApiHandler, referenceFor } from '../functions/api.mjs';
import { createNotificationWorker, createResendTransport, NotificationError } from '../functions/notifications.mjs';
import { createFirestoreStore, notificationPolicy } from '../functions/store.mjs';
import { HttpError, requestedDeliveryDate, validateInquiry, validateStock } from '../functions/validation.mjs';

const catalog = JSON.parse(await readFile(new URL('../functions/catalog.json', import.meta.url), 'utf8'));
const timestamp = Date.parse('2026-10-09T10:00:00Z');
const origin = 'https://www.nilasyaagrofoods.com.tr';
const contact = {
  kind: 'contact', language: 'tr',
  data: { company: 'Example Buyer', name: 'Buyer', email: 'BUYER@example.com', phone: '+90 555 123 4567', message: 'Please contact us.', consent: true },
};
const stock = { seasonStatus: 'storage', moqTons: 20, availableStockMT: 100, exportQualityScore: 95, storageCondition: 'Dry warehouse', activeCalibers: ['8mm'] };
const claims = { uid: 'admin-1', email: 'admin@example.com', auth_time: timestamp / 1000, nilasyaRole: 'EXPORT_MANAGER' };
const badRequest = (error) => error instanceof HttpError && error.status === 400;

// Commit writes only after the callback succeeds, as Firestore transactions do.
// Provider calls and Firebase credentials are never needed by these tests.
function memoryStore() {
  const records = new Map();
  let currentTime = timestamp;
  const reference = (collection, id) => ({ path: `${collection}/${id}`, id });
  const db = {
    collection(name) { return { doc(id) { return reference(name, id); } }; },
    async runTransaction(callback) {
      const writes = [];
      const result = await callback({
        async get(ref) { return { data: () => structuredClone(records.get(ref.path)) }; },
        create(ref, data) { writes.push({ method: 'create', ref, data }); },
        set(ref, data) { writes.push({ method: 'set', ref, data }); },
        update(ref, data) { writes.push({ method: 'update', ref, data }); },
      });
      const next = new Map(records);
      for (const { method, ref, data } of writes) {
        if (method === 'create' && next.has(ref.path)) throw new Error('Document already exists.');
        if (method === 'update' && !next.has(ref.path)) throw new Error('Document does not exist.');
        const saved = method === 'update' ? structuredClone(next.get(ref.path)) : {};
        for (const [key, value] of Object.entries(data)) {
          if (value?.deleteField === true) delete saved[key];
          else saved[key] = structuredClone(value);
        }
        next.set(ref.path, saved);
      }
      records.clear();
      for (const [key, value] of next) records.set(key, value);
      return result;
    },
  };
  return {
    records,
    store: createFirestoreStore(db, { Timestamp: { fromMillis: (value) => value }, FieldValue: { delete: () => ({ deleteField: true }) }, now: () => currentTime }),
    now: () => currentTime,
    advance(ms) { currentTime += ms; },
  };
}

function savedInquiry(id = 'inquiry-1') {
  const inquiry = { ...validateInquiry(contact, catalog), referenceCode: referenceFor('contact', id, timestamp), createdAt: new Date(timestamp).toISOString() };
  return { id, requestKey: 'request-1', fingerprint: 'fingerprint-1', inquiry, timestamp };
}

async function requestApi(options = {}, request = {}) {
  const handler = createApiHandler({
    auth: { async verifySessionCookie() { return claims; }, async getUser() { return { customClaims: { nilasyaRole: claims.nilasyaRole } }; } },
    store: {}, catalog, allowedOrigins: [origin], now: () => timestamp, ...options,
  });
  const response = {
    statusCode: 200, headers: {},
    set(key, value) { this.headers[key] = value; return this; },
    status(value) { this.statusCode = value; return this; },
    json(body) { this.body = body; return this; },
  };
  await handler({ path: '/api/admin/stocks/chickpeas', method: 'PUT', ip: '127.0.0.1', body: stock, ...request, headers: { origin, 'content-type': 'application/json', 'x-nilasya-request': '1', cookie: '__session=test', ...request.headers } }, response);
  return response;
}

test('stock validation rejects malformed input instead of erasing caliber data', () => {
  for (const data of [null, undefined, [], 'stock']) assert.throws(() => validateStock('chickpeas', data, catalog), badRequest);
  for (const activeCalibers of [null, '8mm', {}, Array(31).fill('8mm'), ['']]) {
    assert.throws(() => validateStock('chickpeas', { ...stock, activeCalibers }, catalog), badRequest);
  }
  assert.deepEqual(validateStock('chickpeas', stock, catalog).activeCalibers, ['8mm']);
  assert.deepEqual(validateStock('chickpeas', { ...stock, activeCalibers: [] }, catalog).activeCalibers, []);
});

test('delivery dates use the Istanbul calendar and reject invalid dates', () => {
  const localMidnight = Date.parse('2026-10-09T21:30:00Z');
  assert.equal(requestedDeliveryDate('2026-10-10', localMidnight), '2026-10-10');
  assert.throws(() => requestedDeliveryDate('2026-10-09', localMidnight), badRequest);
  assert.throws(() => requestedDeliveryDate('2026-02-30', timestamp), badRequest);
  assert.throws(() => requestedDeliveryDate('2029-10-09', timestamp), badRequest);
  assert.match(referenceFor('rfq', 'aabbccdd-1234', localMidnight), /^RFQ-20261010-AABBCCDD$/u);
});

test('public RFQs require delivery details and whole container quantities', () => {
  const payload = { kind: 'rfq', language: 'en', data: { ...contact.data, product: 'chickpeas', quantity: '2', unit: 'container', variety: 'Kabuli', caliber: '8mm', packaging: '25 kg bags', incoterm: 'CIF', destinationCountry: 'Germany', destinationCity: 'Hamburg', destinationPort: 'Hamburg', requestedDeliveryDate: '2026-10-10' } };
  assert.equal(validateInquiry(payload, catalog, { now: timestamp }).email, 'buyer@example.com');
  assert.throws(() => validateInquiry({ ...payload, data: { ...payload.data, destinationPort: '' } }, catalog, { now: timestamp }), badRequest);
  assert.throws(() => validateInquiry({ ...payload, data: { ...payload.data, quantity: '1.5' } }, catalog, { now: timestamp }), badRequest);
  assert.throws(() => validateInquiry({ ...payload, data: { ...payload.data, consent: false } }, catalog, { now: timestamp }), badRequest);
});

test('API rejects malformed stock payloads without writing records', async () => {
  let writes = 0;
  const response = await requestApi({ store: { async set() { writes++; } } }, { body: null });
  assert.equal(response.statusCode, 400);
  assert.equal(writes, 0);
});

test('API checks origin and current account permissions before mutations', async () => {
  let writes = 0;
  const store = { async set() { writes++; }, async audit() {} };
  const blockedOrigin = await requestApi({ store }, { headers: { origin: 'https://other.example.com' } });
  assert.equal(blockedOrigin.statusCode, 403);
  const revokedRole = await requestApi({ store, auth: { async verifySessionCookie() { return claims; }, async getUser() { return { customClaims: {} }; } } });
  assert.equal(revokedRole.statusCode, 403);
  const salesRep = await requestApi({ store, auth: { async verifySessionCookie() { return claims; }, async getUser() { return { customClaims: { nilasyaRole: 'SALES_REP' } }; } } });
  assert.equal(salesRep.statusCode, 403);
  assert.equal(writes, 0);
  const allowed = await requestApi({ store });
  assert.equal(allowed.statusCode, 200);
  assert.equal(writes, 1);
});

test('saved inquiry responses retain their reference when notifications are pending', async () => {
  let saved;
  const response = await requestApi({ store: { async rateLimit() {}, async saveInquiry(value) { saved = value; return { id: value.id, referenceCode: value.inquiry.referenceCode }; } }, async notify() { return { status: 'pending' }; } }, { path: '/api/inquiries', method: 'POST', body: contact });
  assert.equal(response.statusCode, 503);
  assert.equal(response.body.saved, true);
  assert.equal(response.body.referenceCode, saved.inquiry.referenceCode);
  assert.equal(response.body.deliveryStatus, 'pending');
  assert.equal(saved.inquiry.email, 'buyer@example.com');
});

test('submission keys reuse the same record and reject changed payloads atomically', async () => {
  const { store, records } = memoryStore();
  const first = savedInquiry();
  const saved = await store.saveInquiry(first);
  assert.equal(records.size, 4);
  assert.deepEqual(await store.saveInquiry({ ...first, id: 'inquiry-2' }), saved);
  assert.equal(records.size, 4);
  await assert.rejects(store.saveInquiry({ ...first, id: 'inquiry-3', fingerprint: 'changed' }), (error) => error instanceof HttpError && error.status === 409);
  assert.equal(records.size, 4);
});

test('notification retries send only the missing audience with the original message', async () => {
  const fixture = memoryStore();
  await fixture.store.saveInquiry(savedInquiry());
  const sends = [];
  let customerFailures = 1;
  let config = { from: 'export@example.com', teamEmail: 'team@example.com' };
  const notify = createNotificationWorker({
    store: fixture.store, now: fixture.now, mailConfig: () => config,
    async sendMail(message, key) {
      sends.push({ message: structuredClone(message), key });
      if (key.endsWith('/customer') && customerFailures-- > 0) throw new NotificationError('provider_network_error');
      return { providerId: key.endsWith('/team') ? 'team-receipt' : 'customer-receipt' };
    },
  });
  assert.deepEqual(await notify('inquiry-1'), { status: 'pending' });
  config = { from: 'changed@example.com', teamEmail: 'new-team@example.com' };
  fixture.advance(60001);
  assert.deepEqual(await notify('inquiry-1'), { status: 'sent' });
  assert.equal(sends.length, 3);
  assert.equal(sends.filter(({ key }) => key.endsWith('/team')).length, 1);
  assert.deepEqual(sends[1], sends[2]);
  assert.equal(fixture.records.get('inquiries/inquiry-1').notification.status, 'sent');
  assert.deepEqual(await notify('inquiry-1'), { status: 'sent' });
  assert.equal(sends.length, 3);
});

test('a crash after both receipts recovers as sent even when the retry budget expires', async () => {
  const fixture = memoryStore();
  await fixture.store.saveInquiry(savedInquiry());
  const job = fixture.records.get('notificationOutbox/inquiry-1');
  Object.assign(job, { status: 'sending', attempts: notificationPolicy.maxAttempts, leaseToken: 'old-lease', accepted: { team: { providerId: 'team' }, customer: { providerId: 'customer' } } });
  fixture.advance(notificationPolicy.retryDeadlineMs);
  assert.deepEqual(await fixture.store.claimNotification('inquiry-1', fixture.now()), { status: 'sent' });
  assert.equal(fixture.records.get('inquiries/inquiry-1').notification.status, 'sent');
  assert.equal(fixture.records.get('notificationOutbox/inquiry-1').nextAttemptAt, undefined);
});

test('notification leases prevent an immediate duplicate send and stop exhausted retries', async () => {
  const fixture = memoryStore();
  await fixture.store.saveInquiry(savedInquiry());
  const first = await fixture.store.claimNotification('inquiry-1', fixture.now());
  assert.ok(first.leaseToken);
  const duplicate = await fixture.store.claimNotification('inquiry-1', fixture.now());
  assert.equal(duplicate.leaseToken, undefined);
  const job = fixture.records.get('notificationOutbox/inquiry-1');
  job.attempts = notificationPolicy.maxAttempts;
  fixture.advance(notificationPolicy.leaseMs);
  assert.deepEqual(await fixture.store.claimNotification('inquiry-1', fixture.now()), { status: 'failed' });
});

test('mail transport preserves idempotency and distinguishes permanent provider failures', async () => {
  let captured;
  const transport = createResendTransport({ apiKey: 'test-key', async fetchImpl(url, options) { captured = { url, options }; return { ok: true, async json() { return { id: 'receipt-1' }; } }; } });
  assert.deepEqual(await transport({ subject: 'Inquiry' }, 'nilasya/id/team'), { providerId: 'receipt-1' });
  assert.equal(captured.options.headers['Idempotency-Key'], 'nilasya/id/team');
  const rejected = createResendTransport({ apiKey: 'test-key', async fetchImpl() { return { ok: false, status: 422, async json() { return {}; } }; } });
  await assert.rejects(rejected({}, 'key'), (error) => error instanceof NotificationError && error.retryable === false);
});
