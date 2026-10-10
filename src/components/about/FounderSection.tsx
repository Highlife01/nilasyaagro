'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Award, Building2, CheckCircle2, Quote, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { Locale } from '@/types';

interface FounderSectionProps {
  lang: Locale;
}

export const FounderSection: React.FC<FounderSectionProps> = ({ lang }) => {
  const isTr = lang === 'tr';
  const isAr = lang === 'ar';

  const content = isTr
    ? {
        tag: 'Firma Sahibi & Kurucu Vizyonu',
        badge: '2010 Yılından Bu Yana • 15+ Yıllık Tecrübe',
        title: 'Güvenilir Ticaret, Sözleşmeye Sadakat ve Dünya Pazarlarına Kesintisiz İhracat',
        name: 'Abdullah Başaranoğlu',
        titleRole: 'Firma Sahibi & Kurucu',
        companyLegal: 'NİLASYA GLOBAL TARIM İTHALAT VE İHRACAT LİMİTED ŞİRKETİ',
        quote:
          '2010 yılında yola çıkarken temel ilkemiz şuydu: Sözleşme şartnamesine tavizsiz sadakat, şeffaf ticaret ve alıcılarımızın güvenini her şeyin üzerinde tutmak. Çukurova, İç Anadolu ve Güneydoğu havzalarından sözleşmeli çiftçilerimizin hasadını; Mersin Limanı bağlantılı tesislerimizde Sortex optik saflığında işleyerek 50’den fazla ülkeye ulaştırıyoruz. Nilasya olarak biz sadece ürün satmıyor; dünya genelindeki alıcılarımızla onlarca yıla yayılan sağlam tedarik ortaklıkları inşa ediyoruz.',
        p1: 'Nilasya Agro Foods (Nilasya Global Tarım İthalat ve İhracat Ltd. Şti.), 2010 yılından bu yana tarımsal ticaret, tedarik zinciri yönetimi ve uluslararası gıda ihracatında kesintisiz faaliyet göstermektedir.',
        p2: 'Irak, Cezayir, Suudi Arabistan, Sudan, Mısır, Katar ve Avrupa pazarları başta olmak üzere; kırmızı mercimek, nohut, kuru fasulye, durum buğdayı ve Türk makarnasında global alıcıların güvenilir tedarik partneri konumundayız.',
        stats: [
          { label: 'Kuruluş Yılı', value: '2010' },
          { label: 'İhracat Tecrübesi', value: '15+ Yıl' },
          { label: 'İhracat Pazarı', value: '50+ Ülke' },
          { label: 'Yıllık Kapasite', value: '120.000 MT' },
        ],
        pillars: [
          { title: '2010’dan Bu Yana Deneyim', desc: '15 yılı aşkın küresel tarım ticareti ve ihracat birikimi.' },
          { title: 'Mersin Liman Hub', desc: 'MIP konteyner terminaline doğrudan bağlantılı optik eleme ve lojistik.' },
          { title: 'Sortex Saflığı', desc: 'Yüksek optik temizlik ve mutabık kalınan teknik şartname garantisi.' },
          { title: 'Geniş Ürün Yelpazesi', desc: 'Kırmızı mercimek, nohut, fasulye, tahıllar ve Türk makarnası.' },
        ],
        ctaText: 'Firma Sahibi & İhracat Masasıyla İletişime Geçin',
      }
    : isAr
    ? {
        tag: 'رؤية المالك والمؤسس',
        badge: 'منذ عام 2010 • خبرة أكثر من 15 عاماً',
        title: 'تجارة موثوقة والتزام كامل بالمواصفات التعاقدية للأسواق العالمية',
        name: 'عبد الله بصران أوغلو (Abdullah Başaranoğlu)',
        titleRole: 'مالك الشركة ومؤسسها',
        companyLegal: 'شركة نيلاسيا العالمية للزراعة والاستيراد والتصدير المحدودة',
        quote:
          'منذ انطلاقتنا عام 2010، كان مبدأنا الأساسي هو الصدق في التجارة، والالتزام الصارم بالمواصفات الفنية المتفق عليها، ووضع ثقة عملائنا فوق كل اعتبار. نقوم بمعالجة وتصدير محاصيل البقوليات والحبوب من أفضل الحقول التركية عبر ميناء مرسين إلى أكثر من 50 دولة حول العالم، لبناء شراكات توريد مستدامة طويلة الأجل.',
        p1: 'تعمل نيلاسيا (NİLASYA GLOBAL) منذ عام 2010 في مجال التجارة الزراعية وإدارة سلاسل التوريد وتصدير المواد الغذائية التركية إلى الأسواق الدولية.',
        p2: 'نحن شركاء التوريد المعتمدون لكبرى الشركات في العراق، والجزائر، والمملكة العربية السعودية، ومصر، والسودان، وقطر، ودول أوروبا في تصدير العدس الأحمر، الحمص، الفاصوليا، والقمح الصلب والمعكرونة.',
        stats: [
          { label: 'سنة التأسيس', value: '2010' },
          { label: 'الخبرة الدولية', value: '15+ عاماً' },
          { label: 'وجهات التصدير', value: '50+ دولة' },
          { label: 'الطاقة السنوية', value: '120,000 طن' },
        ],
        pillars: [
          { title: 'خبرة منذ 2010', desc: 'أكثر من عقد ونصف من التميز في التصدير الزراعي العالمي.' },
          { title: 'مركز لوجستي بميناء مرسين', desc: 'فرز ومعالجة متطورة وشحن حاويات سريع ومباشر.' },
          { title: 'نقاء Sortex البصري', desc: 'التزام تام بأعلى معايير النظافة والمواصفات التعاقدية.' },
          { title: 'سلة منتجات متكاملة', desc: 'العدس الأحمر، الحمص، الفاصوليا، الحبوب والمعكرونة التركية.' },
        ],
        ctaText: 'تواصل مباشرة مع مكتب الإدارة والتصدير',
      }
    : {
        tag: 'Founder & Executive Leadership',
        badge: 'Established 2010 • 15+ Years Trade Experience',
        title: 'Committed to Integrity, Contractual Precision & Dependable Global Supply',
        name: 'Abdullah Başaranoğlu',
        titleRole: 'Company Owner & Founder',
        companyLegal: 'NİLASYA GLOBAL TARIM İTHALAT VE İHRACAT LİMİTED ŞİRKETİ',
        quote:
          'When we founded Nilasya in 2010, our cornerstone principle was simple: total commitment to agreed contract specifications, transparent trade conduct, and putting buyer trust above all else. Sourcing from contracted growers across Anatolia, we process through modern Sortex optical lines in Mersin and deliver to over 50 countries worldwide. At Nilasya, we do not merely trade commodities; we cultivate enduring supply partnerships.',
        p1: 'Nilasya Agro Foods (Nilasya Global Tarım İthalat ve İhracat Ltd. Şti.) has been operating continuously in agricultural trade, supply chain management, and international food exports since 2010.',
        p2: 'Serving demanding B2B buyers across the Middle East, Gulf, North Africa, and Europe—specifically in Iraq, Algeria, Saudi Arabia, Sudan, Egypt, Qatar, and Italy—we supply premium red lentils, chickpeas, white beans, durum wheat, and Turkish pasta.',
        stats: [
          { label: 'Established', value: '2010' },
          { label: 'Global Experience', value: '15+ Years' },
          { label: 'Export Destinations', value: '50+ Countries' },
          { label: 'Annual Throughput', value: '120,000 MT' },
        ],
        pillars: [
          { title: 'Active Since 2010', desc: 'Over 15 years of proven excellence in international agricultural trade.' },
          { title: 'Mersin Port Hub', desc: 'Direct container terminal handling with advanced optical Sortex processing.' },
          { title: 'Sortex Purity', desc: 'Strict compliance with contracted moisture, sizing, and purity specs.' },
          { title: 'Comprehensive Portfolio', desc: 'Turkish red lentils, chickpeas, beans, durum wheat, and pasta.' },
        ],
        ctaText: 'Contact the Executive Trade Desk',
      };

  return (
    <section className="py-20 lg:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-t border-b border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>{content.tag}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            {content.title}
          </h2>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
            <Award className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{content.badge}</span>
          </div>
        </div>

        {/* 2-Column Executive Spotlight */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Authentic Executive Portrait */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 aspect-[9/14] sm:aspect-[3/4] lg:aspect-[9/13]">
              <Image
                src="/images/about/abdullah-basaranoglu.jpg"
                alt="Abdullah Başaranoğlu - Nilasya Agro Foods Firma Sahibi & Kurucusu"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover object-top hover:scale-105 transition-transform duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

              {/* Floating Profile Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl border border-white/60">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-700 flex items-center justify-center text-white shrink-0 shadow-md">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-base font-black text-slate-950 truncate">
                      {content.name}
                    </div>
                    <div className="text-xs font-bold text-emerald-800 truncate">
                      {content.titleRole}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                      {content.companyLegal}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Corner Decorative Badge */}
            <div className="absolute -top-4 -right-4 hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-800 text-white text-xs font-bold shadow-xl border border-emerald-700/50">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>2010&#39;dan Bu Yana</span>
            </div>
          </div>

          {/* Right Column: Narrative, Quote & Key Pillars */}
          <div className="lg:col-span-7 space-y-8">
            {/* Quote Block */}
            <div className="relative p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-lg space-y-4">
              <Quote className="w-10 h-10 text-emerald-600/20 absolute top-4 right-4" />
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed italic font-medium relative z-10">
                &ldquo;{content.quote}&rdquo;
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-sm font-black text-slate-900">{content.name}</div>
                  <div className="text-xs text-slate-500 font-medium">{content.titleRole}</div>
                </div>
                <div className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  Nilasya Global
                </div>
              </div>
            </div>

            {/* Narrative Paragraphs */}
            <div className="space-y-3 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              <p>{content.p1}</p>
              <p>{content.p2}</p>
            </div>

            {/* 4 Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {content.stats.map((s, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-center"
                >
                  <div className="text-xl sm:text-2xl font-black text-emerald-800 tracking-tight">
                    {s.value}
                  </div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* 4 Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {content.pillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/80 border border-slate-200/70 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">{pillar.title}</div>
                    <div className="text-[11px] text-slate-500 leading-normal mt-0.5">
                      {pillar.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Direct CTA Button */}
            <div className="pt-2">
              <Link
                href={`/${lang}/quote/`}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-700/20"
              >
                <span>{content.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
