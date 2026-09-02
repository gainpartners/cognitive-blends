import 'server-only';

import { cache } from 'react';
import { cookies, headers } from 'next/headers';
import {
  COUNTRY_COOKIE,
  buyerIpFromRequestHeaders,
  countryFromRequestHeaders,
  resolveCountryCode,
} from './country-code';

export {
  COUNTRY_COOKIE,
  DEFAULT_COUNTRY,
  countryCookieOptions,
  isAvailableCountry,
  normalizeCountryCode,
} from './country-code';

type CountrySlot = {
  requested?: Promise<string>;
  applied?: string;
};

const countrySlot = cache((): CountrySlot => ({}));

export function pinAppliedCountry(code: string) {
  countrySlot().applied = code;
}

export async function getCountryCode(): Promise<string> {
  const slot = countrySlot();
  if (slot.applied) return slot.applied;
  if (!slot.requested) {
    slot.requested = (async () => {
      const jar = await cookies();
      const hdrs = await headers();
      return resolveCountryCode(
        jar.get(COUNTRY_COOKIE)?.value,
        countryFromRequestHeaders(hdrs),
      );
    })();
  }
  return slot.requested;
}

export const getBuyerIp = cache(async (): Promise<string | undefined> => {
  return buyerIpFromRequestHeaders(await headers());
});
