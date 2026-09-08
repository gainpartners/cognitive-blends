'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  isPostHogConfigured,
  posthogOptIn,
  posthogOptOut,
} from '@/lib/posthog';
import { isAnalyticsAllowed, subscribeConsent } from '@/lib/cookie-consent';

export function PostHogProvider() {
  const pathname = usePathname();

  useEffect(() => {
    if (!isPostHogConfigured()) return;
    if (pathname?.startsWith('/brand')) return;

    const path = pathname || '/';
    const apply = (allowed: boolean) => {
      if (allowed) void posthogOptIn(path);
      else void posthogOptOut();
    };

    apply(isAnalyticsAllowed());
    return subscribeConsent((c) => apply(c?.analytics === true));
  }, [pathname]);

  return null;
}
