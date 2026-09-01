import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  isVerifiedBuyer,
  isVisibleReview,
  isWrittenInShopApp,
  mapJudgeMeReview,
  mapJudgeMeReviews,
  parseJudgeMeProductId,
} from './judgeme-model';

const apiReview = {
  id: 1304048271,
  title: null,
  body: 'Great product, will buy again.',
  rating: 5,
  product_external_id: 9529568592136,
  reviewer: { name: 'Dylan Carlos' },
  source: 'shop-app',
  curated: 'ok',
  published: true,
  hidden: false,
  verified: 'verified-purchase',
  created_at: '2026-08-21T09:20:57+00:00',
};

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

describe('parseJudgeMeProductId', () => {
  it('reads product.id from the lookup payload', () => {
    assert.equal(parseJudgeMeProductId({ product: { id: 1974783192 } }), 1974783192);
  });

  it('rejects missing or invalid ids', () => {
    assert.equal(parseJudgeMeProductId(null), null);
    assert.equal(parseJudgeMeProductId({ product: {} }), null);
    assert.equal(parseJudgeMeProductId({ product: { id: -1 } }), null);
    assert.equal(parseJudgeMeProductId({ product: { id: '1974783192' } }), null);
  });
});

describe('isVerifiedBuyer', () => {
  it('treats verified-purchase and confirmed-buyer as verified', () => {
    assert.equal(isVerifiedBuyer({ verified: 'verified-purchase' }), true);
    assert.equal(isVerifiedBuyer({ verified: 'confirmed-buyer' }), true);
    assert.equal(isVerifiedBuyer({ verified_buyer: true }), true);
  });

  it('does not treat email or nothing as a verified buyer', () => {
    assert.equal(isVerifiedBuyer({ verified: 'email' }), false);
    assert.equal(isVerifiedBuyer({ verified: 'nothing' }), false);
    assert.equal(isVerifiedBuyer({ verified: 'unconfirmed-buyer' }), false);
  });
});

describe('isVisibleReview', () => {
  it('drops hidden and unpublished API reviews', () => {
    assert.equal(isVisibleReview({ published: true, hidden: false }), true);
    assert.equal(isVisibleReview({ published: false, hidden: false }), false);
    assert.equal(isVisibleReview({ published: true, hidden: true }), false);
    assert.equal(isVisibleReview({}), true);
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

  it('maps the live /api/v1/reviews field shape', () => {
    const mapped = mapJudgeMeReview(apiReview);
    assert.deepEqual(mapped, {
      id: '1304048271',
      rating: 5,
      body: 'Great product, will buy again.',
      reviewerName: 'Dylan Carlos',
      reviewerInitial: 'D',
      verifiedBuyer: true,
      createdAt: '2026-08-21T09:20:57+00:00',
      writtenInShopApp: true,
    });
  });

  it('maps a reviews payload and drops junk and unpublished entries', () => {
    const mapped = mapJudgeMeReviews({
      reviews: [
        widgetReview,
        apiReview,
        { ...apiReview, id: 2, published: false, curated: 'spam' },
        null,
        { rating: 5 },
      ],
    });
    assert.equal(mapped.length, 2);
    assert.equal(mapped[0]?.reviewerName, 'Martin');
    assert.equal(mapped[1]?.reviewerName, 'Dylan Carlos');
  });
});
