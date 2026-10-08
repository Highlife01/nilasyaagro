import React from 'react';
import { notFound } from 'next/navigation';
import { productsData } from '@/data/products';
import { supportedLanguages } from '@/data/languages';
import { Locale } from '@/types';
import { ClientProductWrapper } from './ClientProductWrapper';
import type { Metadata } from 'next';
import { company } from '@/data/company';
import { localizedSeoDescription } from '@/data/seo';
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
      type: 'website',
      url: `${company.baseUrl}/${lang}/products/${slug}/`,
      locale: lang === 'zh-cn' ? 'zh_CN' : lang.replace('-', '_'),
      title: `${productName} | Nilasya Agro Foods`,
      description: productDesc,
      siteName: 'Nilasya Agro Foods',
      images: [
        {
          url: product.heroImage,
          width: 1200,
          height: 630,
          alt: `${productName} export from Türkiye - Nilasya Agro Foods`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${productName} | Nilasya Agro Foods`,
      description: productDesc,
      images: [product.heroImage],
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

  // HS codes for products (verified international commodity codes)
  const hsCodes: Record<string, string> = {
    'chickpeas': '0713.20',
    'red-lentils': '0713.40',
    'green-lentils': '0713.40',
    'white-beans': '0713.33',
    'dry-peas': '0713.10',
    'durum-wheat': '1001.19',
    'bulgur': '1904.30',
  };

  // JSON-LD Structured Data (Rule #73, #74, #44)
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${company.baseUrl}/${lang}/products/${slug}/#product`,
    name: productName,
    image: `${company.baseUrl}${product.heroImage}`,
    description: product.fullDescription[lang] || product.fullDescription.en,
    sku: `NG-${product.id.toUpperCase()}-EXP`,
    category: product.category[lang] || product.category.en,
    brand: {
      '@type': 'Brand',
      '@id': `${company.baseUrl}/#organization`,
      name: 'Nilasya Agro Foods',
    },
    countryOfOrigin: {
      '@type': 'Country',
      name: 'Türkiye',
    },
    additionalProperty: [
      hsCodes[product.id] && {
        '@type': 'PropertyValue',
        name: 'HS Code',
        value: hsCodes[product.id],
      },
      product.specifications?.moisture && {
        '@type': 'PropertyValue',
        name: 'Moisture Content',
        value: product.specifications.moisture,
      },
      product.specifications?.purity && {
        '@type': 'PropertyValue',
        name: 'Sortex Purity',
        value: product.specifications.purity,
      },
      product.specifications?.caliber && {
        '@type': 'PropertyValue',
        name: 'Caliber Range',
        value: product.specifications.caliber,
      },
    ].filter(Boolean),
    inLanguage: lang,
  };

  const t = getTranslations(lang);
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${company.baseUrl}/${lang}/products/${slug}/#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t.nav.home || (lang === 'tr' ? 'Ana Sayfa' : 'Home'),
        item: `${company.baseUrl}/${lang}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t.nav.products || (lang === 'tr' ? 'Ürünlerimiz' : 'Products'),
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
