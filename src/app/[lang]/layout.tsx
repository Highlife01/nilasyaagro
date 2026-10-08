import React from 'react';
import { Locale } from '@/types';
import { supportedLanguages, isRtlLang } from '@/data/languages';
import { AppWrapper } from '@/components/layout/AppWrapper';
import type { Metadata } from 'next';
import { getTranslations } from '@/data/translations';
import { productsData } from '@/data/products';
import { company } from '@/data/company';
import { localizedSeoDescription } from '@/data/seo';

export function generateStaticParams() {
  return supportedLanguages.map((lang) => ({
    lang: lang.code,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;
  const baseUrl = company.baseUrl;
  const t = getTranslations(lang);
  
  const homePageTitles: Record<string, string> = {
    en: 'Turkish Pulses & Grains Exporter - Premium Chickpeas, Lentils, Beans from Türkiye',
    tr: 'Türk Bakliyat ve Hububat İhracatçısı - Nohut, Mercimek, Fasulye İhracatı',
    ar: 'مصدر البقوليات والحبوب التركية - حمص وعدس وفاصوليا من تركيا',
    ru: 'Экспортер турецких бобовых и зерновых - Нут, чечевица, фасоль из Турции',
    de: 'Türkischer Exporteur von Hülsenfrüchten - Kichererbsen, Linsen, Bohnen',
    fr: 'Exportateur de Légumineuses Turques - Pois Chiches, Lentilles, Haricots',
    es: 'Exportador de Legumbres Turcas - Garbanzos, Lentejas, Frijoles de Turquía',
    it: 'Esportatore di Legumi Turchi - Ceci, Lenticchie, Fagioli dalla Turchia',
    nl: 'Turkse Exporteur van Peulvruchten - Kikkererwten, Linzen, Bonen',
    pl: 'Turecki Eksporter Roślin Strączkowych - Ciecierzyca, Soczewica, Fasola',
    ro: 'Exportator de Leguminoase Turce - Năut, Linte, Fasole din Turcia',
    bg: 'Турски износител на бобови култури - Нахут, леща, боб от Турция',
    el: 'Τούρκος Εξαγωγέας Οσπρίων - Ρεβίθια, Φακές, Φασόλια από την Τουρκία',
    uk: 'Турецький експортер бобових - Нут, сочевиця, квасоля з Туреччини',
    fa: 'صادرکننده حبوبات و غلات ترکیه - نخود، عدس، لوبیا از ترکیه',
    hi: 'तुर्की दाल और अनाज निर्यातक - चना, मसूर, बीन्स तुर्की से',
    ur: 'ترک دالیں اور اناج برآمد کنندہ - چنا، مسور، لوبیا ترکی سے',
    'zh-cn': '土耳其豆类和谷物出口商 - 来自土耳其的鹰嘴豆、扁豆、芸豆',
    ja: 'トルコの豆類・穀物輸出業者 - ひよこ豆、レンズ豆、インゲン豆',
    ko: '터키 두류 및 곡물 수출업체 - 병아리콩, 렌틸콩, 강낭콩',
    id: 'Eksportir Kacang & Biji-bijian Turki - Kacang Arab, Lentil, Kacang Putih',
    ms: 'Pengeksport Kekacang Turki - Kacang Kuda, Lentil, Kacang dari Turkiye',
    pt: 'Exportador de Leguminosas Turcas - Grão-de-bico, Lentilhas, Feijão',
    az: 'Türk Paxlalılar və Taxıl İxracatçısı - Noxud, Mərcimək, Lobya',
    uz: 'Turk dukkaklilar va don eksportchisi - Noxot, yasmiq, loviya',
    kk: 'Түркиялық бұршақты дақылдар экспорттаушысы - Нут, жасымық, бұршақ',
    ka: 'თურქული პარკოსნებისა და მარცვლეულის ექსპორტიორი',
    sr: 'Turski izvoznik mahunарki - Leblebija, sočivo, pasulj iz Turske',
    bn: 'তুর্কি ডাল ও শস্য রপ্তানিকারক - ছোলা, মসুর, বীন বাংলাদেশে',
    sw: 'Msafirishaji wa Mikunde ya Uturuki - Dengu, kunde, maharagwe',
  };
  
  const title = homePageTitles[lang] || homePageTitles.en;
  const description = localizedSeoDescription(lang);

  const languagesObj: Record<string, string> = {
    'x-default': `${baseUrl}/en/`,
  };

  supportedLanguages.forEach((l) => {
    languagesObj[l.code] = `${baseUrl}/${l.code}/`;
  });

  return {
    title: {
      template: '%s | Nilasya Agro Foods',
      default: title,
    },
    description,
    alternates: {
      canonical: `${baseUrl}/${lang}/`,
      languages: languagesObj,
    },
    metadataBase: new URL(baseUrl),
    keywords: [t.nav.products, t.nav.export, t.nav.quality, t.hero.productsList, ...productsData.map((product) => product.name[lang] || product.name.en)],
    openGraph: {
      type: 'website',
      siteName: 'Nilasya Agro Foods',
      locale: lang === 'zh-cn' ? 'zh_CN' : lang.replace('-', '_'),
      alternateLocale: supportedLanguages.filter(l => l.code !== lang).map(l => l.code === 'zh-cn' ? 'zh_CN' : l.code.replace('-', '_')),
      url: `${baseUrl}/${lang}/`,
      title,
      description,
      images: [
        {
          url: '/images/hero/pulses-export-warehouse-nilasya.jpg',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/images/hero/pulses-export-warehouse-nilasya.jpg'] },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;
  const isRtl = isRtlLang(lang);

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${company.baseUrl}/#organization`,
    name: company.name,
    legalName: company.legalName,
    url: company.baseUrl,
    logo: `${company.baseUrl}/logo.png`,
    description: lang === 'tr' 
      ? 'Türkiye\'den bakliyat ve hububat ihracatı - Nohut, mercimek, fasulye, bezelye, durum buğdayı ve bulgur ihracatçısı'
      : 'Turkish pulses and grains exporter - Chickpeas, lentils, beans, peas, durum wheat and bulgur from Türkiye',
    email: company.email,
    telephone: company.phoneDisplay,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Mersin',
      addressCountry: 'TR',
    },
    sameAs: [company.linkedin],
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${company.baseUrl}/#website`,
    url: company.baseUrl,
    name: 'Nilasya Agro Foods',
    publisher: {
      '@id': `${company.baseUrl}/#organization`,
    },
    inLanguage: supportedLanguages.map(l => l.code === 'zh-cn' ? 'zh-CN' : l.code),
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} lang={lang} className={isRtl ? 'font-sans rtl' : 'font-sans'}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <AppWrapper lang={lang}>{children}</AppWrapper>
    </div>
  );
}
