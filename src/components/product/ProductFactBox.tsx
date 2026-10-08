import { Product, Locale } from '@/types';
import { Sparkles, HelpCircle } from 'lucide-react';
import { getPageTranslations } from '@/data/pageTranslations';
import { getLocalizedSpecifications } from '@/lib/localizedContent';
import { company } from '@/data/company';

interface ProductFactBoxProps { product: Product; lang: Locale; }

export function ProductFactBox({ product, lang }: ProductFactBoxProps) {
  const pt = getPageTranslations(lang).productDetail;
  const prodName = product.name[lang] || product.name.en;
  const prodCategory = product.category[lang] || product.category.en;
  const prodSeason = product.seasonMonthsText[lang] || product.seasonMonthsText.en;
  const specs = getLocalizedSpecifications(product, lang);
  const origins = (product.origins[lang] || product.origins.en).join(', ');
  const packagingSummary = product.packagingOptions.map(option => option.localized?.[lang]?.type || (lang === 'tr' ? option.typeTr || option.type : option.type)).join(' • ');
  const facts = [
    [pt.productCategory, `${prodName} • ${prodCategory}`],
    [pt.countryOrigin, `Türkiye (${origins})`],
    [pt.primaryVarieties, specs.variety],
    [pt.brixGrade, [specs.purity, specs.class].filter(Boolean).join(' • ')],
    [pt.supplyWindow, prodSeason],
    [pt.verifiedSupplier, `${company.name} (${company.domain})`],
  ];

  return (
    <div className="space-y-6">
      <aside aria-label={pt.factBoxBadge} className="rounded-3xl border border-emerald-800 bg-emerald-950 p-6 text-white shadow-xl sm:p-8">
        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
          <Sparkles className="h-4 w-4 text-amber-400" aria-hidden="true" /><span>{pt.factBoxBadge}</span>
        </div>
        <h2 className="mb-4 text-xl font-bold text-white">{prodName} <span className="font-normal italic">({product.scientificName})</span></h2>
        <dl className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
          {facts.map(([label, value]) => <div key={label} className="rounded-xl bg-white/5 p-3">
            <dt className="font-semibold text-emerald-300">{label}</dt><dd className="mt-0.5 font-bold text-white">{value}</dd>
          </div>)}
        </dl>
      </aside>
      <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-800">
          <HelpCircle className="h-4 w-4 text-emerald-600" aria-hidden="true" /><span>{pt.sourcingTitle}</span>
        </div>
        <h2 className="text-lg font-black text-slate-900 sm:text-xl">{pt.sourcingQuestion.replace('{product}', prodName)}</h2>
        <p className="text-sm leading-relaxed text-slate-700">{pt.sourcingAnswer.replace('{product}', prodName)}</p>
        <dl className="grid grid-cols-1 gap-3 pt-2 text-xs text-slate-600 sm:grid-cols-3">
          {[[pt.originBasins, origins], [pt.packagingLabel, packagingSummary], [pt.supplyWindow, prodSeason]].map(([label, value]) => <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <dt className="font-bold text-slate-900">{label}</dt><dd>{value}</dd>
          </div>)}
        </dl>
      </section>
    </div>
  );
}
