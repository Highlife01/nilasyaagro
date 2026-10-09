import { company } from '@/data/company';
import { getCompanyFactLabels } from '@/data/companyFacts';
import { getTranslations } from '@/data/translations';
import { getLocalizedSpecifications, getLocalizedVariety } from '@/lib/localizedContent';
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
    logo: `${company.baseUrl}/images/logo/nilasya-logo.png`,
    slogan: company.slogan,
    image: `${company.baseUrl}/images/hero/pulses-export-warehouse-nilasya.jpg`,
    description: getCompanyFactLabels('en').description,
    email: company.email, telephone: company.phoneE164,
    address: {
      '@type': 'PostalAddress', streetAddress: 'Toros Mah. Barış Manço Bulvarı, Çukurova',
      addressLocality: 'Adana', addressCountry: 'TR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 37.00167,
      longitude: 35.32889,
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Worldwide',
    },
    foundingDate: String(company.establishedYear),
    founder: {
      '@type': 'Person',
      name: company.founder,
      jobTitle: company.founderTitleEn,
      image: `${company.baseUrl}${company.founderImage}`,
    },
    contactPoint: { '@type': 'ContactPoint', telephone: company.phoneE164, email: company.email, contactType: 'sales' },
    sameAs: [company.linkedin],
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${company.baseUrl}/#website`,
    name: company.name,
    url: company.baseUrl,
    publisher: { '@id': organizationId },
  };
}

export function faqSchema(faqItems: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
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
  const localizedVariety = variety ? getLocalizedVariety(variety, lang) : undefined;
  const name = localizedVariety ? localizedVariety.name : product.name[lang] || product.name.en;
  const description = localizedVariety
    ? localizedVariety.description
    : product.fullDescription[lang] || product.fullDescription.en;
  const specifications = getLocalizedSpecifications(product, lang);
  const properties: Record<string, string | undefined> = {
    'Scientific name': product.scientificName, Origin: specifications.origin,
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
