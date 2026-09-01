import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  isWrittenInShopApp,
  mapJudgeMeReview,
  mapJudgeMeReviews,
  resolveJudgeMeProductId,
} from './judgeme-model';

const widgetReview = {
  uuid: 'e0830fa5-3d67-52b3-a6aa-aaaaaaaaaaaa',
  title: '',
  rating: 5,
  body_html: '<p>Amazing promise and service</p>',
  body: 'Amazing promise and service',
  verified_buyer: true,
  created_at: '2026-07-31T15:08:23.000Z',
  reviewer_name: 'Martin',
  reviewer_initial: 'M',
  is_anonymous_reviewer: false,
  pictures_urls: [],
  video_external_ids: [],
  source: 'shop-app',
  transparency_badges: ['review_written_in_shop_app'],
};

describe('resolveJudgeMeProductId', () => {
  it('returns the mapped Judge.me id and never treats the Shopify id as a product_id', () => {
    const shopifyId = '9529568592136';
    const map = { [shopifyId]: 4242 };
    assert.equal(resolveJudgeMeProductId(shopifyId, map), 4242);
    assert.notEqual(resolveJudgeMeProductId(shopifyId, map), Number(shopifyId));
  });

  it('returns null for an unknown product so callers skip /reviews', () => {
    assert.equal(resolveJudgeMeProductId('9529568592136', {}), null);
    assert.equal(resolveJudgeMeProductId('', { '9529568592136': 1 }), null);
  });
});

describe('isWrittenInShopApp', () => {
  it('matches source shop-app', () => {
    assert.equal(isWrittenInShopApp({ source: 'shop-app' }), true);
  });

  it('matches transparency_badges string entries', () => {
    assert.equal(
      isWrittenInShopApp({
        source: 'web',
        transparency_badges: ['review_written_in_shop_app'],
      }),
      true,
    );
  });

  it('matches transparency_badges object entries', () => {
    assert.equal(
      isWrittenInShopApp({
        transparency_badges: [{ type: 'review_written_in_shop_app' }],
      }),
      true,
    );
  });

  it('is false when neither source nor badges apply', () => {
    assert.equal(isWrittenInShopApp({ source: 'email', transparency_badges: [] }), false);
  });
});

describe('mapJudgeMeReview', () => {
  it('maps the live widget field shape', () => {
    const mapped = mapJudgeMeReview(widgetReview);
    assert.deepEqual(mapped, {
      id: widgetReview.uuid,
      rating: 5,
      body: 'Amazing promise and service',
      reviewerName: 'Martin',
      reviewerInitial: 'M',
      verifiedBuyer: true,
      createdAt: '2026-07-31T15:08:23.000Z',
      writtenInShopApp: true,
    });
  });

  it('uses reviewer_initial as the name when anonymous', () => {
    const mapped = mapJudgeMeReview({
      id: 12,
      rating: 4,
      body: 'ok',
      reviewer_name: 'Hidden Person',
      reviewer_initial: 'H',
      is_anonymous_reviewer: true,
      verified_buyer: false,
      created_at: '2026-01-01T00:00:00.000Z',
      source: 'email',
    });
    assert.equal(mapped?.reviewerName, 'H');
    assert.equal(mapped?.reviewerInitial, 'H');
    assert.equal(mapped?.verifiedBuyer, false);
    assert.equal(mapped?.writtenInShopApp, false);
  });

  it('ignores body_html and skips reviews without an id or rating', () => {
    assert.equal(mapJudgeMeReview({ rating: 5, body: 'x' }), null);
    assert.equal(mapJudgeMeReview({ id: 1, body: 'x' }), null);
    const mapped = mapJudgeMeReview({
      id: 1,
      rating: 5,
      body: 'plain',
      body_html: '<script>alert(1)</script>',
    });
    assert.equal(mapped?.body, 'plain');
  });

  it('maps a reviews payload and drops junk entries', () => {
    const mapped = mapJudgeMeReviews({
      reviews: [widgetReview, null, { rating: 5 }],
    });
    assert.equal(mapped.length, 1);
    assert.equal(mapped[0]?.reviewerName, 'Martin');
  });
});
