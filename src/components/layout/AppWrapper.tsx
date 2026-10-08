'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { WhatsAppFloat } from '../ui/WhatsAppFloat';
import { RFQModal } from '../rfq/RFQModal';
import { Locale } from '@/types';
import { usePathname } from 'next/navigation';
import { productsData } from '@/data/products';

interface AppWrapperProps {
  children: React.ReactNode;
  lang: Locale;
  currentProduct?: string;
}

export const RFQContext = React.createContext<{
  openQuote: (productId?: string) => void;
}>({
  openQuote: () => {},
});

export const AppWrapper: React.FC<AppWrapperProps> = ({
  children,
  lang,
  currentProduct,
}) => {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | undefined>(currentProduct);
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);
  const activeProduct = currentProduct || (pathSegments[1] === 'products'
    ? productsData.find((product) => Object.values(product.slug).includes(pathSegments[2]) || product.id === pathSegments[2])?.id
    : undefined);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // PWA enhancements must never block the main site.
      });
    }
  }, []);

  const openQuote = (productId?: string) => {
    setSelectedProduct(productId || activeProduct);
    setIsQuoteOpen(true);
  };

  const closeQuote = useCallback(() => {
    setIsQuoteOpen(false);
  }, []);

  return (
    <RFQContext.Provider value={{ openQuote }}>
      <div className="min-h-screen flex flex-col justify-between selection:bg-emerald-600 selection:text-white">
        <Navbar lang={lang} onOpenQuote={() => openQuote()} />
        <main className="flex-1">{children}</main>
        <Footer lang={lang} onOpenQuote={() => openQuote()} />
        <WhatsAppFloat lang={lang} productName={activeProduct} />
        {isQuoteOpen && <RFQModal
          key={`${lang}-${selectedProduct || 'default'}`}
          isOpen={isQuoteOpen}
          onClose={closeQuote}
          lang={lang}
          preselectedProduct={selectedProduct}
        />}
      </div>
    </RFQContext.Provider>
  );
};
