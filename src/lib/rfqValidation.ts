import type { Locale, RFQSubmission } from '@/types';

export type FieldErrors = Record<string, string>;

export const rfqFieldSteps: Record<string, number> = {
  product: 1, variety: 1, caliber: 1,
  quantity: 2, unit: 2, packaging: 2,
  destinationCountry: 3, destinationCity: 3, destinationPort: 3, incoterm: 3,
  companyName: 4, website: 4, message: 4,
  contactPerson: 5, email: 5, phone: 5, consent: 5,
};

export function initialRfqData(product = 'chickpeas'): Partial<RFQSubmission> {
  return {
    product, variety: '', caliber: 'recommendation', quantity: '48', unit: 'Tons',
    packaging: 'pp_woven_bag_25kg_50kg', destinationCountry: '',
    destinationCity: '', destinationPort: '', incoterm: 'CIF', companyName: '',
    website: '', contactPerson: '', email: '', phone: '', whatsapp: '', message: '',
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
    const maxLength = field === 'message' ? 5000 : field === 'website' ? 2048 : 254;
    if (value.length > maxLength) errors[field] = isTr ? `En fazla ${maxLength} karakter girin.` : `Use at most ${maxLength} characters.`;
  }
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(values.email).trim())) {
    errors.email = isTr ? 'Geçerli bir e-posta adresi girin.' : 'Enter a valid email address.';
  }
  if (values.phone && (!/^[+\d\s().-]+$/.test(String(values.phone)) || String(values.phone).replace(/\D/g, '').length < 7 || String(values.phone).replace(/\D/g, '').length > 20)) {
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

export function validateRfq(values: Partial<RFQSubmission>, lang: Locale, step?: number): FieldErrors {
  const required = ['product', 'caliber', 'quantity', 'unit', 'packaging', 'destinationCountry', 'destinationCity', 'incoterm', 'companyName', 'contactPerson', 'email', 'phone'];
  const errors = validateFields(values, required, lang);
  const quantity = String(values.quantity ?? '').trim().replace(',', '.');
  if (quantity && (!/^\d+(\.\d+)?$/.test(quantity) || !Number.isFinite(Number(quantity)) || Number(quantity) <= 0)) {
    errors.quantity = lang === 'tr' ? 'Sıfırdan büyük bir miktar girin.' : 'Enter a quantity greater than zero.';
  }
  return step ? Object.fromEntries(Object.entries(errors).filter(([field]) => rfqFieldSteps[field] === step)) : errors;
}

export function validateContact(values: Record<string, string>, lang: Locale): FieldErrors {
  return validateFields(values, ['name', 'company', 'email', 'phone', 'subject', 'message'], lang);
}
