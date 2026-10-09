'use client';

import React from 'react';
import { Product, Variety, Locale } from '@/types';
import { CheckCircle2, Package, Scale, Award, Layers, Sparkles } from 'lucide-react';

interface VarietySpecsProps {
  product: Product;
  variety: Variety;
  lang: Locale;
}

export const VarietySpecs: React.FC<VarietySpecsProps> = ({
  product,
  variety,
  lang,
}) => {
  const isTr = lang === 'tr';
  const varietyName = isTr ? (variety.nameTr || variety.name) : variety.name;
  const characteristics = isTr ? (variety.characteristicsTr || variety.characteristics || []) : (variety.characteristics || []);
  const packagingTypes = isTr ? (variety.packagingTypesTr || variety.packagingTypes || []) : (variety.packagingTypes || []);
  const originList = isTr ? product.origins.tr : product.origins.en;

  return (
    <section className="space-y-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{isTr ? 'Teknik İhracat Şartnamesi' : 'Technical Export Specifications'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {varietyName} {isTr ? 'Kalite & Boylama Parametreleri' : 'Quality & Grading Specs'}
          </h2>
        </div>
        <div className="text-xs text-slate-500 font-medium">
          {isTr ? 'Uluslararası Perakende & Toptan Standardı' : 'Global Retail & Wholesale Standard'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Full Technical Specifications Table */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Scale className="w-4 h-4 text-emerald-600" />
              <span>{isTr ? 'Resmi İhraç Standartları' : 'Official Export Parameters'}</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
              Class 1 / Extra
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-sm">
            <div className="grid grid-cols-3 px-6 py-3.5 hover:bg-slate-50/70 transition-colors">
              <span className="text-slate-500 font-medium">
                {isTr ? 'Çeşit Adı' : 'Variety Name'}
              </span>
              <span className="col-span-2 font-semibold text-slate-900">
                {varietyName}
              </span>
            </div>

            <div className="grid grid-cols-3 px-6 py-3.5 hover:bg-slate-50/70 transition-colors">
              <span className="text-slate-500 font-medium">
                {isTr ? 'Botanik Tür' : 'Botanical Species'}
              </span>
              <span className="col-span-2 font-semibold text-slate-900 italic">
                {product.scientificName}
              </span>
            </div>

            <div className="grid grid-cols-3 px-6 py-3.5 hover:bg-slate-50/70 transition-colors">
              <span className="text-slate-500 font-medium">
                {isTr ? 'Menşei / Üretim Havzası' : 'Origins / Terroir'}
              </span>
              <span className="col-span-2 font-semibold text-slate-900">
                {originList.join(', ')}
              </span>
            </div>

            <div className="grid grid-cols-3 px-6 py-3.5 hover:bg-slate-50/70 transition-colors">
              <span className="text-slate-500 font-medium">
                {isTr ? 'Kalibrasyon / Çap' : 'Caliber / Diameter'}
              </span>
              <span className="col-span-2 font-semibold text-slate-900">
                {variety.caliber || variety.size}
              </span>
            </div>

            <div className="grid grid-cols-3 px-6 py-3.5 hover:bg-slate-50/70 transition-colors">
              <span className="text-slate-500 font-medium">
                {isTr ? 'Renk & Kabuk Standardı' : 'Color & Skin Quality'}
              </span>
              <span className="col-span-2 font-semibold text-slate-900">
                {variety.color}
              </span>
            </div>

            <div className="grid grid-cols-3 px-6 py-3.5 hover:bg-slate-50/70 transition-colors">
              <span className="text-slate-500 font-medium">
                {isTr ? 'Optik Saflık (Sortex)' : 'Optical Purity (Sortex)'}
              </span>
              <span className="col-span-2 font-semibold text-emerald-700">
                {variety.purity || (isTr ? 'Min. %99.5 Sortex' : 'Min. 99.5% Sortex')}
              </span>
            </div>

            <div className="grid grid-cols-3 px-6 py-3.5 hover:bg-slate-50/70 transition-colors">
              <span className="text-slate-500 font-medium">
                {isTr ? 'Hasat Dönemi' : 'Harvest Window'}
              </span>
              <span className="col-span-2 font-semibold text-slate-900">
                {isTr ? (variety.harvestMonthsTr || variety.harvestMonths) : variety.harvestMonths}
              </span>
            </div>

            <div className="grid grid-cols-3 px-6 py-3.5 hover:bg-slate-50/70 transition-colors">
              <span className="text-slate-500 font-medium">
                {isTr ? 'Depolama Rejimi' : 'Storage Regime'}
              </span>
              <span className="col-span-2 font-semibold text-slate-900">
                {isTr ? (variety.storageTr || variety.storage) : variety.storage}
              </span>
            </div>

            <div className="grid grid-cols-3 px-6 py-3.5 hover:bg-slate-50/70 transition-colors">
              <span className="text-slate-500 font-medium">
                {isTr ? 'Raf Ömrü Garantisi' : 'Shelf Life Guarantee'}
              </span>
              <span className="col-span-2 font-bold text-emerald-800">
                {isTr ? (variety.shelfLifeTr || variety.shelfLife || variety.storageTr) : (variety.shelfLife || variety.storage)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Characteristics & Packaging */}
        <div className="lg:col-span-5 space-y-6">
          {/* Key Advantages Card */}
          <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-7 shadow-sm border border-emerald-900 space-y-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>{isTr ? 'Ticari Tercih Avantajları' : 'Commercial Key Advantages'}</span>
            </div>

            {characteristics.length > 0 ? (
              <ul className="space-y-3">
                {characteristics.map((c, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-300 leading-relaxed">
                {isTr 
                  ? 'Nilasya Agro Foods yüksek teknolojik boylama hatlarında optik olarak ayrıştırılmış, standart ihracat kalitesinde ürünler temin eder.'
                  : 'Nilasya Agro Foods provides electronically sorted, optically calibrated produce adhering to strict international retail guidelines.'}
              </p>
            )}
          </div>

          {/* Recommended Packaging Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
              <Package className="w-4 h-4 text-emerald-600" />
              <span>{isTr ? 'Uyumlu İhracat Ambalajları' : 'Approved Export Packaging'}</span>
            </div>

            {packagingTypes.length > 0 ? (
              <div className="space-y-2.5">
                {packagingTypes.map((pkg, i) => (
                  <div 
                    key={i} 
                    className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3 text-xs font-semibold text-slate-800"
                  >
                    <Layers className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{pkg}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
                {isTr 
                  ? '25kg / 50kg PP Çuval, 1.000kg FIBC Big Bag ve müşteri talebine özel etiketli perakende doypack paketleme.'
                  : '25kg / 50kg PP Woven Sacks, 1,000kg FIBC Big Bags, and custom branded retail packaging.'}
              </div>
            )}

            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span>{isTr ? 'Palet Standardı' : 'Pallet Standard'}: Euro (80x120) / Block (100x120)</span>
              <span className="font-semibold text-emerald-700">{isTr ? '20ft / 40ft Kuru Konteyner' : '20ft / 40ft FCL Dry Container'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
