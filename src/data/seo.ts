const descriptions: Record<string, string> = {
  en: 'Premium fresh fruit and vegetable supply from Türkiye with certified quality, full traceability and an uninterrupted cold chain.',
  tr: 'Türkiye’den sertifikalı kalite, tam izlenebilirlik ve kesintisiz soğuk zincir ile premium bakliyat ve hububat tedariği.',
  de: 'Premium-Obst und -Gemüse aus der Türkei mit zertifizierter Qualität, vollständiger Rückverfolgbarkeit und lückenloser Kühlkette.',
  fr: 'Fruits et légumes frais premium de Turquie avec qualité certifiée, traçabilité complète et chaîne du froid ininterrompue.',
  es: 'Suministro de frutas y verduras frescas premium de Turquía con calidad certificada, trazabilidad completa y cadena de frío ininterrumpida.',
  it: 'Fornitura di frutta e verdura fresca premium dalla Turchia con qualità certificata, tracciabilità completa e catena del freddo ininterrotta.',
  nl: 'Premium verse groenten en fruit uit Turkije met gecertificeerde kwaliteit, volledige traceerbaarheid en een ononderbroken koelketen.',
  pl: 'Dostawy świeżych owoców i warzyw premium z Turcji z certyfikowaną jakością, pełną identyfikowalnością i nieprzerwanym łańcuchem chłodniczym.',
  ro: 'Furnizare de fructe și legume proaspete premium din Turcia, cu calitate certificată, trasabilitate completă și lanț frigorific neîntrerupt.',
  bg: 'Доставка на първокласни пресни плодове и зеленчуци от Турция със сертифицирано качество, пълна проследимост и непрекъсната хладилна верига.',
  el: 'Προμήθεια φρέσκων φρούτων και λαχανικών υψηλής ποιότητας από την Τουρκία, με πιστοποιημένη ποιότητα, πλήρη ιχνηλασιμότητα και αδιάλειπτη ψυκτική αλυσίδα.',
  ru: 'Поставки свежих фруктов и овощей премиум-класса из Турции с сертифицированным качеством, полной прослеживаемостью и непрерывной холодовой цепью.',
  uk: 'Постачання свіжих фруктів та овочів преміумкласу з Туреччини із сертифікованою якістю, повною простежуваністю та безперервним холодовим ланцюгом.',
  ar: 'توريد فواكه وخضروات طازجة ممتازة من تركيا بجودة معتمدة وتتبع كامل وسلسلة تبريد متواصلة.',
  fa: 'تأمین میوه و سبزیجات تازه ممتاز از ترکیه با کیفیت گواهی‌شده، قابلیت رهگیری کامل و زنجیره سرد پیوسته.',
  he: 'אספקת פירות וירקות טריים באיכות פרימיום מטורקיה, עם איכות מוסמכת, עקיבות מלאה ושרשרת קירור רציפה.',
  hi: 'तुर्किये से प्रमाणित गुणवत्ता, पूर्ण ट्रेसबिलिटी और निरंतर कोल्ड चेन के साथ प्रीमियम ताज़े फल और सब्ज़ियों की आपूर्ति।',
  ur: 'ترکیہ سے تصدیق شدہ معیار، مکمل ٹریس ایبلٹی اور مسلسل کولڈ چین کے ساتھ اعلیٰ معیار کے تازہ پھلوں اور سبزیوں کی فراہمی۔',
  'zh-cn': '来自土耳其的优质新鲜水果和蔬菜供应，具备认证品质、全程可追溯体系和不间断冷链。',
  ja: '認証品質、完全なトレーサビリティ、途切れないコールドチェーンで、トルコ産の高品質な生鮮果物・野菜を供給します。',
  ko: '인증된 품질, 완전한 추적성, 끊김 없는 콜드체인으로 튀르키예산 프리미엄 신선 과일과 채소를 공급합니다.',
  id: 'Pasokan buah dan sayuran segar premium dari Türkiye dengan mutu bersertifikat, ketertelusuran penuh, dan rantai dingin tanpa terputus.',
  ms: 'Bekalan buah-buahan dan sayur-sayuran segar premium dari Türkiye dengan kualiti diperakui, kebolehkesanan penuh dan rantaian sejuk tanpa putus.',
  pt: 'Fornecimento de frutas e legumes frescos premium da Turquia, com qualidade certificada, rastreabilidade total e cadeia de frio ininterrupta.',
  cs: 'Dodávky prémiového čerstvého ovoce a zeleniny z Turecka s certifikovanou kvalitou, úplnou dohledatelností a nepřerušeným chladicím řetězcem.',
};

export function localizedSeoDescription(lang: string, subject?: string) {
  const description = descriptions[lang] || descriptions.en;
  return subject ? `${subject}. ${description}` : description;
}
