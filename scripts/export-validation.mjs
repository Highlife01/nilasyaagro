export const decodeHtml = (value = '') => value.replace(/&amp;/gu, '&').replace(/&quot;/gu, '"').replace(/&#x27;|&#39;/gu, "'").replace(/&lt;/gu, '<').replace(/&gt;/gu, '>');

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/gu)].map(([, name, value]) => [name.toLowerCase(), decodeHtml(value)]));
}

export function htmlAlternates(html) {
  return Object.fromEntries([...html.matchAll(/<link\b[^>]*>/gu)].map(([tag]) => attributes(tag)).filter(({ rel, hreflang }) => rel === 'alternate' && hreflang).map(({ hreflang, href }) => [hreflang, href]));
}

export function sitemapEntries(xml) {
  return [...xml.matchAll(/<url>(.*?)<\/url>/gsu)].map(([, entry]) => ({
    url: decodeHtml(entry.match(/<loc>(.*?)<\/loc>/u)?.[1]),
    alternates: Object.fromEntries([...entry.matchAll(/<xhtml:link\b[^>]*>/gu)].map(([tag]) => attributes(tag)).filter(({ rel }) => rel === 'alternate').map(({ hreflang, href }) => [hreflang, href])),
  }));
}

export function inspectHtml(route, html, { baseUrl, locales, rtlLocales, routePaths, assetPaths }) {
  const errors = [];
  const locale = route.split('/')[1];
  if (!locales.includes(locale)) return errors;
  const language = attributes(html.match(/<html\b[^>]*>/u)?.[0] || '');
  if (language.lang !== locale) errors.push('incorrect html lang');
  if (language.dir !== (rtlLocales.has(locale) ? 'rtl' : 'ltr')) errors.push('incorrect html dir');
  const links = [...html.matchAll(/<link\b[^>]*>/gu)].map(([tag]) => attributes(tag));
  const meta = [...html.matchAll(/<meta\b[^>]*>/gu)].map(([tag]) => attributes(tag));
  const metaValue = (key) => meta.find((item) => item.name === key || item.property === key)?.content;
  const title = decodeHtml(html.match(/<title>(.*?)<\/title>/su)?.[1]);
  const canonical = links.filter(({ rel }) => rel === 'canonical');
  const expectedUrl = `${baseUrl}${route}`;
  if (canonical.length !== 1 || canonical[0]?.href !== expectedUrl) errors.push(`canonical must be ${expectedUrl}`);
  if (!title?.trim()) errors.push('missing title');
  if (!metaValue('description')?.trim()) errors.push('missing description');
  if (metaValue('og:url') !== expectedUrl) errors.push('Open Graph URL does not match canonical');
  for (const key of ['og:title', 'og:description', 'og:image', 'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) {
    if (!metaValue(key)?.trim()) errors.push(`missing ${key}`);
  }
  if (title && metaValue('og:title') !== title) errors.push('Open Graph title does not match title');
  if (title && metaValue('twitter:title') !== title) errors.push('Twitter title does not match title');
  const alternates = links.filter(({ rel, hreflang }) => rel === 'alternate' && hreflang);
  if (!alternates.some(({ hreflang, href }) => hreflang === locale && href === expectedUrl)) errors.push('missing self hreflang');
  if (!alternates.some(({ hreflang }) => hreflang === 'x-default')) errors.push('missing x-default hreflang');
  for (const { href, hreflang } of alternates) {
    try {
      const url = new URL(href);
      if (url.origin !== baseUrl || !routePaths.has(decodeURI(url.pathname))) errors.push(`hreflang ${hreflang} has an unpublished URL: ${href}`);
      if (hreflang !== 'x-default' && url.pathname.split('/')[1] !== hreflang) errors.push(`hreflang ${hreflang} uses the wrong locale path`);
    } catch { errors.push(`invalid hreflang URL: ${href}`); }
  }
  const assetExists = (value) => {
    try {
      const url = new URL(value, baseUrl);
      return url.origin !== baseUrl || assetPaths.has(decodeURI(url.pathname));
    } catch { return false; }
  };
  for (const key of ['og:image', 'twitter:image']) {
    if (metaValue(key) && !assetExists(metaValue(key))) errors.push(`${key} asset is missing`);
  }
  for (const [, tag] of html.matchAll(/(<img\b[^>]*>)/gu)) {
    const { src } = attributes(tag);
    if (src && !assetExists(src)) errors.push(`image asset is missing: ${src}`);
  }
  for (const [, tag] of html.matchAll(/(<a\b[^>]*>)/gu)) {
    const { href } = attributes(tag);
    if (!href || /^(?:#|mailto:|tel:)/u.test(href)) continue;
    try {
      const url = new URL(href, expectedUrl);
      if (url.origin !== baseUrl) continue;
      const path = decodeURI(url.pathname);
      if (!routePaths.has(path) && !assetPaths.has(path)) errors.push(`link has an unpublished target: ${href}`);
    } catch { errors.push(`invalid link: ${href}`); }
  }
  for (const [, json] of html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gsu)) {
    try { JSON.parse(json); } catch { errors.push('invalid JSON-LD'); }
  }
  return [...new Set(errors)].map((error) => `${route}: ${error}`);
}
