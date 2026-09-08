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
  displayPricing,
  planOffLabel,
  planTitle,
  type DisplayPricing,
} from '@/lib/shopify/selling-plans';
import type { ProductVariant, SellingPlan } from '@/lib/shopify/types';
import { formatMoney } from '@/lib/utils';

const log = logger('purchase');

function OfferPrice({
  offer,
  size = 'md',
}: {
  offer: DisplayPricing;
  size?: 'md' | 'lg';
}) {
  const monthly = offer.units === 1 && offer.cadence === 'every month';
  return (
    <span className="price-pair">
      {offer.compareAt ? (
        <s className="price price--compare">
          {formatMoney(offer.compareAt.amount, offer.compareAt.currencyCode)}
        </s>
      ) : null}
      <span className="price-pair__now">
        <Price amount={offer.billed.amount} currencyCode={offer.billed.currencyCode} size={size} />
        {monthly ? <span className="price-pair__cadence">/mo</span> : null}
        {offer.units > 1 && offer.cadence ? (
          <span className="price-pair__cadence">{offer.cadence}</span>
        ) : null}
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
  const selected = displayPricing(variant, selectedPlan);
  const bestId = bestValuePlanId(plans);
  const oneTime = displayPricing(variant, undefined);

  async function onSubmit(formData: FormData) {
    const checkout = String(formData.get('intent')) === 'checkout';
    setError('');
    setDone(false);
    setPending(true);
    try {
      const result = await addToCartAction(formData);
      if (checkout) {
        if (!result.checkoutUrl) {
          throw new Error('Checkout is unavailable');
        }
        window.location.assign(result.checkoutUrl);
        return;
      }
      setDone(true);
    } catch (err) {
      log.error('addToCart failed', errorFields(err));
      setError(err instanceof Error ? err.message : 'Could not add to cart');
    } finally {
      if (!checkout) setPending(false);
    }
  }

  return (
    <form action={onSubmit} className="stack">
      <input type="hidden" name="merchandiseId" value={variant.id} />
      <input type="hidden" name="productHandle" value={productHandle} />
      <input type="hidden" name="sellingPlanId" value={planId} />

      <div className="price-block">
        <OfferPrice offer={selected} size="lg" />
        <p className="price-block__tax">
          {selected.units > 1
            ? `${formatMoney(selected.unit.amount, selected.unit.currencyCode)}/mo · Taxes included.`
            : 'Taxes included.'}
        </p>
      </div>

      <QtyStepper value={quantity} onChange={setQuantity} />

      <div className="purchase-options">
        {plans.map((plan) => {
          const offer = displayPricing(variant, plan);
          const off = planOffLabel(plan);
          const meta =
            offer.units > 1
              ? `${off} · ${formatMoney(offer.unit.amount, offer.unit.currencyCode)}/mo`
              : off;
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
                  <span className="purchase-option__title">{planTitle(plan)}</span>
                  {meta ? <span className="purchase-option__meta">{meta}</span> : null}
                  {offer.units > 1 ? (
                    <span className="purchase-option__desc">
                      {offer.units} units, billed once
                    </span>
                  ) : null}
                </span>
                <span className="purchase-option__price">
                  <OfferPrice offer={offer} />
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
              <span className="purchase-option__title">One-time</span>
            </span>
            <span className="purchase-option__price">
              <OfferPrice offer={oneTime} />
            </span>
          </span>
        </label>
      </div>

      <div className="purchase-actions">
        <Button
          type="submit"
          name="intent"
          value="cart"
          disabled={pending || !variant.availableForSale}
        >
          {pending ? 'Adding…' : variant.availableForSale ? 'Add to cart' : 'Sold out'}
        </Button>
        {variant.availableForSale ? (
          <Button
            type="submit"
            name="intent"
            value="checkout"
            variant="ghost"
            disabled={pending}
          >
            Buy now
          </Button>
        ) : null}
      </div>
      {done ? (
        <p>
          Added to cart. <a href="/cart">View cart</a>
        </p>
      ) : null}
      {error ? <p className="error-text">{error}</p> : null}
    </form>
  );
}
