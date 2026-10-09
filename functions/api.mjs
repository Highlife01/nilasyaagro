import { createHash, randomUUID } from 'node:crypto';
import { HttpError, roles, text, validateInquiry, validateRequestId, validateRfqUpdates, validateStock } from './validation.mjs';

const cookieName = '__session';
const resourceName = { rfqs: 'inquiries', stocks: 'stocks', containers: 'containers', audit: 'audit' };
export function adminProfile(claims) {
  if (!claims || !roles.includes(claims.nilasyaRole)) throw new HttpError(403, 'This account is not authorized for Nilasya.');
  const name = claims.name || claims.email?.split('@')[0] || 'Yönetici';
  return { email: claims.email || '', name, role: claims.nilasyaRole, title: 'Nilasya Agro Foods Yönetici', avatar: name.slice(0, 2).toUpperCase(), lastLoginAt: new Date((claims.auth_time || 0) * 1000).toISOString() };
}

export function referenceFor(kind, id, timestamp) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date(timestamp));
  const date = ['year', 'month', 'day'].map((type) => parts.find((part) => part.type === type).value).join('');
  return `${kind === 'rfq' ? 'RFQ' : 'CONTACT'}-${date}-${id.slice(0, 8).toUpperCase()}`;
}

export function createApiHandler({ auth, store, catalog, signIn, notify, allowedOrigins, emulator = false, now = () => Date.now(), logError = () => {} }) {
  async function session(req) {
    const cookie = (req.headers.cookie || '').split(';').map((part) => part.trim()).find((part) => part.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1);
    if (!cookie) throw new HttpError(401, 'Please sign in again.');
    let claims;
    try { claims = await auth.verifySessionCookie(cookie, true); }
    catch { throw new HttpError(401, 'Please sign in again.'); }
    // Read current permissions as well: removing a role must revoke access immediately.
    const account = await auth.getUser(claims.uid);
    if (account.disabled) throw new HttpError(401, 'Please sign in again.');
    return { ...claims, nilasyaRole: account.customClaims?.nilasyaRole };
  }
  return async (req, res) => {
    res.set('Cache-Control', 'private, no-store, max-age=0');
    res.set('X-Content-Type-Options', 'nosniff');
    try {
      const path = req.path.replace(/\/$/, '') || '/';
      const method = req.method;
      if (method === 'GET' && path === '/api/health') return res.status(200).json({ ok: true });
      if (req.headers['x-nilasya-request'] !== '1') throw new HttpError(403, 'Invalid request.');
      if (!['GET', 'POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) throw new HttpError(405, 'Method not allowed.');
      if (method !== 'GET') {
        if (!allowedOrigins.includes(req.headers.origin)) throw new HttpError(403, 'Request origin is not allowed.');
        if (!/^application\/json(?:;|$)/iu.test(req.headers['content-type'] || '')) throw new HttpError(415, 'JSON is required.');
        if ((req.rawBody?.length || Buffer.byteLength(JSON.stringify(req.body || {}), 'utf8')) > 32000) throw new HttpError(413, 'Request is too large.');
      }
      if (path === '/api/inquiries' && method === 'POST') {
        const timestamp = now();
        const inquiry = validateInquiry(req.body, catalog, { now: timestamp });
        const requestId = validateRequestId(req.body.requestId);
        await store.rateLimit('inquiry', req.ip, 5, 60 * 60 * 1000);
        const id = randomUUID();
        // The record and both notification tasks must be committed together before any send.
        const saved = await store.saveInquiry({
          id,
          requestKey: createHash('sha256').update(requestId || id).digest('hex'),
          fingerprint: createHash('sha256').update(JSON.stringify(inquiry)).digest('hex'),
          inquiry: { ...inquiry, referenceCode: referenceFor(inquiry.kind, id, timestamp), createdAt: new Date(timestamp).toISOString(), status: 'new', estimatedValueUSD: 0, adminNotes: '' },
          timestamp,
        });
        let deliveryStatus = 'pending';
        try { deliveryStatus = (await notify?.(saved.id))?.status || 'pending'; }
        catch (error) { logError(error); }
        if (deliveryStatus !== 'sent') {
          return res.status(503).json({ error: 'Your inquiry was saved, but its notifications could not be sent yet. Keep this reference and retry or contact our export desk.', saved: true, referenceCode: saved.referenceCode, deliveryStatus });
        }
        return res.status(201).json({ referenceCode: saved.referenceCode, deliveryStatus });
      }
      if (path === '/api/admin/login' && method === 'POST') {
        await store.rateLimit('login', req.ip, 10, 15 * 60 * 1000);
        const email = text(req.body?.email, 'Email', { required: true, max: 254 });
        const password = req.body?.password;
        if (typeof password !== 'string' || !password || password.length > 256) throw new HttpError(400, 'Password is required.');
        const idToken = await signIn(email, password);
        const claims = await auth.verifyIdToken(idToken, true);
        if (now() / 1000 - claims.auth_time > 300) throw new HttpError(401, 'Please sign in again.');
        const account = await auth.getUser(claims.uid);
        const user = adminProfile({ ...claims, nilasyaRole: account.customClaims?.nilasyaRole });
        const expiresIn = (req.body.rememberMe === true ? 5 : 1) * 24 * 60 * 60 * 1000;
        const cookie = await auth.createSessionCookie(idToken, { expiresIn });
        res.cookie(cookieName, cookie, { maxAge: expiresIn, httpOnly: true, secure: !emulator, sameSite: 'strict', path: '/api' });
        await store.audit(claims, 'Oturum açıldı', 'Yönetici kimliği doğrulandı.');
        return res.status(200).json({ user });
      }
      if (path === '/api/admin/logout' && method === 'POST') {
        res.clearCookie(cookieName, { httpOnly: true, secure: !emulator, sameSite: 'strict', path: '/api' });
        return res.status(200).json({ ok: true });
      }
      const claims = await session(req);
      const user = adminProfile(claims);
      if (path === '/api/admin/session' && method === 'GET') return res.status(200).json({ user });
      const match = path.match(/^\/api\/admin\/(rfqs|stocks|containers|audit)(?:\/([a-zA-Z0-9_-]+))?$/u);
      if (!match) throw new HttpError(404, 'Not found.');
      const [, resource, id] = match;
      const collection = resourceName[resource];
      if (method === 'GET' && !id) return res.status(200).json({ items: await store.list(collection) });
      if (resource === 'rfqs' && method === 'POST' && !id) {
        const inquiry = validateInquiry({ kind: 'rfq', language: 'tr', data: { ...req.body, consent: true } }, catalog, { now: now(), admin: true });
        const recordId = randomUUID();
        await store.create(collection, recordId, { ...inquiry, referenceCode: referenceFor('rfq', recordId, now()), createdAt: new Date(now()).toISOString(), status: 'new', estimatedValueUSD: 0, adminNotes: '' });
        await store.audit(claims, 'Teklif oluşturuldu', recordId);
        return res.status(201).json({ id: recordId });
      }
      if (resource === 'rfqs' && method === 'PATCH' && id) {
        const updates = validateRfqUpdates(req.body);
        await store.update(collection, id, updates);
        await store.audit(claims, 'Teklif güncellendi', `${id}: ${Object.keys(updates).join(', ')}`);
        return res.status(200).json({ ok: true });
      }
      if (resource === 'rfqs' && method === 'DELETE' && id) {
        if (user.role === 'SALES_REP') throw new HttpError(403, 'This action requires a manager.');
        await store.remove(collection, id);
        await store.audit(claims, 'Teklif silindi', id);
        return res.status(200).json({ ok: true });
      }
      if (resource === 'stocks' && method === 'PUT' && id) {
        if (user.role === 'SALES_REP') throw new HttpError(403, 'This action requires a manager.');
        await store.set(collection, id, validateStock(id, req.body, catalog));
        await store.audit(claims, 'Stok güncellendi', id);
        return res.status(200).json({ ok: true });
      }
      throw new HttpError(405, 'Method not allowed.');
    } catch (error) {
      if (!(error instanceof HttpError)) logError(error);
      return res.status(error instanceof HttpError ? error.status : 503).json({ error: error instanceof HttpError ? error.message : 'Service is temporarily unavailable. Please retry.' });
    }
  };
}
