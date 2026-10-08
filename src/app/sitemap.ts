import type { MetadataRoute } from 'next';
import { company } from '@/data/company';

export const dynamic = 'force-static';
import { supportedLanguages } from '@/data/languages';
import { productsData } from '@/data/products';
import { exportCountriesData } from '@/data/countries';
import { insightArticles } from '@/data/insights';

const staticPaths = ['', 'about', 'contact', 'export', 'harvest-calendar', 'insights', 'packaging', 'privacy-policy', 'production', 'products', 'quality', 'quote', 'sustainability', 'terms'];

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [];
  for (const { code } of supportedLanguages) {
    for (const pathname of staticPaths) {
      urls.push({ url: `${company.baseUrl}/${code}/${pathname ? `${pathname}/` : ''}`, changeFrequency: pathname ? 'monthly' : 'weekly', priority: pathname ? 0.7 : 1 });
    }
    for (const product of productsData) {
      const prodSlug = product.slug[code] || product.slug.en || product.id;
      urls.push({ url: `${company.baseUrl}/${code}/products/${prodSlug}/`, changeFrequency: 'weekly', priority: 0.9 });
      if (product.varieties && product.varieties.length > 0) {
        for (const v of product.varieties) {
          const varSlug = (typeof v.slug === 'string'
            ? v.slug
            : v.id || v.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')).toLowerCase();
          urls.push({
            url: `${company.baseUrl}/${code}/products/${prodSlug}/${varSlug}/`,
            changeFrequency: 'weekly',
            priority: 0.85,
          });
        }
      }
    }
    for (const country of exportCountriesData) {
      urls.push({ url: `${company.baseUrl}/${code}/export/${country.slug}/`, changeFrequency: 'monthly', priority: 0.7 });
    }
    for (const article of insightArticles) {
      urls.push({ url: `${company.baseUrl}/${code}/insights/${article.slug}/`, changeFrequency: 'monthly', priority: 0.6 });
    }
  }
  return urls;
}
