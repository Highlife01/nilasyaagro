'use client';

import React, { useContext } from 'react';
import { Product, Locale } from '@/types';
import { ProductHero } from '@/components/product/ProductHero';
import { ProductSpecsTable } from '@/components/product/ProductSpecsTable';
import { ProductFactBox } from '@/components/product/ProductFactBox';
import { ProductVarieties } from '@/components/product/ProductVarieties';
import { ProductGallerySection } from '@/components/product/ProductGallerySection';
import { 
  ProductPackaging, 
  ProductLogistics, 
  ProductFAQ 
} from '@/components/product/ProductDetailSections';
import { FinalCTASection } from '@/components/home/FinalCTASection';
import { RFQContext } from '@/components/layout/AppWrapper';
import Link from 'next/link';
import { productsData } from '@/data/products';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

import { getPageTranslations } from '@/data/pageTranslations';

interface ClientProductWrapperProps {
  product: Product;
  lang: Locale;
}

export const ClientProductWrapper: React.FC<ClientProductWrapperProps> = ({ product, lang }) => {
  const { openQuote } = useContext(RFQContext);
  const pt = getPageTranslations(lang).productDetail;

  const relatedProducts = productsData.filter((p) => p.id !== product.id).slice(0, 3);

  const getProductHref = (slugObj: Record<string, string>, id: string) => {
    const slug = slugObj[lang] || slugObj.en || id;
    return `/${lang}/products/${slug}/`;
  };

  return (
    <div>
      <ProductHero product={product} lang={lang} onOpenQuote={() => openQuote(product.id)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Machine-Readable Fact Box (Rule #81 & #40) */}
        <ProductFactBox product={product} lang={lang} />

        {/* Technical Specification Table */}
        <ProductSpecsTable product={product} lang={lang} />

        {/* Commercial Varieties */}
        <ProductVarieties product={product} lang={lang} />

        {/* Real Packhouse & Packaging Gallery */}
        <ProductGallerySection product={product} lang={lang} />

        {/* Packaging Options & Container Capacities */}
        <ProductPackaging product={product} lang={lang} />

        {/* Storage Silos & Ocean Logistics */}
        <ProductLogistics product={product} lang={lang} />

        {/* B2B FAQ */}
        <ProductFAQ product={product} lang={lang} />

        {/* Related Products Section */}
        <section className="pt-8">
          <h3 className="text-2xl font-black text-slate-900 mb-6">
            {pt.exploreOther}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => {
              const relName = rel.name[lang] || rel.name.en;
              const relOrigin = lang === 'tr' ? rel.origins.tr[0] : rel.origins.en[0];

              return (
                <Link
                  key={rel.id}
                  href={getProductHref(rel.slug, rel.id)}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all p-4 flex items-center gap-4"
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <Image
                      src={rel.heroImage}
                      alt={relName}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {relName}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {relOrigin}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      <FinalCTASection lang={lang} onOpenQuote={() => openQuote(product.id)} />
    </div>
  );
};
