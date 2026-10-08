'use client';

import React, { useState } from 'react';
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
  'turkish-chickpeas-kabuli-nilasya.jpg': {
    titleTr: 'Koçbaşı Nohut Kalibrasyon & Optik Boylama',
    titleEn: 'Koçbaşı Chickpeas Caliber & Optical Sizing',
    descTr: '8mm, 9mm ve 10mm kalibrelerde Sortex optik temizlikten geçmiş birinci sınıf Türk Koçbaşı nohutu.',
    descEn: 'Grade 1 Turkish Kabuli chickpeas sorted to 99.8% purity across 8mm, 9mm, and 10mm calibers.',
  },
  'turkish-red-lentils-nilasya.jpg': {
    titleTr: 'Kırmızı Mercimek (Futbol & Yaprak) İşleme',
    titleEn: 'Red Lentils (Football & Split) Processing',
    descTr: 'Yüksek beta-karoten içerikli, parlak mercan renginde makine temizlemeli ve Sortex kırmızı mercimek.',
    descEn: 'Machine-dressed and Sortex-cleaned whole and split red lentils with natural high-beta-carotene brilliance.',
  },
  'turkish-green-lentils-nilasya.jpg': {
    titleTr: 'İç Anadolu Yeşil Mercimek (Laird & Eston)',
    titleEn: 'Central Anatolian Green Lentils (Laird & Eston)',
    descTr: 'Sert hücresel yapılı, pişerken dağılmayan 5.5mm - 6.5mm birinci sınıf yeşil mercimek.',
    descEn: 'Firm cellular structure, non-disintegrating cooking performance across 5.5mm–6.5mm calibers.',
  },
  'turkish-white-beans-dermason-nilasya.jpg': {
    titleTr: 'Dermason Kuru Fasulye (Konserve & Paketleme)',
    titleEn: 'Dermason Dry White Beans (Canning & Retail Grade)',
    descTr: 'İnce kabuklu, tereyağı kıvamında pişme performansına sahip Anadolu Dermason fasulyesi.',
    descEn: 'Tender-skinned, buttery-textured Turkish Dermason white beans calibrated for canning and packaging.',
  },
  'turkish-dry-peas-nilasya.jpg': {
    titleTr: 'Sarı & Yeşil Kuru Bezelye (Bölünmüş & Bütün)',
    titleEn: 'Yellow & Green Dry Peas (Split & Whole Sortex)',
    descTr: 'Çorba bazları, püre üretimi ve konserve sanayisi için kalibre edilmiş kuru bezelye.',
    descEn: 'Polished whole and divided dry split peas calibrated for soup bases, purees, and canning.',
  },
  'turkish-durum-wheat-bulgur-nilasya.jpg': {
    titleTr: 'Durum Makarnalık Buğday & Doğal Türk Bulguru',
    titleEn: 'Durum Wheat & Traditional Stone-Milled Bulgur',
    descTr: 'Yüksek proteinli kehribar durum buğdayı ve geleneksel pilavlık/köftelik Türk bulguru.',
    descEn: 'High-protein vitreous amber durum wheat and pre-cooked stone-milled Turkish bulgur.',
  },
  'pulses-processing-factory-nilasya.jpg': {
    titleTr: 'Bühler Sortex Optik Renk Ayırma & Eleme Hattı',
    titleEn: 'Bühler Sortex Optical Color Sorting & Screening Line',
    descTr: 'Taş ayırıcılar, hava aspirasyon sistemleri ve lazer kameralı Sortex ayıklama ünitesi.',
    descEn: 'Advanced gravity destoners, aspirators, and laser optical sorters delivering 99.8% purity.',
  },
  'pulses-export-warehouse-nilasya.jpg': {
    titleTr: 'Mersin Liman Deposu & Konteyner Yükleme',
    titleEn: 'Mersin Port Logistics Warehouse & FCL Container Stuffing',
    descTr: '25kg/50kg PP çuvallar ve 1.000kg Big Bag jumbo torbaların paletli konteyner yüklemesi.',
    descEn: 'Palletized 25kg/50kg PP sacks and 1,000kg FIBC Big Bags staged for direct container loading.',
  },
  'pulses-export-jumbo-bags-nilasya.jpg': {
    titleTr: '1.000 kg FIBC Big Bag Jumbo Torbalama',
    titleEn: '1,000 kg FIBC Big Bag Bulk Export Sacks',
    descTr: 'Endüstriyel işleyiciler ve konserve fabrikaları için neme dayanıklı boşaltma ventilli Big Bag torbalar.',
    descEn: 'Heavy-duty discharge-spout Big Bags with moisture-barrier liners for industrial food processors.',
  },
  'nilasya-2kg-nohut.jpg': {
    titleTr: 'Nilasya 2 KG Koçbaşı Nohut Kilitli Mat Doypack Paket',
    titleEn: 'Nilasya 2 KG Chickpeas Standing Zip-Lock Pouch Pack',
    descTr: 'Şeffaf pencereli, altın yaldız detaylı, Sortex seçilmiş 9mm iri kalibre nohut perakende paketi.',
    descEn: 'Premium 2 kg retail stand-up pouch with transparent window showing large 9mm Sortex chickpeas.',
  },
  'nilasya-2kg-kirmizi-mercimek.jpg': {
    titleTr: 'Nilasya 2 KG Kırmızı Mercimek Kilitli Mat Doypack Paket',
    titleEn: 'Nilasya 2 KG Red Lentils Standing Zip-Lock Pouch Pack',
    descTr: 'Şeffaf pencereli, parlak mercan renginde Sortex ayıklanmış kırmızı mercimek perakende paketi.',
    descEn: 'Premium 2 kg retail stand-up pouch with clear window showcasing bright Sortex red lentils.',
  },
  'nilasya-2kg-kuru-fasulye.jpg': {
    titleTr: 'Nilasya 2 KG Dermason Kuru Fasulye Kilitli Mat Doypack Paket',
    titleEn: 'Nilasya 2 KG Dermason White Beans Standing Pouch Pack',
    descTr: 'İnce kabuklu Anadolu Dermason fasulyesi için özel tasarlanmış 2 kg kurumsal perakende ambalajı.',
    descEn: 'Premium 2 kg retail package with bean-shaped window displaying tender-skinned Dermason beans.',
  },
  'nilasya-2kg-yesil-mercimek.jpg': {
    titleTr: 'Nilasya 2 KG Yeşil Mercimek Kilitli Mat Doypack Paket',
    titleEn: 'Nilasya 2 KG Green Lentils Standing Zip-Lock Pouch Pack',
    descTr: 'Doğal lif kaynağı İç Anadolu yeşil mercimeği 2 kg kilitli tazelik korumalı lüks ambalajı.',
    descEn: 'Premium 2 kg standing pouch preserving natural freshness and high fiber of Anatolian green lentils.',
  },
  'nilasya-2kg-pilavlik-bulgur.jpg': {
    titleTr: 'Nilasya 2 KG Pilavlık Bulgur Kilitli Mat Doypack Paket',
    titleEn: 'Nilasya 2 KG Durum Wheat Bulgur Standing Pouch Pack',
    descTr: 'Geleneksel taş değirmende işlenmiş kehribar durum buğdayı bulguru 2 kg perakende paketi.',
    descEn: 'Premium 2 kg retail packaging showcasing natural stone-milled golden amber durum wheat bulgur.',
  },
  'nilasya-2kg-kuru-bezelye.jpg': {
    titleTr: 'Nilasya 2 KG Sarı & Yeşil Kuru Bezelye Kilitli Mat Doypack',
    titleEn: 'Nilasya 2 KG Dry Split Peas Standing Pouch Pack',
    descTr: 'Çorbalık ve yemeklik parlatılmış sarı ve yeşil bezelye 2 kg özel pencereli ambalajı.',
    descEn: 'Premium 2 kg pouch with transparent window displaying calibrated yellow and green split peas.',
  },
  'nilasya-2kg-pulses-packaging-series.jpg': {
    titleTr: 'Nilasya 2 KG Kurumsal Bakliyat Ambalaj Ailesi',
    titleEn: 'Nilasya 2 KG Corporate Pulses Packaging Family',
    descTr: 'Süpermarket zincirleri ve toptan alıcılar için tek tip, kilitli doypack lüks ambalaj serisi.',
    descEn: 'Uniform luxury packaging line designed for international supermarket chains and wholesale buyers.',
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
      descTr: isTr ? 'Nilasya Agro Foods Mersin işleme ve ihracat tesislerinde çekilmiş orijinal fotoğraf.' : 'Authentic photograph from Nilasya Agro Foods Mersin processing and export facility.',
      descEn: 'Authentic photograph from Nilasya Agro Foods Mersin processing and export facility.',
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
