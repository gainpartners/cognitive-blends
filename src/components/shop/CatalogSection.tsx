import { CatalogGrid } from '@/components/shop/CatalogGrid';
import { Reveal } from '@/components/ui/Reveal';
import { popularProducts } from '@/content/home';
import { isStorefrontConfigured } from '@/lib/config/server';
import { errorFields, logger } from '@/lib/log';
import { listFrontpageProducts } from '@/lib/shopify/products';
import { StorefrontError } from '@/lib/shopify/storefront';

const log = logger('shop');

export async function CatalogSection({
  heading = popularProducts.heading,
  id = 'products',
  className = 'section',
  titleAs = 'h2',
}: {
  heading?: string;
  id?: string;
  className?: string;
  titleAs?: 'h1' | 'h2';
}) {
  const Title = titleAs;

  if (!isStorefrontConfigured()) {
    log.warn('catalogue skipped; storefront is not configured');
    return (
      <section className={className} id={id}>
        <div className="shell">
          <Title className="section-title section-title--center">{heading}</Title>
          <p className="muted">
            Set <code>SHOPIFY_STOREFRONT_API_TOKEN</code> in <code>.env.local</code> to
            load the live catalogue.
          </p>
        </div>
      </section>
    );
  }

  let products;
  try {
    products = await listFrontpageProducts();
  } catch (error) {
    log.warn('catalogue failed', errorFields(error));
    const message =
      error instanceof StorefrontError ? error.message : 'Could not load products';
    return (
      <section className={className} id={id}>
        <div className="shell">
          <Title className="section-title section-title--center">{heading}</Title>
          <p className="error-text">{message}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={className} id={id}>
      <div className="shell">
        <Reveal>
          <Title className="section-title section-title--center">{heading}</Title>
        </Reveal>
        {products.length === 0 ? (
          <p className="muted">No products found.</p>
        ) : (
          <CatalogGrid products={products} />
        )}
      </div>
    </section>
  );
}
