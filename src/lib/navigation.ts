import type { Locale } from '@/types';

export function localizedPathname(pathname: string, language: Locale, products: { id: string; slug: Record<string, string> }[]): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments[1] === 'products' && segments[2]) {
    const sourceSlug = decodeURIComponent(segments[2]).toLowerCase();
    const product = products.find((entry) => entry.id === sourceSlug || Object.values(entry.slug).some((slug) => slug.toLowerCase() === sourceSlug));
    if (product) segments[2] = product.slug[language] || product.slug.en || product.id;
  }
  return `/${language}/${segments.slice(1).join('/')}${segments.length > 1 ? '/' : ''}`;
}
