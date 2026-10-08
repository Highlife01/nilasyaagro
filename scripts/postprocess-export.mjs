import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../out/', import.meta.url));
const checkOnly = process.argv.includes('--check');
const htmlFiles = [];
const locales = ['tr', 'en', 'ar', 'ru', 'de', 'fr', 'es', 'it', 'pt', 'nl', 'pl', 'ro', 'bg', 'el', 'sr', 'uk', 'ka', 'az', 'uz', 'kk', 'fa', 'hi', 'ur', 'bn', 'zh-cn', 'ja', 'ko', 'id', 'ms', 'sw'];
const rtlLocales = new Set(['ar', 'fa', 'ur']);

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (entry.name.endsWith('.html')) htmlFiles.push(path);
  }
}

await walk(root);
const failures = [];
for (const file of htmlFiles) {
  const route = `/${relative(root, file).split(sep).join('/').replace(/index\.html$/, '')}`;
  const locale = route.split('/')[1];
  let html = await readFile(file, 'utf8');
  if (locales.includes(locale)) {
    html = html.replace(/<html lang="[^"]+"(?: dir="[^"]+")?/u, `<html lang="${locale}" dir="${rtlLocales.has(locale) ? 'rtl' : 'ltr'}"`);
  }
  if (!checkOnly && locales.includes(locale)) await writeFile(file, html);

  if (locales.includes(locale) && !html.includes(`<html lang="${locale}"`)) {
    failures.push(`${route}: incorrect html lang`);
  }
  const rawCanonical = html.match(/<link rel="canonical" href="([^"]+)"/u)?.[1];
  const canonical = rawCanonical?.replaceAll('&#x27;', "'").replaceAll('&amp;', '&');
  if (canonical && !route.startsWith('/404')) {
    const expectedPath = route.endsWith('/') ? route : `${route}/`;
    if (new URL(canonical).pathname !== expectedPath) failures.push(`${route}: canonical points to ${canonical}`);
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Verified ${htmlFiles.length} HTML files: locale and canonical metadata are consistent.`);
}
