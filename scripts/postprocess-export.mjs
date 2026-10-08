import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { htmlAlternates, inspectHtml, sitemapEntries } from './export-validation.mjs';

const directoryIndex = process.argv.indexOf('--directory');
const root = directoryIndex >= 0 ? resolve(process.argv[directoryIndex + 1]) : fileURLToPath(new URL('../out/', import.meta.url));
const checkOnly = process.argv.includes('--check');
const htmlFiles = [];
const allFiles = [];
const languageSource = await readFile(new URL('../src/data/languages.ts', import.meta.url), 'utf8');
const locales = [...languageSource.matchAll(/code: '([^']+)'/gu)].map(([, code]) => code);
const rtlLocales = new Set([...languageSource.matchAll(/code: '([^']+)'[^\n]+dir: 'rtl'/gu)].map(([, code]) => code));
const companySource = await readFile(new URL('../src/data/company.ts', import.meta.url), 'utf8');
const baseUrl = companySource.match(/baseUrl: '([^']+)'/u)?.[1];
if (!baseUrl) throw new Error('Missing company canonical base URL');
const routeFor = (file) => `/${relative(root, file).split(sep).join('/').replace(/index\.html$/, '')}`;

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else {
      allFiles.push(path);
      if (entry.name.endsWith('.html')) htmlFiles.push(path);
    }
  }
}

await walk(root);
const failures = [];
const routePaths = new Set(htmlFiles.map(routeFor));
const assetPaths = new Set(allFiles.map((file) => `/${relative(root, file).split(sep).join('/')}`));
const alternateGroups = new Map();
const publicRoutes = new Set();
for (const file of htmlFiles) {
  const route = routeFor(file);
  const locale = route.split('/')[1];
  let html = await readFile(file, 'utf8');
  if (!checkOnly && locales.includes(locale)) {
    html = html.replace(/<html\b([^>]*)>/u, (_, attributes) => {
      const remaining = attributes.replace(/\s+(?:lang|dir)="[^"]*"/gu, '');
      return `<html lang="${locale}" dir="${rtlLocales.has(locale) ? 'rtl' : 'ltr'}"${remaining}>`;
    });
    await writeFile(file, html);
  }
  failures.push(...inspectHtml(route, html, { baseUrl, locales, rtlLocales, routePaths, assetPaths }));
  if (locales.includes(locale) && !/<meta\b[^>]*name="robots"[^>]*content="[^"]*noindex/u.test(html)) {
    publicRoutes.add(route);
    alternateGroups.set(route, htmlAlternates(html));
  }
}

const groupKey = (group) => JSON.stringify(Object.entries(group).sort(([a], [b]) => a.localeCompare(b)));
for (const [route, group] of alternateGroups) {
  for (const target of Object.values(group)) {
    const targetPath = decodeURI(new URL(target).pathname);
    if (alternateGroups.has(targetPath) && groupKey(alternateGroups.get(targetPath)) !== groupKey(group)) failures.push(`${route}: hreflang group is not reciprocal with ${targetPath}`);
  }
}

if (directoryIndex < 0) {
  const sitemap = await readFile(join(root, 'sitemap.xml'), 'utf8');
  const entries = sitemapEntries(sitemap);
  const sitemapUrls = entries.map(({ url }) => url);
  if (sitemapUrls.length !== new Set(sitemapUrls).size) failures.push('sitemap contains duplicate URLs');
  for (const { url: value, alternates } of entries) {
    const url = new URL(value);
    if (url.origin !== baseUrl || !routePaths.has(decodeURI(url.pathname))) failures.push(`sitemap contains unpublished URL: ${value}`);
    const path = decodeURI(url.pathname);
    if (!publicRoutes.has(path)) failures.push(`sitemap URL is not an indexable public page: ${value}`);
    if (alternateGroups.has(path) && groupKey(alternates) !== groupKey(alternateGroups.get(path))) failures.push(`sitemap hreflang disagrees with HTML: ${value}`);
  }
  const sitemapPaths = new Set(sitemapUrls.map((value) => decodeURI(new URL(value).pathname)));
  for (const route of publicRoutes) if (!sitemapPaths.has(route)) failures.push(`indexable public page is missing from sitemap: ${route}`);
}

if (failures.length) {
  console.error(failures.slice(0, 200).join('\n'));
  if (failures.length > 200) console.error(`${failures.length - 200} additional validation failures.`);
  process.exitCode = 1;
} else {
  console.log(`Verified ${htmlFiles.length} HTML files: languages, canonical URLs, social metadata, hreflang, links, assets and JSON-LD are consistent.`);
}
