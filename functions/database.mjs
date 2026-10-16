export const NILASYA_PROJECT_ID = 'advera-c8dd0';
export const NILASYA_DATABASE_ID = 'nilasyaagrofoods';

function assertRuntimeProject(env) {
  for (const key of ['GCLOUD_PROJECT', 'GOOGLE_CLOUD_PROJECT']) {
    if (env[key] !== undefined && env[key] !== NILASYA_PROJECT_ID) {
      throw new Error(`Nilasya Firebase isolation: ${key} must be ${NILASYA_PROJECT_ID}.`);
    }
  }
}

export function getNilasyaFirestore({ app, databaseId, getFirestore, env = process.env }) {
  // An empty ID makes the Admin SDK silently select (default); never pass one through.
  if (databaseId !== NILASYA_DATABASE_ID) {
    throw new Error(`Nilasya Firebase isolation: database must be ${NILASYA_DATABASE_ID}.`);
  }
  assertRuntimeProject(env);
  if (!app?.options || typeof app.options !== 'object') {
    throw new Error('Nilasya Firebase isolation: a configured Firebase app is required.');
  }
  // initializeApp() resolves FIREBASE_CONFIG; the SDK also accepts these runtime project IDs.
  const projectId = app.options.projectId === undefined
    ? env.GOOGLE_CLOUD_PROJECT ?? env.GCLOUD_PROJECT
    : app.options.projectId;
  if (projectId !== NILASYA_PROJECT_ID) {
    throw new Error(`Nilasya Firebase isolation: app projectId must be ${NILASYA_PROJECT_ID}.`);
  }
  return getFirestore(app, NILASYA_DATABASE_ID);
}
