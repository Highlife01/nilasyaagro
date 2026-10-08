import type { FieldErrors } from '@/lib/rfqValidation';
import type { Locale } from '@/types';

export function FormFieldError({ error, id }: { error?: string; id: string }) {
  return error ? <p id={id} className="mt-1 text-sm font-medium text-red-700">{error}</p> : null;
}

export function FormFeedback({ errors, submitError, lang }: { errors: FieldErrors; submitError?: string; lang: Locale }) {
  if (!Object.keys(errors).length && !submitError) return null;
  return (
    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
      {submitError || (lang === 'tr' ? 'İşaretli alanları kontrol edin ve tekrar deneyin.' : 'Check the highlighted fields and try again.')}
    </div>
  );
}
