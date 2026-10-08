'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product, Locale } from '@/types';
import { Sparkles, ArrowRight } from 'lucide-react';

import { getPageTranslations } from '@/data/pageTranslations';

interface ProductVarietiesProps {
  product: Product;
  lang: Locale;
}

export const ProductVarieties: React.FC<ProductVarietiesProps> = ({ product, lang }) => {
  if (!product.varieties || product.varieties.length === 0) return null;
  const pt = getPageTranslations(lang).productDetail;
  const productSlug = product.slug[lang] || product.slug.en || product.id;
  const isTr = lang === 'tr';

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>{pt.varietiesTitle}</span>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          {product.varieties.length} {isTr ? 'Ticari Çeşit' : 'Commercial Varieties'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {product.varieties.map((v, idx) => {
          const varietySlug = (typeof v.slug === 'string'
            ? v.slug
            : v.id || v.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')).toLowerCase();
          const varietyUrl = `/${lang}/products/${productSlug}/${varietySlug}/`;
          const vName = isTr ? (v.nameTr || v.name) : v.name;

          return (
            <div
              key={idx}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between group hover:border-emerald-300"
            >
              <div className="space-y-4">
                {v.image && (
                  <Link href={varietyUrl} className="block relative h-48 w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
                    <Image
                      src={v.image}
                      alt={vName}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-emerald-950/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-emerald-300 border border-emerald-500/30">
                      {isTr ? 'Orijinal İhraç Kasası' : 'Authentic Export Carton'}
                    </div>
                  </Link>
                )}

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link href={varietyUrl}>
                      <h4 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {vName}
                      </h4>
                    </Link>
                    <div className="text-xs font-semibold text-emerald-700 mt-0.5">
                      {v.color} • {v.brix}
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold shrink-0">
                    {pt.caliberDiameter}: {v.size}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {isTr ? v.descriptionTr : v.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3 mt-auto">
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                  <div>
                    <span className="font-semibold text-slate-700 block">{pt.harvestLabel}</span>
                    <span>{isTr ? v.harvestMonthsTr : v.harvestMonths}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700 block">{pt.storageLabel}</span>
                    <span>{isTr ? v.storageTr : v.storage}</span>
                  </div>
                </div>

                <Link
                  href={varietyUrl}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 font-bold text-xs border border-slate-200 hover:border-emerald-200 transition-all"
                >
                  <span>
                    {isTr 
                      ? `${vName} İhraç Standartları & Detaylar` 
                      : `${vName} Specifications & Details`}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

