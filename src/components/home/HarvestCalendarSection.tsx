'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight, FileText, MapPin, Clock } from 'lucide-react';
import { Locale } from '@/types';
import { getTranslations } from '@/data/translations';
import { harvestCalendarData, monthsList } from '@/data/calendar';
import { productsData } from '@/data/products';

import { getPageTranslations } from '@/data/pageTranslations';

export const HarvestCalendarSection: React.FC<{ lang: Locale; onOpenQuoteWithProduct?: (id: string) => void }> = ({
  lang,
  onOpenQuoteWithProduct,
}) => {
  const t = getTranslations(lang).harvestCalendar;
  const pt = getPageTranslations(lang).calendarPage;
  const [selectedProduceFilter, setSelectedProduceFilter] = useState('all');

  const filteredProduce =
    selectedProduceFilter === 'all'
      ? productsData
      : productsData.filter((p) => p.id === selectedProduceFilter);

  const getProductHref = (slugObj: Record<string, string>, id: string) => {
    const slug = slugObj[lang] || slugObj.en || id;
    return `/${lang}/products/${slug}/`;
  };

  const getProduceColorBadge = (id: string) => {
    switch (id) {
      case 'chickpeas':
        return 'bg-amber-500/10 text-amber-800 border-amber-300';
      case 'red-lentils':
        return 'bg-rose-500/10 text-rose-800 border-rose-300';
      case 'green-lentils':
        return 'bg-emerald-500/10 text-emerald-800 border-emerald-300';
      case 'white-beans':
        return 'bg-slate-200/80 text-slate-800 border-slate-300';
      case 'durum-wheat-bulgur':
        return 'bg-yellow-500/10 text-yellow-800 border-yellow-300';
      case 'dry-peas':
        return 'bg-teal-500/10 text-teal-800 border-teal-300';
      case 'pasta-macaroni':
        return 'bg-orange-500/10 text-orange-800 border-orange-300';
      default:
        return 'bg-emerald-50 text-emerald-900 border-emerald-200';
    }
  };

  return (
    <section id="calendar" className="py-16 lg:py-24 bg-gradient-to-b from-slate-50 via-emerald-50/20 to-white text-slate-900 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-black uppercase tracking-widest shadow-sm">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>{t.tag}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            {t.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* High-Contrast Interactive Filter Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
          <button
            type="button"
            onClick={() => setSelectedProduceFilter('all')}
            className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${
              selectedProduceFilter === 'all'
                ? 'bg-slate-950 text-white shadow-lg shadow-slate-950/20 scale-105'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {pt.allProduce}
          </button>
          {productsData.map((p) => {
            const isSelected = selectedProduceFilter === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedProduceFilter(p.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-105 font-black'
                    : 'bg-white text-slate-800 hover:bg-emerald-50 hover:border-emerald-300 border-slate-200'
                }`}
              >
                <span>{p.name[lang] || p.name.en}</span>
              </button>
            );
          })}
        </div>

        {/* High-Contrast Color Legend Box */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm max-w-2xl mx-auto mb-8 flex items-center justify-center gap-6 sm:gap-10 text-xs font-black flex-wrap">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-black text-[11px] shadow-sm shadow-emerald-500/40">
              H
            </span>
            <div className="leading-tight">
              <span className="text-slate-900 block">{t.legendHarvest}</span>
              <span className="text-[10px] text-slate-500 font-medium">{pt.fieldHarvest}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black text-[10px] shadow-sm shadow-amber-400/40">
              CA
            </span>
            <div className="leading-tight">
              <span className="text-slate-900 block">{t.legendStorage}</span>
              <span className="text-[10px] text-slate-500 font-medium">{pt.controlledAtmosphere}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-slate-200 border border-slate-300" />
            <div className="leading-tight">
              <span className="text-slate-600 block">{t.legendNone}</span>
              <span className="text-[10px] text-slate-400 font-medium">{pt.offSeason}</span>
            </div>
          </div>
        </div>

        {/* Main Clean Light Table */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-900/5 overflow-hidden mb-12">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <caption className="sr-only">{t.tableSummary}</caption>
              <thead>
                <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-800 text-xs font-black uppercase tracking-wider">
                  <th scope="col" className="py-4 px-4 sm:px-6 w-56 sticky left-0 bg-slate-100/95 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                    {pt.exportProduce}
                  </th>
                  {monthsList.map((m) => (
                    <th key={m.id} scope="col" className="py-4 px-2 text-center font-black text-slate-900">
                      <span className="block text-[10px] text-slate-400 font-mono font-bold">0{m.id}</span>
                      <span className="text-xs font-black text-slate-800">{lang === 'tr' ? m.tr : m.en}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                {filteredProduce.map((product) => {
                  const cal = harvestCalendarData.find((c) => c.id === product.id);
                  const prodName = product.name[lang] || product.name.en;
                  const prodOrigins = lang === 'tr' ? product.origins.tr.join(', ') : product.origins.en.join(', ');

                  return (
                    <tr key={product.id} className="hover:bg-emerald-50/40 transition-colors group">
                      {/* Product Header sticky column */}
                      <th
                        scope="row"
                        className="py-4 px-4 sm:px-6 font-bold text-slate-900 sticky left-0 bg-white group-hover:bg-emerald-50/40 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]"
                      >
                        <Link
                          href={getProductHref(product.slug, product.id)}
                          className="flex items-center gap-3 group/link"
                        >
                          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                            <Image
                              src={product.heroImage}
                              alt={prodName}
                              fill
                              className="object-cover group-hover/link:scale-110 transition-transform"
                            />
                          </div>
                          <div>
                            <span className="text-sm font-black text-slate-950 group-hover/link:text-emerald-700 transition-colors block">
                              {prodName}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium block truncate max-w-[140px]">
                              {prodOrigins}
                            </span>
                          </div>
                        </Link>
                      </th>

                      {/* 12 Months Grid */}
                      {monthsList.map((m) => {
                        const status = cal ? cal.months[m.id] : 'none';
                        return (
                          <td key={m.id} className="py-4 px-1 text-center">
                            {status === 'harvest' && (
                              <div className="flex items-center justify-center">
                                <span
                                  className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white font-black text-xs flex items-center justify-center shadow-md shadow-emerald-500/30 transition-transform hover:scale-110 cursor-help"
                                  title={`${prodName} — ${lang === 'tr' ? 'Tarlada Yeni Mahsul Hasat Dönemi' : 'Direct Field Harvest (New Crop)'}`}
                                >
                                  H
                                </span>
                              </div>
                            )}
                            {status === 'storage' && (
                              <div className="flex items-center justify-center">
                                <span
                                  className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-md shadow-amber-400/30 transition-transform hover:scale-110 cursor-help"
                                  title={`${prodName} — ${lang === 'tr' ? 'İklim Kontrollü Çelik Silo & Depolardan Yıl Boyu Kesintisiz Tedarik' : 'Climate-Controlled Silo Storage & Year-Round Supply'}`}
                                >
                                  CA
                                </span>
                              </div>
                            )}
                            {status === 'none' && (
                              <div className="flex items-center justify-center">
                                <span className="w-2 h-2 rounded-full bg-slate-200" />
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed High-Contrast Cards for Each Produce */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProduce.map((product) => {
            const prodName = product.name[lang] || product.name.en;
            const seasonText = product.seasonMonthsText[lang] || product.seasonMonthsText.en;
            const origins = lang === 'tr' ? product.origins.tr.join(', ') : product.origins.en.join(', ');

            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        <Image
                          src={product.heroImage}
                          alt={prodName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-950">
                          {prodName}
                        </h3>
                        <span className="text-[11px] text-slate-500 font-mono italic">
                          {product.scientificName}
                        </span>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase border ${getProduceColorBadge(product.id)}`}>
                      {product.specifications.class}
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 block font-bold">{pt.harvestAndSupply}</strong>
                        <span className="text-slate-600">{seasonText}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 block font-bold">{pt.growingBasins}</strong>
                        <span className="text-slate-600">{origins}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 flex items-center gap-3">
                  <Link
                    href={getProductHref(product.slug, product.id)}
                    className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl text-center transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>{pt.specs}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => onOpenQuoteWithProduct?.(product.id)}
                    className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 transition-colors"
                    title={pt.requestPrice}
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
