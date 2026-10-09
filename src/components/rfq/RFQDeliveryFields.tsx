import type { ChangeEvent } from 'react';
import type { Locale, RFQSubmission } from '@/types';
import { deliveryDateBounds } from '@/lib/rfqValidation';
import type { FieldErrors } from '@/lib/rfqValidation';
import { FormFieldError } from './FormFeedback';

type FieldProps = { id: string; 'aria-invalid': true | undefined; 'aria-describedby': string | undefined; maxLength: number };
export function RFQDeliveryFields({ lang, formData, errors, fieldProps, fieldId, errorId, onChange }: {
  lang: Locale; formData: Partial<RFQSubmission>; errors: FieldErrors;
  fieldProps: (name: string) => FieldProps; fieldId: (name: string) => string; errorId: (name: string) => string;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}) {
  const bounds = deliveryDateBounds();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label htmlFor={fieldId('deliveryAddress')} className="block text-sm font-semibold text-slate-800 mb-1.5">
          {lang === 'tr' ? 'Teslim adresi (liman yerine)' : 'Delivery address (as an alternative to port)'}
        </label>
        <input type="text" name="deliveryAddress" {...fieldProps('deliveryAddress')} value={formData.deliveryAddress || ''} onChange={onChange}
          autoComplete="street-address" className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
        <FormFieldError error={errors.deliveryAddress} id={errorId('deliveryAddress')} />
      </div>
      <div>
        <label htmlFor={fieldId('requestedDeliveryDate')} className="block text-sm font-semibold text-slate-800 mb-1.5">
          {lang === 'tr' ? 'İstenen teslim tarihi' : 'Desired delivery date'}
        </label>
        <input type="date" name="requestedDeliveryDate" {...fieldProps('requestedDeliveryDate')} min={bounds.min} max={bounds.max} required
          value={formData.requestedDeliveryDate || ''} onChange={onChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
        <FormFieldError error={errors.requestedDeliveryDate} id={errorId('requestedDeliveryDate')} />
      </div>
    </div>
  );
}
