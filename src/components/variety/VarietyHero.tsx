'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product, Variety, Locale } from '@/types';
import { 
  ShieldCheck, 
  ThermometerSnowflake, 
  Calendar, 
  Sparkles, 
  FileText, 
  Send, 
  ChevronRight, 
  Scale, 
  Gauge 
} from 'lucide-react';
import { company } from '@/data/company';

interface VarietyHeroProps {
  product: Product;
  variety: Variety;
  lang: Locale;
  onOpenQuote: () => void;
}

export const VarietyHero: React.FC<VarietyHeroProps> = ({
  product,
  variety,
  lang,
  onOpenQuote,
}) => {
  const isTr = lang === 'tr';
  const productName = product.name[lang] || product.name.en || product.id;
  const varietyName = isTr ? (variety.nameTr || variety.name) : variety.name;
  const varietyDesc = isTr ? (variety.descriptionTr || variety.description) : variety.description;
  const tagline = isTr ? (variety.taglineTr || variety.tagline || varietyDesc) : (variety.tagline || varietyDesc);
  const harvestText = isTr ? (variety.harvestMonthsTr || variety.harvestMonths) : variety.harvestMonths;
  const storageText = isTr ? (variety.storageTr || variety.storage) : variety.storage;
  const shelfLifeText = isTr ? (variety.shelfLifeTr || variety.shelfLife) : variety.shelfLife;
  const productSlug = product.slug[lang] || product.slug.en || product.id;

  const heroImg = variety.image || variety.heroImage || product.heroImage;

  return (
    <div className="relative bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 text-white pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -right-40 w-[30rem] h-[30rem] bg-teal-600 rounded-full blur-[160px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs Navigation */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-xs text-emerald-300/80">
            <li>
              <Link href={`/${lang}/`} className="hover:text-white transition-colors">
                {isTr ? 'Ana Sayfa' : 'Home'}
              </Link>
            </li>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-500/50" />
            <li>
              <Link href={`/${lang}/products/`} className="hover:text-white transition-colors">
                {isTr ? 'Ürünlerimiz' : 'Export Products'}
              </Link>
            </li>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-500/50" />
            <li>
              <Link 
                href={`/${lang}/products/${productSlug}/`} 
                className="hover:text-white transition-colors"
              >
                {productName}
              </Link>
            </li>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-500/50" />
            <li className="text-white font-semibold truncate max-w-xs sm:max-w-md">
              {varietyName}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Variety Info & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>
                {isTr ? 'İhracat Standartı Grade 1 / Extra Class' : 'Export Standard Grade 1 / Extra Class'}
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-widest text-emerald-400/90 block">
                {productName} • {product.scientificName}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                {varietyName}
              </h1>
            </div>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-light">
              {tagline}
            </p>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-white/5 border border-white/10 backdrop-blur-md p-3.5 rounded-2xl">
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold mb-1">
                  <Scale className="w-3.5 h-3.5" />
                  <span>{isTr ? 'Kalibre / Çap' : 'Caliber / Size'}</span>
                </div>
                <div className="text-sm font-bold text-white truncate">
                  {variety.caliber || variety.size}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 backdrop-blur-md p-3.5 rounded-2xl">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold mb-1">
                  <Gauge className="w-3.5 h-3.5" />
                  <span>{isTr ? 'Şeker Oranı' : 'Brix Level'}</span>
                </div>
                <div className="text-sm font-bold text-white truncate">
                  {variety.brix}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 backdrop-blur-md p-3.5 rounded-2xl">
                <div className="flex items-center gap-1.5 text-blue-400 text-xs font-semibold mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{isTr ? 'Hasat' : 'Harvest'}</span>
                </div>
                <div className="text-sm font-bold text-white truncate">
                  {harvestText}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 backdrop-blur-md p-3.5 rounded-2xl">
                <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-semibold mb-1">
                  <ThermometerSnowflake className="w-3.5 h-3.5" />
                  <span>{isTr ? 'Raf Ömrü' : 'Storage Life'}</span>
                </div>
                <div className="text-sm font-bold text-white truncate">
                  {shelfLifeText || storageText}
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                type="button"
                onClick={onOpenQuote}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-400/40 transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <Send className="w-4 h-4" />
                <span>
                  {isTr ? 'Bu Çeşit İçin Fiyat Teklifi Al' : 'Request Quotation for this Variety'}
                </span>
              </button>

              <Link
                href={`/${lang}/contact/`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/15 backdrop-blur-md transition-all"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>
                  {isTr ? 'İhracat Şartnamesi & Bilgi' : 'Export Specifications & Specs'}
                </span>
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5">
            <div className="relative group">
              {/* Outer decorative ring */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-500" />

              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-900 border border-white/15 shadow-2xl">
                <Image
                  src={heroImg}
                  alt={`${varietyName} - Nilasya Agro Foods`}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                {/* Bottom Card Overlay */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                      {isTr ? 'Orijinal Nil Asya Ambalajı' : 'Authentic Nil Asya Export Pack'}
                    </div>
                    <div className="text-xs font-bold text-white">
                      {variety.color}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>GlobalGAP / ISO</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
