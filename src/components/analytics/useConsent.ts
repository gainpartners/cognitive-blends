'use client';

import { useSyncExternalStore } from 'react';
import {
  readConsent,
  subscribeConsent,
  type CookieConsent,
} from '@/lib/cookie-consent';

type Snapshot = CookieConsent | null | 'pending';

function subscribe(onChange: () => void) {
  return subscribeConsent(() => onChange());
}

function getSnapshot(): Snapshot {
  return readConsent();
}

function getServerSnapshot(): Snapshot {
  return 'pending';
}

export function useConsent(): {
  ready: boolean;
  consent: CookieConsent | null;
} {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  if (snapshot === 'pending') return { ready: false, consent: null };
  return { ready: true, consent: snapshot };
}
