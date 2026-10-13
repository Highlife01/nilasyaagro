#!/usr/bin/env node

/**
 * Firebase Hosting Version Cleanup & Retention Automation
 * 
 * Amaç:
 * 1. Proje ve site doğrulamasını kesinleştirir (advera-c8dd0 / nilasyaagrofoods).
 * 2. Kanallardaki yerleşik retainedReleaseCount değerini 5 olarak yapılandırır.
 * 3. En yeni 5 release'i ve yayındaki aktif sürümü korur.
 * 4. Daha eski Hosting version kayıtlarını REST API (DELETE) üzerinden temizler.
 * 5. Yalnızca Hosting sürümlerini siler; Firestore, Storage, Auth veya Functions'a dokunmaz.
 * 6. Canlı sitenin sağlıklı çalıştığını doğrular ve temizlik raporunu üretir.
 */

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

function verifyLocalConfig(expectedProject, targetSite) {
  const firebasercPath = resolve(process.cwd(), '.firebaserc');
  if (!existsSync(firebasercPath)) {
    throw new Error('.firebaserc dosyası bulunamadı. Lütfen proje kök dizininde çalıştırın.');
  }
  const rc = JSON.parse(readFileSync(firebasercPath, 'utf8'));
  const defaultProj = rc.projects?.default;
  if (defaultProj !== expectedProject) {
    throw new Error(`Hedef proje uyuşmazlığı! .firebaserc içinde tanımlı proje: "${defaultProj}", beklenen: "${expectedProject}". Güvenlik nedeniyle işlem iptal edildi.`);
  }

  const targets = rc.targets?.[expectedProject]?.hosting?.[targetSite];
  if (targetSite === DEFAULT_SITE && (!targets || !targets.includes(targetSite))) {
    console.warn(`[UYARI] .firebaserc içinde "${targetSite}" hedefi doğrudan eşleşmeyebilir.`);
  }
  console.log(`✓ Yerel .firebaserc proje doğrulaması başarılı: ${defaultProj}`);
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
  console.log(`Firebase Hosting Sitesi İnceleniyor: ${siteId}`);
  console.log(`==================================================`);

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  // 1. Proje ve Site Doğrulaması (Google API seviyesinde)
  console.log(`1. Proje ve Site Sahipliği Doğrulanıyor...`);
  const siteApiUrl = `https://firebasehosting.googleapis.com/v1beta1/projects/${EXPECTED_PROJECT}/sites/${siteId}`;
  try {
    const siteData = await fetchJson(siteApiUrl, { headers });
    if (!siteData.name || !siteData.name.includes(EXPECTED_PROJECT)) {
      throw new Error(`Site (${siteId}) beklenen projede (${EXPECTED_PROJECT}) bulunamadı!`);
    }
    console.log(`✓ Site doğrulandı: ${siteData.name} (${siteData.defaultUrl || 'URL belirtilmedi'})`);
  } catch (err) {
    throw new Error(`Hedef proje kesinleşemedi veya site bulunamadı: ${err.message}. Silme işlemi güvenlik nedeniyle DURDURULDU.`);
  }

  // 2. Kanalları ve aktif sürümleri tespit et + Yerleşik 5 saklama kuralı
  console.log(`\n2. Hosting Kanalları ve Yerleşik Saklama Politikası Kontrol Ediliyor...`);
  const channelsRes = await fetchJson(`https://firebasehosting.googleapis.com/v1beta1/sites/${siteId}/channels`, { headers });
  const channels = channelsRes.channels || [];
  console.log(`Bulunan Kanal Sayısı: ${channels.length}`);

  const activeVersions = new Set();
  for (const ch of channels) {
    const channelId = ch.name.split('/').pop();
    const activeVersion = ch.release?.version?.name;
    if (activeVersion) {
      activeVersions.add(activeVersion);
      console.log(`- Kanal [${channelId}] Aktif Canlı Sürüm: ${activeVersion.split('/').pop()}`);
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
          console.log(`  -> Başarıyla güncellendi: retainedReleaseCount = ${RETAIN_COUNT}`);
        } catch (err) {
          console.warn(`  -> Uyarı: Saklama ayarı güncellenemedi: ${err.message}`);
        }
      } else {
        console.log(`  -> [DRY RUN] retainedReleaseCount = ${RETAIN_COUNT} olarak güncellenecek.`);
      }
    } else {
      console.log(`  -> Kanal [${channelId}] yerleşik saklama ayarı (retainedReleaseCount) zaten ${RETAIN_COUNT}.`);
    }
  }

  // 3. Release'leri çek ve tarihe göre sırala
  console.log(`\n3. Hosting Release Kayıtları Tarihe Göre İnceleniyor...`);
  const releasesRes = await fetchJson(`https://firebasehosting.googleapis.com/v1beta1/sites/${siteId}/releases?pageSize=100`, { headers });
  const releases = (releasesRes.releases || []).sort((a, b) => new Date(b.releaseTime).getTime() - new Date(a.releaseTime).getTime());
  console.log(`Toplam Kayıtlı Release Sayısı: ${releases.length}`);

  // En yeni 5 release'i ve yayındaki aktif sürümü koru
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

  // 4. Tüm Hosting version kayıtlarını çek ve ayıkla
  console.log(`\n4. Hosting Version Dosya Depolama Kayıtları Taranıyor...`);
  const versionsRes = await fetchJson(`https://firebasehosting.googleapis.com/v1beta1/sites/${siteId}/versions?pageSize=100`, { headers });
  const allVersions = versionsRes.versions || [];
  console.log(`Toplam Hosting Version Kaydı: ${allVersions.length}`);

  const toKeep = [];
  const toDelete = [];
  const alreadyDeleted = [];

  for (const v of allVersions) {
    const vName = v.name;
    const vBytes = Number(v.versionBytes) || 0;

    if (v.status === 'DELETED') {
      alreadyDeleted.push({
        name: vName,
        createTime: v.createTime,
        fileCount: v.fileCount,
        bytes: vBytes,
      });
      continue;
    }

    if (retainedVersions.has(vName) || activeVersions.has(vName)) {
      toKeep.push({
        name: vName,
        reason: retainedVersions.get(vName)?.reason || 'Aktif kanal sürümü',
        createTime: v.createTime,
        fileCount: v.fileCount,
        bytes: vBytes,
      });
    } else {
      toDelete.push({
        name: vName,
        createTime: v.createTime,
        fileCount: v.fileCount,
        bytes: vBytes,
      });
    }
  }

  console.log(`\n--- KORUNACAK SÜRÜMLER (${toKeep.length} adet) ---`);
  toKeep.forEach((k) => {
    console.log(`[KORU] ${k.name.split('/').pop()} | Oluşturulma: ${k.createTime} | Dosya: ${k.fileCount} | Boyut: ${formatBytes(k.bytes)} | Neden: ${k.reason}`);
  });

  console.log(`\n--- DAHA ÖNCE TEMİZLENMİŞ ESKİ SÜRÜMLER (${alreadyDeleted.length} adet) ---`);
  let alreadyDeletedBytes = 0;
  alreadyDeleted.forEach((ad) => {
    alreadyDeletedBytes += ad.bytes;
  });
  console.log(`Önceki temizliklerde silinen sürüm sayısı: ${alreadyDeleted.length} (Kazanılan Alan: ${formatBytes(alreadyDeletedBytes)})`);

  console.log(`\n--- ŞU AN SİLİNECEK ESKİ SÜRÜMLER (${toDelete.length} adet) ---`);
  let totalDeleteBytes = 0;
  toDelete.forEach((d) => {
    totalDeleteBytes += d.bytes;
    console.log(`[SİL]  ${d.name.split('/').pop()} | Oluşturulma: ${d.createTime} | Dosya: ${d.fileCount} | Boyut: ${formatBytes(d.bytes)}`);
  });
  console.log(`Bu işlemde boşaltılacak ek boyut: ${formatBytes(totalDeleteBytes)}`);

  if (!execute) {
    console.log(`\n[ÖNİZLEME (DRY RUN)]: Gerçek silme yapılmadı. Silme işlemini uygulamak için --execute bayrağını kullanın.`);
    return {
      toKeep,
      toDelete,
      alreadyDeleted,
      alreadyDeletedBytes,
      totalDeleteBytes,
      deletedCount: 0,
      failedCount: 0,
      errors: [],
    };
  }

  // 5. Silme işlemini desteklenen Firebase Hosting REST API yöntemiyle gerçekleştir
  let deletedCount = 0;
  let failedCount = 0;
  const errors = [];

  if (toDelete.length > 0) {
    console.log(`\nSilme işlemi başlatılıyor (${toDelete.length} sürüm)...`);
    for (const item of toDelete) {
      try {
        const deleteUrl = `https://firebasehosting.googleapis.com/v1beta1/${item.name}`;
        const res = await fetch(deleteUrl, { method: 'DELETE', headers });
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`[${res.status}] ${errText}`);
        }
        deletedCount += 1;
        console.log(`✓ Başarıyla silindi: ${item.name.split('/').pop()} (${formatBytes(item.bytes)})`);
      } catch (err) {
        failedCount += 1;
        errors.push({ name: item.name, error: err.message });
        console.error(`✗ Silinemedi (${item.name.split('/').pop()}): ${err.message}`);
      }
    }
  } else {
    console.log(`\nSilinecek yeni eski sürüm bulunmuyor. Tüm eski sürümler zaten temizlenmiş.`);
  }

  // 6. Canlı sitenin çalıştığını ve korunan sürümlerin mevcut olduğunu doğrula
  console.log(`\n5. Canlı Site ve Korunan Sürümler Doğrulanıyor...`);
  const liveUrls = [
    `https://${siteId}.web.app/api/health`,
    `https://www.nilasyaagrofoods.com.tr/api/health`
  ];
  for (const url of liveUrls) {
    try {
      const liveCheck = await fetch(url, {
        headers: { 'X-Nilasya-Request': '1' }
      });
      console.log(`- Kontrol [${url}]: HTTP ${liveCheck.status} (${liveCheck.ok ? 'BAŞARILI' : 'UYARI'})`);
    } catch (err) {
      console.warn(`- Canlı kontrol uyarısı [${url}]: ${err.message}`);
    }
  }

  return {
    toKeep,
    toDelete,
    alreadyDeleted,
    alreadyDeletedBytes,
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

  console.log(`==================================================`);
  console.log(`Firebase Hosting Sürüm Saklama ve Temizlik Sistemi`);
  console.log(`==================================================`);
  console.log(`Hedef Proje: ${EXPECTED_PROJECT}`);
  console.log(`Hedef Hosting Sitesi: ${targetSite}`);
  console.log(`Çalışma Modu: ${isExecute ? 'GERÇEK UYGULAMA (SİLME ETKİN)' : 'ÖNİZLEME (DRY RUN)'}`);

  // Yerel yapılandırma güvenlik kontrolü
  verifyLocalConfig(EXPECTED_PROJECT, targetSite);

  const token = getFirebaseToken();
  const result = await cleanupSite(targetSite, token, isExecute);

  console.log(`\n==================================================`);
  console.log(`TEMİZLİK VE DEPOLAMA RAPORU`);
  console.log(`==================================================`);
  console.log(`- Korunan Aktif/Yeni Sürüm Sayısı: ${result.toKeep.length} adet`);
  console.log(`- Bu İşlemde Silinen Sürüm Sayısı: ${result.deletedCount} adet`);
  console.log(`- Daha Önce Temizlenmiş Sürüm Sayısı: ${result.alreadyDeleted.length} adet`);
  console.log(`- Toplam Arşivden Kaldırılan Sürüm: ${result.alreadyDeleted.length + result.deletedCount} adet`);
  if (result.failedCount > 0) {
    console.error(`- BAŞARISIZ SİLME SAYISI: ${result.failedCount}`);
    console.error(`- Hata detayları:`, JSON.stringify(result.errors, null, 2));
  }
  const totalReclaimed = result.alreadyDeletedBytes + (result.deletedCount > 0 ? result.totalDeleteBytes : 0);
  console.log(`- Toplam Boşaltılan Hosting Depolama Boyutu: ${formatBytes(totalReclaimed)} (~${(totalReclaimed / (1024 * 1024 * 1024)).toFixed(2)} GB)`);
  console.log(`- Kalan Aktif Hosting Boyutu: ${formatBytes(result.toKeep.reduce((acc, k) => acc + k.bytes, 0))}`);
  console.log(`\n[ÖNEMLİ DEPOLAMA BİLGİSİ]:`);
  console.log(`Firebase Hosting Version kayıtları REST API ile başarıyla "DELETED" olarak işaretlenir ve altta yatan depolama blokları serbest bırakılır.`);
  console.log(`Firebase Console ve GCP Storage göstergelerinde toplam depolama grafiğinin güncellenmesi, CDN önbellekleri ve günlük depolama sayaçları nedeniyle birkaç saat ila 24 saat arasında gecikmeli olarak yansıyabilir.`);
}

main().catch((err) => {
  console.error('\n[KRİTİK HATA]:', err.message);
  process.exit(1);
});
