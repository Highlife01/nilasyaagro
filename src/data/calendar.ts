export interface MonthItem {
  id: number;
  en: string;
  tr: string;
}

export const monthsList: MonthItem[] = [
  { id: 1, en: 'Jan', tr: 'Oca' },
  { id: 2, en: 'Feb', tr: 'Şub' },
  { id: 3, en: 'Mar', tr: 'Mar' },
  { id: 4, en: 'Apr', tr: 'Nis' },
  { id: 5, en: 'May', tr: 'May' },
  { id: 6, en: 'Jun', tr: 'Haz' },
  { id: 7, en: 'Jul', tr: 'Tem' },
  { id: 8, en: 'Aug', tr: 'Ağu' },
  { id: 9, en: 'Sep', tr: 'Eyl' },
  { id: 10, en: 'Oct', tr: 'Eki' },
  { id: 11, en: 'Nov', tr: 'Kas' },
  { id: 12, en: 'Dec', tr: 'Ara' },
];

export interface CalendarProductRow {
  id: string;
  name: {
    en: string;
    tr: string;
  };
  category: {
    en: string;
    tr: string;
  };
  slug: {
    en: string;
    tr: string;
  };
  months: {
    [key: number]: 'harvest' | 'storage' | 'none'; // 1-12
  };
  peakHarvest: {
    en: string;
    tr: string;
  };
  supplyType: {
    en: string;
    tr: string;
  };
  keyRegions: {
    en: string;
    tr: string;
  };
}

export const harvestCalendarData: CalendarProductRow[] = [
  {
    id: 'chickpeas',
    slug: { en: 'chickpeas', tr: 'nohut' },
    name: { en: 'Kabuli Chickpeas (Koçbaşı 7-10mm)', tr: 'Koçbaşı Nohut (7-10mm)' },
    category: { en: 'Pulses', tr: 'Bakliyat' },
    months: {
      1: 'storage',
      2: 'storage',
      3: 'storage',
      4: 'storage',
      5: 'storage',
      6: 'storage',
      7: 'harvest',
      8: 'harvest',
      9: 'harvest',
      10: 'storage',
      11: 'storage',
      12: 'storage',
    },
    peakHarvest: { en: 'July – September', tr: 'Temmuz – Eylül' },
    supplyType: { en: 'Direct Harvest + Climate Silos (Year-Round)', tr: 'Taze Hasat + İklimlendirmeli Silo (Yıl Boyu)' },
    keyRegions: { en: 'Konya, Karaman, Yozgat, Mersin', tr: 'Konya, Karaman, Yozgat, Mersin' },
  },
  {
    id: 'red-lentils',
    slug: { en: 'red-lentils', tr: 'kirmizi-mercimek' },
    name: { en: 'Red Lentils (Football & Split)', tr: 'Kırmızı Mercimek (Futbol & Yaprak)' },
    category: { en: 'Pulses', tr: 'Bakliyat' },
    months: {
      1: 'storage',
      2: 'storage',
      3: 'storage',
      4: 'storage',
      5: 'harvest',
      6: 'harvest',
      7: 'storage',
      8: 'storage',
      9: 'storage',
      10: 'storage',
      11: 'storage',
      12: 'storage',
    },
    peakHarvest: { en: 'May – June', tr: 'Mayıs – Haziran' },
    supplyType: { en: 'Fresh Milling Year-Round in Mersin', tr: 'Mersin Tesislerinde Yıl Boyu Taze Kırım' },
    keyRegions: { en: 'Gaziantep, Şanlıurfa, Diyarbakır, Mersin', tr: 'Gaziantep, Şanlıurfa, Diyarbakır, Mersin' },
  },
  {
    id: 'green-lentils',
    slug: { en: 'green-lentils', tr: 'yesil-mercimek' },
    name: { en: 'Green Lentils (Laird & Eston 5-7mm)', tr: 'Yeşil Mercimek (Laird & Eston)' },
    category: { en: 'Pulses', tr: 'Bakliyat' },
    months: {
      1: 'storage',
      2: 'storage',
      3: 'storage',
      4: 'storage',
      5: 'storage',
      6: 'storage',
      7: 'harvest',
      8: 'harvest',
      9: 'storage',
      10: 'storage',
      11: 'storage',
      12: 'storage',
    },
    peakHarvest: { en: 'July – August', tr: 'Temmuz – Ağustos' },
    supplyType: { en: 'Sortex Optical Cleaning (Year-Round)', tr: 'Sortex Temizleme (Yıl Boyu İhracat)' },
    keyRegions: { en: 'Yozgat, Çorum, Ankara, Konya', tr: 'Yozgat, Çorum, Ankara, Konya' },
  },
  {
    id: 'white-beans',
    slug: { en: 'white-beans', tr: 'kuru-fasulye' },
    name: { en: 'Dry White Beans (Dermason & Horoz)', tr: 'Kuru Fasulye (Dermason & Horoz)' },
    category: { en: 'Pulses', tr: 'Bakliyat' },
    months: {
      1: 'storage',
      2: 'storage',
      3: 'storage',
      4: 'storage',
      5: 'storage',
      6: 'storage',
      7: 'storage',
      8: 'storage',
      9: 'harvest',
      10: 'harvest',
      11: 'storage',
      12: 'storage',
    },
    peakHarvest: { en: 'September – October', tr: 'Eylül – Ekim' },
    supplyType: { en: 'Calibrated Sizing & Sortex', tr: 'Kalibrasyon ve Sortex Ayıklama' },
    keyRegions: { en: 'Erzincan, Konya, Karaman, Niğde', tr: 'Erzincan, Konya, Karaman, Niğde' },
  },
  {
    id: 'dry-peas',
    slug: { en: 'dry-peas', tr: 'kuru-bezelye' },
    name: { en: 'Dry Peas (Yellow & Green Split/Whole)', tr: 'Kuru Bezelye (Sarı & Yeşil)' },
    category: { en: 'Pulses', tr: 'Bakliyat' },
    months: {
      1: 'storage',
      2: 'storage',
      3: 'storage',
      4: 'storage',
      5: 'storage',
      6: 'harvest',
      7: 'harvest',
      8: 'harvest',
      9: 'storage',
      10: 'storage',
      11: 'storage',
      12: 'storage',
    },
    peakHarvest: { en: 'June – August', tr: 'Haziran – Ağustos' },
    supplyType: { en: 'Hulled, Split & Calibrated', tr: 'Kabuk Soyulmuş, Bölünmüş & Kalibre' },
    keyRegions: { en: 'Central Anatolia & Mersin Hub', tr: 'İç Anadolu & Mersin Terminali' },
  },
  {
    id: 'durum-wheat-bulgur',
    slug: { en: 'durum-wheat-bulgur', tr: 'bugday-ve-bulgur' },
    name: { en: 'Durum Wheat & Traditional Bulgur', tr: 'Makarnalık Durum Buğdayı & Bulgur' },
    category: { en: 'Grains & Cereals', tr: 'Hububat ve Bulgur' },
    months: {
      1: 'storage',
      2: 'storage',
      3: 'storage',
      4: 'storage',
      5: 'storage',
      6: 'harvest',
      7: 'harvest',
      8: 'storage',
      9: 'storage',
      10: 'storage',
      11: 'storage',
      12: 'storage',
    },
    peakHarvest: { en: 'June – July', tr: 'Haziran – Temmuz' },
    supplyType: { en: 'Parboiled & Stone Cracked Year-Round', tr: 'Geleneksel Haşlanmış & Kırılmış (Yıl Boyu)' },
    keyRegions: { en: 'Konya, Gaziantep, Şanlıurfa, Mersin', tr: 'Konya, Gaziantep, Şanlıurfa, Mersin' },
  },
  {
    id: 'other-pulses-seeds',
    slug: { en: 'other-pulses-seeds', tr: 'diger-bakliyat-ve-tohumlar' },
    name: { en: 'Fava Beans, Sesame & Agro Seeds', tr: 'Kuru Bakla, Susam & Tohumlar' },
    category: { en: 'Specialty Commodities', tr: 'Özel Emtialar' },
    months: {
      1: 'storage',
      2: 'storage',
      3: 'storage',
      4: 'storage',
      5: 'harvest',
      6: 'harvest',
      7: 'harvest',
      8: 'harvest',
      9: 'harvest',
      10: 'storage',
      11: 'storage',
      12: 'storage',
    },
    peakHarvest: { en: 'May – September', tr: 'Mayıs – Eylül' },
    supplyType: { en: 'Hulled, Natural & Machine Cleaned', tr: 'Soyulmuş, Doğal & Makine Temizlenmiş' },
    keyRegions: { en: 'Aegean, Mediterranean, Adana, Mersin', tr: 'Ege, Akdeniz, Adana, Mersin' },
  },
];
