'use client';

import React from 'react';
import Image from 'next/image';
import { Locale } from '@/types';
import { Camera, CheckCircle2, Play, Sparkles, Video } from 'lucide-react';

interface FacilityGalleryProps {
  lang: Locale;
}

export const FacilityGallery: React.FC<FacilityGalleryProps> = ({ lang }) => {
  const isTr = lang === 'tr';
  const isAr = lang === 'ar';

  const t = isTr
    ? {
        tag: 'Saha & Operasyon Doğrulaması',
        title: 'Gerçek Tesis, Eleme, Laboratuvar ve Ambalaj Süreçleri',
        subtitle:
          'Nilasya Agro Foods operasyon merkezinde gerçekleştirilen optik eleme, konveyör torbalama, numune inceleme ve kalite kontrollerinden gerçek saha kayıtları.',
        videosTitle: 'Canlı İşleme ve Paketleme Kayıtları',
        photosTitle: 'Laboratuvar ve Ürün Numunelerimiz',
        v1: {
          title: 'Kuru Fasulye Konveyör Torbalama Hattı',
          desc: 'Mersin tesisimizde FCL konteyner sevkiyatları için 25kg/50kg PP çuvallara otomatik dolum ve konveyör hattı.',
          badge: 'Paketleme Hattı',
        },
        v2: {
          title: 'Sortex Yeşil Mercimek Kalite İncelemesi',
          desc: 'Optik eleme sonrasında tane iriliği, homojen renk ve kabuk sağlamlığı fiziksel kontrolü.',
          badge: 'Fiziksel Kontrol',
        },
        v3: {
          title: 'Sarı Bezelye Laboratuvar Analizi',
          desc: 'Sevkiyat partisi öncesinde numune çanağında nem, kırık tane ve kalibre doğrulaması.',
          badge: 'Laboratuvar Masası',
        },
        photos: [
          {
            src: '/images/facility/turkish-split-red-lentils-sortex.jpg',
            title: 'Kırmızı Yaprak Mercimek',
            desc: 'Sortex optik saflığında cilalanmış Türk kırmızı mercimeği.',
          },
          {
            src: '/images/facility/turkish-red-lentils-sorting-tray.jpg',
            title: 'Optik Eleme Tepsisi',
            desc: 'Bühler Sortex çıkışında renk kusuru ve yabancı madde kontrolü.',
          },
          {
            src: '/images/facility/turkish-yellow-peas-lab-sample.jpg',
            title: 'Kuru Sarı Bezelye',
            desc: 'Laboratuvar numune tepsisinde homojen tane boylama tespiti.',
          },
          {
            src: '/images/facility/turkish-flaxseed-linseed.jpg',
            title: 'Temizlenmiş Keten Tohumu',
            desc: 'Yüksek yağ ve saflık oranında elenmiş kahverengi keten tohumu.',
          },
          {
            src: '/images/facility/turkish-white-sorghum-seed.jpg',
            title: 'Ak Darı / Beyaz Sorghum',
            desc: 'Çuvallama öncesi el ile dolgunluk ve tane sağlığı kontrolü.',
          },
        ],
      }
    : isAr
    ? {
        tag: 'التحقق الميداني والتشغيلي',
        title: 'عمليات الفرز والتعبئة والمختبر الحية في منشأتنا',
        subtitle:
          'تسجيلات وصور حية ومباشرة من منشأة نيلاسيا (Nilasya Agro Foods) لعمليات الفرز الضوئي Sortex، وتعبئة الحبوب، وفحوصات الجودة المخبرية.',
        videosTitle: 'تسجيلات حية لخطوط الفرز والتعبئة',
        photosTitle: 'عينات المنتجات والفحص المخبري',
        v1: {
          title: 'خط تعبئة الفاصولياء البيضاء بالسيور الناقلة',
          desc: 'تعبئة آلية دقيقة في أكياس PP بحجم 25 و50 كغ لشحنات الحاويات عبر ميناء مرسين.',
          badge: 'خط التعبئة',
        },
        v2: {
          title: 'فحص جودة العدس الأخضر بعد Sortex',
          desc: 'فحص يدوي ومجهري لتجانس الحبة واللون وخلوها من الشوائب بعد الفرز الضوئي.',
          badge: 'فحص مادي',
        },
        v3: {
          title: 'فحص مخبري للبازلاء الصفراء المجففة',
          desc: 'اختبار دقيق لنسبة الرطوبة وحجم الحبة وتجانسها قبل الشحن.',
          badge: 'المختبر',
        },
        photos: [
          {
            src: '/images/facility/turkish-split-red-lentils-sortex.jpg',
            title: 'عدس أحمر مجروش تركي',
            desc: 'نقاء بصري فائق بلون مرجاني زاهٍ ومعالجة Sortex دقيقة.',
          },
          {
            src: '/images/facility/turkish-red-lentils-sorting-tray.jpg',
            title: 'صينية فحص الفرز الضوئي',
            desc: 'مراقبة العينات أثناء خروجها من خطوط الفرز الضوئي.',
          },
          {
            src: '/images/facility/turkish-yellow-peas-lab-sample.jpg',
            title: 'بازلاء صفراء مجففة',
            desc: 'فحص مخبري لحجم الحبات ومعايير التجانس.',
          },
          {
            src: '/images/facility/turkish-flaxseed-linseed.jpg',
            title: 'بذور كتان بنية نقية',
            desc: 'مُنظفة ومفروزة بنقاء عالٍ للتصدير الغذائي والصناعي.',
          },
          {
            src: '/images/facility/turkish-white-sorghum-seed.jpg',
            title: 'ذرة بيضاء / داري',
            desc: 'فحص يدوي لجودة الحبوب وامتلاء الحبة قبل التعبئة.',
          },
        ],
      }
    : {
        tag: 'Field & Operational Verification',
        title: 'Authentic Facility, Sorting, Lab & Bagging Operations',
        subtitle:
          'Direct photographic and video documentation from Nilasya Agro Foods operations hub: optical Sortex screening, conveyor bagging, and laboratory grading.',
        videosTitle: 'Live Bagging & Inspection Footage',
        photosTitle: 'Laboratory Grading & Commodity Samples',
        v1: {
          title: 'White Beans Packaging Conveyor Line',
          desc: 'Automated 25kg/50kg PP sack filling and conveyor sewing line prepared for FCL container export at Mersin.',
          badge: 'Packaging Line',
        },
        v2: {
          title: 'Sortex Green Lentils Hand Inspection',
          desc: 'Post-optical Sortex examination verifying seed integrity, uniform calibration, and zero foreign matter.',
          badge: 'Physical Inspection',
        },
        v3: {
          title: 'Yellow Peas Laboratory Caliber Analysis',
          desc: 'Laboratory grading tray analysis confirming moisture limits (<14%), split percentage, and round caliber.',
          badge: 'Quality Lab',
        },
        photos: [
          {
            src: '/images/facility/turkish-split-red-lentils-sortex.jpg',
            title: 'Turkish Split Red Lentils',
            desc: 'Sortex optical purity with brilliant natural coral-red hue.',
          },
          {
            src: '/images/facility/turkish-red-lentils-sorting-tray.jpg',
            title: 'Optical Sorting Inspection Tray',
            desc: 'In-line monitoring of Sortex discharge ensuring zero discolored seeds.',
          },
          {
            src: '/images/facility/turkish-yellow-peas-lab-sample.jpg',
            title: 'Dry Yellow Peas Sample',
            desc: 'Laboratory grading dish confirming calibrated round sizing.',
          },
          {
            src: '/images/facility/turkish-flaxseed-linseed.jpg',
            title: 'Cleaned Brown Flaxseed',
            desc: 'Cleaned and optical sorted oilseeds ready for container export.',
          },
          {
            src: '/images/facility/turkish-white-sorghum-seed.jpg',
            title: 'White Sorghum / Dari Grains',
            desc: 'Physical hand verification of seed plumpness prior to bagging.',
          },
        ],
      };

  return (
    <section className="py-20 lg:py-28 bg-slate-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.tag}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {t.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            {t.subtitle}
          </p>
        </div>

        {/* 3 Video Cards Grid */}
        <div className="mb-20">
          <div className="flex items-center gap-2 mb-6">
            <Video className="w-5 h-5 text-emerald-400" />
            <h3 className="text-xl font-bold text-white">{t.videosTitle}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Video 1: White Beans Conveyor */}
            <div className="rounded-3xl bg-slate-800/90 border border-slate-700/80 overflow-hidden shadow-xl flex flex-col">
              <div className="relative aspect-[9/14] sm:aspect-[9/12] bg-black">
                <video
                  src="/videos/white-beans-packaging-conveyor.mp4"
                  controls
                  preload="metadata"
                  poster="/images/facility/video-thumb-2.jpg"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-emerald-600/90 backdrop-blur-sm text-white text-[11px] font-bold shadow-md">
                  {t.v1.badge}
                </span>
              </div>
              <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-bold text-white">{t.v1.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">{t.v1.desc}</p>
                </div>
                <div className="pt-3 border-t border-slate-700/60 flex items-center gap-2 text-[11px] text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Nilasya Mersin Lojistik Terminali</span>
                </div>
              </div>
            </div>

            {/* Video 2: Green Lentils Inspection */}
            <div className="rounded-3xl bg-slate-800/90 border border-slate-700/80 overflow-hidden shadow-xl flex flex-col">
              <div className="relative aspect-[9/14] sm:aspect-[9/12] bg-black">
                <video
                  src="/videos/green-lentils-inspection.mp4"
                  controls
                  preload="metadata"
                  poster="/images/facility/video-thumb-1.jpg"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-emerald-600/90 backdrop-blur-sm text-white text-[11px] font-bold shadow-md">
                  {t.v2.badge}
                </span>
              </div>
              <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-bold text-white">{t.v2.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">{t.v2.desc}</p>
                </div>
                <div className="pt-3 border-t border-slate-700/60 flex items-center gap-2 text-[11px] text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Sortex Kalite Muayenesi</span>
                </div>
              </div>
            </div>

            {/* Video 3: Yellow Peas Analysis */}
            <div className="rounded-3xl bg-slate-800/90 border border-slate-700/80 overflow-hidden shadow-xl flex flex-col">
              <div className="relative aspect-[9/14] sm:aspect-[9/12] bg-black">
                <video
                  src="/videos/yellow-peas-lab-analysis.mp4"
                  controls
                  preload="metadata"
                  poster="/images/facility/video-thumb-3.jpg"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-emerald-600/90 backdrop-blur-sm text-white text-[11px] font-bold shadow-md">
                  {t.v3.badge}
                </span>
              </div>
              <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-bold text-white">{t.v3.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">{t.v3.desc}</p>
                </div>
                <div className="pt-3 border-t border-slate-700/60 flex items-center gap-2 text-[11px] text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Laboratuvar Numune Tespiti</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5 Real Photos Showcase */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Camera className="w-5 h-5 text-emerald-400" />
            <h3 className="text-xl font-bold text-white">{t.photosTitle}</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {t.photos.map((item, idx) => (
              <div
                key={idx}
                className="group rounded-2xl bg-slate-800/80 border border-slate-700/80 overflow-hidden shadow-lg hover:border-emerald-500/50 transition-all duration-300"
              >
                <div className="relative aspect-square overflow-hidden bg-slate-950">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                </div>
                <div className="p-3.5 space-y-1">
                  <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {item.title}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal line-clamp-2">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
