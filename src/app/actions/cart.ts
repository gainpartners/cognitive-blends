'use server';

import { revalidatePath } from 'next/cache';
import { addToCart, removeCartLine } from '@/lib/shopify/cart';

export async function addToCartAction(formData: FormData) {
  const merchandiseId = String(formData.get('merchandiseId') || '');
  const productHandle = String(formData.get('productHandle') || '');
  const sellingPlanId = String(formData.get('sellingPlanId') || '');
  if (!merchandiseId) throw new Error('Missing variant');

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
  if (!lineId) return;
  await removeCartLine(lineId);
  revalidatePath('/cart');
}
