import type { Money, ProductVariant, SellingPlan, SellingPlanGroup } from './types';

const INTERVAL_RANK: Record<string, number> = {
  DAY: 1,
  WEEK: 2,
  MONTH: 3,
  YEAR: 4,
};

export function appstleSellingPlanGroups(
  groups: SellingPlanGroup[] | undefined,
  appstleAppName: string,
): SellingPlanGroup[] {
  const name = appstleAppName.trim();
  if (!groups?.length || !name) return [];
  return groups.filter((group) => group.appName === name);
}

export function planDedupeKey(plan: SellingPlan): string {
  const interval = plan.billingPolicy?.interval ?? 'UNKNOWN';
  const count = plan.billingPolicy?.intervalCount ?? 0;
  const percent = plan.priceAdjustments?.[0]?.adjustmentValue?.adjustmentPercentage;
  return `${interval}:${count}:${percent ?? 'na'}`;
}

export function planDescription(plan: SellingPlan): string {
  const raw = plan.description?.trim() ?? '';
  if (!raw) return '';
  return raw
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

export function planCadence(plan: SellingPlan | undefined): string {
  const interval = plan?.billingPolicy?.interval?.toLowerCase();
  const count = plan?.billingPolicy?.intervalCount ?? 0;
  if (!interval || count < 1) return '';
  if (count === 1) return `every ${interval}`;
  return `every ${count} ${interval}s`;
}

export function planTitle(plan: SellingPlan): string {
  const cadence = planCadence(plan);
  if (!cadence) return plan.name;
  return cadence.charAt(0).toUpperCase() + cadence.slice(1);
}

export function planOffLabel(plan: SellingPlan): string {
  const percent = planDiscountPercent(plan);
  return percent > 0 ? `${percent}% off` : '';
}

/** Collection cards: savings, not a subscribe price. Appstle only. */
export function subscribeSaveLine(
  groups: SellingPlanGroup[] | undefined,
  appstleAppName: string,
): string | null {
  const percents = new Set<number>();
  for (const group of appstleSellingPlanGroups(groups, appstleAppName)) {
    for (const plan of group.sellingPlans.nodes) {
      const percent = planDiscountPercent(plan);
      if (percent > 0) percents.add(percent);
    }
  }
  if (percents.size === 0) return null;
  const max = Math.max(...percents);
  return `Subscribe and save up to ${max}%`;
}

export function customerFacingOptions(plan: SellingPlan) {
  return (plan.options ?? []).filter((option) => {
    const value = option.value?.trim() ?? '';
    if (!value || value.length > 48) return false;
    if (value.includes('MIN_CYCLES') || value.includes('PERCENTAGE')) return false;
    return true;
  });
}

function comparePlans(a: SellingPlan, b: SellingPlan) {
  const aInterval = INTERVAL_RANK[a.billingPolicy?.interval ?? ''] ?? 99;
  const bInterval = INTERVAL_RANK[b.billingPolicy?.interval ?? ''] ?? 99;
  if (aInterval !== bInterval) return aInterval - bInterval;
  const aCount = a.billingPolicy?.intervalCount ?? 0;
  const bCount = b.billingPolicy?.intervalCount ?? 0;
  if (aCount !== bCount) return aCount - bCount;
  return a.name.localeCompare(b.name);
}

/** New checkouts: Appstle selling plans only. Native plans stay in Shopify unused. */
export function purchasePlans(
  groups: SellingPlanGroup[] | undefined,
  appstleAppName: string,
): SellingPlan[] {
  const seen = new Set<string>();
  const plans: SellingPlan[] = [];
  for (const group of appstleSellingPlanGroups(groups, appstleAppName)) {
    for (const plan of group.sellingPlans.nodes) {
      const key = planDedupeKey(plan);
      if (seen.has(key)) continue;
      seen.add(key);
      plans.push(plan);
    }
  }
  return plans.sort(comparePlans);
}

export function planDiscountPercent(plan: SellingPlan): number {
  return plan.priceAdjustments?.[0]?.adjustmentValue?.adjustmentPercentage ?? 0;
}

export function bestValuePlanId(plans: SellingPlan[]): string | null {
  if (plans.length < 2) return null;
  let best = plans[0];
  for (const plan of plans) {
    if (planDiscountPercent(plan) > planDiscountPercent(best)) best = plan;
  }
  return planDiscountPercent(best) > 0 ? best.id : null;
}

function asAmount(money: Money | null | undefined): number {
  if (!money) return Number.NaN;
  return Number.parseFloat(money.amount);
}

export function saveAmount(price: Money, compareAt?: Money | null): Money | null {
  const current = asAmount(price);
  const was = asAmount(compareAt);
  if (!Number.isFinite(current) || !Number.isFinite(was) || was <= current) {
    return null;
  }
  return {
    amount: (was - current).toFixed(2),
    currencyCode: price.currencyCode,
  };
}

export function optionPricing(
  variant: ProductVariant,
  planId: string,
): { price: Money; compareAt: Money | null } {
  if (!planId) {
    const compareAt = variant.compareAtPrice ?? null;
    const save = saveAmount(variant.price, compareAt);
    return { price: variant.price, compareAt: save ? compareAt : null };
  }

  const adjustment = variant.sellingPlanAllocations.nodes.find(
    (node) => node.sellingPlan.id === planId,
  )?.priceAdjustments[0];
  const price = adjustment?.price ?? variant.price;
  const compareAt = adjustment?.compareAtPrice ?? variant.price;
  const save = saveAmount(price, compareAt);
  return { price, compareAt: save ? compareAt : null };
}

function scaleMoney(money: Money, factor: number): Money {
  return {
    amount: (asAmount(money) * factor).toFixed(2),
    currencyCode: money.currencyCode,
  };
}

export function prepaidUnits(
  plan: SellingPlan | undefined,
  variant: ProductVariant,
  unitPrice: Money,
): number {
  const count = plan?.billingPolicy?.intervalCount ?? 1;
  if (!plan || count <= 1) return 1;
  const oneTime = asAmount(variant.price);
  const unit = asAmount(unitPrice);
  if (!Number.isFinite(oneTime) || !Number.isFinite(unit)) return 1;
  if (unit >= oneTime * 1.5) return 1;
  return count;
}

export type DisplayPricing = {
  billed: Money;
  compareAt: Money | null;
  unit: Money;
  units: number;
  cadence: string;
};

export function displayPricing(
  variant: ProductVariant,
  plan: SellingPlan | undefined,
): DisplayPricing {
  if (!plan) {
    const { price, compareAt } = optionPricing(variant, '');
    return { billed: price, compareAt, unit: price, units: 1, cadence: '' };
  }
  const { price, compareAt } = optionPricing(variant, plan.id);
  const units = prepaidUnits(plan, variant, price);
  return {
    billed: units > 1 ? scaleMoney(price, units) : price,
    compareAt: compareAt && units > 1 ? scaleMoney(compareAt, units) : compareAt,
    unit: price,
    units,
    cadence: planCadence(plan),
  };
}

export function isAllowedSellingPlanId(
  groups: SellingPlanGroup[] | undefined,
  sellingPlanId: string,
  appstleAppName: string,
): boolean {
  if (!sellingPlanId) return false;
  return appstleSellingPlanGroups(groups, appstleAppName).some((group) =>
    group.sellingPlans.nodes.some((plan) => plan.id === sellingPlanId),
  );
}
