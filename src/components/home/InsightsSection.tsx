'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';
import { Locale } from '@/types';
import { getTranslations } from '@/data/translations';
import { insightArticles } from '@/data/insights';

export const InsightsSection: React.FC<{ lang: Locale }> = ({ lang }) => {
  const t = getTranslations(lang).insightsSection;

  return (
    <section className="py-20 lg:py-28 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold uppercase tracking-widest">
            <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t.tag}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            {t.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* 3 Insight Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {insightArticles.slice(0, 3).map((article) => {
            const articleTitle = article.title[lang] || article.title.en;
            const articleCategory = article.category[lang] || article.category.en;
            const articleExcerpt = article.excerpt[lang] || article.excerpt.en;

            return (
              <article
                key={article.slug}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200/80 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={article.image}
                      alt={articleTitle}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-emerald-950 bg-white/90 backdrop-blur-md shadow-sm">
                        {articleCategory}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-4 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{article.readTime}</span>
                      </span>
                      <span>{article.publishedAt}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                      <Link href={`/${lang}/insights/${article.slug}/`}>
                        {articleTitle}
                      </Link>
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                      {articleExcerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2">
                  <Link
                    href={`/${lang}/insights/${article.slug}/`}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5"
                  >
                    <span>{t.readMore}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            href={`/${lang}/insights/`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-colors"
          >
            <span>{t.viewAll}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
