import { Product, Locale } from '@/types';
import { ShieldCheck } from 'lucide-react';
import { getPageTranslations } from '@/data/pageTranslations';
import { getLocalizedSpecifications } from '@/lib/localizedContent';

interface ProductSpecsTableProps { product: Product; lang: Locale; }

export function ProductSpecsTable({ product, lang }: ProductSpecsTableProps) {
  const specs = getLocalizedSpecifications(product, lang);
  const pt = getPageTranslations(lang).productDetail;
  const labels = pt.specificationLabels;
  const rows = [
    { label: labels.variety, value: specs.variety },
    { label: labels.origin, value: specs.origin },
    { label: labels.caliber, value: specs.caliber && specs.size ? `${specs.caliber} (${specs.size})` : specs.caliber || specs.size },
    { label: labels.color, value: specs.color },
    { label: pt.moistureLabel, value: specs.moisture },
    { label: pt.purityLabel, value: specs.purity },
    { label: pt.proteinLabel, value: specs.protein },
    { label: labels.foreignMatter, value: specs.foreignMatter },
    { label: labels.broken, value: specs.broken },
    { label: labels.damaged, value: specs.damaged },
    { label: labels.class, value: specs.class },
    { label: labels.storageTemp, value: specs.storageTemp },
    { label: labels.optimalHumidity, value: specs.optimalHumidity },
    { label: labels.shelfLife, value: specs.shelfLife },
  ].filter(row => Boolean(row.value));

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-10">
      <div className="mb-6 flex flex-col justify-between gap-3 border-b border-slate-100 pb-6 sm:flex-row sm:items-center">
        <h2 className="flex items-center gap-2 text-2xl font-black text-slate-900">
          <ShieldCheck className="h-5 w-5 text-emerald-600" aria-hidden="true" />{pt.specsTitle}
        </h2>
        {specs.purity && <span className="self-start rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-800">{pt.purityLabel}: {specs.purity}</span>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-start text-xs sm:text-sm">
          <caption className="sr-only">{product.name[lang] || product.name.en}: {pt.specsTitle}</caption>
          <tbody className="divide-y divide-slate-100">
            {rows.map(row => <tr key={row.label} className="transition-colors hover:bg-slate-50/80">
              <th scope="row" className="w-2/5 bg-slate-50/50 px-4 py-3.5 text-start font-bold text-slate-700 sm:w-1/3">{row.label}</th>
              <td className="px-4 py-3.5 font-semibold text-slate-900">{row.value}</td>
            </tr>)}
          </tbody>
        </table>
      </div>
      <p className="mt-5 text-xs leading-relaxed text-slate-500">{pt.specificationsNote}</p>
    </section>
  );
}
