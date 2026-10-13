#!/usr/bin/env node

import { readFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { resolve } from 'node:path';

const EXPECTED_PROJECT = 'advera-c8dd0';
const DEFAULT_SITE = 'nilasyaagrofoods';
const RETAIN_COUNT = 5;

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

function formatBytes(bytes) {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API Hatası [${res.status}]: ${text}`);
  }
  return res.json();
}

async function cleanupSite(siteId, token, execute = false) {
  console.log(`\n==================================================`);
  console.log(`Site İnceleniyor: ${siteId}`);
  console.log(`==================================================`);

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  // 1. Kanalları ve aktif sürümleri tespit et
  const channelsRes = await fetchJson(`https://firebasehosting.googleapis.com/v1beta1/sites/${siteId}/channels`, { headers });
  const channels = channelsRes.channels || [];
  console.log(`Bulunan Kanal Sayısı: ${channels.length}`);

  const activeVersions = new Set();
  for (const ch of channels) {
    const channelId = ch.name.split('/').pop();
    const activeVersion = ch.release?.version?.name;
    if (activeVersion) {
      activeVersions.add(activeVersion);
      console.log(`- Kanal [${channelId}] Aktif Sürüm: ${activeVersion.split('/').pop()}`);
    }

    // Yerleşik release saklama politikasını 5 olarak ayarla
    if (ch.retainedReleaseCount !== RETAIN_COUNT) {
      console.log(`  -> Kanal [${channelId}] için retainedReleaseCount ${RETAIN_COUNT} olarak güncelleniyor...`);
      if (execute) {
        try {
          await fetchJson(`https://firebasehosting.googleapis.com/v1beta1/sites/${siteId}/channels/${channelId}?updateMask=retainedReleaseCount`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ retainedReleaseCount: RETAIN_COUNT }),
          });
          console.log(`  -> Güncellendi: retainedReleaseCount = ${RETAIN_COUNT}`);
        } catch (err) {
          console.warn(`  -> Uyarı: Saklama ayarı güncellenemedi: ${err.message}`);
        }
      }
    } else {
      console.log(`  -> Kanal [${channelId}] retainedReleaseCount zaten ${RETAIN_COUNT}.`);
    }
  }

  // 2. Release'leri çek ve tarihe göre sırala
  const releasesRes = await fetchJson(`https://firebasehosting.googleapis.com/v1beta1/sites/${siteId}/releases?pageSize=100`, { headers });
  const releases = (releasesRes.releases || []).sort((a, b) => new Date(b.releaseTime).getTime() - new Date(a.releaseTime).getTime());
  console.log(`Toplam Release Sayısı: ${releases.length}`);

  // En yeni 5 release'i koru
  const retainedVersions = new Map();
  releases.forEach((r, idx) => {
    const vName = r.version?.name;
    if (!vName) return;

    if (idx < RETAIN_COUNT) {
      retainedVersions.set(vName, {
        reason: `En yeni 5 release arasında (#${idx + 1})`,
        releaseTime: r.releaseTime,
        fileCount: r.version?.fileCount,
        bytes: r.version?.versionBytes,
      });
    } else if (activeVersions.has(vName)) {
      retainedVersions.set(vName, {
        reason: `Bir kanalda aktif olarak yayında`,
        releaseTime: r.releaseTime,
        fileCount: r.version?.fileCount,
        bytes: r.version?.versionBytes,
      });
    }
  });

  // 3. Tüm version kayıtlarını çek
  const versionsRes = await fetchJson(`https://firebasehosting.googleapis.com/v1beta1/sites/${siteId}/versions?pageSize=100`, { headers });
  const allVersions = versionsRes.versions || [];
  console.log(`Toplam Hosting Version Kaydı: ${allVersions.length}`);

  const toDelete = [];
  const toKeep = [];

  for (const v of allVersions) {
    if (v.status === 'DELETED') continue; // Zaten silinmiş
    const vName = v.name;
    if (retainedVersions.has(vName) || activeVersions.has(vName)) {
      toKeep.push({
        name: vName,
        reason: retainedVersions.get(vName)?.reason || 'Aktif kanal sürümü',
        createTime: v.createTime,
        fileCount: v.fileCount,
        bytes: Number(v.versionBytes) || 0,
      });
    } else {
      toDelete.push({
        name: vName,
        createTime: v.createTime,
        fileCount: v.fileCount,
        bytes: Number(v.versionBytes) || 0,
      });
    }
  }

  console.log(`\n--- KORUNACAK SÜRÜMLER (${toKeep.length} adet) ---`);
  toKeep.forEach((k) => {
    console.log(`[KORU] ${k.name.split('/').pop()} | Oluşturulma: ${k.createTime} | Dosya: ${k.fileCount} | Boyut: ${formatBytes(k.bytes)} | Neden: ${k.reason}`);
  });

  console.log(`\n--- SİLİNECEK ESKİ SÜRÜMLER (${toDelete.length} adet) ---`);
  let totalDeleteBytes = 0;
  toDelete.forEach((d) => {
    totalDeleteBytes += d.bytes;
    console.log(`[SİL]  ${d.name.split('/').pop()} | Oluşturulma: ${d.createTime} | Dosya: ${d.fileCount} | Boyut: ${formatBytes(d.bytes)}`);
  });
  console.log(`Tahmini Boşaltılacak Boyut: ${formatBytes(totalDeleteBytes)}`);

  if (!execute) {
    console.log(`\n[DRY RUN]: Silme işlemi gerçekleştirilmedi. Gerçekten silmek için --execute bayrağını ekleyin.`);
    return { toKeep, toDelete, totalDeleteBytes, deletedCount: 0 };
  }

  // 4. Silme işlemini desteklenen Firebase Hosting REST API yöntemiyle gerçekleştir
  console.log(`\nSilme işlemi başlatılıyor...`);
  let deletedCount = 0;
  let failedCount = 0;
  const errors = [];

  for (const item of toDelete) {
    try {
      const deleteUrl = `https://firebasehosting.googleapis.com/v1beta1/${item.name}`;
      const res = await fetch(deleteUrl, { method: 'DELETE', headers });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`[${res.status}] ${errText}`);
      }
      deletedCount += 1;
      console.log(`✓ Başarıyla silindi: ${item.name.split('/').pop()}`);
    } catch (err) {
      failedCount += 1;
      errors.push({ name: item.name, error: err.message });
      console.error(`✗ Silinemedi (${item.name.split('/').pop()}): ${err.message}`);
    }
  }

  // 5. Canlı sitenin çalıştığını doğrula
  console.log(`\nCanlı site kontrol ediliyor...`);
  try {
    const liveCheck = await fetch(`https://${siteId}.web.app/api/health`, {
      headers: { 'X-Nilasya-Request': '1' }
    });
    console.log(`- Health Check Yanıt Kodu: ${liveCheck.status} (${liveCheck.ok ? 'BAŞARILI' : 'UYARI'})`);
  } catch (err) {
    console.warn(`- Canlı kontrol uyarısı: ${err.message}`);
  }

  return {
    toKeep,
    toDelete,
    totalDeleteBytes,
    deletedCount,
    failedCount,
    errors,
  };
}

async function main() {
  const args = process.argv.slice(2);
  const isExecute = args.includes('--execute') || args.includes('--force');
  const targetSite = args.find((a) => !a.startsWith('--')) || DEFAULT_SITE;

  console.log(`Firebase Projesi: ${EXPECTED_PROJECT}`);
  console.log(`Hedef Hosting Sitesi: ${targetSite}`);
  console.log(`Mod: ${isExecute ? 'GERÇEK UYGULAMA (SİLME ETKİN)' : 'ÖNİZLEME (DRY RUN)'}`);

  const token = getFirebaseToken();
  const result = await cleanupSite(targetSite, token, isExecute);

  console.log(`\n==================================================`);
  console.log(`TEMİZLİK SONUCU RAPORU`);
  console.log(`==================================================`);
  console.log(`- Korunan Sürüm Sayısı: ${result.toKeep.length}`);
  console.log(`- Silinen Eski Sürüm Sayısı: ${result.deletedCount}`);
  if (result.failedCount > 0) {
    console.log(`- Başarısız Silme: ${result.failedCount}`);
  }
  console.log(`- Boşaltılan Hosting Veri Boyutu: ${formatBytes(result.totalDeleteBytes)}`);
  console.log(`\nNOT: Firebase Console depolama göstergelerinin güncellenmesi CDN ve depolama sayacı önbellekleri nedeniyle birkaç saat sürebilir.`);
}

main().catch((err) => {
  console.error('Kritik Hata:', err.message);
  process.exit(1);
});
