import { readFileSync } from 'node:fs';
import { createHash, randomUUID } from 'node:crypto';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { onRequest } from 'firebase-functions/v2/https';
import { defineString } from 'firebase-functions/params';
import { logger } from 'firebase-functions';
import { createApiHandler } from './api.mjs';
import { HttpError } from './validation.mjs';

const app = initializeApp();
const auth = getAuth(app);
const databaseId = defineString('NILASYA_DATABASE_ID', { default: 'nilasyaagrofoods' });
const webApiKey = defineString('FIREBASE_WEB_API_KEY', { description: 'The Firebase project web API key used for email/password authentication.' });
const catalog = JSON.parse(readFileSync(new URL('./catalog.json', import.meta.url), 'utf8'));
const origins = ['https://www.nilasyaagrofoods.com.tr', 'https://nilasyaagrofoods.com.tr', 'https://nilasyaagrofoods.web.app', 'https://nilasyaagrofoods.firebaseapp.com'];

export const nilasyaApi = onRequest({ region: 'europe-west1', maxInstances: 3, timeoutSeconds: 30, memory: '256MiB', invoker: 'public' }, async (req, res) => {
  const db = getFirestore(app, databaseId.value());
  const emulator = process.env.FUNCTIONS_EMULATOR === 'true';
  const store = {
    async rateLimit(action, address, limit, windowMs) {
      const bucket = Math.floor(Date.now() / windowMs);
      const hash = createHash('sha256').update(`${action}:${address}:${bucket}`).digest('hex');
      const reference = db.collection('rateLimits').doc(hash);
      await db.runTransaction(async (transaction) => {
        const snapshot = await transaction.get(reference);
        const count = snapshot.data()?.count || 0;
        if (count >= limit) throw new HttpError(429, 'Too many requests. Please try again later.');
        transaction.set(reference, { count: count + 1, expiresAt: Timestamp.fromMillis((bucket + 2) * windowMs) });
      });
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
      await db.collection('audit').doc(randomUUID()).create({ action, details, user: claims.email || claims.uid, timestamp: new Date().toISOString(), ip: '' });
    },
  };
  const handler = createApiHandler({
    auth, store, catalog, emulator,
    allowedOrigins: emulator ? [...origins, 'http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5000', 'http://127.0.0.1:5000'] : origins,
    async signIn(email, password) {
      const host = process.env.FIREBASE_AUTH_EMULATOR_HOST;
      const base = host ? `http://${host}/identitytoolkit.googleapis.com` : 'https://identitytoolkit.googleapis.com';
      const response = await fetch(`${base}/v1/accounts:signInWithPassword?key=${webApiKey.value()}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, returnSecureToken: true }), signal: AbortSignal.timeout(10000) });
      const body = await response.json();
      if (!response.ok || !body.idToken) throw new HttpError(401, 'Email or password is incorrect.');
      return body.idToken;
    },
    logError(error) { logger.error('Nilasya API request failed', { code: error.code || 'internal', name: error.name }); },
  });
  await handler(req, res);
});
