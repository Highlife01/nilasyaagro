'use client';

import { analyticsConsent, subscribeAnalyticsConsent } from './analytics';

const VISITOR_COOKIE_NAME = '_n_vid';
const SESSION_COOKIE_NAME = '_n_sid';
const SESSION_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes inactivity

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document === 'undefined') return;
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax${secure}`;
}

export function getActiveSessionId(): string | null {
  return getCookie(SESSION_COOKIE_NAME);
}

export function getOrCreateSessionAndVisitor(): { sessionId: string; visitorId: string } | null {
  if (typeof window === 'undefined') return null;
  if (analyticsConsent() !== 'granted') return null;

  let visitorId = getCookie(VISITOR_COOKIE_NAME);
  if (!visitorId) {
    visitorId = generateUUID();
    setCookie(VISITOR_COOKIE_NAME, visitorId, 365 * 24 * 60 * 60); // 1 year
  }

  let sessionId = getCookie(SESSION_COOKIE_NAME);
  if (!sessionId) {
    sessionId = generateUUID();
    setCookie(SESSION_COOKIE_NAME, sessionId, SESSION_EXPIRY_MS / 1000);
  } else {
    // Refresh rolling session cookie
    setCookie(SESSION_COOKIE_NAME, sessionId, SESSION_EXPIRY_MS / 1000);
  }

  return { sessionId, visitorId };
}

interface AnalyticsPayload {
  sessionId: string;
  visitorId: string;
  path: string;
  referrer: string;
  title: string;
  screen: string;
  language: string;
  timezone: string;
  utm?: {
    source?: string | null;
    medium?: string | null;
    campaign?: string | null;
    term?: string | null;
    content?: string | null;
  };
  clientHints?: {
    model?: string | null;
    platformVersion?: string | null;
  };
}

let lastTrackedPath = '';
let lastTrackedTime = 0;

function parseUTMParams(): AnalyticsPayload['utm'] {
  if (typeof window === 'undefined') return {};
  try {
    const params = new URLSearchParams(window.location.search);
    const source = params.get('utm_source');
    const medium = params.get('utm_medium');
    const campaign = params.get('utm_campaign');
    const term = params.get('utm_term');
    const content = params.get('utm_content');
    if (!source && !medium && !campaign && !term && !content) return {};
    return {
      source: source || null,
      medium: medium || null,
      campaign: campaign || null,
      term: term || null,
      content: content || null,
    };
  } catch {
    return {};
  }
}

async function sendBeaconPayload(payload: AnalyticsPayload): Promise<void> {
  const url = (process.env.NEXT_PUBLIC_INQUIRY_API_URL || '/api').replace(/\/$/, '') + '/analytics/collect';
  const body = JSON.stringify(payload);

  if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    const blob = new Blob([body], { type: 'application/json' });
    try {
      if (navigator.sendBeacon(url, blob)) return;
    } catch {
      // Fall through to fetch
    }
  }

  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Nilasya-Request': '1',
      },
      body,
      keepalive: true,
    });
  } catch {
    // Non-blocking tracker
  }
}

export async function trackPageView(customPath?: string): Promise<void> {
  if (typeof window === 'undefined') return;
  if (analyticsConsent() !== 'granted') return;

  const path = customPath || window.location.pathname || '/';
  const now = Date.now();

  // Rapid reload or re-render deduplication (ignore if within 2 seconds on identical path)
  if (path === lastTrackedPath && now - lastTrackedTime < 2000) {
    return;
  }
  lastTrackedPath = path;
  lastTrackedTime = now;

  const identity = getOrCreateSessionAndVisitor();
  if (!identity) return;

  let clientHints: AnalyticsPayload['clientHints'] = {};
  try {
    const nav = navigator as Navigator & {
      userAgentData?: {
        getHighEntropyValues: (hints: string[]) => Promise<{ model?: string; platformVersion?: string }>;
      };
    };
    if (nav.userAgentData?.getHighEntropyValues) {
      const hints = await nav.userAgentData.getHighEntropyValues(['model', 'platformVersion']);
      clientHints = {
        model: hints.model || null,
        platformVersion: hints.platformVersion || null,
      };
    }
  } catch {
    // Hints optional
  }

  const payload: AnalyticsPayload = {
    sessionId: identity.sessionId,
    visitorId: identity.visitorId,
    path,
    referrer: document.referrer || '',
    title: document.title || '',
    screen: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
    language: navigator.language || '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    utm: parseUTMParams(),
    clientHints,
  };

  await sendBeaconPayload(payload);
}

export function initVisitorTracking(): () => void {
  if (typeof window === 'undefined') return () => {};

  // Track initial page
  if (analyticsConsent() === 'granted') {
    trackPageView();
  }

  // Subscribe to consent changes (starts tracking immediately upon consent)
  const unsubscribeConsent = subscribeAnalyticsConsent(() => {
    if (analyticsConsent() === 'granted') {
      trackPageView();
    }
  });

  // 30-second heartbeat to accurately measure session activity and duration
  const heartbeatInterval = setInterval(() => {
    if (analyticsConsent() === 'granted' && document.visibilityState === 'visible') {
      trackPageView(window.location.pathname);
    }
  }, 30000);

  // Send heartbeat on page exit / visibility change
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden' && analyticsConsent() === 'granted') {
      trackPageView(window.location.pathname);
    }
  };
  document.addEventListener('visibilitychange', handleVisibilityChange);

  return () => {
    unsubscribeConsent();
    clearInterval(heartbeatInterval);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}
