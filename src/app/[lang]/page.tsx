'use client';

import React, { useContext } from 'react';
import { use } from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { TrustStrip } from '@/components/home/TrustStrip';
import { ProductGrid } from '@/components/home/ProductGrid';
import { CompanyIntro } from '@/components/home/CompanyIntro';
import { FarmToWorldFlow } from '@/components/home/FarmToWorldFlow';
import { ProductionMap } from '@/components/home/ProductionMap';
import { HarvestCalendarSection } from '@/components/home/HarvestCalendarSection';
import { QualityTraceabilitySection } from '@/components/home/QualityTraceabilitySection';
import { PackagingShowcase } from '@/components/home/PackagingShowcase';
import { GlobalLogisticsSection } from '@/components/home/GlobalLogisticsSection';
import { InsightsSection } from '@/components/home/InsightsSection';
import { FinalCTASection } from '@/components/home/FinalCTASection';
import { RFQContext } from '@/components/layout/AppWrapper';
import { Locale } from '@/types';
import { supportedLanguages } from '@/data/languages';

export default function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = use(params);
  const lang = (supportedLanguages.some((l) => l.code === resolvedParams.lang)
    ? resolvedParams.lang
    : 'en') as Locale;
  const { openQuote } = useContext(RFQContext);

  return (
    <div className="space-y-0">
      <HeroSection lang={lang} onOpenQuote={() => openQuote()} />
      <TrustStrip lang={lang} />
      <ProductGrid lang={lang} onOpenQuoteWithProduct={(productId) => openQuote(productId)} />
      <CompanyIntro lang={lang} />
      <FarmToWorldFlow lang={lang} />
      <ProductionMap lang={lang} />
      <HarvestCalendarSection lang={lang} />
      <QualityTraceabilitySection lang={lang} />
      <PackagingShowcase lang={lang} />
      <GlobalLogisticsSection lang={lang} />
      <InsightsSection lang={lang} />
      <FinalCTASection lang={lang} onOpenQuote={() => openQuote()} />
    </div>
  );
}
