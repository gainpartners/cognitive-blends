'use server';

import { subscribeFromForm } from '@/lib/shopify/subscribe';
import type { SubscribeState } from '@/lib/shopify/subscribe-fields';

export async function subscribeAction(
  _prev: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  const requireName = String(formData.get('requireName') ?? '') === '1';
  return subscribeFromForm(formData, { requireName });
}
