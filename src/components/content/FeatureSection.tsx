import { PurchaseCtas } from '@/components/content/PurchaseCtas';
import { MediaImage } from '@/components/ui/MediaImage';
import { imageSizes } from '@/lib/shopify/image';
import { Reveal } from '@/components/ui/Reveal';
import { thriveOneFeatures } from '@/content/home';

export function FeatureSection() {
  return (
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
  );
}
