import { declare, str } from './env';

export const GA4_ID = str(
  declare('NEXT_PUBLIC_GA4_ID', process.env.NEXT_PUBLIC_GA4_ID, 'feature'),
  '',
);

export const POSTHOG_KEY = str(
  declare(
    'NEXT_PUBLIC_POSTHOG_KEY',
    process.env.NEXT_PUBLIC_POSTHOG_KEY,
    'feature',
  ),
  '',
);

export const POSTHOG_HOST = str(
  declare(
    'NEXT_PUBLIC_POSTHOG_HOST',
    process.env.NEXT_PUBLIC_POSTHOG_HOST,
    'defaulted',
  ),
  'https://eu.i.posthog.com',
);

export function isGaConfigured(): boolean {
  return GA4_ID.length > 0;
}

export function isPostHogConfigured(): boolean {
  return POSTHOG_KEY.length > 0;
}

export const STOREFRONT_ROOT_DOMAIN = str(
  declare(
    'NEXT_PUBLIC_STOREFRONT_DOMAIN',
    process.env.NEXT_PUBLIC_STOREFRONT_DOMAIN,
    'feature',
  ),
  '',
);
