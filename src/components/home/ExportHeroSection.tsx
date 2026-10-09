'use client';

import { useEffect, useId, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Globe2, MoveRight, Ship } from 'lucide-react';
import { getTranslations } from '@/data/translations';
import type { Locale } from '@/types';
import styles from './ExportHeroSection.module.css';

interface ExportHeroSectionProps {
  lang: Locale;
  onOpenQuote?: () => void;
}

export function ExportHeroSection({ lang, onOpenQuote }: ExportHeroSectionProps) {
  const t = getTranslations(lang);
  const sectionRef = useRef<HTMLElement>(null);
  const headingId = useId();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.dataset.visible = 'true';
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={styles.hero} aria-labelledby={headingId}>
      <div className={styles.background} aria-hidden="true">
        <Image
          src="/images/hero/pulses-export-warehouse-nilasya.jpg"
          alt="Nilasya Agro Foods modern pulses export terminal and warehouse at Mersin International Port"
          fill
          sizes="100vw"
          className={styles.photo}
        />
      </div>
      <div className={styles.shade} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.eyebrow}>
          <span className={styles.tag}><Ship size={16} aria-hidden="true" />{t.logisticsSection.tag}</span>
          <span className={styles.chapter} aria-hidden="true">NILASYA / 02</span>
        </div>

        <div className={styles.main}>
          <div className={styles.content}>
            <h2 id={headingId} className={styles.title}>{t.logisticsSection.title}</h2>
            <p className={styles.description}>{t.logisticsSection.subtitle}</p>
            <div className={styles.actions}>
              <Link href={`/${lang}/export/`} className={styles.primary}>
                <span>{t.nav.export}</span><ArrowUpRight size={20} aria-hidden="true" />
              </Link>
              {onOpenQuote ? (
                <button type="button" onClick={onOpenQuote} className={styles.secondary}>
                  <span>{t.hero.ctaSecondary}</span><MoveRight size={20} aria-hidden="true" />
                </button>
              ) : null}
            </div>
          </div>

          <div className={styles.reach}>
            <div className={styles.routes} aria-hidden="true">
              <svg viewBox="0 0 420 420" fill="none" className={styles.globe}>
                <circle cx="210" cy="210" r="170" stroke="currentColor" strokeOpacity=".25" />
                <circle cx="210" cy="210" r="126" stroke="currentColor" strokeOpacity=".12" />
                <ellipse cx="210" cy="210" rx="84" ry="170" stroke="currentColor" strokeOpacity=".18" />
                <ellipse cx="210" cy="210" rx="170" ry="64" stroke="currentColor" strokeOpacity=".18" />
                <path d="M40 210h340M210 40v340" stroke="currentColor" strokeOpacity=".12" />
                <path d="M134 240Q154 68 305 115M134 240Q270 163 358 264M134 240Q166 339 271 358" stroke="#e5bd76" strokeWidth="1.5" />
                <circle cx="134" cy="240" r="14" stroke="#e5bd76" strokeOpacity=".5" />
                <circle cx="134" cy="240" r="5" fill="#e5bd76" />
                <circle cx="305" cy="115" r="4" fill="#e5bd76" />
                <circle cx="358" cy="264" r="4" fill="#e5bd76" />
                <circle cx="271" cy="358" r="4" fill="#e5bd76" />
              </svg>
            </div>
            <div className={styles.marketStat}>
              <Globe2 size={19} aria-hidden="true" />
              <strong>{t.hero.stats.countries}</strong>
              <span>{t.hero.stats.countriesLabel}</span>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <span className={styles.location}>MERSİN, TÜRKİYE <span aria-hidden="true">↗</span></span>
          <div className={styles.metric}>
            <strong>{t.hero.stats.supply}</strong>
            <span>{t.hero.stats.supplyLabel}</span>
          </div>
          <div className={styles.metric}>
            <strong>{t.hero.stats.products}</strong>
            <span>{t.hero.stats.productsLabel}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
