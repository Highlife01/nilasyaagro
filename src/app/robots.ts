import type { MetadataRoute } from 'next';
import { company } from '@/data/company';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
      // Admin and error pages remain crawlable so their noindex can be read.
    },
    sitemap: `${company.baseUrl}/sitemap.xml`,
    host: company.baseUrl,
  };
}
