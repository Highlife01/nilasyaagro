import type { MetadataRoute } from 'next';
import { company } from '@/data/company';
import { supportedLanguages } from '@/data/languages';
import { productsData } from '@/data/products';
import { exportCountriesData } from '@/data/countries';
import { insightArticles } from '@/data/insights';
import { localizedUrl } from '@/lib/metadata';
import { varietySlug } from '@/lib/structuredData';

export const dynamic = 'force-static';

const staticPaths = ['', 'about', 'contact', 'export', 'harvest-calendar', 'insights', 'packaging', 'privacy-policy', 'production', 'products', 'quality', 'quote', 'sustainability', 'terms'];

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [];
  const publishedUrls = new Set<string>();
  function addLocalizedPages(pathFor: (code: string) => string, { lastModified, images = [] }: { lastModified?: string; images?: string[] } = {}) {
    // Only editorial dates describe a content update; rebuilding does not.
    if (lastModified && (!/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(lastModified) || Number.isNaN(Date.parse(lastModified)))) {
      throw new Error(`Invalid sitemap modification date: ${lastModified}`);
    }
    const languages = Object.fromEntries(supportedLanguages.map(({ code }) => [code, localizedUrl(code, pathFor(code))]));
    languages['x-default'] = localizedUrl('en', pathFor('en'));
    const imageUrls = [...new Set(images.filter(Boolean).map((image) => new URL(image, company.baseUrl).href))];
    for (const { code } of supportedLanguages) {
      const url = languages[code];
      if (publishedUrls.has(url)) throw new Error(`Duplicate sitemap page: ${url}`);
      publishedUrls.add(url);
      urls.push({ url, ...(lastModified ? { lastModified } : {}), ...(imageUrls.length ? { images: imageUrls } : {}), alternates: { languages } });
    }
  }
  for (const pathname of staticPaths) addLocalizedPages(() => pathname);
  for (const product of productsData) {
    const productPath = (code: string) => `products/${product.slug[code] || product.slug.en || product.id}`;
    addLocalizedPages(productPath, { images: [product.heroImage, ...product.galleryImages] });
    for (const variety of product.varieties || []) {
      addLocalizedPages((code) => `${productPath(code)}/${varietySlug(variety)}`, {
        images: [variety.image || variety.heroImage || product.heroImage, ...(variety.galleryImages || [])],
      });
    }
  }
  for (const country of exportCountriesData) addLocalizedPages(() => `export/${country.slug}`);
  for (const article of insightArticles) addLocalizedPages(() => `insights/${article.slug}`, { lastModified: article.updatedAt, images: [article.image] });
  return urls;
}
