'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { analyticsConsent, setAnalyticsConsent, subscribeAnalyticsConsent, trackEvent } from '@/lib/analytics';
import type { Locale } from '@/types';

const measurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || 'G-ST5MWN0FR3';
const enabled = /^G-[A-Z0-9]+$/.test(measurementId);
const copy: Record<string, [string, string, string, string]> = {
  en: ['Allow detailed usage measurement? Without permission we only count page visits anonymously, with no cookies or personal data. We never send your form details to analytics.', 'Allow', 'Decline', 'Analytics preferences'],
  tr: ['Ayrıntılı kullanım ölçümüne izin verilsin mi? İzin vermezseniz yalnızca çerezsiz ve kişisel veri içermeyen anonim ziyaret sayımı yapılır. Form bilgileriniz analitiğe gönderilmez.', 'İzin ver', 'Reddet', 'Analitik tercihleri'],
  ar: ['هل تسمح بقياس الاستخدام التفصيلي؟ دون إذنك نحصي زيارات الصفحات بشكل مجهول فقط، دون ملفات تعريف ارتباط أو بيانات شخصية. لا نرسل تفاصيل النموذج إلى التحليلات.', 'السماح', 'رفض', 'تفضيلات التحليلات'],
  de: ['Detaillierte Nutzungsmessung zulassen? Ohne Erlaubnis zählen wir Seitenaufrufe nur anonym, ohne Cookies und ohne personenbezogene Daten. Formulardaten werden nicht an Analytics gesendet.', 'Zulassen', 'Ablehnen', 'Analytics-Einstellungen'],
  fr: ['Autoriser la mesure détaillée ? Sans autorisation, nous comptons uniquement les visites de pages de façon anonyme, sans cookies ni données personnelles. Les données du formulaire ne sont jamais envoyées aux analyses.', 'Autoriser', 'Refuser', 'Préférences analytiques'],
  it: ['Consentire la misurazione dettagliata? Senza consenso contiamo solo le visite alle pagine in modo anonimo, senza cookie né dati personali. I dati del modulo non vengono inviati alle analisi.', 'Consenti', 'Rifiuta', 'Preferenze analitiche'],
  es: ['¿Permitir la medición detallada? Sin permiso solo contamos las visitas a páginas de forma anónima, sin cookies ni datos personales. Los datos del formulario nunca se envían a las analíticas.', 'Permitir', 'Rechazar', 'Preferencias analíticas'],
};
type AnalyticsWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; [key: `ga-disable-${string}`]: boolean };
const getServerConsent = () => null;

export function AnalyticsConsent({ lang }: { lang: Locale }) {
  const choice = useSyncExternalStore(subscribeAnalyticsConsent, analyticsConsent, getServerConsent);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const show = preferencesOpen || choice === null;
  const pathname = usePathname();
  const text = copy[lang] || copy.en;

  useEffect(() => {
    if (!enabled) return;
    const analyticsWindow = window as unknown as AnalyticsWindow;
    analyticsWindow[`ga-disable-${measurementId}`] = choice !== 'granted';
    if (choice !== 'granted') return;
    analyticsWindow.dataLayer ||= [];
    analyticsWindow.gtag ||= function (...args: unknown[]) { analyticsWindow.dataLayer!.push(args); };
    if (!document.getElementById('nilasya-ga4')) {
      analyticsWindow.gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
      analyticsWindow.gtag('js', new Date());
      analyticsWindow.gtag('config', measurementId, {
        send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false,
        page_location: `${window.location.origin}${window.location.pathname}`, page_referrer: '',
      });
      const script = document.createElement('script');
      script.id = 'nilasya-ga4';
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);
    }
    analyticsWindow.gtag('consent', 'update', { analytics_storage: 'granted' });
    return () => {
      analyticsWindow.gtag?.('consent', 'update', { analytics_storage: 'denied' });
      analyticsWindow[`ga-disable-${measurementId}`] = true;
    };
  }, [choice]);

  useEffect(() => {
    if (!enabled || choice !== 'granted') return;
    const analyticsWindow = window as unknown as AnalyticsWindow;
    analyticsWindow.gtag?.('event', 'page_view', {
      page_location: `${window.location.origin}${pathname}`,
      page_referrer: '',
    });
    const product = document.querySelector<HTMLElement>('[data-product-id]')?.dataset.productId;
    if (product) trackEvent('product_spec_view', { product_slug: product });
    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
      if (!link) return;
      if (link.href.startsWith('mailto:')) trackEvent('email_click');
      else if (new URL(link.href).hostname === 'wa.me') trackEvent('whatsapp_click', { product_slug: product });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [choice, pathname]);

  if (!enabled) return null;
  const choose = (value: 'granted' | 'denied') => {
    setAnalyticsConsent(value);
    setPreferencesOpen(false);
  };
  return (
    <div className="bg-slate-950 text-slate-200 px-4 py-3 text-xs">
      {show ? (
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3" role="region" aria-label={text[3]}>
          <p className="flex-1 min-w-48">{text[0]}</p>
          <button type="button" onClick={() => choose('granted')} className="rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white">{text[1]}</button>
          <button type="button" onClick={() => choose('denied')} className="rounded-lg border border-slate-400 px-4 py-2 font-semibold text-white">{text[2]}</button>
        </div>
      ) : <button type="button" onClick={() => setPreferencesOpen(true)} className="underline underline-offset-4">{text[3]}</button>}
    </div>
  );
}
