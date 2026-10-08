'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product, Variety, Locale } from '@/types';
import { Sparkles, ArrowRight } from 'lucide-react';

interface SiblingVarietiesProps {
  product: Product;
  currentVariety: Variety;
  lang: Locale;
}

export const SiblingVarieties: React.FC<SiblingVarietiesProps> = ({
  product,
  currentVariety,
  lang,
}) => {
  const isTr = lang === 'tr';
  const currentSlug = (typeof currentVariety.slug === 'string' 
    ? currentVariety.slug 
    : currentVariety.id || currentVariety.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')).toLowerCase();

  const siblings = (product.varieties || []).filter((v) => {
    const vSlug = (typeof v.slug === 'string' 
      ? v.slug 
      : v.id || v.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')).toLowerCase();
    return vSlug !== currentSlug && v.id !== currentVariety.id;
  });

  if (siblings.length === 0) return null;

  const productSlug = product.slug[lang] || product.slug.en || product.id;
  const productName = product.name[lang] || product.name.en || product.id;

  return (
    <section className="space-y-6 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{isTr ? 'Diğer Ticari Çeşitler' : 'Other Commercial Varieties'}</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            {productName} {isTr ? 'Kategorisindeki Diğer Çeşitlerimiz' : 'Catalog Varieties'}
          </h3>
        </div>
        <Link
          href={`/${lang}/products/${productSlug}/`}
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors"
        >
          <span>{isTr ? 'Tüm Ürün Özelliklerini Gör' : 'View Parent Product Page'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {siblings.map((v, idx) => {
          const vSlug = (typeof v.slug === 'string' 
            ? v.slug 
            : v.id || v.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')).toLowerCase();
          const vName = isTr ? (v.nameTr || v.name) : v.name;
          const vImg = v.image || v.heroImage || product.heroImage;
          const vDesc = isTr ? (v.descriptionTr || v.description) : v.description;

          return (
            <Link
              key={idx}
              href={`/${lang}/products/${productSlug}/${vSlug}/`}
              className="group bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 hover:border-emerald-300"
            >
              <div className="space-y-3">
                <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
                  <Image
                    src={vImg}
                    alt={vName}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-800 shadow-sm">
                    {v.purity || v.caliber || v.size}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {vName}
                  </h4>
                  <div className="text-xs font-medium text-emerald-800 mt-0.5">
                    {v.color} • {v.caliber || v.size}
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {vDesc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
                <span>{isTr ? 'İncele & Standartlar' : 'View Specifications'}</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
