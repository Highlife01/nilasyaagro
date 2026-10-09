'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  Plus, 
  FileText, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  X, 
  ExternalLink, 
  Trash2, 
  Calculator, 
  MessageSquare
} from 'lucide-react';
import { RFQSubmission } from '@/types';
import { AdminInquiry, updateRFQ, deleteRFQ, saveRFQInquiry } from '@/lib/adminAuth';

interface QuotesTabProps {
  rfqs: AdminInquiry[];
  currency: 'USD' | 'EUR' | 'TRY';
  onRefreshData: () => void;
}

export const QuotesTab: React.FC<QuotesTabProps> = ({
  rfqs,
  currency,
  onRefreshData,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [productFilter, setProductFilter] = useState<string>('all');
  const [selectedRFQ, setSelectedRFQ] = useState<(typeof rfqs)[number] | null>(null);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isNewRFQModalOpen, setIsNewRFQModalOpen] = useState(false);

  // Price Calculator state
  const [calcBasePrice, setCalcBasePrice] = useState<number>(1.25); // $/kg
  const [calcFreight, setCalcFreight] = useState<number>(2400); // 40ft FCL container $/40ft
  const [calcMargin, setCalcMargin] = useState<number>(12); // % margin

  // New RFQ form state
  const [newForm, setNewForm] = useState<{
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    whatsapp: string;
    product: string;
    variety: string;
    caliber: string;
    quantity: string;
    unit: RFQSubmission['unit'];
    packaging: string;
    destinationCountry: string;
    destinationCity: string;
    destinationPort: string;
    incoterm: RFQSubmission['incoterm'];
    message: string;
    estimatedValueUSD: number;
  }>({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    whatsapp: '',
    product: 'chickpeas',
    variety: 'Koçbaşı Kabuli Nohut (9-10mm)',
    caliber: '9mm - 10mm Jumbo (Sortex %99.8)',
    quantity: '48',
    unit: 'Tons',
    packaging: 'PP Woven Bags (25kg Net)',
    destinationCountry: 'Germany',
    destinationCity: 'Hamburg',
    destinationPort: 'Hamburg Port',
    incoterm: 'CIF',
    message: '',
    estimatedValueUSD: 35000,
  });

  const currencyMultiplier = currency === 'EUR' ? 0.92 : currency === 'TRY' ? 38.5 : 1;
  const currencySymbol = currency === 'EUR' ? '€' : currency === 'TRY' ? '₺' : '$';

  // Filter logic
  const filteredRFQs = rfqs.filter((r) => {
    const matchesSearch = 
      r.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.referenceCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.destinationCountry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.product?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesProduct = productFilter === 'all' || r.product === productFilter;

    return matchesSearch && matchesStatus && matchesProduct;
  });

  const handleStatusChange = async (id: string, newStatus: 'new' | 'quoted' | 'negotiation' | 'approved' | 'archived') => {
    try {
      await updateRFQ(id, { status: newStatus });
      if (selectedRFQ && selectedRFQ.id === id) {
        setSelectedRFQ({ ...selectedRFQ, status: newStatus });
      }
      onRefreshData();
    } catch (err) {
      alert('Durum güncellenirken hata oluştu: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleNotesChange = async (id: string, notes: string) => {
    try {
      await updateRFQ(id, { adminNotes: notes });
      if (selectedRFQ && selectedRFQ.id === id) {
        setSelectedRFQ({ ...selectedRFQ, adminNotes: notes });
      }
      onRefreshData();
    } catch (err) {
      alert('Not güncellenirken hata oluştu: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bu teklif kaydını silmek istediğinize emin misiniz?')) {
      try {
        await deleteRFQ(id);
        if (selectedRFQ?.id === id) setSelectedRFQ(null);
        onRefreshData();
      } catch (err) {
        alert('Teklif silinirken hata oluştu: ' + (err instanceof Error ? err.message : String(err)));
      }
    }
  };

  const handleCreateNewRFQ = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveRFQInquiry({
        ...newForm,
        referenceCode: `NG-RFQ-${Math.floor(1000 + Math.random() * 9000)}`,
      });
      setIsNewRFQModalOpen(false);
      onRefreshData();
    } catch (err) {
      alert('Teklif oluşturulurken hata oluştu: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleExportCSV = () => {
    const headers = ['Ref Kodu', 'Şirket', 'Yetkili', 'Ülke', 'Şehir', 'Ürün', 'Miktar', 'Birim', 'Incoterm', 'Durum', 'E-Posta', 'Telefon', 'Tarih'];
    const rows = filteredRFQs.map((r) => [
      r.referenceCode,
      `"${r.companyName || ''}"`,
      `"${r.contactPerson || ''}"`,
      `"${r.destinationCountry || ''}"`,
      `"${r.destinationCity || ''}"`,
      r.product,
      r.quantity,
      r.unit,
      r.incoterm,
      r.status,
      r.email,
      r.phone,
      r.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nilasya_export_rfqs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // WhatsApp reply url helper
  const createBuyerWhatsAppUrl = (rfq: typeof filteredRFQs[number]) => {
    const phone = (rfq.whatsapp || rfq.phone || '').replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Sayın ${rfq.contactPerson} (${rfq.companyName}),\n\nNilasya Agro Foods Tarım İhracat Deski'nden aldığımız ${rfq.referenceCode} numaralı ${rfq.product} talebiniz için resmi proforma teklifimiz hazırlanmıştır.\n\nDetaylar:\n- Ürün: ${rfq.product} (${rfq.variety || ''})\n- Miktar: ${rfq.quantity} ${rfq.unit}\n- Teslim: ${rfq.incoterm} ${rfq.destinationPort || rfq.destinationCity}\n\nTeklifi incelemek ve detayları görüşmek için hazırız.`
    );
    return `https://wa.me/${phone}?text=${text}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-950 tracking-tight">
            Gelen İhracat Talepleri (RFQ Yönetimi)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Uluslararası B2B bakliyat ve hububat alıcılarından gelen teklif istekleri, müşteri detayları ve proforma hazırlığı.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>CSV Dışa Aktar</span>
          </button>
          <button
            onClick={() => setIsNewRFQModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Manuel Talep Ekle</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Firma adı, referans kodu, ülke veya ürün ara..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'Tümü' },
            { id: 'new', label: 'Yeni' },
            { id: 'quoted', label: 'Teklif İletildi' },
            { id: 'negotiation', label: 'Müzakere' },
            { id: 'approved', label: 'Onaylandı' },
            { id: 'archived', label: 'Arşiv' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Filter */}
        <select
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer font-medium"
        >
          <option value="all">Tüm Ürünler</option>
          <option value="chickpeas">Koçbaşı Nohut</option>
          <option value="red-lentils">Kırmızı Mercimek</option>
          <option value="green-lentils">Yeşil Mercimek</option>
          <option value="white-beans">Dermason Fasulye</option>
          <option value="durum-wheat-bulgur">Durum Buğdayı & Bulgur</option>
          <option value="dry-peas">Kuru Bezelye</option>
          <option value="pasta-macaroni">Türk Makarnası</option>
        </select>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Ref Kodu</th>
                <th className="py-3.5 px-4">Şirket / Alıcı</th>
                <th className="py-3.5 px-4">Talep Edilen Ürün</th>
                <th className="py-3.5 px-4">Miktar & Ambalaj</th>
                <th className="py-3.5 px-4">Hedef & Incoterm</th>
                <th className="py-3.5 px-4">Tahmini Değer</th>
                <th className="py-3.5 px-4">Durum</th>
                <th className="py-3.5 px-4 text-right">Eylemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRFQs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Arama kriterine uygun ihracat talebi bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredRFQs.map((rfq) => (
                  <tr 
                    key={rfq.id} 
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => setSelectedRFQ(rfq)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                      {rfq.referenceCode}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {rfq.companyName}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {rfq.contactPerson}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 capitalize">
                        {rfq.product}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[160px]">
                        {rfq.variety || 'Standart'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">
                        {rfq.quantity} {rfq.unit}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[140px]">
                        {rfq.packaging}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">
                        {rfq.destinationCountry}
                      </div>
                      <div className="text-[11px] text-emerald-700 font-mono font-medium">
                        {rfq.incoterm} {rfq.destinationPort ? `(${rfq.destinationPort})` : ''}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {currencySymbol}{((rfq.estimatedValueUSD || 0) * currencyMultiplier).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={rfq.status}
                        onChange={(e) => handleStatusChange(rfq.id!, e.target.value as 'new' | 'quoted' | 'negotiation' | 'approved' | 'archived')}
                        className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                          rfq.status === 'new'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : rfq.status === 'quoted'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : rfq.status === 'negotiation'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : rfq.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        <option value="new">Yeni Talep</option>
                        <option value="quoted">Teklif Verildi</option>
                        <option value="negotiation">Müzakere</option>
                        <option value="approved">Onaylandı</option>
                        <option value="archived">Arşivlendi</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedRFQ(rfq)}
                          title="Detayları İncele"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-600 transition-colors cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href={createBuyerWhatsAppUrl(rfq)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="WhatsApp'tan Yaz"
                          className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => handleDelete(rfq.id!)}
                          title="Kaydı Sil"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-500 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RFQ Detail Drawer / Modal */}
      {selectedRFQ && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative text-slate-800">
            <button
              onClick={() => setSelectedRFQ(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-black text-slate-950">{selectedRFQ.companyName}</h2>
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                    {selectedRFQ.referenceCode}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Kayıt Tarihi: {new Date(selectedRFQ.createdAt).toLocaleString('tr-TR')}
                </p>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Buyer Information */}
              <div className="bg-slate-50/90 border border-slate-200/80 rounded-2xl p-4 space-y-3">
                <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Alıcı Firma Bilgileri</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Yetkili Kişi:</span>
                    <span className="font-semibold text-slate-900">{selectedRFQ.contactPerson}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">E-Posta:</span>
                    <a href={`mailto:${selectedRFQ.email}`} className="text-emerald-700 font-medium hover:underline">
                      {selectedRFQ.email}
                    </a>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Telefon:</span>
                    <span className="font-mono text-slate-700 font-medium">{selectedRFQ.phone}</span>
                  </div>
                  {selectedRFQ.whatsapp && (
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">WhatsApp:</span>
                      <span className="font-mono text-emerald-700 font-medium">{selectedRFQ.whatsapp}</span>
                    </div>
                  )}
                  {selectedRFQ.website && (
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Web Sitesi:</span>
                      <a href={selectedRFQ.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                        <span>{selectedRFQ.website}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Order & Shipment Specs */}
              <div className="bg-slate-50/90 border border-slate-200/80 rounded-2xl p-4 space-y-3">
                <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sipariş & Lojistik Detayları</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Ürün / Çeşit:</span>
                    <span className="font-semibold text-slate-900 capitalize">{selectedRFQ.product} ({selectedRFQ.variety || 'Standart'})</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Miktar:</span>
                    <span className="font-bold text-slate-950">{selectedRFQ.quantity} {selectedRFQ.unit}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Ambalaj Tipi:</span>
                    <span className="text-slate-700">{selectedRFQ.packaging}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Hedef Lokasyon:</span>
                    <span className="text-slate-700">{selectedRFQ.destinationCity}, {selectedRFQ.destinationCountry}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Teslim Şekli:</span>
                    <span className="font-bold text-emerald-700">{selectedRFQ.incoterm} {selectedRFQ.destinationPort ? `(${selectedRFQ.destinationPort})` : ''}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Buyer Message */}
            {selectedRFQ.message && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mb-6">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Alıcının Ek Mesajı / Notu:</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  &ldquo;{selectedRFQ.message}&rdquo;
                </p>
              </div>
            )}

            {/* Super Admin Notes & Status */}
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 mb-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Süper Admin Operasyonel Notu
                </span>
                <span className="text-[11px] text-slate-500 font-medium">Otomatik kaydedilir</span>
              </div>
              <textarea
                value={selectedRFQ.adminNotes || ''}
                onChange={(e) => handleNotesChange(selectedRFQ.id!, e.target.value)}
                placeholder="Örn: Proforma fatura gönderildi, 15 Ekim gemisine rezervasyon yapıldı..."
                rows={2}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-3">
                <a
                  href={createBuyerWhatsAppUrl(selectedRFQ)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-md shadow-emerald-600/20"
                >
                  <Phone className="w-4 h-4" />
                  <span>Alıcıya WhatsApp ile Teklif İlet</span>
                </a>
                <a
                  href={`mailto:${selectedRFQ.email}?subject=Nilasya Agro Foods Proforma Quote ${selectedRFQ.referenceCode}`}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>E-Posta Gönder</span>
                </a>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCalculatorOpen(!isCalculatorOpen)}
                  className="px-3.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Calculator className="w-4 h-4 text-amber-600" />
                  <span>FOB/CIF Fiyat Hesapla</span>
                </button>
              </div>
            </div>

            {/* Quick Price Calculator Widget */}
            {isCalculatorOpen && (
              <div className="mt-6 pt-6 border-t border-slate-200 bg-amber-50/50 rounded-2xl p-5 border border-amber-200/80 animate-in fade-in">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider mb-4">
                  <Calculator className="w-4 h-4 text-amber-600" />
                  <span>Hızlı Incoterms Fiyatlandırma Hesaplayıcısı</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Taban Ürün Maliyeti ($/kg)</label>
                    <input
                      type="number"
                      step="0.05"
                      value={calcBasePrice}
                      onChange={(e) => setCalcBasePrice(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">40ft FCL Konteyner Navlun ($)</label>
                    <input
                      type="number"
                      step="100"
                      value={calcFreight}
                      onChange={(e) => setCalcFreight(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Hedef Kar Marjı (%)</label>
                    <input
                      type="number"
                      value={calcMargin}
                      onChange={(e) => setCalcMargin(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-900"
                    />
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-white border border-amber-200/60 flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700">
                    Önerilen {selectedRFQ.incoterm} Teklif Fiyatı (1 FCL / ~22 MT):
                  </span>
                  <span className="text-emerald-700 text-sm font-mono">
                    ${(
                      (Number(selectedRFQ.quantity || 22) * 1000 * calcBasePrice + calcFreight) *
                      (1 + calcMargin / 100)
                    ).toLocaleString('en-US', { maximumFractionDigits: 0 })}{' '}
                    USD
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manual RFQ Creation Modal */}
      {isNewRFQModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl p-6 sm:p-8 shadow-2xl relative text-slate-800">
            <button
              onClick={() => setIsNewRFQModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-black text-slate-950 mb-1">Manuel İhracat Talebi Ekle</h2>
            <p className="text-xs text-slate-500 mb-6">Telefon veya e-posta ile doğrudan alınan teklif talebini sisteme kaydedin.</p>

            <form onSubmit={handleCreateNewRFQ} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Şirket Adı</label>
                  <input
                    required
                    type="text"
                    value={newForm.companyName}
                    onChange={(e) => setNewForm({ ...newForm, companyName: e.target.value })}
                    placeholder="Örn: EuroFresh Ltd."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Yetkili Kişi</label>
                  <input
                    required
                    type="text"
                    value={newForm.contactPerson}
                    onChange={(e) => setNewForm({ ...newForm, contactPerson: e.target.value })}
                    placeholder="Örn: John Doe"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">E-Posta</label>
                  <input
                    required
                    type="email"
                    value={newForm.email}
                    onChange={(e) => setNewForm({ ...newForm, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Telefon / WhatsApp</label>
                  <input
                    required
                    type="text"
                    value={newForm.phone}
                    onChange={(e) => setNewForm({ ...newForm, phone: e.target.value, whatsapp: e.target.value })}
                    placeholder="+49 170 1234567"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Ürün</label>
                  <select
                    value={newForm.product}
                    onChange={(e) => setNewForm({ ...newForm, product: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium"
                  >
                    <option value="chickpeas">Koçbaşı Nohut</option>
                    <option value="red-lentils">Kırmızı Mercimek</option>
                    <option value="green-lentils">Yeşil Mercimek</option>
                    <option value="white-beans">Dermason Fasulye</option>
                    <option value="durum-wheat-bulgur">Durum Buğdayı & Bulgur</option>
                    <option value="dry-peas">Kuru Bezelye</option>
                    <option value="pasta-macaroni">Türk Makarnası</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Miktar (MT)</label>
                  <input
                    type="number"
                    value={newForm.quantity}
                    onChange={(e) => setNewForm({ ...newForm, quantity: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Teslimat (Incoterm)</label>
                  <select
                    value={newForm.incoterm}
                    onChange={(e) => setNewForm({ ...newForm, incoterm: e.target.value as RFQSubmission['incoterm'] })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium"
                  >
                    <option value="CIF">CIF</option>
                    <option value="FOB">FOB</option>
                    <option value="CFR">CFR</option>
                    <option value="DAP">DAP</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Hedef Ülke</label>
                  <input
                    required
                    type="text"
                    value={newForm.destinationCountry}
                    onChange={(e) => setNewForm({ ...newForm, destinationCountry: e.target.value })}
                    placeholder="Germany"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Hedef Liman / Şehir</label>
                  <input
                    type="text"
                    value={newForm.destinationPort}
                    onChange={(e) => setNewForm({ ...newForm, destinationPort: e.target.value, destinationCity: e.target.value })}
                    placeholder="Hamburg Port"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Müşteri Notu</label>
                <textarea
                  rows={2}
                  value={newForm.message}
                  onChange={(e) => setNewForm({ ...newForm, message: e.target.value })}
                  placeholder="Ambalaj tercihi, kalite toleransı vb."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md shadow-emerald-600/20"
              >
                <Plus className="w-4 h-4" />
                <span>Talebi Kaydet</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
