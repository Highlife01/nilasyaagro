'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Users, 
  Eye, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Download, 
  Filter, 
  RefreshCw, 
  Smartphone, 
  Laptop, 
  Tablet, 
  Globe, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  ExternalLink,
  Bot,
  UserCheck,
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  ArrowRight,
  X,
  FileSpreadsheet,
  Lock,
  Compass
} from 'lucide-react';
import { 
  VisitorSession, 
  VisitorSummary, 
  AuthLogRecord, 
  AnalyticsFilterParams, 
  getVisitorAnalytics, 
  getAuthLogs, 
  downloadSessionsCsv 
} from '@/lib/adminAnalytics';

interface AnalyticsTabProps {
  onNavigateToQuotes?: () => void;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = () => {
  const [subTab, setSubTab] = useState<'visitors' | 'authLogs'>('visitors');

  // Filter States
  const [range, setRange] = useState<'today' | '7d' | '30d' | 'all'>('7d');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [deviceFilter, setDeviceFilter] = useState<string>('all');
  const [browserFilter, setBrowserFilter] = useState<string>('all');
  const [pageSearch, setPageSearch] = useState<string>('');
  const [conversionFilter, setConversionFilter] = useState<'all' | 'yes' | 'no'>('all');
  const [botFilter, setBotFilter] = useState<'all' | 'human' | 'bot'>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Data States
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [summary, setSummary] = useState<VisitorSummary | null>(null);
  const [sessions, setSessions] = useState<VisitorSession[]>([]);
  const [totalSessions, setTotalSessions] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Auth Logs Data States
  const [authLogs, setAuthLogs] = useState<AuthLogRecord[]>([]);
  const [authLogsTotal, setAuthLogsTotal] = useState<number>(0);
  const [authLogsPage, setAuthLogsPage] = useState<number>(1);
  const [authLogsTotalPages, setAuthLogsTotalPages] = useState<number>(1);

  // Detail Modal State
  const [selectedSession, setSelectedSession] = useState<VisitorSession | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Load Visitor Analytics Data
  const loadVisitorData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    setErrorMessage(null);

    try {
      const filters: AnalyticsFilterParams = {
        range,
        country: countryFilter,
        device: deviceFilter,
        browser: browserFilter,
        pagePath: pageSearch.trim() || undefined,
        converted: conversionFilter,
        bot: botFilter,
        page: currentPage,
        limit: 25,
      };

      const res = await getVisitorAnalytics(filters);
      setSummary(res.summary);
      setSessions(res.sessions.items || []);
      setTotalSessions(res.sessions.total || 0);
      setTotalPages(res.sessions.totalPages || 1);
    } catch (err) {
      console.error('Failed to load visitor analytics:', err);
      setErrorMessage(err instanceof Error ? err.message : 'Ziyaretçi verileri sunucudan alınamadı.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [range, countryFilter, deviceFilter, browserFilter, pageSearch, conversionFilter, botFilter, currentPage]);

  // Load Auth Logs Data
  const loadAuthLogsData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await getAuthLogs(authLogsPage, 25);
      setAuthLogs(res.items || []);
      setAuthLogsTotal(res.total || 0);
      setAuthLogsTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Failed to load auth logs:', err);
      setErrorMessage(err instanceof Error ? err.message : 'Giriş kayıtları sunucudan alınamadı.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [authLogsPage]);

  // Initial and reactive load
  useEffect(() => {
    if (subTab === 'visitors') {
      loadVisitorData();
    } else {
      loadAuthLogsData();
    }
  }, [subTab, loadVisitorData, loadAuthLogsData]);

  // Handle CSV Export
  const handleExportCsv = async () => {
    try {
      setIsExporting(true);
      await downloadSessionsCsv({
        range,
        country: countryFilter,
        device: deviceFilter,
        browser: browserFilter,
        pagePath: pageSearch.trim() || undefined,
        converted: conversionFilter,
        bot: botFilter,
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'CSV dışa aktarma başarısız oldu.');
    } finally {
      setIsExporting(false);
    }
  };

  const formatDuration = (seconds: number) => {
    if (!seconds || seconds <= 0) return '< 1 sn';
    if (seconds < 60) return `${seconds} sn`;
    const mins = Math.floor(seconds / 60);
    const rem = seconds % 60;
    return `${mins} dk ${rem > 0 ? `${rem} sn` : ''}`.trim();
  };

  const formatDateTime = (timestamp: number | string, tz = 'UTC') => {
    try {
      const d = new Date(timestamp);
      return new Intl.DateTimeFormat('tr-TR', {
        dateStyle: 'short',
        timeStyle: 'medium',
        timeZone: tz && tz !== 'UTC' ? tz : 'Europe/Istanbul',
      }).format(d);
    } catch {
      return new Date(timestamp).toLocaleString('tr-TR');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & SubTab Navigation */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Ziyaretçi ve Giriş Analizi</h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Canlı Sunucu Verisi
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Yalnızca siteden toplanan gerçek etkinlikler, ziyaretçi oturumları ve sunucu kimlik doğrulama kayıtları.
          </p>
        </div>

        {/* Sub-tab Switches */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => { setSubTab('visitors'); setCurrentPage(1); }}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              subTab === 'visitors'
                ? 'bg-white text-slate-800 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-600" />
            Ziyaretçi Analizi
          </button>
          <button
            type="button"
            onClick={() => { setSubTab('authLogs'); setAuthLogsPage(1); }}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              subTab === 'authLogs'
                ? 'bg-white text-slate-800 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            Giriş Kayıtları
          </button>
          <button
            type="button"
            onClick={() => subTab === 'visitors' ? loadVisitorData(true) : loadAuthLogsData(true)}
            disabled={isRefreshing}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-colors cursor-pointer"
            title="Verileri Yenile"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mandatory Disclaimers Note */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-900 space-y-1.5">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p>
              <strong>Doğruluk ve Ölçüm İlkeleri:</strong> IP konumu sunucu tarafında belirlenir ve yaklaşık bilgi içerir; VPN veya proxy kullanımında gerçek konumdan farklılık gösterebilir.
            </p>
            <p className="text-amber-800">
              Cihaz modelleri yalnızca tarayıcı istemci ipuçları sağladığında gösterilir; iPhone modelleri kesinlik taşımadığından tahmin edilmez ve <em>“Model belirlenemedi”</em> olarak listelenir. Aktif ziyaretçiler <strong>son 5 dakika</strong> içinde etkinlik gösterenleri, süreler ise yalnızca ölçülen etkileşimleri temel alır.
            </p>
          </div>
        </div>
      </div>

      {/* ERROR STATE */}
      {errorMessage && !isLoading && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-3">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-rose-900">Bağlantı Hatası</h3>
          <p className="text-xs text-rose-700 max-w-md mx-auto">{errorMessage}</p>
          <p className="text-[11px] text-slate-500">Sistem kuralları gereği örnek veya tahminî veri gösterilmemektedir.</p>
          <button
            type="button"
            onClick={() => subTab === 'visitors' ? loadVisitorData(true) : loadAuthLogsData(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-xl hover:bg-rose-700 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Tekrar Dene
          </button>
        </div>
      )}

      {/* ===================== TAB 1: VISITOR ANALYTICS ===================== */}
      {subTab === 'visitors' && (
        <>
          {/* STATS OVERVIEW CARDS */}
          {summary && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
              {/* Total Sessions */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">Toplam Ziyaret</span>
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <Compass className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-800 mt-2">{summary.totalSessions.toLocaleString('tr-TR')}</div>
                <span className="text-[11px] text-slate-400">Ölçülen Oturum</span>
              </div>

              {/* Total Pageviews */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">Sayfa Görüntüleme</span>
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-800 mt-2">{summary.totalPageviews.toLocaleString('tr-TR')}</div>
                <span className="text-[11px] text-slate-400">Tekil sayfa geçişleri</span>
              </div>

              {/* Measurable Unique Visitors */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">Tekil Ziyaretçi</span>
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                    <UserCheck className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-800 mt-2">{summary.uniqueVisitors.toLocaleString('tr-TR')}</div>
                <span className="text-[11px] text-slate-400" title="1. taraf çerez izinli tekil cihaz tanımlayıcıları">
                  Ölçülebilen Tekil
                </span>
              </div>

              {/* Active Visitors */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">Aktif Ziyaretçi</span>
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                    <Activity className="w-4 h-4 animate-pulse" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-emerald-700 mt-2 flex items-baseline gap-1.5">
                  {summary.activeVisitors}
                  <span className="text-xs font-normal text-slate-500">çevrimiçi</span>
                </div>
                <span className="text-[11px] text-slate-400">Son 5 dk etkinliği</span>
              </div>

              {/* Conversions */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs col-span-2 md:col-span-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">Form Dönüşümü</span>
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-800 mt-2 flex items-baseline gap-1.5">
                  {summary.conversionCount}
                  <span className="text-xs font-normal text-purple-600 font-semibold">({summary.conversionRate}%)</span>
                </div>
                <span className="text-[11px] text-slate-400">RFQ veya İletişim</span>
              </div>
            </div>
          )}

          {/* REAL DATA VISUAL BREAKDOWNS (ONLY IF DATA EXISTS) */}
          {summary && summary.totalSessions > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Countries */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-blue-600" />
                    En Çok Ziyaret Alan Ülkeler
                  </h3>
                  <span className="text-[11px] text-slate-400">Gerçek IP</span>
                </div>
                <div className="space-y-2.5">
                  {summary.breakdowns.countries.map((c, i) => {
                    const pct = summary.totalSessions > 0 ? Math.round((c.count / summary.totalSessions) * 100) : 0;
                    return (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-slate-700">{c.name}</span>
                          <span className="font-semibold text-slate-900">{c.count} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                  {summary.breakdowns.countries.length === 0 && (
                    <p className="text-xs text-slate-400 py-3 text-center">Henüz ülke verisi oluşmadı.</p>
                  )}
                </div>
              </div>

              {/* Devices & OS */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Laptop className="w-4 h-4 text-emerald-600" />
                    Cihaz ve İşletim Sistemi
                  </h3>
                  <span className="text-[11px] text-slate-400">User-Agent</span>
                </div>
                
                {/* Devices */}
                <div className="grid grid-cols-3 gap-2 pt-1 pb-2 border-b border-slate-100">
                  {['desktop', 'mobile', 'tablet'].map((dev) => {
                    const count = summary.breakdowns.devices.find((d) => d.type === dev)?.count || 0;
                    const pct = summary.totalSessions > 0 ? Math.round((count / summary.totalSessions) * 100) : 0;
                    return (
                      <div key={dev} className="p-2.5 bg-slate-50 rounded-xl text-center">
                        {dev === 'desktop' && <Laptop className="w-4 h-4 text-slate-600 mx-auto" />}
                        {dev === 'mobile' && <Smartphone className="w-4 h-4 text-emerald-600 mx-auto" />}
                        {dev === 'tablet' && <Tablet className="w-4 h-4 text-indigo-600 mx-auto" />}
                        <div className="text-xs font-bold text-slate-800 mt-1 capitalize">{dev === 'desktop' ? 'Masaüstü' : dev === 'mobile' ? 'Telefon' : 'Tablet'}</div>
                        <div className="text-[11px] text-slate-500 font-medium">{pct}% ({count})</div>
                      </div>
                    );
                  })}
                </div>

                {/* OS list */}
                <div className="space-y-2 pt-1">
                  {summary.breakdowns.os.map((os, i) => {
                    const pct = summary.totalSessions > 0 ? Math.round((os.count / summary.totalSessions) * 100) : 0;
                    return (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-600">{os.name}</span>
                          <span className="font-semibold text-slate-800">{os.count} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Pages & Sources */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-purple-600" />
                    En Çok Görüntülenen Sayfalar
                  </h3>
                  <span className="text-[11px] text-slate-400">Sayfa Yolu</span>
                </div>
                <div className="space-y-2.5">
                  {summary.breakdowns.topPages.slice(0, 6).map((p, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0">
                      <span className="font-mono text-slate-700 truncate max-w-[200px]" title={p.path}>
                        {p.path}
                      </span>
                      <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                        {p.count}
                      </span>
                    </div>
                  ))}
                  {summary.breakdowns.topPages.length === 0 && (
                    <p className="text-xs text-slate-400 py-3 text-center">Henüz sayfa kaydı bulunmuyor.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* FILTER BAR */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Filtreler</span>
              </div>

              {/* CSV Export Button */}
              <button
                type="button"
                onClick={handleExportCsv}
                disabled={isExporting || totalSessions === 0}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-900 disabled:opacity-50 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                {isExporting ? 'Dışa Aktarılıyor...' : 'Filtrelenmiş CSV İndir'}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 text-xs">
              {/* Date Range */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Tarih Aralığı</label>
                <select
                  value={range}
                  onChange={(e) => { setRange(e.target.value as any); setCurrentPage(1); }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-800 focus:outline-emerald-600"
                >
                  <option value="today">Bugün</option>
                  <option value="7d">Son 7 Gün</option>
                  <option value="30d">Son 30 Gün</option>
                  <option value="all">Tüm Zamanlar</option>
                </select>
              </div>

              {/* Device */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Cihaz Türü</label>
                <select
                  value={deviceFilter}
                  onChange={(e) => { setDeviceFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-800 focus:outline-emerald-600"
                >
                  <option value="all">Tümü</option>
                  <option value="desktop">Masaüstü (PC/Mac)</option>
                  <option value="mobile">Telefon</option>
                  <option value="tablet">Tablet</option>
                </select>
              </div>

              {/* Conversion */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Form Dönüşümü</label>
                <select
                  value={conversionFilter}
                  onChange={(e) => { setConversionFilter(e.target.value as any); setCurrentPage(1); }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-800 focus:outline-emerald-600"
                >
                  <option value="all">Tüm Ziyaretler</option>
                  <option value="yes">Yalnızca Form Gönderenler</option>
                  <option value="no">Form Göndermeyenler</option>
                </select>
              </div>

              {/* Bot status */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Bot / Tarayıcı</label>
                <select
                  value={botFilter}
                  onChange={(e) => { setBotFilter(e.target.value as any); setCurrentPage(1); }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-800 focus:outline-emerald-600"
                >
                  <option value="all">Tümü</option>
                  <option value="human">Gerçek İnsan Ziyaretleri</option>
                  <option value="bot">Bot ve Tarayıcılar</option>
                </select>
              </div>

              {/* Page Search */}
              <div className="col-span-2">
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Sayfa Arama</label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="ör. /products/kirmizi-mercimek..."
                    value={pageSearch}
                    onChange={(e) => { setPageSearch(e.target.value); setCurrentPage(1); }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-2.5 py-1.5 text-slate-800 focus:outline-emerald-600 placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SESSIONS TABLE */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-800">Gerçek Ziyaret Oturumları</h3>
                <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-md">
                  {totalSessions} kayıt
                </span>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Ayrıntılı zaman çizelgesi için bir satıra tıklayın
              </span>
            </div>

            {/* Table or Empty */}
            {isLoading ? (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-600" />
                <p className="text-xs">Ziyaretçi verileri sunucudan yükleniyor...</p>
              </div>
            ) : sessions.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <Users className="w-8 h-8 mx-auto text-slate-300" />
                <h4 className="text-sm font-semibold text-slate-700">Henüz Kayıtlı Ziyaretçi Yok</h4>
                <p className="text-xs max-w-sm mx-auto">
                  Sitede çerez izni veren ve gezinme gerçekleştiren gerçek ziyaretçiler burada anlık olarak listelenecektir.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200/60">
                    <tr>
                      <th className="px-4 py-3">Tarih & Saat</th>
                      <th className="px-4 py-3">Ülke & Şehir</th>
                      <th className="px-4 py-3">Cihaz & Model</th>
                      <th className="px-4 py-3">İşletim Sis. / Tarayıcı</th>
                      <th className="px-4 py-3">Giriş & Çıkış Sayfası</th>
                      <th className="px-4 py-3">Süre & Sayfa</th>
                      <th className="px-4 py-3">Dönüşüm</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {sessions.map((s) => (
                      <tr
                        key={s.id}
                        onClick={() => setSelectedSession(s)}
                        className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                      >
                        {/* Time */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-semibold text-slate-800">{formatDateTime(s.startedAt, s.timezone)}</div>
                          <div className="text-[10px] text-slate-400">{s.timezone || 'UTC'}</div>
                        </td>

                        {/* Country & City */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-slate-900">{s.country || 'Bilinmiyor'}</span>
                            {s.isVpnOrProxy && (
                              <span className="text-[10px] bg-amber-100 text-amber-800 px-1 rounded" title="Olası VPN veya Proxy">
                                VPN
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">{s.city && s.city !== 'Bilinmiyor' ? s.city : 'Bölge: ' + (s.region || 'Bilinmiyor')}</div>
                        </td>

                        {/* Device */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            {s.deviceType === 'mobile' && <Smartphone className="w-3.5 h-3.5 text-emerald-600" />}
                            {s.deviceType === 'tablet' && <Tablet className="w-3.5 h-3.5 text-indigo-600" />}
                            {s.deviceType === 'desktop' && <Laptop className="w-3.5 h-3.5 text-slate-600" />}
                            <span className="font-medium capitalize text-slate-800">
                              {s.deviceType === 'desktop' ? 'Masaüstü' : s.deviceType === 'mobile' ? 'Telefon' : 'Tablet'}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400">{s.deviceModel}</div>
                        </td>

                        {/* OS & Browser */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-medium text-slate-800">{s.os || 'Bilinmiyor'}</div>
                          <div className="text-[11px] text-slate-400">{s.browser || 'Bilinmiyor'}</div>
                        </td>

                        {/* Pages */}
                        <td className="px-4 py-3">
                          <div className="truncate max-w-[180px] font-mono text-[11px] text-slate-700" title={s.entryPage}>
                            {s.entryPage}
                          </div>
                          {s.exitPage && s.exitPage !== s.entryPage && (
                            <div className="text-[10px] text-slate-400 truncate max-w-[180px] flex items-center gap-1">
                              <ArrowRight className="w-2.5 h-2.5 shrink-0" />
                              <span className="font-mono">{s.exitPage}</span>
                            </div>
                          )}
                        </td>

                        {/* Duration & Page count */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-semibold text-slate-800">{formatDuration(s.durationSeconds)}</div>
                          <div className="text-[11px] text-slate-400">{s.pageviewsCount || 1} sayfa</div>
                        </td>

                        {/* Conversion & Bot */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          {s.hasConverted ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                              <CheckCircle2 className="w-3 h-3" />
                              {s.conversionKind === 'rfq' ? 'RFQ Talebi' : 'İletişim'}
                            </span>
                          ) : s.isBot ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
                              <Bot className="w-3 h-3 text-slate-500" />
                              {s.botName || 'Bot'}
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Sayfa <strong>{currentPage}</strong> / <strong>{totalPages}</strong> (Toplam {totalSessions} kayıt)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                    className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ===================== TAB 2: AUTHENTICATION LOGS ===================== */}
      {subTab === 'authLogs' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                Yönetici ve Kullanıcı Giriş Kayıtları
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Sunucu tarafında doğrulanan başarılı ve başarısız tüm oturum açma girişimleri. Şifre ve güvenlik belirteçleri kaydedilmez.
              </p>
            </div>
            <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2.5 py-1 rounded-lg">
              {authLogsTotal} deneme
            </span>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-indigo-600" />
              <p className="text-xs">Giriş kayıtları yükleniyor...</p>
            </div>
          ) : authLogs.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <Lock className="w-8 h-8 mx-auto text-slate-300" />
              <h4 className="text-sm font-semibold text-slate-700">Kayıt Bulunmuyor</h4>
              <p className="text-xs max-w-sm mx-auto">
                Yapılan oturum açma denemeleri gerçek zamanlı olarak burada listelenecektir.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200/60">
                  <tr>
                    <th className="px-4 py-3">Tarih & Saat</th>
                    <th className="px-4 py-3">Hesap (E-posta)</th>
                    <th className="px-4 py-3">Sonuç</th>
                    <th className="px-4 py-3">Detay / Neden</th>
                    <th className="px-4 py-3">Konum</th>
                    <th className="px-4 py-3">Cihaz & Tarayıcı</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {authLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">
                        {formatDateTime(log.timestamp)}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900 whitespace-nowrap">
                        {log.email}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {log.status === 'SUCCESS' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Başarılı
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <AlertCircle className="w-3 h-3 text-rose-600" />
                            Başarısız
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {log.reason || (log.status === 'SUCCESS' ? 'Oturum açıldı' : 'Hatalı e-posta veya şifre')}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-medium text-slate-800">{log.country || 'Bilinmiyor'}</span>
                        {log.city && log.city !== 'Bilinmiyor' && (
                          <span className="text-slate-400 text-[11px]"> ({log.city})</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                        {log.deviceType || 'Masaüstü'} • {log.os || 'Bilinmiyor'} • {log.browser || 'Bilinmiyor'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Auth Logs Pagination */}
          {authLogsTotalPages > 1 && (
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Sayfa <strong>{authLogsPage}</strong> / <strong>{authLogsTotalPages}</strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAuthLogsPage((p) => Math.max(1, p - 1))}
                  disabled={authLogsPage <= 1}
                  className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setAuthLogsPage((p) => Math.min(authLogsTotalPages, p + 1))}
                  disabled={authLogsPage >= authLogsTotalPages}
                  className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================== SESSION DETAIL DRAWER / MODAL ===================== */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-end p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-xl h-full sm:h-auto sm:max-h-[90vh] sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  Ziyaretçi Oturum Ayrıntıları
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  ID: <span className="font-mono">{selectedSession.sessionId}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSession(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto space-y-5 text-xs">
              {/* Core Meta Grid */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[11px] text-slate-400 block">Ziyaret Zamanı</span>
                  <span className="font-semibold text-slate-800">{formatDateTime(selectedSession.startedAt, selectedSession.timezone)}</span>
                  <span className="text-[10px] text-slate-400 block">{selectedSession.timezone}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Toplam Süre</span>
                  <span className="font-semibold text-slate-800">{formatDuration(selectedSession.durationSeconds)}</span>
                  <span className="text-[10px] text-slate-400 block">{selectedSession.pageviewsCount} sayfa görüntülendi</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Konum (IP Tabanlı)</span>
                  <span className="font-semibold text-slate-800">{selectedSession.country}, {selectedSession.city}</span>
                  {selectedSession.isVpnOrProxy && (
                    <span className="text-[10px] text-amber-700 block font-medium">⚠️ VPN / Proxy Tespit Edildi</span>
                  )}
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Cihaz & Model</span>
                  <span className="font-semibold text-slate-800 capitalize">{selectedSession.deviceType}</span>
                  <span className="text-[10px] text-slate-500 block">{selectedSession.deviceModel}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Sistem & Tarayıcı</span>
                  <span className="font-semibold text-slate-800">{selectedSession.os}</span>
                  <span className="text-[10px] text-slate-500 block">{selectedSession.browser}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Ekran & Dil</span>
                  <span className="font-semibold text-slate-800">{selectedSession.screenResolution}</span>
                  <span className="text-[10px] text-slate-500 block">{selectedSession.browserLanguage}</span>
                </div>
              </div>

              {/* Conversion Information */}
              {selectedSession.hasConverted && (
                <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-2xl text-purple-900">
                  <div className="font-bold flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-purple-600" />
                    Bu Oturumda Form Gönderildi
                  </div>
                  <div className="text-[11px] mt-1 space-y-0.5">
                    <div>Tür: <strong>{selectedSession.conversionKind === 'rfq' ? 'Fiyat Teklifi Talebi (RFQ)' : 'İletişim Formu'}</strong></div>
                    {selectedSession.conversionReferenceCode && (
                      <div>Referans Kodu: <span className="font-mono font-bold">{selectedSession.conversionReferenceCode}</span></div>
                    )}
                  </div>
                </div>
              )}

              {/* Traffic Source & UTM */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Trafik Kaynağı</h4>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] space-y-1 text-slate-600">
                  <div>Yönlendiren: <strong className="text-slate-800 font-mono">{selectedSession.referrer || 'Doğrudan Giriş'}</strong></div>
                  {selectedSession.utmSource && (
                    <div>UTM Source: <span className="font-mono text-slate-800">{selectedSession.utmSource}</span></div>
                  )}
                  {selectedSession.utmMedium && (
                    <div>UTM Medium: <span className="font-mono text-slate-800">{selectedSession.utmMedium}</span></div>
                  )}
                  {selectedSession.utmCampaign && (
                    <div>UTM Campaign: <span className="font-mono text-slate-800">{selectedSession.utmCampaign}</span></div>
                  )}
                </div>
              </div>

              {/* Chronological Page Journey */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  Ziyaret Zaman Çizelgesi ({selectedSession.pagesVisited?.length || 0} Adım)
                </h4>
                <div className="space-y-2 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {(selectedSession.pagesVisited || []).map((p, idx) => (
                    <div key={idx} className="relative flex items-start gap-3 pl-7">
                      <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-emerald-600 border-2 border-white ring-2 ring-emerald-100" />
                      <div className="flex-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <div className="flex justify-between items-baseline gap-2">
                          <span className="font-mono text-slate-800 font-semibold truncate" title={p.path}>
                            {p.path}
                          </span>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">
                            {formatDateTime(p.timestamp, selectedSession.timezone)}
                          </span>
                        </div>
                        {p.title && <div className="text-[11px] text-slate-500 mt-0.5 truncate">{p.title}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedSession(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-900 transition-colors cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
