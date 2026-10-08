'use client';

import { useId, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { Locale, RFQSubmission } from '@/types';
import { productsData } from '@/data/products';
import { createWhatsAppUrl, formatInquiry } from '@/data/company';
import { submitInquiry } from '@/lib/inquiries';
import { initialRfqData, rfqFieldSteps, validateRfq } from '@/lib/rfqValidation';
import type { FieldErrors } from '@/lib/rfqValidation';

export function useRFQForm(lang: Locale, preselectedProduct?: string) {
  const initialProduct = productsData.some((product) => product.id === preselectedProduct) ? preselectedProduct : 'chickpeas';
  const [formData, setFormData] = useState<Partial<RFQSubmission>>(() => initialRfqData(initialProduct));
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedRef, setGeneratedRef] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [consent, setConsent] = useState(false);
  const [websiteTrap, setWebsiteTrap] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const submitInFlight = useRef(false);
  const idPrefix = useId();

  const fieldProps = (name: string) => ({
    id: `${idPrefix}-${name}`,
    'aria-invalid': errors[name] ? true as const : undefined,
    'aria-describedby': errors[name] ? `${idPrefix}-${name}-error` : undefined,
    maxLength: name === 'message' ? 5000 : name === 'website' ? 2048 : 254,
  });
  const fieldId = (name: string) => `${idPrefix}-${name}`;
  const errorId = (name: string) => `${idPrefix}-${name}-error`;

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => name === 'product'
      ? { ...previous, product: value, variety: '', caliber: 'recommendation' }
      : { ...previous, [name]: value });
    setErrors((previous) => { const next = { ...previous }; delete next[name]; return next; });
    setSubmitError('');
  };

  const showErrors = (nextErrors: FieldErrors) => {
    setErrors(nextErrors);
    const firstField = Object.keys(nextErrors)[0];
    if (!firstField) return false;
    setCurrentStep(rfqFieldSteps[firstField] || 1);
    requestAnimationFrame(() => {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstField}"]`)?.focus();
    });
    return true;
  };

  const handleNext = () => {
    if (showErrors(validateRfq(formData, lang, currentStep))) return;
    setCurrentStep((previous) => Math.min(previous + 1, 5));
  };
  const handlePrev = () => {
    setErrors({});
    setSubmitError('');
    setCurrentStep((previous) => Math.max(previous - 1, 1));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitInFlight.current) return;
    if (currentStep < 5) { handleNext(); return; }
    const allErrors = validateRfq(formData, lang);
    if (!consent) allErrors.consent = lang === 'tr' ? 'Devam etmek için gizlilik bildirimini onaylayın.' : 'Acknowledge the privacy notice to continue.';
    if (showErrors(allErrors)) return;
    submitInFlight.current = true;
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const result = await submitInquiry({ kind: 'rfq', language: lang, data: { ...formData, consent, websiteTrap } });
      setGeneratedRef(result.referenceCode);
      setIsSuccess(true);
    } catch {
      setSubmitError(lang === 'tr'
        ? 'Teklifiniz kaydedilemedi. Lütfen tekrar deneyin veya aşağıdaki WhatsApp bağlantısıyla mesajınızı gönderin.'
        : 'Your RFQ could not be saved. Please retry or send your message using the WhatsApp link below.');
    } finally {
      submitInFlight.current = false;
      setIsSubmitting(false);
    }
  };

  const whatsappHref = createWhatsAppUrl(formatInquiry(`Nilasya Agro Foods RFQ${generatedRef ? ` ${generatedRef}` : ''}`, {
    Product: formData.product, Variety: formData.variety, Caliber: formData.caliber,
    Quantity: `${formData.quantity || ''} ${formData.unit || ''}`, Packaging: formData.packaging,
    Destination: `${formData.destinationCity || ''}, ${formData.destinationCountry || ''}`,
    Port: formData.destinationPort, Incoterm: formData.incoterm, Company: formData.companyName,
    Website: formData.website, Contact: formData.contactPerson, Email: formData.email,
    Phone: formData.phone, Message: formData.message, Language: lang,
  }));

  return { formData, currentStep, isSubmitting, isSuccess, generatedRef, errors, submitError,
    formRef, fieldProps, fieldId, errorId, handleInputChange, handleNext, handlePrev, handleSubmit, whatsappHref,
    consent, setConsent, websiteTrap, setWebsiteTrap };
}
