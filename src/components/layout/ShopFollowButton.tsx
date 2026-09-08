'use client';

import { createElement, useSyncExternalStore } from 'react';
import Script from 'next/script';
import { useConsent } from '@/components/analytics/useConsent';
import {
  getShopifyConsentSync,
  subscribeShopifyConsentSync,
} from '@/lib/shopify/customer-privacy';

export function ShopFollowButton({
  shop,
  returnUri,
}: {
  shop: string;
  returnUri: string;
}) {
  const { ready, consent } = useConsent();
  const sync = useSyncExternalStore(
    (onChange) => subscribeShopifyConsentSync(() => onChange()),
    getShopifyConsentSync,
    () => null,
  );

  if (!ready || consent?.analytics !== true) return null;
  if (!sync?.ok) return null;

  return (
    <div className="shop-follow">
      <Script id="shop-follow-shop" strategy="afterInteractive">
        {`window.Shopify=window.Shopify||{};window.Shopify.shop=${JSON.stringify(shop)};`}
      </Script>
      <Script
        src="https://cdn.shopify.com/shopifycloud/shop-js/modules/v2/loader.shop-follow-button.en.esm.js"
        type="module"
        strategy="lazyOnload"
      />
      {createElement('shop-follow-button', {
        'ux-mode': 'windoid',
        'return-uri': returnUri,
        proxy: 'true',
      })}
    </div>
  );
}
