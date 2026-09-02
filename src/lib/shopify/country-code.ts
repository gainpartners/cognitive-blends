export const COUNTRY_COOKIE = 'cb_country';
export const DEFAULT_COUNTRY = 'IE';
export const COUNTRY_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const UNKNOWN_GEO_CODES = new Set(['XX', 'T1', 'A1', 'A2']);

export function countryCookieOptions() {
  return {
    path: '/',
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    maxAge: COUNTRY_COOKIE_MAX_AGE,
    httpOnly: true,
  };
}

export function normalizeCountryCode(
  raw: string | null | undefined,
): string | null {
  if (!raw) return null;
  const code = raw.trim().toUpperCase();
  if (code === 'UK') return 'GB';
  if (UNKNOWN_GEO_CODES.has(code)) return null;
  if (!/^[A-Z]{2}$/.test(code)) return null;
  return code;
}

export function resolveCountryCode(
  cookie: string | undefined,
  ipCountry: string | undefined,
): string {
  return (
    normalizeCountryCode(cookie) ??
    normalizeCountryCode(ipCountry) ??
    DEFAULT_COUNTRY
  );
}

export function isAvailableCountry(
  code: string,
  countries: { isoCode: string }[],
): boolean {
  return countries.some((country) => country.isoCode === code);
}

export function isCountryContextError(message: string): boolean {
  return /\$country|CountryCode|country provided is not supported|inContext/i.test(
    message,
  );
}

export function countryFromRequestHeaders(headers: Headers): string | undefined {
  return (
    headers.get('x-vercel-ip-country') ??
    headers.get('cf-ipcountry') ??
    headers.get('cloudfront-viewer-country') ??
    undefined
  );
}

export function buyerIpFromRequestHeaders(headers: Headers): string | undefined {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return headers.get('x-real-ip') ?? undefined;
}
