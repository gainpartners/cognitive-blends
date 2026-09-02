'use server';

import { sendContactForm, type ContactState } from '@/lib/shopify/contact';

export async function contactAction(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  return sendContactForm(formData);
}
