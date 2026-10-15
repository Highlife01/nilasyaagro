import type { MetadataRoute } from 'next';
import { company } from '@/data/company';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const aiCrawlers = [
    'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'PerplexityBot',
    'Google-Extended', 'Applebot-Extended', 'CCBot',
  ];
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
        // Admin and error pages remain crawlable so their noindex can be read.
      },
      {
        userAgent: aiCrawlers,
        allow: ['/', '/llms.txt', '/llms-full.txt', '/llms-tr.txt', '/llms-ar.txt', '/.well-known/llms.txt'],
        disallow: ['/api/'],
      },
    ],
    host: company.baseUrl,
    sitemap: `${company.baseUrl}/sitemap.xml`,
  };
}
