import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { company } from '@/data/company';
import { supportedLanguages, isRtlLang } from '@/data/languages';

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
  description:
    'Nilasya Agro Foods is an enterprise Turkish processor and exporter of premium pulses and grains (Kabuli Chickpeas, Red Lentils, Green Lentils, White Beans, Dry Peas, Durum Wheat & Bulgur) shipped globally via Mersin Port.',
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
    title: 'Nilasya Agro Foods — Premium Turkish Pulses & Grains. Delivered Worldwide.',
    description:
      'Enterprise B2B exporter of premium Turkish chickpeas, red lentils, green lentils, dry beans, peas, and durum wheat from Mersin Port.',
    url: company.baseUrl,
    siteName: 'Nilasya Agro Foods',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/hero/pulses-export-warehouse-nilasya.jpg',
        width: 1200,
        height: 630,
        alt: 'Nilasya Agro Foods - B2B Pulses and Grains Exporter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nilasya Agro Foods — B2B Pulses & Grains Exporter',
    description:
      'Direct Turkish processor and bulk exporter of Sortex-cleaned pulses and grains with strict quality assurance.',
    images: ['/images/hero/pulses-export-warehouse-nilasya.jpg'],
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
        <link rel="alternate" type="text/markdown" href="/llms.txt" title="Nilasya Agro Foods LLM Context Summary (Markdown)" />
        <link rel="alternate" type="text/markdown" href="/llms-full.txt" title="Nilasya Agro Foods Full Knowledge Base (Markdown)" />

        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var l=location.pathname.split('/')[1];var s=${JSON.stringify(supportedLanguages.map(({ code }) => code))};if(s.indexOf(l)<0)l='en';document.documentElement.lang=l;document.documentElement.dir=${JSON.stringify(supportedLanguages.filter(({ code }) => isRtlLang(code)).map(({ code }) => code))}.indexOf(l)>=0?'rtl':'ltr'})();`,
          }}
        />
        {/* Organization JSON-LD Schema with Extended AI & Entity Signals */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: company.name,
              legalName: company.legalName,
              url: company.baseUrl,
              logo: `${company.baseUrl}/icons/icon-512.png`,
              image: `${company.baseUrl}/images/hero/pulses-export-warehouse-nilasya.jpg`,
              slogan: 'Premium Turkish Pulses & Grains. Delivered Worldwide.',
              description:
                'Nilasya Agro Foods is an international B2B trading house and processor of premium pulses, grains, and agricultural commodities based in Mersin and Central Anatolia, Türkiye.',
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'TR',
                addressLocality: 'Mersin / Konya / Izmir',
                addressRegion: 'Mediterranean & Central Anatolia',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: company.phoneE164,
                contactType: 'sales',
                email: company.email,
                availableLanguage: supportedLanguages.map(({ name }) => name),
                areaServed: [
                  'Middle East & GCC',
                  'European Union',
                  'North Africa',
                  'South & Southeast Asia',
                  'CIS & Central Asia',
                  'Americas',
                ],
              },
              knowsAbout: [
                'B2B Pulses and Grains Export',
                'Turkish Chickpeas (Kabuli & Kocbasi Nohut)',
                'Turkish Red Lentils (Football and Split Sortex)',
                'Turkish Green Lentils (Laird and Eston)',
                'White Beans (Dermason, Horoz, Cannellini)',
                'Dry Peas (Yellow and Green Split Peas)',
                'Durum Wheat and Turkish Bulgur',
                'Sortex Optical Color Sorting Technology',
                'Container Shipping from Mersin International Port',
                'ISO 22000, HACCP and Halal Food Safety Standards',
                'Incoterms 2020 (FOB Mersin, CIF, CFR, DAP)',
              ],
              sameAs: [
                company.linkedin,
              ],
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased bg-[#FDFBF7] text-[#172421] selection:bg-[#0D3B2E] selection:text-[#FDFBF7]">
        {children}
      </body>
    </html>
  );
}
