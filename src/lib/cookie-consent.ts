/** First-party consent cookie. Client-only (document.cookie). */

export const CONSENT_COOKIE = 'cb_cookie_consent';
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 365;
export const CONSENT_CHANGE_EVENT = 'cb-consent-change';

export type CookieConsent = {
  analytics: boolean;
  timestamp: string;
};

let cachedRaw: string | null = null;
let cachedValue: CookieConsent | null = null;
let cacheReady = false;

export function parseConsent(raw: string | null | undefined): CookieConsent | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as unknown;
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      typeof (parsed as CookieConsent).analytics !== 'boolean' ||
      typeof (parsed as CookieConsent).timestamp !== 'string'
    ) {
      return null;
    }
    return parsed as CookieConsent;
  } catch {
    return null;
  }
}

function rawConsentValue(): string | null {
  if (typeof document === 'undefined') return null;
  const raw = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${CONSENT_COOKIE}=`));
  if (!raw) return null;
  return raw.slice(CONSENT_COOKIE.length + 1);
}

export function readConsent(): CookieConsent | null {
  if (typeof document === 'undefined') return null;
  const raw = rawConsentValue();
  if (cacheReady && raw === cachedRaw) return cachedValue;
  cacheReady = true;
  cachedRaw = raw;
  cachedValue = parseConsent(raw);
  return cachedValue;
}

export function writeConsent(analytics: boolean): CookieConsent {
  const next: CookieConsent = {
    analytics,
    timestamp: new Date().toISOString(),
  };
  if (typeof document === 'undefined') return next;

  const encoded = encodeURIComponent(JSON.stringify(next));
  const secure =
    typeof location !== 'undefined' && location.protocol === 'https:'
      ? '; Secure'
      : '';
  document.cookie = `${CONSENT_COOKIE}=${encoded}; Max-Age=${CONSENT_MAX_AGE}; Path=/; SameSite=Lax${secure}`;

  cacheReady = true;
  cachedRaw = encoded;
  cachedValue = next;
  dispatchConsentChange(next);
  return next;
}

export function isAnalyticsAllowed(): boolean {
  return readConsent()?.analytics === true;
}

export function subscribeConsent(
  listener: (consent: CookieConsent | null) => void,
): () => void {
  if (typeof window === 'undefined') return () => {};

  const onCustom = (e: Event) => {
    const detail = (e as CustomEvent<CookieConsent | null>).detail;
    listener(detail ?? readConsent());
  };

  window.addEventListener(CONSENT_CHANGE_EVENT, onCustom);
  return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onCustom);
}

function dispatchConsentChange(consent: CookieConsent) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent(CONSENT_CHANGE_EVENT, { detail: consent }),
  );
}
