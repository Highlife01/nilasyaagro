'use client';

import React, { useState } from 'react';
import { 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Search, 
  Globe, 
  ShieldCheck, 
  BookOpen, 
  Check 
} from 'lucide-react';
import Link from 'next/link';
import { insightArticles } from '@/data/insights';

export const InsightsTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredArticles = insightArticles.filter((article) => {
    const term = searchTerm.toLowerCase();
    const title = (article.title.tr || article.title.en || '').toLowerCase();
    const excerpt = (article.excerpt.tr || article.excerpt.en || '').toLowerCase();
    return title.includes(term) || excerpt.includes(term) || article.slug.includes(term);
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-950 tracking-tight">
            Pazar Rehberleri & GEO / SEO Deski
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Uluslararası süpermarket zincirleri ve toptancılar için hazırlanan, 30 dilde eş zamanlı yayınlanan sektörel ihracat makaleleri ve AI arama görünürlüğü.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-emerald-800 shadow-2xs">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>GEO / AI Search Readiness: 99/100</span>
        </div>
      </div>

      {/* AI & GEO Technical Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Yayınlanan Makaleler</div>
          <div className="text-2xl font-black text-slate-950 mt-1">{insightArticles.length} Stratejik Rehber</div>
          <div className="text-xs text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            <span>30 dilde eş zamanlı yayında</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Sitemap İndeksi</div>
          <div className="text-2xl font-black text-slate-950 mt-1">2.220 Sayfa</div>
          <div className="text-xs text-emerald-700 font-medium mt-1">GSC tarafından keşfedildi</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">AI Entity & LLM Desteği</div>
          <div className="text-2xl font-black text-slate-950 mt-1 font-mono">llms-full.txt</div>
          <div className="text-xs text-emerald-700 font-medium mt-1">ChatGPT, Claude, Perplexity aktif</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Google Analytics 4</div>
          <div className="text-lg font-black text-slate-950 mt-1 font-mono">G-ST5MWN0FR3</div>
          <div className="text-xs text-emerald-700 font-medium mt-1">Canlı telemetri aktif</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between shadow-xs">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Makale başlığı, etiket veya kategori ara..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium hidden sm:inline">
          {filteredArticles.length} Makale
        </span>
      </div>

      {/* Articles Grid */}
      <div className="space-y-4">
        {filteredArticles.map((article) => (
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

              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {article.excerpt.tr || article.excerpt.en}
              </p>

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {article.tags.map((tag, i) => (
                  <span key={i} className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 font-medium">
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
                  <span>Aktif (30 Dilde Yayında)</span>
                </div>
              </div>

              <Link
                href={`/tr/insights/${article.slug}/`}
                target="_blank"
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <span>Makaleyi İncele</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
