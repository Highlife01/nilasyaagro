'use client';

import { useContext } from 'react';
import type { Locale } from '@/types';
import { RFQContext } from '@/components/layout/AppWrapper';
import { HarvestCalendarSection } from './HarvestCalendarSection';

export function HarvestCalendarWithQuote({ lang }: { lang: Locale }) {
  const { openQuote } = useContext(RFQContext);
  return <HarvestCalendarSection lang={lang} onOpenQuoteWithProduct={openQuote} />;
}
