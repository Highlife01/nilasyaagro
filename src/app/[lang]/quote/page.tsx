import React from 'react';
import { Locale } from '@/types';
import { supportedLanguages } from '@/data/languages';
import { QuoteClientWrapper } from './QuoteClientWrapper';
import type { Metadata } from 'next';
import { getTranslations } from '@/data/translations';
import { localizedPageDescription } from '@/data/seo';
import { pageMetadata } from '@/lib/metadata';

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

  return pageMetadata(lang, 'quote', t.rfq.modalTitle, localizedPageDescription(lang, 'quote', t.rfq.modalTitle));
}

export default async function QuotePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;

  return <QuoteClientWrapper lang={lang} />;
}
