import React from 'react';
import { notFound } from 'next/navigation';
import { productsData } from '@/data/products';
import { supportedLanguages } from '@/data/languages';
import { Locale } from '@/types';
import { ClientProductWrapper } from './ClientProductWrapper';
import type { Metadata } from 'next';
import { company } from '@/data/company';
import { localizedSeoDescription } from '@/data/seo';

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

  if (!product) {
    return {
      title: 'Product Not Found | Nilasya Agro Foods',
    };
  }

  const productName = product.name[lang] || product.name.en || product.id;
  const productDesc = product.shortDescription[lang] || product.shortDescription.en || '';

  const languageAlternates: Record<string, string> = {
    'x-default': `${company.baseUrl}/en/products/${product.slug.en || product.id}/`,
  };

  supportedLanguages.forEach((l) => {
    const s = product.slug[l.code] || product.slug.en || product.id;
    languageAlternates[l.code] = `${company.baseUrl}/${l.code}/products/${s}/`;
  });

  return {
    title: productName,
    description: localizedSeoDescription(lang, productName),
    keywords: product.seoKeywords,
    alternates: {
      canonical: `${company.baseUrl}/${lang}/products/${slug}/`,
      languages: languageAlternates,
    },
    openGraph: {
      title: `${productName} | Nilasya Agro Foods`,
      description: productDesc,
      images: [
        {
          url: product.heroImage,
          width: 1200,
          height: 630,
          alt: `${productName} export from Türkiye - Nilasya Agro Foods`,
        },
      ],
    },
  };
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

  // JSON-LD Structured Data (Rule #73, #74, #44)
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${productName} (Turkish Fresh Produce)`,
    image: `${company.baseUrl}${product.heroImage}`,
    description: product.fullDescription[lang] || product.fullDescription.en,
    sku: `NG-${product.id.toUpperCase()}-EXP`,
    category: product.category[lang] || product.category.en,
    brand: {
      '@type': 'Brand',
      name: 'Nilasya Agro Foods',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Nilasya Agro Foods',
      },
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: lang === 'tr' ? 'Ana Sayfa' : 'Home',
        item: `${company.baseUrl}/${lang}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: lang === 'tr' ? 'Ürünlerimiz' : 'Products',
        item: `${company.baseUrl}/${lang}/products/`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: productName,
        item: `${company.baseUrl}/${lang}/products/${slug}/`,
      },
    ],
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <ClientProductWrapper product={product} lang={lang} />
    </div>
  );
}
