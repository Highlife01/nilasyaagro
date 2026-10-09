'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { Locale, RFQSubmission } from '@/types';
import { productsData } from '@/data/products';
import { packagingData } from '@/data/packaging';
import { createWhatsAppUrl, formatInquiry } from '@/data/company';
import { ApiError, inquirySourcePage, submitInquiry } from '@/lib/inquiries';
import { initialRfqData, inquiryFieldLimits, rfqFieldSteps, rfqIncoterms, validateRfq } from '@/lib/rfqValidation';
import { getProductCaliberOptions } from '@/data/productOptions';
import { trackEvent } from '@/lib/analytics';
import type { FieldErrors } from '@/lib/rfqValidation';

const draftKey = 'nilasya-rfq-draft-v1';
// Only catalog choices and bounded numeric quantity are saved. Personal data,
// addresses, destination and free text remain in memory until submission.
function safeDraft(values?: Partial<RFQSubmission>): Partial<RFQSubmission> {
  if (!values) return {};
  const product = productsData.find((item) => item.id === values.product);
  const draft: Partial<RFQSubmission> = {};
  if (product) {
    draft.product = product.id;
    if (values.variety === 'recommendation' || product.varieties.some((item) => item.name === values.variety)) draft.variety = values.variety;
    if (getProductCaliberOptions(product, 'en').some((item) => item.value === values.caliber)) draft.caliber = values.caliber;
  }
  if (typeof values.quantity === 'string' && /^\d{1,7}(?:[.,]\d{1,3})?$/u.test(values.quantity) && Number(values.quantity.replace(',', '.')) > 0 && Number(values.quantity.replace(',', '.')) <= 1000000) draft.quantity = values.quantity;
  if (values.unit && (['MT', 'kg', 'container'] as readonly string[]).includes(values.unit)) draft.unit = values.unit;
  if (values.packaging && packagingData.some((item) => item.id === values.packaging)) draft.packaging = values.packaging;
  if (values.incoterm && (rfqIncoterms as readonly string[]).includes(values.incoterm)) draft.incoterm = values.incoterm;
  return draft;
}

export function useRFQForm(lang: Locale, preselectedProduct?: string, active = true) {
  const initialProduct = productsData.some((product) => product.id === preselectedProduct) ? preselectedProduct : '';
  const [formData, setFormData] = useState<Partial<RFQSubmission>>(() => initialRfqData(initialProduct));
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedRef, setGeneratedRef] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [consent, updateConsent] = useState(false);
  const [websiteTrap, setWebsiteTrap] = useState('');
  const [draftReady, setDraftReady] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const submitInFlight = useRef(false);
  const requestId = useRef<string | undefined>(undefined);
  const started = useRef(false);
  const viewed = useRef(false);
  const idPrefix = useId();

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const stored = JSON.parse(sessionStorage.getItem(draftKey) || 'null') as { version?: number; data?: Partial<RFQSubmission> } | null;
        if (stored?.version === 1 && stored.data && typeof stored.data === 'object') setFormData((previous) => ({ ...previous, ...safeDraft(stored.data), ...(initialProduct ? { product: initialProduct, variety: '', caliber: `overall:${initialProduct}` } : {}) }));
      } catch { /* Optional draft storage. */ }
      setDraftReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [initialProduct]);
  useEffect(() => {
    if (!draftReady || isSuccess) return;
    try { sessionStorage.setItem(draftKey, JSON.stringify({ version: 1, data: safeDraft(formData) })); }
    catch { /* Restricted browser storage must not block the form. */ }
  }, [formData, draftReady, isSuccess]);
  useEffect(() => {
    if (active && !viewed.current) { trackEvent('rfq_view', { step: 1 }); viewed.current = true; }
    else if (!active) viewed.current = false;
  }, [active]);

  const start = () => {
    if (!started.current) { trackEvent('rfq_start', { product_slug: formData.product, step: currentStep }); started.current = true; }
  };
  const fieldProps = (name: string) => ({ id: `${idPrefix}-${name}`, 'aria-invalid': errors[name] ? true as const : undefined, 'aria-describedby': errors[name] ? `${idPrefix}-${name}-error` : undefined, maxLength: inquiryFieldLimits[name] || 250 });
  const fieldId = (name: string) => `${idPrefix}-${name}`;
  const errorId = (name: string) => `${idPrefix}-${name}-error`;
  const setConsent = (checked: boolean) => {
    requestId.current = undefined; updateConsent(checked);
    setErrors((previous) => { const next = { ...previous }; delete next.consent; return next; });
    setSubmitError('');
  };
  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    start(); requestId.current = undefined;
    setGeneratedRef('');
    setFormData((previous) => name === 'product' ? { ...previous, product: value, variety: '', caliber: value ? `overall:${value}` : '' } : { ...previous, [name]: value });
    if (name === 'product') trackEvent('rfq_product_selected', { product_slug: value, step: 1 });
    setErrors((previous) => { const next = { ...previous }; delete next[name]; if (name === 'product') { delete next.variety; delete next.caliber; } if (name === 'unit') delete next.quantity; if (name === 'deliveryAddress') delete next.destinationPort; return next; });
    setSubmitError('');
  };
  const showErrors = (nextErrors: FieldErrors) => {
    setErrors(nextErrors);
    const firstField = Object.keys(nextErrors)[0];
    if (!firstField) return false;
    for (const field of Object.keys(nextErrors)) trackEvent('rfq_validation_error', { product_slug: formData.product, step: rfqFieldSteps[field] || currentStep, field, error_code: 'validation' });
    setCurrentStep(rfqFieldSteps[firstField] || 1);
    requestAnimationFrame(() => { formRef.current?.querySelector<HTMLElement>(`[name="${firstField}"]`)?.focus(); });
    return true;
  };
  const focusFirstField = () => requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('select, input:not([tabindex="-1"]), textarea')?.focus());
  const handleNext = () => {
    start(); if (showErrors(validateRfq(formData, lang, currentStep))) return;
    trackEvent('rfq_step_completed', { product_slug: formData.product, step: currentStep });
    setCurrentStep((previous) => Math.min(previous + 1, 5)); focusFirstField();
  };
  const handlePrev = () => { setErrors({}); setSubmitError(''); setCurrentStep((previous) => Math.max(previous - 1, 1)); focusFirstField(); };
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault(); if (submitInFlight.current) return;
    if (currentStep < 5) { handleNext(); return; }
    start(); const allErrors = validateRfq(formData, lang);
    if (!consent) allErrors.consent = lang === 'tr' ? 'Devam etmek için gizlilik bildirimini onaylayın.' : 'Acknowledge the privacy notice to continue.';
    if (showErrors(allErrors)) return;
    submitInFlight.current = true; setIsSubmitting(true); setSubmitError('');
    try {
      requestId.current ||= crypto.randomUUID();
      const result = await submitInquiry({ kind: 'rfq', language: lang, data: { ...formData, consent, websiteTrap }, requestId: requestId.current, metadata: inquirySourcePage() });
      setGeneratedRef(result.referenceCode); setIsSuccess(true);
      try { sessionStorage.removeItem(draftKey); } catch { /* Optional storage. */ }
      trackEvent('rfq_step_completed', { product_slug: formData.product, step: 5 }); trackEvent('rfq_submit_success', { product_slug: formData.product, step: 5 });
    } catch (error) {
      const pending = error instanceof ApiError && error.details?.saved;
      const reference = error instanceof ApiError ? error.details?.referenceCode : undefined;
      if (reference) setGeneratedRef(reference);
      setSubmitError(pending ? (lang === 'tr' ? `Başvurunuz ${reference || ''} referansıyla kaydedildi; bildirim gönderilemedi. Aynı başvuruyu tekrar deneyin veya WhatsApp ile takip edin.` : `Your inquiry was saved with reference ${reference || ''}; notification could not be sent. Retry the same inquiry or follow up via WhatsApp.`) : (lang === 'tr' ? 'Başvurunuz şu anda işlenemedi. Lütfen tekrar deneyin veya WhatsApp üzerinden iletişime geçin.' : 'Your inquiry could not be processed right now. Please retry or contact us via WhatsApp.'));
      trackEvent('rfq_submit_error', { product_slug: formData.product, step: 5, error_code: pending ? 'delivery_pending' : error instanceof ApiError && error.status === 429 ? 'rate_limit' : 'network' });
    } finally { submitInFlight.current = false; setIsSubmitting(false); }
  };
  const whatsappHref = createWhatsAppUrl(formatInquiry(`Nilasya Agro Foods RFQ${generatedRef ? ` ${generatedRef}` : ''}`, {
    Product: formData.product, Variety: formData.variety, Caliber: formData.caliber, Quantity: `${formData.quantity || ''} ${formData.unit || ''}`, Packaging: formData.packaging,
    Destination: `${formData.destinationCity || ''}, ${formData.destinationCountry || ''}`, Port: formData.destinationPort, 'Delivery address': formData.deliveryAddress, 'Desired delivery date': formData.requestedDeliveryDate,
    Incoterm: formData.incoterm, Company: formData.companyName, Website: formData.website, Contact: formData.contactPerson, Email: formData.email, Phone: formData.phone, Message: formData.message, Language: lang,
  }));
  return { formData, currentStep, isSubmitting, isSuccess, generatedRef, errors, submitError, formRef, fieldProps, fieldId, errorId, handleInputChange, handleNext, handlePrev, handleSubmit, whatsappHref, consent, setConsent, websiteTrap, setWebsiteTrap };
}
