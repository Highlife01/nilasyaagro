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
    assert.match(source, /createWhatsAppUrl/u);
    assert.doesNotMatch(source, /setTimeout\s*\(/u);
  }
});

await run('sitemap is generated from the application data', async () => {
  const source = await readFile(new URL('../src/app/sitemap.ts', import.meta.url), 'utf8');
  assert.match(source, /productsData/u);
  assert.match(source, /exportCountriesData/u);
  assert.match(source, /insightArticles/u);
});

await run('llms.txt and llms-full.txt are populated and valid', async () => {
  const llms = await readFile(new URL('../public/llms.txt', import.meta.url), 'utf8');
  const llmsFull = await readFile(new URL('../public/llms-full.txt', import.meta.url), 'utf8');
  assert.ok(llms.includes('# Nilasya Agro Foods'));
  assert.ok(llms.includes('export@nilasyaagrofoods.com.tr'));
  assert.ok(llmsFull.includes('# Nilasya Agro Foods'));
});

console.log('All project checks passed.');

