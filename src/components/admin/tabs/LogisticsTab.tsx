'use client';

import React, { useState } from 'react';
import { 
  Ship, 
  Thermometer, 
  MapPin, 
  CheckCircle2, 
  Anchor, 
  ArrowRight, 
  RefreshCw, 
  Plus, 
  Search, 
  X, 
  Trash2, 
  Clock, 
  Activity, 
  Compass 
} from 'lucide-react';
import { ExportContainer, saveContainer, updateContainerStatus, deleteContainer } from '@/lib/adminAuth';

interface LogisticsTabProps {
  containers: ExportContainer[];
  onRefreshData: () => void;
}

export const LogisticsTab: React.FC<LogisticsTabProps> = ({
  containers,
  onRefreshData,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New container form
  const [newContainerForm, setNewContainerForm] = useState({
    containerNo: 'MSCU-',
    bookingRef: 'BKG-TR-2026-',
    carrier: 'MSC (Mediterranean Shipping Co.)',
    produce: 'Koçbaşı Nohut (9-10mm Sortex)',
    tonnage: 24.0,
    originPort: 'Mersin International Port (MIP)',
    destinationPort: 'Hamburg Port',
    destinationCountry: 'Almanya',
    incoterm: 'CIF Hamburg',
    setTemperature: 'Dry Ventilated (Kuru Havalandırmalı)',
    currentTemperature: 'Ambient (+22 °C)',
    humidity: '60% (Nem Güvenli)',
    status: 'in_transit' as ExportContainer['status'],
    departureDate: new Date().toISOString().split('T')[0],
    eta: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    vesselName: 'MSC Gülsün / V.2610',
  });

  const inTransitCount = containers.filter((c) => c.status === 'in_transit').length;
  const customsCount = containers.filter((c) => c.status === 'customs').length;
  const packhouseCount = containers.filter((c) => c.status === 'packhouse').length;
  const deliveredCount = containers.filter((c) => c.status === 'delivered').length;

  const getStatusBadge = (status: ExportContainer['status']) => {
    switch (status) {
      case 'in_transit':
        return { label: 'Deniz Seyrinde (Transit)', color: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'customs':
        return { label: 'Mersin Liman / Gümrük', color: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'packhouse':
        return { label: 'Sortex & Konteyner Dolumu', color: 'bg-purple-50 text-purple-800 border-purple-200' };
      case 'delivered':
        return { label: 'Hedef Limanda Teslim', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    }
  };

  const filteredContainers = containers.filter((c) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      c.containerNo.toLowerCase().includes(term) ||
      c.vesselName.toLowerCase().includes(term) ||
      c.carrier.toLowerCase().includes(term) ||
      c.destinationCountry.toLowerCase().includes(term) ||
      c.destinationPort.toLowerCase().includes(term) ||
      c.produce.toLowerCase().includes(term);

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateContainer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveContainer(newContainerForm);
      setIsAddModalOpen(false);
      onRefreshData();
    } catch (err) {
      alert('Konteyner eklenirken hata: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleStatusChange = async (id: string, newStatus: ExportContainer['status']) => {
    try {
      await updateContainerStatus(id, newStatus);
      onRefreshData();
    } catch (err) {
      alert('Durum güncellenirken hata: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleDeleteContainer = async (id: string) => {
    if (confirm('Bu konteyner kaydını silmek istediğinize emin misiniz?')) {
      try {
        await deleteContainer(id);
        onRefreshData();
      } catch (err) {
        alert('Silinirken hata: ' + (err instanceof Error ? err.message : String(err)));
      }
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-950 tracking-tight">
            Lojistik & FCL Konteyner Radarı
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Mersin Uluslararası Limanı (MIP) çıkışlı deniz konteynerlerinin rota takibi, gemi isimleri, tahmini varış (ETA) ve telemetrisi.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Sevkiyat Ekle</span>
          </button>
        </div>
      </div>

      {/* 4-Step Pipeline Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div 
          onClick={() => setStatusFilter(statusFilter === 'packhouse' ? 'all' : 'packhouse')}
          className={`bg-white border rounded-2xl p-4 shadow-xs cursor-pointer transition-all ${
            statusFilter === 'packhouse' ? 'border-purple-500 ring-2 ring-purple-500/20' : 'border-slate-200/80 hover:border-purple-300'
          }`}
        >
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Aşama 1</div>
          <div className="text-sm font-bold text-slate-900 mt-1">Sortex, Paketleme & Dolum</div>
          <div className="text-xs text-purple-700 font-semibold mt-1">{packhouseCount} FCL Hazırlanıyor</div>
        </div>

        <div 
          onClick={() => setStatusFilter(statusFilter === 'customs' ? 'all' : 'customs')}
          className={`bg-white border rounded-2xl p-4 shadow-xs cursor-pointer transition-all ${
            statusFilter === 'customs' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200/80 hover:border-blue-300'
          }`}
        >
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Aşama 2</div>
          <div className="text-sm font-bold text-slate-900 mt-1">Mersin MIP Limanı & Gümrük</div>
          <div className="text-xs text-blue-700 font-semibold mt-1">{customsCount} FCL Liman Muayenede</div>
        </div>

        <div 
          onClick={() => setStatusFilter(statusFilter === 'in_transit' ? 'all' : 'in_transit')}
          className={`bg-white border rounded-2xl p-4 shadow-xs cursor-pointer transition-all ${
            statusFilter === 'in_transit' ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/40' : 'border-slate-200/80 hover:border-emerald-300'
          }`}
        >
          <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Aşama 3 (Aktif Seyir)</div>
          <div className="text-sm font-bold text-slate-950 mt-1">FCL Konteyner Deniz Seyri</div>
          <div className="text-xs text-amber-800 font-bold mt-1">{inTransitCount} FCL Rota Seyrinde</div>
        </div>

        <div 
          onClick={() => setStatusFilter(statusFilter === 'delivered' ? 'all' : 'delivered')}
          className={`bg-white border rounded-2xl p-4 shadow-xs cursor-pointer transition-all ${
            statusFilter === 'delivered' ? 'border-emerald-600 ring-2 ring-emerald-600/20' : 'border-slate-200/80 hover:border-emerald-300'
          }`}
        >
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Aşama 4</div>
          <div className="text-sm font-bold text-slate-900 mt-1">Hedef Liman & Teslim</div>
          <div className="text-xs text-emerald-700 font-bold mt-1">{deliveredCount} FCL Teslim Edildi</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Konteyner no, gemi adı, hat veya ülke ara..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold cursor-pointer"
          >
            <option value="all">Tüm Aşamalar ({containers.length})</option>
            <option value="in_transit">Deniz Seyrinde ({inTransitCount})</option>
            <option value="customs">Liman / Gümrük ({customsCount})</option>
            <option value="packhouse">Sortex / Dolum ({packhouseCount})</option>
            <option value="delivered">Teslim Edildi ({deliveredCount})</option>
          </select>

          <span className="text-xs text-slate-500 font-medium">
            {filteredContainers.length} Konteyner
          </span>
        </div>
      </div>

      {/* Active Containers Cards */}
      <div className="space-y-4">
        {filteredContainers.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center text-slate-400">
            <Ship className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-slate-600">Aradığınız kriterlere uygun konteyner kaydı bulunamadı.</p>
          </div>
        ) : (
          filteredContainers.map((c) => {
            const status = getStatusBadge(c.status);

            return (
              <div
                key={c.id}
                className="bg-white border border-slate-200/80 rounded-3xl p-6 hover:border-emerald-300 hover:shadow-md transition-all shadow-xs"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-5 border-b border-slate-100">
                  {/* Left info: Container No, Carrier, Produce */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                      <Ship className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-base sm:text-lg font-mono font-black text-slate-950">
                          {c.containerNo}
                        </span>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${status.color}`}>
                          {status.label}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          Ref: {c.bookingRef}
                        </span>
                      </div>

                      <div className="text-xs text-slate-700 font-semibold mt-1 flex flex-wrap items-center gap-2">
                        <span>{c.produce}</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-mono font-bold">{c.tonnage} MT Net</span>
                        <span>•</span>
                        <span className="text-slate-500">{c.carrier}</span>
                      </div>
                    </div>
                  </div>

                  {/* Route & ETA display */}
                  <div className="flex items-center gap-6 text-xs shrink-0">
                    <div className="text-left">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Çıkış Limanı</div>
                      <div className="font-bold text-slate-900 mt-0.5">{c.originPort}</div>
                      <div className="text-[11px] text-slate-500 font-mono">Çıkış: {c.departureDate}</div>
                    </div>

                    <div className="flex flex-col items-center px-2">
                      <Compass className="w-4 h-4 text-emerald-600 animate-spin" style={{ animationDuration: '8s' }} />
                      <div className="w-12 h-0.5 bg-emerald-200 my-1 relative">
                        <div className="absolute right-0 -top-1 w-2 h-2 rounded-full bg-emerald-600" />
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 uppercase font-mono">{c.incoterm}</span>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Varış Limanı</div>
                      <div className="font-bold text-slate-900 mt-0.5">{c.destinationPort}</div>
                      <div className="text-[11px] text-emerald-700 font-bold font-mono">ETA: {c.eta}</div>
                    </div>
                  </div>
                </div>

                {/* Telemetry and Action Bar */}
                <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div className="flex flex-wrap items-center gap-4 text-slate-600">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Anchor className="w-3.5 h-3.5 text-slate-400" />
                      <span>Gemi: <strong>{c.vesselName}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <Thermometer className="w-3.5 h-3.5 text-slate-400" />
                      <span>Sıcaklık: {c.currentTemperature}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Nem Sensörü: <strong className="text-emerald-700">{c.humidity}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <select
                      value={c.status}
                      onChange={(e) => handleStatusChange(c.id, e.target.value as ExportContainer['status'])}
                      className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-semibold text-slate-700 cursor-pointer"
                    >
                      <option value="packhouse">Aşama 1: Dolum</option>
                      <option value="customs">Aşama 2: Gümrük</option>
                      <option value="in_transit">Aşama 3: Transit</option>
                      <option value="delivered">Aşama 4: Teslim</option>
                    </select>

                    <button
                      onClick={() => handleDeleteContainer(c.id)}
                      title="Kayıt Sil"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Container Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold">
                  <Ship className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-950">
                    Yeni Konteyner Sevkiyatı Kaydet
                  </h2>
                  <p className="text-xs text-slate-500">
                    Mersin Port çıkışlı yeni FCL rezervasyon ve B/L bilgilerini girin.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateContainer} className="py-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Konteyner Numarası *</label>
                  <input
                    required
                    type="text"
                    value={newContainerForm.containerNo}
                    onChange={(e) => setNewContainerForm({ ...newContainerForm, containerNo: e.target.value })}
                    placeholder="MSCU-123456-7"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Booking / Konşimento (B/L) *</label>
                  <input
                    required
                    type="text"
                    value={newContainerForm.bookingRef}
                    onChange={(e) => setNewContainerForm({ ...newContainerForm, bookingRef: e.target.value })}
                    placeholder="BKG-TR-2026-9901"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gemi Hattı (Carrier)</label>
                  <select
                    value={newContainerForm.carrier}
                    onChange={(e) => setNewContainerForm({ ...newContainerForm, carrier: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="MSC (Mediterranean Shipping Co.)">MSC</option>
                    <option value="Maersk Line">Maersk Line</option>
                    <option value="Hapag-Lloyd">Hapag-Lloyd</option>
                    <option value="CMA CGM">CMA CGM</option>
                    <option value="Arkas Line">Arkas Line</option>
                    <option value="Turkon Line">Turkon Line</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Yüklenen Ürün & Kalibre</label>
                  <input
                    type="text"
                    value={newContainerForm.produce}
                    onChange={(e) => setNewContainerForm({ ...newContainerForm, produce: e.target.value })}
                    placeholder="Koçbaşı Nohut (9-10mm)"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Net Tonaj (MT)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newContainerForm.tonnage}
                    onChange={(e) => setNewContainerForm({ ...newContainerForm, tonnage: Number(e.target.value) || 24 })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gemi Adı & Sefer No</label>
                  <input
                    type="text"
                    value={newContainerForm.vesselName}
                    onChange={(e) => setNewContainerForm({ ...newContainerForm, vesselName: e.target.value })}
                    placeholder="MSC Gülsün / V.2610"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hedef Ülke</label>
                  <input
                    type="text"
                    value={newContainerForm.destinationCountry}
                    onChange={(e) => setNewContainerForm({ ...newContainerForm, destinationCountry: e.target.value })}
                    placeholder="Almanya, BAE, Hollanda..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hedef Liman</label>
                  <input
                    type="text"
                    value={newContainerForm.destinationPort}
                    onChange={(e) => setNewContainerForm({ ...newContainerForm, destinationPort: e.target.value })}
                    placeholder="Hamburg Port / Rotterdam"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Çıkış Tarihi</label>
                  <input
                    type="date"
                    value={newContainerForm.departureDate}
                    onChange={(e) => setNewContainerForm({ ...newContainerForm, departureDate: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tahmini Varış (ETA)</label>
                  <input
                    type="date"
                    value={newContainerForm.eta}
                    onChange={(e) => setNewContainerForm({ ...newContainerForm, eta: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer shadow-xs"
                >
                  Konteyneri Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
