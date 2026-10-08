import React from 'react';
import { Locale } from '@/types';
import { supportedLanguages, isRtlLang } from '@/data/languages';
import { AppWrapper } from '@/components/layout/AppWrapper';
import type { Metadata } from 'next';
import { getTranslations } from '@/data/translations';
import { pageMetadata } from '@/lib/metadata';
import { notFound } from 'next/navigation';
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
  if (!supportedLanguages.some(({ code }) => code === lang)) notFound();
  const t = getTranslations(lang);
  return pageMetadata(lang, '', `${t.hero.titleLine1} ${t.hero.titleLine2}`, localizedSeoDescription(lang));
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
  if (!supportedLanguages.some(({ code }) => code === lang)) notFound();
  const isRtl = isRtlLang(lang);

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} lang={lang} className={isRtl ? 'font-sans rtl' : 'font-sans'}>
      <AppWrapper lang={lang}>{children}</AppWrapper>
    </div>
  );
}
