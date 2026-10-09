import type { RFQSubmission } from '@/types';

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
  createdAt: string;
  status: 'new' | 'quoted' | 'negotiation' | 'approved' | 'archived';
  estimatedValueUSD: number;
  adminNotes?: string;
  subject?: string;
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

// The API authenticates requests and checks current permissions. Credentials and
// operational records are never persisted in browser storage.
async function adminRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api/admin${path}`, {
    ...init,
    credentials: 'same-origin',
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json', 'X-Nilasya-Request': '1' },
    signal: init.signal ?? AbortSignal.timeout(20000),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok || !body) {
    throw new AdminApiError(body?.error || 'İşlem tamamlanamadı. Lütfen yeniden deneyin.', response.status);
  }
  return body as T;
}

export async function getAdminSession(signal?: AbortSignal): Promise<AdminUser | null> {
  try {
    const { user } = await adminRequest<{ user: AdminUser }>('/session', { signal });
    return user;
  } catch (error) {
    if (error instanceof AdminApiError && [401, 403].includes(error.status)) return null;
    throw error;
  }
}

export async function loginAdmin(email: string, password: string, rememberMe = false): Promise<AdminUser> {
  const { user } = await adminRequest<{ user: AdminUser }>('/login', {
    method: 'POST', body: JSON.stringify({ email: email.trim(), password, rememberMe }),
  });
  return user;
}

export async function logoutAdmin(): Promise<void> {
  await adminRequest('/logout', { method: 'POST', body: '{}' });
}

async function list<T>(resource: string, signal?: AbortSignal): Promise<T[]> {
  const response = await adminRequest<{ items: T[] }>(`/${resource}`, { signal });
  if (!Array.isArray(response.items)) throw new AdminApiError('Sunucu geçerli bir kayıt listesi döndürmedi.', 503);
  return response.items;
}

export const getStoredRFQs = (signal?: AbortSignal) => list<AdminInquiry>('rfqs', signal);
export const getStoredContainers = (signal?: AbortSignal) => list<ExportContainer>('containers', signal);
export const getStoredProductStocks = (signal?: AbortSignal) => list<ProductStockControl>('stocks', signal);
export const getAuditLogs = (signal?: AbortSignal) => list<AdminAuditLog>('audit', signal);

export async function saveRFQInquiry(inquiry: Partial<RFQSubmission>): Promise<void> {
  await adminRequest('/rfqs', { method: 'POST', body: JSON.stringify(inquiry) });
}

export async function updateRFQ(id: string, updates: Pick<Partial<AdminInquiry>, 'status' | 'adminNotes' | 'estimatedValueUSD'>): Promise<void> {
  await adminRequest(`/rfqs/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(updates) });
}

export async function deleteRFQ(id: string): Promise<void> {
  await adminRequest(`/rfqs/${encodeURIComponent(id)}`, { method: 'DELETE', body: '{}' });
}

export async function updateProductStock(productId: string, stock: ProductStockControl): Promise<void> {
  await adminRequest(`/stocks/${encodeURIComponent(productId)}`, { method: 'PUT', body: JSON.stringify(stock) });
}

