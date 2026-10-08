'use client';

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react';
import Image from 'next/image';
import { ArrowDown, ArrowRight, ChevronLeft, ChevronRight, Pause, Play, Wheat } from 'lucide-react';
import type { Locale } from '@/types';
import { getTranslations } from '@/data/translations';
import { productsData } from '@/data/products';
import styles from './HeroSection.module.css';

interface HeroSectionProps {
  lang: Locale;
  onOpenQuote: () => void;
}

const SLIDE_DURATION = 6500;
const HERO_SLIDES = [
  { id: 'chickpeas', image: '/images/products/turkish-chickpeas-kabuli-nilasya.jpg', detail: 'KABULI · 8–10 MM', accent: '#e5bd76' },
  { id: 'red-lentils', image: '/images/products/turkish-red-lentils-nilasya.jpg', detail: 'FOOTBALL & SPLIT · SORTEX', accent: '#f39b75' },
  { id: 'green-lentils', image: '/images/products/turkish-green-lentils-nilasya.jpg', detail: 'LAIRD & ESTON · 5–7 MM', accent: '#bed69a' },
  { id: 'white-beans', image: '/images/products/turkish-white-beans-dermason-nilasya.jpg', detail: 'DERMASON · 8–9 MM', accent: '#eee1bd' },
  { id: 'durum-wheat-bulgur', image: '/images/products/turkish-durum-wheat-bulgur-nilasya.jpg', detail: 'DURUM · BULGUR', accent: '#f0c568' },
  { id: 'export', image: '/images/hero/pulses-export-warehouse-nilasya.jpg', detail: 'MERSİN · FOB / CIF / CFR', accent: '#93d9b8' },
] as const;

const HERO_PRODUCTS = new Map(productsData.map((product) => [product.id, product]));

function getSlideTitle(id: string, lang: Locale, exportTitle: string) {
  const product = HERO_PRODUCTS.get(id);
  const name = product ? product.name[lang] || product.name.en : exportTitle;
  return name.replace(/\s*\([^)]*\)/g, '').trim();
}

function subscribeToMotionPreference(callback: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
}
function getMotionPreference() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
function subscribeToVisibility(callback: () => void) {
  document.addEventListener('visibilitychange', callback);
  return () => document.removeEventListener('visibilitychange', callback);
}
function getVisibility() { return document.visibilityState === 'visible'; }
function getServerMotionPreference() { return true; }
function getServerVisibility() { return true; }

export function HeroSection({ lang, onOpenQuote }: HeroSectionProps) {
  const translations = getTranslations(lang);
  const t = translations.hero;
  const sectionRef = useRef<HTMLElement>(null);
  const pointerPlayIntent = useRef(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const reducedMotion = useSyncExternalStore(
    subscribeToMotionPreference, getMotionPreference, getServerMotionPreference,
  );
  const documentVisible = useSyncExternalStore(
    subscribeToVisibility, getVisibility, getServerVisibility,
  );
  const isPlaying = !isPaused && !isHovered && !reducedMotion && documentVisible && isInView;
  const currentSlide = HERO_SLIDES[currentSlideIndex];
  const currentTitle = getSlideTitle(currentSlide.id, lang, translations.nav.export);
  const ui = lang === 'tr'
    ? { previous: 'Önceki ürün', next: 'Sonraki ürün', pause: 'Slaytları duraklat', play: 'Slaytları oynat', scroll: 'Keşfetmek için kaydır', showcase: 'Ürün vitrini' }
    : { previous: 'Previous product', next: 'Next product', pause: 'Pause slideshow', play: 'Play slideshow', scroll: 'Scroll to discover', showcase: 'Product showcase' };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.15 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setTimeout(() => {
      setCurrentSlideIndex((index) => (index + 1) % HERO_SLIDES.length);
    }, SLIDE_DURATION);
    return () => window.clearTimeout(timer);
  }, [currentSlideIndex, isPlaying]);

  function selectSlide(index: number) {
    setCurrentSlideIndex((index + HERO_SLIDES.length) % HERO_SLIDES.length);
    setIsPaused(true);
  }

  return (
    <section
      ref={sectionRef}
      className={styles.hero}
      aria-label={ui.showcase}
      aria-roledescription="carousel"
      style={{ '--hero-accent': currentSlide.accent } as CSSProperties}
      onFocusCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(true);
      }}
    >
      <div className={styles.backgrounds} aria-hidden="true">
        {HERO_SLIDES.map((slide, index) => (
          <div key={slide.id} className={`${styles.background} ${index === currentSlideIndex ? styles.backgroundActive : ''}`}>
            <Image
              src={slide.image}
              alt=""
              fill
              preload={index === 0}
              sizes="100vw"
              className={styles.backgroundImage}
            />
          </div>
        ))}
      </div>
      <div className={styles.shade} aria-hidden="true" />
      <div className={styles.gridTexture} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.main}>
          <div className={styles.content}>
            <div className={styles.eyebrow}>
              <span className={styles.statusDot} aria-hidden="true" />
              <span>{t.badge}</span>
            </div>
            <h1 className={styles.title}>
              <span className={styles.titleLine}><span>{t.titleLine1}</span></span>
              <span className={`${styles.titleLine} ${styles.titleAccent}`}><span>{t.titleLine2}</span></span>
            </h1>
            <p className={styles.subtitle}>{t.subtitle}</p>
            <div className={styles.actions}>
              <a href="#products" className={styles.primaryAction}>
                <span>{t.ctaPrimary}</span><ArrowRight size={18} aria-hidden="true" />
              </a>
              <button type="button" onClick={onOpenQuote} className={styles.secondaryAction}>
                <span>{t.ctaSecondary}</span><ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className={styles.featured}>
            <div className={styles.seal} aria-hidden="true">
              <span className={styles.sealRing} />
              <Wheat size={32} strokeWidth={1.2} />
              <span>TÜRKİYE</span>
            </div>
            <div key={currentSlide.id} className={styles.featuredContent} aria-live={isPlaying ? 'off' : 'polite'} aria-atomic="true">
              <span className={styles.featuredNumber} aria-hidden="true">{String(currentSlideIndex + 1).padStart(2, '0')}</span>
              <span className={styles.featuredLabel}>{ui.showcase}</span>
              <h2 className={styles.featuredTitle}>{currentTitle}</h2>
              <p className={styles.featuredDetail}>{currentSlide.detail}</p>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.sliderBar}>
            <div
              className={styles.slideChoices}
              onPointerEnter={(event) => { if (event.pointerType === 'mouse') setIsHovered(true); }}
              onPointerLeave={() => setIsHovered(false)}
            >
              {HERO_SLIDES.map((slide, index) => {
                const title = getSlideTitle(slide.id, lang, translations.nav.export);
                return (
                  <button
                    key={slide.id}
                    type="button"
                    className={`${styles.slideChoice} ${index === currentSlideIndex ? styles.slideChoiceActive : ''}`}
                    onClick={() => selectSlide(index)}
                    aria-label={title}
                    aria-pressed={index === currentSlideIndex}
                  >
                    <span className={styles.choiceNumber} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                    <span className={styles.choiceTitle}>{title}</span>
                    {index === currentSlideIndex ? (
                      <span className={styles.progressTrack} aria-hidden="true">
                        <span key={`${currentSlideIndex}-${isPlaying}`} className={isPlaying ? styles.progressFill : styles.progressStill} />
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
            <div className={styles.controls}>
              <button type="button" onClick={() => selectSlide(currentSlideIndex - 1)} aria-label={ui.previous}>
                <ChevronLeft size={19} aria-hidden="true" />
              </button>
              <button
                type="button"
                onPointerDown={() => { pointerPlayIntent.current = isPaused; }}
                onClick={(event) => setIsPaused(event.detail === 0 ? !isPaused : !pointerPlayIntent.current)}
                aria-label={isPaused || reducedMotion ? ui.play : ui.pause}
                disabled={reducedMotion}
              >
                {isPaused || reducedMotion ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
              </button>
              <button type="button" onClick={() => selectSlide(currentSlideIndex + 1)} aria-label={ui.next}>
                <ChevronRight size={19} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className={styles.footer}>
            <dl className={styles.stats}>
              {[
                [t.stats.countries, t.stats.countriesLabel],
                [t.stats.supply, t.stats.supplyLabel],
                [t.stats.regions, t.stats.regionsLabel],
                [t.stats.products, t.stats.productsLabel],
              ].map(([value, label]) => (
                <div key={label} className={styles.stat}><dt>{label}</dt><dd>{value}</dd></div>
              ))}
            </dl>
            <a href="#products" className={styles.scrollHint}>
              <span>{ui.scroll}</span>
              <span className={styles.scrollIcon}><ArrowDown size={17} aria-hidden="true" /></span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
