import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { SellingPlan, SellingPlanGroup } from './types';
import {
  bestValuePlanId,
  customerFacingOptions,
  displayPricing,
  isAllowedSellingPlanId,
  optionPricing,
  planCadence,
  planDescription,
  planOffLabel,
  planTitle,
  purchasePlans,
  saveAmount,
  subscribeSaveLine,
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

describe('subscribeSaveLine', () => {
  it('uses up to the deepest Appstle percent and ignores native', () => {
    assert.equal(subscribeSaveLine(thriveOne, APPSTLE), 'Subscribe and save up to 20%');
    assert.equal(
      subscribeSaveLine([group(APPSTLE, [appstleMonthly])], APPSTLE),
      'Subscribe and save up to 15%',
    );
    assert.equal(subscribeSaveLine([group(NATIVE, [nativeMonthly])], APPSTLE), null);
  });
});

describe('planTitle and planOffLabel', () => {
  it('uses cadence titles and always says off not save', () => {
    assert.equal(planTitle(appstleMonthly), 'Every month');
    assert.equal(planTitle(appstleQuarterly), 'Every 3 months');
    assert.equal(planOffLabel(appstleMonthly), '15% off');
    assert.equal(planOffLabel(appstleQuarterly), '20% off');
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
        {
          sellingPlan: { id: appstleQuarterly.id },
          priceAdjustments: [
            {
              price: { amount: '71.99', currencyCode: 'EUR' },
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

describe('displayPricing', () => {
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
        {
          sellingPlan: { id: appstleQuarterly.id },
          priceAdjustments: [
            {
              price: { amount: '71.99', currencyCode: 'EUR' },
              compareAtPrice: { amount: '89.99', currencyCode: 'EUR' },
            },
          ],
        },
      ],
    },
  };

  it('keeps monthly as a per-delivery price', () => {
    const offer = displayPricing(variant, appstleMonthly);
    assert.equal(offer.units, 1);
    assert.equal(offer.billed.amount, '76.49');
  });

  it('bills quarterly as a 3-unit total and keeps the unit for /mo', () => {
    const offer = displayPricing(variant, appstleQuarterly);
    assert.equal(offer.units, 3);
    assert.equal(offer.unit.amount, '71.99');
    assert.equal(offer.billed.amount, '215.97');
    assert.equal(offer.compareAt?.amount, '269.97');
  });
});
