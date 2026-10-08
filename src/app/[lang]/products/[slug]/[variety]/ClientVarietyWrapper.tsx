'use client';

import React, { useContext } from 'react';
import { Product, Variety, Locale } from '@/types';
import { VarietyHero } from '@/components/variety/VarietyHero';
import { VarietySpecs } from '@/components/variety/VarietySpecs';
import { VarietyGallery } from '@/components/variety/VarietyGallery';
import { SiblingVarieties } from '@/components/variety/SiblingVarieties';
import { FinalCTASection } from '@/components/home/FinalCTASection';
import { RFQContext } from '@/components/layout/AppWrapper';

interface ClientVarietyWrapperProps {
  product: Product;
  variety: Variety;
  lang: Locale;
}

export const ClientVarietyWrapper: React.FC<ClientVarietyWrapperProps> = ({
  product,
  variety,
  lang,
}) => {
  const { openQuote } = useContext(RFQContext);

  return (
    <div>
      {/* 1. Dedicated Variety Hero with Breadcrumbs & Metrics */}
      <VarietyHero
        product={product}
        variety={variety}
        lang={lang}
        onOpenQuote={() => openQuote(product.id)}
      />

      {/* 2. Content Sections Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Variety Gallery (multi-photo showcase if available) */}
        <VarietyGallery variety={variety} lang={lang} />

        {/* Technical Specification Matrix */}
        <VarietySpecs product={product} variety={variety} lang={lang} />

        {/* Sibling Varieties switcher (Granny Smith <-> Gala <-> Golden etc.) */}
        <SiblingVarieties product={product} currentVariety={variety} lang={lang} />
      </div>

      {/* 3. Final B2B Call to Action */}
      <FinalCTASection lang={lang} onOpenQuote={() => openQuote(product.id)} />
    </div>
  );
};
