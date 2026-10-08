import React from 'react';
import { Locale } from '@/types';
import { supportedLanguages } from '@/data/languages';
import { CompanyIntro } from '@/components/home/CompanyIntro';
import { TrustStrip } from '@/components/home/TrustStrip';
import { ClientCalendarWrapper } from '../harvest-calendar/ClientCalendarWrapper';
import type { Metadata } from 'next';
import { ShieldCheck, HeartHandshake, Users } from 'lucide-react';
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
    title: t.nav.about,
    description: localizedSeoDescription(lang, t.nav.about),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;
  const pt = getPageTranslations(lang).about;

  return (
    <div className="pt-28 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 text-center mb-4">
          {pt.title}
        </h1>
        <p className="text-lg text-slate-600 text-center max-w-3xl mx-auto">
          {pt.subtitle}
        </p>
      </div>
      <CompanyIntro lang={lang} />
      <TrustStrip lang={lang} />

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
              {pt.valuesTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              {pt.valuesSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {pt.valQualityTitle}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {pt.valQualityDesc}
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {pt.valGrowerTitle}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {pt.valGrowerDesc}
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {pt.valExportTitle}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {pt.valExportDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      <ClientCalendarWrapper lang={lang} />
    </div>
  );
}
