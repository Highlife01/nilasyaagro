'use client';

import React from 'react';
import { 
  Sprout, 
  Hand, 
  FlaskConical, 
  ScanLine, 
  PackageCheck, 
  Warehouse, 
  Ship, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Locale } from '@/types';
import { getTranslations } from '@/data/translations';

export const FarmToWorldFlow: React.FC<{ lang: Locale }> = ({ lang }) => {
  const t = getTranslations(lang).farmToWorld;

  const stepIcons = [
    Sprout,
    Hand,
    FlaskConical,
    ScanLine,
    PackageCheck,
    Warehouse,
    Ship,
    CheckCircle2,
  ];

  const stepColors = [
    'from-emerald-500 to-green-600',
    'from-lime-500 to-emerald-600',
    'from-teal-500 to-emerald-600',
    'from-cyan-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-sky-500 to-blue-600',
    'from-indigo-500 to-purple-600',
    'from-emerald-600 to-teal-700',
  ];

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-white via-slate-50 to-white text-slate-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-black uppercase tracking-widest shadow-sm">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{t.tag}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            {t.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.steps.map((step, idx) => {
            const Icon = stepIcons[idx] || CheckCircle2;
            const gradient = stepColors[idx % stepColors.length];

            return (
              <div
                key={idx}
                className="group relative p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-400 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="font-mono text-2xl font-black text-slate-300 group-hover:text-emerald-600 transition-colors">
                    {step.num}
                  </span>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center shadow-md transition-transform group-hover:scale-110`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-black text-slate-950 group-hover:text-emerald-700 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400 group-hover:text-emerald-600 transition-colors">
                  <span>{lang === 'tr' ? 'Adım' : 'Step'} 0{idx + 1}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
