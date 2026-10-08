'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X, CheckCircle, ArrowRight, ArrowLeft, ShieldCheck, Clock, Send, Sparkles } from 'lucide-react';
import { Locale, RFQSubmission } from '@/types';
import { getTranslations } from '@/data/translations';
import { productsData } from '@/data/products';
import { getProductCaliberOptions } from '@/data/productOptions';
import { packagingData } from '@/data/packaging';
import confetti from 'canvas-confetti';
import { createWhatsAppUrl, formatInquiry } from '@/data/company';
import { saveRFQInquiry } from '@/lib/adminAuth';

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
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedRef, setGeneratedRef] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<Partial<RFQSubmission>>({
    product: preselectedProduct || 'pomegranate',
    variety: '',
    caliber: '',
    quantity: '40',
    unit: 'Tons',
    packaging: 'telescopic_carton',
    destinationCountry: '',
    destinationCity: '',
    destinationPort: '',
    incoterm: 'CIF',
    companyName: '',
    website: '',
    contactPerson: '',
    email: '',
    phone: '',
    whatsapp: '',
    message: '',
  });

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>('button, input, select, textarea, a[href]');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    dialogRef.current?.querySelector<HTMLElement>('button')?.focus();
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => name === 'product'
      ? { ...prev, product: value, variety: '', caliber: '' }
      : { ...prev, [name]: value }
    );
  };

  const generateRefCode = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `NG-RFQ-${randomNum}`;
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const refCode = generateRefCode();
    try {
      saveRFQInquiry({
        ...formData,
        referenceCode: refCode,
      });
    } catch {}
    window.open(createWhatsAppUrl(formatInquiry(`Nilasya Agro Foods RFQ ${refCode}`, {
      Product: formData.product, Variety: formData.variety, Caliber: formData.caliber,
      Quantity: `${formData.quantity || ''} ${formData.unit || ''}`, Packaging: formData.packaging,
      Destination: `${formData.destinationCity || ''}, ${formData.destinationCountry || ''}`,
      Port: formData.destinationPort, Incoterm: formData.incoterm, Company: formData.companyName,
      Website: formData.website, Contact: formData.contactPerson, Email: formData.email,
      Phone: formData.phone, Message: formData.message,
    })), '_blank', 'noopener,noreferrer');
    setGeneratedRef(refCode);
    setIsSubmitting(false);
    setIsSuccess(true);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      try { confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } }); } catch {}
    }
  };

  const resetForm = () => {
    setIsSuccess(false);
    setCurrentStep(1);
    onClose();
  };

  const selectedProductObj = productsData.find((p) => p.id === formData.product);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={resetForm}
      />

      {/* Modal Card */}
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="rfq-dialog-title" className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 border border-emerald-900/10 my-8">
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
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Step Progress Indicator (when not finished) */}
        {!isSuccess && (
          <div className="bg-emerald-50/70 border-b border-emerald-100 px-6 py-3">
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
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                <CheckCircle className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-slate-900">
                  {lang === 'tr' ? 'WhatsApp Teklif Mesajınız Hazır' : 'Your WhatsApp RFQ Is Ready'}
                </h4>
                <p className="text-slate-600 mt-2 max-w-md mx-auto">
                  {lang === 'tr' ? 'Teklifiniz WhatsApp\'ta hazırlandı. İletilmesi için Gönder düğmesine basın.' : 'Your RFQ is ready in WhatsApp. Press Send there to deliver it.'}
                </p>
              </div>

              {/* Reference Box */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 max-w-md mx-auto">
                <div className="text-xs uppercase font-medium text-emerald-700 tracking-wider">
                  {t.refCodeLabel}
                </div>
                <div className="text-2xl font-mono font-extrabold text-emerald-950 mt-1">
                  {generatedRef}
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-500 max-w-md mx-auto">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t.successNote}</span>
              </div>

              <button
                onClick={resetForm}
                className="w-full sm:w-auto px-8 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl shadow-md transition-colors"
              >
                {t.closeBtn}
              </button>
            </div>
          ) : (
            /* Step Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* STEP 1: Select Produce */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                      {t.productLabel}
                    </label>
                    <select
                      name="product"
                      value={formData.product}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      {productsData.map((p) => (
                        <option key={p.id} value={p.id}>
                          {lang === 'tr' ? p.name.tr : p.name.en} ({p.scientificName})
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedProductObj && selectedProductObj.varieties.length > 0 && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                        {t.varietyLabel}
                      </label>
                      <select
                        name="variety"
                        value={formData.variety}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="">
                          {lang === 'tr' ? 'Tüm Çeşitler / Öneri İstiyorum' : 'All Varieties / Exporter Recommendation'}
                        </option>
                        {selectedProductObj.varieties.map((v) => (
                          <option key={v.name} value={v.name}>
                            {lang === 'tr' ? v.nameTr : v.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedProductObj && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                        {lang === 'tr' ? 'Kalibre / Çap Seçimi' : 'Caliber / Size Selection'}
                      </label>
                      <select
                        name="caliber"
                        value={formData.caliber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="">{lang === 'tr' ? 'Kalibre seçin / Teklif önerisi isteyin' : 'Select caliber / Request supplier recommendation'}</option>
                        {getProductCaliberOptions(selectedProductObj, lang).map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3.5 flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-emerald-900">
                      {lang === 'tr'
                        ? 'Nilasya Agro Foods, tüm ürünleri tarladan doğrudan hasat ederek optik boylama hatlarında kalibre eder.'
                        : 'Nilasya Agro Foods sources all produce directly from certified growers and calibrates with optical grading systems.'}
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 2: Quantity & Packaging */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                        {t.quantityLabel}
                      </label>
                      <input
                        type="text"
                        name="quantity"
                        required
                        value={formData.quantity}
                        onChange={handleInputChange}
                        placeholder="e.g. 20, 40, 100"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                        {t.unitLabel}
                      </label>
                      <select
                        name="unit"
                        value={formData.unit}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="Tons">Metric Tons (MT)</option>
                        <option value="Containers (40ft FCL)">40ft HC Reefer Containers</option>
                        <option value="Pallets">Pallets (Euro / Standard)</option>
                        <option value="Boxes">Carton Boxes / Crates</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                      {t.packagingLabel}
                    </label>
                    <select
                      name="packaging"
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
                  </div>
                </div>
              )}

              {/* STEP 3: Destination & Incoterm */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                        {t.destCountryLabel}
                      </label>
                      <input
                        type="text"
                        name="destinationCountry"
                        required
                        value={formData.destinationCountry}
                        onChange={handleInputChange}
                        placeholder="e.g. Germany, UAE, India, UK"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                        {t.destCityLabel}
                      </label>
                      <input
                        type="text"
                        name="destinationCity"
                        required
                        value={formData.destinationCity}
                        onChange={handleInputChange}
                        placeholder="e.g. Hamburg, Dubai, Mumbai, London"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                        {t.incotermLabel}
                      </label>
                      <select
                        name="incoterm"
                        value={formData.incoterm}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="CIF">CIF (Cost, Insurance and Freight)</option>
                        <option value="CFR">CFR (Cost and Freight)</option>
                        <option value="FOB">FOB (Free on Board - Mersin/Izmir)</option>
                        <option value="FCA">FCA (Free Carrier)</option>
                        <option value="EXW">EXW (Ex Works Packhouse)</option>
                        <option value="DAP">DAP (Delivered at Place)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                        {t.destPortLabel}
                      </label>
                      <input
                        type="text"
                        name="destinationPort"
                        value={formData.destinationPort}
                        onChange={handleInputChange}
                        placeholder="e.g. Rotterdam, Jebel Ali, Nhava Sheva"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Company Details */}
              {currentStep === 4 && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                      {t.companyNameLabel}
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      required
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="e.g. Fresh Direct Global Ltd."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                      {t.websiteLabel}
                    </label>
                    <input
                      type="text"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="e.g. www.company.com"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                      {t.messageLabel}
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Specific caliber requirements, target arrival date, MRL certifications or packaging remarks..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 5: Contact Person */}
              {currentStep === 5 && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                      {t.contactPersonLabel}
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      required
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      placeholder="e.g. Mr. John Doe (Procurement Manager)"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                        {t.emailLabel}
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="procurement@company.com"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                        {t.phoneLabel}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+49 170 1234567"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      {lang === 'tr'
                        ? 'Verileriniz KVKK / GDPR kapsamında yalnızca resmi teklif hazırlanması amacıyla korunur.'
                        : 'Your data is strictly protected under GDPR and used solely for generating formal export quotations.'}
                    </span>
                  </div>
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
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
