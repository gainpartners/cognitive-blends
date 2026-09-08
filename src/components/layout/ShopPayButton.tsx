'use client';

import { createElement, useEffect } from 'react';
import { shopifyNumericId } from '@/lib/utils';

const LOADER =
  'https://cdn.shopify.com/shopifycloud/shop-js/modules/v2/loader.pay-button.esm.js';

export function ShopPayButton({
  storeUrl,
  variantId,
  quantity,
}: {
  storeUrl: string;
  variantId: string;
  quantity: number;
}) {
  const numericId = shopifyNumericId(variantId);

  useEffect(() => {
    if (document.querySelector('script[data-shop-pay-loader]')) return;
    const script = document.createElement('script');
    script.type = 'module';
    script.src = LOADER;
    script.dataset.shopPayLoader = 'true';
    document.head.appendChild(script);
  }, []);

  if (!storeUrl || !numericId || quantity < 1) return null;

  return (
    <div className="shop-pay">
      {createElement('shop-pay-button', {
        key: `${numericId}:${quantity}`,
        'store-url': storeUrl,
        variants: `${numericId}:${quantity}`,
      })}
    </div>
  );
}
