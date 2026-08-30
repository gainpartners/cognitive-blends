import Image from 'next/image';
import { notFound } from 'next/navigation';
import { parseRatingValue, StarRating } from '@/components/ui/StarRating';
import { PurchaseForm } from '@/components/shop/PurchaseForm';
import { Reviews } from '@/components/shop/Reviews';
import { isStorefrontConfigured } from '@/lib/config/server';
import { listReviews } from '@/lib/judgeme';
import { getProduct } from '@/lib/shopify/products';
import { nativeSellingPlanGroup } from '@/lib/shopify/selling-plans';
import { productNumericId } from '@/lib/utils';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  if (!isStorefrontConfigured()) notFound();
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  const native = nativeSellingPlanGroup(product.sellingPlanGroups.nodes);
  const rating = parseRatingValue(product.rating?.value);
  const ratingCount = product.ratingCount?.value
    ? Number.parseInt(product.ratingCount.value, 10)
    : null;
  const reviews = await listReviews(productNumericId(product.id));
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
            product={product}
            nativePlans={native?.sellingPlans.nodes ?? []}
          />
        </div>
      </div>
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
      />
      <Reviews reviews={reviews} rating={rating} count={ratingCount} />
    </div>
  );
}
