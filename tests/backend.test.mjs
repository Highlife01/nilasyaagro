import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { createApiHandler, parseUserAgent, referenceFor, resolveClientLocation } from '../functions/api.mjs';
import { createNotificationWorker, createResendTransport, NotificationError } from '../functions/notifications.mjs';
import { createFirestoreStore, notificationPolicy } from '../functions/store.mjs';
import { HttpError, requestedDeliveryDate, validateAnalyticsPayload, validateContainer, validateContainerUpdates, validateInquiry, validateStock } from '../functions/validation.mjs';

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
  const apexOrigin = 'https://nilasyaagrofoods.com.tr';
  const store = { async set() { writes++; }, async audit() {} };
  const blockedOrigin = await requestApi({ store, allowedOrigins: [origin, apexOrigin] }, { headers: { origin: 'https://other.example.com' } });
  assert.equal(blockedOrigin.statusCode, 403);
  const revokedRole = await requestApi({ store, auth: { async verifySessionCookie() { return claims; }, async getUser() { return { customClaims: {} }; } } });
  assert.equal(revokedRole.statusCode, 403);
  const salesRep = await requestApi({ store, auth: { async verifySessionCookie() { return claims; }, async getUser() { return { customClaims: { nilasyaRole: 'SALES_REP' } }; } } });
  assert.equal(salesRep.statusCode, 403);
  assert.equal(writes, 0);
  const allowedWww = await requestApi({ store, allowedOrigins: [origin, apexOrigin] }, { headers: { origin } });
  assert.equal(allowedWww.statusCode, 200);
  const allowedApex = await requestApi({ store, allowedOrigins: [origin, apexOrigin] }, { headers: { origin: apexOrigin } });
  assert.equal(allowedApex.statusCode, 200);
  assert.equal(writes, 2);
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

test('container validation and API routes handle real container CRUD', async () => {
  const sampleContainer = {
    containerNo: 'MSCU-123456-7',
    bookingRef: 'BKG-TR-2026-001',
    carrier: 'MSC',
    produce: 'Koçbaşı Nohut',
    tonnage: 24,
    originPort: 'Mersin International Port (MIP)',
    destinationPort: 'Hamburg Port',
    destinationCountry: 'Germany',
    incoterm: 'CIF',
    status: 'in_transit',
    departureDate: '2026-10-10',
    eta: '2026-10-25',
    vesselName: 'MSC Gülsün',
  };
  const validated = validateContainer(sampleContainer);
  assert.equal(validated.containerNo, 'MSCU-123456-7');
  assert.equal(validated.status, 'in_transit');
  assert.throws(() => validateContainer({ ...sampleContainer, containerNo: '' }), badRequest);
  assert.throws(() => validateContainer({ ...sampleContainer, status: 'invalid-status' }), badRequest);

  const updates = validateContainerUpdates({ status: 'delivered', eta: '2026-10-26' });
  assert.equal(updates.status, 'delivered');
  assert.equal(updates.eta, '2026-10-26');

  // Test API POST container
  let createdRecord;
  const store = {
    async create(collection, id, data) { createdRecord = { collection, id, data }; },
    async update(collection, id, data) { createdRecord = { action: 'update', collection, id, data }; },
    async remove(collection, id) { createdRecord = { action: 'delete', collection, id }; },
    async audit() {},
  };
  const postRes = await requestApi({ store }, { path: '/api/admin/containers', method: 'POST', body: sampleContainer });
  assert.equal(postRes.statusCode, 201);
  assert.equal(createdRecord.collection, 'containers');
  assert.equal(createdRecord.data.containerNo, 'MSCU-123456-7');

  const patchRes = await requestApi({ store }, { path: '/api/admin/containers/cnt-1', method: 'PATCH', body: { status: 'delivered' } });
  assert.equal(patchRes.statusCode, 200);
  assert.equal(createdRecord.action, 'update');
  assert.equal(createdRecord.data.status, 'delivered');

  const deleteRes = await requestApi({ store }, { path: '/api/admin/containers/cnt-1', method: 'DELETE', body: {} });
  assert.equal(deleteRes.statusCode, 200);
  assert.equal(createdRecord.action, 'delete');
});

test('user agent parser correctly identifies devices, enforces iPhone model rule, and classifies bots', () => {
  // 1. iPhone: Model MUST strictly be 'Model belirlenemedi', never guessed
  const iphoneUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1';
  const iphoneParsed = parseUserAgent(iphoneUA);
  assert.equal(iphoneParsed.deviceType, 'mobile');
  assert.equal(iphoneParsed.deviceBrand, 'Apple');
  assert.equal(iphoneParsed.deviceModel, 'Model belirlenemedi');
  assert.equal(iphoneParsed.os, 'iOS 18.1');
  assert.equal(iphoneParsed.browser, 'Safari 18.1');
  assert.equal(iphoneParsed.isBot, false);

  // 2. Android: Extract model from UA
  const androidUA = 'Mozilla/5.0 (Linux; Android 14; SM-S918B Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.230 Mobile Safari/537.36';
  const androidParsed = parseUserAgent(androidUA);
  assert.equal(androidParsed.deviceType, 'mobile');
  assert.equal(androidParsed.deviceBrand, 'Samsung');
  assert.equal(androidParsed.deviceModel, 'SM-S918B');
  assert.equal(androidParsed.os, 'Android 14');
  assert.equal(androidParsed.browser, 'Chrome 120');
  assert.equal(androidParsed.isBot, false);

  // 3. Desktop Windows:
  const windowsUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36';
  const windowsParsed = parseUserAgent(windowsUA);
  assert.equal(windowsParsed.deviceType, 'desktop');
  assert.equal(windowsParsed.os, 'Windows 10/11');
  assert.equal(windowsParsed.browser, 'Chrome 133');
  assert.equal(windowsParsed.isBot, false);

  // 4. Search Engine Bot:
  const botUA = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
  const botParsed = parseUserAgent(botUA);
  assert.equal(botParsed.isBot, true);
  assert.equal(botParsed.botName, 'Googlebot');
});

test('analytics validation cleanses sensitive query parameters and enforces structure', () => {
  const payload = {
    sessionId: 'sess-123456',
    visitorId: 'vis-abcdef',
    path: '/tr/quote?token=secret123&product=chickpeas&password=mypassword',
    referrer: 'https://google.com',
    title: 'Nilasya Quote',
    screen: '1920x1080',
    language: 'tr-TR',
    timezone: 'Europe/Istanbul',
    utm: { source: 'google', campaign: 'export2026' },
  };
  const validated = validateAnalyticsPayload(payload);
  assert.equal(validated.sessionId, 'sess-123456');
  assert.equal(validated.visitorId, 'vis-abcdef');
  // Sensitive params stripped
  assert.ok(!validated.path.includes('secret123'));
  assert.ok(!validated.path.includes('mypassword'));
  assert.ok(validated.path.includes('product=chickpeas'));
});

test('public analytics endpoint collects visitor beacons and admin endpoint returns analytics', async () => {
  let savedSession;
  let loggedAuth;
  const store = {
    async rateLimit() {},
    async recordVisitorSession(data) { savedSession = data; return { sessionId: data.sessionId }; },
    async getVisitorAnalytics() {
      return {
        summary: { totalSessions: 1, totalPageviews: 2, uniqueVisitors: 1, activeVisitors: 1, activeWindowMinutes: 5, conversionCount: 0, conversionRate: 0, breakdowns: { countries: [], devices: [], os: [], browsers: [], sources: [], topPages: [], daily: [] } },
        sessions: { items: [savedSession], total: 1, page: 1, limit: 25, totalPages: 1 },
      };
    },
    async recordAuthLog(data) { loggedAuth = data; return data; },
    async listAuthLogs() {
      return { items: [loggedAuth], total: 1, page: 1, limit: 25, totalPages: 1 };
    },
    async list() { return []; },
  };

  const handler = createApiHandler({
    auth: { async verifySessionCookie() { return claims; }, async getUser() { return { customClaims: { nilasyaRole: 'EXPORT_MANAGER' } }; } },
    store,
    catalog,
    allowedOrigins: [origin],
  });

  // 1. Send public beacon
  const beaconRes = await handler(
    {
      method: 'POST',
      path: '/api/analytics/collect',
      headers: { 'x-nilasya-request': '1', origin, 'content-type': 'application/json', 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      body: { sessionId: 's-999', path: '/tr/products/kirmizi-mercimek' },
    },
    {
      set() {},
      status(code) { return { json(data) { return { statusCode: code, body: data }; } }; },
    }
  );
  assert.equal(beaconRes.statusCode, 200);
  assert.equal(savedSession.sessionId, 's-999');
  assert.equal(savedSession.path, '/tr/products/kirmizi-mercimek');
  assert.equal(savedSession.os, 'Windows 10/11');

  // 2. Fetch admin analytics summary
  const adminRes = await handler(
    {
      method: 'GET',
      path: '/api/admin/analytics/data',
      headers: { 'x-nilasya-request': '1', cookie: '__session=valid' },
    },
    {
      set() {},
      status(code) { return { json(data) { return { statusCode: code, body: data }; } }; },
    }
  );
  assert.equal(adminRes.statusCode, 200);
  assert.equal(adminRes.body.summary.totalSessions, 1);
});


