import React from 'react';
import { Locale } from '@/types';
import { supportedLanguages } from '@/data/languages';
import { Mail, Phone, MapPin, Clock, MessageCircle, Sparkles, Building2, Landmark, ShieldCheck, CreditCard } from 'lucide-react';
import { ClientContactForm } from './ClientContactForm';
import type { Metadata } from 'next';
import { company } from '@/data/company';
import { getTranslations } from '@/data/translations';
import { localizedPageDescription } from '@/data/seo';
import { pageMetadata } from '@/lib/metadata';

import { getPageTranslations } from '@/data/pageTranslations';

export function generateStaticParams() {
  return supportedLanguages.map((l) => ({ lang: l.code }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;
  const t = getTranslations(lang);

  return pageMetadata(lang, 'contact', t.nav.contact, localizedPageDescription(lang, 'contact', t.nav.contact));
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;
  const pt = getPageTranslations(lang).contactPage;
  const isTr = lang === 'tr';

  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>{pt.tag}</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-950 tracking-tight leading-tight">
            {pt.title}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            {pt.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-emerald-950 text-white p-8 rounded-3xl shadow-xl space-y-6">
              <h2 className="text-2xl font-bold text-white">
                {pt.officeTitle}
              </h2>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">
                      {isTr ? 'Resmi Şirket Merkezi:' : 'Corporate Registered Headquarters:'}
                    </strong>
                    <span className="text-emerald-100">
                      {company.headquarters}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">
                      {isTr ? 'İşleme & İhracat Terminali:' : 'Milling & Port Export Terminal:'}
                    </strong>
                    <span className="text-emerald-100">
                      {company.exportTerminal}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <strong className="text-white block">{isTr ? 'Telefon:' : 'Phone:'}</strong>
                    <a href={`tel:${company.phoneE164}`} className="text-emerald-200 hover:text-white font-medium">
                      {company.phoneDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <strong className="text-white block">{isTr ? 'E-Posta:' : 'Email:'}</strong>
                    <a href={`mailto:${company.email}`} className="text-emerald-200 hover:text-white font-medium">
                      {company.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <strong className="text-white block">{isTr ? 'WhatsApp İhracat Hattı:' : 'WhatsApp Export Desk:'}</strong>
                    <a
                      href={`https://wa.me/${company.whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-300 hover:text-emerald-200 font-bold"
                    >
                      {company.phoneDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <strong className="text-white block">{isTr ? 'Çalışma Saatleri:' : 'Business Hours:'}</strong>
                    <span className="text-emerald-200">Pzt - Cuma: 08:30 - 18:30 (GMT+3)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Official Legal Entity Summary Card */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{isTr ? 'Hukuki Tüzel Kişilik Bilgisi' : 'Official Legal Entity Status'}</span>
              </div>
              <div className="text-xs text-slate-700 space-y-1.5 pt-1">
                <div><strong>{isTr ? 'Resmi Ticari Unvan:' : 'Registered Entity:'}</strong> {company.legalName}</div>
                <div><strong>{isTr ? 'İhracat Markası:' : 'Export Trade Brand:'}</strong> {company.brandName}</div>
                <div><strong>{isTr ? 'Vergi Dairesi:' : 'Tax Office:'}</strong> {company.taxOffice}</div>
                <div><strong>{isTr ? 'Yetki & Faaliyet:' : 'Scope:'}</strong> {isTr ? 'Bakliyat, Hububat, İhracat & Toptan Ticaret' : 'Pulses, Grains, Export & Global Wholesale Trade'}</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ClientContactForm lang={lang} />
          </div>
        </div>

        {/* Verified Bank Details & Wire Transfer Wire Instructions */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-emerald-900/40">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C5A059]">
                  <Landmark className="w-4 h-4" />
                  <span>{isTr ? 'RESMİ BANKA HESAP DETAYLARI' : 'OFFICIAL BANKING DETAILS FOR WIRE TRANSFERS'}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  {isTr ? 'Uluslararası T/T & Akreditif İhracat Hesabı' : 'Official Multi-Currency Export Trade Account'}
                </h3>
              </div>
              <span className="self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black tracking-wide">
                Türkiye Halk Bankası A.Ş.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
              <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10">
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {isTr ? 'Banka Adı' : 'Bank Name'}
                  </span>
                  <span className="font-bold text-base text-white">{company.bankDetails.bankName}</span>
                </div>
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {isTr ? 'Şube Kodu & Adı' : 'Branch Name & Code'}
                  </span>
                  <span className="font-semibold text-slate-200">{company.bankDetails.branchName}</span>
                </div>
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {isTr ? 'Hesap Numarası' : 'Account Number'}
                  </span>
                  <span className="font-mono font-bold text-slate-200 text-base">{company.bankDetails.accountNo}</span>
                </div>
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {isTr ? 'Hesap Para Birimleri' : 'Supported Currencies'}
                  </span>
                  <span className="font-semibold text-emerald-300">{company.bankDetails.currencies}</span>
                </div>
              </div>

              <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10">
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {isTr ? 'Hesap Sahibi (Resmi Tüzel Kişilik)' : 'Account Beneficiary Name (Legal Entity)'}
                  </span>
                  <span className="font-black text-sm text-[#C5A059] block mt-0.5 leading-snug">
                    {company.bankDetails.accountName}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    IBAN (International Bank Account Number)
                  </span>
                  <span className="font-mono font-black text-sm sm:text-base text-emerald-300 select-all block mt-0.5">
                    {company.bankDetails.iban}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    SWIFT / BIC Kodu
                  </span>
                  <span className="font-mono font-black text-base text-white tracking-widest">
                    {company.bankDetails.swiftCode}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-400/20 text-xs text-amber-200">
              <CreditCard className="w-5 h-5 text-amber-400 shrink-0" />
              <p>
                {isTr
                  ? 'Güvenlik Uyarısı: Proforma faturalarımızdaki şirket unvanı ile yukarıdaki banka hesap unvanı (NİLASYA GLOBAL TARIM İTH. İHR. LTD. ŞTİ.) birebir aynıdır. Şirketimiz adına üçüncü şahıs veya şahsi hesaplara ödeme talep edilmez.'
                  : 'Notice to International Buyers: All export proforma invoices are strictly matched to the official beneficiary title above. Nilasya Agro Foods never requests payments to third-party or personal accounts.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
