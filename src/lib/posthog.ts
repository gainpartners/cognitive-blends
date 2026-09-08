/**
 * posthog-js is loaded dynamically so the server bundle never requires it.
 */

import { POSTHOG_HOST, POSTHOG_KEY, isPostHogConfigured } from '@/lib/config/public';
import { isAnalyticsAllowed } from '@/lib/cookie-consent';

export { isPostHogConfigured };

type PostHogClient = {
  init: (key: string, options: Record<string, unknown>) => void;
  opt_in_capturing: () => void;
  opt_out_capturing: () => void;
  has_opted_out_capturing: () => boolean;
  capture: (
    event: string,
    properties?: Record<string, string | number | boolean | null>,
  ) => void;
  debug: () => void;
};

let initPromise: Promise<PostHogClient | null> | null = null;

function ensureInit(): Promise<PostHogClient | null> {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (!isPostHogConfigured()) return Promise.resolve(null);
  if (initPromise) return initPromise;

  initPromise = import('posthog-js').then((mod) => {
    const ph = (mod.default ?? mod) as PostHogClient;
    ph.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      person_profiles: 'identified_only',
      capture_pageview: false,
      capture_pageleave: true,
      persistence: 'localStorage+cookie',
      opt_out_capturing_by_default: true,
      loaded: (instance: PostHogClient) => {
        if (process.env.NODE_ENV === 'development') {
          instance.debug?.();
        }
      },
    });
    return ph;
  });

  return initPromise;
}

export async function posthogOptIn(path?: string) {
  const ph = await ensureInit();
  if (!ph) return;
  if (!isAnalyticsAllowed()) {
    ph.opt_out_capturing();
    return;
  }
  ph.opt_in_capturing();
  if (path) {
    ph.capture('$pageview', { $current_url: window.location.href, path });
  }
}

export async function posthogOptOut() {
  if (!initPromise) return;
  const ph = await initPromise;
  if (!ph) return;
  ph.opt_out_capturing();
}

export async function posthogCapture(
  event: string,
  properties?: Record<string, string | number | boolean | null | undefined>,
) {
  if (typeof window === 'undefined') return;
  const ph = await ensureInit();
  if (!ph) return;
  if (!isAnalyticsAllowed() || ph.has_opted_out_capturing()) return;

  const clean: Record<string, string | number | boolean | null> = {};
  if (properties) {
    for (const [k, v] of Object.entries(properties)) {
      if (v !== undefined) clean[k] = v;
    }
  }
  ph.capture(event, clean);
}

export async function posthogPageview(path: string) {
  await posthogOptIn(path);
}
