import React from 'react';
import { Locale } from '@/types';
import { supportedLanguages, isRtlLang } from '@/data/languages';
import { AppWrapper } from '@/components/layout/AppWrapper';
import type { Metadata } from 'next';
import { getTranslations } from '@/data/translations';
import { productsData } from '@/data/products';
import { company } from '@/data/company';
import { localizedSeoDescription } from '@/data/seo';

export function generateStaticParams() {
  return supportedLanguages.map((lang) => ({
    lang: lang.code,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;
  const baseUrl = company.baseUrl;
  const t = getTranslations(lang);
  const title = `${t.hero.titleLine1} ${t.hero.titleLine2} | Nilasya Agro Foods`;
  const description = localizedSeoDescription(lang);

  const languagesObj: Record<string, string> = {
    'x-default': `${baseUrl}/en/`,
  };

  supportedLanguages.forEach((l) => {
    languagesObj[l.code] = `${baseUrl}/${l.code}/`;
  });

  return {
    title: {
      template: '%s | Nilasya Agro Foods',
      default: title,
    },
    description,
    alternates: {
      canonical: `${baseUrl}/${lang}/`,
      languages: languagesObj,
    },
    metadataBase: new URL(baseUrl),
    keywords: [t.nav.products, t.nav.export, t.nav.quality, t.hero.productsList, ...productsData.map((product) => product.name[lang] || product.name.en)],
    openGraph: {
      type: 'website',
      siteName: 'Nilasya Agro Foods',
      url: `${baseUrl}/${lang}/`,
      title,
      description,
      images: [
        {
          url: '/images/hero/pulses-export-warehouse-nilasya.jpg',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/images/hero/pulses-export-warehouse-nilasya.jpg'] },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;
  const isRtl = isRtlLang(lang);

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} lang={lang} className={isRtl ? 'font-sans rtl' : 'font-sans'}>
      <AppWrapper lang={lang}>{children}</AppWrapper>
    </div>
  );
}
