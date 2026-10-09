import type { Locale, RFQSubmission } from '@/types';
import { productsData } from '@/data/products';
import { packagingData } from '@/data/packaging';
import { getProductCaliberOptions } from '@/data/productOptions';

export type FieldErrors = Record<string, string>;

export const inquiryFieldLimits: Record<string, number> = {
  message: 8000, website: 500, deliveryAddress: 500, email: 254, phone: 50, whatsapp: 50,
  contactPerson: 120, name: 120, destinationCountry: 120, destinationCity: 120,
  quantity: 20, subject: 200, requestedDeliveryDate: 10,
};
export const rfqUnits = ['MT', 'kg', 'container', 'Tons', 'Pallets', 'Containers (40ft FCL)', 'Boxes'] as const;
export const rfqIncoterms = ['EXW', 'FCA', 'FOB', 'CFR', 'CIF', 'DAP'] as const;

export const rfqFieldSteps: Record<string, number> = {
  product: 1, variety: 1, caliber: 1,
  quantity: 2, unit: 2, packaging: 2,
  destinationCountry: 3, destinationCity: 3, destinationPort: 3, deliveryAddress: 3,
  incoterm: 3, requestedDeliveryDate: 3,
  companyName: 4, website: 4, message: 4,
  contactPerson: 5, email: 5, phone: 5, consent: 5,
};

export function initialRfqData(product = ''): Partial<RFQSubmission> {
  return {
    product, variety: '', caliber: product ? `overall:${product}` : '', quantity: '48', unit: 'MT',
    packaging: 'pp_woven_bag_25kg_50kg', destinationCountry: '', destinationCity: '',
    destinationPort: '', deliveryAddress: '', requestedDeliveryDate: '', incoterm: 'CIF',
    companyName: '', website: '', contactPerson: '', email: '', phone: '', whatsapp: '', message: '',
  };
}

function validateFields(values: Record<string, unknown>, required: string[], lang: Locale): FieldErrors {
  const errors: FieldErrors = {};
  const isTr = lang === 'tr';
  for (const field of required) {
    if (!String(values[field] ?? '').trim()) errors[field] = isTr ? 'Bu alanı doldurun.' : 'Complete this field.';
  }
  for (const [field, value] of Object.entries(values)) {
    if (typeof value !== 'string') continue;
    const maxLength = inquiryFieldLimits[field] || 250;
    if (value.trim().length > maxLength) errors[field] = isTr ? `En fazla ${maxLength} karakter girin.` : `Use at most ${maxLength} characters.`;
    if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/u.test(value)) errors[field] = isTr ? 'Geçerli bir değer girin.' : 'Enter a valid value.';
  }
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(String(values.email).trim())) {
    errors.email = isTr ? 'Geçerli bir e-posta adresi girin.' : 'Enter a valid email address.';
  }
  if (values.phone && (!/^[+\d\s().-]+$/u.test(String(values.phone)) || String(values.phone).replace(/\D/g, '').length < 7 || String(values.phone).replace(/\D/g, '').length > 20)) {
    errors.phone = isTr ? 'Ülke koduyla geçerli bir telefon numarası girin.' : 'Enter a valid phone number with its country code.';
  }
  if (values.website && String(values.website).trim()) {
    try {
      const value = String(values.website).trim();
      const url = new URL(value.includes('://') ? value : `https://${value}`);
      if (!['http:', 'https:'].includes(url.protocol) || !url.hostname.includes('.') || url.username || url.password) throw new Error('Invalid website');
    } catch {
      errors.website = isTr ? 'Geçerli bir web sitesi adresi girin.' : 'Enter a valid website address.';
    }
  }
  return errors;
}

export function deliveryDateBounds(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now);
  const datePart = (type: string) => parts.find((part) => part.type === type)!.value;
  const minimum = new Date(`${datePart('year')}-${datePart('month')}-${datePart('day')}T00:00:00Z`);
  const maximum = new Date(minimum);
  maximum.setUTCDate(maximum.getUTCDate() + 730);
  return { min: minimum.toISOString().slice(0, 10), max: maximum.toISOString().slice(0, 10) };
}

export function validateRfq(values: Partial<RFQSubmission>, lang: Locale, step?: number): FieldErrors {
  const required = ['product', 'variety', 'caliber', 'quantity', 'unit', 'packaging', 'destinationCountry', 'destinationCity', 'incoterm', 'requestedDeliveryDate', 'companyName', 'contactPerson', 'email', 'phone'];
  const errors = validateFields(values, required, lang);
  const invalidChoice = lang === 'tr' ? 'Listeden geçerli bir seçenek seçin.' : 'Choose a valid option from the list.';
  const product = productsData.find((item) => item.id === values.product);
  if (values.product && !product) errors.product = invalidChoice;
  if (product && values.variety && values.variety !== 'recommendation' && !product.varieties.some((item) => item.name === values.variety)) errors.variety = invalidChoice;
  if (product && values.caliber && !getProductCaliberOptions(product, lang).some((item) => item.value === values.caliber)) errors.caliber = invalidChoice;
  if (values.unit && !(rfqUnits as readonly string[]).includes(values.unit)) errors.unit = invalidChoice;
  if (values.incoterm && !(rfqIncoterms as readonly string[]).includes(values.incoterm)) errors.incoterm = invalidChoice;
  if (values.packaging && !packagingData.some((item) => item.id === values.packaging)) errors.packaging = invalidChoice;
  const quantity = String(values.quantity ?? '').trim().replace(',', '.');
  if (quantity && (!/^\d+(\.\d{1,3})?$/u.test(quantity) || !Number.isFinite(Number(quantity)) || Number(quantity) <= 0 || Number(quantity) > 1000000)) {
    errors.quantity = lang === 'tr' ? '0 ile 1.000.000 arasında, en fazla 3 ondalıklı bir miktar girin.' : 'Enter a quantity above zero and up to 1,000,000, with at most 3 decimal places.';
  }
  if (quantity && ['container', 'Containers (40ft FCL)'].includes(values.unit || '') && (!Number.isInteger(Number(quantity)) || Number(quantity) > 10000)) {
    errors.quantity = lang === 'tr' ? 'En fazla 10.000 konteyner olacak şekilde tam sayı girin.' : 'Enter a whole number of containers, up to 10,000.';
  }
  if (!values.destinationPort?.trim() && !values.deliveryAddress?.trim()) {
    errors.destinationPort = lang === 'tr' ? 'Hedef limanı veya teslim adresini girin.' : 'Enter a destination port or delivery address.';
  }
  if (values.requestedDeliveryDate) {
    const date = values.requestedDeliveryDate;
    const bounds = deliveryDateBounds();
    const parsed = new Date(`${date}T00:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/u.test(date) || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date || date < bounds.min || date > bounds.max) {
      errors.requestedDeliveryDate = lang === 'tr' ? 'Bugünden itibaren iki yıl içinde geçerli bir tarih seçin.' : 'Choose a valid date from today within the next two years.';
    }
  }
  return step ? Object.fromEntries(Object.entries(errors).filter(([field]) => rfqFieldSteps[field] === step)) : errors;
}

export function validateContact(values: Record<string, string>, lang: Locale): FieldErrors {
  return validateFields(values, ['name', 'company', 'email', 'phone', 'subject', 'message'], lang);
}
