import { pageTranslationsData } from './pageTranslationsData';

export interface PageTranslations {
  about: {
    tag: string;
    title: string;
    subtitle: string;
    valuesTitle: string;
    valuesSubtitle: string;
    valQualityTitle: string;
    valQualityDesc: string;
    valGrowerTitle: string;
    valGrowerDesc: string;
    valExportTitle: string;
    valExportDesc: string;
  };
  productsPage: {
    tag: string;
    title: string;
    subtitle: string;
    pills: {
      chickpeas: string;
      redLentils: string;
      greenLentils: string;
      whiteBeans: string;
      dryPeas: string;
      durumWheat: string;
      pomegranate?: string;
      apples?: string;
      grapes?: string;
      kiwi?: string;
      citrus?: string;
      tomatoes?: string;
      [key: string]: string | undefined;
    };
  };
  productDetail: {
    purityLabel: string;
    moistureLabel: string;
    proteinLabel: string;
    specificationLabels: Record<string, string>;
    sourcingTitle: string;
    sourcingQuestion: string;
    sourcingAnswer: string;
    packagingLabel: string;
    specificationsNote: string;
    galleryTitle: string;
    previousPhoto: string;
    nextPhoto: string;
    closeGallery: string;
    viewPhoto: string;
    viewDetails: string;
    caliberDiameter: string;
    brixSweetness: string;
    standardGrade: string;
    specsTitle: string;
    varietiesTitle: string;
    packagingStandardsTitle: string;
    standardFormatsTitle: string;
    suitableFor: string;
    technicalConfigurationsTitle: string;
    dimensions: string;
    pieces: string;
    pallet: string;
    coldChainLogisticsTitle: string;
    transitProtocolTitle: string;
    transitTimeEU: string;
    transitTimeGulf: string;
    transitTimeAsia: string;
    faqTitle: string;
    exploreOther: string;
    harvestLabel: string;
    storageLabel: string;
    originBasins: string;
    brixSugar: string;
    commercialGrade: string;
    unitWeight: string;
    optimumTemp: string;
    humidity: string;
    maxPostHarvest: string;
    factBoxBadge: string;
    productCategory: string;
    countryOrigin: string;
    primaryVarieties: string;
    brixGrade: string;
    supplyWindow: string;
    verifiedSupplier: string;
  };
  productionPage: {
    tag: string;
    title: string;
    subtitle: string;
  };
  qualityPage: {
    tag: string;
    title: string;
    subtitle: string;
  };
  packagingPage: {
    tag: string;
    title: string;
    subtitle: string;
    palletSpecsTitle: string;
    suitableFor: string;
    material: string;
  };
  exportPage: {
    tag: string;
    title: string;
    subtitle: string;
    corridorDirTag: string;
    corridorDirTitle: string;
    corridorDirSubtitle: string;
    markets: string;
    viewCorridor: string;
    roadReefer: string;
    gulfSea: string;
    asiaSea: string;
    expressAir: string;
    dischargeHubs: string;
    customsCertsTitle: string;
    incotermsTitle: string;
    incotermsSub: string;
    proforma24hTitle: string;
    proforma24hDesc: string;
    topProduceTitle: string;
    topProduceSub: string;
    fullCatalog: string;
    otherMarkets: string;
    globalExport: string;
  };
  calendarPage: {
    tag: string;
    title: string;
    subtitle: string;
    peakHarvest: string;
    peakHarvestDesc: string;
    caStorage: string;
    caStorageDesc: string;
    traceability: string;
    traceabilityDesc: string;
    allProduce: string;
    exportProduce: string;
    growingBasins: string;
    harvestAndSupply: string;
    specs: string;
    requestPrice: string;
    fieldHarvest: string;
    controlledAtmosphere: string;
    offSeason: string;
  };
  sustainabilityPage: {
    tag: string;
    title: string;
    subtitle: string;
    pillar1Title: string;
    pillar1Desc: string;
    pillar2Title: string;
    pillar2Desc: string;
    pillar3Title: string;
    pillar3Desc: string;
    pillar4Title: string;
    pillar4Desc: string;
  };
  insightsPage: {
    tag: string;
    title: string;
    subtitle: string;
    readFull: string;
    backToAll: string;
  };
  contactPage: {
    tag: string;
    title: string;
    subtitle: string;
    officeTitle: string;
    packhouseLabel: string;
    phoneLabel: string;
    emailLabel: string;
    whatsappLabel: string;
    hoursLabel: string;
    hoursValue: string;
    formTitle: string;
    nameLabel: string;
    companyLabel: string;
    emailFormLabel: string;
    phoneFormLabel: string;
    subjectLabel: string;
    subjectPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitBtn: string;
    successTitle: string;
    successDesc: string;
  };
  quotePage: {
    pageTitle: string;
    allVarieties: string;
    caliberSelect: string;
    overallRange: string;
    returnHome: string;
  };
  legal: {
    termsTitle: string;
    privacyTitle: string;
    lastUpdated: string;
    termsP1: string;
    termsH1: string;
    termsP2: string;
    termsH2: string;
    termsP3: string;
    privacyP1: string;
    privacyH1: string;
    privacyP2: string;
    privacyH2: string;
    privacyP3: string;
  };
  whatsapp: {
    tooltip: string;
    msgDefault: string;
    msgProduct: (productName: string) => string;
  };
  common: {
    home: string;
    products: string;
    step: string;
    coreExportProduce: string;
  };
}

export type LocalizedPageTranslations = Omit<PageTranslations, 'whatsapp'> & {
  whatsapp: Omit<PageTranslations['whatsapp'], 'msgProduct'> & { msgProductTemplate: string };
};

export const baseEnglish: PageTranslations = {
  about: {
    tag: 'TURKISH B2B COMMODITIES OPERATOR',
    title: 'Connecting Anatolian Agricultural Abundance with Global Markets',
    subtitle: 'Nilasya Agro Foods is an international pulses, grains, and agricultural commodities processor and export enterprise operating from Mersin Port and Central Anatolia.',
    valuesTitle: 'OUR CORE VALUES & COMMERCIAL PRINCIPLES',
    valuesSubtitle: 'Upholding strict commercial integrity, specification compliance, and long-term buyer partnerships worldwide.',
    valQualityTitle: 'Optical Sortex Purity',
    valQualityDesc: 'Guaranteed 99.5% to 99.8% purity through multi-stage Bühler Sortex optical color sorting and gravity separation.',
    valGrowerTitle: 'Contract Farming Network',
    valGrowerDesc: 'Direct farm aggregation across Anatolian basins providing stable crop volumes and complete seed traceability.',
    valExportTitle: 'Direct Seaport Logistics',
    valExportDesc: 'Rapid container stuffing at Mersin International Port with SGS pre-shipment quality verification and flexible Incoterms.',
  },
  productsPage: {
    tag: 'B2B PULSES & GRAINS RANGE',
    title: 'Finest Turkish Pulses & Agricultural Commodities',
    subtitle: 'Direct processor sourcing, Sortex optical sorting, calibrated sizing, and seaport container stuffing for global wholesalers, canners, and retail supermarket brands.',
    pills: {
      chickpeas: '🟡 Koçbaşı Chickpeas',
      redLentils: '🔴 Red Lentils (Split & Whole)',
      greenLentils: '🟢 Green Lentils (Laird & Eston)',
      whiteBeans: '⚪ Dermason White Beans',
      dryPeas: '🥣 Yellow & Green Dry Peas',
      durumWheat: '🌾 Durum Wheat & Bulgur',
      pomegranate: '🟡 Koçbaşı Chickpeas',
      apples: '🔴 Red Lentils',
      grapes: '🟢 Green Lentils',
      kiwi: '⚪ Dermason Beans',
      citrus: '🥣 Dry Peas',
      tomatoes: '🌾 Durum Bulgur',
    },
  },
  productDetail: {
    purityLabel: 'Purity',
    moistureLabel: 'Moisture (maximum)',
    proteinLabel: 'Protein (dry basis)',
    specificationLabels: {
      variety: 'Variety / Commercial Type', origin: 'Origin / Growing Basin', caliber: 'Caliber / Screen Size',
      color: 'Natural Color & Appearance', foreignMatter: 'Foreign Matter / Stones', broken: 'Broken / Split Kernels',
      damaged: 'Damaged / Discolored Seeds', class: 'Export Grade', storageTemp: 'Storage Temperature',
      optimalHumidity: 'Relative Humidity', shelfLife: 'Shelf Life & Storage', harvest: 'Harvest Window',
      storage: 'Storage Conditions', species: 'Botanical Species', characteristics: 'Product Characteristics',
    },
    sourcingTitle: 'Product sourcing information',
    sourcingQuestion: 'What does Nilasya Agro Foods supply for {product}?',
    sourcingAnswer: 'Nilasya Agro Foods supplies {product} from Türkiye for wholesale and food manufacturing buyers. Review the listed origins, product specifications, packaging options, and harvest periods below. Confirm the shipment specifications and availability with our export team before ordering.',
    packagingLabel: 'Available packaging',
    specificationsNote: 'Specifications describe the product range. The quotation and sales contract confirm the agreed values for each shipment.',
    galleryTitle: 'Product gallery',
    previousPhoto: 'Previous photo',
    nextPhoto: 'Next photo',
    closeGallery: 'Close gallery',
    viewPhoto: 'View photo',
    viewDetails: 'View specifications',
    caliberDiameter: 'Caliber / Size Grade',
    brixSweetness: 'Sortex Purity Rate',
    standardGrade: 'Standard & Export Grade',
    specsTitle: 'Technical Export Specifications',
    varietiesTitle: 'Available Commercial Varieties & Sizes',
    packagingStandardsTitle: 'Export Packaging Solutions & Container Stuffing',
    standardFormatsTitle: 'Standard B2B export packaging formats',
    suitableFor: 'Suitable for: ',
    technicalConfigurationsTitle: 'Technical packaging parameters for this commodity',
    dimensions: 'Dimensions:',
    pieces: 'Units / Bags:',
    pallet: 'Palletization:',
    coldChainLogisticsTitle: 'Ocean Freight & Logistics Protocol',
    transitProtocolTitle: 'Shipping & Transit Conditions:',
    transitTimeEU: 'Europe & Balkans (Road / Ro-Ro Sea)',
    transitTimeGulf: 'Middle East & GCC (Direct Ocean FCL)',
    transitTimeAsia: 'South & East Asia (Ocean FCL)',
    faqTitle: 'Frequently Asked Questions (B2B Procurement)',
    exploreOther: 'Explore Other Pulses & Commodities',
    harvestLabel: 'Harvest Period:',
    storageLabel: 'Supply & Silo Storage:',
    originBasins: 'Origin Basins',
    brixSugar: 'Moisture Rate (Max)',
    commercialGrade: 'Commercial Grade',
    unitWeight: 'Protein Content (Dry Basis)',
    optimumTemp: 'Optimum Storage Temp',
    humidity: 'Relative Humidity (RH)',
    maxPostHarvest: 'Shelf Life in Storage',
    factBoxBadge: 'Product facts & sourcing overview',
    productCategory: 'Product & Category:',
    countryOrigin: 'Country of Origin & Hubs:',
    primaryVarieties: 'Primary Varieties & Calibers:',
    brixGrade: 'Purity & Grade:',
    supplyWindow: 'Harvest & Export Availability:',
    verifiedSupplier: 'Supplier:',
  },
  productionPage: {
    tag: 'ANATOLIAN AGRICULTURAL BASINS',
    title: 'FERTILE HIGHLANDS, OPTICAL SORTEX MILLS',
    subtitle: 'Harvested under optimal sun and climate across Central and Southeastern Anatolia, then conditioned and calibrated at our Mersin processing plant.',
  },
  qualityPage: {
    tag: 'FOOD SAFETY & SORTEX STANDARDS',
    title: 'PURITY IN EVERY GRAIN',
    subtitle: 'From pre-cleaning and gravity separation to multi-camera Sortex optical sorting and accredited laboratory testing, our standards eliminate foreign matter and defects.',
  },
  packagingPage: {
    tag: 'B2B EXPORT PACKAGING',
    title: 'PACKAGED FOR BULK & RETAIL MARKETS',
    subtitle: 'Heavy-duty 25kg/50kg PP sacks, 1,000kg Big Bags, bulk container liners, and customized private label retail packs with barrier protection.',
    palletSpecsTitle: 'Palletization & 20ft / 40ft Container Loading Parameters',
    suitableFor: 'Suitable For:',
    material: 'Material Specs:',
  },
  exportPage: {
    tag: 'EXPORTING TO 40+ COUNTRIES',
    title: 'Worldwide Pulses & Agricultural Export Destinations',
    subtitle: 'Direct shipping corridors from Mersin International Port (MIP) to the Middle East, Europe, North Africa, and Asia with full phytosanitary clearance.',
    corridorDirTag: 'GLOBAL TRADE CORRIDORS',
    corridorDirTitle: 'Select Target Market to View Export Routes & Lead Times',
    corridorDirSubtitle: 'Transit times, discharge ports, inspection protocols, and Incoterms (FOB Mersin, CIF, CFR, DAP).',
    markets: 'Export Markets',
    viewCorridor: 'View Shipping Corridor',
    roadReefer: 'Europe Truck & Ro-Ro',
    gulfSea: 'Middle East Ocean Freight FCL',
    asiaSea: 'Asia-Pacific Ocean Transit',
    expressAir: 'Express Sample Courier',
    dischargeHubs: 'Primary Seaports:',
    customsCertsTitle: 'Phytosanitary & Export Documentation',
    incotermsTitle: 'Supported ICC Incoterms 2020',
    incotermsSub: 'FOB Mersin, CFR, CIF, DAP & EXW',
    proforma24hTitle: '24-Hour Official Proforma Quotation:',
    proforma24hDesc: 'Detailed B2B commercial offer customized to your target destination port and volume requirements.',
    topProduceTitle: 'Top Requested Turkish Commodities',
    topProduceSub: 'Calibrated and machine-cleaned for international trade',
    fullCatalog: 'Full Commodity Catalog',
    otherMarkets: 'Explore Other Global Corridors',
    globalExport: 'Global Trade Hub',
  },
  calendarPage: {
    tag: '12-MONTH EXPORT MATRIX',
    title: 'Turkish Pulses & Grains Crop Supply Matrix',
    subtitle: 'Modern climate-controlled silos and continuous milling lines in Mersin enable uninterrupted 365-day export delivery worldwide.',
    peakHarvest: 'Peak Field Harvest',
    peakHarvestDesc: 'Fresh new crop arrival',
    caStorage: 'Ventilated Silo Storage',
    caStorageDesc: 'Year-round export readiness',
    traceability: 'Sortex Quality Control',
    traceabilityDesc: '99.8% purity guaranteed',
    allProduce: 'All Commodities',
    exportProduce: 'Export Commodity',
    growingBasins: 'Growing Basins:',
    harvestAndSupply: 'Harvest & Supply Status:',
    specs: 'Specs',
    requestPrice: 'Request Quote',
    fieldHarvest: 'Direct Field Harvest',
    controlledAtmosphere: 'Silo Conditioning',
    offSeason: 'Continuous Supply',
  },
  sustainabilityPage: {
    tag: 'RESPONSIBLE AGRICULTURE',
    title: 'SUSTAINABLE PARTNERSHIPS & CONTRACT FARMING',
    subtitle: 'Supporting Anatolian farmers with certified non-GMO seeds, fair pricing, and sustainable soil stewardship across dryland pulses rotations.',
    pillar1Title: 'Non-GMO Certified Seeds',
    pillar1Desc: 'We exclusively cultivate certified non-genetically modified Turkish heritage varieties with full seed traceability.',
    pillar2Title: 'Crop Rotation & Soil Health',
    pillar2Desc: 'Pulses naturally fix nitrogen from the atmosphere, enriching the soil for subsequent wheat crops and reducing synthetic fertilizer need.',
    pillar3Title: 'Recyclable PP & Big Bags',
    pillar3Desc: 'Food-grade 100% recyclable polypropylene sacks and reusable FIBC Jumbo Bags minimize environmental footprint.',
    pillar4Title: 'Water Conservation in Drylands',
    pillar4Desc: 'Anatolian pulses thrive in rain-fed highland conditions, minimizing reliance on deep ground aquifers.',
  },
  insightsPage: {
    tag: 'COMMODITY INTELLIGENCE & REPORTS',
    title: 'GLOBAL PULSES & GRAINS MARKET REPORTS',
    subtitle: 'Market trends, crop balance sheets, caliber pricing analyses, and global supply updates by our agricultural commodities trade desk.',
    readFull: 'Read Full Market Report',
    backToAll: 'Back to All Reports',
  },
  contactPage: {
    tag: 'DIRECT COMMODITY EXPORT DESK',
    title: 'CONNECT WITH OUR TRADE DESK',
    subtitle: 'For wholesale tenders, long-term supply contracts, and container freight rates from Mersin Port, our international team is at your disposal.',
    officeTitle: 'International Trade Desk & Operations',
    packhouseLabel: 'Processing & Export Terminal:',
    phoneLabel: 'Phone:',
    emailLabel: 'Email:',
    whatsappLabel: 'WhatsApp Trade Desk:',
    hoursLabel: 'Trading Desk Hours:',
    hoursValue: 'Mon - Fri: 08:30 - 18:30 (GMT+3)',
    formTitle: 'Request an Export Quotation (RFQ)',
    nameLabel: 'Full Name *',
    companyLabel: 'Buyer Company Name *',
    emailFormLabel: 'Corporate Email *',
    phoneFormLabel: 'Phone / WhatsApp *',
    subjectLabel: 'Commodity of Interest *',
    subjectPlaceholder: 'Select commodity (Chickpeas, Red Lentils, White Beans...)',
    messageLabel: 'Target Specifications & Quantity *',
    messagePlaceholder: 'Specify required metric tons, preferred Incoterm (FOB/CIF), destination port, packaging...',
    submitBtn: 'Submit Inquiry',
    successTitle: 'Inquiry Ready on WhatsApp',
    successDesc: 'Your quotation details are prepared. Send your message in WhatsApp to connect directly with our export trader.',
  },
  quotePage: {
    pageTitle: 'B2B REQUEST FOR QUOTATION (RFQ)',
    allVarieties: 'All Varieties / Supplier Sizing Recommendation',
    caliberSelect: 'Select caliber / size grade',
    overallRange: 'Standard export specification',
    returnHome: 'Return to Home',
  },
  legal: {
    termsTitle: 'Terms of International Trade',
    privacyTitle: 'Privacy Policy & KVKK / GDPR Compliance',
    lastUpdated: 'Last updated: 2026',
    termsP1: 'By accessing and utilizing www.nilasyaagrofoods.com.tr, you acknowledge and agree to the following commercial terms and trading conditions.',
    termsH1: '1. Intellectual Property & Brand Rights',
    termsP2: 'All logos, trademarks, photography, product specifications, and proprietary data displayed on this website are the property of Nilasya Agro Foods.',
    termsH2: '2. Commercial Offers & Quotations',
    termsP3: 'Information displayed on this website is for commercial marketing. Binding contractual commitments are formalized through signed sales contracts and proforma invoices.',
    privacyP1: 'Nilasya Agro Foods Tarım Ürünleri Dış Ticaret Ltd. Şti. is committed to protecting the privacy and commercial information of our international partners.',
    privacyH1: '1. Data Collection & Processing',
    privacyP2: 'Information submitted through our RFQ and contact forms is processed solely for preparing formal export quotations and conducting legitimate international trade.',
    privacyH2: '2. Data Security & Retention',
    privacyP3: 'We do not sell or share buyer details with third parties. Form data is transmitted via encrypted HTTPS and secured against unauthorized access.',
  },
  whatsapp: {
    tooltip: 'WhatsApp Trade Desk (+90 533 684 01 75)',
    msgDefault: 'Hello Nilasya Agro Foods Trade Desk, I would like to request an export quotation for Turkish pulses and grains.',
    msgProduct: (p: string) => `Hello Nilasya Agro Foods Trade Desk, I would like to request pricing and specifications for Turkish ${p}.`,
  },
  common: {
    home: 'Home',
    products: 'Products',
    step: 'Step',
    coreExportProduce: 'Core Export Commodities:',
  },
};

export const baseTurkish: PageTranslations = {
  about: {
    tag: 'B2B BAKLİYAT & HUBUBAT OPERATÖRÜ',
    title: 'Anadolu Tarımının Gücünü ve Bereketini Dünya Pazarlarıyla Buluşturuyoruz',
    subtitle: 'Nilasya Agro Foods, Türkiye\'nin verimli tarım havzalarından tedarik ettiği bakliyat ve hububatı Mersin Limanı\'ndaki modern tesislerinde işleyerek dünya pazarlarına ihraç eden bir dış ticaret kuruluşudur.',
    valuesTitle: 'TEMEL DEĞERLERİMİZ VE TİCARİ İLKELERİMİZ',
    valuesSubtitle: 'Uluslararası emtia ticaretinde sözleşme şeffaflığı, yüksek Sortex saflığı ve kesintisiz tedarik güvencesi.',
    valQualityTitle: 'Sortex Optik Saflık',
    valQualityDesc: 'Çok kademeli Bühler Sortex optik renk ayırıcılar ve gravite masaları ile %99.8 saflıkta sıfır taş ve sıfır yabancı madde.',
    valGrowerTitle: 'Sözleşmeli Tarım Ağı',
    valGrowerDesc: 'İç Anadolu ve Güneydoğu Anadolu çiftçileriyle kurulan doğrudan sözleşmeli üretim ile yüksek tonajlı ve kontrollü tedarik.',
    valExportTitle: 'Liman İçi Hızlı Yükleme',
    valExportDesc: 'Mersin Uluslararası Limanı\'nda (MIP) doğrudan konteyner dolumu, SGS/Bureau Veritas gözetimi ve esnek Incoterms çözümleri.',
  },
  productsPage: {
    tag: 'B2B BAKLİYAT & HUBUBAT GAMI',
    title: 'Türkiye\'nin En Seçkin Bakliyat ve Tarımsal Emtiaları',
    subtitle: 'Sortex optik ayıklama, hassas kalibrasyon, dökme ve çuvallı ambalajlama güvencesiyle Mersin Limanı\'ndan ihraç edilen ana ürün grupları.',
    pills: {
      chickpeas: '🟡 Koçbaşı Nohut (7mm-10mm)',
      redLentils: '🔴 Kırmızı Mercimek (Futbol & Yaprak)',
      greenLentils: '🟢 Yeşil Mercimek (Laird & Eston)',
      whiteBeans: '⚪ Dermason Kuru Fasulye',
      dryPeas: '🥣 Sarı & Yeşil Bezelye',
      durumWheat: '🌾 Durum Buğdayı & Bulgur',
      pomegranate: '🟡 Koçbaşı Nohut',
      apples: '🔴 Kırmızı Mercimek',
      grapes: '🟢 Yeşil Mercimek',
      kiwi: '⚪ Dermason Fasulye',
      citrus: '🥣 Kuru Bezelye',
      tomatoes: '🌾 Durum Bulgur',
    },
  },
  productDetail: {
    purityLabel: 'Saflık',
    moistureLabel: 'Nem (azami)',
    proteinLabel: 'Protein (kuru bazda)',
    specificationLabels: {
      variety: 'Çeşit / Ticari Standart', origin: 'Menşe / Üretim Havzası', caliber: 'Kalibre / Elek Boyutu',
      color: 'Doğal Renk ve Görünüm', foreignMatter: 'Yabancı Madde / Taş', broken: 'Kırık / Bölünmüş Tane',
      damaged: 'Hasarlı / Lekeli Tane', class: 'İhracat Kalite Sınıfı', storageTemp: 'Depolama Sıcaklığı',
      optimalHumidity: 'Bağıl Nem', shelfLife: 'Raf Ömrü ve Depolama', harvest: 'Hasat Dönemi',
      storage: 'Depolama Koşulları', species: 'Botanik Tür', characteristics: 'Ürün Özellikleri',
    },
    sourcingTitle: 'Ürün tedarik bilgileri',
    sourcingQuestion: 'Nilasya Agro Foods, {product} için ne sunuyor?',
    sourcingAnswer: 'Nilasya Agro Foods, toptan ticaret ve gıda üretimi alıcılarına Türkiye menşeli {product} tedarik eder. Aşağıdaki menşe bölgelerini, ürün özelliklerini, ambalaj seçeneklerini ve hasat dönemlerini inceleyebilirsiniz. Sipariş öncesinde sevkiyat özelliklerini ve ürün bulunabilirliğini ihracat ekibimizle teyit ediniz.',
    packagingLabel: 'Mevcut ambalaj seçenekleri',
    specificationsNote: 'Teknik değerler ürün yelpazesini tanımlar. Her sevkiyat için geçerli değerler teklif ve satış sözleşmesinde teyit edilir.',
    galleryTitle: 'Ürün galerisi',
    previousPhoto: 'Önceki fotoğraf',
    nextPhoto: 'Sonraki fotoğraf',
    closeGallery: 'Galeriyi kapat',
    viewPhoto: 'Fotoğrafı görüntüle',
    viewDetails: 'Teknik özellikleri incele',
    caliberDiameter: 'Kalibre / Boyut Sınıfı',
    brixSweetness: 'Sortex Saflık Oranı',
    standardGrade: 'Standart & İhracat Sınıfı',
    specsTitle: 'Teknik İhracat Şartnamesi',
    varietiesTitle: 'Mevcut Ticari Çeşitler ve Kalibreler',
    packagingStandardsTitle: 'İhracat Ambalaj Çözümleri ve Konteyner Yükleme',
    standardFormatsTitle: 'Standart B2B ihracat ambalaj formatları',
    suitableFor: 'Uygun kullanım alanları: ',
    technicalConfigurationsTitle: 'Bu emtia için teknik paketleme parametreleri',
    dimensions: 'Ebatlar:',
    pieces: 'Çuval / Paket Adedi:',
    pallet: 'Paletleme Standartları:',
    coldChainLogisticsTitle: 'Denizyolu ve Lojistik Protokolü',
    transitProtocolTitle: 'Taşıma ve Depolama Koşulları:',
    transitTimeEU: 'Avrupa ve Balkanlar (Karayolu / Ro-Ro)',
    transitTimeGulf: 'Orta Doğu ve Körfez (Direkt Denizyolu Konteyner)',
    transitTimeAsia: 'Güney ve Doğu Asya (Denizyolu Konteyner)',
    faqTitle: 'Sıkça Sorulan Sorular (B2B Satın Alma)',
    exploreOther: 'Diğer Bakliyat ve Emtialarımızı İnceleyin',
    harvestLabel: 'Hasat Dönemi:',
    storageLabel: 'Silo Depolama ve Tedarik:',
    originBasins: 'Üretim Havzaları',
    brixSugar: 'Nem Oranı (Azami)',
    commercialGrade: 'Ticari Sınıf',
    unitWeight: 'Protein Oranı (Kuru Bazda)',
    optimumTemp: 'Optimal Depo Sıcaklığı',
    humidity: 'Bağıl Nem (RH)',
    maxPostHarvest: 'Depolama Ömrü',
    factBoxBadge: 'Ürün bilgileri ve tedarik özeti',
    productCategory: 'Ürün ve Kategori:',
    countryOrigin: 'Menşe ve Üretim Havzası:',
    primaryVarieties: 'Ana Çeşitler ve Kalibreler:',
    brixGrade: 'Saflık ve Kalite Sınıfı:',
    supplyWindow: 'Hasat ve Sevkiyat Dönemi:',
    verifiedSupplier: 'Tedarikçi:',
  },
  productionPage: {
    tag: 'ANADOLU TARIM HAVZALARI',
    title: 'BEREKETLİ YAYLALAR, MODERN SORTEX DEĞİRMENLERİ',
    subtitle: 'İç Anadolu ve Güneydoğu Anadolu\'nun zengin topraklarında yetişen ürünler Mersin işleme terminalimizde küresel standartlarda kalibre edilir.',
  },
  qualityPage: {
    tag: 'GIDA GÜVENLİĞİ VE SORTEX STANDARTLARI',
    title: 'HER DANEDE YÜKSEK SAFLIK VE KALİTE',
    subtitle: 'Ön temizleme ve gravite tablalarından çok kameralı optik Sortex ayıklamaya kadar uyguladığımız protokoller sıfır taş ve sıfır yabancı madde hedefler.',
  },
  packagingPage: {
    tag: 'B2B İHRACAT AMBALAJLARI',
    title: 'DÖKME VE PERAKENDE İÇİN GÜVENLİ PAKETLEME',
    subtitle: '25kg/50kg PP çuvallar, 1.000kg Big Bag jumbo torbalar, dökme konteyner liner torbaları ve market raflarına hazır fason paketleme seçenekleri.',
    palletSpecsTitle: 'Paletleme ve 20ft / 40ft Konteyner Yükleme Parametreleri',
    suitableFor: 'Uygun Olduğu Ürünler:',
    material: 'Malzeme Özellikleri:',
  },
  exportPage: {
    tag: '40+ ÜLKEYE DİREKT İHRACAT',
    title: 'Dünya Pazarlarına Bakliyat ve Hububat İhracatı',
    subtitle: 'Mersin Uluslararası Limanı\'ndan (MIP) Orta Doğu, Avrupa, Kuzey Afrika ve Asya\'ya direkt hatlarla konteyner ihracatı ve tam fitosaniter uygunluk.',
    corridorDirTag: 'İHRACAT KORİDORLARI',
    corridorDirTitle: 'Sevkiyat ve Transit Sürelerini Görmek İçin Ülke Seçin',
    corridorDirSubtitle: 'Liman bazlı transit süreleri, kabul şartları ve Incoterms (FOB Mersin, CIF, CFR, DAP).',
    markets: 'İhracat Pazarları',
    viewCorridor: 'Sevkiyat Koridorunu İncele',
    roadReefer: 'Avrupa Karayolu / Ro-Ro',
    gulfSea: 'Körfez ve Orta Doğu Denizyolu',
    asiaSea: 'Asya Denizyolu Sevkiyatı',
    expressAir: 'Ekspres Numune Kurye',
    dischargeHubs: 'Başlıca Varış Limanları:',
    customsCertsTitle: 'Gümrükleme ve Fitosaniter Sertifikasyon',
    incotermsTitle: 'Desteklenen ICC Incoterms 2020 Şartları',
    incotermsSub: 'FOB Mersin, CFR, CIF, DAP & EXW',
    proforma24hTitle: '24 Saat İçinde Resmi Proforma Teklifi:',
    proforma24hDesc: 'Varış limanınıza ve talep edilen tonaja göre hazırlanmış resmi B2B teklif mektubu.',
    topProduceTitle: 'En Çok Talep Gören Türk Bakliyatları',
    topProduceSub: 'Mersin Limanı\'nda kalibre edilip hazırlanan ihracat ürünleri',
    fullCatalog: 'Tüm Emtia Kataloğu',
    otherMarkets: 'Diğer İhracat Hatlarını Keşfedin',
    globalExport: 'Küresel İhracat Merkezi',
  },
  calendarPage: {
    tag: '12 AY KESİNTİSİZ TEDARİK',
    title: 'Türk Bakliyat ve Hububat Hasat & Tedarik Matrisi',
    subtitle: 'İklimlendirmeli çelik silolarımız ve Mersin değirmenlerimiz sayesinde yılın 365 günü dünya pazarlarına kesintisiz ihracat yapıyoruz.',
    peakHarvest: 'Tarladan Yeni Hasat',
    peakHarvestDesc: 'Taze mahsul gelişi',
    caStorage: 'Havalandırmalı Silolar',
    caStorageDesc: 'Yıl boyu ihracata hazır',
    traceability: 'Sortex Kalite Kontrolü',
    traceabilityDesc: '%99.8 saflık garantisi',
    allProduce: 'Tüm Emtialar',
    exportProduce: 'İhraç Emtiası',
    growingBasins: 'Üretim Havzaları:',
    harvestAndSupply: 'Hasat ve Sevkiyat Durumu:',
    specs: 'Özellikler',
    requestPrice: 'Fiyat Teklifi İsteyin',
    fieldHarvest: 'Doğrudan Tarla Hasatı',
    controlledAtmosphere: 'Silo İklimlendirme',
    offSeason: 'Kesintisiz Tedarik',
  },
  sustainabilityPage: {
    tag: 'SORUMLU VE SÜRDÜRÜLEBİLİR TARIM',
    title: 'TOPRAKTAN GELECEĞE SÖZLEŞMELİ ÜRETİM',
    subtitle: 'GDO\'suz yerli tohumların korunması, su tasarrufu ve Anadolu çiftçisini destekleyen adil sözleşmeli tarım modelleri.',
    pillar1Title: 'GDO\'suz Tescilli Tohumlar',
    pillar1Desc: 'Sözleşmeli tarlalarımızda yalnızca sertifikalı, genetiği değiştirilmemiş yerli Anadolu tohumları kullanılır.',
    pillar2Title: 'Ekim Nöbeti ve Toprak Verimliliği',
    pillar2Desc: 'Baklagiller havadaki azotu toprağa bağlayarak sentetik gübre kullanımını azaltır ve toprağı zenginleştirir.',
    pillar3Title: 'Geri Dönüştürülebilir Çuvallar',
    pillar3Desc: 'Gıdaya uygun %100 geri dönüştürülebilir polipropilen (PP) çuvallar ve yeniden kullanılabilir Big Bag torbalar.',
    pillar4Title: 'Kıraç Arazilerde Su Tasarrufu',
    pillar4Desc: 'Anadolu bakliyatları doğal yağış rejimiyle yetişerek yeraltı su kaynaklarının korunmasına katkı sağlar.',
  },
  insightsPage: {
    tag: 'EMTİA PİYASALARI VE RAPORLAR',
    title: 'KÜRESEL BAKLİYAT VE HUBUBAT BÜLTENİ',
    subtitle: 'Emtia fiyat trendleri, rekolte tahminleri, kalibre fiyat farkları ve dünya ticaret dinamikleri analizleri.',
    readFull: 'Raporu Oku',
    backToAll: 'Tüm Raporlara Dön',
  },
  contactPage: {
    tag: 'DOĞRUDAN İHRACAT MASASI',
    title: 'İHRACAT DEPARTMANIMIZLA İLETİŞİME GEÇİN',
    subtitle: 'Toptan alımlar, dönemsel tedarik sözleşmeleri ve Mersin Limanı navlun fiyatları için ekibimiz hizmetinizdedir.',
    officeTitle: 'Dış Ticaret ve Operasyon Merkezi',
    packhouseLabel: 'İşleme ve İhracat Terminali:',
    phoneLabel: 'Telefon:',
    emailLabel: 'E-Posta:',
    whatsappLabel: 'WhatsApp İhracat Hattı:',
    hoursLabel: 'Çalışma Saatleri:',
    hoursValue: 'Pzt - Cuma: 08:30 - 18:30 (GMT+3)',
    formTitle: 'İhracat Teklif Talebi (RFQ)',
    nameLabel: 'Adınız Soyadınız *',
    companyLabel: 'Şirketinizin Ticari Unvanı *',
    emailFormLabel: 'Kurumsal E-Posta *',
    phoneFormLabel: 'Telefon / WhatsApp *',
    subjectLabel: 'İlgilendiğiniz Ürün Grubu *',
    subjectPlaceholder: 'Ürün seçiniz (Nohut, Kırmızı Mercimek, Fasulye...)',
    messageLabel: 'Talep Detayları ve İstenen Tonaj *',
    messagePlaceholder: 'Metrik ton miktarı, istenen Incoterm (FOB/CIF), varış limanı ve ambalaj tercihinizi belirtiniz...',
    submitBtn: 'Teklif Talebini Gönder',
    successTitle: 'Teklif Bilgileriniz WhatsApp İçin Hazır',
    successDesc: 'Teklif detaylarınız hazırlandı. WhatsApp üzerinden dış ticaret uzmanımıza doğrudan iletmek için Gönder butonuna basınız.',
  },
  quotePage: {
    pageTitle: 'B2B İHRACAT FİYAT TEKLİFİ (RFQ)',
    allVarieties: 'Tüm Çeşitler / Üretici Kalibre Tavsiyesi',
    caliberSelect: 'Kalibre / Boyut Seçimi Yapın',
    overallRange: 'Standart ihracat spesifikasyonu',
    returnHome: 'Ana Sayfaya Dön',
  },
  legal: {
    termsTitle: 'Uluslararası Ticaret ve Kullanım Koşulları',
    privacyTitle: 'Gizlilik Politikası ve KVKK / GDPR Aydınlatma Metni',
    lastUpdated: 'Son Güncelleme: 2026',
    termsP1: 'www.nilasyaagrofoods.com.tr web sitesini ziyaret ederek ve kullanarak aşağıdaki ticari şartları kabul etmiş sayılırsınız.',
    termsH1: '1. Fikri Mülkiyet ve Marka Hakları',
    termsP2: 'Sitede yer alan tüm metinler, fotoğraflar, teknik şartnameler ve ticari logolar Nilasya Agro Foods şirketine aittir.',
    termsH2: '2. Teklif ve Bağlayıcılık',
    termsP3: 'Web sitesindeki ürün açıklamaları ve kalibre bilgileri tanıtım amaçlıdır. Bağlayıcı ticari taahhütler imzalı proforma fatura ve satış sözleşmesiyle gerçekleşir.',
    privacyP1: 'Nilasya Agro Foods Tarım Ürünleri Dış Ticaret Ltd. Şti. olarak iş ortaklarımızın ticari ve kişisel verilerinin korunmasına tam özen göstermekteyiz.',
    privacyH1: '1. Toplanan Veriler ve Kullanım Amacı',
    privacyP2: 'Teklif (RFQ) ve iletişim formlarımız aracılığıyla iletilen bilgiler yalnızca ihracat tekliflerinin hazırlanması amacıyla işlenir.',
    privacyH2: '2. Veri Güvenliği ve Saklama',
    privacyP3: 'Verileriniz üçüncü taraflarla paylaşılmaz. İletilen bilgiler SSL şifreleme ve güvenli sunucu altyapısıyla korunmaktadır.',
  },
  whatsapp: {
    tooltip: 'WhatsApp İhracat Masası (+90 533 684 01 75)',
    msgDefault: 'Merhaba Nilasya Agro Foods İhracat Masası, Türk bakliyat ve hububat ihracatı için B2B proforma teklifi almak istiyorum.',
    msgProduct: (p: string) => `Merhaba Nilasya Agro Foods İhracat Masası, Türk ${p} ihracatı ve güncel fiyat teklifi hakkında bilgi almak istiyorum.`,
  },
  common: {
    home: 'Ana Sayfa',
    products: 'Ürünlerimiz',
    step: 'Adım',
    coreExportProduce: 'Başlıca İhraç Emtialarımız:',
  },
};

export const pageTranslationsMap: Record<string, Partial<PageTranslations>> = {
  en: baseEnglish,
  tr: baseTurkish,
};

export const getPageTranslations = (lang: string): PageTranslations => {
  if (lang === 'tr') return baseTurkish;
  const localized = pageTranslationsData[lang];
  if (!localized) return baseEnglish;
  return {
    ...localized,
    whatsapp: {
      ...localized.whatsapp,
      msgProduct: (productName: string) => localized.whatsapp.msgProductTemplate.replace('{product}', productName),
    },
  };
};
