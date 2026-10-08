import React from 'react';
import { notFound } from 'next/navigation';
import { productsData } from '@/data/products';
import { supportedLanguages } from '@/data/languages';
import { Locale } from '@/types';
import { ClientVarietyWrapper } from './ClientVarietyWrapper';
import type { Metadata } from 'next';
import { company } from '@/data/company';

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
      title: 'Variety Not Found | Nilasya Agro Foods',
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
      title: 'Variety Not Found | Nilasya Agro Foods',
    };
  }

  const isTr = lang === 'tr';
  const productName = product.name[lang] || product.name.en || product.id;
  const varietyName = isTr ? (variety.nameTr || variety.name) : variety.name;
  const varietyDesc = isTr ? (variety.descriptionTr || variety.description) : variety.description;
  const metaTitle = `${varietyName} (${productName}) | Nilasya Agro Foods Export`;
  const metaDesc = isTr
    ? `${varietyName} ihracat şartnamesi, kalibre boylama, soğuk hava depolama ve toptan sevkiyat parametreleri. Nilasya Agro Foods güvencesiyle Türkiye'den dünya pazarlarına.`
    : `Official export specifications, sizing, moisture-controlled storage, and wholesale supply for ${varietyName} from Türkiye. Sourced by Nilasya Agro Foods.`;

  const languageAlternates: Record<string, string> = {
    'x-default': `${company.baseUrl}/en/products/${product.slug.en || product.id}/${varietySlug}/`,
  };

  supportedLanguages.forEach((l) => {
    const s = product.slug[l.code] || product.slug.en || product.id;
    languageAlternates[l.code] = `${company.baseUrl}/${l.code}/products/${s}/${varietySlug}/`;
  });

  const heroImg = variety.image || variety.heroImage || product.heroImage;

  return {
    title: metaTitle,
    description: metaDesc,
    keywords: [
      varietyName,
      `${varietyName} export`,
      `${varietyName} supplier Turkey`,
      `${productName} varieties`,
      'Turkish pulses & grains export',
      'Nilasya Agro Foods',
      variety.color,
      variety.brix,
    ].filter((k): k is string => Boolean(k)),
    alternates: {
      canonical: `${company.baseUrl}/${lang}/products/${productSlug}/${varietySlug}/`,
      languages: languageAlternates,
    },
    openGraph: {
      type: 'website',
      url: `${company.baseUrl}/${lang}/products/${productSlug}/${varietySlug}/`,
      locale: lang === 'zh-cn' ? 'zh_CN' : lang.replace('-', '_'),
      title: `${varietyName} | Nilasya Agro Foods`,
      description: metaDesc,
      siteName: 'Nilasya Agro Foods',
      images: [
        {
          url: heroImg,
          width: 1200,
          height: 630,
          alt: `${varietyName} Turkish Export Pulses - Nilasya Agro Foods`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${varietyName} | Nilasya Agro Foods`,
      description: metaDesc,
      images: [heroImg],
    },
  };
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

  const isTr = lang === 'tr';
  const productName = product.name[lang] || product.name.en || product.id;
  const varietyName = isTr ? (variety.nameTr || variety.name) : variety.name;
  const varietyDesc = isTr ? (variety.descriptionTr || variety.description) : variety.description;
  const heroImg = variety.image || variety.heroImage || product.heroImage;

  // Schema.org Product JSON-LD for rich snippets
  const varietyJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${varietyName} - ${productName} (Turkish Export Pulses)`,
    image: `${company.baseUrl}${heroImg}`,
    description: varietyDesc,
    sku: `NG-${product.id.toUpperCase()}-${(variety.id || varietySlug).toUpperCase()}`,
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(varietyJsonLd) }}
      />
      <ClientVarietyWrapper product={product} variety={variety} lang={lang} />
    </>
  );
}
