export type Locale =
  | 'tr'
  | 'en'
  | 'ar'
  | 'ru'
  | 'de'
  | 'fr'
  | 'es'
  | 'it'
  | 'pt'
  | 'nl'
  | 'pl'
  | 'ro'
  | 'bg'
  | 'el'
  | 'sr'
  | 'uk'
  | 'ka'
  | 'az'
  | 'uz'
  | 'kk'
  | 'fa'
  | 'hi'
  | 'ur'
  | 'bn'
  | 'zh-cn'
  | 'ja'
  | 'ko'
  | 'id'
  | 'ms'
  | 'sw';

export interface LanguageInfo {
  code: Locale;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
  region: 'Global / Europe' | 'Eastern Europe & CIS' | 'Middle East & Africa' | 'Asia & Pacific' | 'Americas';
}

export interface Variety {
  localized?: Record<string, Partial<Pick<Variety, 'name' | 'description' | 'tagline' | 'color' | 'harvestMonths' | 'storage' | 'shelfLife' | 'packagingTypes' | 'characteristics'>>>;
  id?: string;
  slug?: Record<string, string> | string;
  name: string;
  nameTr?: string;
  description: string;
  descriptionTr?: string;
  tagline?: string;
  taglineTr?: string;
  color: string;
  colorTr?: string;
  size: string;
  caliber?: string;
  moisture?: string;
  purity?: string;
  harvestMonths: string;
  harvestMonthsTr?: string;
  storage: string;
  storageTr?: string;
  shelfLife?: string;
  shelfLifeTr?: string;
  image?: string;
  heroImage?: string;
  galleryImages?: string[];
  packagingTypes?: string[];
  packagingTypesTr?: string[];
  characteristics?: string[];
  characteristicsTr?: string[];
}

export interface PackagingOption {
  localized?: Record<string, Partial<Omit<PackagingOption, 'localized'>>>;
  type: string;
  typeTr?: string;
  netWeight: string;
  dimensions: string;
  piecesPerBox?: string;
  boxesPerPallet?: string;
  palletType: string;
  containerCapacity: string;
  image?: string;
}

export interface ProductSpec {
  localized?: Record<string, Partial<Omit<ProductSpec, 'localized'>>>;
  variety: string;
  origin: string;
  originTr?: string;
  size: string;
  caliber: string;
  color: string;
  colorTr?: string;
  moisture?: string;
  purity?: string;
  broken?: string;
  foreignMatter?: string;
  damaged?: string;
  protein?: string;
  class: string;
  shelfLife: string;
  shelfLifeTr?: string;
  storageTemp: string;
  optimalHumidity: string;
}

export interface FAQItem {
  localized?: Record<string, { question: string; answer: string }>;
  question: string;
  questionTr?: string;
  answer: string;
  answerTr?: string;
}

export interface GeoAnswerBlock {
  question: string;
  answer: string;
}

export interface Product {
  id: string;
  slug: Record<string, string>;
  name: Record<string, string>;
  scientificName: string;
  category: Record<string, string>;
  tagline: Record<string, string>;
  shortDescription: Record<string, string>;
  fullDescription: Record<string, string>;
  heroImage: string;
  galleryImages: string[];
  origins: Record<string, string[]>;
  seasonMonths: number[]; // 1-12
  seasonMonthsText: Record<string, string>;
  specifications: ProductSpec;
  varieties: Variety[];
  packagingOptions: PackagingOption[];
  logistics: {
    localized?: Record<string, { transitTimeEU?: string; transitTimeGulf?: string; transitTimeAsia?: string; storageMethod?: string }>;
    modes: ('road' | 'sea' | 'air')[];
    transitTimeEU: string;
    transitTimeGulf: string;
    transitTimeAsia: string;
    storageMethod: string;
    storageMethodTr: string;
  };
  faqs: FAQItem[];
  geoAnswers?: GeoAnswerBlock[];
  seoKeywords: string[];
  accentColor: string;
}

export interface HarvestMonthData {
  productKey: string;
  months: {
    [key: number]: 'harvest' | 'storage' | 'none'; // 1-12
  };
}

export interface ProductionRegion {
  id: string;
  name: {
    en: string;
    tr: string;
  };
  location: string;
  climate: {
    en: string;
    tr: string;
  };
  products: string[];
  productsTr: string[];
  peakMonths: {
    en: string;
    tr: string;
  };
  advantages: {
    en: string[];
    tr: string[];
  };
}

export interface RFQSubmission {
  id?: string;
  referenceCode: string;
  product: string;
  variety?: string;
  caliber?: string;
  quantity: string;
  unit: 'MT' | 'Tons' | 'Pallets' | 'Containers (40ft FCL)' | 'Boxes';
  packaging: string;
  destinationCountry: string;
  destinationCity: string;
  destinationPort?: string;
  incoterm: 'EXW' | 'FCA' | 'FOB' | 'CFR' | 'CIF' | 'DAP';
  targetDeliveryDate?: string;
  companyName: string;
  website?: string;
  contactPerson: string;
  email: string;
  phone: string;
  whatsapp?: string;
  message?: string;
  leadSource?: string;
  createdAt: string;
}

export interface InsightArticle {
  slug: string;
  title: Record<string, string>;
  excerpt: Record<string, string>;
  content: Record<string, string>;
  category: Record<string, string>;
  readTime: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  image: string;
  tags: string[];
}
