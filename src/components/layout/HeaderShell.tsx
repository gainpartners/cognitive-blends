import Image from 'next/image';
import Link from 'next/link';
import { brand } from '@/content/brand';
import { homeHref } from '@/content/nav';
import type { Localization } from '@/lib/shopify/types';
import { AccountIcon, CartIcon } from './icons';
import { CountrySelector } from './CountrySelector';
import { SearchProvider, SearchTrigger } from './HeaderSearch';
import { NavDrawer } from './NavDrawer';
import { NavLinks } from './NavLinks';

export function HeaderShell({
  qty,
  localization,
  accountUrl,
  preloadLogo = false,
}: {
  qty: number;
  localization: Localization | null;
  accountUrl: string;
  preloadLogo?: boolean;
}) {
  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <SearchProvider>
          <div className="site-header__bar">
            <div className="header-left">
              <NavDrawer />
              <SearchTrigger className="header-search--desktop" />
            </div>
            <Link href={homeHref} className="wordmark">
              <Image
                src={brand.logo.wordmark}
                alt={brand.name}
                width={180}
                height={48}
                sizes="180px"
                preload={preloadLogo}
              />
            </Link>
            <div className="header-tools">
              {localization ? (
                <CountrySelector
                  current={localization.country}
                  countries={localization.availableCountries}
                />
              ) : null}
              <SearchTrigger className="header-search--mobile" />
              <a href={accountUrl} className="header-icon header-account" aria-label="Account">
                <AccountIcon />
              </a>
              <Link
                href="/cart"
                className="header-icon header-cart"
                aria-label={qty ? `Cart, ${qty} items` : 'Cart'}
              >
                <CartIcon />
                {qty ? <span className="cart-count">{qty}</span> : null}
              </Link>
            </div>
          </div>
          <NavLinks className="nav-links--desktop" label="Primary" />
        </SearchProvider>
      </div>
    </header>
  );
}
