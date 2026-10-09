'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Package, 
  Ship, 
  BookOpen, 
  Settings, 
  LogOut, 
  Globe, 
  Menu, 
  X, 
  ChevronRight, 
  Clock, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { 
  AdminUser, 
  AdminInquiry,
  getStoredRFQs, 
  getStoredContainers, 
  getStoredProductStocks, 
  logoutAdmin,
  ExportContainer,
  ProductStockControl
} from '@/lib/adminAuth';
import { OverviewTab } from './tabs/OverviewTab';
import { QuotesTab } from './tabs/QuotesTab';
import { ProductsTab } from './tabs/ProductsTab';
import { LogisticsTab } from './tabs/LogisticsTab';
import { InsightsTab } from './tabs/InsightsTab';
import { SettingsTab } from './tabs/SettingsTab';

interface NavItem {
  id: 'overview' | 'quotes' | 'products' | 'logistics' | 'insights' | 'settings';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

interface AdminDashboardProps {
  user: AdminUser;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'quotes' | 'products' | 'logistics' | 'insights' | 'settings'>('overview');
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'TRY'>('USD');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Data states
  const [rfqs, setRfqs] = useState<AdminInquiry[]>([]);
  const [containers, setContainers] = useState<ExportContainer[]>([]);
  const [stocks, setStocks] = useState<ProductStockControl[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshAllData = async () => {
    setIsLoading(true);
    try {
      const [fetchedRfqs, fetchedContainers, fetchedStocks] = await Promise.all([
        getStoredRFQs(),
        getStoredContainers(),
        getStoredProductStocks(),
      ]);
      setRfqs(fetchedRfqs);
      setContainers(fetchedContainers);
      setStocks(fetchedStocks);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    refreshAllData();
    const updateTime = () => {
      const now = new Date();
      const trTime = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      if (mounted) setCurrentTime(trTime);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleLogoutClick = () => {
    if (confirm('Yönetici oturumunu kapatmak istediğinize emin misiniz?')) {
      logoutAdmin();
      onLogout();
    }
  };

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Genel Bakış & KPI', icon: LayoutDashboard },
    { 
      id: 'quotes', 
      label: 'İhracat Talepleri (RFQ)', 
      icon: FileText, 
      badge: rfqs.filter((r) => r.status === 'new').length > 0 ? `${rfqs.filter((r) => r.status === 'new').length} Yeni` : undefined,
      badgeColor: 'bg-rose-500 text-white' 
    },
    { id: 'products', label: 'Ürün & Stok Yönetimi', icon: Package, badge: '6 Ürün' },
    { 
      id: 'logistics', 
      label: 'Lojistik & Konteyner Radarı', 
      icon: Ship, 
      badge: `${containers.filter((c) => c.status === 'in_transit').length} Rota`,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    { id: 'insights', label: 'Pazar Rehberleri & GEO', icon: BookOpen },
    { id: 'settings', label: 'Süper Admin & Ayarlar', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row font-sans">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black shadow-sm">
            NG
          </div>
          <div>
            <div className="text-sm font-black text-slate-900">NILASYA AGRO FOODS</div>
            <div className="text-[10px] text-emerald-700 font-bold uppercase">Süper Admin</div>
          </div>
        </div>

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-50 h-screen w-72 bg-white border-r border-slate-200 p-5 flex flex-col justify-between transition-transform duration-300 shadow-sm
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-md shadow-emerald-600/20">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h1 className="text-sm font-black text-slate-950 tracking-tight">NILASYA AGRO FOODS</h1>
                <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                  Süper Admin Masası
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`
                    w-full py-3 px-3.5 rounded-2xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer group
                    ${isActive 
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20' 
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/80'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700')}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Admin User & Logout */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          {/* View Website Button */}
          <Link
            href="/tr/"
            target="_blank"
            className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-emerald-700 text-xs font-medium flex items-center justify-between transition-colors shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>Canlı Web Sitesini Aç</span>
            </div>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>

          {/* Admin Profile Mini Card */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-xs font-bold text-emerald-800 shrink-0">
                {user.avatar || 'CK'}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-slate-900 truncate">{user.name}</div>
                <div className="text-[10px] text-emerald-700 font-mono truncate">{user.email}</div>
              </div>
            </div>

            <button
              onClick={handleLogoutClick}
              title="Çıkış Yap"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top Navbar */}
        <header className="hidden md:flex h-16 bg-white/80 border-b border-slate-200/90 px-8 items-center justify-between sticky top-0 z-30 backdrop-blur-md">
          {/* Breadcrumb / Section Name */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Nilasya Agro Foods Masası</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-emerald-700 font-bold capitalize">
              {navItems.find((n) => n.id === activeTab)?.label}
            </span>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4 text-xs">
            {/* Live Clock */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-mono font-medium">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>{currentTime || '08:00:00'} TR</span>
            </div>

            {/* Currency Selector */}
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-0.5">
              {(['USD', 'EUR', 'TRY'] as const).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                    currency === curr ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {curr === 'USD' ? '$ USD' : curr === 'EUR' ? '€ EUR' : '₺ TRY'}
                </button>
              ))}
            </div>

            {/* System Status Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Root Erişim Aktif</span>
            </div>
          </div>
        </header>

        {/* Tab Body */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'overview' && (
            <OverviewTab
              rfqs={rfqs}
              containers={containers}
              stocks={stocks}
              currency={currency}
              onNavigateToTab={(tabId) => setActiveTab(tabId as NavItem['id'])}
            />
          )}

          {activeTab === 'quotes' && (
            <QuotesTab
              rfqs={rfqs}
              currency={currency}
              onRefreshData={refreshAllData}
            />
          )}

          {activeTab === 'products' && (
            <ProductsTab
              stocks={stocks}
              onRefreshData={refreshAllData}
            />
          )}

          {activeTab === 'logistics' && (
            <LogisticsTab
              containers={containers}
              onRefreshData={refreshAllData}
            />
          )}

          {activeTab === 'insights' && (
            <InsightsTab />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              user={user}
              currency={currency}
              onCurrencyChange={setCurrency}
              onLogout={handleLogoutClick}
              onRefreshData={refreshAllData}
            />
          )}
        </div>
      </main>
    </div>
  );
};
