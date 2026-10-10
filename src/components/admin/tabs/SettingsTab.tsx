'use client';

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Download, 
  RotateCcw, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink, 
  Search, 
  Activity,
  FileCheck
} from 'lucide-react';
import { 
  AdminUser, 
  AdminAuditLog,
  getAuditLogs, 
  getStoredRFQs, 
  getStoredContainers, 
  getStoredProductStocks,
  resetAllAdminData
} from '@/lib/adminAuth';

interface SettingsTabProps {
  user: AdminUser;
  currency: 'USD' | 'EUR' | 'TRY';
  onCurrencyChange: (c: 'USD' | 'EUR' | 'TRY') => void;
  onLogout: () => void;
  onRefreshData: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  user,
  currency,
  onCurrencyChange,
  onLogout,
  onRefreshData,
}) => {
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [logSearch, setLogSearch] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    let mounted = true;
    getAuditLogs()
      .then((logs) => { if (mounted) setAuditLogs(logs); })
      .catch((err) => { console.error('Failed to load audit logs:', err); });
    return () => { mounted = false; };
  }, [onRefreshData]);

  const handleBackup = async () => {
    setIsBackingUp(true);
    try {
      const [rfqs, containers, stocks, logs] = await Promise.all([
        getStoredRFQs(),
        getStoredContainers(),
        getStoredProductStocks(),
        getAuditLogs().catch(() => auditLogs),
      ]);
      const backupData = {
        company: 'Nilasya Agro Foods',
        legalName: 'Nilasya Global Tarım İthalat ve İhracat Ltd. Şti.',
        exportDate: new Date().toISOString(),
        superAdmin: user.email,
        rfqs,
        containers,
        stocks,
        auditLogs: logs,
      };
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backupData, null, 2))}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      downloadAnchor.setAttribute('download', `nilasya_admin_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      setActionSuccess('Tüm ihracat verileri ve denetim kayıtları JSON olarak başarıyla indirildi.');
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      alert('Yedekleme verileri alınırken bir hata oluştu: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleResetData = () => {
    if (confirm('Tüm teklif, konteyner ve hasat verilerini standart fabrika ayarlarına ve güncel tohum veritabanına döndürmek istediğinize emin misiniz?')) {
      resetAllAdminData();
      onRefreshData();
      setActionSuccess('Tüm operasyonel veriler fabrika ayarlarına ve güncel tohum verilerine döndürüldü.');
      setTimeout(() => setActionSuccess(''), 4000);
    }
  };

  const filteredLogs = auditLogs.filter((log) => {
    const term = logSearch.toLowerCase();
    return (
      (log.action || '').toLowerCase().includes(term) ||
      (log.details || '').toLowerCase().includes(term) ||
      (log.user || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-950 tracking-tight">
          Süper Admin Profili & Sistem Yapılandırması
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Yönetici yetkileri, para birimi tercihleri, Google Analytics 4 entegrasyonu ve güvenlik denetim kayıtları.
        </p>
      </div>

      {actionSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Grid: Admin Profile Card, Preferences, and GA4 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Super Admin Identity Card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between shadow-xs">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/30 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-md shadow-emerald-600/20">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-xl font-black text-emerald-700">
                  {user.avatar || 'AB'}
                </div>
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider mb-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-700" />
                  <span>Root Super Admin</span>
                </div>
                <h2 className="text-lg font-black text-slate-950 leading-tight">
                  {user.name || 'Abdullah Başaranoğlu'}
                </h2>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  {user.email}
                </div>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between">
                <span>Görevi / Ünvanı:</span>
                <span className="font-bold text-slate-900">{user.title || 'Firma Sahibi & Genel Müdür'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Şirket:</span>
                <span className="font-medium text-slate-800">Nilasya Global Tarım Ltd. Şti.</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Yetki Seviyesi:</span>
                <span className="font-bold text-emerald-700">Tam Erişim (Root)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Son Güvenli Giriş:</span>
                <span className="font-mono text-slate-500">
                  {new Date(user.lastLoginAt).toLocaleString('tr-TR')}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100">
            <button
              onClick={onLogout}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Yönetici Oturumunu Kapat</span>
            </button>
          </div>
        </div>

        {/* System & Currency Preferences */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between shadow-xs">
          <div>
            <h2 className="text-base font-bold text-slate-950 mb-1">
              Operasyonel Tercihler
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Dashboard genelinde geçerli varsayılan para birimi ve veri dışa aktarma seçenekleri.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Varsayılan Gösterge Para Birimi
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['USD', 'EUR', 'TRY'] as const).map((curr) => (
                    <button
                      key={curr}
                      onClick={() => onCurrencyChange(curr)}
                      className={`py-3 px-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        currency === curr
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-xs ring-1 ring-emerald-500'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className="text-sm">
                        {curr === 'USD' ? '$' : curr === 'EUR' ? '€' : '₺'}
                      </span>
                      <span>{curr}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Veri Yedekleme ve Sıfırlama
                </label>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleBackup}
                    disabled={isBackingUp}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 disabled:opacity-50 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Download className="w-4 h-4 text-emerald-600" />
                    <span>{isBackingUp ? 'Yedekleme Hazırlanıyor...' : 'Tüm Verileri Dışa Aktar (JSON)'}</span>
                  </button>
                  <button
                    onClick={handleResetData}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
                  >
                    <RotateCcw className="w-4 h-4 text-slate-400" />
                    <span>Tohum Veritabanını Yeniden Yükle</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mersin MIP Limanı operasyon verileri senkronize.</span>
          </div>
        </div>

        {/* Google Analytics 4 & AI Visibility Card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-bold text-slate-950">
                Google Analytics 4 & SEO
              </h2>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            </div>
            <p className="text-xs text-slate-500 mb-5">
              Canlı ölçümleme kimliği ve küresel B2B alıcı trafiği telemetrisi.
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <div className="text-[10px] uppercase font-bold text-emerald-800">Aktif GA4 Ölçüm Kimliği</div>
                <div className="text-base font-mono font-black text-emerald-950">
                  G-ST5MWN0FR3
                </div>
                <div className="text-[11px] text-emerald-700">
                  30 dildeki 2.220 sayfanın tümünde aktif olarak veri topluyor.
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Sitemap Kapsamı:</span>
                  <span className="font-bold text-slate-900 font-mono">2.220 / 2.220 URL</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Hreflang Çapraz Etiketleri:</span>
                  <span className="font-bold text-slate-900 font-mono">68.820 Bağlantı</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>LLM AI İndeksi:</span>
                  <span className="font-bold text-emerald-700">llms.txt Aktif</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Schema.org B2B Varlıkları:</span>
                  <span className="font-bold text-emerald-700">Doğrulandı</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <a
              href="https://analytics.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <span>Google Analytics Konsolunu Aç</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Security Audit Logs Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-950 tracking-tight">
              Sistem Güvenlik & Denetim Günlüğü (Audit Log)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Yönetici oturumları, RFQ teklif güncellemeleri ve lojistik telemetri değişikliklerinin zaman damgalı kayıtları.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={logSearch}
              onChange={(e) => setLogSearch(e.target.value)}
              placeholder="İşlem veya kullanıcı ara..."
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Tarih & Saat</th>
                <th className="py-3 px-4">İşlem Türü</th>
                <th className="py-3 px-4">Kullanıcı</th>
                <th className="py-3 px-4">Detay & Kayıt</th>
                <th className="py-3 px-4 text-right">Erişim Noktası</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Arama kriterinize uygun kayıt bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('tr-TR')}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 text-emerald-800 font-semibold">
                      {log.user}
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                      {log.details}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-400 text-[11px]">
                      {log.ip}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
