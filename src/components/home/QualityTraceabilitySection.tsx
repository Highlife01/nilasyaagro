'use client';

import React from 'react';
import { ShieldCheck, QrCode, FileCheck2 } from 'lucide-react';
import { Locale } from '@/types';
import { getTranslations } from '@/data/translations';

export const QualityTraceabilitySection: React.FC<{ lang: Locale }> = ({ lang }) => {
  const t = getTranslations(lang).qualitySection;

  const certBadges = [
    { name: 'ISO 22000 & HACCP', desc: 'Food Safety Management in Pulses Milling & Processing' },
    { name: 'Bühler Sortex Optical Sorting', desc: 'Laser & Multi-Camera 99.8% Purity Color Selection' },
    { name: 'Non-GMO Verified', desc: '100% Natural Anatolian Non-Genetically Modified Grains' },
    { name: 'Phytosanitary & Pest-Free', desc: 'Official Ministry of Agriculture Export Inspection' },
    { name: 'Halal & Kosher Standards', desc: 'Compliant with Global Religious Dietary Requirements' },
    { name: 'SGS & GAFTA Inspection', desc: 'Independent Third-Party Pre-Shipment Grade & Weight Audit' },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t.tag}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            {t.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Traceability Flow Showcase */}
        <div className="bg-emerald-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl mb-16 relative overflow-hidden">
          <div className="relative z-10 max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
              <QrCode className="w-4 h-4" />
              <span>{t.traceabilityTitle}</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              {t.traceabilitySubtitle}
            </h3>

            {/* Step-by-Step Flow Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4">
              {t.flow.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-white/10 border border-white/15 text-center space-y-1 backdrop-blur-sm"
                >
                  <div className="font-mono text-xs font-bold text-emerald-400">
                    Step 0{idx + 1}
                  </div>
                  <div className="text-xs font-semibold text-white leading-snug">
                    {step}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 6 Core Certification Cards */}
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              {t.certificationsTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t.certificationsNotice}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certBadges.map((cert, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-sm flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{cert.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{cert.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
