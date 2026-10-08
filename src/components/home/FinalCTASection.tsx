'use client';

import React from 'react';
import { FileText, MessageCircle, Sparkles } from 'lucide-react';
import { Locale } from '@/types';
import { getTranslations } from '@/data/translations';

interface FinalCTASectionProps {
  lang: Locale;
  onOpenQuote: () => void;
}

export const FinalCTASection: React.FC<FinalCTASectionProps> = ({ lang, onOpenQuote }) => {
  const t = getTranslations(lang).finalCta;

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-emerald-950 via-slate-950 to-teal-950 text-white relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>DIRECT GROWER SOURCING</span>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
          {t.title}
        </h2>

        <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
          {t.subtitle}
        </p>

        {/* Action Buttons */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={onOpenQuote}
            className="w-full sm:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-2xl shadow-emerald-500/30 transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>{t.btnQuote}</span>
          </button>

          <a
            href="https://wa.me/905336840175"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >

            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>{t.btnWhatsapp}</span>
          </a>
        </div>
      </div>
    </section>
  );
};
