import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';
import { supportedLanguages } from '@/data/languages';
import { productsData } from '@/data/products';
import { exportCountriesData } from '@/data/countries';
import { insightArticles } from '@/data/insights';
import { localizedUrl } from '@/lib/metadata';
import { varietySlug } from '@/lib/structuredData';

const staticPaths = ['', 'about', 'contact', 'export', 'harvest-calendar', 'insights', 'packaging', 'privacy-policy', 'production', 'products', 'quality', 'quote', 'sustainability', 'terms'];

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [];
  function addLocalizedPages(pathFor: (code: string) => string, lastModified?: string) {
    const languages = Object.fromEntries(supportedLanguages.map(({ code }) => [code, localizedUrl(code, pathFor(code))]));
    languages['x-default'] = localizedUrl('en', pathFor('en'));
    for (const { code } of supportedLanguages) {
      urls.push({ url: languages[code], ...(lastModified ? { lastModified } : {}), alternates: { languages } });
    }
  }
  for (const pathname of staticPaths) addLocalizedPages(() => pathname);
  for (const product of productsData) {
    const productPath = (code: string) => `products/${product.slug[code] || product.slug.en || product.id}`;
    addLocalizedPages(productPath);
    for (const variety of product.varieties || []) {
      addLocalizedPages((code) => `${productPath(code)}/${varietySlug(variety)}`);
    }
  }
  for (const country of exportCountriesData) addLocalizedPages(() => `export/${country.slug}`);
  for (const article of insightArticles) addLocalizedPages(() => `insights/${article.slug}`, article.updatedAt);
  return urls;
}
