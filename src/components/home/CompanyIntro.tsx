'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Sparkles, Building2 } from 'lucide-react';
import { Locale } from '@/types';
import { getTranslations } from '@/data/translations';

export const CompanyIntro: React.FC<{ lang: Locale; isH1?: boolean }> = ({ lang, isH1 = false }) => {
  const t = getTranslations(lang).companyIntro;

  const pills = [t.pill1, t.pill2, t.pill3, t.pill4];

  return (
    <section className="py-20 lg:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Stack */}
          <div className="lg:col-span-6 relative">
            <div className="relative h-[420px] sm:h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/process/pulses-processing-factory-nilasya.jpg"
                alt="Pulses processing and sorting equipment"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-white/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900">
                      {t.tag}
                    </div>
                    <div className="text-xs text-slate-500">
                      Mersin Port Logistics Terminal & Anatolian Basins • Est. 2010
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Strategic Text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.tag} • {lang === 'tr' ? '2010’dan Bu Yana' : lang === 'ar' ? 'منذ عام 2010' : 'Since 2010'}</span>
            </div>

            {isH1 ? (
              <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
                {t.title}
              </h1>
            ) : (
              <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
                {t.title}
              </h2>
            )}

            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
              <p>{t.p1}</p>
              <p>{t.p2}</p>
            </div>

            {/* 4 Feature Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {pills.map((pill, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-bold text-slate-800"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{pill}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                href={`/${lang}/about/`}
                className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-800 hover:text-emerald-950 transition-colors"
              >
                <span>{t.learnMore}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
