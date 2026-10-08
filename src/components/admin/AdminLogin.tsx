'use client';

import React, { useState } from 'react';
import { Mail, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle, Globe, CheckCircle2, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { loginAdmin, AdminUser } from '@/lib/adminAuth';

interface AdminLoginProps {
  onSuccess: (user: AdminUser) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const result = await loginAdmin(email, password);
      setIsLoading(false);
      if (result.success && result.user) {
        onSuccess(result.user);
      } else {
        setErrorMsg(result.error || 'Giriş başarısız. Lütfen bilgilerinizi kontrol ediniz.');
      }
    } catch {
      setIsLoading(false);
      setErrorMsg('Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyiniz.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/50 to-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden text-slate-800">
      {/* Background Decorative Rings */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand Bar */}
      <div className="w-full max-w-md flex items-center justify-between mb-6 z-10">
        <Link 
          href="/tr/" 
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-colors bg-white/80 border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-xs backdrop-blur-md"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-600" />
          <span>Web Sitesine Dön</span>
        </Link>
        <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold bg-emerald-50/80 px-3 py-1 rounded-xl border border-emerald-200/60">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span>Güvenli Port 443 (SSL)</span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-200/50 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-lg shadow-emerald-600/20 mb-4">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            NILASYA AGRO FOODS
          </h1>
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mt-1">
            Süper Admin Yönetim Merkezi
          </p>
          <p className="text-xs text-slate-500 mt-2">
            İhracat talepleri, ürün stokları ve uluslararası bakliyat & tahıl lojistiği yönetim paneli.
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Yönetici E-Posta
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="cebrailkara@gmail.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Süper Admin Şifresi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-800 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <span>Beni Hatırla</span>
            </label>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">Root Super Admin</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Güvenli Giriş Yap</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Badges */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-around text-[11px] text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit TLS</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Root Yetkilendirme</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Denetim Kaydı</span>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="mt-8 text-center text-xs text-slate-500 z-10 font-medium">
        © {new Date().getFullYear()} Nilasya Agro Foods Tarım Dış Ticaret Ltd. — Tüm Hakları Saklıdır.
      </div>
    </div>
  );
};
