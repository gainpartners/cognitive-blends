'use server';

import { revalidatePath } from 'next/cache';
import { logger } from '@/lib/log';
import { addToCart, removeCartLine } from '@/lib/shopify/cart';

const log = logger('cart');

export async function addToCartAction(formData: FormData) {
  const merchandiseId = String(formData.get('merchandiseId') || '');
  const productHandle = String(formData.get('productHandle') || '');
  const sellingPlanId = String(formData.get('sellingPlanId') || '');
  const rawQty = Number.parseInt(String(formData.get('quantity') || '1'), 10);
  const quantity = Number.isFinite(rawQty) ? Math.min(99, Math.max(1, rawQty)) : 1;
  if (!merchandiseId) {
    log.warn('addToCart missing variant', { productHandle });
    throw new Error('Missing variant');
  }

  const cart = await addToCart({
    merchandiseId,
    productHandle,
    sellingPlanId: sellingPlanId || null,
    quantity,
  });
  revalidatePath('/cart');
  revalidatePath(`/products/${productHandle}`);
  return { checkoutUrl: cart.checkoutUrl };
}

export async function removeCartLineAction(formData: FormData) {
  const lineId = String(formData.get('lineId') || '');
  if (!lineId) {
    log.warn('removeCartLine missing lineId');
    return;
  }
  await removeCartLine(lineId);
  revalidatePath('/cart');
}
