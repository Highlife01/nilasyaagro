'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, ShieldCheck, CheckCircle2, MessageCircle, Globe, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { Locale } from '@/types';
import { getTranslations } from '@/data/translations';
import { productsData } from '@/data/products';
import { supportedLanguages } from '@/data/languages';
import { insightArticles } from '@/data/insights';
import { company } from '@/data/company';

interface FooterProps {
  lang: Locale;
  onOpenQuote: () => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onOpenQuote }) => {
  const t = getTranslations(lang).footer;
  const navT = getTranslations(lang).nav;

  const getProductHref = (slugObj: Record<string, string>, id: string) => {
    const slug = slugObj[lang] || slugObj.en || id;
    return `/${lang}/products/${slug}/`;
  };

  return (
    <footer className="bg-slate-950 text-slate-200 border-t border-emerald-900/40">
      {/* Top Value Banner - High Contrast & Visual Trust */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-b border-emerald-800/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-black text-white">ISO 22000 & HACCP / HALAL</div>
                <div className="text-xs text-slate-300 font-medium">Sortex Cleaned Food Safety</div>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-black text-white">Bühler Sortex Optical Sizing</div>
                <div className="text-xs text-slate-300 font-medium">99.8% Purity & Caliber Sizing</div>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-black text-white">Mersin Seaport Departure</div>
                <div className="text-xs text-slate-300 font-medium">24h Official Proforma Offer</div>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <button
                type="button"
                onClick={onOpenQuote}
                className="w-full py-3 px-5 bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-700 hover:from-amber-400 hover:to-emerald-600 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-emerald-950/60 hover:scale-105"
              >
                {navT.requestQuote}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Column 1: Brand & Official Positioning (Span 4) */}
          <div className="lg:col-span-4 space-y-5">
            <Link href={`/${lang}/`} className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-[#071F18] flex items-center justify-center text-amber-400 font-black text-2xl shadow-lg shadow-emerald-900/40 border border-amber-400/30">
                N
              </div>
              <div className="flex items-center gap-1.5 text-2xl font-black tracking-tight text-white">
                <span>NILASYA</span>
                <span className="text-amber-400 font-bold tracking-wider">AGRO FOODS</span>
              </div>
            </Link>

            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              {t.description}
            </p>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-emerald-500/30 text-[11px] text-emerald-300 font-semibold leading-snug">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 inline mr-1.5 -mt-0.5" />
              <span>{t.entityStatement}</span>
            </div>

            {/* Direct WhatsApp Contact Button (05336840175) */}
            <div className="pt-1">
              <a
                href="https://wa.me/905336840175"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-white rounded-2xl text-xs font-black transition-all shadow-lg shadow-emerald-950/60 hover:scale-105"
              >
                <MessageCircle className="w-4 h-4 fill-white text-emerald-700" />
                <span>WhatsApp Export Desk: +90 533 684 01 75</span>
              </a>
            </div>
          </div>

          {/* Column 2: Products Catalog (Span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider text-emerald-400">
              {t.products}
            </h4>
            <ul className="space-y-2 text-xs">
              {productsData.map((prod) => (
                <li key={prod.id}>
                  <Link
                    href={getProductHref(prod.slug, prod.id)}
                    className="text-slate-300 hover:text-emerald-400 transition-colors font-medium flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{prod.name[lang] || prod.name.en}</span>
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href={`/${lang}/products/`}
                  className="text-emerald-400 font-bold hover:underline inline-flex items-center gap-1 text-xs"
                >
                  <span>{lang === 'tr' ? 'Tüm Ürünler' : 'All Products'}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Corporate & Standards (Span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider text-emerald-400">
              {t.company}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href={`/${lang}/about/`} className="text-slate-300 hover:text-white transition-colors">
                  {navT.about}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/production/`} className="text-slate-300 hover:text-white transition-colors">
                  {navT.production}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/quality/`} className="text-slate-300 hover:text-white transition-colors">
                  {navT.quality}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/packaging/`} className="text-slate-300 hover:text-white transition-colors">
                  {navT.packaging}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/export/`} className="text-slate-300 hover:text-white transition-colors">
                  {navT.export}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/harvest-calendar/`} className="text-slate-300 hover:text-white transition-colors">
                  {navT.calendar}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/sustainability/`} className="text-slate-300 hover:text-white transition-colors">
                  {navT.sustainability}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: B2B Insights & Export Guides (Moved here per user request!) & Contact (Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="space-y-2.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>{lang === 'tr' ? 'İhracat Rehberleri & Insights' : 'B2B Sourcing Guides'}</span>
              </h4>
              <ul className="space-y-2 text-xs">
                {insightArticles.slice(0, 3).map((art) => (
                  <li key={art.slug}>
                    <Link
                      href={`/${lang}/insights/${art.slug}/`}
                      className="text-slate-300 hover:text-emerald-300 transition-colors line-clamp-1 leading-snug font-medium"
                    >
                      • {art.title[lang] || art.title.en}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href={`/${lang}/insights/`}
                    className="text-emerald-400 font-bold hover:underline inline-flex items-center gap-1 pt-1 text-xs"
                  >
                    <span>{lang === 'tr' ? 'Tüm Rehber ve Analizler →' : 'View All Market Guides →'}</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="border-t border-slate-800 pt-3 space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{t.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:+905336840175" className="hover:text-white font-bold">
                  +90 533 684 01 75
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`mailto:${company.email}`} className="hover:text-white">
                  {company.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 30 Global Languages Strip */}
        <div className="mt-12 pt-8 border-t border-slate-900">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-4">
            <Globe className="w-4 h-4" />
            <span>30 Global Languages / 30 Dilde Uluslararası İhracat Portalı:</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-300">
            {supportedLanguages.map((l) => (
              <Link
                key={l.code}
                href={`/${l.code}/`}
                className={`hover:text-amber-400 transition-colors p-1 rounded-lg ${
                  l.code === lang ? 'text-amber-400 font-extrabold underline underline-offset-4 bg-emerald-950/60' : ''
                }`}
              >
                <span className="mr-1.5">{l.flag}</span>
                <span>{l.nativeName}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Copyright & Legal Links */}
        <div className="mt-8 pt-6 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} Nilasya Agro Foods. {t.rights}
          </div>
          <div className="flex items-center gap-6 font-medium">
            <Link href={`/${lang}/privacy-policy/`} className="hover:text-white transition-colors">
              {t.privacy}
            </Link>
            <Link href={`/${lang}/terms/`} className="hover:text-white transition-colors">
              {t.terms}
            </Link>
            <a href="/llms.txt" className="text-emerald-400 hover:text-emerald-300 font-bold" target="_blank">
              llms.txt (AI Knowledge)
            </a>
            <a href="/sitemap.xml" className="hover:text-white transition-colors" target="_blank">
              sitemap.xml
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
