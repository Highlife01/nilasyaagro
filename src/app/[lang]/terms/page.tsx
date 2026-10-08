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
    title: t.footer.terms,
    description: localizedSeoDescription(lang, t.footer.terms),
  };
}

export default async function TermsPage({
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
          {lang === 'tr' ? 'Kullanım Koşulları' : 'Terms of Use'}
        </h1>
        <p className="text-xs text-slate-400">Last updated: August 2026</p>

        <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 space-y-4">
          <p>
            {lang === 'tr'
              ? 'www.nilasyaagrofoods.com.tr web sitesini kullanarak aşağıdaki genel kullanım ve ticari bilgi şartlarını kabul etmiş sayılırsınız.'
              : 'By accessing and utilizing www.nilasyaagrofoods.com.tr, you acknowledge and agree to the following commercial terms and conditions.'}
          </p>

          <h3 className="text-base font-bold text-slate-900">
            {lang === 'tr' ? '1. Fikri Mülkiyet ve İçerik Hakları' : '1. Intellectual Property & Trademarks'}
          </h3>
          <p>
            {lang === 'tr'
              ? 'Sitede yer alan tüm metinler, görseller, teknik şartnameler ve marka logoları Nilasya Agro Foods\'a aittir ve izinsiz kopyalanamaz.'
              : 'All trademarks, logos, photography, technical specifications, and proprietary content displayed on this website are the intellectual property of Nilasya Agro Foods.'}
          </p>

          <h3 className="text-base font-bold text-slate-900">
            {lang === 'tr' ? '2. Teklif ve Fiyatlandırma' : '2. B2B Proformas & Quotations'}
          </h3>
          <p>
            {lang === 'tr'
              ? 'Web sitemizdeki ürün açıklamaları ve kalibre bilgileri tanıtım amaçlıdır. Nihai ticari şartlar, resmi proforma fatura ve satış sözleşmesinde belirlenir.'
              : 'Product specifications and harvest indications on this platform serve informational purposes. Binding commercial commitments are formalized exclusively through signed sales contracts and proforma invoices.'}
          </p>
        </div>
      </div>
    </div>
  );
}
