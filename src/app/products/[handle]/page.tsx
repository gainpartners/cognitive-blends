import Image from 'next/image';
import { notFound } from 'next/navigation';
import { parseRatingValue, StarRating } from '@/components/ui/StarRating';
import { ProductAccordion } from '@/components/shop/ProductAccordion';
import { PurchaseForm } from '@/components/shop/PurchaseForm';
import { Reviews } from '@/components/shop/Reviews';
import { APPSTLE_SUBSCRIPTIONS_APP_NAME, isStorefrontConfigured } from '@/lib/config/server';
import { logger } from '@/lib/log';
import { getProduct } from '@/lib/shopify/products';
import { purchasePlans } from '@/lib/shopify/selling-plans';
import { productNumericId } from '@/lib/utils';

const log = logger('shop');

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  if (!isStorefrontConfigured()) {
    log.warn('product page skipped; storefront is not configured', { handle });
    notFound();
  }
  const product = await getProduct(handle);
  if (!product) {
    log.warn('product not found', { handle });
    notFound();
  }

  const plans = purchasePlans(
    product.sellingPlanGroups.nodes,
    APPSTLE_SUBSCRIPTIONS_APP_NAME,
  );
  const planIds = new Set(plans.map((plan) => plan.id));
  const rawVariant = product.variants.nodes[0];
  const variant = rawVariant
    ? {
        ...rawVariant,
        sellingPlanAllocations: {
          nodes: rawVariant.sellingPlanAllocations.nodes.filter((node) =>
            planIds.has(node.sellingPlan.id),
          ),
        },
      }
    : undefined;
  const rating = parseRatingValue(product.rating?.value);
  const ratingCount = product.ratingCount?.value
    ? Number.parseInt(product.ratingCount.value, 10)
    : null;
  const hero = product.images.nodes[0];

  return (
    <div className="shell stack">
      <div className="product-layout">
        <div>
          {hero?.url ? (
            <Image
              src={hero.url}
              alt={hero.altText || product.title}
              width={hero.width ?? 1200}
              height={hero.height ?? 1200}
              priority
            />
          ) : null}
        </div>
        <div className="stack">
          <h1 className="page-title" style={{ marginTop: 0 }}>
            {product.title}
          </h1>
          <StarRating value={rating} count={ratingCount} />
          <PurchaseForm
            productHandle={product.handle}
            variant={variant}
            plans={plans}
          />
        </div>
      </div>
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
      />
      {handle === 'thriveone' ? <ProductAccordion /> : null}
      <Reviews
        externalId={productNumericId(product.id)}
        rating={rating}
        count={ratingCount}
      />
    </div>
  );
}
