'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const browserLang = navigator.language?.slice(0, 2).toLowerCase();
    const supported = [
      'tr', 'en', 'ar', 'ru', 'de', 'fr', 'es', 'it', 'pt', 'nl', 
      'pl', 'ro', 'bg', 'el', 'sr', 'uk', 'ka', 'az', 'uz', 'kk', 
      'fa', 'hi', 'ur', 'bn', 'zh-cn', 'ja', 'ko', 'id', 'ms', 'sw'
    ];
    const target = supported.includes(browserLang) ? browserLang : 'en';
    router.replace(`/${target}/`);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 text-center">
      <meta httpEquiv="refresh" content="0; url=/en/" />
      <div className="space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs uppercase tracking-widest font-bold text-emerald-950 font-mono">
          Connecting to Nilasya Agro Foods Global Trade Desk...
        </p>
      </div>
    </div>
  );
}
