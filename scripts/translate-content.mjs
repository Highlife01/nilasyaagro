import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { createRequire } from 'node:module';

const { translate: bingTranslate } = createRequire(import.meta.url)('bing-translate-api');

const root = new URL('../', import.meta.url);
const cacheFile = new URL('../.translation-cache.json', import.meta.url);
// Keep in sync with src/data/languages.ts. 'en' is the source language and
// 'tr' is hand-written premium content; both are never machine translated.
// NOTE: 'he' and 'cs' were removed — they are NOT in supportedLanguages.
const targetLanguages = [
  'ar', 'ru', 'de', 'fr', 'es', 'it', 'pt', 'nl', 'pl', 'ro', 'bg', 'el', 'sr',
  'uk', 'ka', 'az', 'uz', 'kk', 'fa', 'hi', 'ur', 'bn', 'zh-cn', 'ja', 'ko',
  'id', 'ms', 'sw',
];
const selectedLanguages = process.env.TRANSLATE_LANGS ? process.env.TRANSLATE_LANGS.split(',') : targetLanguages;
const bingCodes = { 'zh-cn': 'zh-Hans', sr: 'sr-Latn' };
const protectedTerms = ['Nilasya Agro Foods', 'Bühler Sortex', 'Sortex', 'ISO 22000', 'HACCP', 'Incoterm', 'CIF', 'CFR', 'FOB', 'FCA', 'EXW', 'RFQ', 'B2B', '20ft FCL', '40ft FCL', 'Türkiye', '{product}'];
// Re-translate entries whose current value is a verbatim copy of the English
// source (a past translation failure). Set RETRANSLATE_IDENTICAL=0 to skip.
const retranslateIdentical = process.env.RETRANSLATE_IDENTICAL !== '0';

async function loadTypeScript(file, exportName) {
  const source = await readFile(new URL(file, root), 'utf8');
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const loadedModule = { exports: {} };
  vm.runInNewContext(`(function(exports,module,require){${output}\n})(loadedModule.exports,loadedModule,()=>({}))`, { loadedModule });
  return loadedModule.exports[exportName];
}

const cache = existsSync(cacheFile) ? JSON.parse(await readFile(cacheFile, 'utf8')) : {};

function protect(text) {
  let value = text;
  const terms = [];
  for (const term of protectedTerms) {
    value = value.split(term).join(`__NGTERM_${terms.length}__`);
    terms.push(term);
  }
  return { value, terms };
}

function restore(text, terms) {
  let value = text;
  terms.forEach((term, index) => { value = value.split(`__NGTERM_${index}__`).join(term); });
  return value.replaceAll('&amp;', '&').replaceAll('&#39;', "'").replaceAll('&quot;', '"').trim();
}

async function translateBatch(strings, language) {
  const results = new Array(strings.length);
  const pending = [];
  strings.forEach((text, index) => {
    const key = `${language}\u0000${text}`;
    if (cache[key]) results[index] = cache[key];
    else pending.push({ text, index, key });
  });

  let cursor = 0;
  async function translateText(text, languageCode, attempt = 1) {
    if (text.length <= 850) {
      try {
        return (await bingTranslate(text, 'en', languageCode)).translation;
      } catch (error) {
        if (attempt >= 3) throw error;
        await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
        return translateText(text, languageCode, attempt + 1);
      }
    }
    const paragraphs = text.split(/(\n{2,})/);
    const output = [];
    for (const paragraph of paragraphs) {
      if (/^\n+$/u.test(paragraph) || !paragraph.trim()) { output.push(paragraph); continue; }
      if (paragraph.length <= 850) output.push(await translateText(paragraph, languageCode, attempt));
      else {
        const chunks = paragraph.match(/[\s\S]{1,800}(?:\s|$)/g) || [paragraph];
        for (const chunk of chunks) output.push(await translateText(chunk, languageCode, attempt));
      }
    }
    return output.join('');
  }
  async function worker() {
    while (cursor < pending.length) {
      const item = pending[cursor++];
      const protectedItem = protect(item.text);
      const response = await translateText(protectedItem.value, bingCodes[language] || language);
      const translated = restore(response, protectedItem.terms);
      results[item.index] = translated;
      cache[item.key] = translated;
    }
  }
  await Promise.all(Array.from({ length: Math.min(10, pending.length) }, () => worker()));
  await writeFile(cacheFile, JSON.stringify(cache, null, 2));
  return results;

  /* Batched fallback retained for providers that preserve delimiters reliably.
  for (let offset = 0; offset < pending.length;) {
    const batch = [];
    let length = 0;
    while (offset < pending.length && batch.length < 30 && length + pending[offset].text.length < 850) {
      batch.push(pending[offset++]);
      length += batch.at(-1).text.length;
    }
    const protectedBatch = batch.map(({ text }) => protect(text));
    const delimiter = '\n[|||NG_SPLIT|||]\n';
    const response = await bingTranslate(protectedBatch.map(({ value }) => value).join(delimiter), 'en', bingCodes[language] || language);
    let parts = response.translation.split(delimiter);
    if (parts.length !== batch.length) {
      parts = [];
      for (const { value } of protectedBatch) {
        const single = await bingTranslate(value, 'en', bingCodes[language] || language);
        parts.push(single.translation);
        await new Promise((resolve) => setTimeout(resolve, 150));
      }
    }
    parts.forEach((part, localIndex) => {
      const item = batch[localIndex];
      const translated = restore(part, protectedBatch[localIndex].terms);
      results[item.index] = translated;
      cache[item.key] = translated;
    });
    await writeFile(cacheFile, JSON.stringify(cache, null, 2));
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  return results;
  */
}

function collectStrings(value, paths = [], strings = []) {
  if (typeof value === 'string') strings.push({ path: paths, value });
  else if (Array.isArray(value)) value.forEach((item, index) => collectStrings(item, [...paths, index], strings));
  else if (value) Object.entries(value).forEach(([key, item]) => collectStrings(item, [...paths, key], strings));
  return strings;
}

function setPath(object, path, value) {
  let target = object;
  for (let index = 0; index < path.length - 1; index++) target = target[path[index]];
  target[path.at(-1)] = value;
}

async function translateInterface() {
  const data = await loadTypeScript('src/data/translationsData.ts', 'translationsData');
  const sourceStrings = collectStrings(data.en);
  for (const language of selectedLanguages) {
    const translated = await translateBatch(sourceStrings.map(({ value }) => value), language);
    const localized = structuredClone(data.en);
    sourceStrings.forEach(({ path }, index) => setPath(localized, path, translated[index]));
    data[language] = localized;
    console.log(`Translated UI dictionary: ${language} (${translated.length} strings)`);
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }
  const output = `import { Translations } from './translations';\n\nexport const translationsData: Record<string, Translations> = ${JSON.stringify(data, null, 2)};\n`;
  await writeFile(new URL('src/data/translationsData.ts', root), output);
}

function findLocalizedNodes(value, nodes = []) {
  if (!value || typeof value !== 'object') return nodes;
  if (!Array.isArray(value) && ('en' in value) && (typeof value.en === 'string' || Array.isArray(value.en))) {
    nodes.push(value);
    return nodes;
  }
  if (Array.isArray(value)) value.forEach((item) => findLocalizedNodes(item, nodes));
  else Object.values(value).forEach((item) => findLocalizedNodes(item, nodes));
  return nodes;
}

// Select nodes whose translation for `language` is missing OR a verbatim copy
// of the English source (past provider failure silently persisted).
function needsTranslation(node, language) {
  const value = node[language];
  if (value === undefined || value === null) return true;
  if (retranslateIdentical) {
    const norm = (text) => (Array.isArray(text) ? text.join('\n') : String(text)).replace(/\s+/g, ' ').trim().toLowerCase();
    const en = norm(node.en);
    if (en && norm(value) === en) return true;
  }
  return false;
}

function applyTranslations(nodes, language, translated, logLabel) {
  let cursor = 0;
  for (const node of nodes) {
    if (Array.isArray(node.en)) node[language] = node.en.map(() => translated[cursor++]);
    else node[language] = translated[cursor++];
  }
  console.log(`Translated ${logLabel}: ${language} (${translated.length} strings)`);
}

async function translateProducts() {
  const products = await loadTypeScript('src/data/products.ts', 'productsData');
  const nodes = findLocalizedNodes(products);
  for (const language of selectedLanguages) {
    const missing = nodes.filter((node) => needsTranslation(node, language));
    const sources = missing.flatMap((node) => Array.isArray(node.en) ? node.en : [node.en]);
    const translated = await translateBatch(sources, language);
    let cursor = 0;
    for (const node of missing) {
      if (Array.isArray(node.en)) node[language] = node.en.map(() => translated[cursor++]);
      else node[language] = translated[cursor++];
    }
    console.log(`Translated product content: ${language} (${sources.length} strings)`);
  }
  const output = `import { Product } from '@/types';\n\nexport const productsData: Product[] = ${JSON.stringify(products, null, 2)};\n`;
  await writeFile(new URL('src/data/products.ts', root), output);
}

async function translateDataset(file, exportName, outputPrefix) {
  const data = await loadTypeScript(file, exportName);
  const nodes = findLocalizedNodes(data);
  for (const language of selectedLanguages) {
    const missing = nodes.filter((node) => needsTranslation(node, language));
    const sources = missing.flatMap((node) => Array.isArray(node.en) ? node.en : [node.en]);
    const translated = await translateBatch(sources, language);
    let cursor = 0;
    for (const node of missing) {
      if (Array.isArray(node.en)) node[language] = node.en.map(() => translated[cursor++]);
      else node[language] = translated[cursor++];
    }
    console.log(`Translated ${exportName}: ${language} (${sources.length} strings)`);
  }
  await writeFile(new URL(file, root), `${outputPrefix}${JSON.stringify(data, null, 2)};\n`);
}

// Localized page translations (pageTranslationsData.ts). Unlike datasets this
// is a Record<lang, tree> where every leaf string is translatable; the tree
// shape comes from baseEnglish in pageTranslations.ts. baseEnglish exposes
// whatsapp.msgProduct as a function, but localized data stores a
// msgProductTemplate string with a literal '{product}' placeholder — the
// placeholder is listed in protectedTerms so providers never mangle it.
function buildPageSource(base) {
  const source = structuredClone(base);
  if (typeof base.whatsapp?.msgProduct === 'function') {
    source.whatsapp = {
      ...base.whatsapp,
      msgProductTemplate: base.whatsapp.msgProduct('{product}'),
    };
    delete source.whatsapp.msgProduct;
  }
  return source;
}

async function translatePages() {
  const base = await loadTypeScript('src/data/pageTranslations.ts', 'baseEnglish');
  const source = buildPageSource(base);
  const strings = collectStrings(source);
  const existing = await loadTypeScript('src/data/pageTranslationsData.ts', 'pageTranslationsData');
  for (const language of selectedLanguages) {
    const translated = await translateBatch(strings.map(({ value }) => value), language);
    const localized = {};
    strings.forEach((s, index) => {
      const path = s.path;
      let target = localized;
      for (let i = 0; i < path.length - 1; i++) target = target[path[i]] ??= {};
      target[path.at(-1)] = translated[index];
    });
    existing[language] = localized;
    console.log(`Translated page translations: ${language} (${translated.length} strings)`);
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }
  const output = `import type { LocalizedPageTranslations } from './pageTranslations';\n\nexport const pageTranslationsData: Record<string, LocalizedPageTranslations> = ${JSON.stringify(existing, null, 2)};\n`;
  await writeFile(new URL('src/data/pageTranslationsData.ts', root), output);
}

await mkdir(new URL('scripts/', root), { recursive: true });
await translateInterface();
if (process.env.TRANSLATE_PRODUCTS === '1') await translateProducts();
if (process.env.TRANSLATE_INSIGHTS === '1') await translateDataset('src/data/insights.ts', 'insightArticles', "import { InsightArticle } from '@/types';\n\nexport const insightArticles: InsightArticle[] = ");
if (process.env.TRANSLATE_COUNTRIES === '1') await translateDataset('src/data/countries.ts', 'exportCountriesData', `export interface ExportCountry {\n  id: string; slug: string; name: Record<string, string>; flag: string; region: 'Europe / EU' | 'Middle East & Gulf' | 'CIS & Eastern Europe' | 'Asia & Pacific' | 'Americas & Global'; mainPorts: string; transitTime: { road?: string; sea?: string; air?: string }; popularProduce: string[]; documents: string[]; incoterms: string[]; overview: Record<string, string>; geoAnswer: Record<string, string>;\n}\n\nexport const exportCountriesData: ExportCountry[] = `);
if (process.env.TRANSLATE_PAGES === '1') await translatePages();
console.log('Translation data generated successfully.');
