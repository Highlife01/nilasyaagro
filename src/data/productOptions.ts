import { Locale, Product } from '@/types';

export interface ProductCaliberOption {
  value: string;
  label: string;
}

export const getProductCaliberOptions = (product: Product, lang: Locale): ProductCaliberOption[] => {
  const language = lang === 'tr' ? 'tr' : 'en';
  const options: ProductCaliberOption[] = [
    {
      value: `overall:${product.id}`,
      label: `${language === 'tr' ? 'Genel ticari aralık' : 'Overall commercial range'} — ${product.specifications.size} / ${product.specifications.caliber}`,
    },
  ];

  product.varieties.forEach((variety) => {
    const varietyName = language === 'tr' ? variety.nameTr || variety.name : variety.name;
    options.push({
      value: `${product.id}:${variety.name}:${variety.size}`,
      label: `${varietyName} — ${variety.size}`,
    });
  });

  return Array.from(new Map(options.map((option) => [option.value, option])).values());
};
