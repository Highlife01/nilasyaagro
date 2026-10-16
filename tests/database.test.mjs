import assert from 'node:assert/strict';
import test from 'node:test';
import { getNilasyaFirestore, NILASYA_DATABASE_ID, NILASYA_PROJECT_ID } from '../functions/database.mjs';

const app = { options: { projectId: NILASYA_PROJECT_ID } };

test('Firestore opens only the Nilasya named database in the expected project', () => {
  const database = {};
  let calls = 0;
  const result = getNilasyaFirestore({
    app, databaseId: NILASYA_DATABASE_ID,
    env: {},
    getFirestore(targetApp, targetDatabase) {
      calls++;
      assert.equal(targetApp, app);
      assert.equal(targetDatabase, NILASYA_DATABASE_ID);
      return database;
    },
  });
  assert.equal(calls, 1);
  assert.equal(result, database);
});

test('invalid database IDs never invoke the Firestore SDK or its default fallback', () => {
  for (const databaseId of [undefined, null, '', ' ', '(default)', 'other-database', 'nilasyaagrofoods ']) {
    assert.throws(() => getNilasyaFirestore({
      app, databaseId, env: {},
      getFirestore() { assert.fail('Invalid database must never reach the SDK.'); },
    }), /database must be nilasyaagrofoods/u);
  }
});

test('a runtime project is accepted only when the app project is not configured', () => {
  for (const key of ['GCLOUD_PROJECT', 'GOOGLE_CLOUD_PROJECT']) {
    const runtimeApp = { options: {} };
    let calls = 0;
    getNilasyaFirestore({
      app: runtimeApp, databaseId: NILASYA_DATABASE_ID, env: { [key]: NILASYA_PROJECT_ID },
      getFirestore(targetApp, databaseId) {
        calls++;
        assert.equal(targetApp, runtimeApp);
        assert.equal(databaseId, NILASYA_DATABASE_ID);
      },
    });
    assert.equal(calls, 1);
  }
});

test('missing or conflicting app projects never invoke the Firestore SDK', () => {
  for (const projectId of [undefined, null, '', 'another-project']) {
    assert.throws(() => getNilasyaFirestore({
      app: { options: { projectId } }, databaseId: NILASYA_DATABASE_ID,
      env: projectId === undefined ? {} : { GCLOUD_PROJECT: NILASYA_PROJECT_ID },
      getFirestore() { assert.fail('Invalid app project must never reach the SDK.'); },
    }), /app projectId must be advera-c8dd0/u);
  }
});

test('conflicting runtime projects never invoke Firestore even with a valid app', () => {
  for (const key of ['GCLOUD_PROJECT', 'GOOGLE_CLOUD_PROJECT']) {
    for (const value of ['', 'another-project']) {
      assert.throws(() => getNilasyaFirestore({
        app, databaseId: NILASYA_DATABASE_ID,
        env: { GCLOUD_PROJECT: NILASYA_PROJECT_ID, GOOGLE_CLOUD_PROJECT: NILASYA_PROJECT_ID, [key]: value },
        getFirestore() { assert.fail('Conflicting runtime project must never reach the SDK.'); },
      }), new RegExp(key));
    }
  }
});

test('an absent Firebase app never invokes a default app through the SDK', () => {
  for (const invalidApp of [undefined, null, {}, { options: null }]) {
    assert.throws(() => getNilasyaFirestore({
      app: invalidApp, databaseId: NILASYA_DATABASE_ID, env: { GCLOUD_PROJECT: NILASYA_PROJECT_ID },
      getFirestore() { assert.fail('A missing Firebase app must never reach the SDK.'); },
    }), /configured Firebase app is required/u);
  }
});
