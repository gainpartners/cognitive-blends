import { logger } from '@/lib/log';

const log = logger('privacy');

export type CustomerPrivacyContext = {
  storefrontAccessToken: string;
  checkoutRootDomain: string;
  storefrontRootDomain: string;
  country: string;
};

export type ShopifyConsentSync = {
  ok: boolean;
  analytics: boolean;
};

type CustomerPrivacyApi = {
  setTrackingConsent: (
    consent: Record<string, unknown>,
    callback: (data?: { error?: string }) => void,
  ) => void;
};

declare global {
  interface Window {
    Shopify?: {
      shop?: string;
      customerPrivacy?: CustomerPrivacyApi;
      loadFeatures?: (
        features: { name: string; version: string }[],
        callback: (error: unknown) => void,
      ) => void;
    };
  }
}

const CONSENT_API_SRC =
  'https://cdn.shopify.com/shopifycloud/consent-tracking-api/v0.1/consent-tracking-api.js';
const SHOPIFY_SYNC_EVENT = 'cb-shopify-consent-sync';

let loadPromise: Promise<CustomerPrivacyApi | null> | null = null;
let lastSync: ShopifyConsentSync | null = null;

export function getShopifyConsentSync(): ShopifyConsentSync | null {
  return lastSync;
}

export function subscribeShopifyConsentSync(
  listener: (sync: ShopifyConsentSync | null) => void,
): () => void {
  if (typeof window === 'undefined') return () => {};
  const onCustom = (e: Event) => {
    listener((e as CustomEvent<ShopifyConsentSync>).detail ?? lastSync);
  };
  window.addEventListener(SHOPIFY_SYNC_EVENT, onCustom);
  return () => window.removeEventListener(SHOPIFY_SYNC_EVENT, onCustom);
}

function publishSync(sync: ShopifyConsentSync) {
  lastSync = sync;
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(SHOPIFY_SYNC_EVENT, { detail: sync }));
}

function scriptFinished(el: Element): boolean {
  if (!(el instanceof HTMLScriptElement)) return false;
  const state = (el as HTMLScriptElement & { readyState?: string }).readyState;
  return state === 'complete' || state === 'loaded';
}

function loadCustomerPrivacy(): Promise<CustomerPrivacyApi | null> {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (window.Shopify?.customerPrivacy) {
    return Promise.resolve(window.Shopify.customerPrivacy);
  }
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve) => {
    let settled = false;
    const done = (api: CustomerPrivacyApi | null) => {
      if (settled) return;
      settled = true;
      resolve(api);
    };

    const finish = () => {
      const api = window.Shopify?.customerPrivacy;
      if (api) {
        done(api);
        return;
      }
      if (typeof window.Shopify?.loadFeatures === 'function') {
        window.Shopify.loadFeatures(
          [{ name: 'consent-tracking-api', version: '0.1' }],
          (error) => {
            if (error) {
              log.warn('consent-tracking-api loadFeatures failed');
              done(null);
              return;
            }
            done(window.Shopify?.customerPrivacy ?? null);
          },
        );
        return;
      }
      done(window.Shopify?.customerPrivacy ?? null);
    };

    const existing = document.querySelector(`script[src="${CONSENT_API_SRC}"]`);
    if (existing) {
      if (window.Shopify?.customerPrivacy || scriptFinished(existing)) {
        finish();
      } else {
        existing.addEventListener('load', finish, { once: true });
        existing.addEventListener('error', () => done(null), { once: true });
        queueMicrotask(() => {
          if (window.Shopify?.customerPrivacy) finish();
        });
      }
      return;
    }

    window.Shopify = window.Shopify || {};
    const script = document.createElement('script');
    script.src = CONSENT_API_SRC;
    script.async = true;
    script.onload = finish;
    script.onerror = () => done(null);
    document.head.appendChild(script);
  });

  return loadPromise;
}

export function syncShopifyConsent(
  analytics: boolean,
  context: CustomerPrivacyContext | null,
): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (!context) {
    publishSync({ ok: false, analytics });
    return Promise.resolve(false);
  }

  return loadCustomerPrivacy().then(
    (api) =>
      new Promise((resolve) => {
        if (!api?.setTrackingConsent) {
          publishSync({ ok: false, analytics });
          resolve(false);
          return;
        }

        const storefrontRootDomain =
          context.storefrontRootDomain || window.location.hostname;

        api.setTrackingConsent(
          {
            analytics,
            marketing: analytics,
            preferences: true,
            sale_of_data: analytics,
            headlessStorefront: true,
            checkoutRootDomain: context.checkoutRootDomain,
            storefrontRootDomain,
            storefrontAccessToken: context.storefrontAccessToken,
            country: context.country,
          },
          (data) => {
            if (data?.error) {
              log.warn('setTrackingConsent failed', { message: data.error });
              publishSync({ ok: false, analytics });
              resolve(false);
              return;
            }
            publishSync({ ok: true, analytics });
            resolve(true);
          },
        );
      }),
  );
}
