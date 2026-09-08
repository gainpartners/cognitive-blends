'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { footer } from '@/content/footer';
import type { Localization } from '@/lib/shopify/types';
import { AccountIcon, CloseIcon, InstagramIcon, MenuIcon } from './icons';
import { CountrySelector } from './CountrySelector';
import { NavLinks } from './NavLinks';

export function NavDrawer({
  accountUrl,
  localization,
}: {
  accountUrl: string;
  localization: Localization | null;
}) {
  const pathname = usePathname();
  return <NavDrawerInner key={pathname} accountUrl={accountUrl} localization={localization} />;
}

function NavDrawerInner({
  accountUrl,
  localization,
}: {
  accountUrl: string;
  localization: Localization | null;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const header = document.querySelector('.site-header');
    if (!header) return;

    function syncHeight() {
      const height = header.getBoundingClientRect().height;
      document.documentElement.style.setProperty('--nav-h', `${height}px`);
    }

    function onResize() {
      syncHeight();
      if (window.matchMedia('(min-width: 861px)').matches) {
        setOpen(false);
      }
    }

    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(header);
    window.addEventListener('resize', onResize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('nav-lock', open);

    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    if (open) document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.classList.remove('nav-lock');
    };
  }, [open]);

  return (
    <div className={open ? 'nav-drawer is-open' : 'nav-drawer'}>
      <button
        type="button"
        className="header-icon"
        aria-label={open ? 'Close' : 'Menu'}
        aria-expanded={open}
        aria-controls="nav-menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="nav-drawer__icon nav-drawer__icon--menu">
          <MenuIcon />
        </span>
        <span className="nav-drawer__icon nav-drawer__icon--close">
          <CloseIcon />
        </span>
      </button>
      {open
        ? createPortal(
            <div className="nav-drawer__panel" id="nav-menu" role="dialog" aria-label="Menu">
              <NavLinks label="Menu" />
              <div className="nav-drawer__util">
                <a href={accountUrl} className="nav-drawer__account">
                  <AccountIcon />
                  Log in
                </a>
                {localization ? (
                  <CountrySelector
                    current={localization.country}
                    countries={localization.availableCountries}
                  />
                ) : null}
                <a
                  href={footer.instagram.href}
                  rel="noreferrer"
                  target="_blank"
                  className="nav-drawer__social"
                  aria-label={footer.instagram.label}
                >
                  <InstagramIcon />
                </a>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
