'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useConsent } from '@/components/analytics/useConsent';
import { applyAnalyticsConsent } from '@/lib/analytics';
import { readConsent, writeConsent } from '@/lib/cookie-consent';
import {
  syncShopifyConsent,
  type CustomerPrivacyContext,
} from '@/lib/shopify/customer-privacy';

type View = 'banner' | 'settings' | 'hidden';

function isQuietPath(pathname: string | null) {
  return (
    pathname === '/privacy' ||
    pathname === '/cookie-policy' ||
    Boolean(pathname?.startsWith('/brand'))
  );
}

const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function CookieConsent({
  privacy,
}: {
  privacy: CustomerPrivacyContext | null;
}) {
  const pathname = usePathname();
  const { ready, consent } = useConsent();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toggleOverride, setToggleOverride] = useState<boolean | null>(null);
  const switchId = useId();
  const hintId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  const toggle = toggleOverride ?? consent?.analytics ?? false;
  const view: View = settingsOpen
    ? 'settings'
    : !ready
      ? 'hidden'
      : consent
        ? 'hidden'
        : isQuietPath(pathname)
          ? 'hidden'
          : 'banner';

  useEffect(() => {
    window.openConsentBanner = () => {
      const current = readConsent();
      setToggleOverride(current ? current.analytics : false);
      setSettingsOpen(true);
    };
    return () => {
      delete window.openConsentBanner;
    };
  }, []);

  useEffect(() => {
    if (!consent) return;
    applyAnalyticsConsent(consent.analytics);
    void syncShopifyConsent(consent.analytics, privacy);
  }, [consent, privacy]);

  useEffect(() => {
    if (view === 'hidden') return;
    previousFocus.current = document.activeElement as HTMLElement | null;
    const root = dialogRef.current;
    const title = root?.querySelector('h2');
    if (title instanceof HTMLElement) {
      title.tabIndex = -1;
      title.focus();
    }
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Tab' || !root) return;
      const nodes = [
        ...root.querySelectorAll<HTMLElement>(FOCUSABLE),
      ].filter((el) => !el.hasAttribute('disabled'));
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      previousFocus.current?.focus();
    };
  }, [view]);

  function acceptAll() {
    writeConsent(true);
    setToggleOverride(null);
    setSettingsOpen(false);
  }

  function saveSettings() {
    writeConsent(toggle);
    setToggleOverride(null);
    setSettingsOpen(false);
  }

  function cancelSettings() {
    setToggleOverride(null);
    setSettingsOpen(false);
  }

  if (view === 'hidden') return null;

  return (
    <div className="cookie-consent" role="presentation">
      <div className="cookie-consent__backdrop" aria-hidden="true" />
      <div
        ref={dialogRef}
        className="cookie-consent__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-consent-title"
      >
        {view === 'banner' ? (
          <>
            <h2 id="cookie-consent-title">Cookies</h2>
            <p className="cookie-consent__intro">
              We use essential cookies to run the shop. Accept if you are happy
              for us to measure how it is used.{' '}
              <Link href="/cookie-policy">Cookie policy</Link>
            </p>
            <div className="cookie-consent__actions">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setToggleOverride(false);
                  setSettingsOpen(true);
                }}
              >
                Manage settings
              </Button>
              <Button type="button" onClick={acceptAll}>
                Accept
              </Button>
            </div>
          </>
        ) : (
          <>
            <h2 id="cookie-consent-title">Cookie settings</h2>
            <ul className="cookie-consent__list">
              <li className="cookie-consent__row">
                <div className="cookie-consent__row-text">
                  <p className="cookie-consent__row-title">Essential</p>
                  <p className="cookie-consent__row-hint">
                    Cart, country, and remembering this choice.
                  </p>
                </div>
                <span className="cookie-consent__always">Always on</span>
              </li>
              <li className="cookie-consent__row">
                <div className="cookie-consent__row-text">
                  <p className="cookie-consent__row-title">
                    <label htmlFor={switchId}>Analytics</label>
                  </p>
                  <p id={hintId} className="cookie-consent__row-hint">
                    Optional. Which pages people open.
                  </p>
                </div>
                <button
                  type="button"
                  id={switchId}
                  className="cookie-consent__switch"
                  role="switch"
                  aria-checked={toggle}
                  aria-describedby={hintId}
                  onClick={() => setToggleOverride(!toggle)}
                >
                  <span className="cookie-consent__switch-knob" />
                </button>
              </li>
            </ul>
            {consent?.analytics === true && !toggle ? (
              <p className="cookie-consent__note">
                Reload the page if you want analytics to stop immediately.
              </p>
            ) : null}
            <p className="cookie-consent__policy">
              <Link href="/cookie-policy">Cookie policy</Link>
            </p>
            <div className="cookie-consent__actions">
              <Button type="button" variant="ghost" onClick={cancelSettings}>
                Cancel
              </Button>
              <Button type="button" onClick={saveSettings}>
                Save
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
