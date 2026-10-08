'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Variety, Locale } from '@/types';
import { Camera, CheckCircle2 } from 'lucide-react';

interface VarietyGalleryProps {
  variety: Variety;
  lang: Locale;
}

export const VarietyGallery: React.FC<VarietyGalleryProps> = ({
  variety,
  lang,
}) => {
  const isTr = lang === 'tr';
  const images = variety.galleryImages || (variety.image ? [variety.image] : []);

  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length <= 1) {
    return null; // Hero already shows single image
  }

  const activeImage = images[activeIndex] || images[0];

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
          <Camera className="w-4 h-4 text-emerald-600" />
          <span>
            {isTr ? 'Orijinal Ambalaj & Ürün Fotoğrafları' : 'Original Packaging & Product Photos'}
          </span>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          {images.length} {isTr ? 'Yüksek Çözünürlüklü Kare' : 'High-Res Frames'}
        </span>
      </div>

      <div className="space-y-4">
        {/* Main active image preview */}
        <div className="relative aspect-[16/10] sm:aspect-[21/9] w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md">
          <Image
            src={activeImage}
            alt={`${variety.name} packaging - Nilasya Agro Foods`}
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-emerald-300 border border-emerald-500/30 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {isTr ? 'Nil Asya Orijinal İhraç Sevkiyatı' : 'Nil Asya Authentic Export Shipment'}
            </span>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative w-24 h-16 sm:w-32 sm:h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                activeIndex === idx 
                  ? 'border-emerald-600 shadow-md scale-105' 
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
