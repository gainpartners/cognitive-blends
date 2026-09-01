import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Price } from '@/components/ui/Price';
import { ProductCard } from '@/components/ui/ProductCard';
import { StarRating } from '@/components/ui/StarRating';
import { brand, colours, spacing, typeScale } from '@/content/brand';

export default function BrandPage() {
  return (
    <div className="brand-doc">
      <header className="bd-header">
        <div className="shell">
          <p className="bd-section__tag">
            Gain Partners
          </p>
          <h1>{brand.name}</h1>
          <p>{brand.line} · Brand & website guidelines</p>
        </div>
      </header>

      <div className="bd-page">
        <section className="bd-section">
          <div className="bd-section__tag">About</div>
          <h2>A note before you start.</h2>
          <p>
            This page is the rulebook. Shop screens compose the same atoms shown
            here. If a component changes, this page changes with it. Do not invent
            a second visual language.
          </p>
        </section>

        <section className="bd-section">
          <div className="bd-section__tag">01 Narrative</div>
          <h2>{brand.line}</h2>
          <p>{brand.narrative}</p>
          {brand.voice.map((row) => (
            <p key={row.good}>
              <span className="error-text">Don’t: {row.bad}</span>
              <br />
              Do: {row.good}
            </p>
          ))}
        </section>

        <section className="bd-section">
          <div className="bd-section__tag">02 Colour</div>
          <h2>Tokens from cognitiveblends.com</h2>
          <div className="bd-swatches">
            {colours.map((colour) => (
              <div key={colour.token} className="bd-swatch">
                <div className="bd-swatch__chip" style={{ background: colour.hex }} />
                <div className="bd-swatch__meta">
                  <strong>{colour.name}</strong>
                  <div>{colour.hex}</div>
                  <div className="muted">{colour.use}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bd-section">
          <div className="bd-section__tag">03 Type</div>
          <h2>EB Garamond 400 + Assistant 400/700</h2>
          {typeScale.map((row) => (
            <div key={row.name} className="bd-type">
              <div className="muted">{row.name} · {row.spec}</div>
              <div className={row.name === 'Display' || row.name === 'Heading' ? 'bd-type--display' : undefined}>
                {row.sample}
              </div>
            </div>
          ))}
        </section>

        <section className="bd-section">
          <div className="bd-section__tag">04 Spacing</div>
          {spacing.map((row) => (
            <div key={row.token} className="bd-space">
              <div className="bd-space__bar" style={{ width: row.px }} />
              {row.token} · {row.px}px · {row.use}
            </div>
          ))}
        </section>

        <section className="bd-section stack">
          <div className="bd-section__tag">05 Components</div>
          <h2>Live atoms</h2>
          <div className="bd-row">
            <Button>Add to cart</Button>
            <Button variant="secondary">Shop now</Button>
            <Button variant="ghost">Buy It Once</Button>
          </div>
          <div className="bd-row">
            <Badge tone="subscribe">Subscribe</Badge>
            <Badge tone="onetime">One-time</Badge>
            <Badge tone="active">Active</Badge>
            <Badge tone="verified">Verified</Badge>
          </div>
          <div className="bd-row">
            <Avatar initial="M" />
            <Avatar initial="a" />
          </div>
          <Price amount="64.99" size="lg" />
          <StarRating value={4.7} count={9} />
          <StarRating value={5} showValue={false} />
          <div className="bd-preview-card">
            <ProductCard
              product={{
                handle: 'thriveone',
                title: 'ThriveOne (90 Capsules)',
                amount: '64.99',
                currencyCode: 'EUR',
                rating: 4.7,
                ratingCount: 9,
              }}
            />
          </div>
        </section>

        <section className="bd-section">
          <div className="bd-section__tag">06 Accessibility</div>
          <p>
            White on charcoal and charcoal on sand are the primary combinations.
            Sand is for headings and marketing buttons, not small body text. Teal
            is for shop actions. Judge.me teal stays on the review widget.
          </p>
        </section>
      </div>
    </div>
  );
}
