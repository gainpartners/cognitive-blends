import 'server-only';

import { PREDICTIVE_SEARCH_QUERY, SEARCH_QUERY } from './queries';
import { storefrontFetch } from './storefront';
import type { PredictiveSearchResult, ProductListItem } from './types';

export async function predictiveSearch(
  query: string,
): Promise<PredictiveSearchResult> {
  const data = await storefrontFetch<{ predictiveSearch: PredictiveSearchResult }>(
    PREDICTIVE_SEARCH_QUERY,
    { query },
    { revalidate: 30 },
  );
  return data.predictiveSearch;
}

export async function searchProducts(query: string): Promise<ProductListItem[]> {
  const data = await storefrontFetch<{
    search: { nodes: Array<ProductListItem | Record<string, never>> };
  }>(SEARCH_QUERY, { query }, { revalidate: 60 });
  return data.search.nodes.filter((node): node is ProductListItem =>
    Boolean(node && 'handle' in node && 'priceRange' in node),
  );
}
