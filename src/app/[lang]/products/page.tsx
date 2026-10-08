import React from 'react';
import { Locale } from '@/types';
import { supportedLanguages } from '@/data/languages';
import { ProductGrid } from '@/components/home/ProductGrid';
import { HarvestCalendarSection } from '@/components/home/HarvestCalendarSection';
import { ClientProductsWrapper } from './ClientProductsWrapper';
import type { Metadata } from 'next';
import { Sparkles } from 'lucide-react';
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
    title: t.productsSection.titleMain,
    description: localizedSeoDescription(lang, `${t.productsSection.titleMain}: ${t.hero.productsList}`),
  };
}

export default async function ProductsCatalogPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;
  const pt = getPageTranslations(lang).productsPage;

  return (
    <div className="pt-24 bg-white min-h-screen">
      {/* Fresh Vibrant Hero Header Banner */}
      <section className="relative py-16 lg:py-20 bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{pt.tag}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            {pt.title}
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto mt-4 font-normal leading-relaxed">
            {pt.subtitle}
          </p>

          {/* 6 Fresh Produce Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8 max-w-3xl mx-auto">
            <span className="px-4 py-2 rounded-2xl bg-rose-600/90 text-white text-xs font-black shadow-md">
              {pt.pills.pomegranate}
            </span>
            <span className="px-4 py-2 rounded-2xl bg-red-600/90 text-white text-xs font-black shadow-md">
              {pt.pills.apples}
            </span>
            <span className="px-4 py-2 rounded-2xl bg-purple-600/90 text-white text-xs font-black shadow-md">
              {pt.pills.grapes}
            </span>
            <span className="px-4 py-2 rounded-2xl bg-lime-600/90 text-white text-xs font-black shadow-md">
              {pt.pills.kiwi}
            </span>
            <span className="px-4 py-2 rounded-2xl bg-amber-600/90 text-white text-xs font-black shadow-md">
              {pt.pills.citrus}
            </span>
            <span className="px-4 py-2 rounded-2xl bg-emerald-600/90 text-white text-xs font-black shadow-md">
              {pt.pills.tomatoes}
            </span>
          </div>
        </div>
      </section>

      {/* Main Products Grid */}
      <ProductGrid lang={lang} />

      {/* Harvest Calendar */}
      <HarvestCalendarSection lang={lang} />

      {/* RFQ & Final Section */}
      <ClientProductsWrapper lang={lang} />
    </div>
  );
}
