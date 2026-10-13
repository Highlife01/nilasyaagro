import type { Metadata } from 'next';
import { supportedLanguages } from '@/data/languages';
import { company } from '@/data/company';

export const ogLocaleMap: Record<string, string> = {
  tr: 'tr_TR',
  en: 'en_US',
  ar: 'ar_SA',
  ru: 'ru_RU',
  de: 'de_DE',
  fr: 'fr_FR',
  es: 'es_ES',
  it: 'it_IT',
  pt: 'pt_PT',
  nl: 'nl_NL',
  pl: 'pl_PL',
  ro: 'ro_RO',
  bg: 'bg_BG',
  el: 'el_GR',
  sr: 'sr_RS',
  uk: 'uk_UA',
  ka: 'ka_GE',
  az: 'az_AZ',
  uz: 'uz_UZ',
  kk: 'kk_KZ',
  fa: 'fa_IR',
  hi: 'hi_IN',
  ur: 'ur_PK',
  bn: 'bn_BD',
  'zh-cn': 'zh_CN',
  ja: 'ja_JP',
  ko: 'ko_KR',
  id: 'id_ID',
  ms: 'ms_MY',
  sw: 'sw_KE',
};

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

const MAX_DESCRIPTION = 155;

export function trimDescription(text: string, max = MAX_DESCRIPTION) {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const window = clean.slice(0, max);
  const sentenceEnd = Math.max(window.lastIndexOf('. '), window.lastIndexOf('。'), window.lastIndexOf('؟ '));
  if (sentenceEnd >= 80) return window.slice(0, sentenceEnd + 1).trim();
  const wordEnd = window.lastIndexOf(' ');
  const cut = wordEnd >= 80 ? window.slice(0, wordEnd) : window.slice(0, max - 1);
  return `${cut.replace(/[\s,;:.\-–—]+$/u, '')}…`;
}

export function pageMetadata(
  lang: string,
  pathname: string,
  title: string,
  rawDescription: string,
  extra: Metadata = {},
): Metadata {
  const description = trimDescription(rawDescription);
  const brandedTitle = title.includes(company.name) ? title : `${title} | ${company.name}`;
  const images = [{ url: defaultSocialImage, width: 1200, height: 630, alt: company.name }];
  return {
    title: { absolute: brandedTitle },
    description,
    alternates: localizedAlternates(lang, pathname),
    ...extra,
    // Next.js replaces nested metadata rather than deeply merging it.
    openGraph: {
      type: 'website', siteName: company.name, locale: ogLocaleMap[lang] || lang.replace('-', '_'),
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
