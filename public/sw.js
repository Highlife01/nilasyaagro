const CACHE_VERSION = 'nilasya-public-v3';
const SHELL_CACHE = `${CACHE_VERSION}-shell`;
const PAGE_CACHE = `${CACHE_VERSION}-pages`;
const ASSET_CACHE = `${CACHE_VERSION}-assets`;
const CURRENT_CACHES = [SHELL_CACHE, PAGE_CACHE, ASSET_CACHE];
const APP_SHELL = ['/offline.html', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(SHELL_CACHE).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((key) => key.startsWith('nilasya-') && !CURRENT_CACHES.includes(key)).map((key) => caches.delete(key))))
    .then(() => self.clients.claim()));
});

async function storeResponse(cacheName, request, response, maxEntries) {
  if (!response.ok || response.type === 'opaque' || /(?:no-store|private)/i.test(response.headers.get('cache-control') || '')) return;
  const cache = await caches.open(cacheName);
  await cache.put(request, response);
  const keys = await cache.keys();
  await Promise.all(keys.slice(0, Math.max(0, keys.length - maxEntries)).map((key) => cache.delete(key)));
}

async function pageResponse(event) {
  try {
    const response = await fetch(event.request);
    if ((response.headers.get('content-type') || '').includes('text/html')) {
      event.waitUntil(storeResponse(PAGE_CACHE, event.request, response.clone(), 30).catch(() => {}));
    }
    return response;
  } catch {
    const cache = await caches.open(PAGE_CACHE);
    return (await cache.match(event.request)) || (await caches.match('/offline.html')) || Response.error();
  }
}

async function assetResponse(event, immutable) {
  const cache = await caches.open(ASSET_CACHE);
  if (immutable) {
    const cached = await cache.match(event.request);
    if (cached) return cached;
  }
  try {
    const response = await fetch(event.request);
    event.waitUntil(storeResponse(ASSET_CACHE, event.request, response.clone(), 100).catch(() => {}));
    return response;
  } catch {
    return (await cache.match(event.request)) || (await caches.match(event.request)) || Response.error();
  }
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin || /(?:^|\/)(?:api|admin)(?:\/|$)/.test(requestUrl.pathname)) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(pageResponse(event));
  } else if (['script', 'style', 'image', 'font'].includes(event.request.destination) || requestUrl.pathname === '/manifest.webmanifest') {
    event.respondWith(assetResponse(event, requestUrl.pathname.startsWith('/_next/static/')));
  }
});
