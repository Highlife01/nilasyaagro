import type { Locale, RFQSubmission } from '@/types';

export interface InquiryPayload {
  kind: 'rfq' | 'contact';
  language: Locale;
  data: Partial<RFQSubmission> & Record<string, unknown>;
  requestId?: string;
  metadata?: { sourcePage?: string };
}

const apiBase = (process.env.NEXT_PUBLIC_INQUIRY_API_URL || '/api').replace(/\/$/, '');
export function isInquiryApiConfigured(): boolean { return Boolean(apiBase); }
export interface InquiryErrorDetails { referenceCode?: string; saved?: boolean; deliveryStatus?: string }
export class ApiError extends Error {
  constructor(message: string, public readonly status: number, public readonly details?: InquiryErrorDetails) { super(message); this.name = 'ApiError'; }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, {
    ...init, credentials: 'same-origin', cache: 'no-store',
    headers: { 'Content-Type': 'application/json', 'X-Nilasya-Request': '1', ...init.headers },
    signal: init.signal || AbortSignal.timeout(20000),
  });
  const body = await response.json().catch(() => null) as ({ error?: string } & InquiryErrorDetails) | null;
  if (!response.ok || !body) throw new ApiError(body?.error || 'The request could not be completed. Please retry or contact our trade desk.', response.status, body || undefined);
  return body as T;
}

export async function submitInquiry(payload: InquiryPayload): Promise<{ referenceCode: string; deliveryStatus: 'sent' }> {
  const data = Object.fromEntries(Object.entries(payload.data).map(([field, value]) => [field, typeof value === 'string' ? value.trim() : value]));
  if (typeof data.quantity === 'string') data.quantity = data.quantity.replace(',', '.');
  if (typeof data.website === 'string' && data.website && !data.website.includes('://')) data.website = `https://${data.website}`;
  const result = await apiRequest<{ referenceCode: string; deliveryStatus: string }>('/inquiries', { method: 'POST', body: JSON.stringify({ ...payload, data }) });
  if (!result.referenceCode || result.deliveryStatus !== 'sent') throw new ApiError('Notification delivery is pending. Please retry.', 503, { ...result, saved: Boolean(result.referenceCode) });
  return { referenceCode: result.referenceCode, deliveryStatus: 'sent' };
}

export function inquirySourcePage(): { sourcePage?: string } {
  if (typeof window === 'undefined') return {};
  const sourcePage = window.location.pathname;
  return /^\/[a-z]{2}(?:-[a-z]{2})?\/(?:quote|contact|products(?:\/[a-z0-9-]+)?)?\/?$/u.test(sourcePage) ? { sourcePage } : {};
}
