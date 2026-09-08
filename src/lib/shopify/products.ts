import { storefrontFetch } from './storefront';
import {
  FRONTPAGE_QUERY,
  PRODUCT_QUERY,
  PRODUCT_RECOMMENDATIONS_QUERY,
  PRODUCTS_QUERY,
} from './queries';
import { pickRelated, RELATED_LIMIT } from './related';
import type { Money, Product, ProductListItem } from './types';

export async function listProducts(): Promise<ProductListItem[]> {
  const data = await storefrontFetch<{ products: { nodes: ProductListItem[] } }>(
    PRODUCTS_QUERY,
    undefined,
    { revalidate: 60 },
  );
  return data.products.nodes;
}

export async function listFrontpageProducts(): Promise<ProductListItem[]> {
  const data = await storefrontFetch<{
    collection: { products: { nodes: ProductListItem[] } } | null;
  }>(FRONTPAGE_QUERY, undefined, { revalidate: 60 });
  const fromCollection = data.collection?.products.nodes ?? [];
  if (fromCollection.length > 0) return fromCollection;
  return listProducts();
}

export function oneTimePrice(product: ProductListItem): Money {
  return product.variants?.nodes[0]?.price ?? product.priceRange.minVariantPrice;
}

export function compareAtPrice(product: ProductListItem): Money | null {
  const compare = product.variants?.nodes[0]?.compareAtPrice;
  if (!compare) return null;
  if (Number.parseFloat(compare.amount) <= Number.parseFloat(oneTimePrice(product).amount)) {
    return null;
  }
  return compare;
}

export function subscribePrice(product: ProductListItem): Money | null {
  const allocations = product.variants?.nodes[0]?.sellingPlanAllocations.nodes ?? [];
  const prices = allocations
    .map((node) => node.priceAdjustments[0]?.price)
    .filter((price): price is Money => Boolean(price));
  if (prices.length === 0) return null;
  return [...prices].sort(
    (a, b) => Number.parseFloat(a.amount) - Number.parseFloat(b.amount),
  )[0];
}

export async function getProduct(handle: string): Promise<Product | null> {
  const data = await storefrontFetch<{ product: Product | null }>(
    PRODUCT_QUERY,
    { handle },
    { revalidate: 60 },
  );
  return data.product;
}

async function listRecommendations(
  productId: string,
  intent: 'RELATED' | 'COMPLEMENTARY',
): Promise<ProductListItem[]> {
  const data = await storefrontFetch<{ productRecommendations: ProductListItem[] | null }>(
    PRODUCT_RECOMMENDATIONS_QUERY,
    { productId, intent },
    { revalidate: 60 },
  );
  return data.productRecommendations ?? [];
}

export async function listRelatedProducts(
  productId: string,
  currentHandle: string,
): Promise<ProductListItem[]> {
  const recommended: ProductListItem[] = [];
  for (const intent of ['RELATED', 'COMPLEMENTARY'] as const) {
    try {
      recommended.push(...(await listRecommendations(productId, intent)));
    } catch {
      // Catalog fill-in below if Shopify returns nothing.
    }
    const ready = pickRelated(currentHandle, recommended, []);
    if (ready.length >= RELATED_LIMIT) return ready;
  }

  const fallback = await listFrontpageProducts();
  return pickRelated(currentHandle, recommended, fallback);
}
