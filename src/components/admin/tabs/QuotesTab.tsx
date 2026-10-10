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
  MessageSquare,
  Copy,
  Check,
  Clock,
  Inbox,
  Send,
  HelpCircle,
  Filter
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
  const [typeFilter, setTypeFilter] = useState<'all' | 'rfq' | 'contact'>('all');
  const [productFilter, setProductFilter] = useState<string>('all');
  const [selectedRFQ, setSelectedRFQ] = useState<AdminInquiry | null>(null);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isNewRFQModalOpen, setIsNewRFQModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Price Calculator state (B2B Agro Export)
  const [calcBasePriceMT, setCalcBasePriceMT] = useState<number>(1280); // $/MT FOB base
  const [calcPackagingMT, setCalcPackagingMT] = useState<number>(35); // $/MT PP woven bags
  const [calcPortHandlingMT, setCalcPortHandlingMT] = useState<number>(25); // $/MT Mersin MIP terminal & phytosanitary
  const [calcFreightContainer, setCalcFreightContainer] = useState<number>(2600); // Ocean Freight $/40ft (24 MT)
  const [calcTonnage, setCalcTonnage] = useState<number>(24); // 1 FCL = 24 MT
  const [calcMarginPercent, setCalcMarginPercent] = useState<number>(12); // % margin

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
    estimatedValueUSD: 62400,
  });

  const currencyMultiplier = currency === 'EUR' ? 0.92 : currency === 'TRY' ? 38.5 : 1;
  const currencySymbol = currency === 'EUR' ? '€' : currency === 'TRY' ? '₺' : '$';

  // Calculator outputs
  const calculatedFOBPriceMT = Math.round((calcBasePriceMT + calcPackagingMT + calcPortHandlingMT) * (1 + calcMarginPercent / 100));
  const freightPerMT = calcTonnage > 0 ? Math.round(calcFreightContainer / calcTonnage) : 0;
  const calculatedCIFPriceMT = calculatedFOBPriceMT + freightPerMT;
  const calculatedTotalShipmentValue = calculatedCIFPriceMT * calcTonnage;

  // Type Counts
  const rfqCount = rfqs.filter((r) => r.kind !== 'contact').length;
  const contactCount = rfqs.filter((r) => r.kind === 'contact').length;

  // Status Counts
  const counts = {
    all: rfqs.length,
    new: rfqs.filter((r) => r.status === 'new').length,
    quoted: rfqs.filter((r) => r.status === 'quoted').length,
    negotiation: rfqs.filter((r) => r.status === 'negotiation').length,
    approved: rfqs.filter((r) => r.status === 'approved').length,
    archived: rfqs.filter((r) => r.status === 'archived').length,
  };

  // Filter logic
  const filteredRFQs = rfqs.filter((r) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (r.companyName || '').toLowerCase().includes(term) ||
      (r.referenceCode || '').toLowerCase().includes(term) ||
      (r.destinationCountry || '').toLowerCase().includes(term) ||
      (r.contactPerson || '').toLowerCase().includes(term) ||
      (r.subject || '').toLowerCase().includes(term) ||
      (r.product || '').toLowerCase().includes(term);

    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesType = typeFilter === 'all' || (typeFilter === 'contact' ? r.kind === 'contact' : r.kind !== 'contact');
    const matchesProduct = productFilter === 'all' || r.product === productFilter;

    return matchesSearch && matchesStatus && matchesType && matchesProduct;
  });

  const handleStatusChange = async (id: string, newStatus: AdminInquiry['status']) => {
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
    if (confirm('Bu kaydı silmek istediğinize emin misiniz?')) {
      try {
        await deleteRFQ(id);
        if (selectedRFQ?.id === id) setSelectedRFQ(null);
        onRefreshData();
      } catch (err) {
        alert('Silinirken hata oluştu: ' + (err instanceof Error ? err.message : String(err)));
      }
    }
  };

  const handleCreateNewRFQ = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveRFQInquiry({
        ...newForm,
        referenceCode: `NA-RFQ-${Math.floor(1000 + Math.random() * 9000)}`,
      });
      setIsNewRFQModalOpen(false);
      onRefreshData();
    } catch (err) {
      alert('Teklif oluşturulurken hata oluştu: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleCopyDetails = (rfq: AdminInquiry) => {
    const isContact = rfq.kind === 'contact';
    const text = isContact 
      ? `NİLASYA AGRO FOODS - İLETİŞİM MESAJI
Ref Kodu: ${rfq.referenceCode}
Firma: ${rfq.companyName}
Yetkili: ${rfq.contactPerson} (${rfq.email} / ${rfq.phone})
Konu: ${rfq.subject || 'Genel İletişim'}
Mesaj: ${rfq.message || ''}`
      : `NİLASYA AGRO FOODS - TEKLİF ÖZETİ
Ref Kodu: ${rfq.referenceCode}
Firma: ${rfq.companyName}
Yetkili: ${rfq.contactPerson} (${rfq.email} / ${rfq.phone})
Ürün: ${rfq.product} (${rfq.variety || 'Standart'})
Kalibre: ${rfq.caliber || 'Sortex'}
Miktar: ${rfq.quantity} ${rfq.unit || 'Tons'}
Ambalaj: ${rfq.packaging || '25kg PP'}
Teslimat: ${rfq.incoterm || 'CIF'} ${rfq.destinationPort || rfq.destinationCity || rfq.destinationCountry}
Tahmini Sipariş Değeri: $${(rfq.estimatedValueUSD || 0).toLocaleString()} USD`;

    navigator.clipboard.writeText(text);
    setCopiedId(rfq.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleExportCSV = () => {
    const headers = ['Ref Kodu', 'Tür', 'Şirket', 'Yetkili', 'Ülke', 'Şehir', 'Ürün / Konu', 'Miktar', 'Birim', 'Incoterm', 'Durum', 'Değer (USD)', 'E-Posta', 'Telefon', 'Tarih'];
    const rows = filteredRFQs.map((r) => [
      r.referenceCode,
      r.kind === 'contact' ? 'İletişim Mesajı' : 'Teklif Talebi (RFQ)',
      `"${r.companyName || ''}"`,
      `"${r.contactPerson || ''}"`,
      `"${r.destinationCountry || ''}"`,
      `"${r.destinationCity || ''}"`,
      `"${r.kind === 'contact' ? (r.subject || 'İletişim') : (r.product || '')}"`,
      r.quantity || '',
      r.unit || '',
      r.incoterm || '',
      r.status,
      r.estimatedValueUSD || 0,
      r.email,
      r.phone,
      r.createdAt,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `nilasya_talepler_ve_mesajlar_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const createBuyerWhatsAppUrl = (rfq: AdminInquiry) => {
    const phone = (rfq.whatsapp || rfq.phone || '').replace(/[^0-9]/g, '');
    const isContact = rfq.kind === 'contact';
    const text = isContact
      ? encodeURIComponent(
          `Sayın ${rfq.contactPerson} (${rfq.companyName}),\n\nNilasya Agro Foods Tarım web sitemiz üzerinden ilettiğiniz "${rfq.subject || 'İletişim Talebi'}" konulu mesajınız (${rfq.referenceCode}) alınmıştır.\n\nKonuyla ilgili ihracat yetkilimiz size yardımcı olmak için hazırdır.`
        )
      : encodeURIComponent(
          `Sayın ${rfq.contactPerson} (${rfq.companyName}),\n\nNilasya Agro Foods Tarım İhracat Deski'nden aldığımız ${rfq.referenceCode} referanslı talebiniz için resmi proforma teklifimiz hazırlanmıştır.\n\nDetaylar:\n- Ürün: ${rfq.product} (${rfq.variety || ''})\n- Miktar: ${rfq.quantity} ${rfq.unit || 'Tons'}\n- Teslimat Şekli: ${rfq.incoterm || 'CIF'} ${rfq.destinationPort || rfq.destinationCity || rfq.destinationCountry}\n- Sevkiyat Çıkışı: Mersin Uluslararası Limanı (MIP)\n\nFiyat teklifini ve teknik spektlerimizi görüşmek üzere hazırız.`
        );
    return `https://wa.me/${phone}?text=${text}`;
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-950 tracking-tight">
            Gelen Talepler & İletişim Mesajları
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            30 dilli web portalı teklif sihirbazı ve doğrudan temas formundan gelen tüm uluslararası B2B mesaj kayıtları.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsCalculatorOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Calculator className="w-4 h-4 text-emerald-600" />
            <span>Fiyat Sihirbazı</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Excel / CSV</span>
          </button>

          <button
            onClick={() => setIsNewRFQModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Manuel Talep Ekle</span>
          </button>
        </div>
      </div>

      {/* Main Filter Section: Type Toggle + Status Pills */}
      <div className="space-y-3">
        {/* Form Type Selector: All vs RFQ vs Contact */}
        <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              typeFilter === 'all'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Tüm Mesajlar & Talepler ({rfqs.length})</span>
          </button>

          <button
            onClick={() => setTypeFilter('rfq')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              typeFilter === 'rfq'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            <span>Yalnızca Teklif Talepleri ({rfqCount})</span>
          </button>

          <button
            onClick={() => setTypeFilter('contact')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              typeFilter === 'contact'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Send className="w-3.5 h-3.5 text-purple-600" />
            <span>İletişim Formu Mesajları ({contactCount})</span>
          </button>
        </div>

        {/* Status Filter Tab Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'Tüm Aşamalar', count: counts.all },
            { id: 'new', label: 'Yeni Alınan', count: counts.new, color: 'bg-rose-500 text-white' },
            { id: 'quoted', label: 'Teklif Verildi', count: counts.quoted, color: 'bg-blue-600 text-white' },
            { id: 'negotiation', label: 'Müzakerede', count: counts.negotiation, color: 'bg-amber-600 text-white' },
            { id: 'approved', label: 'Sözleşme / Onay', count: counts.approved, color: 'bg-emerald-600 text-white' },
            { id: 'archived', label: 'Arşiv', count: counts.archived },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                statusFilter === tab.id 
                  ? 'bg-white/20 text-white' 
                  : tab.color || 'bg-slate-100 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search & Product Dropdown Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Firma, konu, ülke, ref kodu veya yetkili ara..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-emerald-500 font-medium cursor-pointer"
          >
            <option value="all">Tüm Ürün / Konu Kategorileri</option>
            <option value="chickpeas">Koçbaşı Nohut</option>
            <option value="red-lentils">Kırmızı Mercimek</option>
            <option value="green-lentils">Yeşil Mercimek</option>
            <option value="white-beans">Kuru Fasulye (Dermason)</option>
            <option value="dry-peas">Kuru Bezelye</option>
            <option value="durum-wheat">Makarnalık Buğday & Bulgur</option>
          </select>

          <span className="text-xs text-slate-500 font-medium shrink-0">
            {filteredRFQs.length} Kayıt Listelendi
          </span>
        </div>
      </div>

      {/* RFQ & Contact Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Tür & Ref Kodu</th>
                <th className="py-3.5 px-4">Gönderen / Firma</th>
                <th className="py-3.5 px-4">Talep Edilen Ürün / Konu</th>
                <th className="py-3.5 px-4">Lojistik & Teslimat</th>
                <th className="py-3.5 px-4">Tahmini Değer</th>
                <th className="py-3.5 px-4">Durum</th>
                <th className="py-3.5 px-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRFQs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Inbox className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">Aradığınız kriterlere uygun kayıt bulunamadı.</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Filtreleri sıfırlayarak tüm gelen talepleri görebilirsiniz.</p>
                  </td>
                </tr>
              ) : (
                filteredRFQs.map((rfq) => {
                  const isContact = rfq.kind === 'contact';
                  const statusBadge = {
                    new: { label: 'Yeni Alınan', color: 'bg-rose-50 text-rose-700 border-rose-200' },
                    quoted: { label: 'Teklif / Yanıt İletildi', color: 'bg-blue-50 text-blue-700 border-blue-200' },
                    negotiation: { label: 'Müzakerede', color: 'bg-amber-50 text-amber-700 border-amber-200' },
                    approved: { label: 'Onaylandı / Anlaşıldı', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                    archived: { label: 'Arşiv', color: 'bg-slate-100 text-slate-600 border-slate-200' },
                  }[rfq.status] || { label: rfq.status, color: 'bg-slate-100 text-slate-600 border-slate-200' };

                  return (
                    <tr 
                      key={rfq.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => setSelectedRFQ(rfq)}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 mb-1">
                          {isContact ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                              İletişim Formu
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                              Teklif Talebi (RFQ)
                            </span>
                          )}
                        </div>
                        <div className="font-mono font-bold text-slate-800 text-[11px]">
                          {rfq.referenceCode}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{new Date(rfq.createdAt).toLocaleDateString('tr-TR')}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {rfq.companyName}
                        </div>
                        <div className="text-[11px] text-slate-600 font-medium">
                          {rfq.contactPerson}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{rfq.destinationCountry || 'Bilinmiyor'} {rfq.destinationCity ? `(${rfq.destinationCity})` : ''}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {isContact ? (
                          <div>
                            <div className="font-bold text-purple-900 line-clamp-1">
                              {rfq.subject || 'Genel İletişim Talebi'}
                            </div>
                            <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 italic">
                              &ldquo;{rfq.message}&rdquo;
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="font-bold text-slate-800 capitalize">
                              {rfq.product}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {rfq.quantity} {rfq.unit || 'Tons'} • {rfq.variety || 'Sortex'}
                            </div>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {isContact ? (
                          <span className="text-[11px] text-slate-400 italic">
                            Doğrudan İletişim
                          </span>
                        ) : (
                          <div>
                            <span className="font-mono font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              {rfq.incoterm || 'CIF'}
                            </span>
                            <div className="text-[10px] text-slate-500 mt-1 truncate max-w-[140px]">
                              {rfq.destinationPort || 'Hedef Liman'}
                            </div>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {isContact ? (
                          <span className="text-slate-400 font-normal">—</span>
                        ) : (
                          <span>
                            {currencySymbol}{((rfq.estimatedValueUSD || 0) * currencyMultiplier).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider border ${statusBadge.color}`}>
                          {statusBadge.label}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleCopyDetails(rfq)}
                            title="Özeti Kopyala"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                          >
                            {copiedId === rfq.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                          </button>

                          {(rfq.whatsapp || rfq.phone) && (
                            <a
                              href={createBuyerWhatsAppUrl(rfq)}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="WhatsApp İle İletişim Kur"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                            >
                              <MessageSquare className="w-4 h-4 text-emerald-600" />
                            </a>
                          )}

                          <button
                            onClick={() => handleDelete(rfq.id)}
                            title="Kaydı Sil"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal: RFQ or Contact Dossier */}
      {selectedRFQ && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center font-bold ${
                  selectedRFQ.kind === 'contact' 
                    ? 'bg-purple-50 border-purple-200 text-purple-700' 
                    : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                }`}>
                  {selectedRFQ.kind === 'contact' ? <Send className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-950 flex items-center gap-2">
                    <span>{selectedRFQ.companyName}</span>
                    <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                      {selectedRFQ.referenceCode}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    {selectedRFQ.kind === 'contact' ? 'İletişim Formu Kaydı' : 'İhracat Teklif Formu (RFQ)'} • {new Date(selectedRFQ.createdAt).toLocaleString('tr-TR')}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedRFQ(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-5 space-y-6">
              {/* Buyer & Shipment Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">İletişim & Şirket</div>
                  <div><strong>Yetkili:</strong> {selectedRFQ.contactPerson}</div>
                  <div><strong>E-Posta:</strong> <a href={`mailto:${selectedRFQ.email}`} className="text-emerald-700 hover:underline">{selectedRFQ.email}</a></div>
                  <div><strong>Telefon / WhatsApp:</strong> {selectedRFQ.phone || selectedRFQ.whatsapp || 'Belirtilmedi'}</div>
                  {selectedRFQ.website && <div><strong>Web:</strong> <a href={selectedRFQ.website} target="_blank" className="text-emerald-700 hover:underline">{selectedRFQ.website}</a></div>}
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    {selectedRFQ.kind === 'contact' ? 'Mesaj Detayları' : 'Lojistik & Teslimat'}
                  </div>
                  {selectedRFQ.kind === 'contact' ? (
                    <>
                      <div><strong>Konu:</strong> {selectedRFQ.subject || 'Genel İletişim'}</div>
                      <div><strong>Ülke:</strong> {selectedRFQ.destinationCountry || 'Bilinmiyor'}</div>
                      <div><strong>Kanal:</strong> Doğrudan Web İletişim Formu</div>
                    </>
                  ) : (
                    <>
                      <div><strong>Ürün:</strong> {selectedRFQ.product} ({selectedRFQ.variety || 'Sortex'})</div>
                      <div><strong>Miktar:</strong> {selectedRFQ.quantity} {selectedRFQ.unit || 'Tons'}</div>
                      <div><strong>Ambalaj:</strong> {selectedRFQ.packaging || '25kg PP Torba'}</div>
                      <div><strong>Incoterm:</strong> {selectedRFQ.incoterm || 'CIF'} - {selectedRFQ.destinationPort || selectedRFQ.destinationCity || selectedRFQ.destinationCountry}</div>
                      <div><strong>Tahmini Değer:</strong> ${selectedRFQ.estimatedValueUSD?.toLocaleString()} USD</div>
                    </>
                  )}
                </div>
              </div>

              {/* Message from Client */}
              {selectedRFQ.message && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{selectedRFQ.kind === 'contact' ? 'Gelen İletişim Mesajı Metni:' : 'Alıcının Talep Notu:'}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedRFQ.message}</p>
                </div>
              )}

              {/* Status Advancement Buttons */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Süreç Aşaması Değiştir
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(['new', 'quoted', 'negotiation', 'approved', 'archived'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedRFQ.id, st)}
                      className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                        selectedRFQ.status === st
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {st === 'new' ? 'Yeni' : st === 'quoted' ? 'Yanıtlandı' : st === 'negotiation' ? 'Müzakere' : st === 'approved' ? 'Anlaşıldı' : 'Arşiv'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Admin Internal Notes */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Yönetici İhracat Masası Notları
                </label>
                <textarea
                  rows={3}
                  defaultValue={selectedRFQ.adminNotes || ''}
                  onBlur={(e) => handleNotesChange(selectedRFQ.id, e.target.value)}
                  placeholder="Görüşme notları, arama saati, alıcı özel şartları..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => handleCopyDetails(selectedRFQ)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                {copiedId === selectedRFQ.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === selectedRFQ.id ? 'Kopyalandı!' : 'Özeti Kopyala'}</span>
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedRFQ.email}?subject=Re:%20Nilasya%20Agro%20Foods%20-%20${encodeURIComponent(selectedRFQ.referenceCode)}`}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>E-Posta Yaz</span>
                </a>

                {(selectedRFQ.whatsapp || selectedRFQ.phone) && (
                  <a
                    href={createBuyerWhatsAppUrl(selectedRFQ)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp İle İletişim</span>
                  </a>
                )}
                <button
                  onClick={() => setSelectedRFQ(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* B2B Export Price Calculator Modal */}
      {isCalculatorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-950">
                    B2B İhracat Fiyatlandırma Sihirbazı
                  </h2>
                  <p className="text-xs text-slate-500">
                    Mersin MIP Limanı çıkışlı FOB & CIF konteyner birim maliyet hesabı
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCalculatorOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Ürün Taban Alış Maliyeti ($/MT)
                  </label>
                  <input
                    type="number"
                    value={calcBasePriceMT}
                    onChange={(e) => setCalcBasePriceMT(Number(e.target.value) || 0)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Ambalaj & Paletleme ($/MT)
                  </label>
                  <input
                    type="number"
                    value={calcPackagingMT}
                    onChange={(e) => setCalcPackagingMT(Number(e.target.value) || 0)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Mersin MIP Terminal & Gümrük ($/MT)
                  </label>
                  <input
                    type="number"
                    value={calcPortHandlingMT}
                    onChange={(e) => setCalcPortHandlingMT(Number(e.target.value) || 0)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Hedef Kar Marjı (%)
                  </label>
                  <input
                    type="number"
                    value={calcMarginPercent}
                    onChange={(e) => setCalcMarginPercent(Number(e.target.value) || 0)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Deniz Navlunu ($/40ft FCL)
                  </label>
                  <input
                    type="number"
                    value={calcFreightContainer}
                    onChange={(e) => setCalcFreightContainer(Number(e.target.value) || 0)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Konteyner Yükleme Hacmi (MT)
                  </label>
                  <input
                    type="number"
                    value={calcTonnage}
                    onChange={(e) => setCalcTonnage(Number(e.target.value) || 0)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
                  />
                </div>
              </div>

              {/* Results Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-tr from-emerald-50 to-teal-50 border border-emerald-200 mt-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-900">
                  <span>Hesaplanan FOB Mersin:</span>
                  <span className="text-base font-black font-mono text-emerald-700">${calculatedFOBPriceMT} / MT</span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-900">
                  <span>Navlun Katkısı (MT Başına):</span>
                  <span className="font-mono">${freightPerMT} / MT</span>
                </div>
                <div className="pt-2 border-t border-emerald-200/80 flex items-center justify-between text-sm font-bold text-emerald-950">
                  <span>Hesaplanan CIF Hedef Liman:</span>
                  <span className="text-lg font-black font-mono text-emerald-800">${calculatedCIFPriceMT} / MT</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Toplam {calcTonnage} MT Konteyner Proforma Değeri:</span>
                  <span className="font-mono font-bold text-slate-900">${calculatedTotalShipmentValue.toLocaleString()} USD</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsCalculatorOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                Tamam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Manual RFQ Modal */}
      {isNewRFQModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-950">
                    Yeni İhracat Talebi Kaydet
                  </h2>
                  <p className="text-xs text-slate-500">
                    Telefon, fuar veya WhatsApp üzerinden gelen kurumsal B2B talebi sisteme ekleyin.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsNewRFQModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewRFQ} className="py-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Şirket Ünvanı *</label>
                  <input
                    required
                    type="text"
                    value={newForm.companyName}
                    onChange={(e) => setNewForm({ ...newForm, companyName: e.target.value })}
                    placeholder="Örn: Hanseatic Grain GmbH"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Yetkili Kişi *</label>
                  <input
                    required
                    type="text"
                    value={newForm.contactPerson}
                    onChange={(e) => setNewForm({ ...newForm, contactPerson: e.target.value })}
                    placeholder="Örn: Hans Richter"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">E-Posta *</label>
                  <input
                    required
                    type="email"
                    value={newForm.email}
                    onChange={(e) => setNewForm({ ...newForm, email: e.target.value })}
                    placeholder="h.richter@firma.de"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Telefon / WhatsApp</label>
                  <input
                    type="text"
                    value={newForm.phone}
                    onChange={(e) => setNewForm({ ...newForm, phone: e.target.value, whatsapp: e.target.value })}
                    placeholder="+49 170 1234567"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">İstenen Ürün</label>
                  <select
                    value={newForm.product}
                    onChange={(e) => setNewForm({ ...newForm, product: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="chickpeas">Koçbaşı Nohut (9-10mm)</option>
                    <option value="red-lentils">Kırmızı Mercimek (Futbol/Yaprak)</option>
                    <option value="green-lentils">Yeşil Mercimek (Laird/Eston)</option>
                    <option value="white-beans">Kuru Fasulye (Dermason)</option>
                    <option value="dry-peas">Kuru Bezelye</option>
                    <option value="durum-wheat">Makarnalık Buğday & Bulgur</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Miktar (Tons)</label>
                  <input
                    type="number"
                    value={newForm.quantity}
                    onChange={(e) => setNewForm({ ...newForm, quantity: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hedef Ülke *</label>
                  <input
                    required
                    type="text"
                    value={newForm.destinationCountry}
                    onChange={(e) => setNewForm({ ...newForm, destinationCountry: e.target.value })}
                    placeholder="Almanya, BAE, İtalya..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Incoterm</label>
                  <select
                    value={newForm.incoterm}
                    onChange={(e) => setNewForm({ ...newForm, incoterm: e.target.value as RFQSubmission['incoterm'] })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="CIF">CIF (Cost, Insurance & Freight)</option>
                    <option value="FOB">FOB (Mersin Port / MIP)</option>
                    <option value="CFR">CFR (Cost & Freight)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Açıklama / Mesaj</label>
                <textarea
                  rows={2}
                  value={newForm.message}
                  onChange={(e) => setNewForm({ ...newForm, message: e.target.value })}
                  placeholder="Kalibre talebi, nem şartı veya ambalaj tercihi..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewRFQModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer shadow-xs"
                >
                  Talebi Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
