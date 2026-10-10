'use client';

import React, { useState } from 'react';
import { 
  Check, 
  Edit3, 
  Save, 
  X, 
  Package, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  ArrowUpRight 
} from 'lucide-react';
import { productsData } from '@/data/products';
import { ProductStockControl, updateProductStock } from '@/lib/adminAuth';

interface ProductsTabProps {
  stocks: ProductStockControl[];
  onRefreshData: () => void;
}

export const ProductsTab: React.FC<ProductsTabProps> = ({
  stocks,
  onRefreshData,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ProductStockControl>>({});
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [filterTerm, setFilterTerm] = useState('');

  const getStockData = (productId: string): ProductStockControl => {
    return stocks.find((s) => s.productId === productId) || {
      productId,
      seasonStatus: 'peak',
      moqTons: 20,
      availableStockMT: 1500,
      exportQualityScore: 98,
      storageCondition: 'İklimlendirmeli Çelik Silo, Nem <%13.5, Sortex %99.8 Saflık',
      activeCalibers: ['Standart İhracat Boyutu', 'Sortex Seçme'],
    };
  };

  const handleStartEdit = (productId: string) => {
    const current = getStockData(productId);
    setEditingId(productId);
    setEditForm({ ...current });
    setSaveSuccessMsg('');
  };

  const handleSave = async (productId: string) => {
    try {
      const current = getStockData(productId);
      const updated: ProductStockControl = {
        ...current,
        ...editForm,
        productId,
      };
      await updateProductStock(productId, updated);
      setEditingId(null);
      setSaveSuccessMsg(`${productId} ürününün hasat ve stok bilgileri başarıyla güncellendi.`);
      setTimeout(() => setSaveSuccessMsg(''), 3500);
      onRefreshData();
    } catch (err) {
      alert('Stok güncellenirken hata oluştu: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const filteredProducts = productsData.filter((prod) => {
    const term = filterTerm.toLowerCase();
    const trTitle = (prod.name?.tr || '').toLowerCase();
    const enTitle = (prod.name?.en || '').toLowerCase();
    return trTitle.includes(term) || enTitle.includes(term) || prod.id.includes(term);
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-950 tracking-tight">
            Ürün Portföyü & Silo Stok Yönetimi
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Nilasya Agro Foods&apos;un 6 ana ihraç ürünü için canlı hasat takvimi, minimum sipariş miktarı (MOQ) ve lisanslı çelik silo stok kontrolü.
          </p>
        </div>

        {saveSuccessMsg && (
          <div className="p-2.5 px-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in shadow-2xs">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* Quick Search & Summary Stats */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filterTerm}
            onChange={(e) => setFilterTerm(e.target.value)}
            placeholder="Ürün adı veya kalibre ara..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            Zirve Sezon: {stocks.filter((s) => s.seasonStatus === 'peak').length} Ürün
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
            Lisanslı Silo: {stocks.filter((s) => s.seasonStatus === 'storage').length} Ürün
          </span>
        </div>
      </div>

      {/* Grid of 6 Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((prod) => {
          const stock = getStockData(prod.id);
          const isEditing = editingId === prod.id;

          const statusBadge = {
            peak: { label: 'Zirve Hasat (Peak)', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
            storage: { label: 'Lisanslı Çelik Silo', color: 'bg-teal-50 text-teal-700 border-teal-200' },
            preorder: { label: 'Yeni Sezon Ön Sipariş', color: 'bg-amber-50 text-amber-700 border-amber-200' },
            closed: { label: 'Sezon Sonu', color: 'bg-slate-100 text-slate-600 border-slate-200' },
          }[stock.seasonStatus] || { label: 'Aktif İhraç', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };

          return (
            <div 
              key={prod.id}
              className={`bg-white border rounded-3xl p-6 flex flex-col justify-between transition-all shadow-xs ${
                isEditing ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md' : 'border-slate-200/80 hover:border-emerald-300'
              }`}
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {prod.id}
                    </span>
                    <h2 className="text-lg font-bold text-slate-950 mt-1.5">
                      {prod.name.tr}
                    </h2>
                    <p className="text-xs text-slate-400 italic">
                      {prod.name.en}
                    </p>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border shrink-0 ${statusBadge.color}`}>
                    {statusBadge.label}
                  </span>
                </div>

                {/* Normal View */}
                {!isEditing ? (
                  <div className="space-y-3.5 text-xs py-2">
                    <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 font-mono">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-sans font-bold">Mevcut Stok</div>
                        <div className="text-base font-black text-slate-900 mt-0.5">
                          {stock.availableStockMT.toLocaleString('tr-TR')} MT
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-sans font-bold">MOQ (Min. Sipariş)</div>
                        <div className="text-base font-black text-emerald-700 mt-0.5">
                          {stock.moqTons} Tons
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Sortex Saflık / Kalite Skoru:</span>
                        <span className="font-bold text-emerald-700 font-mono">%{stock.exportQualityScore}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-600 rounded-full" 
                          style={{ width: `${stock.exportQualityScore}%` }} 
                        />
                      </div>
                    </div>

                    <div className="text-slate-600 text-[11px] leading-relaxed">
                      <span className="font-bold text-slate-700">Depo Koşulları: </span>
                      <span>{stock.storageCondition}</span>
                    </div>

                    {stock.activeCalibers && stock.activeCalibers.length > 0 && (
                      <div className="pt-2 border-t border-slate-100">
                        <div className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">
                          İhraç Kalibre & Seçenekler:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {stock.activeCalibers.map((cal, i) => (
                            <span 
                              key={i} 
                              className="text-[10px] bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                            >
                              {cal}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Edit Mode Form */
                  <div className="space-y-3 text-xs py-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Sezon Durumu
                      </label>
                      <select
                        value={editForm.seasonStatus || 'peak'}
                        onChange={(e) => setEditForm({ ...editForm, seasonStatus: e.target.value as ProductStockControl['seasonStatus'] })}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                      >
                        <option value="peak">Zirve Hasat (Peak)</option>
                        <option value="storage">Lisanslı Çelik Silo</option>
                        <option value="preorder">Yeni Sezon Ön Sipariş</option>
                        <option value="closed">Sezon Dışı</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Mevcut Stok (MT)
                        </label>
                        <input
                          type="number"
                          value={editForm.availableStockMT || 0}
                          onChange={(e) => setEditForm({ ...editForm, availableStockMT: Number(e.target.value) || 0 })}
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          MOQ (Tons)
                        </label>
                        <input
                          type="number"
                          value={editForm.moqTons || 20}
                          onChange={(e) => setEditForm({ ...editForm, moqTons: Number(e.target.value) || 20 })}
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Kalite Skoru (% Sortex)
                      </label>
                      <input
                        type="number"
                        max={100}
                        min={90}
                        value={editForm.exportQualityScore || 98}
                        onChange={(e) => setEditForm({ ...editForm, exportQualityScore: Number(e.target.value) || 98 })}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Depolama / Silo Şartları
                      </label>
                      <input
                        type="text"
                        value={editForm.storageCondition || ''}
                        onChange={(e) => setEditForm({ ...editForm, storageCondition: e.target.value })}
                        placeholder="Örn: Havalandırmalı çelik silo, nem <%13.5"
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-2">
                {!isEditing ? (
                  <button
                    onClick={() => handleStartEdit(prod.id)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-emerald-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Stok & Sezon Bilgisini Düzenle</span>
                  </button>
                ) : (
                  <div className="w-full flex items-center gap-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold cursor-pointer"
                    >
                      İptal
                    </button>
                    <button
                      onClick={() => handleSave(prod.id)}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Kaydet</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
