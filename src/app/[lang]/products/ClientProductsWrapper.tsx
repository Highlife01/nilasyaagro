'use client';

import React, { useContext } from 'react';
import { Locale } from '@/types';
import { FinalCTASection } from '@/components/home/FinalCTASection';
import { RFQContext } from '@/components/layout/AppWrapper';

export const ClientProductsWrapper: React.FC<{ lang: Locale }> = ({ lang }) => {
  const { openQuote } = useContext(RFQContext);
  return <FinalCTASection lang={lang} onOpenQuote={() => openQuote()} />;
};
