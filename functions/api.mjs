import { createHash, randomUUID } from 'node:crypto';
import { HttpError, roles, text, validateAnalyticsPayload, validateContainer, validateContainerUpdates, validateInquiry, validateRequestId, validateRfqUpdates, validateStock } from './validation.mjs';

const cookieName = '__session';
const resourceName = { rfqs: 'inquiries', stocks: 'stocks', containers: 'containers', audit: 'audit' };

export function parseUserAgent(uaString = '', clientHints = {}) {
  const botRegex = /(Googlebot|bingbot|Baiduspider|YandexBot|DuckDuckBot|Slurp|facebookexternalhit|Twitterbot|LinkedInBot|AhrefsBot|SemrushBot|DotBot|MJ12bot|Applebot|crawling|spider|bot|curl|wget|python|Postman|HeadlessChrome)/i;
  const isBot = botRegex.test(uaString);
  let botName = null;
  if (isBot) {
    const match = uaString.match(botRegex);
    botName = match ? match[1] : 'Olası Bot / Crawler';
  }

  let deviceType = 'desktop';
  if (/iPad|Tablet|(Android(?!.*Mobile))/i.test(uaString)) {
    deviceType = 'tablet';
  } else if (/iPhone|iPod|Android.*Mobile|Mobile|BlackBerry|IEMobile|Opera Mini/i.test(uaString)) {
    deviceType = 'mobile';
  }

  let deviceBrand = 'Bilinmiyor';
  let deviceModel = 'Model belirlenemedi';

  if (clientHints?.model && typeof clientHints.model === 'string' && clientHints.model.trim()) {
    deviceModel = clientHints.model.trim();
  }

  if (/iPhone|iPad|iPod/i.test(uaString)) {
    deviceBrand = 'Apple';
    // STRICT RULE: "Tarayıcıdan kesin telefon modeli alınamıyorsa 'Model belirlenemedi' yaz. Özellikle iPhone modellerini ekran boyutundan tahmin ederek kesin bilgi gibi gösterme."
    deviceModel = 'Model belirlenemedi';
  } else if (/Android/i.test(uaString)) {
    const modelMatch = uaString.match(/;\s*([A-Za-z0-9\s_-]+)\s+Build\//);
    if (modelMatch && modelMatch[1]) {
      const rawModel = modelMatch[1].trim();
      deviceModel = rawModel;
      if (/^SM-|^GT-|^SCH-/i.test(rawModel)) deviceBrand = 'Samsung';
      else if (/Pixel/i.test(rawModel)) deviceBrand = 'Google';
      else if (/Redmi|MI\s|POCO/i.test(rawModel)) deviceBrand = 'Xiaomi';
      else if (/Huawei|HONOR/i.test(rawModel)) deviceBrand = 'Huawei';
      else if (/OnePlus/i.test(rawModel)) deviceBrand = 'OnePlus';
      else deviceBrand = 'Android Cihazı';
    } else {
      deviceBrand = 'Android Cihazı';
      if (deviceModel === 'Model belirlenemedi') deviceModel = 'Model belirlenemedi';
    }
  } else if (/Macintosh/i.test(uaString)) {
    deviceBrand = 'Apple';
    deviceModel = 'Mac (Model belirlenemedi)';
  } else if (/Windows/i.test(uaString)) {
    deviceBrand = 'PC / Windows';
    deviceModel = 'Model belirlenemedi';
  }

  let os = 'Bilinmiyor';
  if (/Windows NT 10.0/i.test(uaString)) os = 'Windows 10/11';
  else if (/Windows NT 6.3/i.test(uaString)) os = 'Windows 8.1';
  else if (/Windows NT 6.1/i.test(uaString)) os = 'Windows 7';
  else if (/Mac OS X (\d+[._]\d+)/i.test(uaString)) {
    const v = uaString.match(/Mac OS X (\d+[._]\d+)/);
    os = `macOS ${v ? v[1].replace('_', '.') : ''}`.trim();
  } else if (/iPhone OS (\d+[._]\d+)/i.test(uaString)) {
    const v = uaString.match(/iPhone OS (\d+[._]\d+)/);
    os = `iOS ${v ? v[1].replace('_', '.') : ''}`.trim();
  } else if (/Android (\d+(\.\d+)?)/i.test(uaString)) {
    const v = uaString.match(/Android (\d+(\.\d+)?)/);
    os = `Android ${v ? v[1] : ''}`.trim();
  } else if (/Linux/i.test(uaString)) {
    os = 'Linux';
  }

  let browser = 'Bilinmiyor';
  if (/Edg\/(\d+)/i.test(uaString)) {
    const v = uaString.match(/Edg\/(\d+)/);
    browser = `Edge ${v ? v[1] : ''}`.trim();
  } else if (/OPR\/(\d+)/i.test(uaString)) {
    const v = uaString.match(/OPR\/(\d+)/);
    browser = `Opera ${v ? v[1] : ''}`.trim();
  } else if (/SamsungBrowser\/(\d+)/i.test(uaString)) {
    const v = uaString.match(/SamsungBrowser\/(\d+)/);
    browser = `Samsung Browser ${v ? v[1] : ''}`.trim();
  } else if (/Chrome\/(\d+)/i.test(uaString)) {
    const v = uaString.match(/Chrome\/(\d+)/);
    browser = `Chrome ${v ? v[1] : ''}`.trim();
  } else if (/Firefox\/(\d+)/i.test(uaString)) {
    const v = uaString.match(/Firefox\/(\d+)/);
    browser = `Firefox ${v ? v[1] : ''}`.trim();
  } else if (/Version\/(\d+(\.\d+)?).*Safari/i.test(uaString)) {
    const v = uaString.match(/Version\/(\d+(\.\d+)?)/);
    browser = `Safari ${v ? v[1] : ''}`.trim();
  }

  return { isBot, botName, deviceType, deviceBrand, deviceModel, os, browser };
}

const ipGeoCache = new Map();

export async function resolveClientLocation(req) {
  const rawIp = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.headers['fastly-client-ip'] || req.ip || '';
  const cleanIp = rawIp.replace(/^::ffff:/, '');

  if (!cleanIp || cleanIp === '127.0.0.1' || cleanIp === '::1' || cleanIp.startsWith('10.') || cleanIp.startsWith('192.168.') || cleanIp.startsWith('172.16.')) {
    return { country: 'Yerel Ağ / Test', city: 'Localhost', region: 'Yerel', isVpnOrProxy: false, isTest: true };
  }

  const headerCountry = req.headers['x-appengine-country'] || req.headers['cf-ipcountry'] || req.headers['x-country-code'];
  const headerCity = req.headers['x-appengine-city'];
  const headerRegion = req.headers['x-appengine-region'];

  if (ipGeoCache.has(cleanIp)) {
    return ipGeoCache.get(cleanIp);
  }

  if (headerCountry && headerCountry !== 'ZZ') {
    const loc = {
      country: headerCountry,
      city: headerCity || 'Bilinmiyor',
      region: headerRegion || 'Bilinmiyor',
      isVpnOrProxy: false,
      isTest: false,
    };
    ipGeoCache.set(cleanIp, loc);
    return loc;
  }

  try {
    const res = await fetch(`http://ip-api.com/json/${cleanIp}?fields=status,country,regionName,city,proxy,hosting`, {
      signal: AbortSignal.timeout(1500),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.status === 'success') {
        const loc = {
          country: data.country || 'Bilinmiyor',
          city: data.city || 'Bilinmiyor',
          region: data.regionName || 'Bilinmiyor',
          isVpnOrProxy: Boolean(data.proxy || data.hosting),
          isTest: false,
        };
        if (ipGeoCache.size > 2000) ipGeoCache.clear();
        ipGeoCache.set(cleanIp, loc);
        return loc;
      }
    }
  } catch {
    // Non-blocking fallback
  }

  const fallback = { country: 'Bilinmiyor', city: 'Bilinmiyor', region: 'Bilinmiyor', isVpnOrProxy: false, isTest: false };
  ipGeoCache.set(cleanIp, fallback);
  return fallback;
}

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

      // Public Analytics Collection (Consent-aware client beacon)
      if (path === '/api/analytics/collect' && method === 'POST') {
        await store.rateLimit('analytics', req.ip, 120, 60 * 1000);
        const payload = validateAnalyticsPayload(req.body);
        const ua = parseUserAgent(req.headers['user-agent'] || '', payload.clientHints);
        const loc = await resolveClientLocation(req);
        const sessionRecord = await store.recordVisitorSession({
          ...payload,
          ...ua,
          ...loc,
          lastActivityAt: now(),
        });
        return res.status(200).json({ ok: true, sessionId: sessionRecord.sessionId });
      }

      if (path === '/api/inquiries' && method === 'POST') {
        const timestamp = now();
        const inquiry = validateInquiry(req.body, catalog, { now: timestamp });
        const requestId = validateRequestId(req.body.requestId);
        await store.rateLimit('inquiry', req.ip, 5, 60 * 60 * 1000);
        const id = randomUUID();
        const saved = await store.saveInquiry({
          id,
          requestKey: createHash('sha256').update(requestId || id).digest('hex'),
          fingerprint: createHash('sha256').update(JSON.stringify(inquiry)).digest('hex'),
          inquiry: { ...inquiry, referenceCode: referenceFor(inquiry.kind, id, timestamp), createdAt: new Date(timestamp).toISOString(), status: 'new', estimatedValueUSD: 0, adminNotes: '' },
          timestamp,
        });

        // Link conversion to visitor session if session ID is provided
        const activeSessionId = req.headers['x-nilasya-session-id'] || req.body.sessionId;
        if (activeSessionId && typeof store.markSessionConverted === 'function') {
          await store.markSessionConverted(String(activeSessionId), { kind: inquiry.kind, referenceCode: saved.referenceCode }).catch(() => null);
        }

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
        const ua = parseUserAgent(req.headers['user-agent'] || '');
        const loc = await resolveClientLocation(req);

        if (typeof password !== 'string' || !password || password.length > 256) {
          if (typeof store.recordAuthLog === 'function') {
            await store.recordAuthLog({ email, status: 'FAILED', reason: 'Şifre alanı boş veya geçersiz', ...loc, ...ua }).catch(() => null);
          }
          throw new HttpError(400, 'Password is required.');
        }

        try {
          const idToken = await signIn(email, password);
          const claims = await auth.verifyIdToken(idToken, true);
          if (now() / 1000 - claims.auth_time > 300) throw new HttpError(401, 'Please sign in again.');
          const account = await auth.getUser(claims.uid);
          const user = adminProfile({ ...claims, nilasyaRole: account.customClaims?.nilasyaRole });
          const expiresIn = (req.body.rememberMe === true ? 5 : 1) * 24 * 60 * 60 * 1000;
          const cookie = await auth.createSessionCookie(idToken, { expiresIn });
          res.cookie(cookieName, cookie, { maxAge: expiresIn, httpOnly: true, secure: !emulator, sameSite: 'strict', path: '/api' });
          await store.audit(claims, 'Oturum açıldı', 'Yönetici kimliği doğrulandı.');
          if (typeof store.recordAuthLog === 'function') {
            await store.recordAuthLog({ email, status: 'SUCCESS', reason: 'Oturum açıldı', ...loc, ...ua }).catch(() => null);
          }
          return res.status(200).json({ user });
        } catch (authError) {
          if (typeof store.recordAuthLog === 'function') {
            await store.recordAuthLog({
              email,
              status: 'FAILED',
              reason: authError instanceof HttpError ? authError.message : 'Kimlik doğrulama başarısız',
              ...loc,
              ...ua,
            }).catch(() => null);
          }
          throw authError;
        }
      }

      if (path === '/api/admin/logout' && method === 'POST') {
        res.clearCookie(cookieName, { httpOnly: true, secure: !emulator, sameSite: 'strict', path: '/api' });
        return res.status(200).json({ ok: true });
      }

      const claims = await session(req);
      const user = adminProfile(claims);
      if (path === '/api/admin/session' && method === 'GET') return res.status(200).json({ user });

      // Admin Analytics Endpoints
      if (path === '/api/admin/analytics/data' && method === 'GET') {
        const data = await store.getVisitorAnalytics(req.query || {});
        return res.status(200).json(data);
      }
      if (path.startsWith('/api/admin/analytics/sessions/') && method === 'GET') {
        const id = path.slice('/api/admin/analytics/sessions/'.length);
        const sessionDetail = await store.getVisitorSession(id);
        return res.status(200).json({ session: sessionDetail });
      }
      if (path === '/api/admin/analytics/auth-logs' && method === 'GET') {
        const logs = await store.listAuthLogs(req.query || {});
        return res.status(200).json(logs);
      }
      if (path === '/api/admin/analytics/cleanup' && method === 'POST') {
        if (user.role === 'SALES_REP') throw new HttpError(403, 'This action requires a manager.');
        const result = await store.cleanupOldAnalytics(Number(req.body?.retentionDays) || 90);
        await store.audit(claims, 'Analitik verileri temizlendi', `Silinen: ${result.deleted}`);
        return res.status(200).json(result);
      }
      if (path === '/api/admin/analytics/export' && method === 'GET') {
        const data = await store.getVisitorAnalytics({ ...(req.query || {}), page: 1, limit: 1000 });
        const sessions = data.sessions?.items || [];
        const rows = [
          ['Tarih_Saat_ISO', 'Zaman_Dilimi', 'Ulke', 'Sehir', 'Bolge', 'VPN_Proxy_Uyarisi', 'Cihaz_Turu', 'Cihaz_Markasi', 'Cihaz_Modeli', 'Isletim_Sistemi', 'Tarayici', 'Ekran_Cozunurlugu', 'Ilk_Sayfa', 'Son_Sayfa', 'Sayfa_Sayisi', 'Sure_Saniye', 'Form_Donusumu', 'Donusum_Turu', 'Referans_Kodu', 'Trafik_Kaynagi', 'UTM_Source', 'UTM_Campaign', 'Bot_Mu', 'Bot_Adi'],
        ];
        sessions.forEach((s) => {
          rows.push([
            new Date(s.startedAt).toISOString(),
            s.timezone || 'UTC',
            s.country || 'Bilinmiyor',
            s.city || 'Bilinmiyor',
            s.region || 'Bilinmiyor',
            s.isVpnOrProxy ? 'Evet (Olası VPN/Proxy)' : 'Hayır',
            s.deviceType || 'desktop',
            s.deviceBrand || 'Bilinmiyor',
            s.deviceModel || 'Model belirlenemedi',
            s.os || 'Bilinmiyor',
            s.browser || 'Bilinmiyor',
            s.screenResolution || 'Bilinmiyor',
            s.entryPage || '/',
            s.exitPage || '/',
            s.pageviewsCount || 1,
            s.durationSeconds || 0,
            s.hasConverted ? 'Evet' : 'Hayır',
            s.conversionKind || '',
            s.conversionReferenceCode || '',
            s.referrer || 'Doğrudan',
            s.utmSource || '',
            s.utmCampaign || '',
            s.isBot ? 'Evet' : 'Hayır',
            s.botName || '',
          ]);
        });
        const csvContent = '\uFEFF' + rows.map((r) => r.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(',')).join('\r\n');
        res.set('Content-Type', 'text/csv; charset=utf-8');
        res.set('Content-Disposition', `attachment; filename="nilasya-visitor-sessions-${new Date(now()).toISOString().slice(0, 10)}.csv"`);
        return res.status(200).send(csvContent);
      }

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
      if (resource === 'containers' && method === 'POST' && !id) {
        if (user.role === 'SALES_REP') throw new HttpError(403, 'This action requires a manager.');
        const container = validateContainer(req.body);
        const recordId = randomUUID();
        await store.create(collection, recordId, { ...container, id: recordId, createdAt: new Date(now()).toISOString() });
        await store.audit(claims, 'Konteyner eklendi', `${recordId}: ${container.containerNo}`);
        return res.status(201).json({ id: recordId });
      }
      if (resource === 'containers' && method === 'PATCH' && id) {
        const updates = validateContainerUpdates(req.body);
        await store.update(collection, id, updates);
        await store.audit(claims, 'Konteyner güncellendi', `${id}: ${Object.keys(updates).join(', ')}`);
        return res.status(200).json({ ok: true });
      }
      if (resource === 'containers' && method === 'DELETE' && id) {
        if (user.role === 'SALES_REP') throw new HttpError(403, 'This action requires a manager.');
        await store.remove(collection, id);
        await store.audit(claims, 'Konteyner silindi', id);
        return res.status(200).json({ ok: true });
      }
      throw new HttpError(405, 'Method not allowed.');
    } catch (error) {
      if (!(error instanceof HttpError)) logError(error);
      return res.status(error instanceof HttpError ? error.status : 503).json({ error: error instanceof HttpError ? error.message : 'Service is temporarily unavailable. Please retry.' });
    }
  };
}

