'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Eye, Maximize2, X, ArrowRight, Layers, Check, Boxes, Truck } from 'lucide-react';
import { Locale } from '@/types';
import { productsData } from '@/data/products';

interface Nilasya2KgShowcaseProps {
  lang: Locale;
  showHeader?: boolean;
}

interface PackageItem {
  id: string;
  productId: string;
  nameTr: string;
  nameEn: string;
  subtitleTr: string;
  subtitleEn: string;
  image: string;
  caliberTr: string;
  caliberEn: string;
  protein: string;
  purity: string;
  boxSpecTr: string;
  boxSpecEn: string;
  palletSpecTr: string;
  palletSpecEn: string;
  descriptionTr: string;
  descriptionEn: string;
}

const PACKAGES_2KG: PackageItem[] = [
  {
    id: 'nohut-2kg',
    productId: 'chickpeas',
    nameTr: 'Koçbaşı Nohut 2 KG',
    nameEn: 'Turkish Kabuli Chickpeas 2 KG',
    subtitleTr: '9mm - 10mm Jumbo Kalibre • Sortex Seçilmiş',
    subtitleEn: '9mm - 10mm Jumbo Caliber • Sortex Optical Cleaned',
    image: '/images/packaging/nilasya-2kg-nohut.jpg',
    caliberTr: '9mm - 10mm Jumbo',
    caliberEn: '9mm - 10mm Jumbo',
    protein: '%21.5 Bitkisel Protein',
    purity: 'Min. %99.8 Saflık',
    boxSpecTr: '8 x 2 kg Koli (16 kg Net)',
    boxSpecEn: '8 x 2 kg Master Box (16 kg Net)',
    palletSpecTr: '72 Koli / Euro Palet (1.152 kg)',
    palletSpecEn: '72 Boxes / Euro Pallet (1,152 kg)',
    descriptionTr: 'İç Anadolu yaylalarının iri kalibreli Koçbaşı nohutu. Şeffaf fasulye pencereli ve altın varak detaylı lüks 2 KG ambalajında.',
    descriptionEn: 'High-altitude Central Anatolian Koçbaşı chickpeas. Presented in uniform luxury 2 KG pouch with transparent bean inspection window.',
  },
  {
    id: 'kirmizi-mercimek-2kg',
    productId: 'red-lentils',
    nameTr: 'Kırmızı Mercimek 2 KG',
    nameEn: 'Turkish Red Lentils 2 KG',
    subtitleTr: 'Futbol & Yaprak Kırım • Parlak Mercan Rengi',
    subtitleEn: 'Football & Split • Radiant Coral Red',
    image: '/images/packaging/nilasya-2kg-kirmizi-mercimek.jpg',
    caliberTr: 'Futbol & Yaprak',
    caliberEn: 'Football & Split',
    protein: '%25.2 Yüksek Protein',
    purity: 'Min. %99.8 Sortex',
    boxSpecTr: '8 x 2 kg Koli (16 kg Net)',
    boxSpecEn: '8 x 2 kg Master Box (16 kg Net)',
    palletSpecTr: '72 Koli / Euro Palet (1.152 kg)',
    palletSpecEn: '72 Boxes / Euro Pallet (1,152 kg)',
    descriptionTr: 'Güneydoğu Anadolu’nun volkanik topraklarından canlı mercan kırmızısı mercimek. Çabuk pişen, ipeksi kıvamda birinci sınıf lezzet.',
    descriptionEn: 'Vibrant coral red lentils cultivated in southeastern mineral soils. High protein, velvety texture, and uniform optical sorting.',
  },
  {
    id: 'kuru-fasulye-2kg',
    productId: 'white-beans',
    nameTr: 'Dermason Kuru Fasulye 2 KG',
    nameEn: 'Turkish White Beans (Dermason) 2 KG',
    subtitleTr: '8-9mm ve 9-10mm Extra • Dağılmayan İnce Kabuk',
    subtitleEn: '8-9mm & 9-10mm Extra • Tender Skin & Creamy Texture',
    image: '/images/packaging/nilasya-2kg-kuru-fasulye.jpg',
    caliberTr: '8mm - 10mm Extra',
    caliberEn: '8mm - 10mm Extra',
    protein: '%22.8 Protein',
    purity: 'Min. %99.7 Saflık',
    boxSpecTr: '8 x 2 kg Koli (16 kg Net)',
    boxSpecEn: '8 x 2 kg Master Box (16 kg Net)',
    palletSpecTr: '72 Koli / Euro Palet (1.152 kg)',
    palletSpecEn: '72 Boxes / Euro Pallet (1,152 kg)',
    descriptionTr: 'Türk mutfağının baş tacı Erzincan tipi Dermason fasulye. Pişerken kabuk atmayan, lokum gibi yumuşayan eşsiz lezzet.',
    descriptionEn: 'Renowned Erzincan-grade Dermason dry white beans. Superior boiling performance, tender skin, and melt-in-mouth mouthfeel.',
  },
  {
    id: 'yesil-mercimek-2kg',
    productId: 'green-lentils',
    nameTr: 'Yeşil Mercimek 2 KG',
    nameEn: 'Turkish Green Lentils 2 KG',
    subtitleTr: 'Laird 6-7mm İri Tane • Diri Pişen Yapı',
    subtitleEn: 'Laird 6-7mm Large Caliber • Firm Cooking Integrity',
    image: '/images/packaging/nilasya-2kg-yesil-mercimek.jpg',
    caliberTr: '6mm - 7mm Laird',
    caliberEn: '6mm - 7mm Laird',
    protein: '%24.5 Protein & Lif',
    purity: 'Min. %99.8 Sortex',
    boxSpecTr: '8 x 2 kg Koli (16 kg Net)',
    boxSpecEn: '8 x 2 kg Master Box (16 kg Net)',
    palletSpecTr: '72 Koli / Euro Palet (1.152 kg)',
    palletSpecEn: '72 Boxes / Euro Pallet (1,152 kg)',
    descriptionTr: 'İç Anadolu yaylalarından seçme iri yeşil mercimek. Salatalar, çorbalar ve sıcak yemekler için formunu koruyan diri doku.',
    descriptionEn: 'Selected large-caliber Turkish green lentils. Excellent culinary shape retention, earthy aroma, and high dietary fiber.',
  },
  {
    id: 'pilavlik-bulgur-2kg',
    productId: 'durum-wheat-bulgur',
    nameTr: 'Pilavlık Bulgur 2 KG',
    nameEn: 'Turkish Durum Wheat Bulgur 2 KG',
    subtitleTr: '%100 Durum Buğdayı • Kehribar Sarısı Taş Kırımı',
    subtitleEn: '100% Durum Wheat • Stone-Ground Golden Amber',
    image: '/images/packaging/nilasya-2kg-pilavlik-bulgur.jpg',
    caliberTr: 'İri Pilavlık No:3',
    caliberEn: 'Coarse Pilaf No:3',
    protein: '%13.5 Buğday Proteini',
    purity: '%100 Doğal Durum',
    boxSpecTr: '8 x 2 kg Koli (16 kg Net)',
    boxSpecEn: '8 x 2 kg Master Box (16 kg Net)',
    palletSpecTr: '72 Koli / Euro Palet (1.152 kg)',
    palletSpecEn: '72 Boxes / Euro Pallet (1,152 kg)',
    descriptionTr: 'Anadolu’nun sert durum buğdayından hijyenik kazanlarda haşlanıp taş değirmenlerde kırılan geleneksel altın sarısı pilavlık bulgur.',
    descriptionEn: 'Parboiled from 100% Anatolian hard durum wheat. Stone-milled to uniform coarse granules for authentic Mediterranean pilafs.',
  },
  {
    id: 'kuru-bezelye-2kg',
    productId: 'dry-peas',
    nameTr: 'Kuru Bezelye 2 KG',
    nameEn: 'Turkish Dry Peas (Yellow & Green) 2 KG',
    subtitleTr: 'Sortex Seçilmiş Sarı & Yeşil Dane • Çorbalık & Yemeklik',
    subtitleEn: 'Sortex Selected Yellow & Green Peas • High Protein',
    image: '/images/packaging/nilasya-2kg-kuru-bezelye.jpg',
    caliberTr: '6mm - 7mm Bütün & Kırık',
    caliberEn: '6mm - 7mm Whole & Split',
    protein: '%22.0 Bitkisel Protein',
    purity: 'Min. %99.7 Saflık',
    boxSpecTr: '8 x 2 kg Koli (16 kg Net)',
    boxSpecEn: '8 x 2 kg Master Box (16 kg Net)',
    palletSpecTr: '72 Koli / Euro Palet (1.152 kg)',
    palletSpecEn: '72 Boxes / Euro Pallet (1,152 kg)',
    descriptionTr: 'Doğal güneşte kurutulmuş, optik ayıklanmış sarı ve yeşil kuru bezelye. Püreler, çorbalar ve bitkisel protein ürünleri için ideal.',
    descriptionEn: 'Sun-dried and optical sorted whole and split dry peas. Superior solubility and clean taste for culinary and plant-based foods.',
  },
  {
    id: 'makarna-2kg',
    productId: 'pasta-macaroni',
    nameTr: 'Durum Buğdayı Makarnası 2 KG',
    nameEn: 'Turkish Durum Wheat Pasta 2 KG',
    subtitleTr: '%100 Anadolu Durum İrmiği • Al Dente Kıvam',
    subtitleEn: '100% Anatolian Durum Semolina • Premium Al Dente',
    image: '/images/packaging/nilasya-pasta-packaging.jpg',
    caliberTr: 'Spagetti, Penne & Burgu',
    caliberEn: 'Spaghetti, Penne & Fusilli',
    protein: '%13.5+ Doğal Protein',
    purity: '%100 Saf Durum İrmiği',
    boxSpecTr: '8 x 2 kg veya 20 x 500g Koli',
    boxSpecEn: '8 x 2 kg or 20 x 500g Master Box',
    palletSpecTr: '72 Koli / Euro Palet',
    palletSpecEn: '72 Boxes / Euro Pallet',
    descriptionTr: 'Güneydoğu ve İç Anadolu’nun kehribar sarısı durum buğdayı irmiğinden üretilen, pişerken dağılmayan ve şeklini koruyan lüks makarna serisi.',
    descriptionEn: 'Manufactured from 100% hard amber durum wheat semolina. Perfect al dente cooking profile with superior sauce retention and golden amber color.',
  },
];

export const Nilasya2KgShowcase: React.FC<Nilasya2KgShowcaseProps> = ({ lang, showHeader = true }) => {
  const [activeModalItem, setActiveModalItem] = useState<PackageItem | null>(null);
  const isTr = lang === 'tr';

  const getProductHref = (productId: string) => {
    const prod = productsData.find((p) => p.id === productId);
    if (!prod) return `/${lang}/products/`;
    const slug = prod.slug[lang] || prod.slug.en || prod.id;
    return `/${lang}/products/${slug}/`;
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-[#f8faf7] via-white to-[#f4f7f2] relative overflow-hidden">
      {/* Decorative ambient background accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {showHeader && (
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0D3B2E]/10 border border-[#0D3B2E]/20 text-[#0D3B2E] text-xs font-black uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{isTr ? 'LÜKS PERAKENDE SERİSİ' : 'PREMIUM 2 KG RETAIL SERIES'}</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
              {isTr 
                ? 'Nilasya 2 KG Özel Bakliyat Paket Koleksiyonu' 
                : 'Nilasya 2 KG Uniform Pulse Packaging Collection'}
            </h2>

            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
              {isTr
                ? 'Her bakliyat çeşidimiz için özel tasarlanan, şeffaf fasulye pencereli, altın yaldız detaylı ve kilitli 2 KG ambalajlarımız; dünya süpermarket raflarında markanıza prestij ve güven katar.'
                : 'Engineered for international supermarket chains and retail distributors: uniform luxury deep-green & gold foil design, clear inspection window, resealable zip-lock, and nitrogen MAP freshness.'}
            </p>
          </div>
        )}

        {/* Hero Lineup Showcase Card */}
        <div className="relative mb-14 overflow-hidden rounded-3xl bg-[#09221B] text-white shadow-2xl border border-emerald-900/60 p-6 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C5A059]">
                <Layers className="w-4 h-4 text-[#C5A059]" />
                <span>{isTr ? 'TEK TİP KURUMSAL İHRACAT DİZAYNI' : 'UNIFORM PRIVATE LABEL & BRAND DESIGN'}</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                {isTr 
                  ? '6 Temel Bakliyat İçin Tek Tip, Yüksek Prestijli Ambalaj' 
                  : 'Uniform Shelf-Ready 2 KG Retail Packs Across All 6 Core Pulses'}
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                {isTr
                  ? 'Nohut, kırmızı mercimek, yeşil mercimek, kuru fasulye, bulgur ve bezelye paketlerimiz; aynı kurumsal kimlik, Türkçe & uluslararası etiketleme, net 2 kg e gramaj ve koruyucu atmosferde (MAP) paketleme ile dünya çapında ihraç edilmektedir.'
                  : 'Chickpeas, red lentils, green lentils, dry beans, bulgur, and dry peas—all unified under a single luxury corporate identity with crystal-clear product view windows and master carton logistics.'}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-200">
                <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 p-3">
                  <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>{isTr ? 'Gıda Uyumlu Bariyer Film' : 'Food-Grade Barrier Film'}</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 p-3">
                  <Eye className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>{isTr ? 'Geniş Şeffaf Pencere' : 'Clear Inspection Window'}</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 p-3">
                  <Boxes className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>{isTr ? '8x2kg Koli / 72 Palet' : '8x2kg Box / 72 Pallet'}</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 p-3">
                  <Truck className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>{isTr ? '20 MT / 40ft Konteyner' : '20 MT / 40ft Container'}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden shadow-2xl border border-white/15 group">
              <Image
                src="/images/packaging/nilasya-2kg-pulses-packaging-series.jpg"
                alt="Nilasya Agro Foods 2 KG Pulses Packaging Series"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                <span className="font-bold tracking-wide">
                  {isTr ? 'Tüm Seri: Nohut • Kırmızı • Yeşil • Fasulye • Bulgur • Bezelye' : 'Full Lineup: Chickpeas • Red Lentils • Green • Beans • Bulgur • Peas'}
                </span>
                <span className="bg-[#C5A059] text-black px-2.5 py-1 rounded-md font-black text-[11px]">
                  Net: 2 kg e
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 6 Individual Packages Grid */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {isTr ? 'Tek Tek Tasarlanan 2 KG Ürün Paketleri' : 'Individual 2 KG Pulse Packaging Designs'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                {isTr ? 'Detaylı görseli ve ambalaj özelliklerini görmek için ürün kutusuna tıklayın' : 'Click on any product to view high-resolution packaging mockup and technical specs'}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/80 px-3 py-1.5 rounded-full w-fit">
              <Check className="w-3.5 h-3.5 text-emerald-700" />
              <span>{isTr ? '6 Ürünün Tümü Hazır' : 'All 6 Products Ready'}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PACKAGES_2KG.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5"
              >
                {/* Image Box */}
                <div className="relative h-80 w-full overflow-hidden bg-slate-100 cursor-pointer" onClick={() => setActiveModalItem(item)}>
                  <Image
                    src={item.image}
                    alt={`${item.nameTr} - Nilasya Agro Foods 2 KG`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Top Badges */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                    <span className="rounded-full bg-[#0D3B2E]/90 text-[#E8D3A7] border border-[#C5A059]/40 px-3 py-1 text-[11px] font-black uppercase tracking-wider backdrop-blur-md shadow-md">
                      Net: 2 kg e
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveModalItem(item);
                      }}
                      className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/70 transition-colors backdrop-blur-md"
                      title={isTr ? 'Görseli Büyüt' : 'Zoom Image'}
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Bottom Image Overlay Title */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#E8D3A7]">
                      {item.purity} • {item.protein}
                    </div>
                    <h4 className="text-xl font-black leading-snug drop-shadow-md">
                      {isTr ? item.nameTr : item.nameEn}
                    </h4>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {isTr ? item.descriptionTr : item.descriptionEn}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-100">
                      <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
                        <span className="block text-[10px] font-bold uppercase text-slate-400">
                          {isTr ? 'Kalibre' : 'Caliber'}
                        </span>
                        <span className="font-bold text-slate-800 truncate block">
                          {isTr ? item.caliberTr : item.caliberEn}
                        </span>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
                        <span className="block text-[10px] font-bold uppercase text-slate-400">
                          {isTr ? 'Koli / Palet' : 'Master Box'}
                        </span>
                        <span className="font-bold text-slate-800 truncate block">
                          {isTr ? item.boxSpecTr : item.boxSpecEn}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Link to Product */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <button
                      onClick={() => setActiveModalItem(item)}
                      className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{isTr ? 'Tasarımı İncele' : 'View Design'}</span>
                    </button>

                    <Link
                      href={getProductHref(item.productId)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-900 text-white text-xs font-bold transition-colors shadow-sm"
                    >
                      <span>{isTr ? 'Ürün Detayı' : 'Product Page'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Technical Strip */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-base sm:text-lg font-black text-[#0D3B2E]">
              {isTr ? 'Özel Markalı (Private Label) 2 KG Üretim Talebi' : 'Custom Private Label 2 KG Production Requests'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              {isTr
                ? 'Süpermarket zinciriniz veya toptan markanız için kendi logonuz, kendi diliniz ve barkodlarınızla aynı yüksek kalitede 2 KG fason paketleme ve ihracat hizmeti sunuyoruz.'
                : 'We provide full turnkey OEM & Private Label 2 KG packaging with your supermarket brand, custom barcode, multilingual compliance, and guaranteed Sortex quality.'}
            </p>
          </div>

          <Link
            href={`/${lang}/contact/`}
            className="shrink-0 px-6 py-3 rounded-2xl bg-[#0D3B2E] hover:bg-emerald-900 text-white text-xs sm:text-sm font-black transition-all shadow-md hover:shadow-xl uppercase tracking-wider flex items-center gap-2"
          >
            <span>{isTr ? '2 KG Fiyat Teklifi İsteyin' : 'Request 2 KG Quote'}</span>
            <ArrowRight className="w-4 h-4 text-[#C5A059]" />
          </Link>
        </div>
      </div>

      {/* Modal / Quick View Lightbox */}
      {activeModalItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setActiveModalItem(null)}
        >
          <div 
            className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col md:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModalItem(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image Box */}
            <div className="relative md:w-1/2 h-80 md:h-auto bg-slate-900 shrink-0">
              <Image
                src={activeModalItem.image}
                alt={activeModalItem.nameTr}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-4"
              />
              <div className="absolute bottom-4 left-4 z-10">
                <span className="rounded-full bg-[#0D3B2E] text-[#E8D3A7] border border-[#C5A059]/40 px-3 py-1 text-xs font-black uppercase tracking-wider shadow-lg">
                  Net: 2 kg e
                </span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 md:w-1/2 flex flex-col justify-between overflow-y-auto space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{isTr ? 'NİLASYA 2 KG PROFESYONEL PAKET' : 'NILASYA 2 KG RETAIL SPEC'}</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 leading-tight">
                    {isTr ? activeModalItem.nameTr : activeModalItem.nameEn}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500">
                    {isTr ? activeModalItem.subtitleTr : activeModalItem.subtitleEn}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {isTr ? activeModalItem.descriptionTr : activeModalItem.descriptionEn}
                </p>

                {/* Technical Specs List */}
                <div className="space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-700">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">{isTr ? 'Kalibre:' : 'Caliber:'}</span>
                    <span className="font-bold">{isTr ? activeModalItem.caliberTr : activeModalItem.caliberEn}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">{isTr ? 'Saflık:' : 'Purity:'}</span>
                    <span className="font-bold text-emerald-800">{activeModalItem.purity}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">{isTr ? 'Koli Formatı:' : 'Master Box:'}</span>
                    <span className="font-bold">{isTr ? activeModalItem.boxSpecTr : activeModalItem.boxSpecEn}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">{isTr ? 'Palet Standardı:' : 'Pallet Spec:'}</span>
                    <span className="font-bold">{isTr ? activeModalItem.palletSpecTr : activeModalItem.palletSpecEn}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500 font-medium">{isTr ? 'Ambalaj Türü:' : 'Package Type:'}</span>
                    <span className="font-bold">{isTr ? 'Kilitli Pencereli Doypack' : 'Resealable Gusseted Pouch'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-4 border-t border-slate-100">
                <Link
                  href={getProductHref(activeModalItem.productId)}
                  onClick={() => setActiveModalItem(null)}
                  className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-[#0D3B2E] text-white text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2"
                >
                  <span>{isTr ? 'Ürün Detay Sayfasına Git' : 'Go to Product Detail Page'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href={`/${lang}/contact/`}
                  onClick={() => setActiveModalItem(null)}
                  className="w-full py-3 rounded-2xl bg-emerald-100 hover:bg-emerald-200 text-[#0D3B2E] text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2"
                >
                  <span>{isTr ? 'Bu Paket İçin Fiyat Teklifi Al' : 'Request RFQ For This Pack'}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
