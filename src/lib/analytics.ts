import { isAnalyticsAllowed } from '@/lib/cookie-consent';
import {
  analyticsProviders,
  type EventParams,
} from '@/lib/analytics-providers';

export type { EventParams };

export function trackEvent(name: string, params?: EventParams) {
  if (typeof window === 'undefined') return;
  if (!isAnalyticsAllowed()) return;
  for (const provider of analyticsProviders) {
    provider.capture(name, params);
  }
}

export function applyAnalyticsConsent(allowed: boolean) {
  if (typeof window === 'undefined') return;
  for (const provider of analyticsProviders) {
    if (allowed) provider.optIn?.();
    else provider.optOut?.();
  }
}
