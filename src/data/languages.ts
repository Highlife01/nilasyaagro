import { LanguageInfo } from '@/types';

export const supportedLanguages: LanguageInfo[] = [
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', dir: 'ltr', region: 'Global / Europe' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', dir: 'ltr', region: 'Global / Europe' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl', region: 'Middle East & Africa' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', dir: 'ltr', region: 'Eastern Europe & CIS' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', dir: 'ltr', region: 'Global / Europe' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr', region: 'Global / Europe' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr', region: 'Global / Europe' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', dir: 'ltr', region: 'Global / Europe' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', dir: 'ltr', region: 'Global / Europe' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', dir: 'ltr', region: 'Global / Europe' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', dir: 'ltr', region: 'Eastern Europe & CIS' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴', dir: 'ltr', region: 'Eastern Europe & CIS' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', flag: '🇧🇬', dir: 'ltr', region: 'Eastern Europe & CIS' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷', dir: 'ltr', region: 'Eastern Europe & CIS' },
  { code: 'sr', name: 'Serbian', nativeName: 'Srpski', flag: '🇷🇸', dir: 'ltr', region: 'Eastern Europe & CIS' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦', dir: 'ltr', region: 'Eastern Europe & CIS' },
  { code: 'ka', name: 'Georgian', nativeName: 'ქართული', flag: '🇬🇪', dir: 'ltr', region: 'Eastern Europe & CIS' },
  { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan', flag: '🇦🇿', dir: 'ltr', region: 'Eastern Europe & CIS' },
  { code: 'uz', name: 'Uzbek', nativeName: "O'zbekcha", flag: '🇺🇿', dir: 'ltr', region: 'Eastern Europe & CIS' },
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақша', flag: '🇰🇿', dir: 'ltr', region: 'Eastern Europe & CIS' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷', dir: 'rtl', region: 'Middle East & Africa' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', dir: 'ltr', region: 'Asia & Pacific' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', dir: 'rtl', region: 'Asia & Pacific' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', dir: 'ltr', region: 'Asia & Pacific' },
  { code: 'zh-cn', name: 'Chinese Simplified', nativeName: '简体中文', flag: '🇨🇳', dir: 'ltr', region: 'Asia & Pacific' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', dir: 'ltr', region: 'Asia & Pacific' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', dir: 'ltr', region: 'Asia & Pacific' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', dir: 'ltr', region: 'Asia & Pacific' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾', dir: 'ltr', region: 'Asia & Pacific' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪', dir: 'ltr', region: 'Middle East & Africa' },
];

export const isRtlLang = (lang: string): boolean => {
  return ['ar', 'fa', 'ur'].includes(lang);
};

export const getLanguageInfo = (lang: string): LanguageInfo => {
  return supportedLanguages.find((l) => l.code === lang) || supportedLanguages[0];
};

