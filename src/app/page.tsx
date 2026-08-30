import { ProductCard } from '@/components/ui/ProductCard';
import { parseRatingValue } from '@/components/ui/StarRating';
import { isStorefrontConfigured } from '@/lib/config/server';
import { listProducts } from '@/lib/shopify/products';
import { StorefrontError } from '@/lib/shopify/storefront';

export default async function HomePage() {
  if (!isStorefrontConfigured()) {
    return (
      <div className="shell">
        <h1 className="page-title">Cognitive Blends</h1>
        <p className="muted">
          Set <code>SHOPIFY_STOREFRONT_API_TOKEN</code> in <code>.env.local</code> to
          load the live catalogue.
        </p>
      </div>
    );
  }

  let products;
  try {
    products = await listProducts();
  } catch (error) {
    const message =
      error instanceof StorefrontError ? error.message : 'Could not load products';
    return (
      <div className="shell">
        <h1 className="page-title">Shop</h1>
        <p className="error-text">{message}</p>
      </div>
    );
  }

  return (
    <div className="shell">
      <h1 className="page-title">Formulas for modern living</h1>
      <p className="muted">Made in the West of Ireland.</p>
      <div className="product-grid" style={{ marginTop: 32 }}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              handle: product.handle,
              title: product.title,
              image: product.featuredImage,
              amount: product.priceRange.minVariantPrice.amount,
              currencyCode: product.priceRange.minVariantPrice.currencyCode,
              rating: parseRatingValue(product.rating?.value),
              ratingCount: product.ratingCount?.value
                ? Number.parseInt(product.ratingCount.value, 10)
                : null,
            }}
          />
        ))}
      </div>
    </div>
  );
}
