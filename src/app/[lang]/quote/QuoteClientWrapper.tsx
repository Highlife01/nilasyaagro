'use client';

import React from 'react';
import { Locale } from '@/types';
import { getTranslations } from '@/data/translations';
import { productsData } from '@/data/products';
import { getProductCaliberOptions } from '@/data/productOptions';
import { packagingData } from '@/data/packaging';
import { 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Send, 
  FileText 
} from 'lucide-react';
import Link from 'next/link';
import { useRFQForm } from '@/components/rfq/useRFQForm';
import { FormFeedback, FormFieldError } from '@/components/rfq/FormFeedback';
import { InquiryConsent } from '@/components/rfq/InquiryConsent';
import { InquiryHoneypot } from '@/components/rfq/InquiryHoneypot';

export const QuoteClientWrapper: React.FC<{ lang: Locale }> = ({ lang }) => {
  const t = getTranslations(lang).rfq;

  const { formData, currentStep, isSubmitting, isSuccess, generatedRef, errors, submitError,
    formRef, fieldProps, fieldId, errorId, handleInputChange, handleNext, handlePrev, handleSubmit, whatsappHref,
    consent, setConsent, websiteTrap, setWebsiteTrap,
  } = useRFQForm(lang);

  const selectedProductObj = productsData.find((p) => p.id === formData.product);

  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-widest">
            <FileText className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t.modalTitle}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            {lang === 'tr' ? 'RESMİ İHRACAT TEKLİFİ ALIN' : 'REQUEST AN EXPORT QUOTE'}
          </h1>
          <p className="text-sm text-slate-600">
            {t.modalSubtitle}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
          {!isSuccess && (
            <div className="bg-emerald-950 text-white px-8 py-5 border-b border-emerald-900">
              <div className="flex items-center justify-between max-w-md mx-auto">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        currentStep === step
                          ? 'bg-amber-400 text-slate-950 ring-4 ring-emerald-700'
                          : currentStep > step
                          ? 'bg-emerald-500 text-white'
                          : 'bg-emerald-900 text-emerald-300'
                      }`}
                    >
                      {currentStep > step ? '✓' : step}
                    </div>
                    {step < 5 && (
                      <div
                        className={`w-8 sm:w-16 h-0.5 mx-1.5 ${
                          currentStep > step ? 'bg-emerald-500' : 'bg-emerald-900'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center mt-3 text-xs font-bold text-emerald-300 uppercase tracking-wider">
                Step {currentStep}:{' '}
                {currentStep === 1 && t.step1Title}
                {currentStep === 2 && t.step2Title}
                {currentStep === 3 && t.step3Title}
                {currentStep === 4 && t.step4Title}
                {currentStep === 5 && t.step5Title}
              </div>
            </div>
          )}

          <div className="p-8 sm:p-12">
            {isSuccess ? (
              <div className="text-center py-8 space-y-6">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900">
                    {lang === 'tr' ? 'WhatsApp Teklif Mesajınız Hazır' : 'Your WhatsApp RFQ Is Ready'}
                  </h2>
                  <p className="text-slate-600 mt-2 max-w-md mx-auto">
                    {lang === 'tr' ? 'Teklifiniz WhatsApp\'ta hazırlandı. İletilmesi için açılan pencerede Gönder düğmesine basın.' : 'Your RFQ is ready in WhatsApp. Press Send in the opened window to deliver it.'}
                  </p>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 max-w-md mx-auto">
                  <div className="text-xs uppercase font-bold text-emerald-800 tracking-wider">
                    {t.refCodeLabel}
                  </div>
                  <div className="text-3xl font-mono font-black text-emerald-950 mt-1">
                    {generatedRef}
                  </div>
                </div>

                <p className="text-xs text-slate-500 max-w-md mx-auto">{t.successNote}</p>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-block text-sm font-semibold text-emerald-800 underline">
                {lang === 'tr' ? 'WhatsApp ile takip edin' : 'Follow up via WhatsApp'}
              </a>

                <div className="pt-4">
                  <Link
                    href={`/${lang}/`}
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
                  >
                    <span>{lang === 'tr' ? 'Ana Sayfaya Dön' : 'Return to Home'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <form ref={formRef} noValidate aria-busy={isSubmitting} onSubmit={handleSubmit} className="space-y-6">
              <FormFeedback errors={errors} submitError={submitError} lang={lang} />
              <InquiryHoneypot value={websiteTrap} onChange={setWebsiteTrap} />
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor={fieldId('product')} className="block text-sm font-semibold text-slate-800 mb-1.5">
                        {t.productLabel}
                      </label>
                      <select
                        name="product"
                        {...fieldProps('product')}
                        value={formData.product}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        {productsData.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name[lang] || p.name.en} ({p.scientificName})
                          </option>
                        ))}
                      </select>
                      <FormFieldError error={errors.product} id={errorId('product')} />
                    </div>

                    {selectedProductObj && (
                      <div>
                        <label htmlFor={fieldId('variety')} className="block text-sm font-semibold text-slate-800 mb-1.5">
                          {t.varietyLabel}
                        </label>
                        <select
                          name="variety"
                        {...fieldProps('variety')}
                          value={formData.variety}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        >
                          <option value="">
                            {lang === 'tr' ? 'Tüm Çeşitler / Tavsiye İstiyorum' : 'All Varieties / Supplier Recommendation'}
                          </option>
                          {selectedProductObj.varieties.map((v) => (
                            <option key={v.name} value={v.name}>
                              {lang === 'tr' ? v.nameTr : v.name}
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
                          className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        >
                          <option value="">{lang === 'tr' ? 'Kalibre seçin / Teklif önerisi isteyin' : 'Select caliber / Request supplier recommendation'}</option>
                          {getProductCaliberOptions(selectedProductObj, lang).map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      <FormFieldError error={errors.caliber} id={errorId('caliber')} />
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor={fieldId('quantity')} className="block text-sm font-semibold text-slate-800 mb-1.5">
                          {t.quantityLabel}
                        </label>
                        <input
                          type="number"
                        min="0.001"
                        step="any"
                        inputMode="decimal"
                          name="quantity"
                        {...fieldProps('quantity')}
                          required
                          value={formData.quantity}
                          onChange={handleInputChange}
                          placeholder="e.g. 40"
                          className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                          className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        >
                          <option value="Tons">Metric Tons (MT)</option>
                          <option value="Containers (40ft FCL)">40ft HC Reefer Containers</option>
                          <option value="Pallets">Pallets (Euro / Standard)</option>
                          <option value="Boxes">Carton Boxes / Crates</option>
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
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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

                {currentStep === 3 && (
                  <div className="space-y-4">
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
                          placeholder="e.g. Germany, UAE, India"
                          className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                          placeholder="e.g. Hamburg, Dubai, Mumbai"
                          className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                          className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        >
                          <option value="CIF">CIF (Cost, Insurance and Freight)</option>
                          <option value="CFR">CFR (Cost and Freight)</option>
                          <option value="FOB">FOB (Free on Board - Mersin/Izmir)</option>
                          <option value="FCA">FCA (Free Carrier)</option>
                          <option value="EXW">EXW (Ex Works Packhouse)</option>
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
                          placeholder="e.g. Rotterdam, Jebel Ali"
                          className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      <FormFieldError error={errors.destinationPort} id={errorId('destinationPort')} />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-4">
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
                        placeholder="Company Name"
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                        placeholder="www.company.com"
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                        placeholder="Specific caliber requirements, target delivery window..."
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                      <FormFieldError error={errors.message} id={errorId('message')} />
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="space-y-4">
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
                        placeholder="Contact Person Full Name"
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                          placeholder="email@company.com"
                          className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                          className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      <FormFieldError error={errors.phone} id={errorId('phone')} />
                      </div>
                    </div>
                  <InquiryConsent lang={lang} id={fieldId('consent')} checked={consent} onChange={setConsent} errorId={errorId('consent')} invalid={!!errors.consent} />
                  <FormFieldError error={errors.consent} id={errorId('consent')} />
                  </div>
                )}

                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="flex items-center gap-2 px-6 py-3 text-slate-600 hover:text-slate-900 font-medium rounded-xl hover:bg-slate-100 transition-colors"
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
                      className="flex items-center gap-2 px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors"
                    >
                      <span>{t.nextBtn}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm tracking-wider uppercase rounded-xl shadow-xl transition-all disabled:opacity-50"
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
                  {lang === 'tr' ? 'WhatsApp ile g?nder' : 'Send via WhatsApp'}
                </a>
              )}
            </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
