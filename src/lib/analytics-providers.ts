export type EventParams = Record<
  string,
  string | number | boolean | undefined
>;

export type AnalyticsProvider = {
  name: string;
  capture: (event: string, params?: EventParams) => void;
  optIn?: () => void;
  optOut?: () => void;
};

const gaDenied = {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
} as const;

function updateGaConsent(analyticsStorage: 'granted' | 'denied') {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') return;
  window.gtag('consent', 'update', {
    ...gaDenied,
    analytics_storage: analyticsStorage,
  });
}

export const gaProvider: AnalyticsProvider = {
  name: 'ga',
  capture(event, params) {
    if (typeof window === 'undefined') return;
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', event, params || {});
  },
  optIn() {
    updateGaConsent('granted');
  },
  optOut() {
    updateGaConsent('denied');
  },
};

export const posthogProvider: AnalyticsProvider = {
  name: 'posthog',
  capture(event, params) {
    void import('@/lib/posthog').then(({ posthogCapture }) => {
      void posthogCapture(event, params);
    });
  },
  optIn() {
    void import('@/lib/posthog').then(({ posthogOptIn }) => {
      void posthogOptIn();
    });
  },
  optOut() {
    void import('@/lib/posthog').then(({ posthogOptOut }) => {
      void posthogOptOut();
    });
  },
};

export const analyticsProviders: AnalyticsProvider[] = [
  gaProvider,
  posthogProvider,
];
