'use client';

import React from 'react';
import { Product, Locale } from '@/types';

import { getPageTranslations } from '@/data/pageTranslations';

interface ProductSpecsTableProps {
  product: Product;
  lang: Locale;
}

export const ProductSpecsTable: React.FC<ProductSpecsTableProps> = ({ product, lang }) => {
  const specs = product.specifications;
  const pt = getPageTranslations(lang).productDetail;

  const rows = [
    { label: pt.varietiesTitle, value: specs.variety },
    { label: pt.originBasins, value: lang === 'tr' ? specs.originTr : specs.origin },
    { label: pt.caliberDiameter, value: `${specs.caliber} (${specs.size})` },
    { label: lang === 'tr' ? 'Kabuk / Renk Skalası' : 'Color Index', value: lang === 'tr' ? specs.colorTr : specs.color },
    { label: pt.brixSugar, value: specs.brix },
    { label: pt.commercialGrade, value: specs.class },
    { label: pt.unitWeight, value: specs.weight },
    { label: pt.optimumTemp, value: specs.storageTemp },
    { label: pt.humidity, value: specs.optimalHumidity },
    { label: pt.maxPostHarvest, value: lang === 'tr' ? specs.shelfLifeTr : specs.shelfLife },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200">
      <h3 className="text-2xl font-black text-slate-900 mb-6">
        {pt.specsTitle}
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                <th
                  scope="row"
                  className="py-3.5 px-4 font-bold text-slate-700 w-1/3 bg-slate-50/50 rounded-l-xl"
                >
                  {row.label}
                </th>
                <td className="py-3.5 px-4 font-medium text-slate-900 rounded-r-xl">
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
