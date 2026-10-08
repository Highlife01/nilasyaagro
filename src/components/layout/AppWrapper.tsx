'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { WhatsAppFloat } from '../ui/WhatsAppFloat';
import { RFQModal } from '../rfq/RFQModal';
import { Locale } from '@/types';

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

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // PWA enhancements must never block the main site.
      });
    }
  }, []);

  const openQuote = (productId?: string) => {
    setSelectedProduct(productId || currentProduct);
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
        <WhatsAppFloat lang={lang} productName={currentProduct} />
        <RFQModal
          isOpen={isQuoteOpen}
          onClose={closeQuote}
          lang={lang}
          preselectedProduct={selectedProduct}
        />
      </div>
    </RFQContext.Provider>
  );
};
