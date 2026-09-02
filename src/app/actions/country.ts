'use server';

import { refresh, revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { getCartId, updateCartBuyerIdentity } from '@/lib/shopify/cart';
import {
  COUNTRY_COOKIE,
  countryCookieOptions,
  isAvailableCountry,
  normalizeCountryCode,
} from '@/lib/shopify/country';
import { getLocalization } from '@/lib/shopify/localization';

export async function setCountryAction(code: string) {
  const country = normalizeCountryCode(code);
  if (!country) return;

  const localization = await getLocalization();
  if (
    localization &&
    !isAvailableCountry(country, localization.availableCountries)
  ) {
    return;
  }

  (await cookies()).set(COUNTRY_COOKIE, country, countryCookieOptions());

  const cartId = await getCartId();
  if (cartId) await updateCartBuyerIdentity(cartId, country);

  revalidatePath('/', 'layout');
  refresh();
}
