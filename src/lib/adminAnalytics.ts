import { AdminApiError } from './adminAuth';

export interface VisitedPageItem {
  path: string;
  title?: string;
  timestamp: number;
}

export interface VisitorSession {
  id: string;
  sessionId: string;
  visitorId: string;
  startedAt: number;
  lastActivityAt: number;
  durationSeconds: number;
  timezone: string;
  country: string;
  city: string;
  region: string;
  isVpnOrProxy: boolean;
  deviceType: 'desktop' | 'mobile' | 'tablet' | 'unknown';
  deviceBrand: string;
  deviceModel: string;
  os: string;
  browser: string;
  browserLanguage: string;
  screenResolution: string;
  entryPage: string;
  exitPage: string;
  pageviewsCount: number;
  pagesVisited: VisitedPageItem[];
  referrer: string;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  utmContent?: string | null;
  hasConverted: boolean;
  conversionKind?: 'rfq' | 'contact' | null;
  conversionReferenceCode?: string | null;
  isBot: boolean;
  botName?: string | null;
  isTest?: boolean;
}

export interface AnalyticsBreakdownItem {
  name?: string;
  type?: string;
  source?: string;
  path?: string;
  count: number;
}

export interface DailyTrendItem {
  date: string;
  sessions: number;
  pageviews: number;
  uniqueVisitors: number;
}

export interface VisitorSummary {
  totalSessions: number;
  totalPageviews: number;
  uniqueVisitors: number;
  activeVisitors: number;
  activeWindowMinutes: number;
  conversionCount: number;
  conversionRate: number;
  breakdowns: {
    countries: AnalyticsBreakdownItem[];
    devices: AnalyticsBreakdownItem[];
    os: AnalyticsBreakdownItem[];
    browsers: AnalyticsBreakdownItem[];
    sources: AnalyticsBreakdownItem[];
    topPages: AnalyticsBreakdownItem[];
    daily: DailyTrendItem[];
  };
}

export interface AuthLogRecord {
  id: string;
  timestamp: string;
  email: string;
  status: 'SUCCESS' | 'FAILED';
  reason: string;
  country: string;
  city: string;
  deviceType: string;
  os: string;
  browser: string;
}

export interface AnalyticsFilterParams {
  range?: 'today' | '7d' | '30d' | 'all';
  country?: string;
  device?: string;
  browser?: string;
  pagePath?: string;
  converted?: 'all' | 'yes' | 'no';
  bot?: 'all' | 'human' | 'bot';
  page?: number;
  limit?: number;
}

export interface VisitorAnalyticsResponse {
  summary: VisitorSummary;
  sessions: {
    items: VisitorSession[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AuthLogsResponse {
  items: AuthLogRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const apiBase = (process.env.NEXT_PUBLIC_INQUIRY_API_URL || '/api').replace(/\/$/, '');

async function adminAnalyticsRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);
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
        ? 'Sunucu yanıt süresi aşıldı.'
        : 'Backend sunucusuna bağlanılamadı.',
      503
    );
  }
}

export async function getVisitorAnalytics(filters: AnalyticsFilterParams = {}): Promise<VisitorAnalyticsResponse> {
  const query = new URLSearchParams();
  if (filters.range) query.set('range', filters.range);
  if (filters.country && filters.country !== 'all') query.set('country', filters.country);
  if (filters.device && filters.device !== 'all') query.set('device', filters.device);
  if (filters.browser && filters.browser !== 'all') query.set('browser', filters.browser);
  if (filters.pagePath) query.set('pagePath', filters.pagePath);
  if (filters.converted && filters.converted !== 'all') query.set('converted', filters.converted);
  if (filters.bot && filters.bot !== 'all') query.set('bot', filters.bot);
  if (filters.page) query.set('page', String(filters.page));
  if (filters.limit) query.set('limit', String(filters.limit));

  return adminAnalyticsRequest<VisitorAnalyticsResponse>(`/analytics/data?${query.toString()}`);
}

export async function getSessionDetail(id: string): Promise<VisitorSession> {
  const res = await adminAnalyticsRequest<{ session: VisitorSession }>(`/analytics/sessions/${encodeURIComponent(id)}`);
  return res.session;
}

export async function getAuthLogs(page = 1, limit = 25): Promise<AuthLogsResponse> {
  return adminAnalyticsRequest<AuthLogsResponse>(`/analytics/auth-logs?page=${page}&limit=${limit}`);
}

export async function downloadSessionsCsv(filters: AnalyticsFilterParams = {}): Promise<void> {
  const query = new URLSearchParams();
  if (filters.range) query.set('range', filters.range);
  if (filters.country && filters.country !== 'all') query.set('country', filters.country);
  if (filters.device && filters.device !== 'all') query.set('device', filters.device);
  if (filters.browser && filters.browser !== 'all') query.set('browser', filters.browser);
  if (filters.pagePath) query.set('pagePath', filters.pagePath);
  if (filters.converted && filters.converted !== 'all') query.set('converted', filters.converted);
  if (filters.bot && filters.bot !== 'all') query.set('bot', filters.bot);

  const response = await fetch(`${apiBase}/admin/analytics/export?${query.toString()}`, {
    credentials: 'same-origin',
    headers: {
      'X-Nilasya-Request': '1',
    },
  });

  if (!response.ok) {
    throw new AdminApiError('CSV dışa aktarma dosyası oluşturulamadı.', response.status);
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `nilasya-ziyaretci-analizi-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
