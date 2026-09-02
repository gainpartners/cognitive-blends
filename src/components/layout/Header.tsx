import { getCart } from '@/lib/shopify/cart';
import { isStorefrontConfigured, shopifyHostedAccountUrl } from '@/lib/config/server';
import { getLocalization } from '@/lib/shopify/localization';
import { HeaderShell } from './HeaderShell';

export async function Header() {
  const configured = isStorefrontConfigured();
  const [cart, localization] = configured
    ? await Promise.all([getCart(), getLocalization()])
    : [null, null];
  const accountUrl = shopifyHostedAccountUrl() ?? '/account';
  const qty = cart?.totalQuantity ?? 0;

  return (
    <HeaderShell
      qty={qty}
      localization={localization}
      accountUrl={accountUrl}
      preloadLogo
    />
  );
}
