'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Package, CheckCircle2, Layers, ArrowRight } from 'lucide-react';
import { Locale } from '@/types';
import { getTranslations } from '@/data/translations';
import { packagingData } from '@/data/packaging';
import { productsData } from '@/data/products';

export const PackagingShowcase: React.FC<{ lang: Locale }> = ({ lang }) => {
  const t = getTranslations(lang).packagingSection;

  return (
    <section className="py-20 lg:py-28 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold uppercase tracking-widest">
            <Package className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t.tag}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            {t.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Packaging Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-16">
          {packagingData.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-widest">
                    {pkg.netWeightRange}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    {lang === 'tr' ? pkg.name.tr : pkg.name.en}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {lang === 'tr' ? pkg.material.tr : pkg.material.en}
                </p>

              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 text-[11px] text-slate-600 space-y-1">
                <div><strong>Suitable for:</strong> {lang === 'tr' ? pkg.suitableFor.tr : pkg.suitableFor.en}</div>
                <div><strong>Euro Pallet:</strong> {pkg.palletConfigEuro}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Private Label Supermarket Solutions Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
                <Layers className="w-4 h-4" />
                <span>{t.privateLabelTitle}</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                {t.privateLabelSubtitle}
              </h3>

              <div className="space-y-2.5 pt-2">
                {t.featuresList.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  href={`/${lang}/packaging/`}
                  className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-400 hover:text-emerald-300"
                >
                  <span>{t.viewSpecs}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-lg border border-white/10">
              <Image
                src="/images/packaging/nilasya-2kg-pulses-packaging-series.jpg"
                alt="Nilasya Agro Foods 2 KG Retail & Wholesale Pulse Packaging Series (Chickpeas, Red Lentils, White Beans, Green Lentils)"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>

        {/* Individual 2 KG Retail Packs Showcase Strip */}
        <div className="mt-10 rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-[#0D3B2E]">
                {lang === 'tr' ? '2 KG Bireysel Paket Tasarımları' : 'Individual 2 KG Retail Packs'}
              </span>
              <h4 className="text-lg sm:text-xl font-black text-slate-900">
                {lang === 'tr' 
                  ? 'Her Bakliyat Türüne Özel Tek Tip Lüks Paketleme' 
                  : 'Uniform Luxury Packaging Tailored for Each Commodity'}
              </h4>
            </div>
            <Link
              href={`/${lang}/packaging/`}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1.5 shrink-0"
            >
              <span>{lang === 'tr' ? 'Tüm Paketleri ve Özellikleri İncele' : 'View Full Packaging Specifications'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { id: 'chickpeas', nameTr: 'Koçbaşı Nohut', nameEn: 'Chickpeas', img: '/images/packaging/nilasya-2kg-nohut.jpg' },
              { id: 'red-lentils', nameTr: 'Kırmızı Mercimek', nameEn: 'Red Lentils', img: '/images/packaging/nilasya-2kg-kirmizi-mercimek.jpg' },
              { id: 'white-beans', nameTr: 'Kuru Fasulye', nameEn: 'White Beans', img: '/images/packaging/nilasya-2kg-kuru-fasulye.jpg' },
              { id: 'green-lentils', nameTr: 'Yeşil Mercimek', nameEn: 'Green Lentils', img: '/images/packaging/nilasya-2kg-yesil-mercimek.jpg' },
              { id: 'durum-wheat-bulgur', nameTr: 'Pilavlık Bulgur', nameEn: 'Durum Bulgur', img: '/images/packaging/nilasya-2kg-pilavlik-bulgur.jpg' },
              { id: 'dry-peas', nameTr: 'Kuru Bezelye', nameEn: 'Dry Peas', img: '/images/packaging/nilasya-2kg-kuru-bezelye.jpg' },
            ].map((p, i) => {
              const prod = productsData.find((item) => item.id === p.id);
              const slug = prod ? (prod.slug[lang] || prod.slug.en || prod.id) : p.id;
              const href = `/${lang}/products/${slug}/`;

              return (
                <Link
                  key={i}
                  href={href}
                  className="group flex flex-col rounded-2xl border border-slate-200/80 bg-slate-50 p-2.5 hover:bg-white hover:border-emerald-500/50 hover:shadow-lg transition-all text-center"
                >
                  <div className="relative h-36 sm:h-40 w-full rounded-xl overflow-hidden bg-white mb-2 shadow-inner">
                    <Image
                      src={p.img}
                      alt={`${lang === 'tr' ? p.nameTr : p.nameEn} 2 KG`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-1.5 left-1.5 bg-[#0D3B2E] text-[#E8D3A7] px-1.5 py-0.5 rounded text-[9px] font-bold">
                      2 KG
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-800 transition-colors line-clamp-1">
                    {lang === 'tr' ? p.nameTr : p.nameEn}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Sortex Cleaned</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
