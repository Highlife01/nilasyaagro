'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, FileText, Calendar, MapPin, Sparkles } from 'lucide-react';
import { Locale } from '@/types';
import { getTranslations } from '@/data/translations';
import { productsData } from '@/data/products';

interface ProductGridProps {
  lang: Locale;
  onOpenQuoteWithProduct?: (productId: string) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ lang, onOpenQuoteWithProduct }) => {
  const t = getTranslations(lang).productsSection;

  const getProductHref = (slugObj: Record<string, string>, id: string) => {
    const slug = slugObj[lang] || slugObj.en || id;
    return `/${lang}/products/${slug}/`;
  };

  return (
    <section id="products" className="relative bg-[#f5f7f3] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl space-y-4 text-center lg:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/70 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-emerald-800 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-[#c99745]" />
            <span>{t.titleSmall}</span>
          </div>
          <h2 className="text-3xl font-black leading-tight tracking-[-0.035em] text-[#102a26] sm:text-5xl">{t.titleMain}</h2>
          <p className="text-base font-normal leading-relaxed text-slate-600 sm:text-lg">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {productsData.map((product) => {
            const prodName = product.name[lang] || product.name.en;
            const prodTagline = product.tagline[lang] || product.tagline.en;
            const prodCategory = product.category[lang] || product.category.en;
            const prodSeason = product.seasonMonthsText[lang] || product.seasonMonthsText.en;
            const prodOrigins = lang === 'tr' ? product.origins.tr : product.origins.en;

            return (
              <article
                key={product.id}
                className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-[#dfe8e1] bg-white shadow-[0_14px_36px_-24px_rgba(16,42,38,0.45)] transition-all duration-500 hover:-translate-y-1.5 hover:border-emerald-500/40 hover:shadow-[0_26px_48px_-24px_rgba(12,107,82,0.34)]"
              >
                <div className="relative h-72 w-full overflow-hidden bg-slate-100 sm:h-80">
                  <Image
                    src={product.heroImage}
                    alt={`${prodName} bulk export from Türkiye - Nilasya Agro Foods`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08241f]/90 via-[#08241f]/18 to-transparent" />

                  <div className="absolute left-4 top-4 z-10">
                    <span className="rounded-full border border-white/20 bg-[#102a26]/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                      {prodCategory}
                    </span>
                  </div>

                  <div className="absolute right-4 top-4 z-10">
                    <span className="rounded-md bg-black/35 px-2.5 py-1 text-[10px] font-medium italic text-slate-200 backdrop-blur-sm">
                      {product.scientificName}
                    </span>
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 z-10 text-white">
                    <h3 className="text-2xl font-black leading-snug tracking-[-0.025em] drop-shadow-md">{prodName}</h3>
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between space-y-6 p-6">
                  <div className="space-y-4">
                    <p className="text-[15px] font-normal leading-relaxed text-slate-600">{prodTagline}</p>

                    <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                      <div className="flex items-center gap-2 rounded-xl border border-[#e6eee8] bg-[#f7faf7] p-2.5">
                        <Calendar className="h-3.5 w-3.5 shrink-0 text-emerald-700" />
                        <div className="truncate">
                          <span className="block text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">{t.season}</span>
                          <span className="block truncate text-xs font-semibold text-slate-800">{prodSeason}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 rounded-xl border border-[#e6eee8] bg-[#f7faf7] p-2.5">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-700" />
                        <div className="truncate">
                          <span className="block text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">{t.origin}</span>
                          <span className="block truncate text-xs font-semibold text-slate-800">{prodOrigins[0]}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <span className="block text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{t.varieties}:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {product.varieties.map((v) => (
                          <span key={v.name} className="rounded-lg bg-[#eef7f1] px-2.5 py-1 text-xs font-semibold text-emerald-900">
                            {lang === 'tr' ? v.nameTr : v.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 border-t border-[#e7eee8] pt-4">
                    <Link
                      href={getProductHref(product.slug, product.id)}
                      className="flex min-h-12 flex-1 touch-manipulation items-center justify-center gap-1.5 rounded-xl bg-[#0f5341] px-4 py-3 text-center text-sm font-bold uppercase tracking-[0.1em] text-white transition-all hover:bg-[#117a5c] hover:shadow-lg hover:shadow-emerald-900/15"
                    >
                      <span>{t.viewProduct}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => onOpenQuoteWithProduct?.(product.id)}
                      className="flex min-h-12 min-w-12 touch-manipulation items-center justify-center rounded-xl border border-emerald-200 bg-[#eef7f1] px-4 py-3 text-emerald-900 transition-colors hover:bg-[#dcefe3]"
                      title={t.requestPrice}
                    >
                      <FileText className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href={`/${lang}/products/`}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-800 bg-transparent px-8 py-4 text-xs font-bold uppercase tracking-[0.14em] text-emerald-900 transition-all hover:-translate-y-0.5 hover:bg-emerald-900 hover:text-white"
          >
            <span>{t.exploreAll}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
