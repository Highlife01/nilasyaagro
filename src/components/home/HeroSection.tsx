'use client';

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react';
import Image from 'next/image';
import { ArrowDown, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, MapPin, Pause, Play, ShieldCheck, Wheat } from 'lucide-react';
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
  { id: 'chickpeas', detail: 'KABULI · 8–10 MM', accent: '#e5bd76' },
  { id: 'red-lentils', detail: 'FOOTBALL & SPLIT · SORTEX', accent: '#f39b75' },
  { id: 'green-lentils', detail: 'LAIRD & ESTON · 5–7 MM', accent: '#bed69a' },
  { id: 'white-beans', detail: 'DERMASON · 8–9 MM', accent: '#eee1bd' },
  { id: 'durum-wheat-bulgur', detail: 'DURUM · BULGUR', accent: '#f0c568' },
  { id: 'export', detail: 'MERSİN · FOB / CIF / CFR', accent: '#93d9b8' },
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
  const visualRef = useRef<HTMLDivElement>(null);
  const pointerPlayIntent = useRef(false);
  const [slideState, setSlideState] = useState({ index: 0, loaded: 1 });
  const currentSlideIndex = slideState.index;
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisualHovered, setIsVisualHovered] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const reducedMotion = useSyncExternalStore(
    subscribeToMotionPreference, getMotionPreference, getServerMotionPreference,
  );
  const documentVisible = useSyncExternalStore(
    subscribeToVisibility, getVisibility, getServerVisibility,
  );
  const isPlaying = !isPaused && !isHovered && !isVisualHovered && !reducedMotion && documentVisible && isInView;
  const currentSlide = HERO_SLIDES[currentSlideIndex];
  const currentTitle = getSlideTitle(currentSlide.id, lang, translations.nav.export);
  const currentProduct = HERO_PRODUCTS.get(currentSlide.id);
  const featuredHref = currentProduct
    ? `/${lang}/products/${currentProduct.slug[lang] || currentProduct.slug.en}/`
    : `/${lang}/export/`;
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
      setSlideState((state) => {
        const index = (state.index + 1) % HERO_SLIDES.length;
        return { index, loaded: state.loaded | (1 << index) };
      });
    }, SLIDE_DURATION);
    return () => window.clearTimeout(timer);
  }, [currentSlideIndex, isPlaying]);

  useEffect(() => {
    const visual = visualRef.current;
    if (!visual || reducedMotion || !isInView || !documentVisible || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    function updatePointer(event: PointerEvent) {
      if (event.pointerType !== 'mouse') return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const bounds = visual!.getBoundingClientRect();
        const x = (pointerX - bounds.left) / bounds.width - 0.5;
        const y = (pointerY - bounds.top) / bounds.height - 0.5;
        visual!.style.setProperty('--pointer-x', `${x * 12}px`);
        visual!.style.setProperty('--pointer-y', `${y * 12}px`);
        visual!.style.setProperty('--tilt-x', `${-y * 4}deg`);
        visual!.style.setProperty('--tilt-y', `${x * 4}deg`);
      });
    }
    function resetPointer() {
      window.cancelAnimationFrame(frame);
      frame = 0;
      for (const property of ['--pointer-x', '--pointer-y', '--tilt-x', '--tilt-y']) {
        visual!.style.removeProperty(property);
      }
    }
    visual.addEventListener('pointermove', updatePointer, { passive: true });
    visual.addEventListener('pointerleave', resetPointer);
    return () => {
      visual.removeEventListener('pointermove', updatePointer);
      visual.removeEventListener('pointerleave', resetPointer);
      resetPointer();
    };
  }, [reducedMotion, isInView, documentVisible]);

  function selectSlide(index: number) {
    const nextIndex = (index + HERO_SLIDES.length) % HERO_SLIDES.length;
    setSlideState((state) => ({ index: nextIndex, loaded: state.loaded | (1 << nextIndex) }));
    setIsPaused(true);
  }

  return (
    <section
      ref={sectionRef}
      className={styles.hero}
      data-playing={isPlaying}
      aria-label={ui.showcase}
      aria-roledescription="carousel"
      style={{ '--hero-accent': currentSlide.accent, '--slide-duration': `${SLIDE_DURATION}ms` } as CSSProperties}
      onFocusCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(true);
      }}
    >
      <div className={styles.shade} aria-hidden="true" />
      <div className={styles.gridTexture} aria-hidden="true" />
      <div className={styles.ambientGlow} aria-hidden="true" />
      <div className={styles.particles} aria-hidden="true">
        {Array.from({ length: 8 }, (_, index) => <span key={index} style={{ '--particle': index } as CSSProperties} />)}
      </div>

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

          <div
            ref={visualRef}
            className={styles.visual}
            onPointerEnter={(event) => { if (event.pointerType === 'mouse') setIsVisualHovered(true); }}
            onPointerLeave={() => setIsVisualHovered(false)}
          >
            <div className={styles.orbit} aria-hidden="true"><span /></div>
            <div className={styles.orbitInner} aria-hidden="true" />
            <div className={styles.photoEntrance}>
              <div className={styles.photoFrame}>
                <div className={styles.backgrounds} aria-hidden="true">
                  {HERO_SLIDES.map((slide, index) => (slideState.loaded & (1 << index)) ? (
                    <div key={slide.id} className={`${styles.background} ${index === currentSlideIndex ? styles.backgroundActive : ''}`}>
                      <Image
                        src={`/images/hero/showcase-${slide.id}.webp`}
                        alt=""
                        fill
                        preload={index === 0}
                        loading={index === 0 ? undefined : 'eager'}
                        sizes="(max-width: 767px) 85vw, (max-width: 1100px) 42vw, 480px"
                        className={styles.backgroundImage}
                      />
                    </div>
                  ) : null)}
                </div>
                <div className={styles.photoShade} aria-hidden="true" />
                <div className={styles.photoTopline} aria-hidden="true">
                  <span>NILASYA SELECTION</span>
                  <span>{String(currentSlideIndex + 1).padStart(2, '0')} / 06</span>
                </div>
                <div className={styles.featured} aria-live={isPlaying ? 'off' : 'polite'} aria-atomic="true">
                  <div key={currentSlide.id} className={styles.featuredContent}>
                    <span className={styles.featuredLabel}>{ui.showcase}</span>
                    <h2 className={styles.featuredTitle}>{currentTitle}</h2>
                    <p className={styles.featuredDetail}>{currentSlide.detail}</p>
                  </div>
                  <a href={featuredHref} className={styles.featuredLink} aria-label={`${translations.productsSection.viewProduct}: ${currentTitle}`}>
                    <ArrowUpRight size={23} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
            <div className={styles.seal} aria-hidden="true">
              <span className={styles.sealRing} />
              <Wheat size={27} strokeWidth={1.3} />
              <span>TÜRKİYE</span>
            </div>
            <div className={styles.qualityEntrance}>
              <div className={styles.qualityCard}>
                <span className={styles.qualityIcon}><ShieldCheck size={23} strokeWidth={1.5} aria-hidden="true" /></span>
                <div><strong>{t.stats.products}</strong><span>{t.stats.productsLabel}</span></div>
                <span className={styles.qualityDot} aria-hidden="true" />
              </div>
            </div>
            <div className={styles.originEntrance}>
              <div className={styles.originCard}>
                <MapPin size={15} aria-hidden="true" />
                <span>Mersin, Türkiye</span>
                <span className={styles.originLine} aria-hidden="true" />
                <span>FOB · CIF · CFR</span>
              </div>
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
                    <span className={styles.choiceThumbnail} aria-hidden="true">
                      <Image src={`/images/hero/showcase-${slide.id}-thumb.webp`} alt="" fill loading="eager" sizes="44px" />
                    </span>
                    <span className={styles.choiceText}>
                      <span className={styles.choiceNumber} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                      <span className={styles.choiceTitle}>{title}</span>
                    </span>
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
              <span className={styles.scrollIcon}><span><ArrowDown size={17} aria-hidden="true" /></span></span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
