import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { SellingPlan, SellingPlanGroup } from './types';
import {
  customerFacingOptions,
  isAllowedSellingPlanId,
  purchasePlans,
} from './selling-plans';

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

describe('customerFacingOptions', () => {
  it('hides Appstle encoded option values', () => {
    assert.deepEqual(customerFacingOptions(appstleQuarterly), []);
    assert.deepEqual(customerFacingOptions(nativeMonthly), [
      { name: 'Delivery frequency', value: 'Deliver every month' },
    ]);
  });
});
