import Link from 'next/link';
import { getCart } from '@/lib/shopify/cart';
import { getCustomerTokens } from '@/lib/shopify/session';
import { isStorefrontConfigured } from '@/lib/config/server';

export async function Header() {
  const cart = isStorefrontConfigured() ? await getCart() : null;
  const customer = await getCustomerTokens();
  const qty = cart?.totalQuantity ?? 0;

  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <Link href="/" className="wordmark">
          Cognitive Blends
        </Link>
        <nav className="nav-links" aria-label="Primary">
          <Link href="/">Shop</Link>
          <Link href="/cart">Cart{qty ? ` (${qty})` : ''}</Link>
          {customer ? (
            <>
              <Link href="/account">Account</Link>
              <Link href="/logout">Log out</Link>
            </>
          ) : (
            <Link href="/login">Log in</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
