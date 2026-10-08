export const company = {
  name: 'Nilasya Agro Foods',
  legalName: 'Nilasya Agro Foods Tarım Ürünleri Dış Ticaret Ltd. Şti.',
  baseUrl: 'https://www.nilasyaagrofoods.com.tr',
  domain: 'nilasyaagrofoods.com.tr',
  email: 'export@nilasyaagrofoods.com.tr',
  secondaryEmail: 'info@nilasyaagrofoods.com.tr',
  phoneDisplay: '+90 533 684 01 75',
  phoneE164: '+905336840175',
  whatsappNumber: '905336840175',
  headquarters: 'Mersin International Port Logistics Zone & Akdeniz, Mersin / Türkiye',
  hubLocations: [
    'Mersin Optical Sorting, Milling & Export Terminal',
    'Konya & Central Anatolian Pulses Aggregation Center',
    'Gaziantep & Southeast Anatolia Lentil Processing Hub'
  ],
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

