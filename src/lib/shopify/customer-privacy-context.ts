import 'server-only';

import { STOREFRONT_ROOT_DOMAIN } from '@/lib/config/public';
import {
  SHOPIFY_STORE_DOMAIN,
  SHOPIFY_STOREFRONT_API_TOKEN,
} from '@/lib/config/server';
import { getCountryCode } from './country';
import type { CustomerPrivacyContext } from './customer-privacy';

function isPublicStorefrontToken(token: string): boolean {
  if (!token) return false;
  return !(
    token.startsWith('shpat_') ||
    token.startsWith('shfpt_') ||
    token.startsWith('shpss_')
  );
}

export async function getCustomerPrivacyContext(): Promise<CustomerPrivacyContext | null> {
  const token = SHOPIFY_STOREFRONT_API_TOKEN.trim();
  if (!SHOPIFY_STORE_DOMAIN || !isPublicStorefrontToken(token)) return null;
  return {
    storefrontAccessToken: token,
    checkoutRootDomain: SHOPIFY_STORE_DOMAIN,
    storefrontRootDomain: STOREFRONT_ROOT_DOMAIN,
    country: await getCountryCode(),
  };
}
