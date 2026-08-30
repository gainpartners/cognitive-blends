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

export const CUSTOMER_ACCOUNT_API_CLIENT_ID = str(
  declare(
    'CUSTOMER_ACCOUNT_API_CLIENT_ID',
    process.env.CUSTOMER_ACCOUNT_API_CLIENT_ID,
    'required',
  ),
  '',
);

export const CUSTOMER_ACCOUNT_API_VERSION = str(
  declare(
    'CUSTOMER_ACCOUNT_API_VERSION',
    process.env.CUSTOMER_ACCOUNT_API_VERSION,
    'defaulted',
  ),
  '2025-10',
);

export const JUDGEME_API_TOKEN = str(
  declare('JUDGEME_API_TOKEN', process.env.JUDGEME_API_TOKEN, 'required'),
  '',
);

export const JUDGEME_SHOP_DOMAIN = str(
  declare('JUDGEME_SHOP_DOMAIN', process.env.JUDGEME_SHOP_DOMAIN, 'defaulted'),
  SHOPIFY_STORE_DOMAIN,
);

export const NATIVE_SUBSCRIPTIONS_APP_NAME = str(
  declare(
    'NATIVE_SUBSCRIPTIONS_APP_NAME',
    process.env.NATIVE_SUBSCRIPTIONS_APP_NAME,
    'feature',
  ),
  '',
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

export function isCustomerAccountConfigured(): boolean {
  return SHOPIFY_SHOP_ID.length > 0 && CUSTOMER_ACCOUNT_API_CLIENT_ID.length > 0;
}

export function storefrontEndpoint(): string {
  return `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_STOREFRONT_API_VERSION}/graphql.json`;
}

export function customerAccountGraphqlEndpoint(): string {
  return `https://shopify.com/${SHOPIFY_SHOP_ID}/account/customer/api/${CUSTOMER_ACCOUNT_API_VERSION}/graphql`;
}


