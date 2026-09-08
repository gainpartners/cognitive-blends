'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { GA4_ID, isGaConfigured } from '@/lib/config/public';
import { gaProvider } from '@/lib/analytics-providers';
import { useConsent } from '@/components/analytics/useConsent';

function ensureGtag() {
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
  }
}

export function GoogleAnalytics() {
  const { ready, consent } = useConsent();
  const allowed = ready && consent?.analytics === true && isGaConfigured();

  useEffect(() => {
    if (!isGaConfigured()) return;
    if (!allowed) {
      gaProvider.optOut?.();
      return;
    }
    ensureGtag();
    gaProvider.optIn?.();
    window.gtag?.('js', new Date());
    window.gtag?.('config', GA4_ID, { anonymize_ip: true });
  }, [allowed]);

  if (!allowed) return null;

  return (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
      strategy="afterInteractive"
    />
  );
}
