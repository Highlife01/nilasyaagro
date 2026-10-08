export interface PackagingDetail {
  id: string;
  name: {
    en: string;
    tr: string;
  };
  suitableFor: {
    en: string;
    tr: string;
  };
  netWeightRange: string;
  material: {
    en: string;
    tr: string;
  };
  palletConfigEuro: string;
  palletConfigStandard: string;
  containerReefer40FCL: string; // Or standard 20ft/40ft container capacity
  features: {
    en: string[];
    tr: string[];
  };
}

export const packagingData: PackagingDetail[] = [
  {
    id: 'pp_woven_bag_25kg_50kg',
    name: {
      en: 'Polypropylene (PP) Woven Bags (25 kg & 50 kg)',
      tr: 'Polipropilen (PP) Çuval Ambalaj (25 kg & 50 kg)',
    },
    suitableFor: {
      en: 'Chickpeas, Red Lentils, Green Lentils, White Beans, Dry Peas, Bulgur, Wheat',
      tr: 'Nohut, Kırmızı Mercimek, Yeşil Mercimek, Kuru Fasulye, Bezelye, Bulgur, Buğday',
    },
    netWeightRange: '25.0 kg – 50.0 kg Net',
    material: {
      en: 'High-density woven polypropylene with UV stabilization and optional food-grade PE inner liner to protect from ambient humidity',
      tr: 'Neme karşı koruma sağlayan opsiyonel gıda uyumlu PE iç naylonlu, UV dayanımlı yüksek mukavemetli polipropilen dokuma kumaş',
    },
    palletConfigEuro: '20 – 40 bags per Euro Pallet (80x120 cm)',
    palletConfigStandard: '24 – 48 bags per Industrial Pallet (100x120 cm), shrink-wrapped with corner boards',
    containerReefer40FCL: '24.0 – 26.0 Metric Tons per 20ft / 40ft FCL container (approx. 500 to 1,000 sacks)',
    features: {
      en: [
        'Anti-slip weave design prevents slippage during ocean transit and pallet handling',
        'Custom multi-color private label printing with buyer logo, batch number and origin markings',
        'Certified food-contact safe and breathable to preserve natural grain moisture',
        'Double-stitched bottom seam for maximum tensile strength against burst hazards',
      ],
      tr: [
        'Konteyner ve palet taşımacılığında kaymayı önleyen özel kaymaz dokuma yapısı',
        'Alıcı logosu, parti numarası ve menşe bilgilerini içeren çok renkli özel baskı imkanı',
        'Gıdaya uygun sertifikalı ve tahılın doğal nem dengesini koruyan nefes alabilir yapı',
        'Patlama ve yırtılmalara karşı güçlendirilmiş çift dikişli taban yapısı',
      ],
    },
  },
  {
    id: 'big_bag_jumbo_1000kg',
    name: {
      en: '1,000 kg / 1,200 kg FIBC Big Bags (Jumbo Bags)',
      tr: '1.000 kg / 1.200 kg Big Bag (Jumbo Torba / FIBC)',
    },
    suitableFor: {
      en: 'Bulk Chickpeas, Lentils, Beans, Durum Wheat, Barley, Feed & Food Grade Grains',
      tr: 'Dökme Nohut, Mercimek, Fasulye, Makarnalık Buğday, Arpa, Gıda ve Yemlik Hububat',
    },
    netWeightRange: '1,000 kg – 1,250 kg Net',
    material: {
      en: 'Heavy-duty tubular virgin polypropylene with 5:1 / 6:1 Safety Factor, dust-proof seams and top filling/discharge bottom spout',
      tr: '5:1 / 6:1 Güvenlik katsayılı, toz sızdırmaz dikişli, üstten doldurma ve alttan tahliye boşaltma bacalı saf polipropilen',
    },
    palletConfigEuro: '1 Big Bag per Pallet (or floor-loaded direct into container)',
    palletConfigStandard: '1 Big Bag per Industrial Pallet (100x120 cm), secured with strapping',
    containerReefer40FCL: '20 to 24 Big Bags per 20ft / 40ft Dry Container (20.0 – 25.0 Metric Tons)',
    features: {
      en: [
        '4 cross-corner heavy lifting loops for rapid forklift and crane handling at destination ports',
        'Bottom discharge spout allows controlled, dust-free emptying directly into buyer processing silos',
        'Laminated or PE-lined barrier against sea humidity and moisture infiltration',
        'Significantly reduces handling labor and packaging disposal costs for industrial processors',
      ],
      tr: [
        'Varış limanlarında vinç ve forklift ile hızlı elleçleme sağlayan 4 köşe kaldırma kulpu',
        'Alıcı fabrika silolarına tozsuz ve kontrollü boşaltım sağlayan alt boşaltma ventili',
        'Deniz nemi ve su buharı sızmasına karşı lamine veya PE naylon bariyer seçeneği',
        'Endüstriyel konserve ve paketleme fabrikaları için işçilik ve ambalaj atık maliyetini düşürür',
      ],
    },
  },
  {
    id: 'retail_kraft_doypack',
    name: {
      en: 'Retail Consumer Packaging (500g, 800g, 1kg, 2.5kg & 5kg)',
      tr: 'Perakende Tüketici Ambalajları (500g, 800g, 1kg, 2.5kg & 5kg)',
    },
    suitableFor: {
      en: 'Supermarket Brands, Private Label Pulses, Rice, Bulgur, Green & Red Lentils',
      tr: 'Süpermarket Markaları, Private Label Bakliyat, Pirinç, Bulgur, Kırmızı ve Yeşil Mercimek',
    },
    netWeightRange: '500g, 800g, 900g, 1.0 kg, 2.0 kg, 2.5 kg, 5.0 kg Net',
    material: {
      en: 'Multi-layer barrier films: Matte/Gloss OPP, Kraft paper with transparent window, Standing Doypack with zip-lock or Quad-seal pillow bag',
      tr: 'Çok katmanlı bariyer filmler: Mat/Parlak OPP, pencereli Kraft kağıt, kilitli Doypack ayakta duran poşet veya 4 kenar körüklü torba',
    },
    palletConfigEuro: '60 – 120 Master Cartons per Euro Pallet',
    palletConfigStandard: '72 – 140 Master Cartons per Industrial Pallet (wrapped in stretch film)',
    containerReefer40FCL: '18.0 – 22.0 Metric Tons in master cartons per 40ft Container',
    features: {
      en: [
        'Full OEM & Private Label branding ready for international supermarket chains',
        'Modified Atmosphere Packaging (MAP) nitrogen flush available for extended 3-year shelf life',
        'Clear inspection window allows consumer to inspect pulse caliber and color purity',
        'Multilingual nutritional facts, barcode EAN-13, and cooking instructions printed to specs',
      ],
      tr: [
        'Uluslararası süpermarket zincirleri için eksiksiz OEM ve Özel Marka (Private Label) üretimi',
        '3 yıla kadar raf ömrünü uzatan koruyucu atmosferde (azot gazı / MAP) dolum seçeneği',
        'Tüketicinin bakliyat kalibresini ve temizliğini görmesini sağlayan şeffaf gözetleme penceresi',
        'İstenen dillerde besin değerleri tablosu, EAN-13 barkod ve pişirme tarifleri baskısı',
      ],
    },
  },
  {
    id: 'sea_bulk_container_liner',
    name: {
      en: 'Sea Bulk Container Liner Bags (Dry Bulk Shipping)',
      tr: 'Konteyner İçi Dökme Yük Torbası (Sea Bulk Liner)',
    },
    suitableFor: {
      en: 'High-Volume Durum Wheat, Feed Barley, Yellow Corn, Whole Chickpeas & Lentils',
      tr: 'Yüksek Hacimli Makarnalık Buğday, Arpa, Dane Mısır, Dökme Nohut ve Mercimek',
    },
    netWeightRange: '20.0 – 26.0 Metric Tons per 20ft Container',
    material: {
      en: 'Heavy-duty food-grade woven PE/PP liner fitted to the entire interior dimensions of a 20ft ocean container',
      tr: '20ft deniz konteynerinin tüm iç hacmini kaplayan gıda temasına uygun, dikiş takviyeli dokuma PE/PP astar',
    },
    palletConfigEuro: 'Not palletized (Loaded in bulk directly into container with steel bulkhead bars)',
    palletConfigStandard: 'Direct container loading with pneumatic or conveyor blowers',
    containerReefer40FCL: '25.0 – 27.0 Metric Tons per 20ft Dry Container',
    features: {
      en: [
        'Maximizes container payload to the maximum allowable gross weight limit',
        'Eliminates pallet and sack costs for large grain millers and industrial processors',
        'Hermetically sealed from container walls, preventing rust, moisture and odor contamination',
        'Rapid pneumatically blown discharge at destination receiving hoppers and grain terminals',
      ],
      tr: [
        'Konteyner taşıma kapasitesini azami tonaj sınırına kadar tam verimle doldurur',
        'Büyük un/makarna fabrikaları ve yem sanayicileri için palet ve çuval maliyetini ortadan kaldırır',
        'Konteyner duvarlarından izole ederek pas, nem ve koku bulaşmasını tamamen engeller',
        'Varış limanında pnömatik helezon veya damper ile silolara dakikalar içinde hızlı boşaltım',
      ],
    },
  },
];
