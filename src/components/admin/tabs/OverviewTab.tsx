'use client';

import React from 'react';
import { 
  TrendingUp, 
  Package, 
  DollarSign, 
  Globe2, 
  ThermometerSnowflake, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Ship,
  Sparkles,
  ExternalLink,
  PhoneCall,
  Activity
} from 'lucide-react';
import { RFQSubmission } from '@/types';
import { ExportContainer, ProductStockControl } from '@/lib/adminAuth';

interface OverviewTabProps {
  rfqs: (RFQSubmission & { status: string; estimatedValueUSD: number; adminNotes?: string })[];
  containers: ExportContainer[];
  stocks: ProductStockControl[];
  currency: 'USD' | 'EUR' | 'TRY';
  onNavigateToTab: (tabId: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  rfqs,
  containers,
  stocks,
  currency,
  onNavigateToTab,
}) => {
  // Financial calculation
  const totalValueUSD = rfqs.reduce((acc, r) => acc + (r.estimatedValueUSD || 0), 0);
  const currencyMultiplier = currency === 'EUR' ? 0.92 : currency === 'TRY' ? 38.5 : 1;
  const currencySymbol = currency === 'EUR' ? '€' : currency === 'TRY' ? '₺' : '$';
  const formattedTotalValue = (totalValueUSD * currencyMultiplier).toLocaleString('en-US', {
    maximumFractionDigits: 0,
  });

  const activeRFQsCount = rfqs.filter((r) => r.status !== 'archived').length;
  const inTransitContainers = containers.filter((c) => c.status === 'in_transit').length;
  const totalTonnageInTransit = containers.reduce((acc, c) => acc + c.tonnage, 0);

  // Commodity share calculation
  const produceStats = [
    { name: 'Koçbaşı Nohut (9-10mm)', key: 'chickpeas', percentage: 32, color: 'bg-amber-600', barColor: '#d97706', count: '4,850 MT' },
    { name: 'Kırmızı Mercimek (Futbol/Yaprak)', key: 'red-lentils', percentage: 28, color: 'bg-red-500', barColor: '#ef4444', count: '4,200 MT' },
    { name: 'Yeşil Mercimek (Laird/Eston)', key: 'green-lentils', percentage: 16, color: 'bg-emerald-600', barColor: '#059669', count: '2,400 MT' },
    { name: 'Kuru Fasulye (Dermason/Horoz)', key: 'white-beans', percentage: 12, color: 'bg-slate-400', barColor: '#94a3b8', count: '1,800 MT' },
    { name: 'Kuru Bezelye (Sarı & Yeşil)', key: 'dry-peas', percentage: 7, color: 'bg-lime-600', barColor: '#65a30d', count: '1,050 MT' },
    { name: 'Makarnalık Buğday & Bulgur', key: 'durum-wheat', percentage: 5, color: 'bg-yellow-500', barColor: '#eab308', count: '750 MT' },
  ];

  // Monthly Volume simulation data (MT)
  const monthlyData = [
    { month: 'Nis', volume: 380, revenue: 450 },
    { month: 'May', volume: 520, revenue: 620 },
    { month: 'Haz', volume: 740, revenue: 890 },
    { month: 'Tem', volume: 920, revenue: 1100 },
    { month: 'Ağu', volume: 1450, revenue: 1720 },
    { month: 'Eyl', volume: 1890, revenue: 2250 },
    { month: 'Eki (Hedef)', volume: 2400, revenue: 2900 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-white to-teal-50/50 border border-emerald-200/80 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xs">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-emerald-100/40 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Nilasya Agro Foods Executive Control Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Hoş Geldiniz, Cebrail Bey
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Uluslararası yaş meyve & sebze ihracat operasyonları, 25 dilli portal üzerinden gelen kurumsal B2B talepleri ve soğuk hava lojistik radarı aktif durumda.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateToTab('quotes')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Gelen Talepleri İncele ({activeRFQsCount})</span>
            </button>
            <button
              onClick={() => onNavigateToTab('logistics')}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <Ship className="w-4 h-4 text-emerald-600" />
              <span>Konteyner Radarı</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: RFQ Value */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 hover:border-emerald-400/80 hover:shadow-md transition-all group shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bekleyen Sipariş Hacmi</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-950 tracking-tight">
              {currencySymbol}{formattedTotalValue}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Son 30 günde +%18.4 artış</span>
            </div>
          </div>
        </div>

        {/* Card 2: Active RFQs */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 hover:border-blue-400/80 hover:shadow-md transition-all group shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aktif İhracat Talepleri</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-950 tracking-tight">
              {activeRFQsCount} Kurumsal RFQ
            </div>
            <div className="flex items-center gap-1.5 text-xs text-blue-700 font-semibold mt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{rfqs.filter((r) => r.status === 'new').length} yeni incelenmeyi bekliyor</span>
            </div>
          </div>
        </div>

        {/* Card 3: Logistics in Transit */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 hover:border-amber-400/80 hover:shadow-md transition-all group shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Seyirdeki Reefer Hacmi</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 group-hover:scale-110 transition-transform">
              <Ship className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-950 tracking-tight">
              {totalTonnageInTransit.toFixed(1)} MT
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-700 font-semibold mt-1">
              <Activity className="w-3.5 h-3.5" />
              <span>{inTransitContainers} konteyner rotada (Sıcaklık OK)</span>
            </div>
          </div>
        </div>

        {/* Card 4: Cold Chain Health */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 hover:border-teal-400/80 hover:shadow-md transition-all group shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">ULO Soğuk Hava Deposu</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 group-hover:scale-110 transition-transform">
              <ThermometerSnowflake className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-950 tracking-tight">
              %78 Doluluk
            </div>
            <div className="flex items-center gap-1.5 text-xs text-teal-700 font-semibold mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>-0.5°C / %94 Nem — ULO Dengeli</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Charts & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Monthly Export Trend Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-950 tracking-tight">
                Aylık İhracat Hacmi & Sevk Trendi (2026)
              </h2>
              <p className="text-xs text-slate-500">
                Mersin ve İzmir limanları çıkışlı doğrudan reefer gemi ve karayolu sevkiyatları (Metrik Ton)
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 text-emerald-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                Hacim (MT)
              </span>
              <span className="inline-flex items-center gap-1.5 text-blue-700 ml-3">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                Ciro Endeksi ($K)
              </span>
            </div>
          </div>

          {/* Bar Chart Visualizer */}
          <div className="h-64 flex items-end justify-between gap-3 pt-6 border-b border-slate-100">
            {monthlyData.map((item, idx) => {
              const maxVol = 2500;
              const heightPct = Math.round((item.volume / maxVol) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-[11px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {item.volume} MT
                  </div>
                  <div className="w-full max-w-[42px] bg-slate-100 rounded-t-xl overflow-hidden flex flex-col justify-end p-1 transition-all group-hover:bg-slate-200">
                    <div 
                      className="w-full bg-gradient-to-t from-emerald-600 to-teal-500 rounded-t-lg transition-all duration-500 group-hover:brightness-105"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 group-hover:text-emerald-700 transition-colors">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>2026 Sezonu Toplam Hedefi: 18,500 MT</span>
            <span className="text-emerald-700 font-bold">Hedef Gerçekleşme: %68.2</span>
          </div>
        </div>

        {/* Right Col: Produce Distribution */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-950 tracking-tight">
                Ürün Talep Payı
              </h2>
              <button 
                onClick={() => onNavigateToTab('products')}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Stoklar</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-5">
              Uluslararası alıcıların 6 ana ihracat kategorisindeki talep ağırlığı ve tahmini mevcut ihraç stoku.
            </p>

            {/* List of produce with progress bars */}
            <div className="space-y-4">
              {produceStats.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500">{item.count}</span>
                      <span className="font-bold text-slate-900">%{item.percentage}</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color} rounded-full transition-all duration-700`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Hasat Dönemi Lideri:</span>
            <span className="font-bold text-rose-600">Hicaz Nar (Zirve Hasat)</span>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Inquiries & Quick Action Desk */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Inquiries List */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-950 tracking-tight">
                Son Gelen İhracat Talepleri (Canlı Akış)
              </h2>
              <p className="text-xs text-slate-500">
                Web sitesi teklif sihirbazı ve doğrudan temas formundan iletilen son RFQ kayıtları
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('quotes')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-emerald-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Tümünü Gör</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {rfqs.slice(0, 4).map((rfq) => (
              <div key={rfq.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 px-3 rounded-xl transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{rfq.companyName}</span>
                      <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-semibold">
                        {rfq.referenceCode}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {rfq.destinationCountry} • {rfq.quantity} {rfq.unit} • {rfq.incoterm}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    rfq.status === 'new' 
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : rfq.status === 'quoted'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {rfq.status === 'new' ? 'Yeni Talep' : rfq.status === 'quoted' ? 'Teklif İletildi' : 'Onaylandı'}
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {currencySymbol}{((rfq.estimatedValueUSD || 0) * currencyMultiplier).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Contacts & System Status */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between shadow-xs">
          <div>
            <h2 className="text-lg font-bold text-slate-950 tracking-tight mb-2">
              İhracat Masası & Hızlı Erişim
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Alıcılarla hızlı WhatsApp iletişimi ve sistem operasyonel durumu.
            </p>

            <div className="space-y-3">
              <a
                href="https://wa.me/905324108855"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <PhoneCall className="w-4 h-4 text-emerald-600" />
                  <span>Resmi İhracat WhatsApp Hattı</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href="mailto:export@nilasyaagrofoods.com.tr"
                className="w-full py-3 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-between transition-all"
              >
                <span>export@nilasyaagrofoods.com.tr</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Operasyonel Altyapı
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">30 Dilli Portal:</span>
                <span className="text-emerald-700 font-bold">Aktif & Yayında</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">PWA & Çevrimdışı Servis:</span>
                <span className="text-emerald-700 font-bold">Senkronize</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">LLMs AI Bilgi Tabanı:</span>
                <span className="text-emerald-700 font-bold">llms.txt Doğrulandı</span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-[11px] text-slate-400 text-center font-medium">
            Süper Admin: cebrailkara@gmail.com
          </div>
        </div>
      </div>
    </div>
  );
};
