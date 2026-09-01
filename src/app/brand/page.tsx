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
          <p className="bd-section__tag" style={{ color: 'var(--gold)' }}>
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
          <h2>Tokens from the live store</h2>
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
          <h2>EB Garamond + Assistant</h2>
          {typeScale.map((row) => (
            <div key={row.name} className="bd-type">
              <div className="muted">{row.name} · {row.spec}</div>
              <div style={{ fontSize: row.name === 'Display' ? '2rem' : undefined }}>
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
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Button>Add to cart</Button>
            <Button variant="secondary">Checkout</Button>
            <Button variant="ghost" size="sm">Remove</Button>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Badge tone="subscribe">Subscribe</Badge>
            <Badge tone="onetime">One-time</Badge>
            <Badge tone="active">Active</Badge>
            <Badge tone="verified">Verified</Badge>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Avatar initial="M" />
            <Avatar initial="a" />
          </div>
          <Price amount="64.99" size="lg" />
          <StarRating value={4.7} count={9} />
          <StarRating value={5} showValue={false} />
          <div style={{ maxWidth: 280 }}>
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
            Ink on paper and white on teal are the primary combinations. Gold is
            for stars, not small body text.
          </p>
        </section>
      </div>
    </div>
  );
}
