import 'server-only';

import { isStorefrontConfigured, shopOrigin } from '@/lib/config/server';
import { errorFields, logger } from '@/lib/log';
import { isValidEmail } from './subscribe-fields';

const log = logger('contact');

export type ContactState = {
  ok: boolean;
  error: string | null;
  name: string;
  email: string;
  phone: string;
  comment: string;
};

function postedFields(formData: FormData): Omit<ContactState, 'ok' | 'error'> {
  return {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    comment: String(formData.get('comment') ?? ''),
  };
}

const REQUEST_TIMEOUT_MS = 15_000;

function posted(location: string | null): boolean {
  if (!location) return false;
  try {
    return new URL(location, 'https://example.com').searchParams.get('contact_posted') === 'true';
  } catch {
    return location.includes('contact_posted=true');
  }
}

export async function sendContactForm(formData: FormData): Promise<ContactState> {
  const fields = postedFields(formData);
  const name = fields.name.trim();
  const email = fields.email.trim();
  const phone = fields.phone.trim();
  const comment = fields.comment.trim();

  if (!isValidEmail(email)) {
    return { ok: false, error: 'Email is invalid', ...fields };
  }

  if (!isStorefrontConfigured()) {
    log.warn('contact skipped; storefront is not configured');
    return { ok: false, error: 'Could not send. Try again.', ...fields };
  }

  const body = new URLSearchParams({
    form_type: 'contact',
    utf8: '✓',
    'contact[Name]': name,
    'contact[email]': email,
    'contact[Phone number]': phone,
    'contact[Comment]': comment,
  });

  try {
    const response = await fetch(`${shopOrigin()}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Accept: 'text/html',
      },
      body,
      redirect: 'manual',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    const location = response.headers.get('Location');
    if (posted(location)) return { ok: true, error: null, ...fields };
    if (response.ok) {
      const html = await response.text();
      if (html.includes('contact_posted=true') || /thanks for contacting/i.test(html)) {
        return { ok: true, error: null, ...fields };
      }
    }
    log.warn('contact form rejected', { status: response.status });
    return { ok: false, error: 'Could not send. Try again.', ...fields };
  } catch (error) {
    log.error('contact form failed', errorFields(error));
    return { ok: false, error: 'Could not send. Try again.', ...fields };
  }
}
