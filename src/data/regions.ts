import { ProductionRegion } from '@/types';

export const productionRegionsData: ProductionRegion[] = [
  {
    id: 'mersin_logistics_hub',
    name: {
      en: 'Mersin International Processing & Export Hub',
      tr: 'Mersin Uluslararası İşleme ve İhracat Terminali',
    },
    location: 'Mersin Free Zone & Akdeniz Industrial Basin, Türkiye',
    climate: {
      en: 'Strategic deep-water seaport gateway connecting Anatolian agricultural heartlands directly to global shipping lines (MIP).',
      tr: 'Anadolu tarım havzalarını doğrudan küresel deniz ticaret hatlarına bağlayan Akdeniz’in ana aktarma limanı.',
    },
    products: ['Optical Sortex Pulses Processing', 'Red Lentil Milling & De-Hulling', 'Jumbo Big Bag & Container Bulk Loading'],
    productsTr: ['Sortex Optik Bakliyat İşleme', 'Kırmızı Mercimek Kırım & Kabuk Soyma', 'Big Bag & Konteyner Dökme Yükleme'],
    peakMonths: {
      en: 'Continuous 12-Month Industrial Export Operations',
      tr: 'Yıl Boyu 12 Ay Kesintisiz İhracat Operasyonları',
    },
    advantages: {
      en: [
        'Direct connection to Mersin International Port (MIP) for fast ocean container departure without inland delays',
        'State-of-the-art Bühler Sortex optical color sorting and gravity separation machinery',
        'Direct customs clearance, phytosanitary inspection, and SGS/Bureau Veritas pre-shipment quality verification on site',
      ],
      tr: [
        'Mersin Uluslararası Limanı\'na (MIP) doğrudan bağlantı ile gecikmesiz hızlı konteyner yüklemesi',
        'En son teknoloji Bühler Sortex optik renk ayırıcılar ve yerçekimi gravite temizleme hatları',
        'Tesis içinde doğrudan gümrükleme, bitki sağlığı (fitosaniter) denetimi ve SGS gözetim imkanı',
      ],
    },
  },
  {
    id: 'central_anatolia_basin',
    name: {
      en: 'Central Anatolian Pulses & Durum Basin',
      tr: 'İç Anadolu Bakliyat ve Durum Buğdayı Havzası',
    },
    location: 'Konya, Karaman, Yozgat, Çorum, Ankara Highlands (900m – 1,200m altitude)',
    climate: {
      en: 'Continental highland climate with dry, sunny maturation seasons and fertile volcanic soils, yielding large caliber grains with superior cooking characteristics.',
      tr: 'Kuru ve güneşli olgunlaşma dönemi, 1.000m rakım ve zengin kireçli-volkanik topraklar ile yüksek kalibre ve diri pişme randımanı.',
    },
    products: ['Kabuli Chickpeas (Koçbaşı 8mm-10mm)', 'Green Lentils (Laird & Eston)', 'Dermason White Beans', 'Amber Durum Wheat'],
    productsTr: ['Koçbaşı Nohut (8mm-10mm)', 'Yeşil Mercimek (Laird & Eston)', 'Dermason Kuru Fasulye', 'Kehribar Durum Buğdayı'],
    peakMonths: {
      en: 'July – October (Year-round silo supply)',
      tr: 'Temmuz – Ekim (Silolardan 12 ay tedarik)',
    },
    advantages: {
      en: [
        'World-famous Koçbaşı chickpeas with 8mm to 10mm+ uniform caliber and thin tender skins',
        'Firm-cooking green lentils that resist splitting during industrial canning and boiling',
        'High natural starch-to-protein ratio and rich dietary minerals',
      ],
      tr: [
        'Dünyaca ünlü 8mm-10mm+ homojen kalibreli, ince kabuklu Koçbaşı nohutlar',
        'Kaynatma ve konserveleme sırasında kabuk atmayan diri yeşil mercimekler',
        'Yüksek protein, doğal mineral dengesi ve lezzetli pişme performansı',
      ],
    },
  },
  {
    id: 'southeastern_anatolia',
    name: {
      en: 'Southeastern Anatolian Fertile Crescent (Lentil & Bulgur Hub)',
      tr: 'Güneydoğu Anadolu Bereketli Hilal (Mercimek ve Bulgur Havzası)',
    },
    location: 'Gaziantep, Şanlıurfa, Diyarbakır, Mardin',
    climate: {
      en: 'Sun-drenched, mineral-rich semi-arid terroir of Upper Mesopotamia, the genetic cradle of red lentils and durum wheat.',
      tr: 'Kırmızı mercimek ve durum buğdayının genetik anavatanı olan Yukarı Mezopotamya\'nın zengin güneşi ve mineral dolu toprakları.',
    },
    products: ['Turkish Red Lentils (Football & Split)', 'Traditional Durum Bulgur', 'High-Protein Durum Grain'],
    productsTr: ['Türk Kırmızı Mercimeği (Futbol & Yaprak)', 'Geleneksel Durum Bulguru', 'Yüksek Proteinli Durum Buğdayı'],
    peakMonths: {
      en: 'May – July (Continuous year-round milling)',
      tr: 'Mayıs – Temmuz (Yıl boyu kesintisiz değirmen kırım)',
    },
    advantages: {
      en: [
        'Vibrant coral-red color and high plant protein (>25%) distinctive to authentic Turkish red lentils',
        'Generations of stone-milling expertise producing parboiled bulgur with natural golden color',
        'Large-scale contract farming network ensuring uninterrupted bulk commodity supply',
      ],
      tr: [
        'Orijinal Türk kırmızı mercimeğine özgü canlı mercan kırmızısı renk ve %25 üzeri bitkisel protein',
        'Geleneksel taş değirmen ustalığıyla üretilen doğal altın sarısı haşlanmış bulgur',
        'Kesintisiz tonajlı tedariki garanti eden geniş sözleşmeli tarım ağı',
      ],
    },
  },
  {
    id: 'aegean_mediterranean_coastal',
    name: {
      en: 'Aegean & Mediterranean Oilseeds and Specialty Pulses',
      tr: 'Ege ve Akdeniz Yağlı Tohum ve Özel Bakliyat Kuşağı',
    },
    location: 'İzmir, Manisa, Denizli, Adana, Antalya, Mersin',
    climate: {
      en: 'Warm Mediterranean microclimates providing optimal conditions for sesame seeds, oilseeds and specialty legume crops.',
      tr: 'Susam, yağlı tohumlar ve baklagiller için ideal sıcak Akdeniz ve Ege mikrokliması.',
    },
    products: ['Natural & Hulled Sesame Seeds', 'Broad Beans / Fava Beans', 'Black-Eyed Peas (Börülce)', 'Confectionery Sunflower Seeds'],
    productsTr: ['Doğal & Soyulmuş Beyaz Susam', 'Kuru Bakla (Fava)', 'Kuru Börülce', 'Çerezlik Ayçekirdeği'],
    peakMonths: {
      en: 'May – November',
      tr: 'Mayıs – Kasım',
    },
    advantages: {
      en: [
        'High-oil content (>52%) premium white sesame seeds for tahini and gourmet bakery industries',
        'Large-seeded Turkish fava beans favored across Middle Eastern and Mediterranean markets',
        'Direct export proximity to both İzmir Alsancak Port and Mersin Port',
      ],
      tr: [
        'Tahin ve gurme fırıncılık sanayisi için %52 üzeri yağ oranına sahip soyulmuş beyaz susam',
        'Orta Doğu ve Akdeniz pazarlarının aradığı iri daneli Türk kuru baklası',
        'Hem İzmir Limanı hem Mersin Limanı üzerinden çift yönlü esnek ihracat imkanı',
      ],
    },
  },
  {
    id: 'black_sea_anatolian_nuts_hub',
    name: {
      en: 'Black Sea & Anatolian Premium Nuts and Dried Fruits Basin',
      tr: 'Karadeniz ve Anadolu Seçkin Kuruyemiş ve Kuru Meyve Havzası',
    },
    location: 'Giresun, Ordu, Gaziantep, Malatya, Aydın, Çorum',
    climate: {
      en: 'Rich biodiversity spanning the temperate humid Black Sea coast to the sun-drenched orchards of Southeastern and Aegean Anatolia.',
      tr: 'Karadeniz’in ılıman yağışlı yamaçlarından Ege ve Güneydoğu’nun bol güneşli vadilerine uzanan zengin mikroklima.',
    },
    products: ['Turkish Hazelnuts (Giresun & Levant)', 'Antep Pistachios (Boz İç & In-Shell)', 'Light Walnut Halves', 'Sun-Dried Figs & Apricots', 'Çorum Leblebi'],
    productsTr: ['Giresun & Levant İç Fındık', 'Gaziantep Antep Fıstığı (Boz İç & Kabuklu)', 'Açık Renk Kelebek Ceviz', 'Kuru İncir & Gün Kurusu Kayısı', 'Çorum Çifte Kavrulmuş Leblebi'],
    peakMonths: {
      en: 'August – November (12-Month Climate-Controlled Supply)',
      tr: 'Ağustos – Kasım (12 Ay Soğuk Hava Depolarından Tedarik)',
    },
    advantages: {
      en: [
        'World-leading Turkish hazelnuts with superior natural oil profile, thin skin, and unmatched aroma for premium chocolatiers',
        'Authentic Gaziantep emerald-green pistachios (Boz İç) and natural sun-dried apricots and figs',
        'State-of-the-art optical laser sorting, vacuum and nitrogen-flushed protective packaging',
      ],
      tr: [
        'Lüks çikolata ve gıda sanayisi için eşsiz aroması ve yüksek yağ oranıyla dünyanın 1 numaralı Türk fındığı',
        'Orijinal Gaziantep zümrüt yeşili iç fıstığı, doğal Ege kuru inciri ve Malatya gün kurusu kayısısı',
        'Lazer tarayıcılarla yabancı madde ayıklama, vakumlu ve azot gazlı koruyucu atmosferli ihracat ambalajı',
      ],
    },
  },
];

export const productionRegions = productionRegionsData;
