import { storefrontFetch } from './storefront';
import { FRONTPAGE_QUERY, PRODUCT_QUERY, PRODUCTS_QUERY } from './queries';
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
