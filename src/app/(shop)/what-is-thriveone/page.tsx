import type { Metadata } from 'next';
import { PurchaseCtas } from '@/components/content/PurchaseCtas';
import { CheckIcon } from '@/components/layout/icons';
import { MediaImage } from '@/components/ui/MediaImage';
import { imageSizes } from '@/lib/shopify/image';
import { Reveal } from '@/components/ui/Reveal';
import { whatIsThriveOne } from '@/content/pages/what-is-thriveone';

export const metadata: Metadata = {
  title: whatIsThriveOne.title,
};

export default function WhatIsThriveOnePage() {
  const page = whatIsThriveOne;

  return (
    <div className="thrive-page">
      <Reveal as="section" className="thrive-intro">
        <div className="shell">
          <h1 className="thrive-intro__title">{page.heading}</h1>
          {page.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Reveal>

      <section className="thrive-does">
        <div className="shell thrive-does__grid">
          <Reveal>
            <h2 className="thrive-heading">{page.whatItDoes.heading}</h2>
            <ul className="benefit-checks">
              {page.whatItDoes.items.map((item) => (
                <li key={item}>
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          {page.photo ? (
            <Reveal className="thrive-does__photo" order={1}>
              <MediaImage
                src={page.photo}
                alt=""
                width={2000}
                height={1334}
                sizes={imageSizes.half}
              />
            </Reveal>
          ) : null}
        </div>
      </section>

      <section className="thrive-for">
        <div className="shell thrive-for__grid">
          <Reveal className="thrive-for__copy">
            <h2 className="thrive-heading">{page.whoItIsFor.heading}</h2>
            {page.whoItIsFor.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {page.audiencePhoto ? (
              <div className="thrive-for__photo">
                <MediaImage
                  src={page.audiencePhoto}
                  alt=""
                  width={1024}
                  height={1024}
                  sizes={imageSizes.half}
                />
              </div>
            ) : null}
          </Reveal>
          <div className="thrive-for__types">
            {page.whoItIsFor.types.map((type, index) => (
              <Reveal key={type.title} as="article" className="audience-row" order={index}>
                {type.image ? (
                  <MediaImage
                    src={type.image}
                    alt=""
                    width={72}
                    height={72}
                    sizes={imageSizes.audience}
                    className="audience-row__image"
                  />
                ) : null}
                <div>
                  <h3>{type.title}</h3>
                  <p>{type.body}</p>
                </div>
              </Reveal>
            ))}
            <Reveal order={page.whoItIsFor.types.length}>
              <PurchaseCtas items={page.purchaseCtas} stacked />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="thrive-inside">
        <Reveal className="shell thrive-inside__intro">
          <h2 className="thrive-inside__heading">{page.whatsInside.heading}</h2>
          <p>{page.whatsInside.intro}</p>
        </Reveal>
        {page.whatsInside.ingredients.map((ingredient, index) => (
          <Reveal
            key={ingredient.title}
            className={
              index % 2 === 1
                ? 'ingredient-band ingredient-band--flip'
                : 'ingredient-band'
            }
          >
            <div className="shell ingredient-band__grid">
              <div className="ingredient-band__image">
                {ingredient.image ? (
                  <MediaImage
                    src={ingredient.image}
                    alt=""
                    width={1500}
                    height={1500}
                    sizes={imageSizes.half}
                  />
                ) : null}
              </div>
              <div className="ingredient-band__copy">
                <h3>{ingredient.title}</h3>
                <p>{ingredient.body}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </section>
    </div>
  );
}
