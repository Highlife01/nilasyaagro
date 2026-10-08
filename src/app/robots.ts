import type { MetadataRoute } from 'next';
import { company } from '@/data/company';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const aiAgents = [
    '*',
    'GPTBot',
    'ChatGPT-User',
    'OAI-SearchBot',
    'Google-Extended',
    'Googlebot',
    'ClaudeBot',
    'Claude-Web',
    'PerplexityBot',
    'Applebot',
    'Applebot-Extended',
    'Amazonbot',
    'cohere-ai',
    'Meta-ExternalAgent',
    'Bytespider',
    'Diffbot',
  ];

  return {
    rules: aiAgents.map((userAgent) => ({
      userAgent,
      allow: '/',
      disallow: ['/admin/'],
    })),
    sitemap: `${company.baseUrl}/sitemap.xml`,
    host: company.baseUrl,
  };
}
