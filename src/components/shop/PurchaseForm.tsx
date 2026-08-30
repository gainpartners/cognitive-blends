'use client';

import { useState } from 'react';
import { addToCartAction } from '@/app/actions/cart';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Price } from '@/components/ui/Price';
import type { Product, SellingPlan } from '@/lib/shopify/types';

export function PurchaseForm({
  product,
  nativePlans,
}: {
  product: Product;
  nativePlans: SellingPlan[];
}) {
  const variant = product.variants.nodes[0];
  const [planId, setPlanId] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  if (!variant) return <p className="muted">This product has no variants.</p>;

  const allocation = variant.sellingPlanAllocations.nodes.find(
    (node) => node.sellingPlan.id === planId,
  );
  const money = allocation?.priceAdjustments[0]?.price ?? variant.price;

  async function onSubmit(formData: FormData) {
    setError('');
    setDone(false);
    setPending(true);
    try {
      await addToCartAction(formData);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not add to cart');
    } finally {
      setPending(false);
    }
  }

  return (
    <form action={onSubmit} className="stack">
      <input type="hidden" name="merchandiseId" value={variant.id} />
      <input type="hidden" name="productHandle" value={product.handle} />
      <input type="hidden" name="sellingPlanId" value={planId} />

      <Price amount={money.amount} currencyCode={money.currencyCode} size="lg" />

      <div className="purchase-options">
        <label className={!planId ? 'is-selected' : undefined}>
          <input
            type="radio"
            name="purchase"
            checked={!planId}
            onChange={() => setPlanId('')}
          />
          <span>
            <Badge tone="onetime">One-time</Badge>
            <div>{variant.price.amount} {variant.price.currencyCode}</div>
          </span>
        </label>

        {nativePlans.map((plan) => (
          <label
            key={plan.id}
            className={planId === plan.id ? 'is-selected' : undefined}
          >
            <input
              type="radio"
              name="purchase"
              checked={planId === plan.id}
              onChange={() => setPlanId(plan.id)}
            />
            <span>
              <Badge tone="subscribe">Subscribe</Badge>
              <div>{plan.name}</div>
              {plan.options.map((option) => (
                <div key={option.name} className="muted">
                  {option.name}: {option.value}
                </div>
              ))}
            </span>
          </label>
        ))}
      </div>

      <Button type="submit" disabled={pending || !variant.availableForSale}>
        {pending ? 'Adding…' : variant.availableForSale ? 'Add to cart' : 'Sold out'}
      </Button>
      {done ? <p>Added to cart. <a href="/cart">View cart</a></p> : null}
      {error ? <p className="error-text">{error}</p> : null}
    </form>
  );
}
