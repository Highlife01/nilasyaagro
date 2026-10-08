import React from 'react';
import { ShieldCheck, Truck, Sprout, Globe } from 'lucide-react';
import { Locale } from '@/types';
import { getTranslations } from '@/data/translations';

export const TrustStrip: React.FC<{ lang: Locale }> = ({ lang }) => {
  const t = getTranslations(lang).trustStrip;

  const pillars = [
    {
      icon: Sprout,
      title: t.fresh.title,
      desc: t.fresh.desc,
      color: 'text-emerald-800 bg-[#e7f3ea] border-[#cce7d3]',
    },
    {
      icon: Truck,
      title: t.reliable.title,
      desc: t.reliable.desc,
      color: 'text-teal-800 bg-[#e5f2f0] border-[#c9e4df]',
    },
    {
      icon: ShieldCheck,
      title: t.traceable.title,
      desc: t.traceable.desc,
      color: 'text-[#8a6625] bg-[#fbf1dd] border-[#f0dfb8]',
    },
    {
      icon: Globe,
      title: t.global.title,
      desc: t.global.desc,
      color: 'text-sky-800 bg-[#e7f0f6] border-[#cedfea]',
    },
  ];

  return (
    <section className="relative z-20 -mt-7 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-[1.75rem] border border-[#dfe8e1] bg-white/95 p-5 shadow-[0_20px_44px_-28px_rgba(16,42,38,0.5)] backdrop-blur-xl lg:p-7">
        <div className="grid grid-cols-1 divide-y divide-[#e8eee9] sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div key={idx} className={`flex items-start gap-3.5 py-4 sm:px-5 sm:py-1 ${idx === 0 ? 'sm:pl-1' : ''} ${idx === pillars.length - 1 ? 'sm:pr-1' : ''}`}>
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${pillar.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-[15px] font-bold leading-tight text-[#102a26]">{pillar.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500">{pillar.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
