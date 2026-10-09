import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile, stat } from 'node:fs/promises';
import { resolve, join, sep, extname } from 'node:path';

// Run against a local static export and an explicitly started headless browser.
// Inquiry requests are mocked; this audit never submits to the live API.
const exportRoot = resolve('out');
const reportRoot = resolve('docs/audit');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.webp': 'image/webp', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.txt': 'text/plain' };
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname.startsWith('/api/')) { res.writeHead(503, { 'Content-Type': 'application/json' }).end('{"error":"Local audit: API unavailable"}'); return; }
    let file = resolve(exportRoot, `.${pathname}`);
    if (file !== exportRoot && !file.startsWith(`${exportRoot}${sep}`)) { res.writeHead(403).end(); return; }
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
    res.end(await readFile(file));
  } catch { res.writeHead(404).end('Not found'); }
});
await new Promise((ready) => server.listen(0, '127.0.0.1', ready));
await mkdir(reportRoot, { recursive: true });
const port = server.address().port;
let socket;
let target;
const results = [];
const errors = [];
try {
  target = await fetch('http://127.0.0.1:9223/json/new?about:blank', { method: 'PUT' }).then((res) => res.json());
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((ready, reject) => { socket.addEventListener('open', ready, { once: true }); socket.addEventListener('error', reject, { once: true }); });
  let nextId = 0;
  const pending = new Map();
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.id) {
      const request = pending.get(message.id);
      if (!request) return;
      pending.delete(message.id);
      clearTimeout(request.timeout);
      if (message.error) request.reject(new Error(message.error.message));
      else request.resolve(message.result);
    } else if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
  });
  const send = (method, params = {}) => new Promise((resolveCall, reject) => {
    const id = ++nextId;
    const timeout = setTimeout(() => { pending.delete(id); reject(new Error(`CDP timeout: ${method}`)); }, 15000);
    pending.set(id, { resolve: resolveCall, reject, timeout });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async (expression) => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  };
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Network.enable');
  await send('Network.setBypassServiceWorker', { bypass: true });
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `window.__auditRequests=[];const auditFetch=window.fetch;window.fetch=(url,options)=>{if(String(url).startsWith('/api/inquiries')){window.__auditRequests.push(JSON.parse(options.body));return Promise.resolve(new Response(JSON.stringify({referenceCode:'AUDIT-TEST',deliveryStatus:'sent'}),{status:201,headers:{'Content-Type':'application/json'}}));}return auditFetch(url,options);};` });
  const pause = (ms) => new Promise((ready) => setTimeout(ready, ms));
  const navigate = async (route, width = 390) => {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 });
    await send('Page.navigate', { url: `http://127.0.0.1:${port}${route}` });
    for (let attempt = 0; attempt < 50; attempt++) {
      await pause(100);
      if (await evaluate(`location.pathname===${JSON.stringify(route)} && document.readyState==='complete' && !!document.querySelector('main')`)) break;
    }
    await pause(600);
  };
  for (const [route, width] of [['/en/', 320], ['/tr/', 390], ['/ar/', 390], ['/de/', 1024], ['/en/', 1440], ['/tr/contact/', 390], ['/tr/quote/', 390], ['/en/products/chickpeas/', 390]]) {
    await navigate(route, width);
    const result = await evaluate(`({route:location.pathname,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,lang:document.documentElement.lang,dir:document.documentElement.dir,overflow:[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.right>innerWidth+2||r.left<-2)&&getComputedStyle(e).position!=='fixed'&&!e.closest('[aria-hidden="true"]')}).slice(0,6).map(e=>({tag:e.tagName,class:e.className,text:e.textContent.slice(0,70)}))})`);
    results.push(result);
    console.log(JSON.stringify(result));
    if (['/tr/', '/ar/'].includes(route)) {
      const screenshot = await send('Page.captureScreenshot', { format: 'png' });
      await writeFile(join(reportRoot, `${route.slice(1, -1)}-${width}.png`), Buffer.from(screenshot.data, 'base64'));
    }
  }
  await navigate('/tr/', 390);
  await evaluate(`document.querySelector('button[aria-controls="mobile-navigation"]').click()`);
  await pause(100);
  assert.equal(await evaluate(`!!document.querySelector('#mobile-navigation') && document.querySelector('#mobile-navigation').contains(document.activeElement)`), true, 'mobile navigation should receive focus');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await pause(100);
  assert.equal(await evaluate(`!!document.querySelector('#mobile-navigation')`), false, 'Escape should close navigation');
  await evaluate(`document.querySelector('button[aria-label="Dili değiştir"]:not(.hidden)').click()`);
  await pause(100);
  assert.equal(await evaluate(`!!document.querySelector('[aria-labelledby="language-dialog-title"]')`), true, 'language selector opens');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await pause(100);
  await navigate('/tr/contact/', 390);
  await evaluate(`document.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}))`);
  await pause(200);
  results.push({ check: 'contact-invalid-submit', focus: await evaluate(`document.activeElement.id`), requests: await evaluate(`window.__auditRequests.length`) });
  assert.equal(await evaluate(`document.activeElement.id`), 'companyName', 'invalid contact submit should focus first field');
  assert.equal(await evaluate(`window.__auditRequests.length`), 0, 'invalid contact submit should not contact API');
  for (const result of results) if (result.scrollWidth) assert.ok(result.scrollWidth <= result.width + 2, `${result.route} overflows at ${result.width}px`);
  assert.deepEqual(errors, [], 'no uncaught browser errors');
  console.log('Browser audit passed: responsive routes, dialogs, invalid form submission, no uncaught exceptions.');
} catch (error) {
  errors.push(error.message);
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await writeFile(join(reportRoot, 'browser-results.json'), `${JSON.stringify({ results, errors }, null, 2)}\n`);
  socket?.close();
  if (target) await fetch(`http://127.0.0.1:9223/json/close/${target.id}`).catch(() => {});
  server.closeAllConnections();
  await new Promise((done) => server.close(done));
}
