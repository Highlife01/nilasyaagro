import { FAQItem, Locale, Product, Variety } from '@/types';

/** Keep route titles, body copy and cards on the same localized variety. */
export function getLocalizedVariety(variety: Variety, lang: Locale): Variety {
  if (lang === 'tr') {
    return {
      ...variety,
      name: variety.nameTr || variety.name,
      description: variety.descriptionTr || variety.description,
      tagline: variety.taglineTr || variety.tagline,
      color: variety.colorTr || variety.color,
      harvestMonths: variety.harvestMonthsTr || variety.harvestMonths,
      storage: variety.storageTr || variety.storage,
      shelfLife: variety.shelfLifeTr || variety.shelfLife,
      characteristics: variety.characteristicsTr || variety.characteristics,
      packagingTypes: variety.packagingTypesTr || variety.packagingTypes,
    };
  }
  return { ...variety, ...variety.localized?.[lang] };
}

export function getLocalizedFAQ(faq: FAQItem, lang: Locale): { question: string; answer: string } {
  if (lang === 'tr') return { question: faq.questionTr || faq.question, answer: faq.answerTr || faq.answer };
  return faq.localized?.[lang] || faq;
}

export function getLocalizedSpecifications(product: Product, lang: Locale) {
  const specs = product.specifications;
  if (lang === 'tr') return { ...specs, origin: specs.originTr || specs.origin, color: specs.colorTr || specs.color, shelfLife: specs.shelfLifeTr || specs.shelfLife };
  return { ...specs, ...specs.localized?.[lang] };
}
