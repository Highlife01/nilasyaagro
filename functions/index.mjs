import { readFileSync } from 'node:fs';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';
import { onRequest } from 'firebase-functions/v2/https';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { defineString, defineSecret } from 'firebase-functions/params';
import { logger } from 'firebase-functions';
import { createApiHandler } from './api.mjs';
import { HttpError } from './validation.mjs';
import { createFirestoreStore } from './store.mjs';
import { createNotificationWorker, createResendTransport, NotificationError } from './notifications.mjs';

let _app;
function getApp() {
  if (!_app) _app = initializeApp();
  return _app;
}
function getAuthService() {
  return getAuth(getApp());
}

const databaseId = defineString('NILASYA_DATABASE_ID', { default: 'nilasyaagrofoods' });
const webApiKey = defineString('NILASYA_WEB_API_KEY', { default: 'AIzaSyAEa7XLZ7A0U42Hv622WChtHZfJqwLzbuo', description: 'The Firebase project web API key used for email/password authentication.' });
const resendApiKey = defineSecret('NILASYA_RESEND_API_KEY');
const mailFrom = defineString('NILASYA_MAIL_FROM', { default: '', description: 'Verified sender email address in the Resend account.' });
const teamEmail = defineString('NILASYA_TEAM_EMAIL', { default: '', description: 'Approved export desk mailbox for inquiry notifications.' });
const extraOrigins = defineString('NILASYA_EXTRA_ALLOWED_ORIGINS', { default: '', description: 'Comma-separated exact HTTPS origins for approved staging sites.' });
const catalog = JSON.parse(readFileSync(new URL('./catalog.json', import.meta.url), 'utf8'));
const origins = ['https://www.nilasyaagrofoods.com.tr', 'https://nilasyaagrofoods.com.tr', 'https://nilasyaagrofoods.web.app', 'https://nilasyaagrofoods.firebaseapp.com'];

function createServices() {
  const db = getFirestore(getApp(), databaseId.value());
  const store = createFirestoreStore(db, { Timestamp, FieldValue });
  const emulator = process.env.FUNCTIONS_EMULATOR === 'true';
  const transport = createResendTransport({ apiKey: () => resendApiKey.value() });
  const notify = createNotificationWorker({
    store,
    async sendMail(message, key) {
      if (emulator && process.env.NILASYA_ENABLE_EMULATOR_EMAIL !== 'true') throw new NotificationError('emulator_email_disabled');
      return transport(message, key);
    },
    mailConfig: () => ({ from: mailFrom.value(), teamEmail: teamEmail.value() }),
    logError(error) { logger.error('Nilasya inquiry notification failed', { code: error.code, inquiryId: error.inquiryId }); },
  });
  return { store, notify, emulator };
}

export const nilasyaApi = onRequest({ region: 'europe-west1', maxInstances: 3, timeoutSeconds: 30, memory: '256MiB', invoker: 'public', secrets: [resendApiKey] }, async (req, res) => {
  const { store, notify, emulator } = createServices();
  const stagingOrigins = extraOrigins.value().split(',').map((value) => value.trim()).filter((value) => /^https:\/\/[a-z\d.-]+(?::\d+)?$/iu.test(value));
  const handler = createApiHandler({
    auth: getAuthService(), store, catalog, emulator, notify,
    allowedOrigins: emulator ? [...origins, ...stagingOrigins, 'http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5000', 'http://127.0.0.1:5000'] : [...origins, ...stagingOrigins],
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

export const nilasyaNotificationRetry = onSchedule({ schedule: 'every 5 minutes', region: 'europe-west1', maxInstances: 1, timeoutSeconds: 540, memory: '256MiB', secrets: [resendApiKey] }, async () => {
  const { store, notify } = createServices();
  const ids = await store.dueNotifications(Date.now());
  for (const id of ids) {
    try { await notify(id); }
    catch (error) { logger.error('Nilasya notification retry failed', { code: error.code || 'internal', inquiryId: id }); }
  }
});
