import Link from 'next/link';
import type { Locale } from '@/types';

export function InquiryConsent({ lang, id, checked, onChange, errorId, invalid }: {
  lang: Locale; id: string; checked: boolean; onChange: (checked: boolean) => void; errorId: string; invalid?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 text-sm text-slate-600">
      <input id={id} name="consent" type="checkbox" required checked={checked}
        onChange={(event) => onChange(event.target.checked)} aria-invalid={invalid || undefined}
        aria-describedby={invalid ? errorId : undefined} className="mt-1 h-4 w-4 shrink-0 accent-emerald-700" />
      <label htmlFor={id}>
        {lang === 'tr' ? 'Talebime yanıt verilmesi amacıyla bilgilerimin işlenmesini kabul ediyorum. ' : 'I agree to the processing of my details to respond to this inquiry. '}
        <Link href={`/${lang}/privacy-policy/`} target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-800 underline">
          {lang === 'tr' ? 'Gizlilik bildirimi' : 'Privacy notice'}
        </Link>
      </label>
    </div>
  );
}
