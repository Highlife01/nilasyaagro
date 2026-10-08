'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Globe, 
  Menu, 
  X, 
  ChevronDown, 
  FileText, 
  Search,
  Check
} from 'lucide-react';
import { Locale } from '@/types';
import { getTranslations } from '@/data/translations';
import { productsData } from '@/data/products';
import { supportedLanguages, getLanguageInfo } from '@/data/languages';

interface NavbarProps {
  lang: Locale;
  onOpenQuote: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ lang, onOpenQuote }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [langModalOpen, setLangModalOpen] = useState(false);
  const [langSearch, setLangSearch] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  const currentLangInfo = getLanguageInfo(lang);
  const t = getTranslations(lang).nav;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const switchLanguage = (newLang: Locale) => {
    setLangModalOpen(false);
    setMobileMenuOpen(false);
    if (newLang === lang) return;

    const currentSegments = pathname.split('/').filter(Boolean);
    if (currentSegments.length === 0) {
      router.push(`/${newLang}/`);
      return;
    }

    const subRoute = currentSegments[1];

    if (subRoute === 'products' && currentSegments[2]) {
      const currentSlug = currentSegments[2].toLowerCase();
      const currentProduct = productsData.find(
        (p) => Object.values(p.slug).includes(currentSlug) || p.id === currentSlug
      );

      if (currentProduct) {
        const targetSlug = currentProduct.slug[newLang] || currentProduct.slug.en || currentProduct.id;
        router.push(`/${newLang}/products/${targetSlug}/`);
        return;
      }
    }

    const restOfPath = currentSegments.slice(1).join('/');
    router.push(`/${newLang}/${restOfPath ? restOfPath + '/' : ''}`);
  };

  const getProductHref = (slugObj: Record<string, string>, id: string) => {
    const slug = slugObj[lang] || slugObj.en || id;
    return `/${lang}/products/${slug}/`;
  };

  const filteredLanguages = supportedLanguages.filter(
    (l) =>
      l.name.toLowerCase().includes(langSearch.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(langSearch.toLowerCase()) ||
      l.code.toLowerCase().includes(langSearch.toLowerCase())
  );

  const regions = [
    'Global / Europe',
    'Eastern Europe & CIS',
    'Middle East & Africa',
    'Asia & Pacific',
  ] as const;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/98 backdrop-blur-xl shadow-lg shadow-slate-900/5 border-b border-emerald-900/10 py-2.5'
          : 'bg-gradient-to-b from-slate-950/90 via-slate-950/60 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link
            href={`/${lang}/`}
            className="flex items-center gap-3 group focus:outline-none shrink-0"
            aria-label="Nilasya Agro Foods Homepage"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-[#0D3B2E] via-[#165643] to-[#071F18] flex items-center justify-center shadow-lg shadow-emerald-950/40 group-hover:scale-105 transition-transform duration-300 border border-amber-400/40">
              <span className="text-amber-400 font-black text-xl sm:text-2xl tracking-tighter">N</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span
                  className={`text-xl sm:text-2xl font-black tracking-tight ${
                    isScrolled ? 'text-[#0D3B2E]' : 'text-white'
                  }`}
                >
                  NILASYA
                </span>
                <span className="text-xl sm:text-2xl font-bold text-amber-500 tracking-wider">
                  AGRO FOODS
                </span>
              </div>
              <span
                className={`text-[10px] uppercase tracking-widest font-extrabold mt-0.5 ${
                  isScrolled ? 'text-amber-700' : 'text-amber-300'
                }`}
              >
                B2B Pulses & Grains • Türkiye
              </span>
            </div>
          </Link>

          {/* Desktop Multi-Page Navigation (Insights moved to Footer per user instruction) */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6">
            <Link
              href={`/${lang}/`}
              className={`text-[13px] font-extrabold uppercase tracking-wider transition-colors ${
                isScrolled
                  ? 'text-slate-800 hover:text-emerald-600'
                  : 'text-slate-100 hover:text-emerald-300'
              }`}
            >
              {t.home}
            </Link>

            {/* Products Mega Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setProductsDropdownOpen(true)}
              onMouseLeave={() => setProductsDropdownOpen(false)}
            >
              <button
                type="button"
                className={`flex items-center gap-1 text-[13px] font-extrabold uppercase tracking-wider transition-colors focus:outline-none ${
                  isScrolled
                    ? 'text-slate-800 hover:text-emerald-600'
                    : 'text-slate-100 hover:text-emerald-300'
                }`}
              >
                <span>{t.products}</span>
                <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
              </button>

              {productsDropdownOpen && (
                <div className="absolute top-full -left-6 w-88 pt-3 animate-fade-in z-50">
                  <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-3 space-y-1 max-h-[75vh] overflow-y-auto scrollbar-thin">
                    <Link
                      href={`/${lang}/products/`}
                      className="block px-4 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider transition-colors shadow-md shadow-emerald-900/10"
                    >
                      {lang === 'tr' ? 'Tüm Ürünler Kataloğu →' : 'All Products Catalog →'}
                    </Link>
                    <div className="border-t border-slate-100 my-1" />
                    {productsData.map((prod) => (
                      <Link
                        key={prod.id}
                        href={getProductHref(prod.slug, prod.id)}
                        className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-800 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span>{prod.name[lang] || prod.name.en}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded-md">
                          {prod.specifications.class}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href={`/${lang}/harvest-calendar/`}
              className={`text-[13px] font-extrabold uppercase tracking-wider transition-colors ${
                isScrolled
                  ? 'text-slate-800 hover:text-emerald-600'
                  : 'text-slate-100 hover:text-emerald-300'
              }`}
            >
              {t.calendar}
            </Link>

            <Link
              href={`/${lang}/production/`}
              className={`text-[13px] font-extrabold uppercase tracking-wider transition-colors ${
                isScrolled
                  ? 'text-slate-800 hover:text-emerald-600'
                  : 'text-slate-100 hover:text-emerald-300'
              }`}
            >
              {t.production}
            </Link>

            <Link
              href={`/${lang}/quality/`}
              className={`text-[13px] font-extrabold uppercase tracking-wider transition-colors ${
                isScrolled
                  ? 'text-slate-800 hover:text-emerald-600'
                  : 'text-slate-100 hover:text-emerald-300'
              }`}
            >
              {t.quality}
            </Link>

            <Link
              href={`/${lang}/packaging/`}
              className={`text-[13px] font-extrabold uppercase tracking-wider transition-colors ${
                isScrolled
                  ? 'text-slate-800 hover:text-emerald-600'
                  : 'text-slate-100 hover:text-emerald-300'
              }`}
            >
              {t.packaging}
            </Link>

            <Link
              href={`/${lang}/export/`}
              className={`text-[13px] font-extrabold uppercase tracking-wider transition-colors ${
                isScrolled
                  ? 'text-slate-800 hover:text-emerald-600'
                  : 'text-slate-100 hover:text-emerald-300'
              }`}
            >
              {t.export}
            </Link>

            <Link
              href={`/${lang}/about/`}
              className={`text-[13px] font-extrabold uppercase tracking-wider transition-colors ${
                isScrolled
                  ? 'text-slate-800 hover:text-emerald-600'
                  : 'text-slate-100 hover:text-emerald-300'
              }`}
            >
              {t.about}
            </Link>

            <Link
              href={`/${lang}/contact/`}
              className={`text-[13px] font-extrabold uppercase tracking-wider transition-colors ${
                isScrolled
                  ? 'text-slate-800 hover:text-emerald-600'
                  : 'text-slate-100 hover:text-emerald-300'
              }`}
            >
              {t.contact}
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {/* 30 Languages Button */}
            <button
              type="button"
              onClick={() => setLangModalOpen(true)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-black transition-all border ${
                isScrolled
                  ? 'bg-slate-100 border-slate-300 text-slate-900 hover:bg-slate-200'
                  : 'bg-white/15 border-white/25 text-white hover:bg-white/25'
              }`}
              title="Change Language (30 Languages Available)"
            >
              <Globe className="w-4 h-4 text-amber-400" />
              <span className="text-sm">{currentLangInfo.flag}</span>
              <span className="uppercase tracking-wide">{currentLangInfo.code}</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono hidden xl:inline">
                30 DİL
              </span>
            </button>

            {/* Request Quote Button */}
            <button
              type="button"
              onClick={onOpenQuote}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-[#0D3B2E] hover:from-amber-400 hover:to-amber-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-950/40 hover:shadow-amber-500/30 transition-all hover:scale-105 active:scale-95"
            >
              <FileText className="w-4 h-4 text-amber-200" />
              <span>{t.requestQuote}</span>
            </button>
          </div>

          {/* Mobile Menu & Lang Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setLangModalOpen(true)}
              className={`min-h-11 min-w-14 touch-manipulation p-2.5 rounded-2xl border font-bold flex items-center justify-center gap-1.5 ${
                isScrolled
                  ? 'bg-slate-100 border-slate-300 text-slate-900'
                  : 'bg-white/15 border-white/25 text-white'
              }`}
            >
              <span className="text-base">{currentLangInfo.flag}</span>
              <span className="text-xs uppercase">{currentLangInfo.code}</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`min-h-11 min-w-11 touch-manipulation p-2.5 rounded-2xl focus:outline-none ${
                isScrolled ? 'text-slate-950 bg-slate-100' : 'text-white bg-white/10'
              }`}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 25 Languages Global Modal / Selector */}
      {langModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg animate-fade-in">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-950 text-white flex items-center justify-between border-b border-emerald-800/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    Select Your Language / Dil Seçiniz
                  </h3>
                  <p className="text-xs text-amber-300">
                    30 Global Export Markets • 30 Uluslararası Dil Desteği
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLangModalOpen(false)}
                className="min-h-11 min-w-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors touch-manipulation"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={langSearch}
                  onChange={(e) => setLangSearch(e.target.value)}
                  placeholder="Search language / Dil ara (e.g. English, Deutsch, Español, العربية, Русский, 日本語)..."
                  className="min-h-12 w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-2xl text-base sm:text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 touch-manipulation"
                />
              </div>
            </div>

            {/* Language Grid by Region */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
              {regions.map((reg) => {
                const groupLangs = filteredLanguages.filter((l) => l.region === reg);
                if (groupLangs.length === 0) return null;

                return (
                  <div key={reg} className="space-y-3">
                    <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      <span>{reg}</span>
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                      {groupLangs.map((l) => (
                        <button
                          key={l.code}
                          type="button"
                          onClick={() => switchLanguage(l.code)}
                          className={`min-h-14 p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between touch-manipulation ${
                            l.code === lang
                              ? 'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                              : 'bg-white border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-slate-900 shadow-sm'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-2xl shrink-0">{l.flag}</span>
                            <div className="truncate">
                              <div className={`text-xs font-extrabold truncate ${l.code === lang ? 'text-white' : 'text-slate-900'}`}>
                                {l.nativeName}
                              </div>
                              <div className={`text-[10px] font-medium truncate ${l.code === lang ? 'text-emerald-100' : 'text-slate-500'}`}>
                                {l.name}
                              </div>
                            </div>
                          </div>
                          {l.code === lang && (
                            <Check className="w-4 h-4 text-white shrink-0 ml-1" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium">
              <span>Selected: <strong className="text-emerald-700 font-black">{currentLangInfo.name} ({currentLangInfo.nativeName})</strong></span>
              <button
                type="button"
                onClick={() => setLangModalOpen(false)}
                className="min-h-11 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl touch-manipulation"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/98 backdrop-blur-2xl border-b border-emerald-900/40 px-6 py-6 space-y-4 animate-fade-in text-white">
          <div className="flex flex-col space-y-3 text-sm font-bold divide-y divide-white/10">
            <Link
              href={`/${lang}/`}
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-12 py-3 hover:text-emerald-400 flex items-center justify-between touch-manipulation"
            >
              <span>{t.home}</span>
              <span className="text-emerald-400 text-xs">→</span>
            </Link>
            <Link
              href={`/${lang}/products/`}
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-12 pt-3 pb-3 hover:text-emerald-400 flex items-center justify-between touch-manipulation"
            >
              <span>{t.products}</span>
              <span className="text-emerald-400 text-xs">6 Produce</span>
            </Link>
            <Link
              href={`/${lang}/harvest-calendar/`}
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-12 pt-3 pb-3 hover:text-emerald-400 touch-manipulation"
            >
              {t.calendar}
            </Link>
            <Link
              href={`/${lang}/production/`}
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-12 pt-3 pb-3 hover:text-emerald-400 touch-manipulation"
            >
              {t.production}
            </Link>
            <Link
              href={`/${lang}/quality/`}
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-12 pt-3 pb-3 hover:text-emerald-400 touch-manipulation"
            >
              {t.quality}
            </Link>
            <Link
              href={`/${lang}/packaging/`}
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-12 pt-3 pb-3 hover:text-emerald-400 touch-manipulation"
            >
              {t.packaging}
            </Link>
            <Link
              href={`/${lang}/export/`}
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-12 pt-3 pb-3 hover:text-emerald-400 touch-manipulation"
            >
              {t.export}
            </Link>
            <Link
              href={`/${lang}/about/`}
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-12 pt-3 pb-3 hover:text-emerald-400 touch-manipulation"
            >
              {t.about}
            </Link>
            <Link
              href={`/${lang}/contact/`}
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-12 pt-3 pb-3 hover:text-emerald-400 touch-manipulation"
            >
              {t.contact}
            </Link>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-3">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuote();
              }}
              className="min-h-12 w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-emerald-950/50 touch-manipulation"
            >
              {t.requestQuote}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
