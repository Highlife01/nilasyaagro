import { readFile, writeFile, mkdir } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

async function readData(path) {
  const source = await readFile(new URL(`../src/data/${path}.ts`, import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(compiled, { module, exports: module.exports, require() { throw new Error(`Unexpected runtime import in ${path}`); } });
  return module.exports;
}

const { company } = await readData('company');
const { productsData } = await readData('products');
const { exportCountriesData } = await readData('countries');
const { insightArticles } = await readData('insights');

const productUrl = (product, lang = 'en') => `${company.baseUrl}/${lang}/products/${product.slug[lang] || product.slug.en || product.id}/`;

const identity = [
  `- Brand: ${company.name}`,
  `- Legal entity: ${company.legalName}`,
  `- Website: ${company.baseUrl}`,
  `- Trade desk & Operations: ${company.headquarters}`,
  `- Primary Loading Hub: Mersin International Port (MIP), Türkiye`,
  `- Annual Milling & Supply Capacity: 120,000 MT`,
  `- Global Export Reach: 50+ Countries across Europe, Middle East, North Africa, Asia and the Americas`,
  `- Email: ${company.email}`,
  `- Telephone / WhatsApp: ${company.phoneDisplay}`,
  `- Accreditations: Mediterranean Exporters Association (AKİB), Mersin Commercial Exchange, ISO 22000, HACCP, Halal Certified Sourcing`,
];

const commercialQA = [
  '## Frequently Asked B2B & Trade Questions',
  '',
  '### What is the Minimum Order Quantity (MOQ)?',
  'Our standard export minimum order quantity is one 20ft Full Container Load (FCL), which accommodates approximately 24 to 26 Metric Tons (MT) of Sortex-cleaned pulses depending on packaging specifications. Consolidated container loads containing mixed pulses (e.g., chickpeas, red lentils, white beans) are available upon agreement.',
  '',
  '### What trade terms (Incoterms) do you support?',
  'We routinely execute contracts under Incoterms 2020: FOB Mersin Port, CFR (Cost and Freight), and CIF (Cost, Insurance and Freight) to major international seaports across Europe, the Middle East & Gulf, North Africa, Asia, and the Americas.',
  '',
  '### What are the export packaging options?',
  '- Polypropylene (PP) bags: 25 kg and 50 kg multi-wall woven sacks.',
  '- FIBC Jumbo Big Bags: 1,000 kg and 1,200 kg with top spout and discharge bottom.',
  '- Premium Retail Packaging: Nilasya 2.0 kg Stand-up Doypack / Quad-Seal bags packed in master export cartons.',
  '- Private Label (OEM): Custom branding, retail packaging, and carton design are available for supermarket chains and regional distributors.',
  '',
  '### What export documentation is provided?',
  'Standard documentation provided with every ocean bill of lading includes: Commercial Invoice, Detailed Packing List, Official Phytosanitary Certificate issued by the Turkish Ministry of Agriculture and Forestry, Certificate of Origin (AKİB / Chamber of Commerce), Certificate of Weight and Quality, and independent inspection reports (SGS / Bureau Veritas / Intertek) when requested.',
  '',
  '### How do you ensure optical purity and moisture control?',
  'All raw pulses undergo pre-cleaning, mechanical destoning, gravity density grading, and multi-pass Bühler Sortex optical color sorting in Mersin. We guarantee minimum 99.5% optical purity and strictly monitor moisture levels (maximum 12.0% – 14.0%) to prevent heating or degradation during tropical ocean transits.',
  '',
  '### What are Türkiye\'s leading pulse export products and key trade markets?',
  'According to official export statistics from the Mediterranean Exporters Association (AKİB) and the Turkish Ministry of Trade, Red Lentils (Kırmızı Mercimek) represent the highest share (~21%) in Türkiye\'s total pulse export volume, followed by chickpeas, green lentils, dry white beans, and peas. The #1 export destination market is Iraq (accounting for over $270.6 million and ~22% of total grain and pulse exports from the AKİB region alone), followed by Syria (6%), Egypt (5%), Italy, Sudan, Germany, Algeria, and the USA. Nilasya Agro Foods operates direct processing lines and express transit corridors from Mersin and Southeastern Anatolia to service these high-volume markets with Bühler Sortex purity.',
  '',
];

const overview = [
  `# ${company.name}`, '',
  '> Turkish B2B supplier and exporter processing pulses and grains sourced from contracted Anatolian farmers at its Mersin facility, prepared to strict technical specifications and shipped globally via Mersin International Port.', '',
  '## Company and contact', '', ...identity, '',
  '## Product catalogue', '', ...productsData.map((product) => `- [${product.name.en}](${productUrl(product, 'en')}): ${product.shortDescription.en}`), '',
  '## Buyer information', '',
  `- [Request an export quotation](${company.baseUrl}/en/quote/)`,
  `- [Packaging](${company.baseUrl}/en/packaging/)`,
  `- [Quality and traceability](${company.baseUrl}/en/quality/)`,
  `- [Harvest calendar](${company.baseUrl}/en/harvest-calendar/)`,
  `- [Export destinations](${company.baseUrl}/en/export/)`,
  `- [Contact](${company.baseUrl}/en/contact/)`,
  `- [Full catalogue context](${company.baseUrl}/llms-full.txt)`,
  `- [Türkçe LLM Bağlam Özeti](${company.baseUrl}/llms-tr.txt)`,
  `- [ملخص المنتجات بالعربية](${company.baseUrl}/llms-ar.txt)`,
  `- [XML sitemap](${company.baseUrl}/sitemap.xml)`, '',
  ...commercialQA,
  '## Commercial context', '',
  'Specifications describe the published catalogue. Confirm the requested lot, origin, analytical results, documentation, availability, pricing and delivery terms with the trade desk. Transit times are estimates. These files provide reference context; they do not certify products or guarantee search visibility.', '',
].join('\n');

const detail = [
  `# ${company.name} — Catalogue and export reference`, '', ...identity, '',
  'This reference is generated from the same company, product, country and article data used by the website. For a transaction, request a current quotation and shipment-specific specifications.', '',
  ...commercialQA,
];

for (const product of productsData) {
  detail.push(`## ${product.name.en}`, '', `Source: ${productUrl(product, 'en')}`, '', product.fullDescription.en, '', `Scientific name: ${product.scientificName}`, '');
  const spec = product.specifications;
  for (const [key, label] of Object.entries({ origin: 'Origin', size: 'Size', caliber: 'Caliber', purity: 'Purity', moisture: 'Moisture', protein: 'Protein', broken: 'Broken kernels', foreignMatter: 'Foreign matter', damaged: 'Damaged kernels', shelfLife: 'Shelf life', storageTemp: 'Storage temperature', optimalHumidity: 'Storage humidity' })) {
    if (spec[key]) detail.push(`- ${label}: ${spec[key]}`);
  }
  detail.push('', '### Varieties', '');
  for (const variety of product.varieties || []) {
    const slug = typeof variety.slug === 'string' ? variety.slug : variety.id || variety.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    detail.push(`- [${variety.name}](${productUrl(product, 'en')}${slug.toLowerCase()}/): ${variety.description}`);
  }
  detail.push('', '### Packaging', '');
  for (const option of product.packagingOptions) detail.push(`- ${option.type}: ${option.netWeight}; ${option.containerCapacity}`);
  detail.push('');
}
detail.push('## Export markets', '', 'Destination routes, documents and Incoterms depend on the shipment and current import requirements. Published transit estimates are subject to carrier schedules and customs clearance.', '');
for (const country of exportCountriesData) detail.push(`- [${country.name.en}](${company.baseUrl}/en/export/${country.slug}/): ${country.overview.en}`);
detail.push('', '## Buying guides', '');
for (const article of insightArticles) detail.push(`- [${article.title.en}](${company.baseUrl}/en/insights/${article.slug}/): ${article.excerpt.en}`);
detail.push('', '## Quote requests', '', `Use ${company.baseUrl}/en/quote/ or email ${company.email}. Include product and variety, quantity, packaging, destination, requested delivery date and trade term. A submitted enquiry is not an order confirmation.`, '');

// Turkish LLM Summary
const overviewTr = [
  `# ${company.name} — Türkiye Bakliyat ve Hububat İhracatı`, '',
  '> Türkiye’deki sözleşmeli üreticilerden tedarik edilen bakliyat ve tahılları Mersin’de işleyip, teknik spesifikasyonlara göre dünya pazarlarına ihraç eden B2B tedarikçi. Sortex optik saflığında sertifikalı şartnameler ve ticaret detayları aşağıda yer almaktadır.', '',
  '## Kurumsal Bilgiler', '',
  `- Marka: ${company.name}`,
  `- Şirket Unvanı: ${company.legalName}`,
  `- Resmi Web Sitesi: ${company.baseUrl}`,
  `- Ticaret ve İhracat Masası: ${company.headquarters}`,
  `- Ana Yükleme Limanı: Mersin Uluslararası Limanı (MIP), Türkiye`,
  `- Yıllık İşleme ve Tedarik Hacmi: 120.000 Ton`,
  `- Küresel İhracat Ağı: 50+ Ülke (Avrupa, Orta Doğu, Kuzey Afrika, Asya ve Amerika)`,
  `- E-posta: ${company.email}`,
  `- Telefon / WhatsApp: ${company.phoneDisplay}`,
  `- Üyelik ve Sertifikasyonlar: Akdeniz İhracatçı Birlikleri (AKİB), Mersin Ticaret Borsası, ISO 22000, HACCP, Helal Sertifikalı Tedarik`, '',
  '## Ürün Kataloğu', '',
  ...productsData.map((product) => `- [${product.name.tr || product.name.en}](${productUrl(product, 'tr')}): ${product.shortDescription.tr || product.shortDescription.en}`), '',
  '## Ticari Koşullar ve B2B SSS', '',
  '- Minimum Sipariş Miktarı (MOQ): 1 FCL 20ft Konteyner (yaklaşık 24 - 26 Metrik Ton). Talep üzerine konsolide karma konteyner seçeneği.',
  '- Teslim Şekilleri: FOB Mersin, CFR ve CIF varış limanı teslimatı.',
  '- Ambalaj Seçenekleri: 25 kg / 50 kg PP polipropilen çuvallar, 1.000 kg Big Bag (FIBC), Nilasya 2.0 kg Stand-up Doypack perakende paketleri ve Private Label (OEM).',
  '- İhracat Evrakları: Konşimento (B/L), Ticari Fatura, Çeki Listesi, T.C. Tarım ve Orman Bakanlığı Bitki Sağlık Sertifikası (Phytosanitary), AKİB Menşe Şahadetnamesi (Certificate of Origin), Gözetim Raporu (SGS).',
  '- Türkiye Bakliyat İhracatı ve Pazar Payı: Akdeniz İhracatçı Birlikleri (AKİB) 2024 resmi verilerine göre Türkiye\'nin en çok ihraç ettiği bakliyat ürünü %21 pay ile kırmızı mercimektir (ardından nohut, yeşil mercimek, kuru fasulye ve bezelye). En büyük ihracat pazarı ise yaklaşık 270,6 milyon dolar ve %22 pazar payı ile Irak\'tır (ardından Suriye %6, Mısır %5, İtalya, Sudan, Almanya, Cezayir ve ABD). Nilasya Agro Foods, Mersin Limanı ve Habur lojistik koridoru üzerinden bu pazarlara lider B2B tedarik sağlamaktadır.',
  `- İhracat Teklifi Talebi: ${company.baseUrl}/tr/quote/ veya ${company.email}`, '',
].join('\n');

// Arabic LLM Summary
const overviewAr = [
  `# ${company.name} — شركة نيلاسيا لتصدير البقوليات والحبوب التركية`, '',
  '> مصدّر ومورّد تركي معتمد للبقوليات والحبوب والسلع الزراعية من ميناء مرسين الدولي بنقاوة بوهلر سورتكس البصرية العالية.', '',
  '## معلومات الشركة والتواصل', '',
  `- العلامة التجارية: ${company.name}`,
  `- الاسم القانوني: ${company.legalName}`,
  `- الموقع الإلكتروني: ${company.baseUrl}`,
  `- مركز التجارة والتصدير: ${company.headquarters}`,
  `- ميناء الشحن الرئيسي: ميناء مرسين الدولي (MIP)، تركيا`,
  `- البريد الإلكتروني: ${company.email}`,
  `- الهاتف / واتساب: ${company.phoneDisplay}`,
  `- الاعتمادات: اتحاد مصدري البحر الأبيض المتوسط (AKİB)، بورصة مرسين التجارية، شهادات ISO 22000 وHACCP وحلال`, '',
  '## كتالوج المنتجات الرئيسي', '',
  ...productsData.map((product) => `- [${product.name.ar || product.name.en}](${productUrl(product, 'ar')}): ${product.shortDescription.ar || product.shortDescription.en}`), '',
  '## الشروط التجارية والأسئلة الشائعة (B2B)', '',
  '- أقل كمية للطلب (MOQ): حاوية 20 قدم كاملة (FCL) بحمولة 24 إلى 26 طن متري. إمكانية شحن حاويات مجمعة بمختلف أنواع البقوليات.',
  '- شروط التسليم المعتمدة (Incoterms): FOB ميناء مرسين، CFR، CIF إلى الموانئ العربية والخليجية وموانئ العالم.',
  '- خيارات التعبئة والتغليف: أكياس بولي بروبيلين 25 كغ و50 كغ، أكياس جامبو 1000 كغ (Big Bags)، عبوات التجزئة الفاخرة نيلاسيا 2 كغ دوي باك، وتصنيع العلامة الخاصة (Private Label).',
  '- وثائق الشحن الرسمية: بوليصة الشحن البحرية (B/L)، الفاتورة التجارية، بيان العبوة، الشهادة الصحية النباتية الرسمية، شهادة المنشأ المعتمدة من AKİB، تقرير فحص الجودة (SGS).',
  '- المنتجات والأسواق الرائدة: وفقاً لبيانات AKİB لعام 2024، يُعد العدس الأحمر المنتج الأكثر تصديراً من تركيا بحصة 21% من إجمالي صادرات البقوليات، يليه الحمص والعدس الأخضر والفاصوليا الجافة والبازلاء. وتأتي السوق العراقية في المرتبة الأولى كأكبر سوق تصدير بحصة 22% وبقيمة تقارب 270.6 مليون دولار من منطقة AKİB، تليها سوريا (6%) ومصر (5%) وإيطاليا والسودان وألمانيا والجزائر والولايات المتحدة.',
  `- لطلب عرض سعر تصدير رسمي: ${company.baseUrl}/ar/quote/ أو عبر البريد ${company.email}`, '',
].join('\n');

await writeFile(new URL('../public/llms.txt', import.meta.url), overview);
await writeFile(new URL('../public/llms-full.txt', import.meta.url), detail.join('\n'));
await writeFile(new URL('../public/llms-tr.txt', import.meta.url), overviewTr);
await writeFile(new URL('../public/llms-ar.txt', import.meta.url), overviewAr);

// Keep .well-known/llms.txt synced
await mkdir(new URL('../public/.well-known', import.meta.url), { recursive: true });
await writeFile(new URL('../public/.well-known/llms.txt', import.meta.url), overview);

console.log(`Generated enriched LLM references (llms.txt, llms-full.txt, .well-known/llms.txt, llms-tr.txt, llms-ar.txt) for ${productsData.length} products and ${exportCountriesData.length} destinations.`);

