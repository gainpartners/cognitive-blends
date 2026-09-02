import { preload } from 'react-dom';
import { PurchaseCtas } from '@/components/content/PurchaseCtas';
import { SignupForm } from '@/components/content/SignupForm';
import { WhoWeAreSlideshow } from '@/components/content/WhoWeAreSlideshow';
import { Button } from '@/components/ui/Button';
import { CatalogGrid } from '@/components/shop/CatalogGrid';
import { MediaImage } from '@/components/ui/MediaImage';
import { imageSizes } from '@/lib/shopify/image';
import { Reveal } from '@/components/ui/Reveal';
import { StarRating } from '@/components/ui/StarRating';
import {
  hero,
  popularProducts,
  statsPanel,
  testimonials,
  thriveOneFeatures,
} from '@/content/home';
import { isStorefrontConfigured } from '@/lib/config/server';
import { errorFields, logger } from '@/lib/log';
import { listFrontpageProducts } from '@/lib/shopify/products';
import { StorefrontError } from '@/lib/shopify/storefront';

const log = logger('shop');

export default async function HomePage() {
  preload(hero.poster, { as: 'image' });

  return (
    <>
      <section className="hero">
        <video
          className="hero__video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
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

      <Reveal as="section" className="section signup">
        <div className="shell signup__inner">
          <SignupForm />
        </div>
      </Reveal>

      <section className="section">
        <div className="shell features">
          <Reveal className="features__intro">
            <h2 className="section-title">{thriveOneFeatures.title}</h2>
            <p>{thriveOneFeatures.intro}</p>
            {thriveOneFeatures.image ? (
              <div className="features__image">
                <MediaImage
                  src={thriveOneFeatures.image}
                  alt=""
                  width={1000}
                  height={771}
                  sizes={imageSizes.half}
                />
              </div>
            ) : null}
          </Reveal>
          <div className="features__list">
            {thriveOneFeatures.blocks.map((block, index) => (
              <Reveal key={block.title} as="article" className="feature-card" order={index}>
                {block.image ? (
                  <div className="feature-card__image">
                    <MediaImage
                      src={block.image}
                      alt=""
                      width={88}
                      height={88}
                      sizes={imageSizes.feature}
                    />
                  </div>
                ) : null}
                <div>
                  <h3>{block.title}</h3>
                  <p>{block.body}</p>
                </div>
              </Reveal>
            ))}
            <Reveal order={thriveOneFeatures.blocks.length}>
              <PurchaseCtas items={thriveOneFeatures.purchaseCtas} stacked />
            </Reveal>
          </div>
        </div>
      </section>

      <div className="section-spacer" aria-hidden />

      <section className="section quotes">
        <div className="shell">
          <div className="quotes__grid">
            {testimonials.quotes.map((quote, index) => (
              <Reveal key={quote.name} as="blockquote" className="quote" order={index}>
                <StarRating value={5} showValue={false} />
                <p>{quote.body}</p>
                <footer>{quote.name}</footer>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section stats">
        <div className="shell stats__layout">
          <Reveal className="stats__image">
            <MediaImage
              src={statsPanel.image}
              alt=""
              width={600}
              height={400}
              sizes={imageSizes.half}
            />
          </Reveal>
          <Reveal className="stats__content" order={1}>
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
          </Reveal>
        </div>
      </section>

      <Reveal>
        <WhoWeAreSlideshow />
      </Reveal>
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
        <Reveal>
          <h2 className="section-title section-title--center">{popularProducts.heading}</h2>
        </Reveal>
        <CatalogGrid products={products} />
      </div>
    </section>
  );
}
