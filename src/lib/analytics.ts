const eventNames = [
  'rfq_view', 'rfq_start', 'rfq_product_selected', 'rfq_step_completed',
  'rfq_validation_error', 'rfq_submit_success', 'rfq_submit_error',
  'whatsapp_click', 'email_click', 'product_spec_view', 'product_to_rfq_click',
] as const;
export type AnalyticsEvent = typeof eventNames[number];
export type AnalyticsParameters = {
  product_slug?: string; country_code?: string; step?: number; field?: string; error_code?: string;
};
const productIds = new Set([
  'chickpeas', 'red-lentils', 'green-lentils', 'white-beans', 'dry-peas',
  'durum-wheat-bulgur', 'other-pulses-seeds', 'broad-beans', 'rice', 'pasta',
]);
const fields = new Set([
  'product', 'variety', 'caliber', 'quantity', 'unit', 'packaging', 'destinationCountry',
  'destinationCity', 'destinationPort', 'incoterm', 'targetDate', 'companyName',
  'deliveryAddress', 'requestedDeliveryDate',
  'website', 'contactPerson', 'email', 'phone', 'consent', 'message', 'subject',
]);
const errorCodes = new Set(['validation', 'network', 'rate_limit', 'unavailable', 'delivery_pending', 'unknown']);
const consentKey = 'nilasya.analytics-consent.v1';
let sessionConsent: 'granted' | 'denied' | null = null;

export function subscribeAnalyticsConsent(callback: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === consentKey || event.key === null) callback();
  };
  window.addEventListener('nilasya:analytics-consent', callback);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener('nilasya:analytics-consent', callback);
    window.removeEventListener('storage', onStorage);
  };
}

/** Runtime allowlist: callers cannot accidentally pass form values or URLs to analytics. */
export function safeAnalyticsParameters(values: AnalyticsParameters): AnalyticsParameters {
  const result: AnalyticsParameters = {};
  if (typeof values.product_slug === 'string' && productIds.has(values.product_slug)) result.product_slug = values.product_slug;
  if (typeof values.country_code === 'string' && /^[A-Z]{2}$/.test(values.country_code)) result.country_code = values.country_code;
  if (Number.isInteger(values.step) && values.step! >= 1 && values.step! <= 5) result.step = values.step;
  if (typeof values.field === 'string' && fields.has(values.field)) result.field = values.field;
  if (typeof values.error_code === 'string' && errorCodes.has(values.error_code)) result.error_code = values.error_code;
  return result;
}

export function analyticsConsent(): 'granted' | 'denied' | null {
  if (typeof window === 'undefined') return null;
  try {
    const value = window.localStorage.getItem(consentKey);
    return value === 'granted' || value === 'denied' ? value : sessionConsent;
  } catch { return sessionConsent; }
}

export function setAnalyticsConsent(value: 'granted' | 'denied') {
  if (typeof window === 'undefined') return;
  sessionConsent = value;
  try { window.localStorage.setItem(consentKey, value); } catch { /* Session choice still applies. */ }
  window.dispatchEvent(new CustomEvent('nilasya:analytics-consent', { detail: value }));
}

export function trackEvent(name: AnalyticsEvent, values: AnalyticsParameters = {}) {
  if (typeof window === 'undefined' || !eventNames.includes(name) || analyticsConsent() !== 'granted') return;
  const parameters = safeAnalyticsParameters(values);
  // No analytics script is loaded here. A consent-aware host integration may consume this event.
  window.dispatchEvent(new CustomEvent('nilasya:analytics', { detail: { name, parameters } }));
  const analyticsWindow = window as Window & { gtag?: (...args: unknown[]) => void };
  if (typeof analyticsWindow.gtag === 'function') {
    try { analyticsWindow.gtag('event', name, parameters); } catch { /* Measurement must not interrupt the form. */ }
  }
}
