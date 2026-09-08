import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { imageSizes, isShopifyCdn, shopifyImageLoader } from './image';
import { PRODUCT_QUERY, PRODUCTS_QUERY } from './queries';

describe('shopify images', () => {
  it('recognises the Shopify CDN host', () => {
    assert.equal(
      isShopifyCdn('https://cdn.shopify.com/s/files/1/file.jpg?v=1'),
      true,
    );
    assert.equal(isShopifyCdn('/brand/home/sleep.png'), false);
    assert.equal(isShopifyCdn('https://cognitiveblends.com/logo.png'), false);
  });

  it('names the display widths the browser should pick', () => {
    assert.match(imageSizes.card, /360px/);
    assert.equal(imageSizes.feature, '88px');
  });

  it('asks Shopify for the full product image set', () => {
    assert.match(PRODUCT_QUERY, /images\(first: 20\)/);
  });

  it('asks Shopify for the one-time compare-at price', () => {
    assert.match(PRODUCT_QUERY, /compareAtPrice \{ amount currencyCode \}/);
  });

  it('asks Shopify for Appstle plan percents on collection cards', () => {
    assert.match(PRODUCTS_QUERY, /sellingPlanGroups\(first: 10\)/);
    assert.match(PRODUCTS_QUERY, /adjustmentPercentage/);
  });

  it('asks the CDN for a display width and keeps existing params', () => {
    assert.equal(
      shopifyImageLoader({
        src: 'https://cdn.shopify.com/s/files/1/file.jpg?v=9',
        width: 360,
      }),
      'https://cdn.shopify.com/s/files/1/file.jpg?v=9&width=360',
    );
  });
});
