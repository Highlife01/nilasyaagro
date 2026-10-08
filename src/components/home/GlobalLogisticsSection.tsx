'use client';

import React from 'react';
import Image from 'next/image';
import { Truck, Ship, Plane } from 'lucide-react';
import { Locale } from '@/types';
import { getTranslations } from '@/data/translations';

export const GlobalLogisticsSection: React.FC<{ lang: Locale }> = ({ lang }) => {
  const t = getTranslations(lang).logisticsSection;

  return (
    <section className="py-20 lg:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold uppercase tracking-widest">
            <Truck className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t.tag}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            {t.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* 3 Modes of Export Transport */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4 hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t.road.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t.road.desc}</p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4 hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <Ship className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t.sea.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t.sea.desc}</p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4 hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Plane className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t.air.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t.air.desc}</p>
          </div>
        </div>

        {/* Seaport Logistics & Container Loading Banner */}
        <div className="bg-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
                <Ship className="w-4 h-4" />
                <span>{t.coldChainTitle}</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                {t.coldChainDesc}
              </h3>
            </div>

            <div className="lg:col-span-5 relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-lg border border-white/10">
              <Image
                src="/images/process/pulses-export-warehouse-nilasya.jpg"
                alt="Container stuffing, Big Bags palletizing and seaport warehouse logistics at Mersin Port - Nilasya Agro Foods"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
