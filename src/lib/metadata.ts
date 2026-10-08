import type { Metadata } from 'next';
import { supportedLanguages } from '@/data/languages';
import { company } from '@/data/company';

export function localizedAlternates(lang: string, pathname = '', languageCodes?: string[]): Metadata['alternates'] {
  const normalized = pathname ? `/${pathname.replace(/^\/+|\/+$/g, '')}/` : '/';
  const languages: Record<string, string> = {
    'x-default': `${company.baseUrl}/en${normalized}`,
  };

  for (const language of supportedLanguages.filter(({ code }) => !languageCodes || languageCodes.includes(code))) {
    languages[language.code] = `${company.baseUrl}/${language.code}${normalized}`;
  }

  return {
    canonical: `${company.baseUrl}/${lang}${normalized}`,
    languages,
  };
}

export function pageMetadata(
  lang: string,
  pathname: string,
  title: string,
  description: string,
  extra: Metadata = {},
): Metadata {
  return {
    title,
    description,
    alternates: localizedAlternates(lang, pathname),
    ...extra,
  };
}
