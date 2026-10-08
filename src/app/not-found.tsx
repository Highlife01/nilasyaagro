import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Compass } from 'lucide-react';

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The requested page could not be found on Nilasya Agro Foods.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-20 h-20 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
          <Compass className="w-10 h-10 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <span className="text-emerald-400 font-mono text-xs uppercase tracking-widest font-bold">
            404 • ROUTE NOT FOUND
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Looks like this product took another route.
          </h1>
          <p className="text-slate-400 text-sm">
            The page you are looking for might have been moved or is temporarily unavailable.
          </p>
        </div>

        <div>
          <Link
            href="/en/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg"
          >
            <span>Explore Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
