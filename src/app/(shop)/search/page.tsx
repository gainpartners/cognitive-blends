import { ProductCard } from '@/components/ui/ProductCard';
import { Reveal } from '@/components/ui/Reveal';
import { APPSTLE_SUBSCRIPTIONS_APP_NAME, isStorefrontConfigured } from '@/lib/config/server';
import { errorFields, logger } from '@/lib/log';
import { compareAtPrice, oneTimePrice } from '@/lib/shopify/products';
import { subscribeSaveLine } from '@/lib/shopify/selling-plans';
import { searchProducts } from '@/lib/shopify/search';
import { popularProducts } from '@/content/home';

const log = logger('search');

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const raw = (await searchParams).q;
  const query = (Array.isArray(raw) ? raw[0] : raw)?.trim() ?? '';

  return (
    <section className="section">
      <div className="shell">
        <h1 className="page-title">
          {query ? `Search results for “${query}”` : 'Search'}
        </h1>
        {query ? <SearchResults query={query} /> : <p className="muted">Type a keyword to search the shop.</p>}
      </div>
    </section>
  );
}

async function SearchResults({ query }: { query: string }) {
  if (!isStorefrontConfigured()) {
    return <p className="muted">Storefront is not configured yet.</p>;
  }
  let products;
  try {
    products = await searchProducts(query);
  } catch (error) {
    log.warn('search page failed', errorFields(error));
    return <p className="error-text">Could not search right now.</p>;
  }
  if (products.length === 0) {
    return <p className="muted">No products found.</p>;
  }
  return (
    <div className="product-grid">
      {products.map((product, index) => {
        const oneTime = oneTimePrice(product);
        const compare = compareAtPrice(product);
        return (
          <Reveal key={product.id} order={index}>
            <ProductCard
              product={{
                handle: product.handle,
                title: product.title,
                image: product.featuredImage,
                amount: oneTime.amount,
                currencyCode: oneTime.currencyCode,
                compareAtAmount: compare?.amount,
                oneTimeLabel: popularProducts.oneTimeLabel,
                subscribeSave: subscribeSaveLine(
                  product.sellingPlanGroups?.nodes,
                  APPSTLE_SUBSCRIPTIONS_APP_NAME,
                ),
                showRating: false,
              }}
            />
          </Reveal>
        );
      })}
    </div>
  );
}
