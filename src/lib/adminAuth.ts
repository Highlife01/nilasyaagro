import type { RFQSubmission } from '@/types';

export type AdminDataStatus = 'loading' | 'ready' | 'error';

export interface AdminUser {
  email: string;
  name: string;
  role: 'ROOT_SUPER_ADMIN' | 'EXPORT_MANAGER' | 'SALES_REP';
  title: string;
  avatar: string;
  lastLoginAt: string;
}

export interface AdminAuditLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
  ip: string;
}

export interface AdminInquiry extends Partial<RFQSubmission> {
  id: string;
  kind?: 'rfq' | 'contact';
  referenceCode: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  whatsapp?: string;
  createdAt: string;
  status: 'new' | 'quoted' | 'negotiation' | 'approved' | 'archived';
  estimatedValueUSD: number;
  adminNotes?: string;
  subject?: string;
  variety?: string;
  caliber?: string;
  quantity?: string;
  unit?: RFQSubmission['unit'];
  packaging?: string;
  destinationCountry?: string;
  destinationCity?: string;
  destinationPort?: string;
  incoterm?: RFQSubmission['incoterm'];
  message?: string;
  website?: string;
}

export interface ExportContainer {
  id: string;
  containerNo: string;
  bookingRef: string;
  carrier: string;
  produce: string;
  tonnage: number;
  originPort: string;
  destinationPort: string;
  destinationCountry: string;
  incoterm: string;
  setTemperature: string;
  currentTemperature: string;
  humidity: string;
  status: 'packhouse' | 'customs' | 'in_transit' | 'delivered';
  departureDate: string;
  eta: string;
  vesselName: string;
}

export interface ProductStockControl {
  productId: string;
  seasonStatus: 'peak' | 'storage' | 'preorder' | 'closed';
  moqTons: number;
  availableStockMT: number;
  exportQualityScore: number;
  storageCondition: string;
  activeCalibers: string[];
}

export class AdminApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = 'AdminApiError';
  }
}

const apiBase = (process.env.NEXT_PUBLIC_INQUIRY_API_URL || '/api').replace(/\/$/, '');

// Helper: Safely query real backend API without mock or localStorage fallback
async function adminRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(`${apiBase}/admin${path}`, {
      ...init,
      credentials: 'same-origin',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'X-Nilasya-Request': '1',
        ...(init.headers || {}),
      },
      signal: init.signal || controller.signal,
    });
    clearTimeout(timeoutId);
    const body = await response.json().catch(() => null);
    if (!response.ok || !body) {
      throw new AdminApiError(body?.error || 'Sunucu işlemi tamamlanamadı.', response.status);
    }
    return body as T;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof AdminApiError) throw err;
    throw new AdminApiError(
      err instanceof Error && err.name === 'AbortError'
        ? 'Sunucu yanıt süresi aşıldı (Zaman aşımı).'
        : 'Backend sunucusuna ulaşılamadı. Lütfen sunucu ve veritabanı bağlantısını kontrol edin.',
      503
    );
  }
}

// Session Management - Server authenticated only
export async function getAdminSession(signal?: AbortSignal): Promise<AdminUser | null> {
  if (typeof window === 'undefined') return null;

  try {
    const { user } = await adminRequest<{ user: AdminUser }>('/session', { signal });
    return user || null;
  } catch (error) {
    if (error instanceof AdminApiError && (error.status === 401 || error.status === 403)) {
      return null;
    }
    throw error;
  }
}

export async function loginAdmin(email: string, password: string, rememberMe = true): Promise<AdminUser> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !password) {
    throw new AdminApiError('E-posta adresi ve şifre zorunludur.', 400);
  }

  const { user } = await adminRequest<{ user: AdminUser }>('/login', {
    method: 'POST',
    body: JSON.stringify({ email: cleanEmail, password, rememberMe }),
  });

  if (!user) {
    throw new AdminApiError('Giriş başarısız oldu.', 401);
  }

  return user;
}

export async function logoutAdmin(): Promise<void> {
  await adminRequest('/logout', { method: 'POST', body: '{}' }).catch(() => null);
}

// RFQ Management - Real Server Database only
export async function getStoredRFQs(signal?: AbortSignal): Promise<AdminInquiry[]> {
  const response = await adminRequest<{ items: AdminInquiry[] }>('/rfqs', { signal });
  return Array.isArray(response.items) ? response.items : [];
}

export async function saveRFQInquiry(inquiry: Partial<RFQSubmission>): Promise<{ id: string }> {
  return await adminRequest<{ id: string }>('/rfqs', {
    method: 'POST',
    body: JSON.stringify(inquiry),
  });
}

export async function updateRFQ(id: string, updates: Partial<AdminInquiry>): Promise<void> {
  await adminRequest(`/rfqs/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

export async function deleteRFQ(id: string): Promise<void> {
  await adminRequest(`/rfqs/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    body: '{}',
  });
}

// Container & Logistics Management - Real Server Database only
export async function getStoredContainers(signal?: AbortSignal): Promise<ExportContainer[]> {
  const response = await adminRequest<{ items: ExportContainer[] }>('/containers', { signal });
  return Array.isArray(response.items) ? response.items : [];
}

export async function saveContainer(container: Omit<ExportContainer, 'id'>): Promise<{ id: string }> {
  return await adminRequest<{ id: string }>('/containers', {
    method: 'POST',
    body: JSON.stringify(container),
  });
}

export async function updateContainerStatus(id: string, status: ExportContainer['status']): Promise<void> {
  await adminRequest(`/containers/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function deleteContainer(id: string): Promise<void> {
  await adminRequest(`/containers/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    body: '{}',
  });
}

// Product Stocks Management - Real Server Database only
export async function getStoredProductStocks(signal?: AbortSignal): Promise<ProductStockControl[]> {
  const response = await adminRequest<{ items: ProductStockControl[] }>('/stocks', { signal });
  return Array.isArray(response.items) ? response.items : [];
}

export async function updateProductStock(productId: string, stock: ProductStockControl): Promise<void> {
  await adminRequest(`/stocks/${encodeURIComponent(productId)}`, {
    method: 'PUT',
    body: JSON.stringify(stock),
  });
}

// Audit Logs - Real Server Database only
export async function getAuditLogs(signal?: AbortSignal): Promise<AdminAuditLog[]> {
  const response = await adminRequest<{ items: AdminAuditLog[] }>('/audit', { signal });
  return Array.isArray(response.items) ? response.items : [];
}
