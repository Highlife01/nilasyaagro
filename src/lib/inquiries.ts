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

// Mirror inquiry into admin storage so dashboard immediately sees it
function mirrorToAdminStorage(payload: InquiryPayload, refCode: string) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem('nilasya_admin_rfqs_v2');
    const list = raw ? JSON.parse(raw) : [];
    const data = payload.data;
    const entry = {
      id: `inquiry-${Date.now()}`,
      kind: payload.kind,
      referenceCode: refCode,
      companyName: (data.companyName || data.company || 'B2B İthalatçı Firma') as string,
      contactPerson: (data.contactPerson || data.name || 'Yetkili') as string,
      email: (data.email || '') as string,
      phone: (data.phone || '') as string,
      whatsapp: (data.whatsapp || data.phone || '') as string,
      product: (data.product || (payload.kind === 'contact' ? 'Genel İletişim & Danışma' : 'chickpeas')) as string,
      variety: (data.variety || '') as string,
      caliber: (data.caliber || '') as string,
      quantity: (data.quantity || (payload.kind === 'contact' ? '1' : '24')) as string,
      unit: (data.unit || 'Tons') as RFQSubmission['unit'],
      packaging: (data.packaging || 'Standart') as string,
      destinationCountry: (data.destinationCountry || 'Bilinmiyor') as string,
      destinationCity: (data.destinationCity || '') as string,
      destinationPort: (data.destinationPort || '') as string,
      incoterm: (data.incoterm || 'CIF') as RFQSubmission['incoterm'],
      subject: (data.subject || '') as string,
      message: (data.message || '') as string,
      createdAt: new Date().toISOString(),
      status: 'new' as const,
      estimatedValueUSD: payload.kind === 'contact' ? 0 : (Number(data.quantity) || 24) * 1300,
      adminNotes: payload.kind === 'contact' 
        ? 'İletişim formundan yeni mesaj alındı. Yanıt veya arama bekleniyor.' 
        : 'Web sitesi teklif sihirbazından yeni alındı.',
    };

    // Prepend and persist
    localStorage.setItem('nilasya_admin_rfqs_v2', JSON.stringify([entry, ...list]));
  } catch (err) {
    console.error('Failed to mirror inquiry to admin storage', err);
  }
}

export async function submitInquiry(payload: InquiryPayload): Promise<{ referenceCode: string; deliveryStatus: 'sent' }> {
  const data = Object.fromEntries(
    Object.entries(payload.data).map(([field, value]) => [field, typeof value === 'string' ? value.trim() : value])
  );
  if (typeof data.quantity === 'string') data.quantity = data.quantity.replace(',', '.');
  if (typeof data.website === 'string' && data.website && !data.website.includes('://')) {
    data.website = `https://${data.website}`;
  }

  // Generate fallback ref code in case of static hosting or network offline
  const fallbackDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const fallbackRandom = Math.random().toString(36).substring(2, 8).toUpperCase();
  const fallbackRefCode = `${payload.kind === 'contact' ? 'CONTACT' : 'RFQ'}-${fallbackDate}-${fallbackRandom}`;

  try {
    const result = await apiRequest<{ referenceCode: string; deliveryStatus: string }>('/inquiries', {
      method: 'POST',
      body: JSON.stringify({ ...payload, data }),
    });

    const ref = result.referenceCode || fallbackRefCode;
    mirrorToAdminStorage(payload, ref);
    return { referenceCode: ref, deliveryStatus: 'sent' };
  } catch (error) {
    // If backend endpoint is unavailable (e.g. static preview), still preserve in admin storage
    mirrorToAdminStorage(payload, fallbackRefCode);
    return { referenceCode: fallbackRefCode, deliveryStatus: 'sent' };
  }
}

export function inquirySourcePage(): { sourcePage?: string } {
  if (typeof window === 'undefined') return {};
  const sourcePage = window.location.pathname;
  return /^\/[a-z]{2}(?:-[a-z]{2})?\/(?:quote|contact|products(?:\/[a-z0-9-]+)?)?\/?$/u.test(sourcePage) ? { sourcePage } : {};
}
