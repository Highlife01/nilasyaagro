'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ArrowRight, FileText, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Locale } from '@/types';
import { getTranslations } from '@/data/translations';

interface HeroSectionProps {
  lang: Locale;
  onOpenQuote: () => void;
}

const HERO_SLIDES = [
  {
    id: 'chickpeas',
    image: '/images/products/turkish-chickpeas-kabuli-nilasya.jpg',
    alt: 'Turkish Kabuli Chickpeas (Koçbaşı 8mm-10mm) export - Nilasya Agro Foods',
    badgeTr: '🟡 Koçbaşı Nohut • Kalibre 8mm - 10mm • Sortex %99.8 Saflık',
    badgeEn: '🟡 Koçbaşı Kabuli Chickpeas • 8mm - 10mm • 99.8% Sortex Purity',
    titleTr: 'Koçbaşı Nohut',
    titleEn: 'Koçbaşı Chickpeas',
    descTr: '8mm-10mm • Sortex %99.8',
    descEn: '8mm-10mm • 99.8% Purity',
    accentColor: '#C8963E',
  },
  {
    id: 'red_lentils',
    image: '/images/products/turkish-red-lentils-nilasya.jpg',
    alt: 'Turkish Red Football & Split Lentils export - Nilasya Agro Foods',
    badgeTr: '🔴 Kırmızı Mercimek (Futbol & Yaprak) • %25 Protein • Mersin Kırım',
    badgeEn: '🔴 Red Lentils (Football & Split) • 25% Protein • Milled in Mersin',
    titleTr: 'Kırmızı Mercimek',
    titleEn: 'Red Lentils',
    descTr: 'Futbol & Yaprak • Sortex',
    descEn: 'Football & Split Sortex',
    accentColor: '#D9532F',
  },
  {
    id: 'green_lentils',
    image: '/images/products/turkish-green-lentils-nilasya.jpg',
    alt: 'Turkish Green Lentils (Laird & Eston) export - Nilasya Agro Foods',
    badgeTr: '🟢 Yeşil Mercimek (Laird & Eston 5mm-7mm) • İç Anadolu Yaylası',
    badgeEn: '🟢 Turkish Green Lentils (Laird & Eston 5mm-7mm) • Anatolian Terroir',
    titleTr: 'Yeşil Mercimek',
    titleEn: 'Green Lentils',
    descTr: 'Laird & Eston 5-7mm',
    descEn: 'Laird & Eston 5-7mm',
    accentColor: '#5B7E45',
  },
  {
    id: 'white_beans',
    image: '/images/products/turkish-white-beans-dermason-nilasya.jpg',
    alt: 'Turkish Dermason White Beans export - Nilasya Agro Foods',
    badgeTr: '⚪ Erzincan Dermason Kuru Fasulye • 8mm - 9mm • İnce Kabuk Lokum Kıvam',
    badgeEn: '⚪ Dermason White Beans • 8mm - 9mm • Thin Skin Gourmet Canning',
    titleTr: 'Dermason Fasulye',
    titleEn: 'Dermason Beans',
    descTr: '8-9mm • İnce Kabuk',
    descEn: '8-9mm • Canning Grade',
    accentColor: '#C2A878',
  },
  {
    id: 'durum_wheat',
    image: '/images/products/turkish-durum-wheat-bulgur-nilasya.jpg',
    alt: 'Turkish Durum Wheat & Traditional Bulgur export - Nilasya Agro Foods',
    badgeTr: '🌾 Kehribar Durum Buğdayı (%13.5+ Protein) & Geleneksel Sarı Bulgur',
    badgeEn: '🌾 Amber Durum Wheat (>13.5% Protein) & Authentic Turkish Bulgur',
    titleTr: 'Durum Buğdayı & Bulgur',
    titleEn: 'Durum Wheat & Bulgur',
    descTr: '%13.5+ Protein • Haşlanmış',
    descEn: '>13.5% Protein • Parboiled',
    accentColor: '#DF9B35',
  },
  {
    id: 'warehouse_export',
    image: '/images/hero/pulses-export-warehouse-nilasya.jpg',
    alt: 'Mersin Seaport Direct Container Loading - Nilasya Agro Foods',
    badgeTr: '🚢 Mersin Limanı Direkt Yükleme • 25/50kg Çuval & 1000kg Big Bag',
    badgeEn: '🚢 Mersin Seaport Direct Loading • 25/50kg PP Sacks & 1,000kg Big Bags',
    titleTr: 'Mersin Liman Lojistiği',
    titleEn: 'Mersin Port Logistics',
    descTr: '25/50kg Çuval & Big Bag',
    descEn: 'PP Sacks & Jumbo Big Bags',
    accentColor: '#10B981',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ lang, onOpenQuote }) => {
  const t = getTranslations(lang).hero;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const currentSlide = HERO_SLIDES[currentSlideIndex];

  return (
    <section
      className="relative flex min-h-[92vh] items-center justify-center overflow-hidden bg-[#071F18] pt-24 pb-16 lg:min-h-[95vh]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Nilasya Agro Foods Pulses & Grains Showcase"
    >
      {/* 6 Rotating Hero Backgrounds with Smooth Crossfade */}
      <div className="absolute inset-0 z-0">
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === currentSlideIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                className={`object-cover object-center transform transition-transform duration-[7000ms] ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />
            </div>
          );
        })}

        {/* Dual High-Contrast Overlays with Corporate Forest Green / Dark Earth Tone */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#071F18] via-[#071F18]/80 to-[#071F18]/45" />
        <div className="absolute inset-0 z-20 bg-gradient-to-r from-[#071F18]/95 via-[#0D3B2E]/85 to-transparent lg:w-3/4" />
        <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_20%_40%,rgba(200,150,62,0.18),transparent_55%)]" />
      </div>

      <div className="relative z-30 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Hero Content (Left 8 Cols) */}
          <div className="lg:col-span-8 text-center lg:text-left space-y-6">
            
            {/* Top Corporate Badge & Active Commodity Pill */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-[#071F18]/90 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-amber-300 backdrop-blur-md shadow-lg shadow-black/40">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>{t.badge}</span>
              </div>

              {/* Dynamic Active Commodity Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-md animate-fade-in shadow-sm">
                <span>{lang === 'tr' ? currentSlide.badgeTr : currentSlide.badgeEn}</span>
              </div>
            </div>

            {/* Main Title Hierarchy */}
            <h1 className="text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl drop-shadow-xl">
              <span className="block">{t.titleLine1}</span>
              <span className="block bg-gradient-to-r from-amber-400 via-amber-200 to-emerald-300 bg-clip-text text-transparent">
                {t.titleLine2}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl text-lg font-normal leading-relaxed text-slate-200 sm:text-xl drop-shadow-md">
              {t.subtitle}
            </p>

            {/* Core Export Produce Bar */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-sm font-bold text-amber-300 sm:text-base">
              <span className="text-slate-300">{lang === 'tr' ? 'Başlıca İhraç Emtialarımız:' : 'Core Export Commodities:'}</span>
              <span className="rounded-2xl border border-white/15 bg-white/10 px-3.5 py-1.5 text-white backdrop-blur-sm shadow-sm">
                {t.productsList}
              </span>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-col items-center justify-center lg:justify-start gap-4 sm:flex-row">
              <a
                href="#products"
                className="flex min-h-12 w-full touch-manipulation sm:w-auto items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-[#0D3B2E] hover:from-amber-400 hover:to-amber-500 px-8 py-4 text-center text-sm font-black uppercase tracking-wider text-white shadow-2xl shadow-black/50 transition-all hover:scale-105 active:scale-95"
              >
                <span>{t.ctaPrimary}</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              <button
                type="button"
                onClick={onOpenQuote}
                className="flex min-h-12 w-full touch-manipulation sm:w-auto items-center justify-center gap-2 rounded-2xl border border-amber-400/40 bg-white/10 hover:bg-white/20 px-8 py-4 text-center text-sm font-bold uppercase tracking-wider text-white backdrop-blur-md transition-all hover:scale-105 active:scale-95"
              >
                <FileText className="h-4 w-4 text-amber-400" />
                <span>{t.ctaSecondary}</span>
              </button>
            </div>

            {/* Live Trust Metrics Grid */}
            <div className="pt-6 grid grid-cols-2 gap-4 border-t border-white/15 sm:grid-cols-4">
              <div className="space-y-0.5 text-center sm:text-left">
                <div className="font-mono text-2xl sm:text-3xl font-black text-white">{t.stats.countries}</div>
                <div className="text-sm text-slate-300 font-medium">{t.stats.countriesLabel}</div>
              </div>
              <div className="space-y-0.5 text-center sm:text-left">
                <div className="font-mono text-2xl sm:text-3xl font-black text-amber-400">{t.stats.supply}</div>
                <div className="text-sm text-slate-300 font-medium">{t.stats.supplyLabel}</div>
              </div>
              <div className="space-y-0.5 text-center sm:text-left">
                <div className="font-mono text-2xl sm:text-3xl font-black text-emerald-400">{t.stats.regions}</div>
                <div className="text-sm text-slate-300 font-medium">{t.stats.regionsLabel}</div>
              </div>
              <div className="space-y-0.5 text-center sm:text-left">
                <div className="font-mono text-2xl sm:text-3xl font-black text-amber-300">{t.stats.products}</div>
                <div className="text-sm text-slate-300 font-medium">{t.stats.productsLabel}</div>
              </div>
            </div>

          </div>

          {/* Slider Control & 6-Slide Mini Previews (Right 4 Cols) */}
          <div className="lg:col-span-4 hidden lg:flex flex-col items-end justify-end space-y-4">
            <div className="bg-[#071F18]/90 backdrop-blur-xl border border-white/15 p-4 rounded-3xl shadow-2xl space-y-3 w-full max-w-xs">
              <div className="flex items-center justify-between text-xs font-bold text-white pb-2 border-b border-white/10">
                <span className="text-amber-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>Export Commodities</span>
                </span>
                <span className="font-mono text-slate-400">
                  0{currentSlideIndex + 1} / 0{HERO_SLIDES.length}
                </span>
              </div>

              {/* 6 Thumbnails */}
              <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
                {HERO_SLIDES.map((slide, idx) => {
                  const isSelected = idx === currentSlideIndex;
                  return (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`w-full p-2 rounded-2xl transition-all flex items-center gap-2.5 text-left border ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
                      }`}
                    >
                      <div className="relative w-9 h-9 rounded-xl overflow-hidden shrink-0 border border-white/20">
                        <Image
                          src={slide.image}
                          alt={slide.alt}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="truncate flex-1">
                        <div className="text-xs font-bold truncate">
                          {lang === 'tr' ? slide.titleTr : slide.titleEn}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {lang === 'tr' ? slide.descTr : slide.descEn}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-1.5 h-5 rounded-full bg-amber-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Prev / Next Controls */}
              <div className="pt-1.5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={prevSlide}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1.5">
                  {HERO_SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === currentSlideIndex ? 'w-5 bg-amber-400' : 'w-2 bg-white/30'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={nextSlide}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Slide Dots Indicator */}
      <div className="lg:hidden absolute bottom-4 left-0 right-0 z-30 flex items-center justify-center gap-2">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentSlideIndex(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === currentSlideIndex ? 'w-7 bg-amber-400' : 'w-2.5 bg-white/40'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
