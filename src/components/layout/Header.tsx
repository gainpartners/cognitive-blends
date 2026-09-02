import Image from 'next/image';
import Link from 'next/link';
import { getCart } from '@/lib/shopify/cart';
import { isStorefrontConfigured, shopifyHostedAccountUrl } from '@/lib/config/server';
import { brand } from '@/content/brand';
import { homeHref } from '@/content/nav';
import { getLocalization } from '@/lib/shopify/localization';
import { AccountIcon, CartIcon } from './icons';
import { CountrySelector } from './CountrySelector';
import { HeaderSearch } from './HeaderSearch';
import { NavDrawer } from './NavDrawer';
import { NavLinks } from './NavLinks';

export async function Header() {
  const configured = isStorefrontConfigured();
  const [cart, localization] = configured
    ? await Promise.all([getCart(), getLocalization()])
    : [null, null];
  const accountUrl = shopifyHostedAccountUrl() ?? '/account';
  const qty = cart?.totalQuantity ?? 0;

  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <div className="site-header__bar">
          <div className="header-left">
            <NavDrawer />
            <HeaderSearch className="header-search--desktop" />
          </div>
          <Link href={homeHref} className="wordmark">
            <Image
              src={brand.logo.wordmark}
              alt={brand.name}
              width={180}
              height={48}
              priority
            />
          </Link>
          <div className="header-tools">
            {localization ? (
              <CountrySelector
                current={localization.country}
                countries={localization.availableCountries}
              />
            ) : null}
            <HeaderSearch className="header-search--mobile" />
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
      </div>
    </header>
  );
}
