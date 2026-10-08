'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product, Locale } from '@/types';
import { Camera, ZoomIn, ChevronLeft, ChevronRight, X, ShieldCheck } from 'lucide-react';

interface ProductGallerySectionProps {
  product: Product;
  lang: Locale;
}

interface ImageMeta {
  src: string;
  titleTr: string;
  titleEn: string;
  descTr: string;
  descEn: string;
}

const GALLERY_METADATA: Record<string, { titleTr: string; titleEn: string; descTr: string; descEn: string }> = {
  'nil-asya-royal-gala-pallet-master-boxes.webp': {
    titleTr: 'Nil Asya Markalı Paletli İhracat Kolileri',
    titleEn: 'Nil Asya Branded Palletized Master Export Boxes',
    descTr: 'Reefer konteyner yüklemesine hazır, palet üzerinde korumalı teleskopik ana kutular.',
    descEn: 'Master telescopic boxes palletized and secured for refrigerated ocean container transit.',
  },
  'nil-asya-royal-gala-export-box.webp': {
    titleTr: 'Teleskopik İhracat Kolisi & Özel Mor Viyol',
    titleEn: 'Telescopic Export Box & Molded Purple Pulp Tray',
    descTr: 'Nil Asya logolu orijinal ihracat kolisi, etiketli ve homojen boylamalı Gala elmaları.',
    descEn: 'Authentic Nil Asya export carton with calibrated, branded Gala apples on protective pulp tray.',
  },
  'nil-asya-gala-packing-operations.webp': {
    titleTr: 'Paketleme & Manuel Kalite Kontrol Hattı',
    titleEn: 'Packhouse Operators & Quality Inspection Line',
    descTr: 'Uzman operatörler tarafından tek tek boylanan, etiketlenen ve kutulanan ihracat elmaları.',
    descEn: 'Skilled packhouse team inspecting, stickering, and hand-packing export-grade apples.',
  },
  'nil-asya-gala-telescopic-carton.webp': {
    titleTr: 'Rulolu Konveyör Üzerinde İhracat Kolisi',
    titleEn: 'Export Box on Packhouse Roller Conveyor',
    descTr: 'Hassas tartım ve kalibrasyon sonrası konveyör bandında ilerleyen birinci sınıf Nil Asya kolisi.',
    descEn: 'Grade 1 Nil Asya carton advancing on the packhouse roller conveyor system.',
  },
  'nil-asya-gala-pulp-tray-sorting.webp': {
    titleTr: 'Viyol Üzerinde Kalibre Dizilimi',
    titleEn: 'Calibrated Tray Layer on Sorting Belt',
    descTr: 'Elektronik optik kalibratörden geçen elmaların darbe önleyici mor viyol tepsisine yerleşimi.',
    descEn: 'Optical sorting line output with uniform caliber distribution on impact-absorbing pulp trays.',
  },
  'nil-asya-gala-pallet-storage.webp': {
    titleTr: 'Soğuk Depo & Plastik İhracat Kasaları',
    titleEn: 'Cold Storage Facility & Blue Export Crates',
    descTr: 'Hızlı ön soğutma ve ULO atmosfer kontrollü soğuk odalarda muhafaza edilen paletli kasalar.',
    descEn: 'Ventilated export crates palletized inside pre-cooling and ULO controlled atmosphere storage.',
  },
  'nil-asya-gala-apples-blue-crates.webp': {
    titleTr: 'Tek Sıra Mavi İhracat Kasaları',
    titleEn: 'Single-Layer Blue Produce Export Crates',
    descTr: 'Doğrudan süpermarket raflarına uygun, Nil Asya etiketli birinci sınıf Gala elmaları.',
    descEn: 'Retail-ready presentation with Nil Asya brand stickers in heavy-duty ventilated export crates.',
  },
  'nil-asya-gala-packhouse-conveyor.webp': {
    titleTr: 'Optik Boylama & Paketleme Bandı',
    titleEn: 'Grading Line Conveyor & Packing Stream',
    descTr: 'Çap, ağırlık ve renk ayrımından geçen elmaların paketleme istasyonuna kesintisiz akışı.',
    descEn: 'Continuous produce stream passing through electronic sizing, weighing, and color sorters.',
  },
  'nil-asya-granny-smith-export-box.webp': {
    titleTr: 'Granny Smith İhracat Kutusu & Viyol Dizilimi',
    titleEn: 'Granny Smith Export Carton & Molded Tray',
    descTr: 'Nil Asya logolu zümrüt yeşili birinci sınıf Granny Smith elmalar, mor viyol korumasında.',
    descEn: 'Emerald green Grade 1 Granny Smith apples with Nil Asya stickers on protective purple pulp trays.',
  },
  'nil-asya-granny-smith-conveyor-line.webp': {
    titleTr: 'Granny Smith Boylama & Konveyör Hattı',
    titleEn: 'Granny Smith Grading & Conveyor Stream',
    descTr: 'Sertlik ve asitlik dengesi yüksek Granny Smith elmaların boylama hattından geçişi.',
    descEn: 'High-firmness Granny Smith apples advancing on the packhouse electronic grading line.',
  },
  'nil-asya-granny-smith-pallet-crates.webp': {
    titleTr: 'Mavi Kağıt Korumalı Palet Kasaları',
    titleEn: 'Blue-Cushioned Export Crates on Wooden Pallet',
    descTr: 'Mavi koruyucu sargılar içerisinde her biri etiketlenmiş Granny Smith elmalar.',
    descEn: 'Individual blue tissue-cushioned Granny Smith apples palletized for zero-damage export.',
  },
  'nil-asya-granny-smith-stacked-crates.webp': {
    titleTr: 'Paletli İstiflenmiş Havalandırmalı Kasalar',
    titleEn: 'Palletized Ventilated Export Crates',
    descTr: 'Soğuk zincirde optimum hava sirkülasyonu sağlayan havalandırmalı ihracat kasaları.',
    descEn: 'High-ventilation export crates providing optimal air circulation across the cold chain.',
  },
  'nil-asya-granny-smith-packhouse-overview.webp': {
    titleTr: 'Granny Smith Tesis & Ön Soğutma Operasyonu',
    titleEn: 'Granny Smith Packhouse & Pre-Cooling Operations',
    descTr: 'Hasattan hemen sonra hızlı ön soğutma ve ULO CA depolama transfer süreçleri.',
    descEn: 'Rapid hydro-cooling, grading, and ULO CA atmosphere storage transition at Nilasya packhouse.',
  },
};

export const ProductGallerySection: React.FC<ProductGallerySectionProps> = ({ product, lang }) => {
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const images = product.galleryImages || [];
  if (images.length === 0) return null;

  const isTr = lang === 'tr';

  const getImageMeta = (imgPath: string): ImageMeta => {
    const filename = imgPath.split('/').pop() || '';
    const meta = GALLERY_METADATA[filename];
    if (meta) {
      return {
        src: imgPath,
        titleTr: meta.titleTr,
        titleEn: meta.titleEn,
        descTr: meta.descTr,
        descEn: meta.descEn,
      };
    }
    const defaultTitle = isTr ? `${product.name[lang] || product.name.en} İhracat Görseli` : `${product.name.en} Export Photo`;
    return {
      src: imgPath,
      titleTr: defaultTitle,
      titleEn: defaultTitle,
      descTr: isTr ? 'Nilasya Agro Foods tesislerinde çekilmiş orijinal fotoğraf.' : 'Authentic photograph from Nilasya Agro Foods packhouse.',
      descEn: 'Authentic photograph from Nilasya Agro Foods packhouse.',
    };
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((prev) => (prev! === 0 ? images.length - 1 : prev! - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((prev) => (prev! === images.length - 1 ? 0 : prev! + 1));
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <Camera className="w-4 h-4 text-emerald-600" />
            <span>{isTr ? 'Tesis & Paketleme Galerisi' : 'Facility & Packaging Gallery'}</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            {isTr ? 'Orijinal Üretim, Paketleme ve Sevkiyat Fotoğrafları' : 'Authentic Packhouse, Packaging & Export Photography'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            {isTr
              ? 'Nil Asya markalı teleskopik ihraç kolilerimizden, optik boylama hatlarımızdan ve soğuk depolama tesislerimizden gerçek operasyon kareleri.'
              : 'Real photographs from actual Nil Asya branded export cartons, optical sorting conveyors, and refrigerated storage facilities.'}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 bg-emerald-50 rounded-2xl border border-emerald-200/80 text-emerald-800 text-xs font-bold shrink-0 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{isTr ? '%100 Doğrulanmış Tesis Fotoğrafları' : '100% Verified Facility Photos'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {images.map((img, idx) => {
          const meta = getImageMeta(img);
          const isFeatured = idx === 0 || idx === 1;

          return (
            <div
              key={idx}
              onClick={() => setActiveLightboxIndex(idx)}
              className={`group relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer ${
                isFeatured ? 'sm:col-span-2 sm:h-80 h-72' : 'h-72'
              }`}
            >
              <Image
                src={img}
                alt={isTr ? meta.titleTr : meta.titleEn}
                fill
                sizes={isFeatured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 25vw'}
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              {/* Top Zoom Icon */}
              <div className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/60 backdrop-blur-md text-white/80 group-hover:text-white group-hover:bg-emerald-600 transition-all">
                <ZoomIn className="w-4 h-4" />
              </div>

              {/* Bottom Info Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-5 text-white space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                  {isTr ? `Fotoğraf ${idx + 1}` : `Photo ${idx + 1}`}
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white line-clamp-1 group-hover:text-emerald-300 transition-colors">
                  {isTr ? meta.titleTr : meta.titleEn}
                </h4>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {isTr ? meta.descTr : meta.descEn}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {activeLightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8"
          onClick={() => setActiveLightboxIndex(null)}
        >
          <div className="absolute top-5 right-5 flex items-center gap-3 z-50">
            <span className="text-xs font-mono text-slate-400">
              {activeLightboxIndex + 1} / {images.length}
            </span>
            <button
              type="button"
              onClick={() => setActiveLightboxIndex(null)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div
            className="relative w-full max-w-5xl h-[65vh] sm:h-[75vh] rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[activeLightboxIndex]}
              alt={isTr ? getImageMeta(images[activeLightboxIndex]).titleTr : getImageMeta(images[activeLightboxIndex]).titleEn}
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-contain"
            />

            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 text-white">
              <div className="max-w-3xl">
                <h4 className="text-lg font-bold text-white">
                  {isTr ? getImageMeta(images[activeLightboxIndex]).titleTr : getImageMeta(images[activeLightboxIndex]).titleEn}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  {isTr ? getImageMeta(images[activeLightboxIndex]).descTr : getImageMeta(images[activeLightboxIndex]).descEn}
                </p>
              </div>
            </div>
          </div>

          <div
            className="flex items-center gap-4 mt-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => handlePrev()}
              className="p-3 rounded-full bg-white/10 hover:bg-emerald-600 text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="flex gap-2 overflow-x-auto max-w-lg p-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveLightboxIndex(idx)}
                  className={`relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    idx === activeLightboxIndex
                      ? 'border-emerald-400 ring-2 ring-emerald-400/50 scale-105'
                      : 'border-white/20 opacity-50 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Modal thumb ${idx + 1}`} fill sizes="56px" className="object-cover" />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleNext()}
              className="p-3 rounded-full bg-white/10 hover:bg-emerald-600 text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
