import React from 'react';
import { Locale } from '@/types';
import { supportedLanguages } from '@/data/languages';
import type { Metadata } from 'next';
import { getTranslations } from '@/data/translations';
import { localizedSeoDescription } from '@/data/seo';

export function generateStaticParams() {
  return supportedLanguages.map((l) => ({ lang: l.code }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = (await params).lang;
  const t = getTranslations(lang);
  return {
    title: t.footer.privacy,
    description: localizedSeoDescription(lang, t.footer.privacy),
  };
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;

  return (
    <div className="pt-32 pb-20 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950">
          {lang === 'tr' ? 'Gizlilik Politikası ve KVKK / GDPR Aydınlatma Metni' : 'Privacy Policy & GDPR Compliance'}
        </h1>
        <p className="text-xs text-slate-400">Last updated: August 2026</p>

        <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 space-y-4">
          <p>
            {lang === 'tr'
              ? 'Nilasya Agro Foods Tarım Dış Ticaret Ltd. olarak, iş ortaklarımızın ve web sitemizi ziyaret eden kullanıcıların kişisel verilerinin korunmasına büyük önem veriyoruz.'
              : 'Nilasya Agro Foods is committed to respecting and protecting the personal data and commercial privacy of our website visitors, customers, and global partners.'}
          </p>

          <h3 className="text-base font-bold text-slate-900">
            {lang === 'tr' ? '1. Toplanan Veriler ve Kullanım Amacı' : '1. Collected Information & Purpose'}
          </h3>
          <p>
            {lang === 'tr'
              ? 'Teklif (RFQ) ve iletişim formlarımız aracılığıyla iletilen ad, soyad, firma unvanı, e-posta, telefon ve sevkiyat talepleri, yalnızca resmi ihracat tekliflerinin hazırlanması ve ticari iletişimin yürütülmesi amacıyla işlenir.'
              : 'Information submitted through our RFQ and contact forms (name, company name, email, phone number, destination port, shipment specifications) is processed solely for preparing formal export quotations and conducting legitimate B2B commercial communication.'}
          </p>

          <h3 className="text-base font-bold text-slate-900">
            {lang === 'tr' ? '2. Veri Güvenliği ve Saklama' : '2. Data Security & Retention'}
          </h3>
          <p>
            {lang === 'tr'
              ? 'Verileriniz üçüncü taraflarla ticari veya pazarlama amacıyla paylaşılmaz. İletilen bilgiler SSL şifreleme ve güvenli sunucu altyapısıyla korunmaktadır.'
              : 'We do not sell, rent, or distribute your data to third-party marketing brokers. All form submissions are transmitted via encrypted HTTPS and secured databases.'}
          </p>
        </div>
      </div>
    </div>
  );
}
