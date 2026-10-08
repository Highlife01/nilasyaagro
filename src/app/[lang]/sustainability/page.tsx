import React from 'react';
import { Locale } from '@/types';
import { supportedLanguages } from '@/data/languages';
import { ClientCalendarWrapper } from '../harvest-calendar/ClientCalendarWrapper';
import type { Metadata } from 'next';
import { Leaf, Droplets, Sun, Recycle } from 'lucide-react';
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

  return pageMetadata(lang, 'sustainability', t.nav.sustainability, localizedPageDescription(lang, 'sustainability', t.nav.sustainability));
}

export default async function SustainabilityPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;
  const pt = getPageTranslations(lang).sustainabilityPage;

  const pillars = [
    {
      icon: Droplets,
      title: pt.pillar1Title,
      desc: pt.pillar1Desc,
    },
    {
      icon: Sun,
      title: pt.pillar2Title,
      desc: pt.pillar2Desc,
    },
    {
      icon: Recycle,
      title: pt.pillar3Title,
      desc: pt.pillar3Desc,
    },
    {
      icon: Leaf,
      title: pt.pillar4Title,
      desc: pt.pillar4Desc,
    },
  ];

  return (
    <div className="pt-28 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-widest">
            <Leaf className="w-3.5 h-3.5 text-emerald-700" />
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div key={idx} className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{p.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <ClientCalendarWrapper lang={lang} />
    </div>
  );
}
