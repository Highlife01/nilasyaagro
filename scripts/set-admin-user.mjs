#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { resolve } from 'node:path';

const VALID_ROLES = ['ROOT_SUPER_ADMIN', 'EXPORT_MANAGER', 'SALES_REP'];

function getFirebaseToken() {
  const configPath = resolve(homedir(), '.config/configstore/firebase-tools.json');
  if (!existsSync(configPath)) {
    throw new Error('Firebase CLI oturumu bulunamadı. Lütfen "firebase login" komutunu çalıştırın.');
  }
  const config = JSON.parse(readFileSync(configPath, 'utf8'));
  const token = config.tokens?.access_token;
  if (!token) {
    throw new Error('Firebase CLI erişim belirteci bulunamadı.');
  }
  return token;
}

async function setAdminUser({ email, password, displayName, role = 'ROOT_SUPER_ADMIN', projectId = 'advera-c8dd0' }) {
  if (!VALID_ROLES.includes(role)) {
    throw new Error(`Geçersiz rol: ${role}. İzin verilen roller: ${VALID_ROLES.join(', ')}`);
  }
  const token = getFirebaseToken();
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  // 1. Check if user already exists
  const lookupRes = await fetch(`https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:lookup`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email: [email] }),
  });
  const lookupData = await lookupRes.json();
  const existingUser = lookupData.users?.[0];

  let localId;

  if (existingUser) {
    localId = existingUser.localId;
    console.log(`Kullanıcı mevcut (${email}, UID: ${localId}). Güncelleniyor...`);
    const updateBody = {
      localId,
      displayName: displayName || existingUser.displayName,
      customAttributes: JSON.stringify({ nilasyaRole: role }),
    };
    if (password) updateBody.password = password;

    const updateRes = await fetch(`https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:update`, {
      method: 'POST',
      headers,
      body: JSON.stringify(updateBody),
    });
    if (!updateRes.ok) {
      throw new Error(`Kullanıcı güncelleme hatası: ${await updateRes.text()}`);
    }
  } else {
    if (!password) {
      throw new Error('Yeni kullanıcı için şifre zorunludur.');
    }
    console.log(`Yeni kullanıcı oluşturuluyor: ${email}...`);
    const createRes = await fetch(`https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email,
        password,
        displayName: displayName || email.split('@')[0],
        emailVerified: true,
      }),
    });
    const createData = await createRes.json();
    if (!createRes.ok || !createData.localId) {
      throw new Error(`Kullanıcı oluşturma hatası: ${JSON.stringify(createData)}`);
    }
    localId = createData.localId;

    // Set custom role claims
    const claimRes = await fetch(`https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:update`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        localId,
        customAttributes: JSON.stringify({ nilasyaRole: role }),
      }),
    });
    if (!claimRes.ok) {
      throw new Error(`Yetki (claim) tanımlama hatası: ${await claimRes.text()}`);
    }
  }

  console.log(`Başarılı! Kullanıcı "${email}" hazırlandı.`);
  console.log(`- UID: ${localId}`);
  console.log(`- Rol: ${role}`);
  console.log(`- İsim: ${displayName}`);
}

const args = process.argv.slice(2);
const email = args[0] || 'abdullah@nilasyaagrofoods.com.tr';
const password = args[1] || 'nilasya2026';
const displayName = args[2] || 'Abdullah Başaranoğlu';
const role = args[3] || 'ROOT_SUPER_ADMIN';

setAdminUser({ email, password, displayName, role })
  .catch((err) => {
    console.error('Hata:', err.message);
    process.exit(1);
  });
