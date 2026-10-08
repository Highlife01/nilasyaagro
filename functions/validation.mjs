export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

export const roles = ['ROOT_SUPER_ADMIN', 'EXPORT_MANAGER', 'SALES_REP'];
export const statuses = ['new', 'quoted', 'negotiation', 'approved', 'archived'];
export const units = ['MT', 'Tons', 'Pallets', 'Containers (40ft FCL)', 'Boxes'];
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

export function validateInquiry(payload, catalog) {
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
  if (!/^[+\d\s().-]{7,50}$/u.test(phone) || phone.replace(/\D/g, '').length < 7) throw new HttpError(400, 'A valid phone number is required.');
  const common = {
    kind, language, email, phone,
    companyName: text(data.companyName ?? data.company, 'Company', { required: true }),
    contactPerson: text(data.contactPerson ?? data.name, 'Contact person', { required: true, max: 120 }),
    message: text(data.message, 'Message', { required: kind === 'contact', max: 8000 }),
    consent: true,
  };
  if (kind === 'contact') return { ...common, subject: text(data.subject, 'Subject', { max: 200 }) };
  const product = choice(data.product, catalog.products, 'Product');
  const quantity = text(data.quantity, 'Quantity', { required: true, max: 20 });
  if (!/^\d+(?:\.\d{1,3})?$/u.test(quantity) || Number(quantity) <= 0 || Number(quantity) > 1000000) throw new HttpError(400, 'Quantity must be a positive number.');
  const website = text(data.website, 'Website', { max: 500 });
  if (website) {
    try { if (!['https:', 'http:'].includes(new URL(website).protocol)) throw new Error(); }
    catch { throw new HttpError(400, 'Website must be an http or https URL.'); }
  }
  return {
    ...common, product, quantity, website,
    unit: choice(data.unit, units, 'Unit'), incoterm: choice(data.incoterm, incoterms, 'Incoterm'),
    packaging: text(data.packaging, 'Packaging', { required: true }),
    variety: text(data.variety, 'Variety'), caliber: text(data.caliber, 'Caliber', { required: true }),
    destinationCountry: text(data.destinationCountry, 'Destination country', { required: true, max: 120 }),
    destinationCity: text(data.destinationCity, 'Destination city', { required: true, max: 120 }),
    destinationPort: text(data.destinationPort, 'Destination port'),
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
  return {
    productId,
    seasonStatus: choice(data.seasonStatus, ['peak', 'storage', 'preorder', 'closed'], 'Season status'),
    moqTons: finiteNumber(data.moqTons, 'MOQ', 100000),
    availableStockMT: finiteNumber(data.availableStockMT, 'Stock', 1000000),
    exportQualityScore: finiteNumber(data.exportQualityScore, 'Quality score', 100),
    storageCondition: text(data.storageCondition, 'Storage condition', { required: true }),
    activeCalibers: Array.isArray(data.activeCalibers) && data.activeCalibers.length <= 30
      ? data.activeCalibers.map((item) => text(item, 'Caliber', { required: true, max: 150 })) : [],
  };
}
