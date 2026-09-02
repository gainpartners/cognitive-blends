import type { Metadata } from 'next';
import { BrandJumpNav } from '@/components/brand/BrandJumpNav';
import { ContactForm } from '@/components/content/ContactForm';
import { FeatureSection } from '@/components/content/FeatureSection';
import { Hero } from '@/components/content/Hero';
import { PurchaseCtas } from '@/components/content/PurchaseCtas';
import { QuoteGrid } from '@/components/content/QuoteGrid';
import { SignupForm } from '@/components/content/SignupForm';
import { StatsPanel } from '@/components/content/StatsPanel';
import { WhoWeAreSlideshow } from '@/components/content/WhoWeAreSlideshow';
import { Footer } from '@/components/layout/Footer';
import { HeaderShell } from '@/components/layout/HeaderShell';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { MediaImage } from '@/components/ui/MediaImage';
import { Price } from '@/components/ui/Price';
import { ProductCard } from '@/components/ui/ProductCard';
import { StarRating } from '@/components/ui/StarRating';
import {
  brand,
  colours,
  contrastPairs,
  motionRules,
  pages,
  spacing,
  typeScale,
} from '@/content/brand';
import { thriveOneFeatures } from '@/content/home';
import { isStorefrontConfigured, shopifyHostedAccountUrl } from '@/lib/config/server';
import { getLocalization } from '@/lib/shopify/localization';
import './brand.css';

const sections = [
  { id: 'intro', label: 'Introduction' },
  { id: 'narrative', label: '01 Narrative' },
  { id: 'voice', label: '02 Voice' },
  { id: 'wordmark', label: '03 Wordmark' },
  { id: 'colour', label: '04 Colour' },
  { id: 'type', label: '05 Type' },
  { id: 'spacing', label: '06 Spacing' },
  { id: 'atoms', label: '07 Atoms' },
  { id: 'nav-hero', label: '08 Nav & Hero' },
  { id: 'shop', label: '09 Shop' },
  { id: 'motion', label: '10 Motion' },
  { id: 'ia', label: '11 Architecture' },
  { id: 'accessibility', label: '12 Accessibility' },
] as const;

export const metadata: Metadata = {
  title: 'Brand guidelines',
  robots: { index: false, follow: false },
};

export default async function BrandPage() {
  const localization = isStorefrontConfigured() ? await getLocalization() : null;
  const accountUrl = shopifyHostedAccountUrl() ?? '/account';

  return (
    <div className="brand-doc">
      <header className="bd-header">
        <div className="bd-header__inner">
          <p className="bd-header__eyebrow">West of Ireland · Gain Partners</p>
          <h1>{brand.name}</h1>
          <p className="bd-header__sub">{brand.line} · Brand & website guidelines</p>
          <div className="bd-header__rule" />
          <p className="bd-header__meta">
            Colour · Type · Components · Shop architecture
            <br />
            This page renders the same components the storefront ships.
          </p>
        </div>
      </header>

      <BrandJumpNav sections={sections} />

      <div className="bd-page">
        <section className="bd-section" id="intro">
          <div className="bd-section__tag">About this document</div>
          <h2 className="bd-section__title">A note before you start.</h2>
          <div className="bd-cols bd-cols--65">
            <div>
              <p className="bd-prose">
                This is the rulebook for the Cognitive Blends storefront. Shop screens compose
                the atoms shown here. If a component changes, this page changes with it. Do
                not invent a second visual language.
              </p>
              <p className="bd-prose">
                Shopify is the system of record. This app is a thin Next.js BFF. Checkout is
                always <code>cart.checkoutUrl</code>. New subscribers see Appstle selling
                plans only. Account is Shopify hosted customer accounts.
              </p>
            </div>
            <div className="bd-callout bd-callout--sand">
              <div className="bd-callout__label">What&apos;s inside</div>
              <p className="bd-callout__text">
                Foundations, then the live library: buttons through header, catalogue,
                signup, ThriveOne features, quotes, stats, and Who We Are. Change the
                component, not a mock.
              </p>
            </div>
          </div>
        </section>

        <section className="bd-section" id="narrative">
          <div className="bd-section__tag">01 Narrative</div>
          <h2 className="bd-section__title">{brand.line}</h2>
          <p className="bd-section__intro">{brand.narrative}</p>
          <div className="bd-callout">
            <div className="bd-callout__label">Place</div>
            <p className="bd-callout__text">
              Made in the {brand.place}. The place is part of the claim, not a footer
              afterthought.
            </p>
          </div>
        </section>

        <section className="bd-section" id="voice">
          <div className="bd-section__tag">02 Voice</div>
          <h2 className="bd-section__title">Specific, not superlative</h2>
          <p className="bd-section__intro">
            Warm without gushing. Name the ingredients. Keep live-site typos in published
            copy (<em>perople</em>, <em>Cogntive Blends</em>) until the source is corrected.
          </p>
          {brand.voice.map((row) => (
            <div key={row.good} className="bd-tov">
              <div className="bd-tov__col bd-tov__col--bad">
                <div className="bd-tov__label">Avoid</div>
                <div>{row.bad}</div>
              </div>
              <div className="bd-tov__col bd-tov__col--good">
                <div className="bd-tov__label">Use</div>
                <div>{row.good}</div>
              </div>
            </div>
          ))}
        </section>

        <section className="bd-section" id="wordmark">
          <div className="bd-section__tag">03 Wordmark</div>
          <h2 className="bd-section__title">Logo files, not a redraw</h2>
          <p className="bd-section__intro">
            The identity is the wordmark PNG. The mark is for tight spaces (favicon,
            social avatar). Never lock them up side by side. Never recolour, outline, or
            drop-shadow.
          </p>
          <div className="bd-logo-row">
            <div className="bd-logo-card">
              <MediaImage
                src={brand.logo.wordmark}
                alt={brand.name}
                width={180}
                height={48}
                sizes="180px"
              />
              <p>Wordmark · charcoal · header and footer</p>
            </div>
            <div className="bd-logo-card bd-logo-card--light">
              <MediaImage
                src={brand.logo.mark}
                alt=""
                width={64}
                height={64}
                sizes="64px"
              />
              <p>Mark · 64px minimum in UI · never as a heading replacement</p>
            </div>
          </div>
          <ul className="bd-rules">
            <li>Charcoal or white grounds only. Not on sand, not on photography without a scrim.</li>
            <li>Header height is 32px desktop, 26px mobile. Do not scale the file independently of that CSS.</li>
            <li>Files live in <code>public/brand/</code>. Replace the PNG; do not invent a CSS wordmark.</li>
          </ul>
        </section>

        <section className="bd-section" id="colour">
          <div className="bd-section__tag">04 Colour</div>
          <h2 className="bd-section__title">Tokens from :root</h2>
          <p className="bd-section__intro">
            Hex values live once, in <code>src/app/globals.css</code>. This list is the
            documented subset. Do not add a one-off colour on a page.
          </p>
          <div className="bd-swatches">
            {colours.map((colour) => (
              <div key={colour.token} className="bd-swatch">
                <div className="bd-swatch__chip" style={{ background: colour.hex }} />
                <div className="bd-swatch__meta">
                  <strong>{colour.name}</strong>
                  <div>{colour.hex}</div>
                  <div>{colour.token}</div>
                  <div className="muted">{colour.use}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="bd-sub">Contrast</p>
          <div className="bd-contrast">
            {contrastPairs.map((pair) => (
              <div
                key={`${pair.fg}-${pair.bg}`}
                className="bd-contrast__card"
                style={{ background: pair.bgHex, color: pair.fgHex }}
              >
                <strong>
                  {pair.fg} on {pair.bg}
                </strong>
                <div className="bd-contrast__meta">
                  {pair.ratio} · {pair.badge}
                  <br />
                  {pair.note}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bd-section" id="type">
          <div className="bd-section__tag">05 Type</div>
          <h2 className="bd-section__title">EB Garamond 400 + Assistant 400/700</h2>
          <p className="bd-section__intro">
            Fonts load only from <code>layout.tsx</code>. Display and headings are Garamond.
            Body, UI, and buttons are Assistant.
          </p>
          {typeScale.map((row) => (
            <div key={row.name} className="bd-type-row">
              <div>
                <div className="bd-type-row__name">{row.name}</div>
                <div className="bd-type-row__spec">{row.spec}</div>
              </div>
              <div
                className={
                  row.name === 'Display' || row.name === 'Heading'
                    ? 'bd-type-row__sample--display'
                    : undefined
                }
              >
                {row.sample}
              </div>
            </div>
          ))}
        </section>

        <section className="bd-section" id="spacing">
          <div className="bd-section__tag">06 Spacing</div>
          <h2 className="bd-section__title">The scale, not magic numbers</h2>
          {spacing.map((row) => (
            <div key={row.token} className="bd-space-row">
              <div>{row.token}</div>
              <div>
                <div className="bd-space-row__bar" style={{ width: row.px }} />
              </div>
              <div>
                {row.px}px · {row.use}
              </div>
            </div>
          ))}
          <div className="bd-callout" style={{ marginTop: 24 }}>
            <div className="bd-callout__label">Radius &amp; shell</div>
            <p className="bd-callout__text">
              Buttons are square (<code>--radius-sm: 0</code>). Cards are 12px. Shell is
              1200px. Do not round a new control because it feels friendlier.
            </p>
          </div>
        </section>

        <section className="bd-section" id="atoms">
          <div className="bd-section__tag">07 Atoms</div>
          <h2 className="bd-section__title">src/components/ui</h2>
          <p className="bd-section__intro">
            Shop UI composes these. If you need a new button look, add a variant here —
            not a class on a page.
          </p>

          <p className="bd-sub">Button · primary teal, secondary sand, ghost on charcoal</p>
          <div className="bd-preview">
            <div className="bd-preview__tag">Sizes sm / md / lg</div>
            <div className="bd-preview__body bd-shop">
              <Button size="sm">Add to cart</Button>
              <Button>Add to cart</Button>
              <Button size="lg">Add to cart</Button>
              <Button variant="secondary">Shop now</Button>
              <Button variant="ghost">Buy It Once</Button>
            </div>
          </div>
          <p className="bd-spec">
            Primary is shop actions. Secondary is marketing (hero, stats). Ghost is the
            one-time purchase twin beside Subscribe. Hover lifts 4px unless reduced motion.
          </p>

          <p className="bd-sub">Badge · Price · StarRating · Avatar</p>
          <div className="bd-preview">
            <div className="bd-preview__body bd-shop">
              <Badge tone="subscribe">Subscribe</Badge>
              <Badge tone="onetime">One-time</Badge>
              <Badge tone="active">Active</Badge>
              <Badge tone="inactive">Inactive</Badge>
              <Badge tone="verified">Verified</Badge>
              <Price amount="64.99" size="lg" />
              <StarRating value={4.7} count={9} />
              <StarRating value={5} showValue={false} />
              <Avatar initial="M" />
            </div>
          </div>

          <p className="bd-sub">Field</p>
          <div className="bd-preview">
            <div className="bd-preview__body bd-shop" style={{ maxWidth: 360 }}>
              <Field label="Email">
                <input type="email" name="brand-email" placeholder="Email" readOnly />
              </Field>
            </div>
          </div>
          <p className="bd-spec">
            Always the Field atom. Hide the visible label with <code>hideLabel</code> only
            when the placeholder repeats it, as on signup and contact.
          </p>

          <p className="bd-sub">ProductCard + PurchaseCtas</p>
          <div className="bd-preview">
            <div className="bd-preview__body">
              <div className="bd-card-preview">
                <ProductCard
                  product={{
                    handle: 'thriveone',
                    title: 'ThriveOne (90 Capsules)',
                    amount: '64.99',
                    currencyCode: 'EUR',
                    compareAtAmount: '74.99',
                    subscribeAmount: '55.25',
                    oneTimeLabel: 'One-time:',
                    subscribeLabel: 'Subscribe and save:',
                    rating: 4.7,
                    ratingCount: 9,
                    showRating: false,
                  }}
                />
              </div>
              <PurchaseCtas items={thriveOneFeatures.purchaseCtas} />
            </div>
          </div>
          <p className="bd-spec">
            Cards are Markets-priced in the shop via CatalogGrid. Never show the Appstle
            app name. Image zoom is clipped on <code>.product-card__image</code>.
          </p>
        </section>

        <section className="bd-section" id="nav-hero">
          <div className="bd-section__tag">08 Nav &amp; Hero</div>
          <h2 className="bd-section__title">The live header and the live hero</h2>
          <p className="bd-section__intro">
            HeaderShell is what the shop layout renders after it has loaded cart and
            Markets. Hero is the homepage opening. Both are imported here, not redrawn.
          </p>
          <div className="bd-shop">
            <HeaderShell qty={0} localization={localization} accountUrl={accountUrl} />
          </div>
          <p className="bd-spec">
            Country control is <code>Name | CURRENCY symbol</code> plus caret. Search is
            the overlay, not a results page in the bar. Account goes to hosted Shopify.
          </p>
          <div className="bd-shop">
            <Hero />
          </div>
          <p className="bd-spec">
            Poster is a frame of the runner, not the ThriveOne box. Video loops muted.
            Overlay is 30% black. CTA is Button secondary.
          </p>
        </section>

        <section className="bd-section" id="shop">
          <div className="bd-section__tag">09 Shop sections</div>
          <h2 className="bd-section__title">Home is composition, not a one-off page</h2>
          <p className="bd-section__intro">
            Homepage, store, ThriveOne, and contact assemble these. Previewed on charcoal
            so you see them as customers do.
          </p>

          <p className="bd-sub">SignupForm</p>
          <div className="bd-shop">
            <div className="section signup">
              <div className="shell signup__inner">
                <SignupForm />
              </div>
            </div>
          </div>
          <p className="bd-spec">
            Storefront <code>customerCreate</code> with marketing consent. Success copy is
            the live form message; the discount arrives in the Thank You email.
          </p>

          <p className="bd-sub">FeatureSection</p>
          <div className="bd-shop">
            <FeatureSection />
          </div>

          <p className="bd-sub">QuoteGrid · StatsPanel · WhoWeAreSlideshow</p>
          <div className="bd-shop">
            <QuoteGrid />
            <StatsPanel />
            <WhoWeAreSlideshow />
          </div>

          <p className="bd-sub">ContactForm</p>
          <div className="bd-shop" style={{ padding: 32 }}>
            <ContactForm />
          </div>
          <p className="bd-spec">
            Posts <code>form_type=contact</code> to the Shopify shop origin. Failed sends
            keep the typed fields.
          </p>
        </section>

        <section className="bd-section" id="motion">
          <div className="bd-section__tag">10 Motion</div>
          <h2 className="bd-section__title">Progressive disclosure, then stop</h2>
          {motionRules.map((rule) => (
            <div key={rule.name} className="bd-callout" style={{ marginBottom: 12 }}>
              <div className="bd-callout__label">{rule.name}</div>
              <p className="bd-callout__text">{rule.use}</p>
            </div>
          ))}
        </section>

        <section className="bd-section" id="ia">
          <div className="bd-section__tag">11 Architecture</div>
          <h2 className="bd-section__title">Routes the shop actually has</h2>
          <table className="bd-ia">
            <thead>
              <tr>
                <th>Page</th>
                <th>URL</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((row) => (
                <tr key={row.url}>
                  <td>{row.page}</td>
                  <td>
                    <a href={row.url}>{row.url}</a>
                  </td>
                  <td>{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="bd-section" id="accessibility">
          <div className="bd-section__tag">12 Accessibility</div>
          <h2 className="bd-section__title">Pairs, not vibes</h2>
          <ul className="bd-rules">
            <li>White on charcoal and charcoal on sand are the primary combinations.</li>
            <li>Sand is for headings and marketing buttons, not small body text.</li>
            <li>Teal is for shop actions. Judge.me teal stays on the review widget.</li>
            <li>Mute grey is captions 14px+ on white. Not paragraphs.</li>
            <li>
              <code>prefers-reduced-motion: reduce</code> disables reveal, ambient, and lift.
            </li>
          </ul>
        </section>
      </div>

      <div className="bd-shop">
        <Footer />
      </div>
    </div>
  );
}
