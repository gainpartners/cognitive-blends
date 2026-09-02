import 'server-only';

import { cache } from 'react';
import { errorFields, logger } from '@/lib/log';
import { pinAppliedCountry } from './country';
import { LOCALIZATION_QUERY } from './queries';
import { storefrontFetch } from './storefront';
import type { Localization } from './types';

const log = logger('localization');

export const getLocalization = cache(async (): Promise<Localization | null> => {
  try {
    const data = await storefrontFetch<{ localization: Localization }>(
      LOCALIZATION_QUERY,
      undefined,
      { revalidate: 300 },
    );
    if (data.localization?.country.isoCode) {
      pinAppliedCountry(data.localization.country.isoCode);
    }
    return data.localization;
  } catch (error) {
    log.warn('localization query failed', errorFields(error));
    return null;
  }
});
