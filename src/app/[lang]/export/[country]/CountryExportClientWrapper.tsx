'use client';

import React, { useContext } from 'react';
import { Locale } from '@/types';
import { FinalCTASection } from '@/components/home/FinalCTASection';
import { RFQContext } from '@/components/layout/AppWrapper';

interface CountryExportClientWrapperProps {
  lang: Locale;
}

export const CountryExportClientWrapper: React.FC<CountryExportClientWrapperProps> = ({
  lang,
}) => {
  const { openQuote } = useContext(RFQContext);

  return <FinalCTASection lang={lang} onOpenQuote={() => openQuote()} />;
};
