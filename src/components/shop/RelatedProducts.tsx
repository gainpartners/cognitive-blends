import { CatalogGrid } from '@/components/shop/CatalogGrid';
import { relatedCopy } from '@/content/pdp/related';
import { errorFields, logger } from '@/lib/log';
import { listRelatedProducts } from '@/lib/shopify/products';

const log = logger('shop');

export async function RelatedProducts({
  productId,
  currentHandle,
}: {
  productId: string;
  currentHandle: string;
}) {
  let products;
  try {
    products = await listRelatedProducts(productId, currentHandle);
  } catch (error) {
    log.warn('related products failed', errorFields(error));
    return null;
  }

  if (products.length === 0) return null;

  return (
    <section className="related-products" aria-labelledby="related-heading">
      <div className="shell">
        <h2 id="related-heading" className="section-title">
          {relatedCopy.heading}
        </h2>
        <CatalogGrid products={products} />
      </div>
    </section>
  );
}
