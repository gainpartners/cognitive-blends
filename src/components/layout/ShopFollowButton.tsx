'use client';

import { createElement } from 'react';
import Script from 'next/script';

export function ShopFollowButton({
  shop,
  returnUri,
}: {
  shop: string;
  returnUri: string;
}) {
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
