import React from 'react';
import { notFound } from 'next/navigation';
import { productsData } from '@/data/products';
import { supportedLanguages } from '@/data/languages';
import { Locale } from '@/types';
import { ClientProductWrapper } from './ClientProductWrapper';
import type { Metadata } from 'next';
import { localizedAlternates, pageMetadata } from '@/lib/metadata';
import { breadcrumbSchema, productSchema, serializeJsonLd } from '@/lib/structuredData';
import { getTranslations } from '@/data/translations';

export function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];

  supportedLanguages.forEach((l) => {
    productsData.forEach((product) => {
      params.push({ lang: l.code, slug: product.slug[l.code] || product.slug.en || product.id });
    });
  });

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;
  const slug = resolvedParams.slug.toLowerCase();

  const product = productsData.find((p) => {
    return Object.values(p.slug).includes(slug) || p.id === slug;
  });

  if (!product) notFound();
  const productName = product.name[lang] || product.name.en || product.id;
  const path = `products/${slug}`;
  const translatedPaths = Object.fromEntries(supportedLanguages.map(({ code }) => [code, `products/${product.slug[code] || product.slug.en || product.id}`]));
  return pageMetadata(lang, path, productName, product.shortDescription[lang] || product.shortDescription.en, {
    keywords: product.seoKeywords,
    alternates: localizedAlternates(lang, path, undefined, translatedPaths),
    openGraph: { images: [{ url: product.heroImage, alt: productName }] },
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;
  const slug = resolvedParams.slug.toLowerCase();

  const product = productsData.find((p) => {
    return Object.values(p.slug).includes(slug) || p.id === slug;
  });

  if (!product) {
    notFound();
  }

  const productName = product.name[lang] || product.name.en;

  const t = getTranslations(lang);
  const productJsonLd = productSchema(product, lang);
  const breadcrumbJsonLd = breadcrumbSchema(lang, [
    { name: t.nav.products, path: 'products' },
    { name: productName, path: `products/${slug}` },
  ]);

  return (
    <div className="bg-slate-50 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />

      <ClientProductWrapper product={product} lang={lang} />
    </div>
  );
}
