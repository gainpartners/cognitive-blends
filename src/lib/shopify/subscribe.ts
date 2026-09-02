import 'server-only';

import { randomBytes } from 'node:crypto';
import { isStorefrontConfigured } from '@/lib/config/server';
import { errorFields, logger } from '@/lib/log';
import { CUSTOMER_CREATE } from './queries';
import { storefrontFetch } from './storefront';
import {
  isAlreadyCustomerError,
  parseSubscribeFields,
  type SubscribeState,
} from './subscribe-fields';

const log = logger('subscribe');

type CustomerCreatePayload = {
  customerCreate: {
    customer: { id: string } | null;
    customerUserErrors: { code?: string | null; field?: string[] | null; message: string }[];
  };
};

function oneTimePassword(): string {
  return randomBytes(24).toString('base64url');
}

export async function subscribeFromForm(
  formData: FormData,
  options: { requireName?: boolean } = {},
): Promise<SubscribeState> {
  const parsed = parseSubscribeFields(formData, options);
  if (!parsed.ok) return { ok: false, error: parsed.error };

  if (!isStorefrontConfigured()) {
    log.warn('subscribe skipped; storefront is not configured');
    return { ok: false, error: 'Could not subscribe. Try again.' };
  }

  try {
    const data = await storefrontFetch<CustomerCreatePayload>(CUSTOMER_CREATE, {
      input: {
        email: parsed.fields.email,
        firstName: parsed.fields.firstName || undefined,
        lastName: parsed.fields.lastName || undefined,
        password: oneTimePassword(),
        acceptsMarketing: true,
      },
    });
    const err = data.customerCreate.customerUserErrors[0];
    if (err) {
      if (isAlreadyCustomerError(err.code, err.message)) {
        return { ok: true, error: null, alreadyOnList: true };
      }
      log.warn('customerCreate userError', { code: err.code ?? null });
      return { ok: false, error: 'Could not subscribe. Try again.' };
    }
    if (!data.customerCreate.customer) {
      log.warn('customerCreate returned no customer');
      return { ok: false, error: 'Could not subscribe. Try again.' };
    }
    return { ok: true, error: null };
  } catch (error) {
    log.error('subscribe failed', errorFields(error));
    return { ok: false, error: 'Could not subscribe. Try again.' };
  }
}
