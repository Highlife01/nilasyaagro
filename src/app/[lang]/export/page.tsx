import React from 'react';
import { Locale } from '@/types';
import { supportedLanguages } from '@/data/languages';
import { exportCountriesData } from '@/data/countries';
import { GlobalLogisticsSection } from '@/components/home/GlobalLogisticsSection';
import { ClientCalendarWrapper } from '../harvest-calendar/ClientCalendarWrapper';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Globe2, ArrowRight, Clock, MapPin, Sparkles } from 'lucide-react';
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
    title: t.nav.export,
    description: localizedSeoDescription(lang, t.nav.export),
  };
}

export default async function ExportPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;
  const pt = getPageTranslations(lang).exportPage;

  const regions = [
    'Europe / EU',
    'Middle East & Gulf',
    'CIS & Eastern Europe',
    'Asia & Pacific',
  ] as const;

  return (
    <div className="pt-24 bg-white min-h-screen">
      {/* Hero Banner */}
      <section className="relative py-16 lg:py-20 bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-widest mb-4">
            <Globe2 className="w-3.5 h-3.5 text-amber-400" />
            <span>{pt.tag}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            {pt.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-200 max-w-3xl mx-auto mt-4 font-normal leading-relaxed">
            {pt.subtitle}
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm text-center">
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">3-4 Days</div>
              <div className="text-xs text-emerald-300 font-bold">{pt.roadReefer}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm text-center">
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">10-14 Days</div>
              <div className="text-xs text-amber-300 font-bold">{pt.gulfSea}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm text-center">
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">18-22 Days</div>
              <div className="text-xs text-teal-300 font-bold">{pt.asiaSea}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm text-center">
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">24 Hours</div>
              <div className="text-xs text-rose-300 font-bold">{pt.expressAir}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Country Export Directory (Grid by Region) */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{pt.corridorDirTag}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950">
              {pt.corridorDirTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              {pt.corridorDirSubtitle}
            </p>
          </div>

          {regions.map((reg) => {
            const countriesInReg = exportCountriesData.filter((c) => c.region === reg);
            if (countriesInReg.length === 0) return null;

            return (
              <div key={reg} className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                    {reg}
                  </h3>
                  <span className="text-xs bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full font-mono font-bold">
                    {countriesInReg.length} {pt.markets}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {countriesInReg.map((country) => {
                    const countryName = country.name[lang] || country.name.native || country.name.en;
                    const countryOverview = country.overview[lang] || country.overview.en;
                    const transitInfo = country.transitTime.road || country.transitTime.sea || country.transitTime.air;

                    return (
                      <Link
                        key={country.id}
                        href={`/${lang}/export/${country.slug}/`}
                        className="group bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-500 transition-all duration-300 flex flex-col justify-between"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-3xl shadow-sm rounded-lg">{country.flag}</span>
                              <div>
                                <h4 className="text-base font-black text-slate-950 group-hover:text-emerald-700 transition-colors">
                                  {countryName}
                                </h4>
                                <span className="text-[11px] text-slate-500 font-medium">
                                  {country.name.native}
                                </span>
                              </div>
                            </div>
                            <span className="p-2 rounded-xl bg-slate-100 group-hover:bg-emerald-50 text-slate-600 group-hover:text-emerald-700 transition-colors">
                              <ArrowRight className="w-4 h-4" />
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {countryOverview}
                          </p>

                          <div className="space-y-2 bg-slate-50 p-3 rounded-2xl text-[11px] text-slate-700 border border-slate-100">
                            <div className="flex items-center gap-2">
                              <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="font-bold text-slate-900">{transitInfo}</span>
                            </div>
                            <div className="flex items-center gap-2 truncate">
                              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="truncate text-slate-600">{country.mainPorts}</span>
                            </div>
                          </div>

                          {/* Popular produce tags */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {country.popularProduce.slice(0, 3).map((prod, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 text-[10px] font-bold"
                              >
                                {prod}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 mt-4 text-xs font-black text-emerald-700 group-hover:text-emerald-800 flex items-center justify-between">
                          <span>{pt.viewCorridor}</span>
                          <span className="text-sm">→</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Multimodal Logistics Overview */}
      <GlobalLogisticsSection lang={lang} />

      {/* RFQ Wrapper */}
      <ClientCalendarWrapper lang={lang} />
    </div>
  );
}
