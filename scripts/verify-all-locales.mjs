import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function runVerification() {
  console.log('====================================================');
  console.log('NILASYA AGRO FOODS — TÜM DİLLER & KARARLILIK DENETİMİ');
  console.log('====================================================\n');

  let totalChecks = 0;
  let passedChecks = 0;
  let totalErrors = 0;

  function assert(condition, message) {
    totalChecks++;
    if (!condition) {
      console.error(`❌ HATA: ${message}`);
      totalErrors++;
    } else {
      passedChecks++;
    }
  }

  // 1. Dilleri Yükle
  console.log('[1/7] Dil Listesi & Konfigürasyon Denetimi...');
  const { supportedLanguages } = await import('../src/data/languages.ts');
  assert(supportedLanguages.length === 30, `30 dil bekleniyordu, ${supportedLanguages.length} bulundu.`);
  const langCodes = supportedLanguages.map((l) => l.code);
  console.log(`✓ 30 dil doğrulandı: ${langCodes.join(', ')}`);

  // RTL ve Yön Kontrolü
  const rtlLangs = supportedLanguages.filter((l) => l.dir === 'rtl').map((l) => l.code);
  assert(rtlLangs.includes('ar') && rtlLangs.includes('fa') && rtlLangs.includes('ur'), 'Arapça, Farsça ve Urduca RTL olarak tanımlanmış olmalı.');
  console.log(`✓ RTL dilleri doğrulandı: ${rtlLangs.join(', ')}`);

  // 2. translationsData Denetimi
  console.log('\n[2/7] translationsData (Genel Arayüz Çevirileri) Denetimi...');
  const { translationsData } = await import('../src/data/translationsData.ts');
  const enTemplate = translationsData.en;
  const sections = Object.keys(enTemplate);

  for (const lang of langCodes) {
    const t = translationsData[lang];
    assert(Boolean(t), `translationsData'da '${lang}' dili eksik.`);
    if (!t) continue;

    for (const sec of sections) {
      assert(t[sec] !== undefined, `translationsData[${lang}].${sec} bölümü eksik.`);
      if (typeof t[sec] === 'object' && t[sec] !== null && !Array.isArray(t[sec])) {
        for (const subKey of Object.keys(enTemplate[sec])) {
          const val = t[sec][subKey];
          assert(val !== undefined && val !== null && String(val).trim() !== '', `translationsData[${lang}].${sec}.${subKey} boş veya eksik.`);
        }
      }
    }
  }
  console.log(`✓ translationsData: 30 dilin tamamında tüm bölümler ve alt anahtarlar eksiksiz.`);

  // 3. pageTranslationsData Denetimi
  console.log('\n[3/7] pageTranslationsData (Sayfa Bazlı Çeviriler) Denetimi...');
  const { pageTranslationsData } = await import('../src/data/pageTranslationsData.ts');
  const { getPageTranslations } = await import('../src/data/pageTranslations.ts');

  const pageSections = [
    'about',
    'productsPage',
    'productDetail',
    'productionPage',
    'qualityPage',
    'packagingPage',
    'exportPage',
    'calendarPage',
    'sustainabilityPage',
    'insightsPage',
    'contactPage',
    'quotePage',
    'legal',
    'whatsapp',
    'common'
  ];

  for (const lang of langCodes) {
    const pt = getPageTranslations(lang);
    for (const sec of pageSections) {
      assert(pt[sec] !== undefined, `getPageTranslations('${lang}').${sec} eksik.`);
    }
  }
  console.log(`✓ pageTranslations: 30 dil için 'about', 'products', 'quote', 'quality', 'export' vb. sayfaları eksiksiz.`);

  // 4. productsData Denetimi
  console.log('\n[4/7] productsData (Ürün Kataloğu Çevirileri) Denetimi...');
  const { productsData } = await import('../src/data/products.ts');
  assert(productsData.length >= 7, `En az 7 ana bakliyat/tahıl ürünü bekleniyordu, ${productsData.length} bulundu.`);

  for (const prod of productsData) {
    for (const lang of langCodes) {
      const name = prod.name?.[lang];
      const slug = prod.slug?.[lang];
      const cat = prod.category?.[lang];
      const tag = prod.tagline?.[lang];
      const shortDesc = prod.shortDescription?.[lang];
      const fullDesc = prod.fullDescription?.[lang];

      assert(Boolean(name && name.trim()), `Ürün '${prod.id}' için '${lang}' dilinde isim eksik.`);
      assert(Boolean(slug && slug.trim()), `Ürün '${prod.id}' için '${lang}' dilinde slug eksik.`);
      assert(Boolean(cat && cat.trim()), `Ürün '${prod.id}' için '${lang}' dilinde kategori eksik.`);
      assert(Boolean(tag && tag.trim()), `Ürün '${prod.id}' için '${lang}' dilinde tagline eksik.`);
      assert(Boolean(shortDesc && shortDesc.trim()), `Ürün '${prod.id}' için '${lang}' dilinde kısa açıklama eksik.`);
      assert(Boolean(fullDesc && fullDesc.trim()), `Ürün '${prod.id}' için '${lang}' dilinde tam açıklama eksik.`);
    }
  }
  console.log(`✓ productsData: ${productsData.length} ürünün adı, slug'ı, kategorisi, sloganı ve açıklamaları 30 dilde eksiksiz.`);

  // 5. exportCountriesData Denetimi
  console.log('\n[5/7] exportCountriesData (Hedef İhracat Ülkeleri) Denetimi...');
  const { exportCountriesData } = await import('../src/data/countries.ts');
  assert(exportCountriesData.length >= 25, `En az 25 ihracat ülkesi bekleniyordu, ${exportCountriesData.length} bulundu.`);

  for (const country of exportCountriesData) {
    for (const lang of langCodes) {
      const name = country.name[lang];
      const overview = country.overview[lang];
      const geoAnswer = country.geoAnswer[lang];

      assert(Boolean(name && name.trim()), `Ülke '${country.id}' için '${lang}' dilinde isim eksik.`);
      assert(Boolean(overview && overview.trim()), `Ülke '${country.id}' için '${lang}' dilinde overview eksik.`);
      assert(Boolean(geoAnswer && geoAnswer.trim()), `Ülke '${country.id}' için '${lang}' dilinde geoAnswer eksik.`);
    }
  }
  console.log(`✓ exportCountriesData: ${exportCountriesData.length} ülkenin genel ve geo bilgileri 30 dilde eksiksiz.`);

  // 6. insightArticles Denetimi
  console.log('\n[6/7] insightArticles (B2B İhracat Makaleleri) Denetimi...');
  const { insightArticles } = await import('../src/data/insights.ts');
  assert(insightArticles.length >= 3, `En az 3 makale bekleniyordu, ${insightArticles.length} bulundu.`);

  for (const article of insightArticles) {
    for (const lang of langCodes) {
      const title = article.title[lang];
      const excerpt = article.excerpt[lang];
      const content = article.content[lang];

      assert(Boolean(title && title.trim()), `Makale '${article.slug}' için '${lang}' dilinde başlık eksik.`);
      assert(Boolean(excerpt && excerpt.trim()), `Makale '${article.slug}' için '${lang}' dilinde özet eksik.`);
      assert(Boolean(content && content.trim()), `Makale '${article.slug}' için '${lang}' dilinde içerik eksik.`);
    }
  }
  console.log(`✓ insightArticles: ${insightArticles.length} makalenin başlık, özet ve gövde metinleri 30 dilde eksiksiz.`);

  // 7. company-facts.json Etiketleri Denetimi
  console.log('\n[7/7] company-facts.json (Resmi Beyanlar & Doğrulanmış Veriler) Denetimi...');
  const factsFile = await readFile(path.join(rootDir, 'content/company-facts.json'), 'utf8');
  const factsJson = JSON.parse(factsFile);
  const factKeys = ['description', 'exportMarkets', 'annualCapacity', 'opticalPurity', 'responseTime', 'documentation'];

  for (const lang of langCodes) {
    const labels = factsJson.labels[lang];
    assert(Boolean(labels), `company-facts.json labels içinde '${lang}' eksik.`);
    if (labels) {
      for (const fk of factKeys) {
        assert(Boolean(labels[fk] && labels[fk].trim()), `company-facts.json labels[${lang}].${fk} boş.`);
      }
    }
  }
  console.log(`✓ company-facts.json: 30 dil için kurumsal beyan etiketleri eksiksiz.`);

  console.log('\n====================================================');
  console.log(`SONUÇ: ${totalChecks} kontrol yapıldı.`);
  console.log(`BAŞARILI: ${passedChecks}`);
  console.log(`HATALAR: ${totalErrors}`);
  console.log('====================================================');

  if (totalErrors > 0) {
    process.exit(1);
  }
}

runVerification().catch((err) => {
  console.error('Doğrulama hatası:', err);
  process.exit(1);
});
