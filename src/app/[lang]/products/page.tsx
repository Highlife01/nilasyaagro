import React from 'react';
import { Locale } from '@/types';
import { supportedLanguages } from '@/data/languages';
import { ProductGrid } from '@/components/home/ProductGrid';
import { Nilasya2KgShowcase } from '@/components/packaging/Nilasya2KgShowcase';
import { HarvestCalendarSection } from '@/components/home/HarvestCalendarSection';
import { ClientProductsWrapper } from './ClientProductsWrapper';
import type { Metadata } from 'next';
import { Sparkles } from 'lucide-react';
import { getTranslations } from '@/data/translations';
import { localizedPageDescription } from '@/data/seo';
import { pageMetadata } from '@/lib/metadata';
import { productsData } from '@/data/products';
import { breadcrumbSchema, collectionPageSchema, serializeJsonLd } from '@/lib/structuredData';

import { getPageTranslations } from '@/data/pageTranslations';

export function generateStaticParams() {
  return supportedLanguages.map((l) => ({ lang: l.code }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;
  const t = getTranslations(lang);

  return pageMetadata(lang, 'products', t.productsSection.titleMain, localizedPageDescription(lang, 'products', `${t.productsSection.titleMain}: ${t.hero.productsList}`));
}

export default async function ProductsCatalogPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;
  const t = getTranslations(lang);
  const pt = getPageTranslations(lang).productsPage;
  const breadcrumbs = breadcrumbSchema(lang, [{ name: t.nav.products, path: 'products' }]);
  const pageJsonLd = collectionPageSchema(
    lang,
    'products',
    t.productsSection.titleMain,
    localizedPageDescription(lang, 'products', `${t.productsSection.titleMain}: ${t.hero.productsList}`),
    productsData.map((product) => ({
      name: product.name[lang] || product.name.en,
      path: `products/${product.slug[lang] || product.slug.en || product.id}`,
      image: product.heroImage,
      description: product.shortDescription[lang] || product.shortDescription.en,
      type: 'Product' as const,
    })),
    { breadcrumb: breadcrumbs }
  );

  return (
    <div className="pt-24 bg-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(pageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }} />
      {/* Fresh Vibrant Hero Header Banner */}
      <section className="relative py-16 lg:py-20 bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{pt.tag}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            {pt.title}
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto mt-4 font-normal leading-relaxed">
            {pt.subtitle}
          </p>

          {/* 9 Core Agricultural Export Category Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8 max-w-5xl mx-auto">
            <span className="px-4 py-2 rounded-2xl bg-amber-700/80 border border-amber-500/40 text-amber-100 text-xs font-black shadow-md backdrop-blur-sm">
              {pt.pills.chickpeas}
            </span>
            <span className="px-4 py-2 rounded-2xl bg-rose-800/80 border border-rose-500/40 text-rose-100 text-xs font-black shadow-md backdrop-blur-sm">
              {pt.pills.redLentils}
            </span>
            <span className="px-4 py-2 rounded-2xl bg-emerald-800/80 border border-emerald-500/40 text-emerald-100 text-xs font-black shadow-md backdrop-blur-sm">
              {pt.pills.greenLentils}
            </span>
            <span className="px-4 py-2 rounded-2xl bg-stone-700/80 border border-stone-400/40 text-stone-100 text-xs font-black shadow-md backdrop-blur-sm">
              {pt.pills.whiteBeans}
            </span>
            <span className="px-4 py-2 rounded-2xl bg-yellow-800/80 border border-yellow-500/40 text-yellow-100 text-xs font-black shadow-md backdrop-blur-sm">
              {pt.pills.dryPeas}
            </span>
            <span className="px-4 py-2 rounded-2xl bg-teal-800/80 border border-teal-500/40 text-teal-100 text-xs font-black shadow-md backdrop-blur-sm">
              {pt.pills.broadBeans || (lang === 'tr' ? '🫘 Kuru Bakla' : '🫘 Broad Beans / Fava')}
            </span>
            <span className="px-4 py-2 rounded-2xl bg-cyan-800/80 border border-cyan-500/40 text-cyan-100 text-xs font-black shadow-md backdrop-blur-sm">
              {pt.pills.blackEyedPeas || (lang === 'tr' ? '👁️ Börülce' : '👁️ Black-Eyed Peas')}
            </span>
            <span className="px-4 py-2 rounded-2xl bg-amber-600/90 border border-amber-400/50 text-white text-xs font-black shadow-md backdrop-blur-sm">
              {pt.pills.durumWheat}
            </span>
            <span className="px-4 py-2 rounded-2xl bg-orange-800/80 border border-orange-500/40 text-orange-100 text-xs font-black shadow-md backdrop-blur-sm">
              {pt.pills.seedsOilseeds || (lang === 'tr' ? '🌻 Tohumlar ve Yağlı Tohumlar' : '🌻 Seeds & Oilseeds')}
            </span>
            <span className="px-4 py-2 rounded-2xl bg-amber-500/90 border border-amber-300 text-slate-950 text-xs font-black shadow-md backdrop-blur-sm">
              {lang === 'tr' ? '🌿 Doğal & Soyulmuş Susam' : '🌿 Sesame Seeds (Natural & Hulled)'}
            </span>
            <span className="px-4 py-2 rounded-2xl bg-amber-900/90 border border-amber-600/60 text-amber-100 text-xs font-black shadow-md backdrop-blur-sm">
              {lang === 'tr' ? '🌰 Türk Kuruyemiş & Fındık/Fıstık' : '🌰 Turkish Nuts & Dried Fruits'}
            </span>
          </div>
        </div>
      </section>

      {/* Main Products Grid */}
      <ProductGrid lang={lang} />

      {/* Nilasya 2 KG Retail & Export Packaging Showcase */}
      <Nilasya2KgShowcase lang={lang} />

      {/* Harvest Calendar */}
      <HarvestCalendarSection lang={lang} />

      {/* RFQ & Final Section */}
      <ClientProductsWrapper lang={lang} />
    </div>
  );
}
