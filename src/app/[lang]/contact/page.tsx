import React from 'react';
import { Locale } from '@/types';
import { supportedLanguages } from '@/data/languages';
import { Mail, Phone, MapPin, Clock, MessageCircle, Sparkles } from 'lucide-react';
import { ClientContactForm } from './ClientContactForm';
import type { Metadata } from 'next';
import { company } from '@/data/company';
import { getTranslations } from '@/data/translations';
import { localizedSeoDescription } from '@/data/seo';

import { getPageTranslations } from '@/data/pageTranslations';

export function generateStaticParams() {
  return supportedLanguages.map((l) => ({ lang: l.code }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;
  const t = getTranslations(lang);

  return {
    title: t.nav.contact,
    description: localizedSeoDescription(lang, t.nav.contact),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;
  const pt = getPageTranslations(lang).contactPage;

  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>{pt.tag}</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-950 tracking-tight leading-tight">
            {pt.title}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            {pt.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-emerald-950 text-white p-8 rounded-3xl shadow-xl space-y-6">
              <h2 className="text-2xl font-bold text-white">
                {pt.officeTitle}
              </h2>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">
                      {pt.packhouseLabel}
                    </strong>
                    <span className="text-emerald-100">
                      Çukurova & Mersin Agricultural Export Zone / Istanbul Commercial Desk, Türkiye
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <strong className="text-white block">Phone:</strong>
                    <a href={`tel:${company.phoneE164}`} className="text-emerald-200 hover:text-white">
                      {company.phoneDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <strong className="text-white block">Email:</strong>
                    <a href={`mailto:${company.email}`} className="text-emerald-200 hover:text-white">
                      {company.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <strong className="text-white block">WhatsApp Export Desk:</strong>
                    <a
                      href={`https://wa.me/${company.whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-300 hover:text-emerald-200 font-bold"
                    >
                      {company.phoneDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <strong className="text-white block">Business Hours:</strong>
                    <span className="text-emerald-200">Mon - Fri: 08:30 - 18:30 (GMT+3)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ClientContactForm lang={lang} />
          </div>
        </div>
      </div>
    </div>
  );
}
