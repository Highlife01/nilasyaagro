import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const translationsDataPath = path.join(projectRoot, 'src', 'data', 'translationsData.ts');
const pageTranslationsDataPath = path.join(projectRoot, 'src', 'data', 'pageTranslationsData.ts');

const pulsesMap = {
  de: 'Kichererbsen • Rote Linsen • Grüne Linsen • Weiße Bohnen • Trockenerbsen • Durumweizen & Bulgur',
  fr: 'Pois chiches • Lentilles rouges • Lentilles vertes • Haricots blancs • Pois cassés • Blé dur & boulgour',
  es: 'Garbanzos • Lentejas rojas • Lentejas verdes • Alubias blancas • Guisantes secos • Trigo duro y bulgur',
  it: 'Ceci • Lenticchie rosse • Lenticchie verdi • Fagioli bianchi • Piselli secchi • Grano duro e bulgur',
  nl: 'Kikkererwten • Rode linzen • Groene linzen • Witte bonen • Droge erwten • Durumtarwe & bulgur',
  pl: 'Ciecierzyca • Czerwona soczewica • Zielona soczewica • Biała fasola • Suchy groch • Pszenica durum i bulgur',
  ro: 'Năut • Linte roșie • Linte verde • Fasole albă • Mazăre uscată • Grâu dur și bulgur',
  bg: 'Нахут • Червена леща • Зелена леща • Бял боб • Сух грах • Твърда пшеница и булгур',
  el: 'Ρεβίθια • Κόκκινες φακές • Πράσινες φακές • Άσπρα φασόλια • Ξερά μπιζέλια • Σκληρό σιτάρι & πλιγούρι',
  ru: 'Нут • Красная чечевица • Зеленая чечевица • Белая фасоль • Сухой горох • Твердая пшеница и булгур',
  uk: 'Нут • Червона сочевиця • Зелена сочевиця • Біла квасоля • Сухий горох • Тверда пшениця і булгур',
  ar: 'حمص • عدس أحمر • عدس أخضر • فاصولياء بيضاء • بازلاء جافة • قمح قاسي وبرغل',
  fa: 'نخود • عدس قرمز • عدس سبز • لوبیا سفید • نخود فرنگی خشک • گندم دوروم و بلغور',
  he: 'חומוס • עדשים אדומות • עדשים ירוקות • שעועית לבנה • אפונה יבשה • חיטת דורום ובורגול',
  hi: 'काबुली चना • लाल मसूर • हरी मसूर • सफेद सेम • सूखे मटर • ड्यूरम गेहूं और दलिया',
  ur: 'چنے • سرخ دالیں • سبز دالیں • سفید لوبیا • خشک مٹر • ڈورم گندم اور دلیہ',
  zh: '鹰嘴豆 • 红扁豆 • 绿扁豆 • 白云豆 • 干豌豆 • 杜兰小麦与碎小麦',
  ja: 'ひよこ豆 • 赤レンズ豆 • 緑レンズ豆 • 白インゲン豆 • 乾燥えんどう豆 • デュラム小麦＆ブルグル',
  ko: '병아리콩 • 붉은 렌틸콩 • 녹색 렌틸콩 • 백강낭콩 • 건조 완두콩 • 듀럼밀 & 불가',
  id: 'Kacang Arab • Lentil Merah • Lentil Hijau • Kacang Putih • Kacang Polong Kering • Gandum Durum & Bulgur',
  ms: 'Kacang Kuda • Lentil Merah • Lentil Hijau • Kacang Putih • Kacang Kering • Gandum Durum & Bulgur',
  pt: 'Grão-de-bico • Lentilhas vermelhas • Lentilhas verdes • Feijão branco • Ervilhas secas • Trigo duro e bulgur',
  cs: 'Cizrna • Červená čočka • Zelená čočka • Bílé fazole • Suchý hrách • Tvrdá pšenice a bulgur',
  az: 'Noxud • Qırmızı Mərcimək • Yaşıl Mərcimək • Quru Lobya • Quru Noxud • Durum Buğdası & Bulqur',
  uz: 'No\'xat • Qizil Loviya • Yashil Loviya • Oq Loviya • Quruq No\'xat • Durum Bug\'doyi & Bulgur',
  kk: 'Нохут • Қызыл жасымық • Жасыл жасымық • Ақ бұршақ • Құрғақ бұршақ • Қатты бидай және булгур',
  ka: 'მუხუდო • წითელი ოსპი • მწვანე ოსპი • თეთრი ლობიო • მშრალი ბარდა • მაგარი ხორბალი და ბულგური',
  sr: 'Slanutak • Crvena sočiva • Zelena sočiva • Beli pasulj • Suvi grašak • Tvrda pšenica i bulgur',
  bn: 'ছোলা • লাল মসুর • সবুজ মসুর • সাদা শিম • শুকনো মটর • ডুরাম গম ও বুলগুর',
  sw: 'Chickpeas • Dengu nyekundu • Dengu za Kijani • Maharagwe meupe • Mbaazi kavu • Ngano ya Durum na Bulgur',
  en: 'Chickpeas • Red Lentils • Green Lentils • White Beans • Dry Peas • Durum Wheat & Bulgur',
  tr: 'Nohut • Kırmızı Mercimek • Yeşil Mercimek • Kuru Fasulye • Kuru Bezelye • Durum Buğdayı & Bulgur',
};

// 1. Update translationsData.ts
const transPrefix = "import type { Translations } from './translations';\n\nexport const translationsData: Record<string, Translations> = ";
const transRaw = fs.readFileSync(translationsDataPath, 'utf8');

if (!transRaw.startsWith(transPrefix)) {
  throw new Error('translationsData.ts prefix mismatch');
}

const transJson = transRaw.slice(transPrefix.length).trim().replace(/;$/, '');
const transData = JSON.parse(transJson);

let updatedTransCount = 0;
for (const [lang, obj] of Object.entries(transData)) {
  updatedTransCount++;
  // Update hero.stats.countries to 50+
  if (obj.hero?.stats) {
    obj.hero.stats.countries = '50+';
    if (lang === 'tr') {
      obj.hero.stats.countriesLabel = '50+ Küresel İhracat Pazarı';
      obj.hero.stats.supply = '120.000 Ton';
      obj.hero.stats.supplyLabel = 'Yıllık İşleme & Tedarik Hacmi';
    } else if (lang === 'en') {
      obj.hero.stats.countriesLabel = 'Global Export Markets';
      obj.hero.stats.supply = '120,000 MT';
      obj.hero.stats.supplyLabel = 'Annual Milling & Supply Capacity';
    } else {
      if (!obj.hero.stats.supply || obj.hero.stats.supply.includes('100,000') || obj.hero.stats.supply.includes('100.000')) {
        obj.hero.stats.supply = '120,000 MT';
      }
    }
  }

  // Update hero.productsList
  if (pulsesMap[lang]) {
    obj.hero.productsList = pulsesMap[lang];
  }

  // Standardize trustStrip.reliable.desc capacity: replace 100,000+ or 100.000+ with 120,000 MT or 120.000 ton
  if (obj.trustStrip?.reliable?.desc) {
    obj.trustStrip.reliable.desc = obj.trustStrip.reliable.desc
      .replace(/100,000\+?\s*MT/g, '120,000 MT')
      .replace(/100\.000\+?\s*ton/gi, '120.000 Ton')
      .replace(/100,000\+/g, '120,000')
      .replace(/100\.000\+/g, '120.000');
  }

  // Clean hero badge positioning
  if (lang === 'en') {
    obj.hero.badge = 'B2B SOURCING, SORTEX PROCESSING & GLOBAL EXPORT';
  } else if (lang === 'tr') {
    obj.hero.badge = 'TÜRKİYE MENŞEİLİ B2B BAKLİYAT İŞLEME & İHRACAT KURULUŞU';
  }
}

fs.writeFileSync(translationsDataPath, `${transPrefix}${JSON.stringify(transData, null, 2)};\n`, 'utf8');
console.log(`Updated translationsData.ts for ${updatedTransCount} languages.`);

// 2. Update pageTranslationsData.ts
const pagePrefix = "import type { LocalizedPageTranslations } from './pageTranslations';\n\nexport const pageTranslationsData: Record<string, LocalizedPageTranslations> = ";
const pageRaw = fs.readFileSync(pageTranslationsDataPath, 'utf8');

if (!pageRaw.startsWith(pagePrefix)) {
  throw new Error('pageTranslationsData.ts prefix mismatch');
}

const pageJson = pageRaw.slice(pagePrefix.length).trim().replace(/;$/, '');
const pageData = JSON.parse(pageJson);

const legacyProduceKeys = ['pomegranate', 'apples', 'grapes', 'kiwi', 'citrus', 'tomatoes'];
let updatedPageCount = 0;

for (const [lang, obj] of Object.entries(pageData)) {
  updatedPageCount++;
  // Clean productsPage.pills
  if (obj.productsPage?.pills) {
    for (const k of legacyProduceKeys) {
      delete obj.productsPage.pills[k];
    }
  }

  // Standardize exportPage.tag from 40+ to 50+
  if (obj.exportPage?.tag) {
    obj.exportPage.tag = obj.exportPage.tag.replace(/40\+/g, '50+');
  }
}

fs.writeFileSync(pageTranslationsDataPath, `${pagePrefix}${JSON.stringify(pageData, null, 2)};\n`, 'utf8');
console.log(`Updated pageTranslationsData.ts for ${updatedPageCount} languages.`);
