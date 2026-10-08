export interface Translations {
  nav: {
    home: string;
    about: string;
    products: string;
    production: string;
    quality: string;
    packaging: string;
    export: string;
    calendar: string;
    sustainability: string;
    insights: string;
    contact: string;
    requestQuote: string;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    productsList: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stats: {
      countries: string;
      countriesLabel: string;
      supply: string;
      supplyLabel: string;
      regions: string;
      regionsLabel: string;
      products: string;
      productsLabel: string;
    };
  };
  trustStrip: {
    fresh: { title: string; desc: string };
    reliable: { title: string; desc: string };
    traceable: { title: string; desc: string };
    global: { title: string; desc: string };
  };
  productsSection: {
    titleSmall: string;
    titleMain: string;
    subtitle: string;
    viewProduct: string;
    requestPrice: string;
    season: string;
    origin: string;
    varieties: string;
    specifications: string;
    exploreAll: string;
  };
  companyIntro: {
    tag: string;
    title: string;
    p1: string;
    p2: string;
    pill1: string;
    pill2: string;
    pill3: string;
    pill4: string;
    learnMore: string;
  };
  farmToWorld: {
    tag: string;
    title: string;
    subtitle: string;
    steps: {
      num: string;
      title: string;
      desc: string;
    }[];
  };
  productionMap: {
    tag: string;
    title: string;
    subtitle: string;
    exploreRegion: string;
    advantages: string;
    climate: string;
    mainProduce: string;
  };
  harvestCalendar: {
    tag: string;
    title: string;
    subtitle: string;
    legendHarvest: string;
    legendStorage: string;
    legendNone: string;
    viewFullCalendar: string;
    tableSummary: string;
  };
  qualitySection: {
    tag: string;
    title: string;
    subtitle: string;
    traceabilityTitle: string;
    traceabilitySubtitle: string;
    flow: string[];
    certificationsTitle: string;
    certificationsNotice: string;
  };
  packagingSection: {
    tag: string;
    title: string;
    subtitle: string;
    privateLabelTitle: string;
    privateLabelSubtitle: string;
    featuresList: string[];
    viewSpecs: string;
  };
  logisticsSection: {
    tag: string;
    title: string;
    subtitle: string;
    road: { title: string; desc: string };
    sea: { title: string; desc: string };
    air: { title: string; desc: string };
    coldChainTitle: string;
    coldChainDesc: string;
  };
  insightsSection: {
    tag: string;
    title: string;
    subtitle: string;
    readMore: string;
    viewAll: string;
  };
  finalCta: {
    title: string;
    subtitle: string;
    btnQuote: string;
    btnWhatsapp: string;
  };
  rfq: {
    modalTitle: string;
    modalSubtitle: string;
    step1Title: string;
    step2Title: string;
    step3Title: string;
    step4Title: string;
    step5Title: string;
    productLabel: string;
    varietyLabel: string;
    quantityLabel: string;
    unitLabel: string;
    packagingLabel: string;
    destCountryLabel: string;
    destCityLabel: string;
    destPortLabel: string;
    incotermLabel: string;
    targetDateLabel: string;
    companyNameLabel: string;
    websiteLabel: string;
    contactPersonLabel: string;
    emailLabel: string;
    phoneLabel: string;
    whatsappLabel: string;
    messageLabel: string;
    nextBtn: string;
    prevBtn: string;
    submitBtn: string;
    submitting: string;
    successTitle: string;
    successDesc: string;
    refCodeLabel: string;
    successNote: string;
    closeBtn: string;
  };
  footer: {
    description: string;
    quickLinks: string;
    products: string;
    company: string;
    export: string;
    insights: string;
    contact: string;
    address: string;
    phone: string;
    email: string;
    whatsapp: string;
    workingHours: string;
    rights: string;
    privacy: string;
    terms: string;
    entityStatement: string;
  };
}

// Master Base English & Turkish
import { translationsData } from './translationsData';

export const translations: Record<string, Translations> = translationsData;

export const getTranslations = (lang: string): Translations => {
  return translations[lang] || translations['en'];
};
