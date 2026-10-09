import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { company } from '@/data/company';
import { getCompanyFactLabels } from '@/data/companyFacts';
import { supportedLanguages, isRtlLang } from '@/data/languages';
import { organizationSchema, websiteSchema, serializeJsonLd } from '@/lib/structuredData';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#0D3B2E',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  applicationName: 'Nilasya Agro Foods',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }],
  },
  appleWebApp: {
    capable: true,
    title: 'Nilasya Agro Foods',
    statusBarStyle: 'black-translucent',
  },
  metadataBase: new URL(company.baseUrl),
  title: {
    default: 'Nilasya Agro Foods — B2B Pulses, Grains & Agricultural Commodities Exporter',
    template: '%s | Nilasya Agro Foods',
  },
  description: getCompanyFactLabels('en').description,
  keywords: [
    'Turkish pulses exporter',
    'chickpeas supplier Turkey',
    'red lentils bulk export Mersin',
    'green lentils Turkey',
    'white beans Dermason supplier',
    'durum wheat export',
    'Turkish bulgur bulk exporter',
    'B2B agricultural commodities Turkey',
    'Nilasya Agro Foods',
  ],
  authors: [{ name: 'Nilasya Agro Foods International Trade Desk', url: company.baseUrl }],
  creator: 'Nilasya Agro Foods',
  publisher: company.legalName,
  openGraph: {
    title: 'Nilasya Agro Foods — Pulses & Grains Trade Enquiries',
    description: getCompanyFactLabels('en').description,
    url: company.baseUrl,
    siteName: 'Nilasya Agro Foods',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/og/nilasya-export-1200x630.jpg',
        width: 1200,
        height: 630,
        alt: 'Nilasya Agro Foods - B2B Pulses and Grains Exporter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nilasya Agro Foods — B2B Pulses & Grains Exporter',
    description: getCompanyFactLabels('en').description,
    images: ['/images/og/nilasya-export-1200x630.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${jakarta.variable} scroll-smooth`}>
      <head>
        {/* Machine-Readable AI & LLM Discovery Standards (llms.txt & llms-full.txt) */}
        <link rel="alternate" type="text/markdown" href="/llms.txt" title="Nilasya Agro Foods LLM Context Summary (English Markdown)" />
        <link rel="alternate" type="text/markdown" href="/llms-full.txt" title="Nilasya Agro Foods Full Knowledge Base (Markdown)" />
        <link rel="alternate" type="text/markdown" href="/llms-tr.txt" title="Nilasya Agro Foods LLM Bağlam Özeti (Türkçe Markdown)" />
        <link rel="alternate" type="text/markdown" href="/llms-ar.txt" title="Nilasya Agro Foods LLM سياق وملخص المنتجات (العربية Markdown)" />

        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var l=location.pathname.split('/')[1];var s=${JSON.stringify(supportedLanguages.map(({ code }) => code))};if(s.indexOf(l)<0)l='en';document.documentElement.lang=l;document.documentElement.dir=${JSON.stringify(supportedLanguages.filter(({ code }) => isRtlLang(code)).map(({ code }) => code))}.indexOf(l)>=0?'rtl':'ltr'})();`,
          }}
        />
        {/* Organization & WebSite JSON-LD Schema with Extended AI & Entity Signals */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd([organizationSchema(), websiteSchema()]),
          }}
        />
      </head>
      <body className="font-sans antialiased bg-[#FDFBF7] text-[#172421] selection:bg-[#0D3B2E] selection:text-[#FDFBF7]">
        {children}
      </body>
    </html>
  );
}
