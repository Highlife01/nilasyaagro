'use client';

import React, { useState } from 'react';
import { DollarSign, Download, RotateCcw, LogOut, CheckCircle2, Clock } from 'lucide-react';
import { 
  AdminUser, 
  getAuditLogs, 
  resetAllAdminData, 
  getStoredRFQs, 
  getStoredContainers, 
  getStoredProductStocks 
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
  const [resetSuccess, setResetSuccess] = useState(false);
  const auditLogs = getAuditLogs();

  const handleBackup = () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      superAdmin: user.email,
      rfqs: getStoredRFQs(),
      containers: getStoredContainers(),
      stocks: getStoredProductStocks(),
      auditLogs,
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backupData, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `nilasya_admin_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleReset = () => {
    if (confirm('Tüm teklif, konteyner ve stok verilerini başlangıç durumuna döndürmek istediğinize emin misiniz?')) {
      resetAllAdminData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
      onRefreshData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-950 tracking-tight">
          Süper Admin Profili & Sistem Yapılandırması
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Yönetici yetkileri, para birimi tercihleri, güvenlik denetim kayıtları ve sistem yedekleme merkezi.
        </p>
      </div>

      {resetSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Veriler başarıyla fabrika ayarlarına döndürüldü ve senkronize edildi.</span>
        </div>
      )}

      {/* Grid: Admin Profile Card & System Preferences */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Super Admin Identity Card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between shadow-xs">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/30 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-md shadow-emerald-600/20">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-xl font-black text-emerald-700">
                  {user.avatar || 'CK'}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-950 tracking-tight">{user.name}</h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    ROOT
                  </span>
                </div>
                <div className="text-xs text-slate-500">{user.title}</div>
                <div className="text-[11px] text-emerald-700 font-mono mt-0.5 font-semibold">{user.email}</div>
              </div>
            </div>

            <div className="space-y-2.5 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Yetki Rolü:</span>
                <span className="font-bold text-emerald-700">ROOT_SUPER_ADMIN</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Erişim Seviyesi:</span>
                <span className="font-semibold text-slate-900">Sınırsız (Full Access)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60 items-center">
                <span className="text-slate-500">Güvenlik Doğrulaması:</span>
                <span className="font-mono text-xs text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  SHA-256 Hash Korumalı
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Son Başarılı Giriş:</span>
                <span className="text-slate-700 text-[11px] font-medium">
                  {new Date(user.lastLoginAt).toLocaleString('tr-TR')}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={onLogout}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Güvenli Oturumu Kapat</span>
            </button>
          </div>
        </div>

        {/* Currency & Operational Settings */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-4">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Finansal & Para Birimi Tercihi</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Paneldeki toplam ciro, tahmini proforma değerleri ve ihracat teklifleri için varsayılan para birimini seçin.
            </p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { code: 'USD' as const, symbol: '$', label: 'ABD Doları' },
                { code: 'EUR' as const, symbol: '€', label: 'Euro (AB)' },
                { code: 'TRY' as const, symbol: '₺', label: 'Türk Lirası' },
              ].map((c) => (
                <button
                  key={c.code}
                  onClick={() => onCurrencyChange(c.code)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    currency === c.code
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-lg font-black">{c.symbol}</div>
                  <div className="text-xs font-bold mt-0.5">{c.code}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{c.label}</div>
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="text-xs font-bold text-slate-700">Yedekleme & Sıfırlama İşlemleri</div>
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={handleBackup}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
                >
                  <Download className="w-4 h-4 text-emerald-600" />
                  <span>Verileri Dışa Aktar (JSON Yedek)</span>
                </button>
                <button
                  onClick={handleReset}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Fabrika Ayarlarına Sıfırla</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 text-[11px] text-slate-400 text-center">
            Veriler tarayıcınızın güvenli depolama alanında tutulmaktadır.
          </div>
        </div>

        {/* Audit Log / Denetim Kayıtları */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Denetim Kayıtları (Audit Log)</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Son {auditLogs.length} İşlem</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Süper Admin oturum açma, teklif güncelleme ve sistem operasyonlarının tarihsel kaydı.
            </p>

            <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
              {auditLogs.length === 0 ? (
                <div className="text-xs text-slate-400 text-center py-8">Henüz kaydedilmiş işlem yok.</div>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-800">{log.action}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(log.timestamp).toLocaleTimeString('tr-TR')}
                      </span>
                    </div>
                    <div className="text-slate-700 text-[11px]">{log.details}</div>
                    <div className="text-[10px] text-slate-500 flex items-center justify-between pt-0.5">
                      <span>{log.user}</span>
                      <span className="font-mono">{log.ip}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-emerald-700 flex items-center justify-center gap-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Sistem Güvenlik Protokolü: 256-Bit SSL</span>
          </div>
        </div>
      </div>
    </div>
  );
};
