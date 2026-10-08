'use client';

import React from 'react';
import { ExternalLink, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';
import { insightArticles } from '@/data/insights';

export const InsightsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-950 tracking-tight">
            Pazar Rehberleri & B2B İçerik Deski
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Uluslararası süpermarket zincirleri ve toptancılar için hazırlanan 25 dilde yayınlanan sektörel ihracat makaleleri ve GEO/SEO sıralaması.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-emerald-800 shadow-2xs">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>GEO / AI Search Score: 98/100</span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Yayınlanan Makaleler</div>
          <div className="text-2xl font-black text-slate-950 mt-1">{insightArticles.length} Stratejik Rehber</div>
          <div className="text-xs text-emerald-700 font-medium mt-1">25 dilde eş zamanlı yayında</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">B2B Organik Trafik</div>
          <div className="text-2xl font-black text-slate-950 mt-1">14,280 / Ay</div>
          <div className="text-xs text-emerald-700 font-medium mt-1">Almanya, BAE, İngiltere ağırlıklı</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">AI Entity & LLM Desteği</div>
          <div className="text-2xl font-black text-slate-950 mt-1">llms-full.txt</div>
          <div className="text-xs text-emerald-700 font-medium mt-1">ChatGPT, Perplexity & Claude indeksli</div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="space-y-4">
        {insightArticles.map((article) => (
          <div
            key={article.slug}
            className="bg-white border border-slate-200/80 rounded-3xl p-6 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800">
                  {article.category.tr || article.category.en}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  {article.readTime}
                </span>
                <span className="text-xs text-slate-500">
                  Yazar: {article.author}
                </span>
              </div>

              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                {article.title.tr || article.title.en}
              </h2>

              <p className="text-xs text-slate-500 line-clamp-2">
                {article.excerpt.tr || article.excerpt.en}
              </p>

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {article.tags.map((tag, i) => (
                  <span key={i} className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 shrink-0">
              <div className="text-right text-xs">
                <div className="text-[11px] text-slate-500 font-medium">Yayın Durumu</div>
                <div className="text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Aktif (25 Dil)</span>
                </div>
              </div>

              <Link
                href={`/tr/insights/${article.slug}/`}
                target="_blank"
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <span>Rehberi Oku</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
