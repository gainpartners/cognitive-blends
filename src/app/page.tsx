import { PurchaseCtas } from '@/components/content/PurchaseCtas';
import { SignupForm } from '@/components/content/SignupForm';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/ui/ProductCard';
import { StarRating } from '@/components/ui/StarRating';
import {
  hero,
  popularProducts,
  statsPanel,
  testimonials,
  thriveOneFeatures,
  whoWeAre,
} from '@/content/home';
import { isStorefrontConfigured } from '@/lib/config/server';
import { errorFields, logger } from '@/lib/log';
import {
  compareAtPrice,
  listFrontpageProducts,
  oneTimePrice,
  subscribePrice,
} from '@/lib/shopify/products';
import { StorefrontError } from '@/lib/shopify/storefront';

const log = logger('shop');

export default async function HomePage() {
  return (
    <>
      <section className="hero">
        <video
          className="hero__video"
          autoPlay
          muted
          loop
          playsInline
          poster={hero.poster}
          aria-hidden
        >
          <source src={hero.video} type="video/mp4" />
        </video>
        <div className="hero__overlay" />
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

      <section className="section signup">
        <div className="shell signup__inner">
          <SignupForm />
        </div>
      </section>

      <section className="section">
        <div className="shell features">
          <div className="features__intro">
            <h2 className="section-title">{thriveOneFeatures.title}</h2>
            <p>{thriveOneFeatures.intro}</p>
            {thriveOneFeatures.image ? (
              <div className="features__image">
                <img src={thriveOneFeatures.image} alt="" />
              </div>
            ) : null}
          </div>
          <div className="features__list">
            {thriveOneFeatures.blocks.map((block) => (
              <article key={block.title} className="feature-card">
                {block.image ? (
                  <div className="feature-card__image">
                    <img src={block.image} alt="" />
                  </div>
                ) : null}
                <div>
                  <h3>{block.title}</h3>
                  <p>{block.body}</p>
                </div>
              </article>
            ))}
            <PurchaseCtas items={thriveOneFeatures.purchaseCtas} stacked />
          </div>
        </div>
      </section>

      <div className="section-spacer" aria-hidden />

      <section className="section quotes">
        <div className="shell">
          <div className="quotes__grid">
            {testimonials.quotes.map((quote) => (
              <blockquote key={quote.name} className="quote">
                <StarRating value={5} showValue={false} />
                <p>{quote.body}</p>
                <footer>{quote.name}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="section stats">
        <div className="shell stats__layout">
          <div className="stats__image">
            <img src={statsPanel.image} alt="" />
          </div>
          <div className="stats__content">
            <h2 className="section-title">{statsPanel.heading}</h2>
            <p>{statsPanel.body}</p>
            <div className="stats__grid">
              {statsPanel.stats.map((stat) => (
                <div key={stat.value} className="stat">
                  <div className="stat__value">{stat.value}</div>
                  <p>{stat.label}</p>
                </div>
              ))}
            </div>
            <Button as="a" href={statsPanel.cta.href} variant="secondary">
              {statsPanel.cta.label}
            </Button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="who-grid">
            {whoWeAre.people.map((person) => (
              <article key={person.name} className="who-card">
                <div className="who-card__image">
                  <img src={person.image} alt={person.name} />
                </div>
                <div className="who-card__body">
                  <p className="who-card__kicker">{whoWeAre.heading}</p>
                  <h3>
                    {person.name} - {person.role}
                  </h3>
                  <Button as="a" href={person.cta.href}>
                    {person.cta.label}
                  </Button>
                </div>
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
    products = await listFrontpageProducts();
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
          {[...products]
            .sort((a, b) => {
              const order = popularProducts.handles;
              const ai = order.indexOf(a.handle);
              const bi = order.indexOf(b.handle);
              return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
            })
            .map((product) => {
            const oneTime = oneTimePrice(product);
            const compare = compareAtPrice(product);
            const subscribe = subscribePrice(product);
            return (
              <ProductCard
                key={product.id}
                product={{
                  handle: product.handle,
                  title: product.title,
                  image: product.featuredImage,
                  amount: oneTime.amount,
                  currencyCode: oneTime.currencyCode,
                  compareAtAmount: compare?.amount,
                  subscribeAmount: subscribe?.amount,
                  oneTimeLabel: popularProducts.oneTimeLabel,
                  subscribeLabel: popularProducts.subscribeLabel,
                  showRating: false,
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
