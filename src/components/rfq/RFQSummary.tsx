import type { Locale, RFQSubmission } from '@/types';
import { getTranslations } from '@/data/translations';
import { productsData } from '@/data/products';
import { packagingData } from '@/data/packaging';
import { getProductCaliberOptions } from '@/data/productOptions';

export function RFQSummary({ lang, values }: { lang: Locale; values: Partial<RFQSubmission> }) {
  const t = getTranslations(lang).rfq;
  const product = productsData.find((item) => item.id === values.product);
  const variety = product?.varieties.find((item) => item.name === values.variety);
  const packaging = packagingData.find((item) => item.id === values.packaging);
  const rows = [
    [t.productLabel, product?.name[lang] || product?.name.en],
    [t.varietyLabel, values.variety === 'recommendation' ? (lang === 'tr' ? 'Tedarikçi önerisi' : 'Supplier recommendation') : lang === 'tr' ? variety?.nameTr || variety?.name : variety?.name],
    [lang === 'tr' ? 'Teknik özellik / kalibre' : 'Technical specification / caliber', product ? getProductCaliberOptions(product, lang).find((item) => item.value === values.caliber)?.label : ''],
    [t.quantityLabel, `${values.quantity || ''} ${values.unit || ''}`],
    [t.packagingLabel, packaging?.name[lang === 'tr' ? 'tr' : 'en']],
    [t.destCountryLabel, values.destinationCountry], [t.destCityLabel, values.destinationCity],
    [t.destPortLabel, values.destinationPort],
    [lang === 'tr' ? 'Teslim adresi' : 'Delivery address', values.deliveryAddress],
    [t.incotermLabel, values.incoterm],
    [lang === 'tr' ? 'İstenen teslim tarihi' : 'Desired delivery date', values.requestedDeliveryDate],
    [t.companyNameLabel, values.companyName], [t.websiteLabel, values.website],
    [t.contactPersonLabel, values.contactPerson], [t.emailLabel, values.email], [t.phoneLabel, values.phone], [t.messageLabel, values.message],
  ];
  return (
    <section aria-label={lang === 'tr' ? 'Başvuru özeti' : 'Inquiry summary'} className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
      <h3 className="text-sm font-bold text-emerald-950">{lang === 'tr' ? 'Göndermeden önce başvurunuzu kontrol edin' : 'Review your inquiry before sending'}</h3>
      <dl className="mt-3 grid gap-2 text-sm">
        {rows.map(([label, value]) => <div key={label} className="grid sm:grid-cols-2 gap-1"><dt className="font-medium text-slate-700">{label}</dt><dd className="break-words whitespace-pre-wrap text-slate-900">{value || '—'}</dd></div>)}
      </dl>
      <p className="mt-3 text-xs text-slate-600">{lang === 'tr' ? 'Düzenlemek için önceki adımlara dönebilirsiniz.' : 'You can return to earlier steps to edit your selections.'}</p>
    </section>
  );
}
