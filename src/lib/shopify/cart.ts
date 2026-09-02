import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { errorFields, logger } from '@/lib/log';
import { storefrontFetch, StorefrontError } from './storefront';
import {
  CART_BUYER_IDENTITY_UPDATE,
  CART_CREATE,
  CART_LINES_ADD,
  CART_LINES_REMOVE,
  CART_QUERY,
  PRODUCT_QUERY,
} from './queries';
import { APPSTLE_SUBSCRIPTIONS_APP_NAME } from '@/lib/config/server';
import { getCountryCode } from './country';
import { getLocalization } from './localization';
import { isAllowedSellingPlanId } from './selling-plans';
import type { Cart, Product } from './types';

const log = logger('cart');
const CART_COOKIE = 'cb_cart';

export async function getCartId(): Promise<string | undefined> {
  return (await cookies()).get(CART_COOKIE)?.value;
}

async function setCartId(id: string) {
  (await cookies()).set(CART_COOKIE, id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
}

export const getCart = cache(async (): Promise<Cart | null> => {
  const id = await getCartId();
  if (!id) return null;
  try {
    await getLocalization();
    const data = await storefrontFetch<{ cart: Cart | null }>(CART_QUERY, { id });
    const cart = data.cart;
    if (!cart) return null;
    const country = await getCountryCode();
    const cartCountry = cart.buyerIdentity?.countryCode ?? null;
    if (cartCountry !== country) {
      const updated = await updateCartBuyerIdentity(id, country);
      if (!updated) {
        log.warn('cart identity out of date; omitting cart');
        return null;
      }
      return updated;
    }
    return cart;
  } catch (error) {
    log.warn('getCart failed; treating as empty', errorFields(error));
    return null;
  }
});

export async function updateCartBuyerIdentity(
  cartId: string,
  countryCode: string,
): Promise<Cart | null> {
  try {
    const updated = await storefrontFetch<{
      cartBuyerIdentityUpdate: {
        cart: Cart | null;
        userErrors: { message: string }[];
      };
    }>(CART_BUYER_IDENTITY_UPDATE, {
      cartId,
      buyerIdentity: { countryCode },
    });
    const err = updated.cartBuyerIdentityUpdate.userErrors[0];
    if (err) {
      log.warn('cartBuyerIdentityUpdate userError', { message: err.message });
      return null;
    }
    return updated.cartBuyerIdentityUpdate.cart;
  } catch (error) {
    log.warn('cartBuyerIdentityUpdate failed', errorFields(error));
    return null;
  }
}

type AddInput = {
  merchandiseId: string;
  quantity?: number;
  sellingPlanId?: string | null;
  productHandle?: string;
};

export async function addToCart({
  merchandiseId,
  quantity = 1,
  sellingPlanId,
  productHandle,
}: AddInput): Promise<Cart> {
  if (sellingPlanId) {
    if (!productHandle) {
      log.warn('subscription add missing product handle', { merchandiseId });
      throw new StorefrontError('Product handle is required for subscriptions', 400);
    }
    const data = await storefrontFetch<{ product: Product | null }>(
      PRODUCT_QUERY,
      { handle: productHandle },
    );
    const allowed = isAllowedSellingPlanId(
      data.product?.sellingPlanGroups.nodes,
      sellingPlanId,
      APPSTLE_SUBSCRIPTIONS_APP_NAME,
    );
    if (!allowed) {
      log.warn('rejected non-Appstle selling plan', {
        productHandle,
        sellingPlanId,
      });
      throw new StorefrontError('That subscription plan is not available', 400);
    }
  }

  const line = {
    merchandiseId,
    quantity,
    ...(sellingPlanId ? { sellingPlanId } : {}),
  };

  const cartId = await getCartId();
  if (!cartId) {
    const country = await getCountryCode();
    const created = await storefrontFetch<{
      cartCreate: { cart: Cart | null; userErrors: { message: string }[] };
    }>(CART_CREATE, {
      input: { lines: [line], buyerIdentity: { countryCode: country } },
    });
    const err = created.cartCreate.userErrors[0];
    if (err) {
      log.warn('cartCreate userError', { message: err.message });
      throw new StorefrontError(err.message, 400);
    }
    if (!created.cartCreate.cart) {
      log.error('cartCreate returned no cart');
      throw new StorefrontError('Could not create cart', 502);
    }
    await setCartId(created.cartCreate.cart.id);
    return created.cartCreate.cart;
  }

  const added = await storefrontFetch<{
    cartLinesAdd: { cart: Cart | null; userErrors: { message: string }[] };
  }>(CART_LINES_ADD, { cartId, lines: [line] });
  const err = added.cartLinesAdd.userErrors[0];
  if (err) {
    log.warn('cartLinesAdd userError', { message: err.message });
    throw new StorefrontError(err.message, 400);
  }
  if (!added.cartLinesAdd.cart) {
    log.error('cartLinesAdd returned no cart');
    throw new StorefrontError('Could not update cart', 502);
  }
  return added.cartLinesAdd.cart;
}

export async function removeCartLine(lineId: string): Promise<Cart | null> {
  const cartId = await getCartId();
  if (!cartId) return null;
  const removed = await storefrontFetch<{
    cartLinesRemove: { cart: Cart | null; userErrors: { message: string }[] };
  }>(CART_LINES_REMOVE, { cartId, lineIds: [lineId] });
  const err = removed.cartLinesRemove.userErrors[0];
  if (err) {
    log.warn('cartLinesRemove userError', { message: err.message });
    throw new StorefrontError(err.message, 400);
  }
  return removed.cartLinesRemove.cart;
}
