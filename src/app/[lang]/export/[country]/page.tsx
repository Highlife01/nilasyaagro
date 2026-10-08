import React from 'react';
import { Locale } from '@/types';
import { supportedLanguages } from '@/data/languages';
import { exportCountriesData } from '@/data/countries';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Truck, Ship, FileCheck2, ShieldCheck, MapPin, ArrowRight, CheckCircle2, HelpCircle } from 'lucide-react';
import { CountryExportClientWrapper } from './CountryExportClientWrapper';
import { productsData } from '@/data/products';
import { localizedAlternates } from '@/lib/metadata';
import { getTranslations } from '@/data/translations';
import { getPageTranslations } from '@/data/pageTranslations';
import { company } from '@/data/company';

export function generateStaticParams() {
  const params: { lang: string; country: string }[] = [];

  for (const lang of supportedLanguages) {
    for (const country of exportCountriesData) {
      params.push({
        lang: lang.code,
        country: country.slug,
      });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; country: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;
  const countrySlug = resolvedParams.country;

  const country = exportCountriesData.find((c) => c.slug === countrySlug);
  if (!country) return {};

  const countryName = country.name[lang] || country.name.native || country.name.en;
  const t = getTranslations(lang);

  return {
    title: `${countryName} ${t.nav.export} | Nilasya Agro Foods`,
    description: country.overview[lang] || country.overview.en,
    alternates: localizedAlternates(lang, `export/${countrySlug}`),
    robots: { index: true, follow: true },
  };
}

export default async function CountryExportPage({
  params,
}: {
  params: Promise<{ lang: string; country: string }>;
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;
  const countrySlug = resolvedParams.country;
  const pt = getPageTranslations(lang).exportPage;

  const country = exportCountriesData.find((c) => c.slug === countrySlug);
  if (!country) notFound();

  const countryName = country.name[lang] || country.name.native || country.name.en;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'B2B Pulses, Grains & Agricultural Commodities Export',
    provider: {
      '@type': 'Organization',
      name: company.name,
      url: company.baseUrl,
      telephone: company.phoneE164,
      email: company.email,
    },
    areaServed: {
      '@type': 'Country',
      name: country.name.en,
    },
    description: country.overview[lang] || country.overview.en,
  };

  return (
    <div className="pt-24 bg-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header for Specific Country */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="max-w-4xl space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
              <Link href={`/${lang}/export/`} className="hover:underline flex items-center gap-1">
                <span>{pt.globalExport}</span>
                <span>/</span>
              </Link>
              <span className="text-white">{countryName}</span>
            </div>

            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white text-xs font-black">
              <span className="text-xl">{country.flag}</span>
              <span>{country.region}</span>
              <span>•</span>
              <span className="text-emerald-300">{country.name.native}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
              {lang === 'tr'
                ? `Türkiye'den ${countryName}'ya Bakliyat ve Hububat İhracatı`
                : `Turkish Pulses & Grains Supplier & Exporter to ${countryName}`}
            </h1>

            <p className="text-base sm:text-xl text-slate-200 leading-relaxed font-normal">
              {country.overview[lang] || country.overview.en}
            </p>

            {/* Key Logistics Quick Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {country.transitTime.road && (
                <div className="p-4 rounded-2xl bg-white/10 border border-white/15 flex items-center gap-3">
                  <Truck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-300 uppercase font-bold block">{pt.roadReefer}</span>
                    <span className="text-xs font-black text-white">{country.transitTime.road}</span>
                  </div>
                </div>
              )}

              {country.transitTime.sea && (
                <div className="p-4 rounded-2xl bg-white/10 border border-white/15 flex items-center gap-3">
                  <Ship className="w-5 h-5 text-teal-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-300 uppercase font-bold block">{pt.gulfSea}</span>
                    <span className="text-xs font-black text-white">{country.transitTime.sea}</span>
                  </div>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-white/10 border border-white/15 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0" />
                <div className="truncate">
                  <span className="text-[10px] text-slate-300 uppercase font-bold block">{pt.dischargeHubs}</span>
                  <span className="text-xs font-black text-white truncate block">{country.mainPorts}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Country Specifications & FAQ & Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* GEO Direct Answer Block */}
        <div className="bg-emerald-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-800 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-400">
            <HelpCircle className="w-4 h-4" />
            <span>GEO & AI Verified Sourcing Fact</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {lang === 'tr' 
              ? `${countryName} için Türk Bakliyat ve Hububat Tedariki Nasıl Yapılır?`
              : `How does Nilasya Agro Foods supply pulses & grains to ${countryName}?`}
          </h2>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
            {country.geoAnswer[lang] || country.geoAnswer.en}
          </p>
        </div>

        {/* Detailed Grid: Documentation & Incoterms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Required Export Documentation */}
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {pt.customsCertsTitle}
                </h3>
                <span className="text-xs text-slate-500">{countryName} {lang === 'tr' ? 'standartlarına tam uyumlu' : 'compliant'}</span>
              </div>
            </div>

            <div className="space-y-2.5">
              {country.documents.map((doc, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 text-xs font-bold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Supported Incoterms & Delivery Terms */}
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {pt.incotermsTitle}
                </h3>
                <span className="text-xs text-slate-500">{lang === 'tr' ? 'Uluslararası Ticaret Standartları' : 'ICC International Commercial Terms'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {country.incoterms.map((incoterm, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200/80 text-center space-y-1">
                  <div className="text-lg font-black text-emerald-700 font-mono">{incoterm}</div>
                  <div className="text-[10px] text-slate-500 font-medium">{countryName} Delivery</div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
              <strong className="block font-bold">{pt.proforma24hTitle}</strong>
              <span>{pt.proforma24hDesc}</span>
            </div>
          </div>

        </div>

        {/* Popular Fresh Produce for This Market */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black text-slate-950">
                {lang === 'tr' ? `${countryName} Pazarında En Çok Talep Gören Ürünler` : `Top Demand Turkish Produce for ${countryName}`}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {pt.topProduceSub}
              </p>
            </div>
            <Link
              href={`/${lang}/products/`}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <span>{pt.fullCatalog}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productsData.slice(0, 3).map((prod) => (
              <Link
                key={prod.id}
                href={`/${lang}/products/${prod.slug[lang] || prod.slug.en || prod.id}/`}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all p-5 flex items-center gap-4"
              >
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  <Image
                    src={prod.heroImage}
                    alt={prod.name[lang] || prod.name.en}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                    {prod.specifications.class}
                  </span>
                  <h4 className="text-base font-black text-slate-950 group-hover:text-emerald-700 transition-colors truncate">
                    {prod.name[lang] || prod.name.en}
                  </h4>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {prod.specifications.brix} • {prod.seasonMonthsText[lang] || prod.seasonMonthsText.en}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>

        {/* Other Global Export Destinations */}
        <div className="space-y-6 pt-8 border-t border-slate-200">
          <h3 className="text-xl font-black text-slate-950">
            {pt.otherMarkets}
          </h3>
          <div className="flex flex-wrap gap-2">
            {exportCountriesData.filter((c) => c.slug !== countrySlug).map((c) => (
              <Link
                key={c.id}
                href={`/${lang}/export/${c.slug}/`}
                className="px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-800 text-xs font-bold transition-colors flex items-center gap-2 border border-slate-200/80"
              >
                <span>{c.flag}</span>
                <span>{c.name[lang] || c.name.native || c.name.en}</span>
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* Country Export Client Wrapper with RFQ */}
      <CountryExportClientWrapper lang={lang} />
    </div>
  );
}
