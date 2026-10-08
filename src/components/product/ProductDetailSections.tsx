'use client';

import React from 'react';
import Image from 'next/image';
import { Product, Locale } from '@/types';
import { Package, Truck, Ship, Plane, HelpCircle, Snowflake } from 'lucide-react';
import { packagingData } from '@/data/packaging';

import { getPageTranslations } from '@/data/pageTranslations';

interface ProductDetailSectionsProps {
  product: Product;
  lang: Locale;
}

export const ProductPackaging: React.FC<ProductDetailSectionsProps> = ({ product, lang }) => {
  const pt = getPageTranslations(lang).productDetail;

  return (
    <section className="space-y-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-10">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
        <Package className="h-4 w-4 text-emerald-600" />
        <span>{pt.packagingStandardsTitle}</span>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-black text-slate-900">
          {pt.standardFormatsTitle}
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {packagingData.map((pkg) => (
            <div key={pkg.id} className="space-y-2 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
              <h4 className="text-sm font-bold leading-snug text-slate-900">{lang === 'tr' ? pkg.name.tr : pkg.name.en}</h4>
              <p className="text-xs leading-relaxed text-slate-600">{lang === 'tr' ? pkg.material.tr : pkg.material.en}</p>
              <div className="text-[11px] font-semibold leading-relaxed text-emerald-800">
                {pt.suitableFor}{lang === 'tr' ? pkg.suitableFor.tr : pkg.suitableFor.en}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-100 pt-6">
        <h3 className="mb-4 text-lg font-black text-slate-900">
          {pt.technicalConfigurationsTitle}
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {product.packagingOptions.map((pkg, idx) => (
            <div key={idx} className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-5 flex flex-col justify-between">
              <div>
                {pkg.image && (
                  <div className="relative h-44 w-full rounded-xl overflow-hidden border border-slate-200 bg-white mb-3 shadow-inner group">
                    <Image
                      src={pkg.image}
                      alt={lang === 'tr' ? pkg.typeTr || pkg.type : pkg.type}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <span className="rounded-full bg-emerald-100/80 px-2.5 py-0.5 text-xs font-bold text-emerald-800">{pkg.netWeight}</span>
                <h4 className="text-sm font-bold leading-snug text-slate-900 mt-2">{lang === 'tr' ? pkg.typeTr : pkg.type}</h4>
              </div>
              <div className="space-y-1 border-t border-slate-200/60 pt-2 text-xs text-slate-600">
                <div><strong className="text-slate-700">{pt.dimensions}</strong> {pkg.dimensions}</div>
                {pkg.piecesPerBox && <div><strong className="text-slate-700">{pt.pieces}</strong> {pkg.piecesPerBox}</div>}
                <div><strong className="text-slate-700">{pt.pallet}</strong> {pkg.boxesPerPallet}</div>
                <div><strong className="text-slate-700">40ft FCL:</strong> {pkg.containerCapacity}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const ProductLogistics: React.FC<ProductDetailSectionsProps> = ({ product, lang }) => {
  const log = product.logistics;
  const pt = getPageTranslations(lang).productDetail;

  return (
    <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
        <Snowflake className="w-4 h-4 text-emerald-400" />
        <span>{pt.coldChainLogisticsTitle}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-2">
            <Truck className="w-4 h-4" />
            <span>{pt.transitTimeEU}</span>
          </div>
          <div className="text-sm font-bold text-white">{log.transitTimeEU}</div>
        </div>

        <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
          <div className="flex items-center gap-2 text-teal-400 text-xs font-bold mb-2">
            <Ship className="w-4 h-4" />
            <span>{pt.transitTimeGulf}</span>
          </div>
          <div className="text-sm font-bold text-white">{log.transitTimeGulf}</div>
        </div>

        <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-2">
            <Plane className="w-4 h-4" />
            <span>{pt.transitTimeAsia}</span>
          </div>
          <div className="text-sm font-bold text-white">{log.transitTimeAsia}</div>
        </div>
      </div>

      <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-xs text-slate-300">
        <strong className="text-emerald-300 block mb-1">
          {pt.transitProtocolTitle}
        </strong>
        {lang === 'tr' ? log.storageMethodTr : log.storageMethod}
      </div>
    </section>
  );
};

export const ProductFAQ: React.FC<ProductDetailSectionsProps> = ({ product, lang }) => {
  if (!product.faqs || product.faqs.length === 0) return null;
  const pt = getPageTranslations(lang).productDetail;

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200 space-y-6">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
        <HelpCircle className="w-4 h-4 text-emerald-600" />
        <span>{pt.faqTitle}</span>
      </div>

      <div className="space-y-4">
        {product.faqs.map((faq, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <h4 className="text-sm sm:text-base font-bold text-slate-900">
              {lang === 'tr' ? faq.questionTr : faq.question}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {lang === 'tr' ? faq.answerTr : faq.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
