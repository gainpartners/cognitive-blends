import Link from 'next/link';
import { getCart } from '@/lib/shopify/cart';
import { isStorefrontConfigured, shopifyHostedAccountUrl } from '@/lib/config/server';
import { brand } from '@/content/brand';
import { homeHref } from '@/content/nav';
import { AccountIcon, CartIcon, SearchIcon } from './icons';
import { NavDrawer } from './NavDrawer';
import { NavLinks } from './NavLinks';

export async function Header() {
  const cart = isStorefrontConfigured() ? await getCart() : null;
  const accountUrl = shopifyHostedAccountUrl() ?? '/account';
  const qty = cart?.totalQuantity ?? 0;

  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <div className="site-header__bar">
          <NavDrawer />
          <Link href={homeHref} className="wordmark">
            {brand.name}
          </Link>
          <div className="header-tools">
            <details className="header-search">
              <summary className="header-icon" aria-label="Search">
                <SearchIcon />
              </summary>
              <form role="search" action="/" method="get">
                <input type="search" name="q" placeholder="Search" aria-label="Search" />
              </form>
            </details>
            <a href={accountUrl} className="header-icon" aria-label="Account">
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
