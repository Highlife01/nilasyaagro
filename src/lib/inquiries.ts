import type { Locale, RFQSubmission } from '@/types';

export interface InquiryPayload {
  kind: 'rfq' | 'contact';
  language: Locale;
  data: Partial<RFQSubmission> & Record<string, unknown>;
}

const apiBase = (process.env.NEXT_PUBLIC_INQUIRY_API_URL || '/api').replace(/\/$/, '');

export function isInquiryApiConfigured(): boolean {
  return Boolean(apiBase);
}

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
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
    signal: init.signal || AbortSignal.timeout(20000),
  });
  const body = await response.json().catch(() => null) as { error?: string } | null;
  if (!response.ok || !body) {
    throw new ApiError(body?.error || 'The request could not be completed. Please retry or contact our trade desk.', response.status);
  }
  return body as T;
}

export async function submitInquiry(payload: InquiryPayload): Promise<{ referenceCode: string }> {
  return apiRequest('/inquiries', { method: 'POST', body: JSON.stringify(payload) });
}
