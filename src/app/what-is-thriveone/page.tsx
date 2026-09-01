import type { Metadata } from 'next';
import { PurchaseCtas } from '@/components/content/PurchaseCtas';
import { whatIsThriveOne } from '@/content/pages/what-is-thriveone';

export const metadata: Metadata = {
  title: whatIsThriveOne.title,
};

export default function WhatIsThriveOnePage() {
  return (
    <div className="shell stack page-copy">
      <h1 className="page-title">{whatIsThriveOne.heading}</h1>
      {whatIsThriveOne.intro.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}

      <section className="stack">
        <h2>{whatIsThriveOne.whatItDoes.heading}</h2>
        <ul className="benefit-list">
          {whatIsThriveOne.whatItDoes.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="stack">
        <h2>{whatIsThriveOne.whoItIsFor.heading}</h2>
        {whatIsThriveOne.whoItIsFor.intro.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <div className="feature-grid">
          {whatIsThriveOne.whoItIsFor.types.map((type) => (
            <article key={type.title} className="feature-card">
              <h3>{type.title}</h3>
              <p>{type.body}</p>
            </article>
          ))}
        </div>
      </section>

      <PurchaseCtas items={whatIsThriveOne.purchaseCtas} />

      <section className="stack">
        <h2>{whatIsThriveOne.whatsInside.heading}</h2>
        <p>{whatIsThriveOne.whatsInside.intro}</p>
        <div className="feature-grid">
          {whatIsThriveOne.whatsInside.ingredients.map((ingredient) => (
            <article key={ingredient.title} className="feature-card">
              <h3>{ingredient.title}</h3>
              <p>{ingredient.body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
