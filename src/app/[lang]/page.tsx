import { HomeClient } from '@/components/home/HomeClient';
import { supportedLanguages } from '@/data/languages';
import { localizedHomeTitle, localizedSeoDescription } from '@/data/seo';
import { serializeJsonLd, webPageSchema } from '@/lib/structuredData';
import { Locale } from '@/types';

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = (supportedLanguages.some((l) => l.code === resolvedParams.lang)
    ? resolvedParams.lang
    : 'en') as Locale;
  const pageJsonLd = webPageSchema(lang, '', localizedHomeTitle(lang), localizedSeoDescription(lang), {
    image: '/images/og/nilasya-export-1200x630.jpg',
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(pageJsonLd) }} />
      <HomeClient lang={lang} />
    </>
  );
}
