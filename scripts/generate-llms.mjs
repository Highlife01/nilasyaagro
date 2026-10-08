import { readFile, writeFile } from 'node:fs/promises';
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
const productUrl = (product) => `${company.baseUrl}/en/products/${product.slug.en || product.id}/`;
const identity = [
  `- Brand: ${company.name}`, `- Legal entity: ${company.legalName}`,
  `- Website: ${company.baseUrl}`, `- Trade desk: ${company.headquarters}`,
  `- Email: ${company.email}`, `- Telephone / WhatsApp: ${company.phoneDisplay}`,
];
const overview = [
  `# ${company.name}`, '',
  '> Turkish B2B supplier and exporter of pulses, grains and agricultural commodities. Product specifications and trade information are available on the official pages below.', '',
  '## Company and contact', '', ...identity, '',
  '## Product catalogue', '', ...productsData.map((product) => `- [${product.name.en}](${productUrl(product)}): ${product.shortDescription.en}`), '',
  '## Buyer information', '',
  `- [Request an export quotation](${company.baseUrl}/en/quote/)`,
  `- [Packaging](${company.baseUrl}/en/packaging/)`,
  `- [Quality and traceability](${company.baseUrl}/en/quality/)`,
  `- [Harvest calendar](${company.baseUrl}/en/harvest-calendar/)`,
  `- [Export destinations](${company.baseUrl}/en/export/)`,
  `- [Contact](${company.baseUrl}/en/contact/)`,
  `- [Full catalogue context](${company.baseUrl}/llms-full.txt)`,
  `- [XML sitemap](${company.baseUrl}/sitemap.xml)`, '',
  '## Commercial context', '',
  'Specifications describe the published catalogue. Confirm the requested lot, origin, analytical results, documentation, availability, pricing and delivery terms with the trade desk. Transit times are estimates. These files provide reference context; they do not certify products or guarantee search visibility.', '',
].join('\n');

const detail = [`# ${company.name} — Catalogue and export reference`, '', ...identity, '',
  'This reference is generated from the same company, product, country and article data used by the website. For a transaction, request a current quotation and shipment-specific specifications.', ''];
for (const product of productsData) {
  detail.push(`## ${product.name.en}`, '', `Source: ${productUrl(product)}`, '', product.fullDescription.en, '', `Scientific name: ${product.scientificName}`, '');
  const spec = product.specifications;
  for (const [key, label] of Object.entries({ origin: 'Origin', size: 'Size', caliber: 'Caliber', purity: 'Purity', moisture: 'Moisture', protein: 'Protein', broken: 'Broken kernels', foreignMatter: 'Foreign matter', damaged: 'Damaged kernels', shelfLife: 'Shelf life', storageTemp: 'Storage temperature', optimalHumidity: 'Storage humidity' })) {
    if (spec[key]) detail.push(`- ${label}: ${spec[key]}`);
  }
  detail.push('', '### Varieties', '');
  for (const variety of product.varieties || []) {
    const slug = typeof variety.slug === 'string' ? variety.slug : variety.id || variety.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    detail.push(`- [${variety.name}](${productUrl(product)}${slug.toLowerCase()}/): ${variety.description}`);
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
await writeFile(new URL('../public/llms.txt', import.meta.url), overview);
await writeFile(new URL('../public/llms-full.txt', import.meta.url), detail.join('\n'));
console.log(`Generated LLM references for ${productsData.length} products and ${exportCountriesData.length} destinations.`);
