import { storefrontFetch } from './storefront';
import { PRODUCT_QUERY, PRODUCTS_QUERY } from './queries';
import type { Product, ProductListItem } from './types';

export async function listProducts(): Promise<ProductListItem[]> {
  const data = await storefrontFetch<{ products: { nodes: ProductListItem[] } }>(
    PRODUCTS_QUERY,
    undefined,
    { revalidate: 60 },
  );
  return data.products.nodes;
}

export async function getProduct(handle: string): Promise<Product | null> {
  const data = await storefrontFetch<{ product: Product | null }>(
    PRODUCT_QUERY,
    { handle },
    { revalidate: 60 },
  );
  return data.product;
}
