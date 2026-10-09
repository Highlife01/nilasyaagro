'use client';

import React from 'react';
import { ShieldCheck, QrCode, FileCheck2 } from 'lucide-react';
import { Locale } from '@/types';
import { getTranslations } from '@/data/translations';

export const QualityTraceabilitySection: React.FC<{ lang: Locale }> = ({ lang }) => {
  const t = getTranslations(lang).qualitySection;

  const certBadges = [
    {
      name: 'ISO 22000:2018 & HACCP',
      authority: lang === 'tr' ? 'TÜRKAK Akreditasyonlu Belgelendirme Kuruluşu' : 'TÜRKAK Accredited Certification Body',
      type: lang === 'tr' ? 'Tesis Yönetim Standardı' : 'Facility Management Standard',
      scope: lang === 'tr' ? 'Bakliyat eleme, optik ayıklama, boylama ve paketleme tesisi' : 'Pulses milling, optical screening, sizing & packing facility',
      protocol: 'FSMS / HACCP Food Safety Management Audit',
    },
    {
      name: 'Bühler Sortex Optical Sizing',
      authority: lang === 'tr' ? 'Bühler Sortex Proses Platformu' : 'Bühler Sortex Optical Technology Platform',
      type: lang === 'tr' ? 'Proses Teknolojisi & Saflık' : 'Industrial Process Standard',
      scope: lang === 'tr' ? '%99.8 saflık, yabancı madde ve renk anomalisi ayıklama' : '99.8% minimum purity, color defects & stone extraction',
      protocol: 'Laser & InGaAs Multi-Camera Optical Sorting',
    },
    {
      name: 'Non-GMO Testing Protocol',
      authority: lang === 'tr' ? 'Akredite Gıda & Tohum Analiz Laboratuvarları' : 'Accredited Food & Grain Testing Laboratories',
      type: lang === 'tr' ? 'Sevkiyat & Lot Bazlı Analiz' : 'Lot-Based Laboratory Certificate',
      scope: lang === 'tr' ? '%100 yerli Anadolu tohumları, sıfır genetik modifikasyon' : '100% native Anatolian varieties, zero GMO contamination',
      protocol: 'Real-Time PCR DNA Screening Protocol',
    },
    {
      name: 'Phytosanitary Health Certificate',
      authority: lang === 'tr' ? 'T.C. Tarım ve Orman Bakanlığı Zirai Karantina' : 'Ministry of Agriculture & Forestry Directorate',
      type: lang === 'tr' ? 'Resmi Devlet İhracat Belgesi' : 'Official Government Export Clearance',
      scope: lang === 'tr' ? 'Zararlı, böcek ve karantina etmenlerinden ari sevk onayı' : 'Inspection for pest-free & fumigated containerized cargo',
      protocol: 'Pre-Loading Port Quarantine Inspection & Official Seal',
    },
    {
      name: 'HALAL & Kosher Export Standards',
      authority: lang === 'tr' ? 'HAK / SMIIC Akredite Helal Denetim' : 'HAK & SMIIC Accredited Halal Bodies',
      type: lang === 'tr' ? 'Dini & Hijyenik Uygunluk' : 'Dietary & Religious Compliance',
      scope: lang === 'tr' ? 'Tüm bakliyat ve tahıllarda katkısız %100 bitkisel üretim' : 'All pulses and grains: 100% plant-based clean production',
      protocol: 'OIC/SMIIC 1:2019 General Requirements for Halal Food',
    },
    {
      name: 'SGS & GAFTA Pre-Shipment Audit',
      authority: lang === 'tr' ? 'SGS, Bureau Veritas veya GAFTA Gözetmenliği' : 'SGS, Bureau Veritas or GAFTA Superintendent',
      type: lang === 'tr' ? 'Bağımsız 3. Taraf Sevkiyat Muayenesi' : 'Independent Pre-Shipment Inspection',
      scope: lang === 'tr' ? 'Konteyner yükleme öncesi nem (<%14), kalibre, saflık ve kantar tespiti' : 'Moisture (<14%), screen size, purity & weighbridge tally',
      protocol: 'Official Certificate of Quality, Weight & Container Sealing',
    },
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
                className="p-6 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                      {cert.type}
                    </span>
                    <FileCheck2 className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 leading-snug">{cert.name}</h4>
                    <p className="text-xs text-emerald-900 font-semibold mt-1">{cert.authority}</p>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{cert.scope}</p>
                </div>
                <div className="pt-2 border-t border-slate-200/70 text-[11px] text-slate-500 font-mono">
                  {cert.protocol}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
