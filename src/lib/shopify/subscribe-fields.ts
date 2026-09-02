export type SubscribeFields = {
  email: string;
  firstName: string;
  lastName: string;
};

export type SubscribeState = {
  ok: boolean;
  error: string | null;
  alreadyOnList?: boolean;
};

export const idleSubscribeState: SubscribeState = { ok: false, error: null };

export type SubscribeParseResult =
  | { ok: true; fields: SubscribeFields }
  | { ok: false; error: string };

const EMAIL_PATTERN =
  /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{1,}$/;

export function isValidEmail(raw: string): boolean {
  const email = raw.trim();
  if (!email || email.length > 254) return false;
  return EMAIL_PATTERN.test(email);
}

export function parseSubscribeFields(
  formData: FormData,
  options: { requireName?: boolean } = {},
): SubscribeParseResult {
  const email = String(formData.get('email') ?? '').trim();
  const firstName = String(formData.get('firstName') ?? '').trim();
  const lastName = String(formData.get('lastName') ?? '').trim();

  if (options.requireName && !firstName) {
    return { ok: false, error: 'First name is required' };
  }
  if (options.requireName && !lastName) {
    return { ok: false, error: 'Last name is required' };
  }
  if (!isValidEmail(email)) {
    return { ok: false, error: 'Email is invalid' };
  }

  return { ok: true, fields: { email, firstName, lastName } };
}

export function isAlreadyCustomerError(
  code: string | null | undefined,
  message: string,
): boolean {
  if (code === 'TAKEN') return true;
  return /already been taken/i.test(message);
}
