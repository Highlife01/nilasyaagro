import React from 'react';
import { Locale } from '@/types';
import { supportedLanguages } from '@/data/languages';
import { HarvestCalendarSection } from '@/components/home/HarvestCalendarSection';
import { ClientCalendarWrapper } from './ClientCalendarWrapper';
import type { Metadata } from 'next';
import { Calendar, Snowflake, ShieldCheck, Sun } from 'lucide-react';
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
    title: t.harvestCalendar.title,
    description: localizedSeoDescription(lang, t.harvestCalendar.title),
  };
}

export default async function HarvestCalendarPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;
  const pt = getPageTranslations(lang).calendarPage;

  return (
    <div className="pt-24 bg-white min-h-screen">
      {/* Luminous High-Contrast Hero Banner */}
      <section className="relative py-14 lg:py-18 bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-widest mb-4">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>{pt.tag}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            {pt.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-200 max-w-3xl mx-auto mt-4 font-normal leading-relaxed">
            {pt.subtitle}
          </p>

          {/* Quick Value Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 max-w-3xl mx-auto text-left">
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-white block">{pt.peakHarvest}</span>
                <span className="text-[11px] text-slate-300">{pt.peakHarvestDesc}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Snowflake className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-white block">{pt.caStorage}</span>
                <span className="text-[11px] text-slate-300">{pt.caStorageDesc}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-white block">{pt.traceability}</span>
                <span className="text-[11px] text-slate-300">{pt.traceabilityDesc}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Light Harvest Calendar Section */}
      <HarvestCalendarSection lang={lang} />

      {/* RFQ Call to Action Wrapper */}
      <ClientCalendarWrapper lang={lang} />
    </div>
  );
}
