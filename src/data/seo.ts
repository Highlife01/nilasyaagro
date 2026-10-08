const descriptions: Record<string, string> = {
  en: 'Premium Turkish pulses, grains and agricultural commodities (chickpeas, lentils, beans, peas, durum wheat & bulgur) exported worldwide from Mersin Port with Bühler Sortex optical purity.',
  tr: 'Türkiye’den Mersin Limanı çıkışlı, Bühler Sortex optik saflığında sertifikalı koçbaşı nohut, kırmızı ve yeşil mercimek, kuru fasulye, bezelye, durum buğdayı ve bulgur ihracatı.',
  de: 'Premium-Hülsenfrüchte und Getreide aus der Türkei (Kichererbsen, Linsen, Bohnen, Bulgur) mit Bühler Sortex-Reinheit, exportiert weltweit ab Hafen Mersin.',
  fr: 'Légumineuses et céréales premium de Turquie (pois chiches, lentilles, haricots, boulgour) avec pureté optique Bühler Sortex, exportées depuis le port de Mersin.',
  es: 'Legumbres y cereales premium de Turquía (garbanzos, lentejas, alubias, trigo duro y bulgur) con pureza óptica Sortex, exportados desde el puerto de Mersin.',
  it: 'Legumi e cereali premium dalla Turchia (ceci, lenticchie, fagioli bianchi, grano duro e bulgur) con purezza ottica Sortex, esportati dal porto di Mersin.',
  nl: 'Premium peulvruchten en granen uit Turkije (kikkererwten, linzen, bonen, bulgur) met Bühler Sortex-zuiverheid, geëxporteerd vanuit de haven van Mersin.',
  pl: 'Wysokiej jakości rośliny strączkowe i zboża z Turcji (ciecierzyca, soczewica, fasola, bulgur) o czystości Sortex, eksportowane z portu Mersin.',
  ro: 'Leguminoase și cereale premium din Turcia (năut, linte, fasole albă, grâu dur și bulgur) cu puritate optică Sortex, exportate din portul Mersin.',
  bg: 'Първокласни бобови и зърнени култури от Турция (нахут, леща, фасул, булгур) със Sortex чистота, изнасяни от пристанище Мерсин.',
  el: 'Εξαιρετικής ποιότητας όσπρια και δημητριακά από την Τουρκία (ρεβίθια, φακές, φασόλια, πλιγούρι) με οπτική καθαρότητα Sortex, εξαγωγή από το λιμάνι της Μερσίνης.',
  ru: 'Турецкие бобовые и зерновые культуры премиум-класса (нут, чечевица, фасоль, булгур) с оптической чистотой Sortex, экспорт из порта Мерсин.',
  uk: 'Турецькі бобові та зернові культури преміумкласу (нут, сочевиця, квасоля, булгур) з оптичною чистотою Sortex, експорт із порту Мерсін.',
  ar: 'بقوليات وحبوب تركية فاخرة (حمص كابولي، عدس أحمر وأخضر، فاصوليا بيضاء، برغل) بنقاوة بوهلر سورتكس، تصدير عالمي من ميناء مرسين.',
  fa: 'حبوبات و غلات ممتاز ترکیه (نخود کابولی، عدس قرمز و سبز، لوبیا سفید، بلغور) با خلوص اپتیکال سورتکس، صادرات از بندر مرسین.',
  he: 'קטניות ודגנים איכותיים מטורקיה (חומוס, עדשים, שעועית לבנה, בורגול) באיכות סורטקס אופטית, מיוצאים מנמל מרסין.',
  hi: 'तुर्किये से प्रीमियम दालें और अनाज (काबुली चना, मसूर दाल, सफेद बीन्स, दलिया) सॉर्टेक्स शुद्धता के साथ मर्सिन पोर्ट से वैश्विक निर्यात।',
  ur: 'ترکیہ سے اعلیٰ معیار کی دالیں اور اناج (کابلی چنا، سرخ و سبز مسور، سفید لوبیا، دلیا) سارٹیکس صفائی کے ساتھ مرسین بندرگاہ سے برآمد۔',
  'zh-cn': '来自土耳其的高品质豆类与谷物（卡布里鹰嘴豆、红扁豆、绿扁豆、白芸豆、硬粒小麦和碾碎小麦），经布勒光电色选，自梅尔辛港出口全球。',
  ja: 'トルコ産高品質の豆類・穀物（ひよこ豆、レンズ豆、インゲン豆、ブルグル、デュラム小麦）。ビューラーSortex光学選別によりメルシン港から世界へ輸出。',
  ko: '메르신 항구에서 전 세계로 수출되는 튀르키예산 프리미엄 두류 및 곡물(병아리콩, 렌틸콩, 백강낭콩, 불구르, 듀럼밀). 뷜러 소텍스 광학 선별 적용。',
  id: 'Kacang-kacangan dan biji-bijian premium dari Türkiye (kacang arab, miju-miju, kacang putih, bulgur) dengan kemurnian Sortex, diekspor dari Pelabuhan Mersin.',
  ms: 'Kekacang dan bijirin premium dari Türkiye (kacang kuda, lentil, kacang putih, bulgur) dengan ketulenan Sortex, dieksport dari Pelabuhan Mersin.',
  pt: 'Leguminosas e grãos premium da Turquia (grão-de-bico, lentilhas, feijão branco, bulgur) com pureza óptica Sortex, exportados do Porto de Mersin.',
  sr: 'Turske mahunarke i žitarice za veleprodaju. Nilasya Agro Foods isporučuje naut, sočivo, pasulj, grašak, durum pšenicu i bulgur preko luke Mersin.',
  ka: 'თურქული პარკოსნები და მარცვლეული საბითუმო ექსპორტისთვის. Nilasya Agro Foods გთავაზობთ მუხუდოს, ოსპს, ლობიოს, ბარდას, ხორბალსა და ბულგურს მერსინის პორტიდან.',
  az: 'Türkiyədən topdan paxlalılar və taxıl ixracı. Nilasya Agro Foods Mersin limanından noxud, mərcimək, lobya, quru noxud, durum buğdası və bulqur təklif edir.',
  uz: 'Turkiyadan ulgurji dukkakli va don mahsulotlari eksporti. Nilasya Agro Foods Mersin portidan no‘xat, yasmiq, loviya, bug‘doy va bulg‘ur yetkazib beradi.',
  kk: 'Түркиядан бұршақ және астық өнімдерін көтерме экспорттау. Nilasya Agro Foods Мерсин портынан ноқат, жасымық, үрме бұршақ, бидай және булгур ұсынады.',
  bn: 'তুরস্ক থেকে পাইকারি ডাল ও শস্য রপ্তানি। Nilasya Agro Foods মেরসিন বন্দর থেকে ছোলা, মসুর, শিম, মটর, ডুরাম গম ও বুলগুর সরবরাহ করে।',
  sw: 'Mikunde na nafaka kutoka Uturuki kwa biashara ya jumla. Nilasya Agro Foods husafirisha njegere, dengu, maharagwe, ngano durum na bulgur kupitia bandari ya Mersin.',
  cs: 'Prémiové luštěniny a obiloviny z Turecka (cizrna, čočka, bílé fazole, bulgur) s optickou čistotou Sortex, exportované z přístavu Mersin.',
};

export function localizedSeoDescription(lang: string, subject?: string) {
  const description = descriptions[lang] || descriptions.en;
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
