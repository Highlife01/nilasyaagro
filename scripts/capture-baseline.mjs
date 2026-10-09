import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { readFile, readdir, mkdir, mkdtemp, writeFile, stat } from 'node:fs/promises';
import { resolve, relative, sep, extname, join } from 'node:path';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { decodeHtml, htmlAlternates, sitemapEntries } from './export-validation.mjs';

// This collector only reads pages. It never submits a form or contacts a CRM.
const valueFor = (flag, fallback) => process.argv.includes(flag) ? process.argv[process.argv.indexOf(flag) + 1] : fallback;
const exportRoot = resolve(valueFor('--directory', 'out'));
const reportRoot = resolve(valueFor('--output', 'docs/baseline/2026-10-09'));
const attributes = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/gu)].map(([, key, value]) => [key.toLowerCase(), decodeHtml(value)]));
const text = (html = '') => decodeHtml(html.replace(/<[^>]+>/gu, ' ').replace(/\s+/gu, ' ').trim());
function metadata(html) {
  const links = [...html.matchAll(/<link\b[^>]*>/gu)].map(([tag]) => attributes(tag));
  const meta = [...html.matchAll(/<meta\b[^>]*>/gu)].map(([tag]) => attributes(tag));
  return {
    title: text(html.match(/<title>(.*?)<\/title>/su)?.[1]),
    description: meta.find((item) => item.name === 'description')?.content || '',
    canonical: links.filter((item) => item.rel === 'canonical').map((item) => item.href),
    hreflang: htmlAlternates(html),
    h1: [...html.matchAll(/<h1\b[^>]*>(.*?)<\/h1>/gsu)].map(([, content]) => text(content)),
    imageCount: [...html.matchAll(/<img\b[^>]*>/gu)].length,
    imagesWithoutAlt: [...html.matchAll(/<img\b[^>]*>/gu)].filter(([tag]) => !Object.hasOwn(attributes(tag), 'alt')).length,
    robots: meta.find((item) => item.name === 'robots')?.content || '',
  };
}
await mkdir(reportRoot, { recursive: true });
const files = [];
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) await walk(file);
    else if (entry.name.endsWith('.html')) files.push(file);
  }
}
await walk(exportRoot);
const routes = [];
for (const file of files.sort()) {
  const html = await readFile(file, 'utf8');
  routes.push({
    route: `/${relative(exportRoot, file).split(sep).join('/').replace(/index\.html$/u, '')}`,
    source: relative(exportRoot, file).split(sep).join('/'),
    sha256: createHash('sha256').update(html).digest('hex'),
    ...metadata(html),
  });
}
const sitemap = await readFile(join(exportRoot, 'sitemap.xml'), 'utf8');
const snapshot = { capturedAt: new Date().toISOString(), source: 'existing local static export; not proven identical to production', routeCount: routes.length, sitemapUrlCount: sitemapEntries(sitemap).length, routes };
await writeFile(join(reportRoot, 'export-metadata.json'), `${JSON.stringify(snapshot, null, 2)}\n`);
await writeFile(join(reportRoot, 'robots.txt'), await readFile(join(exportRoot, 'robots.txt')));
const representative = ['/en/', '/en/products/', routes.find((item) => /^\/en\/products\/[^/]+\/$/u.test(item.route))?.route, '/en/quality/', '/en/production/', '/en/export/', '/en/contact/', '/en/quote/'].filter(Boolean);

if (process.argv.includes('--live')) {
  const host = valueFor('--host', 'https://www.nilasyaagrofoods.com.tr');
  const urls = [...new Set([`${host}/`, 'https://nilasyaagrofoods.com.tr/', 'http://nilasyaagrofoods.com.tr/', 'http://www.nilasyaagrofoods.com.tr/', ...representative.map((route) => `${host}${route}`), `${host}/robots.txt`, `${host}/sitemap.xml`])];
  const observations = [];
  for (const originalUrl of urls) {
    let url = originalUrl;
    const chain = [];
    try {
      for (let hop = 0; hop < 8; hop++) {
        const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(10000) });
        const location = response.headers.get('location');
        chain.push({ url, status: response.status, location });
        if (response.status >= 300 && response.status < 400 && location) { url = new URL(location, url).href; await response.body?.cancel(); continue; }
        const html = await response.text();
        observations.push({ originalUrl, chain, finalUrl: url, status: response.status, ...(response.headers.get('content-type')?.includes('text/html') ? metadata(html) : {}) });
        break;
      }
    } catch (error) { observations.push({ originalUrl, chain, error: error.message }); }
  }
  await writeFile(join(reportRoot, 'live-http.json'), `${JSON.stringify({ capturedAt: new Date().toISOString(), observations }, null, 2)}\n`);
}

if (process.argv.includes('--screenshots')) {
  const edge = valueFor('--browser', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe');
  const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.webp': 'image/webp', '.woff2': 'font/woff2', '.png': 'image/png' };
  const server = createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      let file = resolve(exportRoot, `.${pathname}`);
      if (!file.startsWith(`${exportRoot}${sep}`) && file !== exportRoot) { res.writeHead(403).end(); return; }
      if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
      res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
      res.end(await readFile(file));
    } catch { res.writeHead(404).end('Not found'); }
  });
  await new Promise((ready) => server.listen(0, '127.0.0.1', ready));
  const port = server.address().port;
  const profileRoot = await mkdtemp(join(tmpdir(), 'nilasya-baseline-'));
  const results = [];
  try {
    for (const [device, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
      for (const [index, route] of representative.entries()) {
        const name = `${device}-${route.split('/').filter(Boolean).join('-') || 'home'}.png`;
        const screenshot = join(reportRoot, name);
        const profile = join(profileRoot, `${device}-${index}`);
        const args = ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', '--disable-background-networking', `--user-data-dir=${profile}`, `--window-size=${width},${height}`, '--virtual-time-budget=2500', `--screenshot=${screenshot}`, `http://127.0.0.1:${port}${route}`];
        if (process.argv.includes('--browser-no-sandbox')) args.unshift('--no-sandbox');
        const result = await new Promise((done) => {
          const child = spawn(edge, args, { windowsHide: true, stdio: 'ignore' });
          const timer = setTimeout(() => { child.kill(); done('timeout'); }, 20000);
          child.on('error', (error) => { clearTimeout(timer); done(error.message); });
          child.on('exit', (code) => { clearTimeout(timer); done(code === 0 ? 'ok' : `exit ${code}`); });
        });
        const captured = await stat(screenshot).then((entry) => entry.size > 0).catch(() => false);
        results.push({ route, device, width, height, file: name, captured, result });
        console.log(`${device} ${route}: ${captured ? 'captured' : result}`);
      }
    }
  } finally { await new Promise((done) => server.close(done)); }
  await writeFile(join(reportRoot, 'screenshots.json'), `${JSON.stringify({ source: 'local baseline export; viewport screenshots', results }, null, 2)}\n`);
}
console.log(`Baseline captured: ${routes.length} HTML files, ${snapshot.sitemapUrlCount} sitemap URLs. No form submissions were made.`);
