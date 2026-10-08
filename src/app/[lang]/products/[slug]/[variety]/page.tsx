import React from 'react';
import { notFound } from 'next/navigation';
import { productsData } from '@/data/products';
import { supportedLanguages } from '@/data/languages';
import { Locale } from '@/types';
import { ClientVarietyWrapper } from './ClientVarietyWrapper';
import type { Metadata } from 'next';
import { localizedAlternates, pageMetadata } from '@/lib/metadata';
import { breadcrumbSchema, productSchema, serializeJsonLd } from '@/lib/structuredData';
import { getTranslations } from '@/data/translations';
import { getLocalizedVariety } from '@/lib/localizedContent';

export function generateStaticParams() {
  const params: { lang: string; slug: string; variety: string }[] = [];

  supportedLanguages.forEach((l) => {
    productsData.forEach((product) => {
      const productSlug = product.slug[l.code] || product.slug.en || product.id;
      if (product.varieties && product.varieties.length > 0) {
        product.varieties.forEach((v) => {
          const varietySlug = (typeof v.slug === 'string'
            ? v.slug
            : v.id || v.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')).toLowerCase();

          params.push({
            lang: l.code,
            slug: productSlug,
            variety: varietySlug,
          });
        });
      }
    });
  });

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string; variety: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;
  const productSlug = resolvedParams.slug.toLowerCase();
  const varietySlug = resolvedParams.variety.toLowerCase();

  const product = productsData.find((p) => {
    return Object.values(p.slug).some((s) => s.toLowerCase() === productSlug) || p.id.toLowerCase() === productSlug;
  });

  if (!product) {
    return {
      title: 'Variety Not Found',
    };
  }

  const variety = product.varieties?.find((v) => {
    const vSlug = (typeof v.slug === 'string'
      ? v.slug
      : v.id || v.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')).toLowerCase();
    return vSlug === varietySlug || v.id?.toLowerCase() === varietySlug;
  });

  if (!variety) {
    return {
      title: 'Variety Not Found',
    };
  }

  const translatedVariety = getLocalizedVariety(variety, lang);
  const productName = product.name[lang] || product.name.en || product.id;
  const varietyName = lang === 'tr' ? translatedVariety.nameTr || translatedVariety.name : translatedVariety.name;
  const description = lang === 'tr' ? translatedVariety.descriptionTr || translatedVariety.description : translatedVariety.description;
  const path = `products/${productSlug}/${varietySlug}`;
  const translatedPaths = Object.fromEntries(supportedLanguages.map(({ code }) => [code, `products/${product.slug[code] || product.slug.en || product.id}/${varietySlug}`]));
  return pageMetadata(lang, path, `${varietyName} (${productName})`, description, {
    alternates: localizedAlternates(lang, path, undefined, translatedPaths),
    openGraph: { images: [{ url: variety.image || variety.heroImage || product.heroImage, alt: varietyName }] },
  });
}

export default async function VarietyDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string; variety: string }>;
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;
  const productSlug = resolvedParams.slug.toLowerCase();
  const varietySlug = resolvedParams.variety.toLowerCase();

  const product = productsData.find((p) => {
    return Object.values(p.slug).some((s) => s.toLowerCase() === productSlug) || p.id.toLowerCase() === productSlug;
  });

  if (!product) {
    notFound();
  }

  const variety = product.varieties?.find((v) => {
    const vSlug = (typeof v.slug === 'string'
      ? v.slug
      : v.id || v.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')).toLowerCase();
    return vSlug === varietySlug || v.id?.toLowerCase() === varietySlug;
  });

  if (!variety) {
    notFound();
  }

  const translatedVariety = getLocalizedVariety(variety, lang);
  const productName = product.name[lang] || product.name.en || product.id;
  const varietyName = lang === 'tr' ? translatedVariety.nameTr || translatedVariety.name : translatedVariety.name;
  const t = getTranslations(lang);
  const varietyJsonLd = productSchema(product, lang, translatedVariety);
  const breadcrumbJsonLd = breadcrumbSchema(lang, [
    { name: t.nav.products, path: 'products' },
    { name: productName, path: `products/${productSlug}` },
    { name: varietyName, path: `products/${productSlug}/${varietySlug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(varietyJsonLd) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }} />
      <ClientVarietyWrapper product={product} variety={translatedVariety} lang={lang} />
    </>
  );
}
