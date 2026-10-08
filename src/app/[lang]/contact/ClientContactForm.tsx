'use client';

import React, { useId, useRef, useState } from 'react';
import { Locale } from '@/types';
import { Send, CheckCircle2 } from 'lucide-react';
import { createWhatsAppUrl, formatInquiry } from '@/data/company';

import { getPageTranslations } from '@/data/pageTranslations';
import { submitInquiry } from '@/lib/inquiries';
import { validateContact } from '@/lib/rfqValidation';
import type { FieldErrors } from '@/lib/rfqValidation';
import { FormFeedback, FormFieldError } from '@/components/rfq/FormFeedback';
import { InquiryConsent } from '@/components/rfq/InquiryConsent';
import { InquiryHoneypot } from '@/components/rfq/InquiryHoneypot';

export const ClientContactForm: React.FC<{ lang: Locale }> = ({ lang }) => {
  const pt = getPageTranslations(lang).contactPage;
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedRef, setGeneratedRef] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [consent, setConsent] = useState(false);
  const [websiteTrap, setWebsiteTrap] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const submitInFlight = useRef(false);
  const idPrefix = useId();
  const fieldId = (name: string) => `${idPrefix}-${name}`;
  const errorId = (name: string) => `${idPrefix}-${name}-error`;
  const fieldProps = (name: string) => ({
    id: fieldId(name), 'aria-invalid': errors[name] ? true as const : undefined,
    'aria-describedby': errors[name] ? errorId(name) : undefined,
    maxLength: name === 'message' ? 5000 : 254,
  });
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => { const next = { ...previous }; delete next[name]; return next; });
    setSubmitError('');
  };

  const whatsappHref = createWhatsAppUrl(formatInquiry(`Nilasya Agro Foods Contact Inquiry${generatedRef ? ` ${generatedRef}` : ''}`, {
    Name: formData.name, Company: formData.company, Email: formData.email,
    Phone: formData.phone, Subject: formData.subject, Message: formData.message, Language: lang,
  }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitInFlight.current) return;
    const nextErrors = validateContact(formData, lang);
    if (!consent) nextErrors.consent = lang === 'tr' ? 'Devam etmek i?in gizlilik bildirimini onaylay?n.' : 'Acknowledge the privacy notice to continue.';
    setErrors(nextErrors);
    const firstField = Object.keys(nextErrors)[0];
    if (firstField) { formRef.current?.querySelector<HTMLElement>(`[name="${firstField}"
            {...fieldProps('${firstField}')}]`)?.focus(); return; }
    submitInFlight.current = true;
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const result = await submitInquiry({ kind: 'contact', language: lang, data: { ...formData, consent, websiteTrap } });
      setGeneratedRef(result.referenceCode);
      setSubmitted(true);
    } catch {
      setSubmitError(lang === 'tr'
        ? 'Mesaj?n?z kaydedilemedi. L?tfen tekrar deneyin veya a?a??daki WhatsApp ba?lant?s?yla g?nderin.'
        : 'Your message could not be saved. Please retry or send it using the WhatsApp link below.');
    } finally {
      submitInFlight.current = false;
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-emerald-100 shadow-xl text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">
          {pt.successTitle}
        </h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          {pt.successDesc}
        </p>
        <p className="text-sm font-mono font-semibold text-emerald-900">{generatedRef}</p>
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-block text-sm font-semibold text-emerald-800 underline">
          {lang === 'tr' ? 'WhatsApp ile takip edin' : 'Follow up via WhatsApp'}
        </a>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      noValidate
      aria-busy={isSubmitting}
      onSubmit={handleSubmit}
      className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl space-y-4"
    >
      <FormFeedback errors={errors} submitError={submitError} lang={lang} />
      <InquiryHoneypot value={websiteTrap} onChange={setWebsiteTrap} />
      <h3 className="text-xl font-bold text-slate-900 mb-2">
        {pt.formTitle}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={fieldId('name')} className="block text-xs font-bold text-slate-700 mb-1">
            {pt.nameLabel}
          </label>
          <input
            type="text"
            name="name"
            {...fieldProps('name')}
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          <FormFieldError error={errors.name} id={errorId('name')} />
        </div>
        <div>
          <label htmlFor={fieldId('company')} className="block text-xs font-bold text-slate-700 mb-1">
            {pt.companyLabel}
          </label>
          <input
            type="text"
            name="company"
            {...fieldProps('company')}
            required
            value={formData.company}
            onChange={handleChange}
            placeholder="Global Import Ltd."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          <FormFieldError error={errors.company} id={errorId('company')} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={fieldId('email')} className="block text-xs font-bold text-slate-700 mb-1">
            {pt.emailFormLabel}
          </label>
          <input
            type="email"
            name="email"
            {...fieldProps('email')}
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="buyer@company.com"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          <FormFieldError error={errors.email} id={errorId('email')} />
        </div>
        <div>
          <label htmlFor={fieldId('phone')} className="block text-xs font-bold text-slate-700 mb-1">
            {pt.phoneFormLabel}
          </label>
          <input
            type="tel"
            name="phone"
            {...fieldProps('phone')}
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="+49 170 1234567"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          <FormFieldError error={errors.phone} id={errorId('phone')} />
        </div>
      </div>

      <div>
        <label htmlFor={fieldId('subject')} className="block text-xs font-bold text-slate-700 mb-1">
          {pt.subjectLabel}
        </label>
        <select
          name="subject"
            {...fieldProps('subject')}
          value={formData.subject}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        >
          <option value="">{pt.subjectPlaceholder}</option>
          <option value="Turkish Chickpeas (Koçbaşı)">Turkish Kabuli Chickpeas (Koçbaşı 8mm-10mm)</option>
          <option value="Turkish Red Lentils">Turkish Red Lentils (Football & Split)</option>
          <option value="Turkish Green Lentils">Turkish Green Lentils (Laird 6-7mm & Eston)</option>
          <option value="Turkish White Beans">Turkish White Beans (Dermason & Horoz)</option>
          <option value="Turkish Durum Wheat & Bulgur">Turkish Durum Wheat & Bulgur (Pilaf & Fine)</option>
          <option value="Turkish Dry Peas">Turkish Dry Peas (Yellow & Green Split)</option>
          <option value="Turkish Durum Wheat Pasta">Turkish Durum Wheat Pasta & Macaroni (Spaghetti, Penne, Fusilli)</option>
          <option value="Specialty Pulses & Seeds">Specialty Pulses & Seeds (Fava Beans, Black-eyed Peas, Sesame)</option>
          <option value="General B2B Partnership">General B2B Import & Export Partnership</option>
        </select>
          <FormFieldError error={errors.subject} id={errorId('subject')} />
      </div>

      <div>
        <label htmlFor={fieldId('message')} className="block text-xs font-bold text-slate-700 mb-1">
          {pt.messageLabel}
        </label>
        <textarea
          name="message"
            {...fieldProps('message')}
          rows={4}
          required
          value={formData.message}
          onChange={handleChange}
          placeholder={pt.messagePlaceholder}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />
          <FormFieldError error={errors.message} id={errorId('message')} />
      </div>

      <InquiryConsent lang={lang} id={fieldId('consent')} checked={consent} onChange={setConsent} errorId={errorId('consent')} invalid={!!errors.consent} />
      <FormFieldError error={errors.consent} id={errorId('consent')} />
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm tracking-wider uppercase rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
      >
        <Send className="w-4 h-4" />
        <span>{isSubmitting ? (lang === 'tr' ? 'G?nderiliyor?' : 'Sending?') : pt.submitBtn}</span>
      </button>
      {submitError && (
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800">
          {lang === 'tr' ? 'WhatsApp ile g?nder' : 'Send via WhatsApp'}
        </a>
      )}
    </form>
  );
};
