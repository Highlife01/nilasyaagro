'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Product, Locale } from '@/types';
import { FileText, Camera, ZoomIn, ChevronLeft, ChevronRight, X, ShieldCheck } from 'lucide-react';
import { getTranslations } from '@/data/translations';
import { getPageTranslations } from '@/data/pageTranslations';
import { getLocalizedSpecifications } from '@/lib/localizedContent';

interface ProductHeroProps {
  product: Product;
  lang: Locale;
  onOpenQuote: () => void;
}

export const ProductHero: React.FC<ProductHeroProps> = ({ product, lang, onOpenQuote }) => {
  const t = getTranslations(lang).productsSection;
  const pt = getPageTranslations(lang).productDetail;
  const specs = getLocalizedSpecifications(product, lang);

  const prodName = product.name[lang] || product.name.en;
  const prodCategory = product.category[lang] || product.category.en;
  const prodTagline = product.tagline[lang] || product.tagline.en;
  const prodFullDesc = product.fullDescription[lang] || product.fullDescription.en;

  const gallery = product.galleryImages && product.galleryImages.length > 0
    ? product.galleryImages
    : [product.heroImage];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const lightboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLightboxOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    lightboxRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsLightboxOpen(false);
      if (event.key === 'ArrowLeft') setActiveIndex(index => (index + gallery.length - 1) % gallery.length);
      if (event.key === 'ArrowRight') setActiveIndex(index => (index + 1) % gallery.length);
      if (event.key === 'Tab') {
        const controls = lightboxRef.current?.querySelectorAll<HTMLButtonElement>('button');
        if (!controls?.length) return;
        const first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      previousFocus?.focus();
    };
  }, [isLightboxOpen, gallery.length]);

  const activeImage = gallery[activeIndex] || product.heroImage;

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="relative pt-32 pb-20 bg-slate-950 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <span>{prodCategory}</span>
              <span>•</span>
              <span className="italic font-mono">{product.scientificName}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
              {prodName}
            </h1>

            <p className="text-xl font-medium text-emerald-300">
              {prodTagline}
            </p>

            <p className="text-base text-slate-300 leading-relaxed font-normal">
              {prodFullDesc}
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                <div className="text-xs text-slate-400 font-medium">{pt.purityLabel}</div>
                <div className="text-sm font-bold text-white mt-0.5">{specs.purity}</div>
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                <div className="text-xs text-slate-400 font-medium">{pt.moistureLabel}</div>
                <div className="text-sm font-bold text-white mt-0.5">{specs.moisture}</div>
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl col-span-2 sm:col-span-1">
                <div className="text-xs text-slate-400 font-medium">{pt.proteinLabel}</div>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">{specs.protein}</div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onOpenQuote}
                className="min-h-12 touch-manipulation px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-xl shadow-emerald-950 transition-all hover:scale-105 flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>{t.requestPrice}</span>
              </button>

              {gallery.length > 1 && (
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(true)}
                  className="min-h-12 px-5 py-4 bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-white/15 transition-all flex items-center gap-2"
                >
                  <Camera className="w-4 h-4 text-emerald-400" />
                  <span>{pt.galleryTitle} ({gallery.length})</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Product Showcase Gallery */}
          <div className="lg:col-span-5 relative space-y-3">
            {/* Main Showcase Image */}
            <div 
              className="group relative h-[380px] sm:h-[460px] w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 cursor-pointer bg-slate-900"
            >
              <button type="button" onClick={() => setIsLightboxOpen(true)} aria-label={`${pt.galleryTitle}: ${prodName}`} className="absolute inset-0 h-full w-full focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-emerald-400">
              <Image
                src={activeImage}
                alt={`${prodName} — Nilasya Agro Foods`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              </button>

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

              {/* Verified Badge */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-lg">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{prodName}</span>
              </div>

              {/* Zoom prompt */}
              <div className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/70 backdrop-blur-md text-white/80 group-hover:text-white group-hover:bg-emerald-600 transition-all">
                <ZoomIn className="w-4 h-4" />
              </div>

              {/* Image Navigation Arrows (if multiple) */}
              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label={pt.previousPhoto}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-slate-950/70 hover:bg-emerald-600 text-white flex items-center justify-center backdrop-blur-sm border border-white/10 opacity-80 hover:opacity-100 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label={pt.nextPhoto}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-slate-950/70 hover:bg-emerald-600 text-white flex items-center justify-center backdrop-blur-sm border border-white/10 opacity-80 hover:opacity-100 transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Image counter at bottom right */}
              {gallery.length > 1 && (
                <div className="absolute bottom-4 right-4 z-10 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-sm border border-white/10 text-[11px] font-mono font-bold text-slate-300">
                  {activeIndex + 1} / {gallery.length}
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {gallery.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 scrollbar-thin scrollbar-thumb-white/20">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`${pt.viewPhoto} ${idx + 1}`}
                    aria-pressed={idx === activeIndex}
                    className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      idx === activeIndex
                        ? 'border-emerald-400 ring-2 ring-emerald-400/40 scale-105'
                        : 'border-white/15 opacity-60 hover:opacity-100 hover:border-white/40'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${prodName} detail gallery photo ${idx + 1}`}
                      fill
                      sizes="72px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          ref={lightboxRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${pt.galleryTitle}: ${prodName}`}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div className="absolute top-5 right-5 flex items-center gap-3 z-50">
            <span className="text-xs font-mono text-slate-400">
              {activeIndex + 1} / {gallery.length}
            </span>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              aria-label={pt.closeGallery}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div 
            className="relative w-full max-w-5xl h-[70vh] sm:h-[80vh] rounded-2xl overflow-hidden border border-white/15 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeImage}
              alt={prodName}
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-contain"
            />
          </div>

          {gallery.length > 1 && (
            <div 
              className="flex items-center gap-4 mt-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => handlePrev()}
                aria-label={pt.previousPhoto}
                className="p-3 rounded-full bg-white/10 hover:bg-emerald-600 text-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="flex gap-2 overflow-x-auto max-w-md p-1">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`${pt.viewPhoto} ${idx + 1}`}
                    aria-pressed={idx === activeIndex}
                    className={`relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      idx === activeIndex
                        ? 'border-emerald-400 scale-110'
                        : 'border-white/20 opacity-50 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`${prodName} lightbox thumbnail ${idx + 1}`} fill sizes="48px" className="object-cover" />
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => handleNext()}
                aria-label={pt.nextPhoto}
                className="p-3 rounded-full bg-white/10 hover:bg-emerald-600 text-white transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
