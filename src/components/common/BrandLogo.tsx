'use client';

import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark'; // 'light' means light text (for dark backgrounds), 'dark' means dark text (for light backgrounds)
  showText?: boolean;
  showTagline?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'light',
  showText = true,
  showTagline = false,
}) => {
  const iconSizes = {
    sm: { w: 32, h: 32, textMain: 'text-lg', textSub: 'text-[9px]' },
    md: { w: 42, h: 42, textMain: 'text-xl sm:text-2xl', textSub: 'text-[10px]' },
    lg: { w: 56, h: 56, textMain: 'text-2xl sm:text-3xl', textSub: 'text-xs' },
    xl: { w: 72, h: 72, textMain: 'text-3xl sm:text-4xl', textSub: 'text-sm' },
  }[size];

  const textColorMain = variant === 'light' ? 'text-white' : 'text-slate-950';
  const textColorSub = variant === 'light' ? 'text-emerald-400' : 'text-emerald-700';

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Scalable Vector Emblem */}
      <svg
        width={iconSizes.w}
        height={iconSizes.h}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-105"
        aria-hidden="true"
      >
        <defs>
          {/* Emerald Gradient */}
          <linearGradient id="nilasyaEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="60%" stopColor="#059669" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          {/* Golden Sun & Orbit Gradient */}
          <linearGradient id="nilasyaGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          {/* Vibrant Leaf Gradient */}
          <linearGradient id="nilasyaLeaf" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>

          {/* Subtle Glow Filter */}
          <filter id="subtleGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#059669" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Outer Circular Flow / Shield Base (Transparent Subtle Background) */}
        <rect
          x="4"
          y="4"
          width="92"
          height="92"
          rx="24"
          fill={variant === 'light' ? 'rgba(5, 150, 105, 0.15)' : 'rgba(5, 150, 105, 0.08)'}
          stroke="url(#nilasyaEmerald)"
          strokeWidth="1.5"
          strokeDasharray="4 2"
        />

        {/* Golden Global Orbital Arc (Symbolizing Worldwide Export Logistics) */}
        <path
          d="M 16 68 C 12 40, 36 16, 70 18 C 84 19, 88 32, 82 44 C 74 60, 48 76, 22 72 C 18 71, 15 69, 16 68 Z"
          fill="none"
          stroke="url(#nilasyaGold)"
          strokeWidth="4.5"
          strokeLinecap="round"
          filter="url(#subtleGlow)"
        />

        {/* Golden Sun Accent Sparkle */}
        <circle cx="75" cy="24" r="3.5" fill="url(#nilasyaGold)" />

        {/* Letter 'N' - Left Pillar */}
        <path
          d="M 28 72 L 28 28 C 28 25, 33 25, 34 28 L 34 72 C 34 75, 28 75, 28 72 Z"
          fill="url(#nilasyaEmerald)"
        />

        {/* Letter 'N' - Diagonal Fresh Produce Leaf (Sprout of Anatolia) */}
        <path
          d="M 30 30 C 44 42, 54 54, 68 70 C 68 70, 72 50, 60 38 C 48 26, 32 29, 30 30 Z"
          fill="url(#nilasyaLeaf)"
        />

        {/* Leaf Central Rib Line */}
        <path
          d="M 32 31 C 42 42, 54 53, 66 69"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeOpacity="0.75"
        />

        {/* Letter 'N' - Right Pillar */}
        <path
          d="M 64 72 L 64 28 C 64 25, 70 25, 70 28 L 70 72 C 70 75, 64 75, 64 72 Z"
          fill="url(#nilasyaEmerald)"
        />
      </svg>

      {/* Typography Wordmark */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5 font-black tracking-tight">
            <span className={`${iconSizes.textMain} ${textColorMain} tracking-tight`}>
              NILASYA
            </span>
            <span className={`${iconSizes.textMain} text-emerald-500 font-light tracking-wider`}>
              GLOBAL
            </span>
          </div>

          {showTagline && (
            <span className={`${iconSizes.textSub} font-bold uppercase tracking-widest mt-1 ${textColorSub}`}>
              Fresh Produce Exporter • Türkiye
            </span>
          )}
        </div>
      )}
    </div>
  );
};
