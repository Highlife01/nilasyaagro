'use client';

import React, { useRef } from 'react';
import { X, CheckCircle, ArrowRight, ArrowLeft, ShieldCheck, Clock, Send, Sparkles } from 'lucide-react';
import { Locale } from '@/types';
import { getTranslations } from '@/data/translations';
import { productsData } from '@/data/products';
import { getProductCaliberOptions } from '@/data/productOptions';
import { packagingData } from '@/data/packaging';
import { useRFQForm } from '@/components/rfq/useRFQForm';
import { FormFeedback, FormFieldError } from '@/components/rfq/FormFeedback';
import { InquiryConsent } from '@/components/rfq/InquiryConsent';
import { InquiryHoneypot } from '@/components/rfq/InquiryHoneypot';
import { RFQDeliveryFields } from '@/components/rfq/RFQDeliveryFields';
import { RFQSummary } from '@/components/rfq/RFQSummary';
import { useDialogFocus } from '@/components/ui/useDialogFocus';

interface RFQModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Locale;
  preselectedProduct?: string;
}

export const RFQModal: React.FC<RFQModalProps> = ({
  isOpen,
  onClose,
  lang,
  preselectedProduct,
}) => {
  const t = getTranslations(lang).rfq;
  const { formData, currentStep, isSubmitting, isSuccess, generatedRef, errors, submitError,
    formRef, fieldProps, fieldId, errorId, handleInputChange, handleNext, handlePrev, handleSubmit, whatsappHref,
    consent, setConsent, websiteTrap, setWebsiteTrap,
  } = useRFQForm(lang, preselectedProduct, isOpen);
  const dialogRef = useRef<HTMLDivElement>(null);

  useDialogFocus(isOpen, dialogRef, onClose);

  if (!isOpen) return null;

  const resetForm = onClose;

  const selectedProductObj = productsData.find((p) => p.id === formData.product);

  return (
    <div ref={dialogRef} className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={resetForm}
      />

      {/* Modal Card */}
      <div role="dialog" aria-modal="true" tabIndex={-1} aria-labelledby="rfq-dialog-title" className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 border border-emerald-900/10 my-auto">
        {/* Header Strip */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">
                NILASYA AGRO FOODS • B2B EXPORT DESK
              </span>
            </div>
            <h3 id="rfq-dialog-title" className="text-xl font-bold text-white mt-1">{t.modalTitle}</h3>
          </div>
          <button
            onClick={resetForm}
            className="text-emerald-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label={t.closeBtn}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Step Progress Indicator (when not finished) */}
        {!isSuccess && (
          <div className="bg-emerald-50/70 border-b border-emerald-100 px-6 py-3" role="progressbar" aria-label={lang === 'tr' ? 'Başvuru ilerlemesi' : 'Inquiry progress'} aria-valuemin={1} aria-valuemax={5} aria-valuenow={currentStep}>
            <div className="flex items-center justify-between max-w-lg mx-auto">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      currentStep === step
                        ? 'bg-emerald-700 text-white ring-4 ring-emerald-200'
                        : currentStep > step
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {currentStep > step ? '✓' : step}
                  </div>
                  {step < 5 && (
                    <div
                      className={`w-8 sm:w-14 h-0.5 mx-1 transition-colors ${
                        currentStep > step ? 'bg-emerald-600' : 'bg-emerald-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-2 text-xs font-semibold text-emerald-900 uppercase tracking-wider">
              {currentStep === 1 && t.step1Title}
              {currentStep === 2 && t.step2Title}
              {currentStep === 3 && t.step3Title}
              {currentStep === 4 && t.step4Title}
              {currentStep === 5 && t.step5Title}
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {isSuccess ? (
            /* Success State */
            <div className="text-center py-6 space-y-5" role="status">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                <CheckCircle className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-slate-900">
                  {t.successTitle}
                </h4>
                <p className="text-slate-600 mt-2 max-w-md mx-auto">
                  {t.successDesc}
                </p>
              </div>

              {/* Reference Box */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 max-w-md mx-auto space-y-2">
                <div className="text-xs uppercase font-medium text-emerald-700 tracking-wider">
                  {t.refCodeLabel}
                </div>
                <div className="text-2xl font-mono font-extrabold text-emerald-950 mt-1">
                  {generatedRef}
                </div>
                <div className="pt-2 text-[11px] font-semibold text-emerald-900 flex items-center justify-center gap-1.5 border-t border-emerald-200/70">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{t.successNote}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-500 max-w-md mx-auto">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{lang === 'tr' ? 'İhracat ekibimiz gereksinimlerinizi inceleyerek sizinle iletişime geçecektir.' : 'Our export team will review your requirements and contact you.'}</span>
              </div>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-block text-sm font-semibold text-emerald-800 underline">
                {lang === 'tr' ? 'WhatsApp ile takip edin' : 'Follow up via WhatsApp'}
              </a>

              <button
                onClick={resetForm}
                className="w-full sm:w-auto px-8 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl shadow-md transition-colors"
              >
                {t.closeBtn}
              </button>
            </div>
          ) : (
            /* Step Form */
            <form ref={formRef} noValidate aria-busy={isSubmitting} onSubmit={handleSubmit} className="space-y-5">
              <fieldset disabled={isSubmitting} className="min-w-0 space-y-5">
              <FormFeedback errors={errors} submitError={submitError} lang={lang} />
              <InquiryHoneypot value={websiteTrap} onChange={setWebsiteTrap} />
              {currentStep > 1 && selectedProductObj && (
                <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-3 mb-4 flex flex-wrap items-center justify-between gap-2.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    <div>
                      <span className="text-slate-500">{lang === 'tr' ? 'Ürün:' : 'Product:'} </span>
                      <strong className="text-slate-900">{selectedProductObj.name[lang] || selectedProductObj.name.en}</strong>
                      {formData.variety && (
                        <span className="text-slate-600"> ({formData.variety})</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-slate-700">
                    {formData.caliber && formData.caliber !== 'recommendation' && (
                      <div className="bg-white/80 px-2 py-0.5 rounded border border-emerald-200/60">
                        <span className="text-slate-500">{lang === 'tr' ? 'Kalibre:' : 'Size:'} </span>
                        <span className="font-semibold text-emerald-900">{formData.caliber}</span>
                      </div>
                    )}
                    {formData.quantity && (
                      <div className="bg-white/80 px-2 py-0.5 rounded border border-emerald-200/60">
                        <span className="text-slate-500">{lang === 'tr' ? 'Miktar:' : 'Qty:'} </span>
                        <span className="font-semibold text-emerald-900">{formData.quantity} {formData.unit}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* STEP 1: Select Produce */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label htmlFor={fieldId('product')} className="block text-sm font-semibold text-slate-800 mb-1.5">
                      {t.productLabel}
                    </label>
                    <select
                      name="product"
                        {...fieldProps('product')}
                      value={formData.product}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                        <option value="">{lang === 'tr' ? 'Ürün seçin' : 'Select a product'}</option>
                      {productsData.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name[lang] || p.name.en} ({p.scientificName})
                        </option>
                      ))}
                    </select>
                      <FormFieldError error={errors.product} id={errorId('product')} />
                  </div>

                  {selectedProductObj && selectedProductObj.varieties.length > 0 && (
                    <div>
                      <label htmlFor={fieldId('variety')} className="block text-sm font-semibold text-slate-800 mb-1.5">
                        {t.varietyLabel}
                      </label>
                      <select
                        name="variety"
                        {...fieldProps('variety')}
                        value={formData.variety}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="">{lang === 'tr' ? 'Çeşit seçin veya öneri isteyin' : 'Select a variety or request a recommendation'}</option>
                        <option value="recommendation">
                          {lang === 'tr' ? 'Tüm Çeşitler / Öneri İstiyorum' : 'All Varieties / Exporter Recommendation'}
                        </option>
                        {selectedProductObj.varieties.map((v) => (
                          <option key={v.name} value={v.name}>
                            {lang === 'tr' ? v.nameTr || v.name : v.name}
                          </option>
                        ))}
                      </select>
                      <FormFieldError error={errors.variety} id={errorId('variety')} />
                    </div>
                  )}

                  {selectedProductObj && (
                    <div>
                      <label htmlFor={fieldId('caliber')} className="block text-sm font-semibold text-slate-800 mb-1.5">
                        {lang === 'tr' ? 'Kalibre / Çap Seçimi' : 'Caliber / Size Selection'}
                      </label>
                      <select
                        name="caliber"
                        {...fieldProps('caliber')}
                        value={formData.caliber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="">{lang === 'tr' ? 'Kalibre seçin / Teklif önerisi isteyin' : 'Select caliber / Request supplier recommendation'}</option>
                        {getProductCaliberOptions(selectedProductObj, lang).map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                      <FormFieldError error={errors.caliber} id={errorId('caliber')} />
                    </div>
                  )}

                  <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3.5 flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-emerald-900">
                      {lang === 'tr'
                        ? 'Ürününüzü, kalitenizi ve teknik gereksinimlerinizi seçin. Tedarikçi önerisi isteyebilirsiniz.'
                        : 'Select your product, grade and technical requirements. You can request a supplier recommendation.'}
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 2: Quantity & Packaging */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor={fieldId('quantity')} className="block text-sm font-semibold text-slate-800 mb-1.5">
                        {t.quantityLabel}
                      </label>
                      <input
                        type="number"
                        min={formData.unit === 'container' ? '1' : '0.001'}
                        max={formData.unit === 'container' ? '10000' : '1000000'}
                        step={formData.unit === 'container' ? '1' : '0.001'}
                        inputMode="decimal"
                        name="quantity"
                        {...fieldProps('quantity')}
                        required
                        value={formData.quantity}
                        onChange={handleInputChange}
                        placeholder="e.g. 20, 40, 100"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                      <FormFieldError error={errors.quantity} id={errorId('quantity')} />
                    </div>
                    <div>
                      <label htmlFor={fieldId('unit')} className="block text-sm font-semibold text-slate-800 mb-1.5">
                        {t.unitLabel}
                      </label>
                      <select
                        name="unit"
                        {...fieldProps('unit')}
                        value={formData.unit}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="MT">Metric Tons (MT)</option>
                          <option value="kg">Kilograms (kg)</option>
                        <option value="container">Containers (FCL)</option>
                      </select>
                      <FormFieldError error={errors.unit} id={errorId('unit')} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor={fieldId('packaging')} className="block text-sm font-semibold text-slate-800 mb-1.5">
                      {t.packagingLabel}
                    </label>
                    <select
                      name="packaging"
                        {...fieldProps('packaging')}
                      value={formData.packaging}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      {packagingData.map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>
                          {lang === 'tr' ? pkg.name.tr : pkg.name.en} — {pkg.netWeightRange}
                        </option>
                      ))}
                    </select>
                      <FormFieldError error={errors.packaging} id={errorId('packaging')} />
                  </div>
                </div>
              )}

              {/* STEP 3: Destination & Incoterm */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor={fieldId('destinationCountry')} className="block text-sm font-semibold text-slate-800 mb-1.5">
                        {t.destCountryLabel}
                      </label>
                      <input
                        type="text"
                        name="destinationCountry"
                        {...fieldProps('destinationCountry')}
                        required
                        value={formData.destinationCountry}
                        onChange={handleInputChange}
                        placeholder="e.g. Germany, UAE, India, UK"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                      <FormFieldError error={errors.destinationCountry} id={errorId('destinationCountry')} />
                    </div>
                    <div>
                      <label htmlFor={fieldId('destinationCity')} className="block text-sm font-semibold text-slate-800 mb-1.5">
                        {t.destCityLabel}
                      </label>
                      <input
                        type="text"
                        name="destinationCity"
                        {...fieldProps('destinationCity')}
                        required
                        value={formData.destinationCity}
                        onChange={handleInputChange}
                        placeholder="e.g. Hamburg, Dubai, Mumbai, London"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                      <FormFieldError error={errors.destinationCity} id={errorId('destinationCity')} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor={fieldId('incoterm')} className="block text-sm font-semibold text-slate-800 mb-1.5">
                        {t.incotermLabel}
                      </label>
                      <select
                        name="incoterm"
                        {...fieldProps('incoterm')}
                        value={formData.incoterm}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="CIF">CIF (Cost, Insurance and Freight)</option>
                        <option value="CFR">CFR (Cost and Freight)</option>
                        <option value="FOB">FOB (Free on Board)</option>
                        <option value="FCA">FCA (Free Carrier)</option>
                        <option value="EXW">EXW (Ex Works)</option>
                        <option value="DAP">DAP (Delivered at Place)</option>
                      </select>
                      <FormFieldError error={errors.incoterm} id={errorId('incoterm')} />
                    </div>
                    <div>
                      <label htmlFor={fieldId('destinationPort')} className="block text-sm font-semibold text-slate-800 mb-1.5">
                        {t.destPortLabel}
                      </label>
                      <input
                        type="text"
                        name="destinationPort"
                        {...fieldProps('destinationPort')}
                        value={formData.destinationPort}
                        onChange={handleInputChange}
                        placeholder="e.g. Rotterdam, Jebel Ali, Nhava Sheva"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                      <FormFieldError error={errors.destinationPort} id={errorId('destinationPort')} />
                    </div>
                  </div>
                  <RFQDeliveryFields lang={lang} formData={formData} errors={errors} fieldProps={fieldProps} fieldId={fieldId} errorId={errorId} onChange={handleInputChange} />
                </div>
              )}

              {/* STEP 4: Company Details */}
              {currentStep === 4 && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label htmlFor={fieldId('companyName')} className="block text-sm font-semibold text-slate-800 mb-1.5">
                      {t.companyNameLabel}
                    </label>
                    <input
                      type="text"
                      name="companyName"
                        {...fieldProps('companyName')}
                      required
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="e.g. Global Import Ltd."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                      <FormFieldError error={errors.companyName} id={errorId('companyName')} />
                  </div>

                  <div>
                    <label htmlFor={fieldId('website')} className="block text-sm font-semibold text-slate-800 mb-1.5">
                      {t.websiteLabel}
                    </label>
                    <input
                      type="text"
                      name="website"
                        {...fieldProps('website')}
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="e.g. www.company.com"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                      <FormFieldError error={errors.website} id={errorId('website')} />
                  </div>

                  <div>
                    <label htmlFor={fieldId('message')} className="block text-sm font-semibold text-slate-800 mb-1.5">
                      {t.messageLabel}
                    </label>
                    <textarea
                      name="message"
                        {...fieldProps('message')}
                      rows={3}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Specific caliber requirements, target arrival date, MRL certifications or packaging remarks..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                      <FormFieldError error={errors.message} id={errorId('message')} />
                  </div>
                </div>
              )}

              {/* STEP 5: Contact Person */}
              {currentStep === 5 && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label htmlFor={fieldId('contactPerson')} className="block text-sm font-semibold text-slate-800 mb-1.5">
                      {t.contactPersonLabel}
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                        {...fieldProps('contactPerson')}
                      required
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      placeholder="e.g. Mr. John Doe (Procurement Manager)"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                      <FormFieldError error={errors.contactPerson} id={errorId('contactPerson')} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor={fieldId('email')} className="block text-sm font-semibold text-slate-800 mb-1.5">
                        {t.emailLabel}
                      </label>
                      <input
                        type="email"
                        name="email"
                        {...fieldProps('email')}
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="procurement@company.com"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                      <FormFieldError error={errors.email} id={errorId('email')} />
                    </div>
                    <div>
                      <label htmlFor={fieldId('phone')} className="block text-sm font-semibold text-slate-800 mb-1.5">
                        {t.phoneLabel}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        {...fieldProps('phone')}
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+49 170 1234567"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                      <FormFieldError error={errors.phone} id={errorId('phone')} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      {lang === 'tr'
                        ? 'Bilgilerinizi talebinize yanıt vermek için kullanırız. Ayrıntılar için gizlilik bildirimimize bakın.'
                        : 'We use your details to respond to your inquiry. See our privacy notice for details.'}
                    </span>
                  </div>
                  <RFQSummary lang={lang} values={formData} />
                  <InquiryConsent lang={lang} id={fieldId('consent')} checked={consent} onChange={setConsent} errorId={errorId('consent')} invalid={!!errors.consent} />
                  <FormFieldError error={errors.consent} id={errorId('consent')} />
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex items-center gap-2 px-5 py-2.5 text-slate-600 hover:text-slate-900 font-medium rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{t.prevBtn}</span>
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl shadow-md transition-colors"
                  >
                    <span>{t.nextBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>{t.submitting}</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{t.submitBtn}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            
              {submitError && (
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800">
                  {lang === 'tr' ? 'WhatsApp ile gönder' : 'Send via WhatsApp'}
                </a>
              )}
              </fieldset>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
