import Link from 'next/link';
import { getCart } from '@/lib/shopify/cart';
import { isStorefrontConfigured, shopifyHostedAccountUrl } from '@/lib/config/server';

export async function Header() {
  const cart = isStorefrontConfigured() ? await getCart() : null;
  const accountUrl = shopifyHostedAccountUrl();
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
          {accountUrl ? <a href={accountUrl}>Account</a> : null}
        </nav>
      </div>
    </header>
  );
}
