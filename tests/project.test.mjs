import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function run(name, check) {
  await check();
  console.log(`✓ ${name}`);
}

await run('all configured locales are published', async () => {
  const source = await readFile(new URL('../src/data/languages.ts', import.meta.url), 'utf8');
  assert.equal([...source.matchAll(/code: '([^']+)'/gu)].length, 30);
});

await run('forms use a real WhatsApp handoff and no fake timer', async () => {
  for (const path of [
    '../src/app/[lang]/contact/ClientContactForm.tsx',
    '../src/app/[lang]/quote/QuoteClientWrapper.tsx',
    '../src/components/rfq/RFQModal.tsx',
  ]) {
    const source = await readFile(new URL(path, import.meta.url), 'utf8');
    assert.match(source, /whatsappHref/u);
    assert.doesNotMatch(source, /setTimeout\s*\(/u);
  }
});

await run('sitemap is generated from the application data', async () => {
  const source = await readFile(new URL('../src/app/sitemap.ts', import.meta.url), 'utf8');
  assert.match(source, /productsData/u);
  assert.match(source, /exportCountriesData/u);
  assert.match(source, /insightArticles/u);
});

await run('llms.txt and llms-full.txt are populated and valid for both official domains', async () => {
  const llms = await readFile(new URL('../public/llms.txt', import.meta.url), 'utf8');
  const llmsFull = await readFile(new URL('../public/llms-full.txt', import.meta.url), 'utf8');
  const llmsTr = await readFile(new URL('../public/llms-tr.txt', import.meta.url), 'utf8');
  const llmsAr = await readFile(new URL('../public/llms-ar.txt', import.meta.url), 'utf8');
  assert.ok(llms.includes('# Nilasya Agro Foods'));
  assert.ok(llms.includes('export@nilasyaagrofoods.com.tr'));
  assert.ok(llms.includes('https://www.nilasyaagrofoods.com.tr'));
  assert.ok(llms.includes('https://nilasyaagrofoods.com.tr'));
  assert.ok(llmsFull.includes('# Nilasya Agro Foods'));
  assert.ok(llmsFull.includes('https://www.nilasyaagrofoods.com.tr'));
  assert.ok(llmsFull.includes('https://nilasyaagrofoods.com.tr'));
  assert.ok(llmsTr.includes('https://www.nilasyaagrofoods.com.tr'));
  assert.ok(llmsTr.includes('https://nilasyaagrofoods.com.tr'));
  assert.ok(llmsAr.includes('https://www.nilasyaagrofoods.com.tr'));
  assert.ok(llmsAr.includes('https://nilasyaagrofoods.com.tr'));
});

await run('SEO configuration binds both www.nilasyaagrofoods.com.tr and nilasyaagrofoods.com.tr', async () => {
  const companySource = await readFile(new URL('../src/data/company.ts', import.meta.url), 'utf8');
  const robotsSource = await readFile(new URL('../src/app/robots.ts', import.meta.url), 'utf8');
  const structuredDataSource = await readFile(new URL('../src/lib/structuredData.ts', import.meta.url), 'utf8');
  assert.match(companySource, /baseUrl:\s*'https:\/\/www\.nilasyaagrofoods\.com\.tr'/u);
  assert.match(companySource, /apexUrl:\s*'https:\/\/nilasyaagrofoods\.com\.tr'/u);
  assert.match(companySource, /wwwDomain:\s*'www\.nilasyaagrofoods\.com\.tr'/u);
  assert.match(companySource, /domain:\s*'nilasyaagrofoods\.com\.tr'/u);
  assert.match(robotsSource, /host:\s*company\.baseUrl/u);
  assert.match(robotsSource, /sitemap:\s*`\$\{company\.baseUrl\}\/sitemap\.xml`/u);
  assert.match(structuredDataSource, /company\.apexUrl/u);
  assert.match(structuredDataSource, /company\.wwwDomain/u);
});

console.log('All project checks passed.');

