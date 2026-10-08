import React from 'react';
import { notFound } from 'next/navigation';
import { insightArticles } from '@/data/insights';
import { supportedLanguages } from '@/data/languages';
import { Locale } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, User, Calendar, ArrowLeft, Tag } from 'lucide-react';
import { ClientCalendarWrapper } from '../../harvest-calendar/ClientCalendarWrapper';
import type { Metadata } from 'next';
import { localizedAlternates } from '@/lib/metadata';
import { getPageTranslations } from '@/data/pageTranslations';
import { company } from '@/data/company';

export function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];

  supportedLanguages.forEach((l) => {
    insightArticles.forEach((art) => {
      params.push({ lang: l.code, slug: art.slug });
    });
  });

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;
  const slug = resolvedParams.slug;

  const article = insightArticles.find((a) => a.slug === slug);
  if (!article) {
    return { title: `Article Not Found | ${company.name}` };
  }

  return {
    title: article.title[lang] || article.title.en,
    description: article.excerpt[lang] || article.excerpt.en,
    alternates: localizedAlternates(lang, `insights/${slug}`),
    robots: { index: true, follow: true },
    openGraph: {
      title: article.title[lang] || article.title.en,
      description: article.excerpt[lang] || article.excerpt.en,
      images: [{ url: article.image }],
    },
  };
}

export default async function InsightDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;
  const slug = resolvedParams.slug;
  const pt = getPageTranslations(lang).insightsPage;

  const article = insightArticles.find((a) => a.slug === slug);
  if (!article) notFound();

  const title = article.title[lang] || article.title.en;
  const content = article.content[lang] || article.content.en;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    image: `${company.baseUrl}${article.image}`,
    author: {
      '@type': 'Organization',
      name: 'Nilasya Agro Foods Export Desk',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Nilasya Agro Foods',
      logo: {
        '@type': 'ImageObject',
        url: `${company.baseUrl}/images/hero/hero-orchard-panoramic.webp`,
      },
    },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    description: article.excerpt[lang] || article.excerpt.en,
  };

  return (
    <article className="pt-28 pb-20 bg-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href={`/${lang}/insights`}
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 hover:text-emerald-950"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{pt.backToAll}</span>
          </Link>
        </div>

        <header className="space-y-4 mb-8">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100">
            {article.category[lang] || article.category.en}
          </span>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 pt-2 border-b border-slate-100 pb-4">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-600" />
              <span>{article.author}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>{article.publishedAt}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>{article.readTime}</span>
            </span>
          </div>
        </header>

        <div className="relative h-[340px] sm:h-[450px] rounded-3xl overflow-hidden shadow-xl mb-12">
          <Image
            src={article.image}
            alt={title}
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-relaxed prose-li:text-slate-700 whitespace-pre-line text-sm sm:text-base">
          {content}
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-wrap items-center gap-2">
          <Tag className="w-4 h-4 text-slate-400" />
          {article.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <ClientCalendarWrapper lang={lang} />
    </article>
  );
}
