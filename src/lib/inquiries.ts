import type { Locale, RFQSubmission } from '@/types';
import { getActiveSessionId } from './visitorTracking';

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
  constructor(message: string, public readonly status: number, public readonly details?: InquiryErrorDetails) { 
    super(message); 
    this.name = 'ApiError'; 
  }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, {
    ...init, 
    credentials: 'same-origin', 
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json', 'X-Nilasya-Request': '1', ...init.headers },
    signal: init.signal || AbortSignal.timeout(10000),
  });
  const body = await response.json().catch(() => null) as ({ error?: string } & InquiryErrorDetails) | null;
  if (!response.ok || !body) {
    throw new ApiError(body?.error || 'Talep işlenemedi.', response.status, body || undefined);
  }
  return body as T;
}

export async function submitInquiry(payload: InquiryPayload): Promise<{ referenceCode: string; deliveryStatus: 'sent' }> {
  const data = Object.fromEntries(
    Object.entries(payload.data).map(([field, value]) => [field, typeof value === 'string' ? value.trim() : value])
  );
  if (typeof data.quantity === 'string') data.quantity = data.quantity.replace(',', '.');
  if (typeof data.website === 'string' && data.website && !data.website.includes('://')) {
    data.website = `https://${data.website}`;
  }

  const sessionId = getActiveSessionId();
  const headers: Record<string, string> = {};
  if (sessionId) {
    headers['x-nilasya-session-id'] = sessionId;
  }

  const result = await apiRequest<{ referenceCode: string; deliveryStatus: string }>('/inquiries', {
    method: 'POST',
    headers,
    body: JSON.stringify({ ...payload, data }),
  });

  return { referenceCode: result.referenceCode, deliveryStatus: 'sent' };
}


export function inquirySourcePage(): { sourcePage?: string } {
  if (typeof window === 'undefined') return {};
  const sourcePage = window.location.pathname;
  return /^\/[a-z]{2}(?:-[a-z]{2})?\/(?:quote|contact|products(?:\/[a-z0-9-]+)?)?\/?$/u.test(sourcePage) ? { sourcePage } : {};
}
