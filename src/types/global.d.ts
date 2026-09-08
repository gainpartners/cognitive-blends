interface Window {
  openConsentBanner?: () => void;
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
}
