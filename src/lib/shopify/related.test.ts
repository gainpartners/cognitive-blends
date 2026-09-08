import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { PRODUCT_RECOMMENDATIONS_QUERY } from './queries';
import { pickRelated } from './related';
import type { ProductListItem } from './types';

function item(handle: string): ProductListItem {
  return {
    id: `gid://shopify/Product/${handle}`,
    handle,
    title: handle,
    priceRange: { minVariantPrice: { amount: '10.00', currencyCode: 'EUR' } },
  };
}

describe('related products', () => {
  it('asks Shopify for recommendations before falling back', () => {
    assert.match(PRODUCT_RECOMMENDATIONS_QUERY, /productRecommendations\(/);
    assert.match(PRODUCT_RECOMMENDATIONS_QUERY, /intent: \$intent/);
  });

  it('never includes the current product and fills from the catalogue', () => {
    const picked = pickRelated(
      'creatine-sachets-box-of-30',
      [item('creatine-sachets-box-of-30'), item('thriveone')],
      [item('thriveone'), item('mindbodybundle'), item('creatine-sachets-box-of-30')],
      4,
    );
    assert.deepEqual(
      picked.map((product) => product.handle),
      ['thriveone', 'mindbodybundle'],
    );
  });

  it('hides when nothing else is in the catalogue', () => {
    assert.deepEqual(pickRelated('thriveone', [], [item('thriveone')]), []);
  });
});
