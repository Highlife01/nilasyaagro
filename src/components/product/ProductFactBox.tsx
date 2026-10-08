'use client';

import React from 'react';
import { Product, Locale } from '@/types';
import { Sparkles, HelpCircle } from 'lucide-react';
import { packagingData } from '@/data/packaging';

import { getPageTranslations } from '@/data/pageTranslations';
import { company } from '@/data/company';

interface ProductFactBoxProps {
  product: Product;
  lang: Locale;
}

export const ProductFactBox: React.FC<ProductFactBoxProps> = ({ product, lang }) => {
  const pt = getPageTranslations(lang).productDetail;
  const prodName = product.name[lang] || product.name.en;
  const prodCategory = product.category[lang] || product.category.en;
  const prodSeason = product.seasonMonthsText[lang] || product.seasonMonthsText.en;
  const origins = lang === 'tr' ? product.origins.tr.join(', ') : product.origins.en.join(', ');
  const packagingSummary = packagingData.map((pkg) => lang === 'tr' ? pkg.name.tr : pkg.name.en).join(' • ');

  return (
    <div className="space-y-6">
      {/* Machine-Readable Structured Fact Box (Rule #81 & #42) */}
      <aside
        aria-label="Product Facts & Entity Information"
        className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800"
      >
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{pt.factBoxBadge}</span>
        </div>

        <h3 className="text-xl font-bold text-white mb-4">
          {prodName} ({product.scientificName})
        </h3>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-white/5 rounded-xl">
            <dt className="text-emerald-300 font-semibold">{pt.productCategory}</dt>
            <dd className="font-bold text-white mt-0.5">{prodName} • {prodCategory}</dd>
          </div>

          <div className="p-3 bg-white/5 rounded-xl">
            <dt className="text-emerald-300 font-semibold">{pt.countryOrigin}</dt>
            <dd className="font-bold text-white mt-0.5">Türkiye ({origins})</dd>
          </div>

          <div className="p-3 bg-white/5 rounded-xl">
            <dt className="text-emerald-300 font-semibold">{pt.primaryVarieties}</dt>
            <dd className="font-bold text-white mt-0.5">{product.specifications.variety}</dd>
          </div>

          <div className="p-3 bg-white/5 rounded-xl">
            <dt className="text-emerald-300 font-semibold">{pt.brixGrade}</dt>
            <dd className="font-bold text-white mt-0.5">{product.specifications.brix} • {product.specifications.class}</dd>
          </div>

          <div className="p-3 bg-white/5 rounded-xl">
            <dt className="text-emerald-300 font-semibold">{pt.supplyWindow}</dt>
            <dd className="font-bold text-white mt-0.5">{prodSeason}</dd>
          </div>

          <div className="p-3 bg-white/5 rounded-xl">
            <dt className="text-emerald-300 font-semibold">{pt.verifiedSupplier}</dt>
            <dd className="font-bold text-white mt-0.5">{company.name} ({company.domain})</dd>
          </div>
        </dl>
      </aside>

      {/* GEO Direct Answer Block (Rule #40 & #41) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-widest">
          <HelpCircle className="w-4 h-4 text-emerald-600" />
          <span>Direct Answer Block (GEO / Generative Engine Optimization)</span>
        </div>

        <div className="space-y-3">
          <h4 className="text-lg sm:text-xl font-black text-slate-900">
            What does Nilasya Agro Foods supply for {product.name.en}?
          </h4>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            <strong>Nilasya Agro Foods is a Türkiye-based processor and exporter of premium Sortex-cleaned {product.name.en} serving international B2B markets</strong>, including bulk agricultural importers, wholesale distributors, food manufacturers, and packaging partners across Europe, the Middle East, South Asia, and the Americas.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-600">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <strong className="block text-slate-900">Origins in Türkiye:</strong>
              <span>{origins}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <strong className="block text-slate-900">Available Packaging:</strong>
              <span>{packagingSummary}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <strong className="block text-slate-900">Export Availability:</strong>
              <span>{prodSeason}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
