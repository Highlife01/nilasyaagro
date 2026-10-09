'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Locale } from '@/types';
import { company } from '@/data/company';
import { getPageTranslations } from '@/data/pageTranslations';

interface WhatsAppFloatProps {
  lang: Locale;
  productName?: string;
}

export const WhatsAppFloat: React.FC<WhatsAppFloatProps> = ({ lang, productName }) => {
  const t = getPageTranslations(lang).whatsapp;
  const message = productName ? t.msgProduct(productName) : t.msgDefault;
  const whatsappUrl = `https://wa.me/${company.whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <aside aria-label={t.tooltip} className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] end-4 z-40 sm:bottom-6 sm:end-6">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.tooltip}
        className="group flex min-h-12 min-w-12 touch-manipulation items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 px-3 py-3 text-sm font-extrabold text-white rounded-full shadow-2xl shadow-emerald-950/40 hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white/30 backdrop-blur-sm sm:px-4"
      >
        <div className="relative">
          <MessageCircle aria-hidden="true" className="h-5 w-5 shrink-0 fill-white text-emerald-600 transition-transform group-hover:rotate-12" />
          <span aria-hidden="true" className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 border-2 border-emerald-600 rounded-full motion-safe:animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 border-2 border-emerald-600 rounded-full" />
        </div>
        <span className="hidden sm:inline font-bold tracking-wide">
          {t.tooltip}
        </span>
      </a>
    </aside>
  );
};
