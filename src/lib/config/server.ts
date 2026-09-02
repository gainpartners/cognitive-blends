import 'server-only';

import { declare, oneOf, str } from './env';


export const SHOPIFY_STORE_DOMAIN = str(
  declare('SHOPIFY_STORE_DOMAIN', process.env.SHOPIFY_STORE_DOMAIN, 'required'),
  '',
);

export const SHOPIFY_STOREFRONT_API_TOKEN = str(
  declare(
    'SHOPIFY_STOREFRONT_API_TOKEN',
    process.env.SHOPIFY_STOREFRONT_API_TOKEN,
    'required',
  ),
  '',
);

export const SHOPIFY_STOREFRONT_API_VERSION = str(
  declare(
    'SHOPIFY_STOREFRONT_API_VERSION',
    process.env.SHOPIFY_STOREFRONT_API_VERSION,
    'defaulted',
  ),
  '2025-10',
);

export const SHOPIFY_SHOP_ID = str(
  declare('SHOPIFY_SHOP_ID', process.env.SHOPIFY_SHOP_ID, 'required'),
  '',
);

export const JUDGEME_API_TOKEN = str(
  declare('JUDGEME_API_TOKEN', process.env.JUDGEME_API_TOKEN, 'required'),
  '',
);

export const JUDGEME_SHOP_DOMAIN = str(
  declare('JUDGEME_SHOP_DOMAIN', process.env.JUDGEME_SHOP_DOMAIN, 'defaulted'),
  SHOPIFY_STORE_DOMAIN,
);

export const APPSTLE_SUBSCRIPTIONS_APP_NAME = str(
  declare(
    'APPSTLE_SUBSCRIPTIONS_APP_NAME',
    process.env.APPSTLE_SUBSCRIPTIONS_APP_NAME,
    'defaulted',
  ),
  'appstle',
);

export type SiteAccess = 'public' | 'preview' | 'coming-soon';

export const SITE_ACCESS: SiteAccess = oneOf(
  declare('SITE_ACCESS', process.env.SITE_ACCESS, 'defaulted'),
  ['public', 'preview', 'coming-soon'] as const,
  'preview',
);

export const ACCESS_PASSWORD = str(
  declare('ACCESS_PASSWORD', process.env.ACCESS_PASSWORD, 'required'),
  '',
);

export const ACCESS_SESSION_SECRET = str(
  declare('ACCESS_SESSION_SECRET', process.env.ACCESS_SESSION_SECRET, 'required'),
  '',
);

export function isStorefrontConfigured(): boolean {
  return SHOPIFY_STORE_DOMAIN.length > 0 && SHOPIFY_STOREFRONT_API_TOKEN.length > 0;
}

export function storefrontEndpoint(): string {
  return `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_STOREFRONT_API_VERSION}/graphql.json`;
}

export function shopOrigin(): string {
  return SHOPIFY_STORE_DOMAIN ? `https://${SHOPIFY_STORE_DOMAIN}` : '';
}

/** Shopify-hosted new customer accounts. Same destination as the live site Account link. */
export function shopifyHostedAccountUrl(): string | null {
  if (!SHOPIFY_SHOP_ID) return null;
  return `https://shopify.com/${SHOPIFY_SHOP_ID}/account`;
}


