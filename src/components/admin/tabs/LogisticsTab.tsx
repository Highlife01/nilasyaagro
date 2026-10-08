'use client';

import React from 'react';
import { 
  Ship, 
  ThermometerSnowflake, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Anchor, 
  ArrowRight, 
  AlertTriangle,
  Activity,
  Layers,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { ExportContainer } from '@/lib/adminAuth';

interface LogisticsTabProps {
  containers: ExportContainer[];
  onRefreshData: () => void;
}

export const LogisticsTab: React.FC<LogisticsTabProps> = ({
  containers,
  onRefreshData,
}) => {
  const inTransitCount = containers.filter((c) => c.status === 'in_transit').length;
  const customsCount = containers.filter((c) => c.status === 'customs').length;
  const packhouseCount = containers.filter((c) => c.status === 'packhouse').length;

  const getStatusBadge = (status: ExportContainer['status']) => {
    switch (status) {
      case 'in_transit':
        return { label: 'Deniz Seyrinde (Transit)', color: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'customs':
        return { label: 'Liman / Gümrükleme', color: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'packhouse':
        return { label: 'Tesis Hazırlığı & Paletleme', color: 'bg-purple-50 text-purple-800 border-purple-200' };
      case 'delivered':
        return { label: 'Teslim Edildi', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-950 tracking-tight">
            Lojistik & Soğuk Zincir Radarı
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Mersin ve İzmir limanlarından çıkan reefer konteynerlerin anlık sıcaklık takibi, gemi rotaları ve tahmini varış (ETA) süreleri.
          </p>
        </div>

        <button
          onClick={onRefreshData}
          className="self-start sm:self-center px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
          <span>Telemetriyi Yenile</span>
        </button>
      </div>

      {/* 4-Step Pipeline Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Aşama 1</div>
          <div className="text-sm font-bold text-slate-900 mt-1">Paketleme & Pre-Cooling</div>
          <div className="text-xs text-purple-700 font-semibold mt-1">{packhouseCount} Konteyner Hazırlanıyor</div>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Aşama 2</div>
          <div className="text-sm font-bold text-slate-900 mt-1">Liman & Gümrük Muayene</div>
          <div className="text-xs text-blue-700 font-semibold mt-1">{customsCount} Konteyner Limanda</div>
        </div>
        <div className="bg-emerald-50/80 border border-emerald-300 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Aşama 3 (Aktif)</div>
          <div className="text-sm font-bold text-slate-950 mt-1">Reefer Deniz Transit</div>
          <div className="text-xs text-amber-800 font-bold mt-1">{inTransitCount} Konteyner Rota Seyrinde</div>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Aşama 4</div>
          <div className="text-sm font-bold text-slate-900 mt-1">Hedef Liman & Dağıtım</div>
          <div className="text-xs text-emerald-700 font-bold mt-1">Eylül Teslimat Başarısı: %100</div>
        </div>
      </div>

      {/* Active Containers Cards */}
      <div className="space-y-4">
        {containers.map((c) => {
          const status = getStatusBadge(c.status);

          return (
            <div
              key={c.id}
              className="bg-white border border-slate-200/80 rounded-3xl p-6 hover:border-emerald-300 hover:shadow-md transition-all shadow-xs"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                {/* Left info: Container No, Carrier, Produce */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                    <Ship className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-lg font-mono font-black text-slate-950">
                        {c.containerNo}
                      </span>
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Taşıyıcı: <span className="text-slate-800 font-semibold">{c.carrier}</span> • Booking: <span className="font-mono text-emerald-700 font-bold">{c.bookingRef}</span>
                    </div>
                    <div className="text-xs text-slate-900 font-bold mt-1">
                      Kargo: {c.produce} ({c.tonnage} MT / 40ft High Cube Reefer)
                    </div>
                  </div>
                </div>

                {/* Right: Telemetry indicators */}
                <div className="flex flex-wrap items-center gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 self-start lg:self-center">
                  <div className="flex items-center gap-2">
                    <ThermometerSnowflake className="w-4 h-4 text-cyan-600" />
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-semibold">Set / Anlık Isı</div>
                      <div className="text-xs font-mono font-bold text-slate-900">
                        {c.setTemperature} <span className="text-cyan-700">({c.currentTemperature})</span>
                      </div>
                    </div>
                  </div>

                  <div className="h-8 w-px bg-slate-200" />

                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Nem (RH)</div>
                    <div className="text-xs font-mono font-bold text-emerald-700">{c.humidity}</div>
                  </div>

                  <div className="h-8 w-px bg-slate-200" />

                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Soğuk Zincir Tam</span>
                  </div>
                </div>
              </div>

              {/* Transit Route Visualization */}
              <div className="pt-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-rose-600" />
                    <span className="text-slate-700 font-semibold">{c.originPort}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <div className="flex items-center gap-2">
                    <Anchor className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="text-slate-950 font-bold">{c.destinationPort} ({c.destinationCountry})</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-slate-500">
                  <div>
                    <span>Gemi: </span>
                    <span className="font-semibold text-slate-800">{c.vesselName}</span>
                  </div>
                  <div>
                    <span>Kalkış: </span>
                    <span className="font-mono text-slate-700 font-medium">{c.departureDate}</span>
                  </div>
                  <div>
                    <span>Tahmini Varış (ETA): </span>
                    <span className="font-mono font-bold text-amber-700">{c.eta}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
