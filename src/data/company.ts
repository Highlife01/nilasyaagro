export const company = {
  name: 'Nilasya Agro Foods',
  brandName: 'Nilasya Agro Foods',
  legalName: 'NİLASYA GLOBAL TARIM İTHALAT VE İHRACAT LİMİTED ŞİRKETİ',
  founder: 'Abdullah Başaranoğlu',
  founderTitle: 'Firma Sahibi & Kurucu',
  founderTitleEn: 'Founder & Owner',
  founderImage: '/images/about/abdullah-basaranoglu.jpg',
  establishedYear: 2010,
  yearsOfExperience: '15+',
  slogan: 'From Türkiye to the World',
  logo: '/images/logo/nilasya-logo.png',
  logoTransparent: '/images/logo/nilasya-logo-transparent.png',
  emblem: '/images/logo/nilasya-emblem-transparent.png',
  baseUrl: 'https://www.nilasyaagrofoods.com.tr',
  domain: 'nilasyaagrofoods.com.tr',
  email: 'export@nilasyaagrofoods.com.tr',
  secondaryEmail: 'info@nilasyaagrofoods.com.tr',
  phoneDisplay: '+90 533 684 01 75',
  phoneE164: '+905336840175',
  whatsappNumber: '905336840175',
  taxOffice: 'Çukurova Vergi Dairesi',
  headquarters: 'Toros Mah. Barış Manço Bulvarı, Çukurova / Adana / Türkiye',
  exportTerminal: 'Mersin Uluslararası Liman Bölgesi (MIP) & Akdeniz Serbest Bölge, Mersin / Türkiye',
  hubLocations: [
    'Mersin Optical Sorting, Milling & Container Export Terminal',
    'Adana & Çukurova Agricultural Trade & Financial Desk',
    'Konya & Central Anatolian Pulses Aggregation Center',
    'Gaziantep & Southeast Anatolia Lentil Milling Hub'
  ],
  bankDetails: {
    bankName: 'Türkiye Halk Bankası A.Ş.',
    branchName: '1373 / Çukurova Şubesi / Adana',
    accountNo: '53100308',
    iban: 'TR560001200137300053100308',
    accountName: 'NİLASYA GLOBAL TARIM İTHALAT VE İHRACAT LİMİTED ŞİRKETİ',
    swiftCode: 'TRHBTR2A',
    currencies: 'USD / EUR / TRY (Multi-Currency Export Account)',
  },
  linkedin: 'https://www.linkedin.com/company/nilasyaagrofoods',
} as const;

export function createWhatsAppUrl(message: string) {
  return `https://wa.me/${company.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function formatInquiry(title: string, fields: Record<string, unknown>) {
  const lines = Object.entries(fields)
    .filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== '')
    .map(([label, value]) => `*${label}:* ${String(value).trim()}`);
  return [`*${title}*`, '', ...lines, '', `Source: ${company.baseUrl}`].join('\n');
}
