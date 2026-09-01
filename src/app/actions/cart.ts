'use server';

import { revalidatePath } from 'next/cache';
import { logger } from '@/lib/log';
import { addToCart, removeCartLine } from '@/lib/shopify/cart';

const log = logger('cart');

export async function addToCartAction(formData: FormData) {
  const merchandiseId = String(formData.get('merchandiseId') || '');
  const productHandle = String(formData.get('productHandle') || '');
  const sellingPlanId = String(formData.get('sellingPlanId') || '');
  if (!merchandiseId) {
    log.warn('addToCart missing variant', { productHandle });
    throw new Error('Missing variant');
  }

  await addToCart({
    merchandiseId,
    productHandle,
    sellingPlanId: sellingPlanId || null,
  });
  revalidatePath('/cart');
  revalidatePath(`/products/${productHandle}`);
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
