import { getCompanyFactLabels } from './companyFacts';

export function localizedSeoDescription(lang: string, subject?: string) {
  const description = getCompanyFactLabels(lang).description;
  return subject ? `${subject}. ${description}` : description;
}

const routeDescriptions: Record<string, { en: string; tr: string }> = {
  about: { en: 'Meet Nilasya Agro Foods, a Turkish B2B supplier of pulses and grains. Contact our Adana trade desk for product specifications and export requirements.', tr: 'Nilasya Agro Foods’u tanıyın. Türkiye’den bakliyat ve hububat tedariki, ürün şartnameleri ve ihracat talepleri için Adana ticaret ekibimize ulaşın.' },
  products: { en: 'Compare Turkish chickpeas, lentils, beans, peas, durum wheat and bulgur. Review varieties, moisture, purity, packaging and request a bulk export quotation.', tr: 'Türk nohudu, mercimek, fasulye, bezelye, durum buğdayı ve bulguru karşılaştırın. Çeşitleri, nem, saflık ve ambalaj seçeneklerini inceleyip toptan teklif alın.' },
  export: { en: 'Explore export destinations for Turkish pulses and grains, with shipping routes, estimated transit times, trade terms and destination documentation.', tr: 'Türk bakliyat ve hububat ihracat pazarlarını inceleyin. Sevkiyat rotaları, tahmini transit süreleri, teslim koşulları ve ülke belgeleri hakkında bilgi alın.' },
  quality: { en: 'Review pulse and grain quality controls: optical sorting, moisture and purity specifications, traceability and shipment documentation.', tr: 'Bakliyat ve hububat kalite kontrollerini inceleyin: optik ayıklama, nem ve saflık şartnameleri, izlenebilirlik ve sevkiyat belgeleri.' },
  packaging: { en: 'Review retail and bulk packaging for Turkish pulses and grains, including PP bags, big bags and container loading options. Request your preferred format.', tr: 'Türk bakliyat ve hububatları için perakende ve toptan ambalajları inceleyin: PP çuvallar, big bag ve konteyner yükleme seçenekleri.' },
  production: { en: 'Explore Turkish growing regions and harvest seasons for pulses and grains, from Central Anatolia to southeastern Türkiye.', tr: 'İç Anadolu’dan Güneydoğu Anadolu’ya Türkiye’nin bakliyat ve hububat yetiştiricilik bölgeleri ile hasat dönemlerini inceleyin.' },
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
