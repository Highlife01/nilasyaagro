import type { Metadata } from 'next';
import { supportedLanguages } from '@/data/languages';
import { company } from '@/data/company';

export const defaultSocialImage = '/images/og/nilasya-export-1200x630.jpg';

export function localizedUrl(lang: string, pathname = '') {
  const normalized = pathname.replace(/^\/+|\/+$/g, '');
  return `${company.baseUrl}/${lang}/${normalized ? `${normalized}/` : ''}`;
}

export function localizedAlternates(
  lang: string,
  pathname = '',
  languageCodes?: string[],
  translatedPaths?: Record<string, string>,
): Metadata['alternates'] {
  const pathFor = (code: string) => translatedPaths?.[code] ?? pathname;
  const languages: Record<string, string> = { 'x-default': localizedUrl('en', pathFor('en')) };
  for (const { code } of supportedLanguages) {
    if (!languageCodes || languageCodes.includes(code)) languages[code] = localizedUrl(code, pathFor(code));
  }
  return { canonical: localizedUrl(lang, pathFor(lang)), languages };
}

export function pageMetadata(
  lang: string,
  pathname: string,
  title: string,
  description: string,
  extra: Metadata = {},
): Metadata {
  const brandedTitle = title.includes(company.name) ? title : `${title} | ${company.name}`;
  const images = [{ url: defaultSocialImage, width: 1200, height: 630, alt: company.name }];
  return {
    title: { absolute: brandedTitle },
    description,
    alternates: localizedAlternates(lang, pathname),
    ...extra,
    // Next.js replaces nested metadata rather than deeply merging it.
    openGraph: {
      type: 'website', siteName: company.name, locale: lang.replace('-', '_'),
      url: localizedUrl(lang, pathname), title: brandedTitle, description, images,
      ...extra.openGraph,
    },
    twitter: {
      card: 'summary_large_image', title: brandedTitle, description,
      images: extra.openGraph?.images ?? images,
      ...extra.twitter,
    },
  };
}
