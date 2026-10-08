import React from 'react';
import { Locale } from '@/types';
import { supportedLanguages } from '@/data/languages';
import { PackagingShowcase } from '@/components/home/PackagingShowcase';
import { packagingData } from '@/data/packaging';
import { ClientCalendarWrapper } from '../harvest-calendar/ClientCalendarWrapper';
import type { Metadata } from 'next';
import { Package } from 'lucide-react';
import { getTranslations } from '@/data/translations';
import { localizedSeoDescription } from '@/data/seo';

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

  return {
    title: t.packagingSection.title,
    description: localizedSeoDescription(lang, t.packagingSection.title),
  };
}

export default async function PackagingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;
  const pt = getPageTranslations(lang).packagingPage;

  return (
    <div className="pt-28 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-widest">
            <Package className="w-3.5 h-3.5 text-emerald-700" />
            <span>{pt.tag}</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-950 tracking-tight leading-tight">
            {pt.title}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            {pt.subtitle}
          </p>
        </div>
      </div>

      <PackagingShowcase lang={lang} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">
            {pt.palletSpecsTitle}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {packagingData.map((pkg) => (
              <div key={pkg.id} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold text-slate-900">
                    {lang === 'tr' ? pkg.name.tr : pkg.name.en}
                  </h4>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                    {pkg.netWeightRange}
                  </span>
                </div>

                <p className="text-xs text-slate-600">
                  <strong className="text-slate-800">{pt.suitableFor}</strong> {lang === 'tr' ? pkg.suitableFor.tr : pkg.suitableFor.en}
                </p>

                <div className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-200">
                  <div><strong>{pt.material}</strong> {lang === 'tr' ? pkg.material.tr : pkg.material.en}</div>
                  <div><strong>Euro Pallet (80x120):</strong> {pkg.palletConfigEuro}</div>
                  <div><strong>Standard Pallet (100x120):</strong> {pkg.palletConfigStandard}</div>
                  <div><strong>40ft High Cube Reefer:</strong> {pkg.containerReefer40FCL}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ClientCalendarWrapper lang={lang} />
    </div>
  );
}
