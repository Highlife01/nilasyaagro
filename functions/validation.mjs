export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

export const roles = ['ROOT_SUPER_ADMIN', 'EXPORT_MANAGER', 'SALES_REP'];
export const statuses = ['new', 'quoted', 'negotiation', 'approved', 'archived'];
// Keep legacy units for existing admin clients while public forms use MT/kg/container.
export const units = ['MT', 'kg', 'container', 'Tons', 'Pallets', 'Containers (40ft FCL)', 'Boxes'];
export const incoterms = ['EXW', 'FCA', 'FOB', 'CFR', 'CIF', 'DAP'];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;

export function text(value, label, { required = false, max = 250 } = {}) {
  if (value !== undefined && typeof value !== 'string') throw new HttpError(400, `${label} must be text.`);
  const result = (value || '').trim();
  if (required && !result) throw new HttpError(400, `${label} is required.`);
  if (result.length > max || /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/u.test(result)) throw new HttpError(400, `${label} is invalid.`);
  return result;
}

function choice(value, choices, label) {
  if (!choices.includes(value)) throw new HttpError(400, `${label} is invalid.`);
  return value;
}

export function finiteNumber(value, label, max = 1000000000) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > max) throw new HttpError(400, `${label} is invalid.`);
  return value;
}

export function requestedDeliveryDate(value, now = Date.now()) {
  const result = text(value, 'Requested delivery date', { required: true, max: 10 });
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(result)) throw new HttpError(400, 'Requested delivery date is invalid.');
  const parsed = new Date(`${result}T00:00:00.000Z`);
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== result) throw new HttpError(400, 'Requested delivery date is invalid.');
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date(now));
  const datePart = (type) => parts.find((part) => part.type === type).value;
  const today = `${datePart('year')}-${datePart('month')}-${datePart('day')}`;
  const latest = new Date(new Date(`${today}T00:00:00Z`).getTime() + 730 * 86400000).toISOString().slice(0, 10);
  if (result < today || result > latest) throw new HttpError(400, 'Requested delivery date must be within the next two years.');
  return result;
}

export function validateRequestId(value) {
  if (value === undefined) return '';
  const result = text(value, 'Request ID', { required: true, max: 36 }).toLowerCase();
  if (!/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/u.test(result)) throw new HttpError(400, 'Request ID is invalid.');
  return result;
}

export function validateMetadata(value, catalog) {
  if (value === undefined) return {};
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new HttpError(400, 'Inquiry metadata is invalid.');
  const result = {};
  if (value.sourcePage !== undefined) {
    const sourcePage = text(value.sourcePage, 'Source page', { max: 200 });
    // Store a known public route only: query strings and customer data never belong here.
    const segments = sourcePage.split('/').filter(Boolean);
    const pages = ['about', 'contact', 'quote', 'products', 'quality', 'production', 'export', 'insights'];
    if (!sourcePage.startsWith('/') || /[?#%\\@]/u.test(sourcePage) || !catalog.languages.includes(segments[0]) || segments.length > 3 || (segments[1] && !pages.includes(segments[1])) || (segments[2] && !/^[a-z\d-]{1,80}$/u.test(segments[2])) || (segments[1] === 'products' && segments[2] && !catalog.products.includes(segments[2]))) {
      throw new HttpError(400, 'Source page is invalid.');
    }
    result.sourcePage = sourcePage;
  }
  if (value.utm !== undefined) {
    if (!value.utm || typeof value.utm !== 'object' || Array.isArray(value.utm)) throw new HttpError(400, 'Campaign metadata is invalid.');
    const utm = {};
    for (const key of ['source', 'medium', 'campaign']) {
      if (value.utm[key] === undefined) continue;
      const token = text(value.utm[key], 'Campaign metadata', { max: 100 });
      if (token && !/^[a-z\d_-]+$/iu.test(token)) throw new HttpError(400, 'Campaign metadata is invalid.');
      if (token) utm[key] = token;
    }
    if (Object.keys(utm).length) result.utm = utm;
  }
  return result;
}

export function validateInquiry(payload, catalog, { now = Date.now(), admin = false } = {}) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new HttpError(400, 'Invalid inquiry.');
  const kind = choice(payload.kind, ['rfq', 'contact'], 'Inquiry type');
  const language = choice(payload.language, catalog.languages, 'Language');
  const data = payload.data;
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new HttpError(400, 'Invalid inquiry data.');
  if (data.websiteTrap) throw new HttpError(400, 'Invalid inquiry.');
  if (data.consent !== true) throw new HttpError(400, 'Please confirm that we may process your inquiry.');
  const email = text(data.email, 'Email', { required: true, max: 254 }).toLowerCase();
  if (!emailPattern.test(email)) throw new HttpError(400, 'A valid email is required.');
  const phone = text(data.phone, 'Phone', { required: true, max: 50 });
  if (!/^[+\d\s().-]{7,50}$/u.test(phone) || phone.replace(/\D/g, '').length < 7 || phone.replace(/\D/g, '').length > 20) throw new HttpError(400, 'A valid phone number is required.');
  const common = {
    kind, language, email, phone,
    companyName: text(data.companyName ?? data.company, 'Company', { required: true }),
    contactPerson: text(data.contactPerson ?? data.name, 'Contact person', { required: true, max: 120 }),
    message: text(data.message, 'Message', { required: kind === 'contact', max: 8000 }),
    consent: true,
    metadata: validateMetadata(payload.metadata, catalog),
  };
  if (kind === 'contact') return { ...common, subject: text(data.subject, 'Subject', { max: 200 }) };
  const product = choice(data.product, catalog.products, 'Product');
  const quantity = text(data.quantity, 'Quantity', { required: true, max: 20 });
  if (!/^\d+(?:\.\d{1,3})?$/u.test(quantity) || Number(quantity) <= 0 || Number(quantity) > 1000000) throw new HttpError(400, 'Quantity must be a positive number.');
  const unit = choice(data.unit, units, 'Unit');
  if (['container', 'Containers (40ft FCL)'].includes(unit) && (!Number.isInteger(Number(quantity)) || Number(quantity) > 10000)) throw new HttpError(400, 'Container quantity must be a whole number no greater than 10,000.');
  const destinationPort = text(data.destinationPort, 'Destination port');
  const deliveryAddress = text(data.deliveryAddress, 'Delivery address', { max: 500 });
  if (!admin && !destinationPort && !deliveryAddress) throw new HttpError(400, 'A destination port or delivery address is required.');
  const deliveryDate = data.requestedDeliveryDate ?? data.targetDeliveryDate;
  const website = text(data.website, 'Website', { max: 500 });
  if (website) {
    try { const url = new URL(website); if (!['https:', 'http:'].includes(url.protocol) || !url.hostname.includes('.') || url.username || url.password) throw new Error(); }
    catch { throw new HttpError(400, 'Website must be an http or https URL.'); }
  }
  return {
    ...common, product, quantity, website,
    unit, incoterm: choice(data.incoterm, incoterms, 'Incoterm'),
    packaging: text(data.packaging, 'Packaging', { required: true }),
    variety: text(data.variety, 'Variety', { required: !admin }), caliber: text(data.caliber, 'Caliber', { required: true }),
    destinationCountry: text(data.destinationCountry, 'Destination country', { required: true, max: 120 }),
    destinationCity: text(data.destinationCity, 'Destination city', { required: true, max: 120 }),
    destinationPort, deliveryAddress,
    requestedDeliveryDate: admin && !deliveryDate ? '' : requestedDeliveryDate(deliveryDate, now),
    whatsapp: text(data.whatsapp, 'WhatsApp', { max: 50 }),
  };
}

export function validateRfqUpdates(data) {
  const result = {};
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new HttpError(400, 'Invalid update.');
  if (data.status !== undefined) result.status = choice(data.status, statuses, 'Status');
  if (data.adminNotes !== undefined) result.adminNotes = text(data.adminNotes, 'Notes', { max: 8000 });
  if (data.estimatedValueUSD !== undefined) result.estimatedValueUSD = finiteNumber(data.estimatedValueUSD, 'Estimated value');
  if (!Object.keys(result).length) throw new HttpError(400, 'No editable fields were supplied.');
  return result;
}

export function validateStock(productId, data, catalog) {
  choice(productId, catalog.products, 'Product');
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new HttpError(400, 'Invalid stock data.');
  if (data.activeCalibers !== undefined && (!Array.isArray(data.activeCalibers) || data.activeCalibers.length > 30)) throw new HttpError(400, 'Calibers must be a list of no more than 30 items.');
  return {
    productId,
    seasonStatus: choice(data.seasonStatus, ['peak', 'storage', 'preorder', 'closed'], 'Season status'),
    moqTons: finiteNumber(data.moqTons, 'MOQ', 100000),
    availableStockMT: finiteNumber(data.availableStockMT, 'Stock', 1000000),
    exportQualityScore: finiteNumber(data.exportQualityScore, 'Quality score', 100),
    storageCondition: text(data.storageCondition, 'Storage condition', { required: true }),
    activeCalibers: (data.activeCalibers || []).map((item) => text(item, 'Caliber', { required: true, max: 150 })),
  };
}
