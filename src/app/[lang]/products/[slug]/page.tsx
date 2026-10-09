import React from 'react';
import { notFound } from 'next/navigation';
import { productsData } from '@/data/products';
import { supportedLanguages } from '@/data/languages';
import { Locale } from '@/types';
import { ClientProductWrapper } from './ClientProductWrapper';
import type { Metadata } from 'next';
import { localizedAlternates, pageMetadata } from '@/lib/metadata';
import { breadcrumbSchema, faqSchema, productSchema, serializeJsonLd } from '@/lib/structuredData';
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
  const spec = product.specifications;
  const productFaqs = [
    {
      question: lang === 'tr'
        ? `${productName} ürününün kalite ve saflık şartnameleri nedir?`
        : `What are the quality specifications and purity standards for ${productName}?`,
      answer: lang === 'tr'
        ? `Ürün menşei: ${spec.originTr || spec.origin}. Saflık: ${spec.purity || 'min %99.5 Sortex optik ayıklanmış'}, Nem: ${spec.moisture || 'maks %12.0'}, Raf ömrü: ${spec.shelfLifeTr || spec.shelfLife || '24 ay serin kuru depolama'}.`
        : `Origin: ${spec.origin}. Purity: ${spec.purity || 'min 99.5% Sortex Cleaned'}, Moisture: ${spec.moisture || 'max 12.0%'}, Shelf Life: ${spec.shelfLife || '24 months in cool dry storage'}.`,
    },
    {
      question: lang === 'tr'
        ? `${productName} için hangi ihracat ambalaj seçenekleri sunulmaktadır?`
        : `What bulk export packaging options are available for ${productName}?`,
      answer: product.packagingOptions.map((p) => `${p.type}: ${p.netWeight}`).join('; '),
    },
    {
      question: lang === 'tr'
        ? `${productName} için ihracat sevkiyatı nereden ve hangi teslim koşullarıyla yapılır?`
        : `From which port is ${productName} shipped and under what trade terms?`,
      answer: lang === 'tr'
        ? `Tüm sevkiyatlar Mersin Uluslararası Limanı (MIP) çıkışlı olup FOB, CFR ve CIF teslim şekilleriyle 20ft ve 40ft konteynerlerde gerçekleştirilir.`
        : `All shipments depart from Mersin International Port (MIP) under FOB, CFR, and CIF Incoterms in 20ft and 40ft ocean containers.`,
    },
  ];

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqSchema(productFaqs)) }}
      />

      <ClientProductWrapper product={product} lang={lang} />
    </div>
  );
}
