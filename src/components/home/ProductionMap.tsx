'use client';

import React, { useState } from 'react';
import { MapPin, Sun, Calendar, CheckCircle2, Sparkles } from 'lucide-react';
import { Locale } from '@/types';
import { getTranslations } from '@/data/translations';
import { productionRegions } from '@/data/regions';

export const ProductionMap: React.FC<{ lang: Locale }> = ({ lang }) => {
  const t = getTranslations(lang).productionMap;
  const [selectedRegionId, setSelectedRegionId] = useState(productionRegions[0].id);

  const selectedRegion =
    productionRegions.find((r) => r.id === selectedRegionId) || productionRegions[0];

  return (
    <section className="py-20 lg:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t.tag}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            {t.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Region Selector Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {productionRegions.map((region) => {
            const isSelected = region.id === selectedRegionId;
            return (
              <button
                key={region.id}
                type="button"
                onClick={() => setSelectedRegionId(region.id)}
                className={`px-5 py-3 rounded-2xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-slate-950 text-white shadow-xl scale-105'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{lang === 'tr' ? region.name.tr : region.name.en}</span>
              </button>
            );
          })}
        </div>

        {/* Active Region Interactive Card */}
        <div className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest font-mono">
                  {selectedRegion.location}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  {lang === 'tr' ? selectedRegion.name.tr : selectedRegion.name.en}
                </h3>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <Sun className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">{t.climate}:</strong>
                    <span className="text-slate-600">
                      {lang === 'tr' ? selectedRegion.climate.tr : selectedRegion.climate.en}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">{lang === 'tr' ? 'Hasat & Tedarik Dönemi:' : 'Peak Harvest Period:'}</strong>
                    <span className="text-slate-600">
                      {lang === 'tr' ? selectedRegion.peakMonths.tr : selectedRegion.peakMonths.en}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  {t.mainProduce}:
                </span>
                <div className="flex flex-wrap gap-2">
                  {(lang === 'tr' ? selectedRegion.productsTr : selectedRegion.products).map(
                    (p, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-sm"
                      >
                        {p}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>{t.advantages}</span>
              </h4>

              <div className="space-y-3">
                {(lang === 'tr' ? selectedRegion.advantages.tr : selectedRegion.advantages.en).map(
                  (adv, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{adv}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
