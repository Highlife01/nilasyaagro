import React from 'react';
import { Locale } from '@/types';
import { supportedLanguages } from '@/data/languages';
import { QualityTraceabilitySection } from '@/components/home/QualityTraceabilitySection';
import { ClientCalendarWrapper } from '../harvest-calendar/ClientCalendarWrapper';
import type { Metadata } from 'next';
import { ShieldCheck } from 'lucide-react';
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

  return pageMetadata(lang, 'quality', t.qualitySection.title, localizedPageDescription(lang, 'quality', t.qualitySection.title));
}

export default async function QualityPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;
  const pt = getPageTranslations(lang).qualityPage;

  return (
    <div className="pt-28 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
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

      <QualityTraceabilitySection lang={lang} />
      <ClientCalendarWrapper lang={lang} />
    </div>
  );
}
