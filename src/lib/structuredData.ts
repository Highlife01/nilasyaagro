import { company } from '@/data/company';
import { getCompanyFactLabels } from '@/data/companyFacts';
import { supportedLanguages } from '@/data/languages';
import { getTranslations } from '@/data/translations';
import { getLocalizedSpecifications, getLocalizedVariety } from '@/lib/localizedContent';
import { localizedUrl } from '@/lib/metadata';
import type { InsightArticle, Locale, Product, Variety } from '@/types';

export const organizationId = `${company.baseUrl}/#organization`;
export const websiteId = `${company.baseUrl}/#website`;

// JSON data must remain inside its script even when content contains HTML.
export function serializeJsonLd(value: unknown) {
  const serialized = JSON.stringify(value);
  if (serialized === undefined) throw new TypeError('JSON-LD requires a JSON-serializable value.');
  return serialized.replace(/[<>&\u2028\u2029]/g, (character) => (
    `\\u${character.charCodeAt(0).toString(16).padStart(4, '0')}`
  ));
}

function absoluteUrl(path: string) {
  return new URL(path, `${company.baseUrl}/`).href;
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org', '@type': 'Organization', '@id': organizationId,
    name: company.name, legalName: company.legalName, url: company.baseUrl,
    logo: {
      '@type': 'ImageObject', '@id': `${company.baseUrl}/#logo`,
      url: absoluteUrl(company.logo), contentUrl: absoluteUrl(company.logo),
      caption: company.name,
    },
    slogan: company.slogan,
    image: `${company.baseUrl}/images/hero/pulses-export-warehouse-nilasya.jpg`,
    description: getCompanyFactLabels('en').description,
    email: company.email, telephone: company.phoneE164,
    address: {
      '@type': 'PostalAddress', streetAddress: 'Toros Mah. Barış Manço Bulvarı, Çukurova',
      addressLocality: 'Adana', addressCountry: 'TR',
    },
    foundingDate: String(company.establishedYear),
    founder: {
      '@type': 'Person', '@id': `${company.baseUrl}/#founder`,
      name: company.founder,
      jobTitle: company.founderTitleEn,
      image: `${company.baseUrl}${company.founderImage}`,
    },
    contactPoint: {
      '@type': 'ContactPoint', '@id': `${company.baseUrl}/#sales-contact`,
      telephone: company.phoneE164, email: company.email, contactType: 'sales',
      url: localizedUrl('en', 'contact'),
    },
    sameAs: [company.linkedin],
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteId,
    name: company.name,
    url: company.baseUrl,
    publisher: { '@id': organizationId },
    inLanguage: supportedLanguages.map(({ code }) => code),
  };
}

export interface WebPageSchemaOptions {
  type?: 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage' | 'FAQPage';
  image?: string;
  breadcrumb?: { '@id': string };
  mainEntity?: Record<string, unknown> | Record<string, unknown>[];
}

/** Connect each localized page to the same site and organization entities. */
export function webPageSchema(
  lang: Locale,
  pathname: string,
  name: string,
  description: string,
  options: WebPageSchemaOptions = {},
) {
  const url = localizedUrl(lang, pathname);
  return {
    '@context': 'https://schema.org', '@type': options.type || 'WebPage', '@id': `${url}#webpage`,
    url, name, description, inLanguage: lang,
    isPartOf: { '@id': websiteId },
    publisher: { '@id': organizationId },
    ...(options.breadcrumb ? { breadcrumb: { '@id': options.breadcrumb['@id'] } } : {}),
    ...(options.mainEntity ? { mainEntity: options.mainEntity } : {}),
    ...(options.image ? {
      primaryImageOfPage: {
        '@type': 'ImageObject', '@id': `${url}#primaryimage`,
        contentUrl: absoluteUrl(options.image), url: absoluteUrl(options.image),
      },
    } : {}),
  };
}

export interface CollectionSchemaItem {
  name: string;
  path: string;
  image?: string;
  description?: string;
  entityId?: string;
  type?: 'WebPage' | 'Product' | 'Article';
}

/** Use only entries that are actually visible in the page's collection. */
export function collectionPageSchema(
  lang: Locale,
  pathname: string,
  name: string,
  description: string,
  items: CollectionSchemaItem[],
  options: WebPageSchemaOptions = {},
) {
  const url = localizedUrl(lang, pathname);
  return webPageSchema(lang, pathname, name, description, {
    ...options,
    type: 'CollectionPage',
    mainEntity: {
      '@type': 'ItemList', '@id': `${url}#itemlist`,
      name, numberOfItems: items.length,
      itemListElement: items.map((entry, index) => {
        const itemUrl = localizedUrl(lang, entry.path);
        const type = entry.type || 'WebPage';
        const fragment = type === 'Product' ? 'product' : type === 'Article' ? 'article' : 'webpage';
        return {
          '@type': 'ListItem', position: index + 1,
          item: {
            '@type': type, '@id': entry.entityId || `${itemUrl}#${fragment}`,
            name: entry.name, url: itemUrl,
            ...(entry.description ? { description: entry.description } : {}),
            ...(entry.image ? { image: absoluteUrl(entry.image) } : {}),
          },
        };
      }),
    },
  });
}

export function faqSchema(faqItems: { question: string; answer: string }[], lang?: Locale, pathname?: string) {
  const url = lang && pathname !== undefined ? localizedUrl(lang, pathname) : undefined;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    ...(url ? {
      '@id': `${url}#webpage`, url, inLanguage: lang,
      isPartOf: { '@id': websiteId }, publisher: { '@id': organizationId },
    } : {}),
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
  const pagePath = items.at(-1)?.path || '';
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    '@id': `${localizedUrl(lang, pagePath)}#breadcrumb`,
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
  const url = localizedUrl(lang, path);
  const imagePaths = variety
    ? [variety.image, variety.heroImage, ...(variety.galleryImages || [])]
    : [product.heroImage, ...product.galleryImages];
  const images = Array.from(new Set(imagePaths.filter((image): image is string => Boolean(image))));
  return {
    '@context': 'https://schema.org', '@type': 'Product', '@id': `${url}#product`,
    name, description, url,
    mainEntityOfPage: { '@id': `${url}#webpage` },
    image: (images.length ? images : [product.heroImage]).map(absoluteUrl),
    productID: `${product.id}${variety ? `-${variety.id || varietySlug(variety)}` : ''}`,
    color: localizedVariety?.color || specifications.color,
    category: product.category[lang] || product.category.en,
    brand: { '@type': 'Brand', name: company.name },
    // Published specifications; no invented priced offer or live stock promise.
    additionalProperty: Object.entries(properties).filter(([, value]) => value).map(([name, value]) => ({ '@type': 'PropertyValue', name, value })),
  };
}

export function articleSchema(article: InsightArticle, lang: Locale) {
  const url = localizedUrl(lang, `insights/${article.slug}`);
  return {
    '@context': 'https://schema.org', '@type': 'Article', '@id': `${url}#article`,
    headline: article.title[lang] || article.title.en,
    description: article.excerpt[lang] || article.excerpt.en,
    image: [absoluteUrl(article.image)],
    url, mainEntityOfPage: { '@id': `${url}#webpage` }, inLanguage: lang,
    author: {
      '@type': 'Organization', '@id': `${company.baseUrl}/#international-trade-desk`,
      name: article.author, url: company.baseUrl,
      parentOrganization: { '@id': organizationId },
    },
    publisher: { '@id': organizationId },
    datePublished: article.publishedAt, dateModified: article.updatedAt,
    articleSection: article.category[lang] || article.category.en,
    keywords: article.tags,
  };
}
