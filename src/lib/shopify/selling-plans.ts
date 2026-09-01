import type { SellingPlan, SellingPlanGroup } from './types';

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

export function customerFacingOptions(plan: SellingPlan) {
  return plan.options.filter((option) => {
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
