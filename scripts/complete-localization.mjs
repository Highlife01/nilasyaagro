import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { createRequire } from 'node:module';

const { translate } = createRequire(import.meta.url)('bing-translate-api');
const root = new URL('../', import.meta.url);
const cacheFile = new URL('../.translation-cache.json', import.meta.url);
const codes = { 'zh-cn': 'zh-Hans', sr: 'sr-Latn' };
const protectedPattern = /Nilasya Agro Foods|Bühler Sortex|Sortex|Türkiye|WhatsApp|ISO\s+\d+|HACCP|GAFTA|SGS|ISPM\s+\d+|\b(?:B2B|RFQ|CIF|CFR|FOB|FCA|EXW|DAP|FCL|MT|PP|PE|FIBC|MIP|EUR|USD)\b|https?:\/\/[^\s)]+|[\w.+-]+@[\w.-]+\.[a-z]+|\{[a-zA-Z][\w]*\}|\d+(?:[.,]\d+)*(?:\s?(?:%|kg|mm|ft|°C|g|MT|cm|x\d+))?/gu;
const cache = existsSync(cacheFile) ? JSON.parse(await readFile(cacheFile, 'utf8')) : {};

async function load(file, exportName) {
  const source = await readFile(new URL(file, root), 'utf8');
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const result = { exports: {} };
  vm.runInNewContext(`(function(exports,module,require){${output}\n})(result.exports,result,()=>({}))`, { result });
  return result.exports[exportName];
}

function collect(value, path = [], entries = []) {
  if (typeof value === 'string') entries.push({ path, source: value });
  else if (value && typeof value === 'object') Object.entries(value).forEach(([key, child]) => collect(child, [...path, key], entries));
  return entries;
}

function setPath(value, path, text) {
  let target = value;
  for (const key of path.slice(0, -1)) target = target[key];
  target[path.at(-1)] = text;
}

function protect(source) {
  const tokens = [];
  const text = source.replace(protectedPattern, value => {
    tokens.push(value);
    return `__NGTERM_${tokens.length - 1}__`;
  });
  return { source, text, tokens };
}

function restore(translated, item) {
  let text = translated.trim();
  item.tokens.forEach((token, index) => {
    const key = `__NGTERM_${index}__`;
    if (text.split(key).length - 1 !== item.text.split(key).length - 1) throw new Error(`Translation changed protected token ${key}`);
    text = text.split(key).join(token);
  });
  if (/__NGTERM_|⟦\d+⟧/u.test(text)) throw new Error('Unresolved translation token');
  // A translated sentence must never be silently accepted as an English duplicate.
  const prose = item.source.replace(protectedPattern, '').replace(/[^\p{L}]+/gu, '');
  const sentenceWords = item.source.match(/(?<!\p{L})\p{Ll}[\p{L}]+/gu) || [];
  if (prose.length > 22 && sentenceWords.length >= 4 && text.toLocaleLowerCase() === item.source.trim().toLocaleLowerCase()) throw new Error(`Untranslated prose: ${item.source.slice(0, 60)}`);
  return text;
}

function segments(source) {
  // Keep Markdown block delimiters, emphasis, link destinations and newlines native.
  return source.split(/(\n)/u).map(line => {
    if (line === '\n' || !line.trim()) return { literal: line };
    const match = line.match(/^(\s*(?:#{1,6}\s+|[-*+]\s+|\d+\.\s+|>\s+)?)(.*?)(\s*)$/u);
    const prefix = match[1];
    const suffix = match[3];
    const body = match[2];
    // Translate text runs separately so Markdown markers can never be translated.
    const parts = body.split(/(\*\*|__|`[^`]+`|\[[^\]]+\]\([^)]+\))/u).flatMap(part => {
      if (!part) return { literal: '' };
      if (/^(?:\*\*|__|`[^`]+`)$/u.test(part)) return { literal: part };
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/u);
      if (link) return { source: link[1], wrap: text => `[${text}](${link[2]})` };
      const spaces = part.match(/^(\s*)(.*?)(\s*)$/u);
      if (!spaces[2]) return { literal: part };
      const chunks = [];
      let remaining = spaces[2];
      while (remaining.length > 420) {
        const split = remaining.lastIndexOf(' ', 420);
        if (split < 1) throw new Error('Cannot split long source text safely');
        chunks.push({ source: remaining.slice(0, split), wrap: text => text + ' ' });
        remaining = remaining.slice(split + 1);
      }
      chunks.push({ source: remaining, wrap: text => text + spaces[3] });
      const firstWrap = chunks[0].wrap;
      chunks[0].wrap = text => spaces[1] + firstWrap(text);
      return chunks;
    });
    return { parts, prefix, suffix };
  });
}

async function requestBatch(items, language) {
  const input = items.map((item, index) => `⟦${String(index).padStart(3, '0')}⟧ ${item.text}`).join('\n');
  const response = await translate(input, 'en', codes[language] || language);
  if (!response?.translation) throw new Error('Empty translator response');
  const matches = [...response.translation.matchAll(/⟦(\d+)⟧\s*([\s\S]*?)(?=⟦\d+⟧|$)/gu)];
  if (matches.length !== items.length || matches.some((match, index) => Number(match[1]) !== index)) throw new Error('Translator changed batch delimiters');
  return matches.map((match, index) => restore(match[2], items[index]));
}

async function runTranslations(sources, language) {
  const unique = [...new Set(sources.filter(Boolean))];
  const pending = unique.filter(source => !cache[`safe-v2:${language}\0${source}`]).map(protect);
  const batches = [];
  let batch = [], size = 0;
  const limit = language === 'ka' || language === 'uz' ? 880 : 2700;
  for (const item of pending) {
    if (item.text.length > limit - 25) throw new Error(`Source segment exceeds batch limit (${language}): ${item.source.slice(0, 60)}`);
    if (batch.length && size + item.text.length + 10 > limit) { batches.push(batch); batch = []; size = 0; }
    batch.push(item); size += item.text.length + 10;
  }
  if (batch.length) batches.push(batch);
  let cursor = 0, completed = 0;
  async function worker() {
    while (cursor < batches.length) {
      const items = batches[cursor++];
      let values;
      try { values = await requestBatch(items, language); }
      catch {
        // Retry one segment at a time if punctuation/delimiters were modified.
        values = [];
        for (const item of items) {
          let value;
          for (let attempt = 0; attempt < 3; attempt++) {
            try { value = restore((await translate(item.text, 'en', codes[language] || language)).translation, item); break; }
            catch (error) { if (attempt === 2) throw error; }
          }
          values.push(value);
        }
      }
      items.forEach((item, index) => { cache[`safe-v2:${language}\0${item.source}`] = values[index]; });
      completed += items.length;
      if (completed % 100 < items.length) await writeFile(cacheFile, JSON.stringify(cache));
    }
  }
  await Promise.all(Array.from({ length: Math.min(5, batches.length) }, worker));
  await writeFile(cacheFile, JSON.stringify(cache));
}

const languages = (await load('src/data/languages.ts', 'supportedLanguages')).map(item => item.code).filter(code => !['en', 'tr'].includes(code));
const selected = process.env.TRANSLATE_LANGS?.split(',') || languages;
if (selected.some(code => !languages.includes(code))) throw new Error('Unsupported target locale');
const english = await load('src/data/pageTranslations.ts', 'baseEnglish');
const pageTemplate = JSON.parse(JSON.stringify(english));
pageTemplate.whatsapp.msgProductTemplate = english.whatsapp.msgProduct('{product}');
const pageEntries = collect(pageTemplate);
const pages = existsSync(new URL('src/data/pageTranslationsData.ts', root)) ? await load('src/data/pageTranslationsData.ts', 'pageTranslationsData') : {};
const products = await load('src/data/products.ts', 'productsData');
const insights = await load('src/data/insights.ts', 'insightArticles');
const countries = await load('src/data/countries.ts', 'exportCountriesData');
const ui = await load('src/data/translationsData.ts', 'translationsData');
const productMaps = products.flatMap(product => ['name', 'category', 'tagline', 'shortDescription', 'fullDescription', 'origins', 'seasonMonthsText'].map(key => product[key]));
const articleMaps = insights.flatMap(article => ['title', 'excerpt', 'content', 'category'].map(key => article[key]));
const countryMaps = countries.flatMap(country => ['name', 'overview', 'geoAnswer'].map(key => country[key]));
const maps = [...productMaps, ...articleMaps, ...countryMaps];
const varietyKeys = ['name', 'description', 'tagline', 'color', 'harvestMonths', 'storage', 'shelfLife', 'packagingTypes', 'characteristics'];

for (const language of selected) {
  const tasks = [];
  const localizedPage = structuredClone(pageTemplate);
  for (const { path, source } of pageEntries) tasks.push({ source, apply: text => setPath(localizedPage, path, text) });
  for (const map of maps) {
    if (!map?.en || (map[language] && JSON.stringify(map[language]) !== JSON.stringify(map.en))) continue;
    if (Array.isArray(map.en)) {
      const values = [...map.en];
      values.forEach((source, index) => tasks.push({ source, apply: text => { values[index] = text; map[language] = values; } }));
    } else tasks.push({ source: map.en, apply: text => { map[language] = text; } });
  }
  for (const product of products) {
    for (const faq of product.faqs) {
      faq.localized ||= {};
      const translatedFAQ = faq.localized[language] ||= {};
      for (const key of ['question', 'answer']) if (!translatedFAQ[key]) tasks.push({ source: faq[key], apply: text => { translatedFAQ[key] = text; } });
    }
    for (const [object, keys] of [[product.specifications, ['variety', 'origin', 'color', 'shelfLife', 'class', 'storageTemp', 'optimalHumidity']], [product.logistics, ['transitTimeEU', 'transitTimeGulf', 'transitTimeAsia', 'storageMethod']], ...product.packagingOptions.map(option => [option, ['type', 'dimensions', 'piecesPerBox', 'boxesPerPallet', 'palletType', 'containerCapacity']])]) {
      object.localized ||= {};
      const details = object.localized[language] ||= {};
      for (const key of keys) if (object[key] && !details[key]) tasks.push({ source: object[key], apply: text => { details[key] = text; } });
    }
    for (const variety of product.varieties) {
      variety.localized ||= {};
      const localized = variety.localized[language] ||= {};
      for (const key of varietyKeys) {
        const value = variety[key];
        if (!value || localized[key]) continue;
        if (Array.isArray(value)) {
          localized[key] = [...value];
          value.forEach((source, index) => tasks.push({ source, apply: text => { localized[key][index] = text; } }));
        } else tasks.push({ source: value, apply: text => { localized[key] = text; } });
      }
    }
  }
  // Rebuild only missing or English-duplicate UI leaves; retain existing translations.
  const localizedUI = ui[language] ||= structuredClone(ui.en);
  for (const { path, source } of collect(ui.en)) {
    let old = localizedUI;
    for (const key of path) old = old?.[key];
    if (typeof old === 'string' && old !== source) continue;
    tasks.push({ source, apply: text => setPath(localizedUI, path, text) });
  }
  const prepared = tasks.map(task => ({ ...task, blocks: segments(task.source) }));
  const texts = prepared.flatMap(task => task.blocks.flatMap(block => (block.parts || []).filter(part => part.source).map(part => part.source)));
  console.log(`Translating ${language}: ${tasks.length} fields, ${new Set(texts).size} unique segments`);
  await runTranslations(texts, language);
  for (const task of prepared) {
    const text = task.blocks.map(block => block.literal ?? block.prefix + block.parts.map(part => part.literal ?? part.wrap(cache[`safe-v2:${language}\0${part.source}`])).join('') + block.suffix).join('');
    if (task.source.includes('**') && (text.match(/\*\*/gu)?.length || 0) !== (task.source.match(/\*\*/gu)?.length || 0)) throw new Error('Markdown emphasis mismatch');
    task.apply(text);
  }
  pages[language] = localizedPage;
  await writeFile(new URL('src/data/pageTranslationsData.ts', root), `import type { LocalizedPageTranslations } from './pageTranslations';\n\nexport const pageTranslationsData: Record<string, LocalizedPageTranslations> = ${JSON.stringify(pages, null, 2)};\n`);
  await writeFile(new URL('src/data/products.ts', root), `import { Product } from '@/types';\n\nexport const productsData: Product[] = ${JSON.stringify(products, null, 2)};\n`);
  await writeFile(new URL('src/data/insights.ts', root), `import { InsightArticle } from '@/types';\n\nexport const insightArticles: InsightArticle[] = ${JSON.stringify(insights, null, 2)};\n`);
  // Preserve the country interface/functions exactly; only replace the dataset declaration.
  const countriesSource = await readFile(new URL('src/data/countries.ts', root), 'utf8');
  const marker = 'export const exportCountriesData:';
  const declaration = countriesSource.indexOf(marker);
  const prefix = countriesSource.slice(0, declaration);
  await writeFile(new URL('src/data/countries.ts', root), `${prefix}export const exportCountriesData: ExportCountry[] = ${JSON.stringify(countries, null, 2)};\n`);
  await writeFile(new URL('src/data/translationsData.ts', root), `import type { Translations } from './translations';\n\nexport const translationsData: Record<string, Translations> = ${JSON.stringify(ui, null, 2)};\n`);
  console.log(`Completed ${language}`);
}
console.log('All selected locales completed; protected tokens and Markdown delimiters verified.');
