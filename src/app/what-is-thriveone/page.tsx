import type { Metadata } from 'next';
import { PurchaseCtas } from '@/components/content/PurchaseCtas';
import { CheckIcon } from '@/components/layout/icons';
import { whatIsThriveOne } from '@/content/pages/what-is-thriveone';

export const metadata: Metadata = {
  title: whatIsThriveOne.title,
};

export default function WhatIsThriveOnePage() {
  const page = whatIsThriveOne;

  return (
    <div className="thrive-page">
      <section className="thrive-intro">
        <div className="shell">
          <h1 className="thrive-intro__title">{page.heading}</h1>
          {page.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="thrive-does">
        <div className="shell thrive-does__grid">
          <div>
            <h2 className="thrive-heading">{page.whatItDoes.heading}</h2>
            <ul className="benefit-checks">
              {page.whatItDoes.items.map((item) => (
                <li key={item}>
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          {page.photo ? (
            <div className="thrive-does__photo">
              <img src={page.photo} alt="" />
            </div>
          ) : null}
        </div>
      </section>

      <section className="thrive-for">
        <div className="shell thrive-for__grid">
          <div className="thrive-for__copy">
            <h2 className="thrive-heading">{page.whoItIsFor.heading}</h2>
            {page.whoItIsFor.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {page.audiencePhoto ? (
              <div className="thrive-for__photo">
                <img src={page.audiencePhoto} alt="" />
              </div>
            ) : null}
          </div>
          <div className="thrive-for__types">
            {page.whoItIsFor.types.map((type) => (
              <article key={type.title} className="audience-row">
                {type.image ? (
                  <img src={type.image} alt="" className="audience-row__image" />
                ) : null}
                <div>
                  <h3>{type.title}</h3>
                  <p>{type.body}</p>
                </div>
              </article>
            ))}
            <PurchaseCtas items={page.purchaseCtas} stacked />
          </div>
        </div>
      </section>

      <section className="thrive-inside">
        <div className="shell thrive-inside__intro">
          <h2 className="thrive-inside__heading">{page.whatsInside.heading}</h2>
          <p>{page.whatsInside.intro}</p>
        </div>
        {page.whatsInside.ingredients.map((ingredient, index) => (
          <div
            key={ingredient.title}
            className={
              index % 2 === 1
                ? 'ingredient-band ingredient-band--flip'
                : 'ingredient-band'
            }
          >
            <div className="shell ingredient-band__grid">
              <div className="ingredient-band__image">
                {ingredient.image ? <img src={ingredient.image} alt="" /> : null}
              </div>
              <div className="ingredient-band__copy">
                <h3>{ingredient.title}</h3>
                <p>{ingredient.body}</p>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
