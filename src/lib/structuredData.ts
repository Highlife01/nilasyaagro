import { company } from '@/data/company';
import { getTranslations } from '@/data/translations';
import { localizedUrl } from '@/lib/metadata';
import type { Locale, Product, Variety } from '@/types';

export const organizationId = `${company.baseUrl}/#organization`;

// Prevent a data string containing </script> from closing the JSON-LD tag.
export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org', '@type': 'Organization', '@id': organizationId,
    name: company.name, legalName: company.legalName, url: company.baseUrl,
    logo: `${company.baseUrl}/icons/icon-512.png`,
    image: `${company.baseUrl}/images/hero/pulses-export-warehouse-nilasya.jpg`,
    description: 'Turkish supplier and exporter of pulses, grains and agricultural commodities.',
    email: company.email, telephone: company.phoneE164,
    address: {
      '@type': 'PostalAddress', streetAddress: 'Toros Mah. Barış Manço Bulvarı, Çukurova',
      addressLocality: 'Adana', addressCountry: 'TR',
    },
    contactPoint: { '@type': 'ContactPoint', telephone: company.phoneE164, email: company.email, contactType: 'sales' },
    sameAs: [company.linkedin],
  };
}

export function breadcrumbSchema(lang: Locale, items: { name: string; path: string }[]) {
  const t = getTranslations(lang);
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [{ name: t.nav.home, path: '' }, ...items].map(({ name, path }, index) => ({
      '@type': 'ListItem', position: index + 1, name, item: localizedUrl(lang, path),
    })),
  };
}

export function varietySlug(variety: Variety) {
  return (typeof variety.slug === 'string' ? variety.slug : variety.id || variety.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')).toLowerCase();
}

export function productSchema(product: Product, lang: Locale, variety?: Variety) {
  const slug = product.slug[lang] || product.slug.en || product.id;
  const path = `products/${slug}${variety ? `/${varietySlug(variety)}` : ''}`;
  const name = variety ? (lang === 'tr' ? variety.nameTr || variety.name : variety.name) : product.name[lang] || product.name.en;
  const description = variety
    ? (lang === 'tr' ? variety.descriptionTr || variety.description : variety.description)
    : product.fullDescription[lang] || product.fullDescription.en;
  const specifications = product.specifications;
  const properties: Record<string, string | undefined> = {
    'Scientific name': product.scientificName, Origin: lang === 'tr' ? specifications.originTr || specifications.origin : specifications.origin,
    Size: variety?.size || specifications.size, Caliber: variety?.caliber || specifications.caliber,
    Purity: variety?.purity || specifications.purity, Moisture: variety?.moisture || specifications.moisture,
    ...(variety ? {} : { Protein: specifications.protein, 'Foreign matter': specifications.foreignMatter, 'Broken kernels': specifications.broken }),
  };
  return {
    '@context': 'https://schema.org', '@type': 'Product', '@id': `${localizedUrl(lang, path)}#product`,
    name, description, url: localizedUrl(lang, path),
    image: `${company.baseUrl}${variety?.image || variety?.heroImage || product.heroImage}`,
    sku: `NAF-${product.id.toUpperCase()}${variety ? `-${(variety.id || varietySlug(variety)).toUpperCase()}` : ''}`,
    category: product.category[lang] || product.category.en,
    brand: { '@type': 'Brand', name: company.name },
    // Published specifications; no invented priced offer or live stock promise.
    additionalProperty: Object.entries(properties).filter(([, value]) => value).map(([name, value]) => ({ '@type': 'PropertyValue', name, value })),
  };
}
