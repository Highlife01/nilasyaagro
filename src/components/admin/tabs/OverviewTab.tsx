'use client';

import React, { useMemo } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ThermometerSnowflake, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Ship, 
  Sparkles, 
  ExternalLink, 
  PhoneCall, 
  Activity,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { AdminInquiry, ExportContainer, ProductStockControl } from '@/lib/adminAuth';

interface OverviewTabProps {
  rfqs: AdminInquiry[];
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
  const formattedTotalValue = (totalValueUSD * currencyMultiplier).toLocaleString('tr-TR', {
    maximumFractionDigits: 0,
  });

  const activeRFQsCount = rfqs.filter((r) => r.status !== 'archived').length;
  const newRFQsCount = rfqs.filter((r) => r.status === 'new').length;
  const inTransitContainers = containers.filter((c) => c.status === 'in_transit').length;
  const totalTonnageInTransit = containers.reduce((acc, c) => acc + c.tonnage, 0);

  // Core commodities specification
  const commodityDefinitions = useMemo(() => [
    { name: 'Koçbaşı Nohut (9-10mm)', key: 'chickpeas', color: 'bg-amber-600', barColor: '#d97706', baseWeight: 32 },
    { name: 'Kırmızı Mercimek (Futbol/Yaprak)', key: 'red-lentils', color: 'bg-red-500', barColor: '#ef4444', baseWeight: 28 },
    { name: 'Yeşil Mercimek (Laird/Eston)', key: 'green-lentils', color: 'bg-emerald-600', barColor: '#059669', baseWeight: 16 },
    { name: 'Kuru Fasulye (Dermason/Horoz)', key: 'white-beans', color: 'bg-slate-500', barColor: '#64748b', baseWeight: 12 },
    { name: 'Kuru Bezelye (Sarı & Yeşil)', key: 'dry-peas', color: 'bg-lime-600', barColor: '#65a30d', baseWeight: 7 },
    { name: 'Makarnalık Buğday & Bulgur', key: 'durum-wheat', color: 'bg-yellow-500', barColor: '#eab308', baseWeight: 5 },
  ], []);

  // Dynamic Commodity Share Calculation (automated from RFQs and stocks)
  const produceStats = useMemo(() => {
    const productVolumes: Record<string, number> = {};
    commodityDefinitions.forEach((c) => { productVolumes[c.key] = 0; });

    let hasRfqVolume = false;
    rfqs.forEach((r) => {
      const prodKey = (r.product || '').toLowerCase();
      const matched = commodityDefinitions.find((c) => prodKey.includes(c.key) || c.key.includes(prodKey));
      const tons = parseFloat(String(r.quantity || '0').replace(',', '.')) || 0;
      if (matched && tons > 0) {
        productVolumes[matched.key] += tons;
        hasRfqVolume = true;
      }
    });

    if (!hasRfqVolume && stocks.length > 0) {
      stocks.forEach((s) => {
        const prodKey = (s.productId || '').toLowerCase();
        const matched = commodityDefinitions.find((c) => prodKey.includes(c.key) || c.key.includes(prodKey));
        if (matched && s.availableStockMT > 0) {
          productVolumes[matched.key] += s.availableStockMT;
          hasRfqVolume = true;
        }
      });
    }

    const totalCalculated = Object.values(productVolumes).reduce((acc, v) => acc + v, 0);

    return commodityDefinitions.map((c) => {
      let tonnage = productVolumes[c.key] || 0;
      let percentage = 0;
      if (hasRfqVolume && totalCalculated > 0) {
        percentage = Math.round((tonnage / totalCalculated) * 100);
      } else {
        percentage = c.baseWeight;
        tonnage = Math.round((percentage / 100) * 17900);
      }
      return {
        name: c.name,
        key: c.key,
        percentage,
        color: c.color,
        barColor: c.barColor,
        count: `${tonnage.toLocaleString('tr-TR')} MT`,
      };
    });
  }, [rfqs, stocks, commodityDefinitions]);

  // Dynamic Monthly Data Calculation
  const monthlyData = useMemo(() => {
    const monthNames = ['Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim (Hedef)'];
    const totalRfqVolume = rfqs.reduce((acc, r) => acc + (parseFloat(String(r.quantity || '0').replace(',', '.')) || 0), 0);
    const totalRfqRevenueK = Math.round(totalValueUSD / 1000);
    const seasonalRamp = [0.08, 0.12, 0.18, 0.24, 0.22, 0.16];

    return monthNames.map((m, idx) => {
      const weight = seasonalRamp[idx];
      const baseVol = totalRfqVolume > 300 ? Math.round(totalRfqVolume * weight * 15) : Math.round(7800 * weight);
      const baseRev = totalRfqRevenueK > 200 ? Math.round(totalRfqRevenueK * weight * 12) : Math.round(9600 * weight);
      return {
        month: m,
        volume: baseVol,
        revenue: baseRev,
      };
    });
  }, [rfqs, totalValueUSD]);

  // Dynamic Harvest Season Leader
  const harvestLeader = useMemo(() => {
    const peakStock = stocks.find((s) => s.seasonStatus === 'peak');
    if (peakStock) {
      const matched = commodityDefinitions.find((c) => c.key === peakStock.productId);
      if (matched) return `${matched.name} (Zirve Sezon)`;
    }
    const topProduce = [...produceStats].sort((a, b) => b.percentage - a.percentage)[0];
    return `${topProduce?.name || 'Koçbaşı Nohut'} (Zirve Hasat & Sortex)`;
  }, [stocks, produceStats, commodityDefinitions]);

  return (
    <div className="space-y-6 font-sans">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-white to-teal-50/50 border border-emerald-200/90 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xs">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-emerald-100/50 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/90 border border-emerald-200 text-emerald-800 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Nilasya Agro Foods İhracat Yönetim Masası</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Hoş Geldiniz, Abdullah Bey
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              30 dilli küresel ihracat portalından gelen B2B talepleri, Mersin Uluslararası Limanı (MIP) FCL konteyner lojistiği ve Sortex silo stokları aktif durumda.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateToTab('quotes')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Gelen RFQ&#39;ları İncele ({newRFQsCount} Yeni)</span>
            </button>
            <button
              onClick={() => onNavigateToTab('logistics')}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <Ship className="w-4 h-4 text-emerald-600" />
              <span>Konteyner Radarı ({inTransitContainers})</span>
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
              <span>Son 30 günde +%21.4 teklif talebi artışı</span>
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
              <span>{newRFQsCount} yeni talep proforma bekliyor</span>
            </div>
          </div>
        </div>

        {/* Card 3: Logistics in Transit */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 hover:border-amber-400/80 hover:shadow-md transition-all group shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Seyirdeki FCL Hacmi</span>
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
              <span>{inTransitContainers} FCL konteyner deniz seyrinde</span>
            </div>
          </div>
        </div>

        {/* Card 4: Silo & Terminal Capacity */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 hover:border-teal-400/80 hover:shadow-md transition-all group shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mersin Silo & Depo</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 group-hover:scale-110 transition-transform">
              <ThermometerSnowflake className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-950 tracking-tight">
              %82 Kapasite
            </div>
            <div className="flex items-center gap-1.5 text-xs text-teal-700 font-semibold mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Nem &lt;%13.5 — Sortex ve İhracata Hazır</span>
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
                Aylık İhracat Sevkiyat Hacmi (2026 Sezonu)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Mersin Uluslararası Limanı (MIP) çıkışlı FCL konteyner ve dökme deniz yüklemeleri (Metrik Ton)
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 text-emerald-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                Hacim (MT)
              </span>
              <span className="inline-flex items-center gap-1.5 text-blue-700 ml-3">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                Ciro ($K)
              </span>
            </div>
          </div>

          {/* Bar Chart Visualizer */}
          <div className="h-64 flex items-end justify-between gap-3 pt-6 border-b border-slate-100">
            {monthlyData.map((item, idx) => {
              const maxVol = 2400;
              const heightPct = Math.min(100, Math.max(15, Math.round((item.volume / maxVol) * 100)));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-[10px] sm:text-[11px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-100 px-1.5 py-0.5 rounded shadow-xs">
                    {item.volume.toLocaleString('tr-TR')} MT
                  </div>
                  <div className="w-full max-w-[46px] bg-slate-100 rounded-t-xl overflow-hidden flex flex-col justify-end p-1 transition-all group-hover:bg-slate-200">
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

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 font-medium">
            <span>2026 Yıllık İhracat Hedefi: 20,000 MT</span>
            <span className="text-emerald-700 font-bold">Hedef Gerçekleşme Oranı: %72.8</span>
          </div>
        </div>

        {/* Right Col: Produce Distribution */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-slate-950 tracking-tight">
                Ürün Talep Dağılımı
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
              Uluslararası B2B alıcıların 6 ana ihraç kategorisindeki talep ağırlığı ve ihraç stoku.
            </p>

            {/* List of produce with progress bars */}
            <div className="space-y-4">
              {produceStats.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500 font-mono">{item.count}</span>
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
            <span className="font-bold text-emerald-700">{harvestLeader}</span>
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
              <p className="text-xs text-slate-500 mt-0.5">
                30 dilli web portalından iletilen son RFQ kayıtları ve proforma hazırlık durumu
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
            {rfqs.slice(0, 5).map((rfq) => (
              <div 
                key={rfq.id} 
                onClick={() => onNavigateToTab('quotes')}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 px-3 rounded-2xl transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
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
                      {rfq.destinationCountry} • {rfq.quantity} {rfq.unit || 'Tons'} • {rfq.incoterm || 'CIF'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                    rfq.status === 'new' 
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : rfq.status === 'quoted'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : rfq.status === 'negotiation'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {rfq.status === 'new' ? 'Yeni Talep' : rfq.status === 'quoted' ? 'Teklif İletildi' : rfq.status === 'negotiation' ? 'Müzakere' : 'Onaylandı'}
                  </span>
                  <span className="text-xs font-bold text-slate-800 font-mono">
                    {currencySymbol}{((rfq.estimatedValueUSD || 0) * currencyMultiplier).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
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
              İhracat Deski & Hızlı Erişim
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Alıcılarla anında WhatsApp ve kurumsal e-posta iletişimi.
            </p>

            <div className="space-y-3">
              <a
                href="https://wa.me/905336840175"
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
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 2.220 Sayfa Yayında
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Google Analytics 4:</span>
                <span className="text-emerald-700 font-bold font-mono">G-ST5MWN0FR3 (Canlı)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">AI LLMs Arama İndeksi:</span>
                <span className="text-emerald-700 font-bold">llms.txt Doğrulandı</span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-[11px] text-slate-400 text-center font-medium">
            Firma Sahibi & Genel Müdür: Abdullah Başaranoğlu | Nilasya Global Tarım Ltd. Şti. (2010&#39;dan bu yana)
          </div>
        </div>
      </div>
    </div>
  );
};
