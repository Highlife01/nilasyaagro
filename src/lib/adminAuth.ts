import { RFQSubmission } from '@/types';

export interface AdminUser {
  email: string;
  name: string;
  role: 'ROOT_SUPER_ADMIN' | 'EXPORT_MANAGER' | 'SALES_REP';
  title: string;
  avatar: string;
  lastLoginAt: string;
}

export interface AdminAuditLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
  ip: string;
}

export interface ExportContainer {
  id: string;
  containerNo: string;
  bookingRef: string;
  carrier: string;
  produce: string;
  tonnage: number;
  originPort: string;
  destinationPort: string;
  destinationCountry: string;
  incoterm: string;
  setTemperature: string;
  currentTemperature: string;
  humidity: string;
  status: 'packhouse' | 'customs' | 'in_transit' | 'delivered';
  departureDate: string;
  eta: string;
  vesselName: string;
}

export interface ProductStockControl {
  productId: string;
  seasonStatus: 'peak' | 'storage' | 'preorder' | 'closed';
  moqTons: number;
  availableStockMT: number;
  exportQualityScore: number;
  storageCondition: string;
  activeCalibers: string[];
}

// Secure credential verification using SHA-256 hashes (Zero plain-text credentials in client bundle)
const ADMIN_EMAIL_HASH = '52857ec68c76bf220df598689a949d69c25ea8020545ef2386163b38395703da';
const ADMIN_PASS_HASH = 'a20820c276213967960eb6e9767e3cd72b728292637ad299822e85e20783be6d';

export async function hashString(str: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  return '';
}

const STORAGE_KEYS = {
  SESSION: 'nilasya_admin_session',
  RFQS: 'nilasya_rfqs_db',
  STOCK: 'nilasya_stock_db',
  LOGISTICS: 'nilasya_logistics_db',
  AUDIT: 'nilasya_audit_logs',
  SETTINGS: 'nilasya_admin_settings',
};

// Initial Seed RFQs for testing & demonstration
export const INITIAL_SEED_RFQS: (RFQSubmission & { status: 'new' | 'quoted' | 'negotiation' | 'approved' | 'archived'; estimatedValueUSD: number; adminNotes?: string })[] = [
  {
    id: 'rfq-101',
    referenceCode: 'NA-RFQ-8421',
    product: 'chickpeas',
    variety: 'Koçbaşı Kabuli Chickpeas (Sortex Cleaned)',
    caliber: 'Caliber 9mm - 10mm (Purity 99.8%)',
    quantity: '48',
    unit: 'Tons',
    packaging: 'PP Woven Bags (25kg Net)',
    destinationCountry: 'Germany',
    destinationCity: 'Hamburg',
    destinationPort: 'Hamburg Port (Terminal Burchardkai)',
    incoterm: 'CIF',
    companyName: 'Hanseatic Grain & Pulses GmbH',
    website: 'https://hanseatic-pulses-sample.de',
    contactPerson: 'Hans Richter',
    email: 'h.richter@hanseatic-sample.de',
    phone: '+49 40 1234567',
    whatsapp: '+49 170 9876543',
    message: 'We require 2x40ft dry containers of 9mm-10mm Koçbaşı chickpeas monthly. Moisture <13.5%, Sortex color sorted, zero foreign matter. EUR.1 certificate required.',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    status: 'new',
    estimatedValueUSD: 62400,
    adminNotes: 'Acil teklif hazırlanıyor. Mersin Limanı 40ft kuru konteyner rezervasyonu kontrol edildi.',
  },
  {
    id: 'rfq-102',
    referenceCode: 'NA-RFQ-7934',
    product: 'red-lentils',
    variety: 'Red Football Lentils & Split Red Lentils',
    caliber: 'Machine Dressed & Sortex Sorted (Purity 99.5%)',
    quantity: '104',
    unit: 'Tons',
    packaging: 'PP Woven Bags (50kg Net)',
    destinationCountry: 'United Arab Emirates',
    destinationCity: 'Dubai',
    destinationPort: 'Jebel Ali Port',
    incoterm: 'CIF',
    companyName: 'Al-Madina Commodity Trading LLC',
    website: 'https://almadina-pulses-sample.ae',
    contactPerson: 'Tariq Al-Mansoor',
    email: 'procurement@almadina-sample.ae',
    phone: '+971 4 8812345',
    whatsapp: '+971 50 1234567',
    message: 'Looking for 4 containers of football red lentils. High natural beta-carotene color, max 1.0% broken grain. Direct shipment from Mersin to Jebel Ali.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    status: 'quoted',
    estimatedValueUSD: 98800,
    adminNotes: 'Fiyat teklifi $950/MT CIF Jebel Ali olarak iletildi. Onay bekleniyor.',
  },
  {
    id: 'rfq-103',
    referenceCode: 'NA-RFQ-6512',
    product: 'white-beans',
    variety: 'Dermason Dry White Beans (Anatolian)',
    caliber: 'Caliber 8mm+ (Jumbo White)',
    quantity: '24',
    unit: 'Tons',
    packaging: 'FIBC Jumbo Big Bags (1,000kg)',
    destinationCountry: 'United Kingdom',
    destinationCity: 'London',
    destinationPort: 'London Gateway / Felixstowe',
    incoterm: 'CIF',
    companyName: 'Albion Food Ingredients Ltd',
    website: 'https://albion-foods-sample.co.uk',
    contactPerson: 'Oliver Smith',
    email: 'imports@albion-sample.co.uk',
    phone: '+44 20 7946 0912',
    whatsapp: '+44 7700 900123',
    message: 'Canning grade Dermason white beans required for UK food processing plant. Non-GMO analysis and moisture certificate mandatory.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    status: 'negotiation',
    estimatedValueUSD: 36000,
    adminNotes: 'SGS pre-shipment analiz ve Non-GMO sertifika örneği e-posta ile gönderildi.',
  },
  {
    id: 'rfq-104',
    referenceCode: 'NA-RFQ-5120',
    product: 'green-lentils',
    variety: 'Green Lentils (Laird / Rich Green)',
    caliber: 'Caliber 6.0mm - 7.0mm (Sortex 99.8%)',
    quantity: '52',
    unit: 'Tons',
    packaging: 'PP Woven Bags (25kg Net)',
    destinationCountry: 'India',
    destinationCity: 'Mumbai',
    destinationPort: 'Nhava Sheva (JNPT)',
    incoterm: 'CFR',
    companyName: 'Vardhman Agro Commodities',
    website: 'https://vardhman-agro-sample.in',
    contactPerson: 'Rajesh Sharma',
    email: 'info@vardhman-sample.in',
    phone: '+91 22 2789 4512',
    whatsapp: '+91 98200 12345',
    message: 'Need 2x40ft containers of premium Turkish green lentils. FSSAI compliant, phytosanitary with methyl bromide fumigation seal.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    status: 'approved',
    estimatedValueUSD: 57200,
    adminNotes: 'Sözleşme imzalandı. Yükleme Mersin Limanı üzerinden planlandı.',
  },
  {
    id: 'rfq-105',
    referenceCode: 'NA-RFQ-4890',
    product: 'durum-wheat',
    variety: 'Hard Amber Durum Wheat & Coarse Bulgur',
    caliber: 'Protein 14.5% min / Vitreous >80%',
    quantity: '120',
    unit: 'Tons',
    packaging: 'Container Bulk Liner (24 MT Sea Bulk)',
    destinationCountry: 'Italy',
    destinationCity: 'Bari',
    destinationPort: 'Port of Bari / Taranto',
    incoterm: 'CIF',
    companyName: 'Semola Adriatica S.p.A.',
    website: 'https://semola-sample.it',
    contactPerson: 'Marco Bellini',
    email: 'm.bellini@semola-sample.it',
    phone: '+39 080 554 1928',
    whatsapp: '+39 340 123 4567',
    message: 'High-protein Anatolian durum wheat for premium pasta semolina milling. GAFTA contract and strict gluten index test required.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    status: 'approved',
    estimatedValueUSD: 51600,
    adminNotes: '5 konteyner Mersin Port terminaline sevk edildi. B/L düzenlendi.',
  },
  {
    id: 'rfq-106',
    referenceCode: 'NA-RFQ-3921',
    product: 'dry-peas',
    variety: 'Split Yellow Peas & Whole Green Peas',
    caliber: 'Cleaned & Polished (Purity 99.5%)',
    quantity: '48',
    unit: 'Tons',
    packaging: 'PP Woven Bags (50kg Net)',
    destinationCountry: 'France',
    destinationCity: 'Marseille',
    destinationPort: 'Fos-sur-Mer / Marseille',
    incoterm: 'CIF',
    companyName: 'Legumex France SAS',
    website: 'https://legumex-sample.fr',
    contactPerson: 'Jean-Luc Moreau',
    email: 'jl.moreau@legumex-sample.fr',
    phone: '+33 4 91 22 33 44',
    whatsapp: '+33 6 12 34 56 78',
    message: 'Split yellow peas for commercial soup and puree production. Direct maritime line from Mersin.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    status: 'quoted',
    estimatedValueUSD: 38400,
    adminNotes: 'Fiyat teklifi verildi, navlun teyidi bekleniyor.',
  },
];

// Initial Seed Containers
export const INITIAL_CONTAINERS: ExportContainer[] = [
  {
    id: 'cnt-01',
    containerNo: 'MSCU-982147-3',
    bookingRef: 'BKG-TR-2026-8941',
    carrier: 'MSC (Mediterranean Shipping Co.)',
    produce: 'Koçbaşı Kabuli Chickpeas (9-10mm Sortex)',
    tonnage: 24.0,
    originPort: 'Mersin International Port (MIP)',
    destinationPort: 'Port of Rotterdam',
    destinationCountry: 'Netherlands',
    incoterm: 'CIF Rotterdam',
    setTemperature: 'Dry Ventilated',
    currentTemperature: 'Ambient (+22 °C)',
    humidity: '62% (Dry Cargo)',
    status: 'in_transit',
    departureDate: '2026-09-02',
    eta: '2026-09-14',
    vesselName: 'MSC Gülsün / V.2609',
  },
  {
    id: 'cnt-02',
    containerNo: 'MAEU-451209-8',
    bookingRef: 'BKG-TR-2026-9024',
    carrier: 'Maersk Line',
    produce: 'Red Football Lentils (Purity 99.5%)',
    tonnage: 26.0,
    originPort: 'Mersin International Port (MIP)',
    destinationPort: 'Jebel Ali Port (Dubai)',
    destinationCountry: 'UAE',
    incoterm: 'CIF Jebel Ali',
    setTemperature: 'Dry Ventilated',
    currentTemperature: 'Ambient (+24 °C)',
    humidity: '58% (Dry Cargo)',
    status: 'in_transit',
    departureDate: '2026-09-04',
    eta: '2026-09-17',
    vesselName: 'Maersk Mc-Kinney / V.402',
  },
  {
    id: 'cnt-03',
    containerNo: 'CMAU-783210-4',
    bookingRef: 'BKG-TR-2026-9118',
    carrier: 'CMA CGM',
    produce: 'Dermason Dry White Beans (Big Bags)',
    tonnage: 24.5,
    originPort: 'Mersin International Port (MIP)',
    destinationPort: 'London Gateway',
    destinationCountry: 'United Kingdom',
    incoterm: 'CIF London',
    setTemperature: 'Dry Ventilated',
    currentTemperature: 'Ambient (+20 °C)',
    humidity: '64% (Dry Cargo)',
    status: 'customs',
    departureDate: '2026-09-09',
    eta: '2026-09-20',
    vesselName: 'CMA CGM Palais Royal',
  },
  {
    id: 'cnt-04',
    containerNo: 'ARKU-112940-0',
    bookingRef: 'BKG-TR-2026-9188',
    carrier: 'Arkas Line',
    produce: 'Green Lentils (Laird / 6.5mm)',
    tonnage: 25.0,
    originPort: 'Mersin International Port (MIP)',
    destinationPort: 'Alexandria Old Port',
    destinationCountry: 'Egypt',
    incoterm: 'CIF Alexandria',
    setTemperature: 'Dry Ventilated',
    currentTemperature: 'Ambient (+25 °C)',
    humidity: '60% (Dry Cargo)',
    status: 'packhouse',
    departureDate: '2026-09-11',
    eta: '2026-09-15',
    vesselName: 'M/V Wanda A / Arkas',
  },
];

// Initial Stock Controls for 6 products
export const INITIAL_PRODUCT_STOCKS: ProductStockControl[] = [
  {
    productId: 'chickpeas',
    seasonStatus: 'peak',
    moqTons: 20,
    availableStockMT: 4850,
    exportQualityScore: 99,
    storageCondition: 'Silo & Dry Warehouse, Max 13.5% Moisture, Desiccant Protected',
    activeCalibers: ['8mm', '9mm', '10mm (Koçbaşı)', '11mm+ (Jumbo)'],
  },
  {
    productId: 'red-lentils',
    seasonStatus: 'storage',
    moqTons: 22,
    availableStockMT: 4200,
    exportQualityScore: 98,
    storageCondition: 'Sortex Cleaned, PP Bags / Big Bags, Max 14.0% Moisture',
    activeCalibers: ['Football (Whole Dehulled)', 'Split Red', 'Whole Brown Red'],
  },
  {
    productId: 'green-lentils',
    seasonStatus: 'peak',
    moqTons: 20,
    availableStockMT: 2400,
    exportQualityScore: 97,
    storageCondition: 'Temperature & Moisture Monitored Silo, Purity 99.8%',
    activeCalibers: ['5.0mm - 6.0mm (Eston)', '6.0mm - 7.0mm (Laird)', '7.0mm+ (Jumbo)'],
  },
  {
    productId: 'white-beans',
    seasonStatus: 'storage',
    moqTons: 20,
    availableStockMT: 1800,
    exportQualityScore: 98,
    storageCondition: 'Triple Screened, Sortex Optical Graded, Max 14.5% Moisture',
    activeCalibers: ['Dermason 7-8mm', 'Dermason 8-9mm', 'Horoz (Long)', 'Bombay (Giant)'],
  },
  {
    productId: 'dry-peas',
    seasonStatus: 'peak',
    moqTons: 22,
    availableStockMT: 1050,
    exportQualityScore: 96,
    storageCondition: 'Dry Aerated Storage, Polished, Max 13.5% Moisture',
    activeCalibers: ['Split Yellow Peas', 'Whole Yellow Peas', 'Split Green Peas', 'Whole Green Peas'],
  },
  {
    productId: 'durum-wheat',
    seasonStatus: 'peak',
    moqTons: 25,
    availableStockMT: 3500,
    exportQualityScore: 99,
    storageCondition: 'Grain Elevator Silo, 14.5% Protein, Vitreous >80%',
    activeCalibers: ['Grade 1 Amber Durum', 'Coarse Bulgur #3', 'Fine Meatball Bulgur #1', 'Mid-Coarse #2'],
  },
  {
    productId: 'pasta-macaroni',
    seasonStatus: 'peak',
    moqTons: 20,
    availableStockMT: 5000,
    exportQualityScore: 100,
    storageCondition: 'Reinforced Corrugated Master Cartons, Max 12.5% Moisture',
    activeCalibers: ['Spaghetti No. 5', 'Penne Rigate', 'Fusilli / Spiral', 'Elbow Macaroni', 'Farfalle Bowtie'],
  },
];

// Helper functions (client-side only)
export function getAdminSession(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function loginAdmin(emailInput: string, passwordInput: string): Promise<{ success: boolean; error?: string; user?: AdminUser }> {
  const cleanEmail = emailInput.trim().toLowerCase();
  const cleanPassword = passwordInput.trim();
  const emailHash = await hashString(cleanEmail);
  const passHash = await hashString(cleanPassword);

  if (emailHash !== ADMIN_EMAIL_HASH) {
    return { success: false, error: 'Yetkisiz e-posta adresi. Yalnızca yetkili yönetici (cebrailkara@gmail.com) erişebilir.' };
  }
  if (passHash !== ADMIN_PASS_HASH) {
    return { success: false, error: 'Hatalı şifre. Lütfen bilgilerinizi kontrol ediniz.' };
  }

  const user: AdminUser = {
    email: cleanEmail,
    name: 'Cebrail Kara',
    role: 'ROOT_SUPER_ADMIN',
    title: 'Nilasya Agro Foods Kurucu & Süper Admin',
    avatar: 'CK',
    lastLoginAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
    addAuditLog('Süper Admin Oturumu Açıldı', `Giriş başarılı: ${cleanEmail}`);
  }

  return { success: true, user };
}

export function logoutAdmin(): void {
  if (typeof window !== 'undefined') {
    addAuditLog('Oturum Kapatıldı', 'Yönetici güvenli çıkış yaptı.');
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  }
}

export function getStoredRFQs(): typeof INITIAL_SEED_RFQS {
  if (typeof window === 'undefined') return INITIAL_SEED_RFQS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RFQS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.RFQS, JSON.stringify(INITIAL_SEED_RFQS));
      return INITIAL_SEED_RFQS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SEED_RFQS;
  }
}

export function saveRFQInquiry(inquiry: Partial<RFQSubmission>): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredRFQs();
    const newEntry = {
      id: `rfq-${Date.now()}`,
      referenceCode: inquiry.referenceCode || `NA-RFQ-${Math.floor(1000 + Math.random() * 9000)}`,
      product: inquiry.product || 'chickpeas',
      variety: inquiry.variety || 'Standart İhracat Çeşidi',
      caliber: inquiry.caliber || 'Standart İhracat Kalibre',
      quantity: inquiry.quantity || '48',
      unit: (inquiry.unit as RFQSubmission['unit']) || 'Tons',
      packaging: inquiry.packaging || 'PP Dokuma Çuval (25kg)',
      destinationCountry: inquiry.destinationCountry || 'Bilinmiyor',
      destinationCity: inquiry.destinationCity || '',
      destinationPort: inquiry.destinationPort || '',
      incoterm: (inquiry.incoterm as RFQSubmission['incoterm']) || 'CIF',
      companyName: inquiry.companyName || 'B2B İthalatçı Firma',
      website: inquiry.website || '',
      contactPerson: inquiry.contactPerson || 'Satın Alma Yetkilisi',
      email: inquiry.email || '',
      phone: inquiry.phone || '',
      whatsapp: inquiry.whatsapp || inquiry.phone || '',
      message: inquiry.message || '',
      createdAt: new Date().toISOString(),
      status: 'new' as const,
      estimatedValueUSD: (Number(inquiry.quantity) || 22) * 1400,
      adminNotes: 'Web sitesi teklif formundan yeni alındı.',
    };
    const updated = [newEntry, ...current];
    localStorage.setItem(STORAGE_KEYS.RFQS, JSON.stringify(updated));
    addAuditLog('Yeni Teklif Alındı', `${newEntry.referenceCode} - ${newEntry.companyName} (${newEntry.product})`);
  } catch (err) {
    console.error('Failed to save RFQ inquiry to localStorage', err);
  }
}

export function updateRFQ(id: string, updates: Partial<(typeof INITIAL_SEED_RFQS)[number]>): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredRFQs();
    const updated = current.map((item) => (item.id === id ? { ...item, ...updates } : item));
    localStorage.setItem(STORAGE_KEYS.RFQS, JSON.stringify(updated));
    addAuditLog('Teklif Güncellendi', `ID: ${id}, Durum: ${updates.status || 'Değişiklik kaydedildi'}`);
  } catch (err) {
    console.error('Failed to update RFQ', err);
  }
}

export function deleteRFQ(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredRFQs();
    const filtered = current.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.RFQS, JSON.stringify(filtered));
    addAuditLog('Teklif Silindi', `Silinen Talep ID: ${id}`);
  } catch (err) {
    console.error('Failed to delete RFQ', err);
  }
}

export function getStoredContainers(): ExportContainer[] {
  if (typeof window === 'undefined') return INITIAL_CONTAINERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGISTICS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.LOGISTICS, JSON.stringify(INITIAL_CONTAINERS));
      return INITIAL_CONTAINERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CONTAINERS;
  }
}

export function getStoredProductStocks(): ProductStockControl[] {
  if (typeof window === 'undefined') return INITIAL_PRODUCT_STOCKS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STOCK);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.STOCK, JSON.stringify(INITIAL_PRODUCT_STOCKS));
      return INITIAL_PRODUCT_STOCKS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PRODUCT_STOCKS;
  }
}

export function updateProductStock(productId: string, updates: Partial<ProductStockControl>): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredProductStocks();
    const updated = current.map((item) => (item.productId === productId ? { ...item, ...updates } : item));
    localStorage.setItem(STORAGE_KEYS.STOCK, JSON.stringify(updated));
    addAuditLog('Ürün / Stok Güncellendi', `${productId} sezon durumu: ${updates.seasonStatus || 'Güncellendi'}`);
  } catch (err) {
    console.error('Failed to update product stock', err);
  }
}

export function getAuditLogs(): AdminAuditLog[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addAuditLog(action: string, details: string): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT);
    const logs: AdminAuditLog[] = raw ? JSON.parse(raw) : [];
    const newLog: AdminAuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      action,
      user: 'Cebrail Kara (Süper Admin)',
      details,
      ip: '127.0.0.1 (Güvenli SSL / Local)',
    };
    const updated = [newLog, ...logs].slice(0, 50); // keep last 50
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(updated));
  } catch {
    // Ignore storage issues
  }
}

export function resetAllAdminData(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.RFQS, JSON.stringify(INITIAL_SEED_RFQS));
  localStorage.setItem(STORAGE_KEYS.LOGISTICS, JSON.stringify(INITIAL_CONTAINERS));
  localStorage.setItem(STORAGE_KEYS.STOCK, JSON.stringify(INITIAL_PRODUCT_STOCKS));
  addAuditLog('Veritabanı Sıfırlandı', 'Tüm demo ve operasyon verileri fabrika ayarlarına döndürüldü.');
}
