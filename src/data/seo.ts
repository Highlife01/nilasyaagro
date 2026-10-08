const descriptions: Record<string, string> = {
  en: 'Premium Turkish pulses and grains supply from Türkiye with Sortex optical cleaning, certified non-GMO quality, and full traceability.',
  tr: 'Türkiye\'den sertifikalı kalite, tam izlenebilirlik ve kesintisiz soğuk zincir ile premium bakliyat ve hububat tedariği.',
  de: 'Erstklassige türkische Hülsenfrüchte und Getreide mit Sortex-Reinigung, zertifizierter Qualität und vollständiger Rückverfolgbarkeit.',
  fr: 'Légumineuses et céréales turques premium avec nettoyage optique Sortex, qualité certifiée et traçabilité complète.',
  es: 'Suministro premium de legumbres y cereales turcos con limpieza óptica Sortex, calidad certificada y trazabilidad completa.',
  it: 'Legumi e cereali turchi premium con pulizia ottica Sortex, qualità certificata e tracciabilità completa.',
  nl: 'Premium Turkse peulvruchten en granen met Sortex optische reiniging, gecertificeerde kwaliteit en volledige traceerbaarheid.',
  pl: 'Wysokiej jakości tureckie rośliny strączkowe i zboża z czyszczeniem optycznym Sortex, certyfikowaną jakością i pełną identyfikowalnością.',
  ro: 'Leguminoase și cereale turcești premium cu curățare optică Sortex, calitate certificată și trasabilitate completă.',
  bg: 'Първокласни турски бобови и зърнени култури със Sortex оптично почистване, сертифицирано качество и пълна проследимост.',
  el: 'Όσπρια και δημητριακά υψηλής ποιότητας από την Τουρκία με οπτικό καθαρισμό Sortex, πιστοποιημένη ποιότητα και πλήρη ιχνηλασιμότητα.',
  ru: 'Поставки турецких бобовых и зерновых премиум-класса с оптической очисткой Sortex, сертифицированным качеством и полной прослеживаемостью.',
  uk: 'Постачання турецьких бобових і зернових преміум-класу з оптичним очищенням Sortex, сертифікованою якістю та повною простежуваністю.',
  ar: 'توريد بقوليات وحبوب تركية ممتازة مع تنظيف بصري Sortex وجودة معتمدة وتتبع كامل.',
  fa: 'تأمین حبوبات و غلات درجه یک ترکیه با تمیزکاری نوری Sortex، کیفیت گواهی‌شده و قابلیت رهگیری کامل.',
  hi: 'तुर्की की प्रीमियम दालें और अनाज Sortex ऑप्टिकल सफाई, प्रमाणित गुणवत्ता और पूर्ण ट्रेसबिलिटी के साथ।',
  ur: 'ترکی کی اعلیٰ معیار کی دالیں اور اناج Sortex آپٹیکل صفائی، تصدیق شدہ معیار اور مکمل ٹریسبیلٹی کے ساتھ۔',
  'zh-cn': '来自土耳其的优质豆类和谷物，配备Sortex光学清洁、认证品质和全程可追溯体系。',
  ja: 'トルコ産プレミアム豆類・穀物。Sortex光学選別、認証品質、完全なトレーサビリティを実現。',
  ko: '터키산 프리미엄 두류 및 곡물 - Sortex 광학 세척, 인증된 품질, 완전한 추적성 제공.',
  id: 'Pasokan kacang-kacangan dan biji-bijian Turki premium dengan pembersihan optik Sortex, kualitas bersertifikat, dan ketertelusuran penuh.',
  ms: 'Bekalan kekacang dan bijirin Turki premium dengan pembersihan optik Sortex, kualiti diperakui, dan kebolehkesanan penuh.',
  pt: 'Fornecimento premium de leguminosas e grãos turcos com limpeza óptica Sortex, qualidade certificada e rastreabilidade total.',
  az: 'Sortex optik təmizləmə, sertifikatlaşdırılmış keyfiyyət və tam izlənə bilənlik ilə Türkiyədən premium paxlalı bitkilər və taxıl tədarükü.',
  uz: 'Sortex optik tozalash, sertifikatlangan sifat va to\'liq kuzatuv bilan Turkiyadan yuqori sifatli dukkaklilar va don mahsulotlari yetkazib berish.',
  kk: 'Sortex оптикалық тазалау, сертификатталған сапа және толық қадағалау жүйесімен Түркиядан жоғары сапалы бұршақты дақылдар және астық жеткізу.',
  ka: 'თურქული პრემიუმ-კლასის პარკოსნები და მარცვლეული Sortex ოპტიკური გაწმენდით, სერტიფიცირებული ხარისხით და სრული მოძიებადობით.',
  sr: 'Premium turske mahunарке i žitarice sa Sortex optičkim čišćenjem, sertifikovanim kvalitetom i potpunom sledljivošću.',
  bn: 'Sortex অপটিক্যাল ক্লিনিং, প্রত্যয়িত মান এবং সম্পূর্ণ ট্রেসেবিলিটি সহ তুরস্ক থেকে প্রিমিয়াম ডাল ও শস্য সরবরাহ।',
  sw: 'Usambazaji wa mikunde na nafaka za ubora wa juu kutoka Uturuki wenye usafishaji wa Sortex, ubora ulioidhinishwa na ufuatiliaji kamili.',
};

export function localizedSeoDescription(lang: string, subject?: string) {
  const description = descriptions[lang] || descriptions.en;
  return subject ? `${subject}. ${description}` : description;
}
