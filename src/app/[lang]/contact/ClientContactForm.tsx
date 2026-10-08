'use client';

import React, { useState } from 'react';
import { Locale } from '@/types';
import { Send, CheckCircle2 } from 'lucide-react';
import { createWhatsAppUrl, formatInquiry } from '@/data/company';

import { getPageTranslations } from '@/data/pageTranslations';

export const ClientContactForm: React.FC<{ lang: Locale }> = ({ lang }) => {
  const pt = getPageTranslations(lang).contactPage;
  const [submitted, setSubmitted] = useState(false);
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(createWhatsAppUrl(formatInquiry('Nilasya Agro Foods Contact Inquiry', {
      Name: formData.name,
      Company: formData.company,
      Email: formData.email,
      Phone: formData.phone,
      Subject: formData.subject,
      Message: formData.message,
      Language: lang,
    })), '_blank', 'noopener,noreferrer');
    setSubmitted(true);
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
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl space-y-4"
    >
      <h3 className="text-xl font-bold text-slate-900 mb-2">
        {pt.formTitle}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {pt.nameLabel}
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {pt.companyLabel}
          </label>
          <input
            type="text"
            name="company"
            required
            value={formData.company}
            onChange={handleChange}
            placeholder="Global Import Ltd."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {pt.emailFormLabel}
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="buyer@company.com"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {pt.phoneFormLabel}
          </label>
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="+49 170 1234567"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          {pt.subjectLabel}
        </label>
        <select
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        >
          <option value="">{pt.subjectPlaceholder}</option>
          <option value="Pomegranate">Turkish Pomegranate (Hicaz Nar)</option>
          <option value="Apples">Apples (Granny Smith, Gala, Red Delicious, Fuji)</option>
          <option value="Grapes">Table Grapes (Sultana Seedless, Red Globe, Crimson)</option>
          <option value="Kiwi">Hayward Green Kiwi</option>
          <option value="Oranges">Oranges (Washington Navel, Valencia)</option>
          <option value="Tomatoes">Tomatoes (Vine, Beef, Cocktail, Cherry)</option>
          <option value="General B2B Partnership">General B2B Import & Partnership</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          {pt.messageLabel}
        </label>
        <textarea
          name="message"
          rows={4}
          required
          value={formData.message}
          onChange={handleChange}
          placeholder={pt.messagePlaceholder}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm tracking-wider uppercase rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
      >
        <Send className="w-4 h-4" />
        <span>{pt.submitBtn}</span>
      </button>
    </form>
  );
};
