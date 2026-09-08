'use client';

import { useState } from 'react';
import { addToCartAction } from '@/app/actions/cart';
import { errorFields, logger } from '@/lib/log';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Price } from '@/components/ui/Price';
import { QtyStepper } from '@/components/ui/QtyStepper';
import {
  bestValuePlanId,
  optionPricing,
  planCadence,
  saveAmount,
} from '@/lib/shopify/selling-plans';
import type { Money, ProductVariant, SellingPlan } from '@/lib/shopify/types';
import { formatMoney } from '@/lib/utils';

const log = logger('purchase');

function PricePair({
  price,
  compareAt,
  cadence,
  size = 'md',
}: {
  price: Money;
  compareAt: Money | null;
  cadence?: string;
  size?: 'md' | 'lg';
}) {
  return (
    <span className="price-pair">
      {compareAt ? (
        <s className="price price--compare">
          {formatMoney(compareAt.amount, compareAt.currencyCode)}
        </s>
      ) : null}
      <span className="price-pair__now">
        <Price amount={price.amount} currencyCode={price.currencyCode} size={size} />
        {cadence ? <span className="price-pair__cadence">{cadence}</span> : null}
      </span>
    </span>
  );
}

export function PurchaseForm({
  productHandle,
  variant,
  plans,
}: {
  productHandle: string;
  variant: ProductVariant | undefined;
  plans: SellingPlan[];
}) {
  const [planId, setPlanId] = useState(plans[0]?.id ?? '');
  const [quantity, setQuantity] = useState(1);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  if (!variant) return <p className="muted">This product has no variants.</p>;

  const selectedPlan = plans.find((plan) => plan.id === planId);
  const selected = optionPricing(variant, planId);
  const bestId = bestValuePlanId(plans);
  const oneTime = optionPricing(variant, '');

  async function onSubmit(formData: FormData) {
    setError('');
    setDone(false);
    setPending(true);
    try {
      await addToCartAction(formData);
      setDone(true);
    } catch (err) {
      log.error('addToCart failed', errorFields(err));
      setError(err instanceof Error ? err.message : 'Could not add to cart');
    } finally {
      setPending(false);
    }
  }

  return (
    <form action={onSubmit} className="stack">
      <input type="hidden" name="merchandiseId" value={variant.id} />
      <input type="hidden" name="productHandle" value={productHandle} />
      <input type="hidden" name="sellingPlanId" value={planId} />

      <div className="price-block">
        <PricePair
          price={selected.price}
          compareAt={selected.compareAt}
          cadence={planCadence(selectedPlan)}
          size="lg"
        />
        <p className="price-block__tax">Taxes included.</p>
      </div>

      <QtyStepper value={quantity} onChange={setQuantity} />

      <div className="purchase-options">
        {plans.map((plan) => {
          const pricing = optionPricing(variant, plan.id);
          const save = saveAmount(pricing.price, pricing.compareAt);
          return (
            <label
              key={plan.id}
              className={planId === plan.id ? 'purchase-option is-selected' : 'purchase-option'}
            >
              {bestId === plan.id ? (
                <span className="purchase-option__flag">
                  <Badge tone="best">Best value</Badge>
                </span>
              ) : null}
              <input
                type="radio"
                name="purchase"
                checked={planId === plan.id}
                onChange={() => setPlanId(plan.id)}
              />
              <span className="purchase-option__body">
                <span className="purchase-option__copy">
                  <span className="purchase-option__title">{plan.name}</span>
                  {save ? (
                    <Badge tone="save">Save {formatMoney(save.amount, save.currencyCode)}</Badge>
                  ) : null}
                </span>
                <span className="purchase-option__price">
                  <PricePair
                    price={pricing.price}
                    compareAt={pricing.compareAt}
                    cadence={planCadence(plan)}
                  />
                </span>
              </span>
            </label>
          );
        })}

        <label className={!planId ? 'purchase-option is-selected' : 'purchase-option'}>
          <input
            type="radio"
            name="purchase"
            checked={!planId}
            onChange={() => setPlanId('')}
          />
          <span className="purchase-option__body">
            <span className="purchase-option__copy">
              <span className="purchase-option__title">One-time purchase</span>
            </span>
            <span className="purchase-option__price">
              <PricePair price={oneTime.price} compareAt={oneTime.compareAt} />
            </span>
          </span>
        </label>
      </div>

      <Button type="submit" disabled={pending || !variant.availableForSale}>
        {pending ? 'Adding…' : variant.availableForSale ? 'Add to cart' : 'Sold out'}
      </Button>
      {done ? (
        <p>
          Added to cart. <a href="/cart">View cart</a>
        </p>
      ) : null}
      {error ? <p className="error-text">{error}</p> : null}
    </form>
  );
}
