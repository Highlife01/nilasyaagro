'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Locale } from '@/types';

interface WhatsAppFloatProps {
  lang: Locale;
  productName?: string;
}

export const WhatsAppFloat: React.FC<WhatsAppFloatProps> = ({ lang, productName }) => {
  const phoneNumber = '905336840175'; // Corporate Official WhatsApp: +90 533 684 01 75

  const getMessage = () => {
    if (lang === 'tr') {
      return productName
        ? `Merhaba Nilasya Agro Foods, ${productName} ihracatı ve güncel fiyat teklifi hakkında bilgi almak istiyorum.`
        : `Merhaba Nilasya Agro Foods, bakliyat ve hububat ihracatı için B2B proforma teklifi almak istiyorum.`;
    }
    return productName
      ? `Hello Nilasya Agro Foods Export Desk, I would like to request a quotation and export specifications for Turkish ${productName}.`
      : `Hello Nilasya Agro Foods Export Desk, I would like to inquire about pulses & grains B2B export offers from Türkiye.`;
  };

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(getMessage())}`;

  return (
    <aside aria-label="WhatsApp Contact" className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Talk to our Export Team on WhatsApp"
        className="group flex min-h-12 min-w-12 touch-manipulation items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 px-3 py-3 text-sm font-extrabold text-white rounded-full shadow-2xl shadow-emerald-950/40 hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white/30 backdrop-blur-sm sm:px-4"
      >
        <div className="relative">
          <MessageCircle className="h-5 w-5 shrink-0 fill-white text-emerald-600 transition-transform group-hover:rotate-12" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 border-2 border-emerald-600 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 border-2 border-emerald-600 rounded-full" />
        </div>
        <span className="hidden sm:inline font-bold tracking-wide">
          {lang === 'tr' ? 'WhatsApp İhracat Masası (+90 533 684 01 75)' : 'WhatsApp Export Desk (+90 533 684 01 75)'}
        </span>
      </a>
    </aside>
  );
};
