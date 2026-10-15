import { getCompanyFactLabels } from './companyFacts';

export function localizedSeoDescription(lang: string, subject?: string) {
  const description = getCompanyFactLabels(lang).description;
  return subject ? `${subject}. ${description}` : description;
}

const homeTitles: Record<string, string> = {
  en: 'Turkish Pulses & Grains Exporter — Chickpeas, Lentils, Beans',
  tr: 'Türk Bakliyat ve Hububat İhracatçısı — Nohut, Mercimek, Fasulye',
  ar: 'مصدّر البقوليات والحبوب التركية — حمص وعدس وفاصوليا',
  ru: 'Экспортёр турецких бобовых и зерновых — нут, чечевица, фасоль',
  de: 'Türkischer Hülsenfrüchte-Exporteur — Kichererbsen, Linsen, Bohnen',
  fr: 'Exportateur de légumineuses turques — pois chiches, lentilles, haricots',
  es: 'Exportador de legumbres turcas — garbanzos, lentejas, alubias',
  it: 'Esportatore di legumi turchi — ceci, lenticchie, fagioli',
  pt: 'Exportador de Leguminosas e Cereais da Turquia — Grão-de-bico, Lentilhas, Feijão',
  nl: 'Turkse Exporteur van Peulvruchten en Granen — Kikkererwten, Linzen, Bonen',
  pl: 'Turecki Eksporter Roślin Strączkowych i Zbóż — Ciecierzyca, Soczewica, Fasola',
  ro: 'Exportator Turc de Leguminoase și Cereale — Năut, Linte, Fasole',
  bg: 'Турски износител на бобови и зърнени култури — Нахут, Леща, Фасул',
  el: 'Τούρκος Εξαγωγέας Οσπρίων & Δημητριακών — Ρεβίθια, Φακές, Φασόλια',
  sr: 'Turski izvoznik mahunarki i žitarica — Leblebija, Sočivo, Pasulj',
  uk: 'Турецький експортер бобових і зернових — Нут, Сочевиця, Квасоля',
  ka: 'თურქული პარკოსნებისა და მარცვლეულის ექსპორტიორი — მუხუდო, ოსპი, ლობიო',
  az: 'Türkiyə Paxlalılar və Taxıl İxracatçısı — Noxud, Mərcimək, Lobya',
  uz: 'Turkiya Dukkakli va Don Eksportchisi — No‘xat, Yasmiq, Loviya',
  kk: 'Түркия бұршақ және дәнді дақылдар экспорттаушысы — Ноқат, Жасымық,Үрмебұршақ',
  fa: 'صادرکننده حبوبات و غلات ترکیه — نخود، عدس، لوبیا',
  hi: 'तुर्किये दाल और अनाज निर्यातक — चना, मसूर, राजमा',
  ur: 'ترکیہ دالوں اور اناج کا برآمد کنندہ — چنا، مسور، لوبیا',
  bn: 'তুরস্কের ডাল ও শস্য রপ্তানিকারক — ছোলা, মসুর ডাল, শিমের বীচি',
  'zh-cn': '土耳其豆类与谷物出口商 — 鹰嘴豆、扁豆、菜豆',
  ja: 'トルコ産豆類・穀物輸出業者 — ひよこ豆、レンズ豆、インゲン豆',
  ko: '튀르키예 두류 및 곡물 수출업체 — 병아리콩, 렌틸콩, 강낭콩',
  id: 'Eksportir Kacang-kacangan & Biji-bijian Türkiye — Kacang Arab, Lentil, Kacang Putih',
  ms: 'Pengeksport Kekacang & Bijirin Türkiye — Kacang Kuda, Lentil, Kacang Putih',
  sw: 'Msafirishaji wa Mikunde na Nafaka wa Uturuki — Dengu, Maharage, Njegere',
};

export function localizedHomeTitle(lang: string) {
  return homeTitles[lang] || homeTitles.en;
}

const routeDescriptions: Record<string, { en: string; tr: string }> = {
  about: { en: 'Meet Nilasya Agro Foods, a Turkish B2B supplier of pulses and grains. Contact our Adana trade desk for product specifications and export requirements.', tr: 'Nilasya Agro Foods’u tanıyın. Türkiye’den bakliyat ve hububat tedariki, ürün şartnameleri ve ihracat talepleri için Adana ticaret ekibimize ulaşın.' },
  products: { en: 'Compare Turkish chickpeas, lentils, beans, peas, durum wheat and bulgur. Review varieties, moisture, purity, packaging and request a bulk export quotation.', tr: 'Türk nohudu, mercimek, fasulye, bezelye, durum buğdayı ve bulguru karşılaştırın. Çeşitleri, nem, saflık ve ambalaj seçeneklerini inceleyip toptan teklif alın.' },
  export: { en: 'Explore export destinations for Turkish pulses and grains, with shipping routes, estimated transit times, trade terms and destination documentation.', tr: 'Türk bakliyat ve hububat ihracat pazarlarını inceleyin. Sevkiyat rotaları, tahmini transit süreleri, teslim koşulları ve ülke belgeleri hakkında bilgi alın.' },
  quality: { en: 'Review pulse and grain quality controls: optical sorting, moisture and purity specifications, traceability and shipment documentation.', tr: 'Bakliyat ve hububat kalite kontrollerini inceleyin: optik ayıklama, nem ve saflık şartnameleri, izlenebilirlik ve sevkiyat belgeleri.' },
  packaging: { en: 'Review retail and bulk packaging for Turkish pulses and grains, including PP bags, big bags and container loading options. Request your preferred format.', tr: 'Türk bakliyat ve hububatları için perakende ve toptan ambalajları inceleyin: PP çuvallar, big bag ve konteyner yükleme seçenekleri.' },
  production: { en: 'Explore Turkish growing regions and harvest seasons for pulses and grains, from Central Anatolia to southeastern Türkiye.', tr: 'İç Anadolu’dan Güneydoğu Anadolu’ya Türkiye’nin bakliyat ve hububat yetiştiricilik bölgeleri ile hasat dönemlerini inceleyin.' },
  'harvest-calendar': { en: 'Track Turkish pulse and grain harvest windows, fresh crop readiness and year-round export shipping schedules from Mersin International Port.', tr: 'Türkiye bakliyat ve hububat hasat dönemlerini, yeni mahsul hazırlık takvimini ve Mersin Limanı’ndan yıl boyu ihracat sevkiyat planını inceleyin.' },
  sustainability: { en: 'Learn about Nilasya Agro Foods’ approach to agricultural sourcing, efficient processing, packaging and export logistics.', tr: 'Nilasya Agro Foods’un tarımsal tedarik, verimli işleme, ambalajlama ve ihracat lojistiğine yaklaşımını öğrenin.' },
  insights: { en: 'Read buying guides for Turkish pulses and grains: product specifications, packaging, trade terms and export logistics.', tr: 'Türk bakliyat ve hububat alım rehberlerini okuyun: ürün şartnameleri, ambalaj, ticaret koşulları ve ihracat lojistiği.' },
  contact: { en: 'Contact the Nilasya Agro Foods export desk in Adana, Türkiye. Discuss pulse and grain specifications, bulk orders and destination shipping requirements.', tr: 'Adana’daki Nilasya Agro Foods ihracat ekibine ulaşın. Bakliyat ve hububat şartnameleri, toptan siparişler ve teslimat ihtiyaçlarını görüşün.' },
  quote: { en: 'Request a Turkish pulse or grain export quote. Specify product, quantity, packaging, destination and delivery terms for our trade desk.', tr: 'Türk bakliyat ve hububatı için ihracat teklifi isteyin. Ürün, miktar, ambalaj, varış noktası ve teslim koşullarını ekibimize iletin.' },
  'privacy-policy': { en: 'Read how Nilasya Agro Foods handles contact and quotation information, privacy requests and personal data.', tr: 'Nilasya Agro Foods’un iletişim ve teklif bilgilerini nasıl işlediğini, kişisel veri ve gizlilik taleplerini nasıl ele aldığını okuyun.' },
  terms: { en: 'Read the terms for using the Nilasya Agro Foods website and submitting product and export quotation enquiries.', tr: 'Nilasya Agro Foods web sitesini kullanma ve ürün ile ihracat teklifi talebi gönderme koşullarını okuyun.' },
};

export function localizedPageDescription(lang: string, pathname: string, subject: string) {
  const description = routeDescriptions[pathname];
  if (description && (lang === 'tr' || lang === 'en')) return description[lang];
  return localizedSeoDescription(lang, subject);
}
