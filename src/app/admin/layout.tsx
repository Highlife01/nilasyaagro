import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Süper Admin Paneli | Nilasya Agro Foods Tarım İhracat',
  description: 'Nilasya Agro Foods kurumsal yönetim, ihracat talepleri ve lojistik kontrol merkezi.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-600 selection:text-white font-sans antialiased">
      {children}
    </div>
  );
}
