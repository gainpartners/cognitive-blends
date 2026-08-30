import { NATIVE_SUBSCRIPTIONS_APP_NAME } from '@/lib/config/server';
import type { SellingPlanGroup } from './types';

export function nativeSellingPlanGroup(
  groups: SellingPlanGroup[] | undefined,
  appName = NATIVE_SUBSCRIPTIONS_APP_NAME,
): SellingPlanGroup | null {
  if (!groups?.length || !appName) return null;
  return groups.find((group) => group.appName === appName) ?? null;
}

export function isNativeSellingPlanId(
  groups: SellingPlanGroup[] | undefined,
  sellingPlanId: string,
  appName = NATIVE_SUBSCRIPTIONS_APP_NAME,
): boolean {
  const group = nativeSellingPlanGroup(groups, appName);
  if (!group) return false;
  return group.sellingPlans.nodes.some((plan) => plan.id === sellingPlanId);
}
