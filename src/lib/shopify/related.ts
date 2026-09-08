import type { ProductListItem } from './types';

export const RELATED_LIMIT = 4;

export function pickRelated(
  currentHandle: string,
  recommended: ProductListItem[],
  fallback: ProductListItem[],
  limit = RELATED_LIMIT,
): ProductListItem[] {
  const seen = new Set<string>();
  const picked: ProductListItem[] = [];
  for (const product of [...recommended, ...fallback]) {
    if (!product.handle || product.handle === currentHandle || seen.has(product.handle)) {
      continue;
    }
    seen.add(product.handle);
    picked.push(product);
    if (picked.length >= limit) break;
  }
  return picked;
}
