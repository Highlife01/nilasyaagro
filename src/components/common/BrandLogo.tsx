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

  const textColorMain = variant === 'light' ? 'text-white' : 'text-[#0D3B2E]';
  const textColorSub = variant === 'light' ? 'text-amber-400' : 'text-amber-600';

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Scalable Vector Emblem - Anatolian Grain & Pulse Ear */}
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
          {/* Deep Forest Gradient */}
          <linearGradient id="agroForest" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#165643" />
            <stop offset="60%" stopColor="#0D3B2E" />
            <stop offset="100%" stopColor="#071F18" />
          </linearGradient>

          {/* Golden Harvest Gradient */}
          <linearGradient id="agroGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#c8963e" />
          </linearGradient>

          {/* Subtle Glow Filter */}
          <filter id="goldGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#f59e0b" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Shield Frame */}
        <rect
          x="4"
          y="4"
          width="92"
          height="92"
          rx="24"
          fill="url(#agroForest)"
          stroke="#f59e0b"
          strokeWidth="1.5"
          strokeOpacity="0.4"
        />

        {/* Golden Global Orbital Arc */}
        <path
          d="M 18 70 C 14 42, 38 18, 72 20 C 86 21, 90 34, 84 46 C 76 62, 50 78, 24 74 Z"
          fill="none"
          stroke="url(#agroGold)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="4 2"
          filter="url(#goldGlow)"
        />

        {/* Golden Sun Grain Accent */}
        <circle cx="76" cy="24" r="3.5" fill="url(#agroGold)" />

        {/* Stylized Grain Ear / N Monogram */}
        {/* Left Column */}
        <path
          d="M 30 72 L 30 28 C 30 25, 36 25, 36 28 L 36 72 C 36 75, 30 75, 30 72 Z"
          fill="url(#agroGold)"
        />

        {/* Diagonal Wheat Ear Blade */}
        <path
          d="M 32 30 C 44 42, 56 54, 70 70 C 70 70, 74 52, 62 38 C 50 26, 34 29, 32 30 Z"
          fill="url(#agroGold)"
        />

        {/* Grain Kernel Detail */}
        <path
          d="M 34 32 C 44 43, 56 54, 68 68"
          stroke="#071F18"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeOpacity="0.8"
        />

        {/* Right Column */}
        <path
          d="M 64 72 L 64 28 C 64 25, 70 25, 70 28 L 70 72 C 70 75, 64 75, 64 72 Z"
          fill="url(#agroGold)"
        />
      </svg>

      {/* Typography Wordmark */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5 font-black tracking-tight">
            <span className={`${iconSizes.textMain} ${textColorMain} tracking-tight font-black`}>
              NILASYA
            </span>
            <span className={`${iconSizes.textMain} text-amber-500 font-bold tracking-wider`}>
              AGRO FOODS
            </span>
          </div>

          {showTagline && (
            <span className={`${iconSizes.textSub} font-extrabold uppercase tracking-widest mt-1 ${textColorSub}`}>
              B2B Pulses & Grains • Türkiye
            </span>
          )}
        </div>
      )}
    </div>
  );
};
