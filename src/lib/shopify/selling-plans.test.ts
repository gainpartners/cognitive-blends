import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { SellingPlan, SellingPlanGroup } from './types';
import {
  bestValuePlanId,
  customerFacingOptions,
  isAllowedSellingPlanId,
  optionPricing,
  planCadence,
  planDescription,
  purchasePlans,
  saveAmount,
} from './selling-plans';
import type { ProductVariant } from './types';

const APPSTLE = 'appstle';
const NATIVE = 'gid://shopify/App/66228322305';

function plan(partial: Partial<SellingPlan> & Pick<SellingPlan, 'id' | 'name'>): SellingPlan {
  return {
    options: [],
    ...partial,
  };
}

function group(
  appName: string,
  plans: SellingPlan[],
  name = appName,
): SellingPlanGroup {
  return { name, appName, sellingPlans: { nodes: plans } };
}

const nativeMonthly = plan({
  id: 'gid://shopify/SellingPlan/689897144584',
  name: 'Deliver every month, 15% off',
  options: [{ name: 'Delivery frequency', value: 'Deliver every month' }],
  billingPolicy: { interval: 'MONTH', intervalCount: 1 },
  priceAdjustments: [{ adjustmentValue: { adjustmentPercentage: 15 } }],
});

const appstleMonthly = plan({
  id: 'gid://shopify/SellingPlan/692901019912',
  name: 'Delivery every month (15% off)',
  options: [
    {
      name: 'Delivery every',
      value:
        '1MONTH1MONTHMIN_CYCLES=NULLMAX_CYCLES=NULLtrue-15.0-PERCENTAGEfalseDelivery every month (15% off)',
    },
  ],
  billingPolicy: { interval: 'MONTH', intervalCount: 1 },
  priceAdjustments: [{ adjustmentValue: { adjustmentPercentage: 15 } }],
});

const appstleQuarterly = plan({
  id: 'gid://shopify/SellingPlan/692901052680',
  name: 'Delivery every 3 months (20% off)',
  options: [
    {
      name: 'Delivery every',
      value:
        '3MONTH3MONTHMIN_CYCLES=NULLMAX_CYCLES=NULLtrue-20.0-PERCENTAGEfalseDelivery every 3 months (20% off)',
    },
  ],
  billingPolicy: { interval: 'MONTH', intervalCount: 3 },
  priceAdjustments: [{ adjustmentValue: { adjustmentPercentage: 20 } }],
});

const thriveOne = [
  group(NATIVE, [nativeMonthly], 'Subscribe and save 15%'),
  group(APPSTLE, [appstleMonthly, appstleQuarterly], 'Appstle'),
];

describe('purchasePlans', () => {
  it('offers Appstle monthly and quarterly, not native', () => {
    const plans = purchasePlans(thriveOne, APPSTLE);
    assert.deepEqual(
      plans.map((item) => item.id),
      [appstleMonthly.id, appstleQuarterly.id],
    );
  });

  it('returns nothing when Appstle is absent', () => {
    assert.deepEqual(purchasePlans([group(NATIVE, [nativeMonthly])], APPSTLE), []);
  });
});

describe('isAllowedSellingPlanId', () => {
  it('accepts Appstle plan ids and rejects native', () => {
    assert.equal(isAllowedSellingPlanId(thriveOne, appstleMonthly.id, APPSTLE), true);
    assert.equal(isAllowedSellingPlanId(thriveOne, appstleQuarterly.id, APPSTLE), true);
    assert.equal(isAllowedSellingPlanId(thriveOne, nativeMonthly.id, APPSTLE), false);
  });
});

describe('planCadence', () => {
  it('names the billing rhythm from the plan policy', () => {
    assert.equal(planCadence(appstleMonthly), 'every month');
    assert.equal(planCadence(appstleQuarterly), 'every 3 months');
  });
});

describe('planDescription', () => {
  it('strips HTML from selling plan copy', () => {
    assert.equal(
      planDescription(
        plan({
          id: 'x',
          name: 'n',
          description: '<p>Receive three units of ThriveOne every 3 months</p>',
        }),
      ),
      'Receive three units of ThriveOne every 3 months',
    );
  });
});

describe('customerFacingOptions', () => {
  it('hides Appstle encoded option values', () => {
    assert.deepEqual(customerFacingOptions(appstleQuarterly), []);
    assert.deepEqual(customerFacingOptions(nativeMonthly), [
      { name: 'Delivery frequency', value: 'Deliver every month' },
    ]);
  });
});

describe('saveAmount', () => {
  it('returns the delta only when compare-at is higher', () => {
    assert.deepEqual(
      saveAmount(
        { amount: '76.49', currencyCode: 'EUR' },
        { amount: '89.99', currencyCode: 'EUR' },
      ),
      { amount: '13.50', currencyCode: 'EUR' },
    );
    assert.equal(
      saveAmount({ amount: '89.99', currencyCode: 'EUR' }, { amount: '89.99', currencyCode: 'EUR' }),
      null,
    );
  });
});

describe('bestValuePlanId', () => {
  it('picks the deeper discount when there are two plans', () => {
    assert.equal(bestValuePlanId([appstleMonthly, appstleQuarterly]), appstleQuarterly.id);
    assert.equal(bestValuePlanId([appstleMonthly]), null);
  });
});

describe('optionPricing', () => {
  const variant: ProductVariant = {
    id: 'gid://shopify/ProductVariant/1',
    title: 'Default',
    availableForSale: true,
    price: { amount: '89.99', currencyCode: 'EUR' },
    compareAtPrice: { amount: '99.98', currencyCode: 'EUR' },
    sellingPlanAllocations: {
      nodes: [
        {
          sellingPlan: { id: appstleMonthly.id },
          priceAdjustments: [
            {
              price: { amount: '76.49', currencyCode: 'EUR' },
              compareAtPrice: { amount: '89.99', currencyCode: 'EUR' },
            },
          ],
        },
      ],
    },
  };

  it('uses the variant sale pair for one-time', () => {
    assert.deepEqual(optionPricing(variant, ''), {
      price: { amount: '89.99', currencyCode: 'EUR' },
      compareAt: { amount: '99.98', currencyCode: 'EUR' },
    });
  });

  it('uses the allocation pair for a subscribe plan', () => {
    assert.deepEqual(optionPricing(variant, appstleMonthly.id), {
      price: { amount: '76.49', currencyCode: 'EUR' },
      compareAt: { amount: '89.99', currencyCode: 'EUR' },
    });
  });
});
