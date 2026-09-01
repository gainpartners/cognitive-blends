import 'server-only';
import { cookies } from 'next/headers';
import { storefrontFetch, StorefrontError } from './storefront';
import {
  CART_CREATE,
  CART_LINES_ADD,
  CART_LINES_REMOVE,
  CART_QUERY,
  PRODUCT_QUERY,
} from './queries';
import { APPSTLE_SUBSCRIPTIONS_APP_NAME } from '@/lib/config/server';
import { isAllowedSellingPlanId } from './selling-plans';
import type { Cart, Product } from './types';

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

export async function getCart(): Promise<Cart | null> {
  const id = await getCartId();
  if (!id) return null;
  try {
    const data = await storefrontFetch<{ cart: Cart | null }>(CART_QUERY, { id });
    return data.cart;
  } catch {
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
    const created = await storefrontFetch<{
      cartCreate: { cart: Cart | null; userErrors: { message: string }[] };
    }>(CART_CREATE, { input: { lines: [line] } });
    const err = created.cartCreate.userErrors[0];
    if (err) throw new StorefrontError(err.message, 400);
    if (!created.cartCreate.cart) throw new StorefrontError('Could not create cart', 502);
    await setCartId(created.cartCreate.cart.id);
    return created.cartCreate.cart;
  }

  const added = await storefrontFetch<{
    cartLinesAdd: { cart: Cart | null; userErrors: { message: string }[] };
  }>(CART_LINES_ADD, { cartId, lines: [line] });
  const err = added.cartLinesAdd.userErrors[0];
  if (err) throw new StorefrontError(err.message, 400);
  if (!added.cartLinesAdd.cart) throw new StorefrontError('Could not update cart', 502);
  return added.cartLinesAdd.cart;
}

export async function removeCartLine(lineId: string): Promise<Cart | null> {
  const cartId = await getCartId();
  if (!cartId) return null;
  const removed = await storefrontFetch<{
    cartLinesRemove: { cart: Cart | null; userErrors: { message: string }[] };
  }>(CART_LINES_REMOVE, { cartId, lineIds: [lineId] });
  const err = removed.cartLinesRemove.userErrors[0];
  if (err) throw new StorefrontError(err.message, 400);
  return removed.cartLinesRemove.cart;
}
