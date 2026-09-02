import type { Metadata } from 'next';
import { CatalogGrid } from '@/components/shop/CatalogGrid';
import { Reveal } from '@/components/ui/Reveal';
import { onlineStore } from '@/content/pages/store';
import { isStorefrontConfigured } from '@/lib/config/server';
import { errorFields, logger } from '@/lib/log';
import { listFrontpageProducts } from '@/lib/shopify/products';
import { StorefrontError } from '@/lib/shopify/storefront';

const log = logger('shop');

export const metadata: Metadata = {
  title: onlineStore.title,
};

export default async function OnlineStorePage() {
  return (
    <section className="section store-page">
      <div className="shell">
        <Reveal>
          <h1 className="section-title section-title--center">{onlineStore.heading}</h1>
        </Reveal>
        <StoreProducts />
      </div>
    </section>
  );
}

async function StoreProducts() {
  if (!isStorefrontConfigured()) {
    log.warn('store skipped; storefront is not configured');
    return (
      <p className="muted">
        Set <code>SHOPIFY_STOREFRONT_API_TOKEN</code> in <code>.env.local</code> to
        load the live catalogue.
      </p>
    );
  }

  let products;
  try {
    products = await listFrontpageProducts();
  } catch (error) {
    log.warn('store catalogue failed', errorFields(error));
    const message =
      error instanceof StorefrontError ? error.message : 'Could not load products';
    return <p className="error-text">{message}</p>;
  }
  if (products.length === 0) {
    return <p className="muted">No products found.</p>;
  }
  return <CatalogGrid products={products} />;
}
