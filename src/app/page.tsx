import { PurchaseCtas } from '@/components/content/PurchaseCtas';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/ui/ProductCard';
import { parseRatingValue } from '@/components/ui/StarRating';
import { hero, popularProducts, thriveOneFeatures, whoWeAre } from '@/content/home';
import { isStorefrontConfigured } from '@/lib/config/server';
import { errorFields, logger } from '@/lib/log';
import { listProducts } from '@/lib/shopify/products';
import { StorefrontError } from '@/lib/shopify/storefront';

const log = logger('shop');

export default async function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="shell">
          <div className="hero__inner">
            <h1 className="hero__title">{hero.title}</h1>
            <p className="hero__body">{hero.body}</p>
            <Button as="a" href={hero.cta.href} variant="secondary" size="lg">
              {hero.cta.label}
            </Button>
          </div>
        </div>
      </section>

      <PopularProducts />

      <section className="section">
        <div className="shell features">
          <div className="features__intro">
            <h2 className="section-title">{thriveOneFeatures.title}</h2>
            <p>{thriveOneFeatures.intro}</p>
          </div>
          <div className="features__list">
            {thriveOneFeatures.blocks.map((block) => (
              <article key={block.title} className="feature-card">
                <h3>{block.title}</h3>
                <p>{block.body}</p>
              </article>
            ))}
            <PurchaseCtas items={thriveOneFeatures.purchaseCtas} stacked />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell stack">
          <h2 className="section-title">{whoWeAre.heading}</h2>
          <div className="who-grid">
            {whoWeAre.people.map((person) => (
              <article key={person.name} className="who-card">
                <Avatar initial={person.initial} />
                <h3>{person.name}</h3>
                <p className="muted">{person.role}</p>
                <Button as="a" href={person.cta.href}>
                  {person.cta.label}
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

async function PopularProducts() {
  if (!isStorefrontConfigured()) {
    log.warn('home skipped; storefront is not configured');
    return (
      <section className="section" id="products">
        <div className="shell">
          <h2 className="section-title section-title--center">{popularProducts.heading}</h2>
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
    products = await listProducts();
  } catch (error) {
    log.warn('home catalogue failed', errorFields(error));
    const message =
      error instanceof StorefrontError ? error.message : 'Could not load products';
    return (
      <section className="section" id="products">
        <div className="shell">
          <h2 className="section-title section-title--center">{popularProducts.heading}</h2>
          <p className="error-text">{message}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section" id="products">
      <div className="shell">
        <h2 className="section-title section-title--center">{popularProducts.heading}</h2>
        <div className="product-grid">
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
    </section>
  );
}
