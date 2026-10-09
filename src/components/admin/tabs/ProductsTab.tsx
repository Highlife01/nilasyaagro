'use client';

import React, { useState } from 'react';
import { 
  Check, 
  Edit, 
  Save 
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

  const getStockData = (productId: string) => {
    return stocks.find((s) => s.productId === productId) || {
      productId,
      seasonStatus: 'peak' as const,
      moqTons: 20,
      availableStockMT: 1000,
      exportQualityScore: 98,
      storageCondition: 'Standard Cold Storage',
      activeCalibers: [],
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
      setTimeout(() => setSaveSuccessMsg(''), 3000);
      onRefreshData();
    } catch (err) {
      alert('Stok güncellenirken hata oluştu: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-950 tracking-tight">
            Ürün Portföyü & Hasat / Stok Kontrolü
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Nilasya Agro Foods&apos;in 6 ana ihraç ürünü için canlı sezon durumu, minimum sipariş miktarı (MOQ) ve ULO depo stoku yönetimi.
          </p>
        </div>

        {saveSuccessMsg && (
          <div className="p-2.5 px-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* Grid of 6 Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productsData.map((prod) => {
          const stock = getStockData(prod.id);
          const isEditing = editingId === prod.id;

          const statusBadge = {
            peak: { label: 'Zirve Hasat (Peak)', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
            storage: { label: 'ULO Soğuk Depo', color: 'bg-teal-50 text-teal-700 border-teal-200' },
            preorder: { label: 'Ön Sipariş', color: 'bg-amber-50 text-amber-700 border-amber-200' },
            closed: { label: 'Sezon Dışı', color: 'bg-slate-100 text-slate-600 border-slate-200' },
          }[stock.seasonStatus] || { label: 'Aktif', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };

          return (
            <div 
              key={prod.id}
              className="bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between hover:border-emerald-300 hover:shadow-md transition-all shadow-xs"
            >
              <div>
                {/* Header with Title & Badge */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-950 tracking-tight">
                      {prod.name.tr || prod.name.en}
                    </h2>
                    <span className="text-[11px] font-mono text-slate-500 italic">
                      {prod.scientificName}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${statusBadge.color}`}>
                    {statusBadge.label}
                  </span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                  {prod.shortDescription.tr || prod.shortDescription.en}
                </p>

                {/* Form or Readonly stats */}
                {isEditing ? (
                  <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
                    <div>
                      <label className="block text-slate-600 mb-1 font-medium">Sezon / Hasat Durumu</label>
                      <select
                        value={editForm.seasonStatus}
                        onChange={(e) => setEditForm({ ...editForm, seasonStatus: e.target.value as 'peak' | 'storage' | 'preorder' | 'closed' })}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-900"
                      >
                        <option value="peak">Zirve Hasat (Peak Season)</option>
                        <option value="storage">ULO Soğuk Depo Satışta</option>
                        <option value="preorder">Ön Sipariş (Pre-Order)</option>
                        <option value="closed">Sezon Dışı</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-600 mb-1 font-medium">MOQ (Ton)</label>
                        <input
                          type="number"
                          value={editForm.moqTons}
                          onChange={(e) => setEditForm({ ...editForm, moqTons: Number(e.target.value) })}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1 font-medium">Stok (MT)</label>
                        <input
                          type="number"
                          value={editForm.availableStockMT}
                          onChange={(e) => setEditForm({ ...editForm, availableStockMT: Number(e.target.value) })}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-900"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Min. Sipariş (MOQ):</span>
                      <span className="font-bold text-slate-950">{stock.moqTons} Ton (1x40ft FCL)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Mevcut İhraç Stoku:</span>
                      <span className="font-bold text-emerald-700 font-mono">{stock.availableStockMT} MT</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">İhracat Kalite Endeksi:</span>
                      <span className="font-bold text-teal-700">%{stock.exportQualityScore} (Grade A)</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Depo Rejimi:</span>
                      <span className="text-slate-700 text-[11px] truncate max-w-[180px] font-medium">{prod.specifications.storageTemp}</span>
                    </div>
                  </div>
                )}

                {/* Varieties & Calibers */}
                <div className="mt-4">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    İhraç Edilen Çeşitler ({prod.varieties.length})
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {prod.varieties.slice(0, 3).map((v, i) => (
                      <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                        {v.nameTr || v.name}
                      </span>
                    ))}
                    {prod.varieties.length > 3 && (
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 border border-slate-200">
                        +{prod.varieties.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">
                  Ref: #{prod.id.toUpperCase()}
                </span>

                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
                    >
                      İptal
                    </button>
                    <button
                      onClick={() => handleSave(prod.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Kaydet</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleStartEdit(prod.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Sezonu Düzenle</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
