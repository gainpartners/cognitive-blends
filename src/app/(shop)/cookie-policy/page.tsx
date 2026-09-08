import type { Metadata } from 'next';
import Link from 'next/link';
import { CookieSettingsButton } from '@/components/analytics/CookieSettingsButton';
import { cookiePolicy } from '@/content/pages/legal';
import {
  isGaConfigured,
  isPostHogConfigured,
} from '@/lib/config/public';

export const metadata: Metadata = {
  title: cookiePolicy.title,
};

export default function CookiePolicyPage() {
  const ga = isGaConfigured();
  const posthog = isPostHogConfigured();

  return (
    <div className="legal-page">
      <div className="shell">
        <h1 className="page-title">{cookiePolicy.heading}</h1>
        <p className="legal-page__meta">Last updated: {cookiePolicy.updated}</p>
        <p className="legal-page__lede">{cookiePolicy.lede}</p>

        <h2>What cookies are</h2>
        <p>
          A cookie is a small text file a site stores in your browser. Some make
          the shop work. Some help us see which pages get used.
        </p>

        <h2>Why we use them</h2>
        <ol>
          <li>
            <strong>Essential.</strong> Cart, country, and this cookie choice.
            Checkout is Shopify. We cannot turn these off.
          </li>
          <li>
            <strong>Analytics.</strong> Used to see which pages people open and
            how they move around. They do not get the name or email from signup
            or contact. We only load these after you accept, or save settings
            with Analytics on.
          </li>
        </ol>

        <h2>Managing cookies</h2>
        <p>
          Change optional cookies here. Same panel as the first-visit prompt and
          the footer link.
        </p>
        <p className="legal-page__actions">
          <CookieSettingsButton />
        </p>
        <p>
          You can also block or delete cookies in your browser. See{' '}
          <a
            href="https://www.aboutcookies.org"
            rel="noopener noreferrer"
            target="_blank"
          >
            aboutcookies.org
          </a>
          .
        </p>

        <h2>Cookies we set</h2>
        <table className="cookie-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Use</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>cb_cookie_consent</code>
              </td>
              <td>
                Remembers your cookie choice for 12 months. Essential. Set by
                us.
              </td>
            </tr>
            <tr>
              <td>
                <code>cb_cart</code>
              </td>
              <td>Your cart. Essential. Set by us.</td>
            </tr>
            <tr>
              <td>
                <code>cb_country</code>
              </td>
              <td>Prices and market. Essential. Set by us.</td>
            </tr>
            <tr>
              <td>
                <code>cb_access</code>
              </td>
              <td>
                Preview or brand login only. Not set for ordinary visitors once
                the shop is public.
              </td>
            </tr>
          </tbody>
        </table>

        <h2>Third-party cookies</h2>
        {ga || posthog ? (
          <>
            <p>
              If you allow analytics, these services may set their own cookies.
              They are not under our control. They do not receive signup or
              contact details.
            </p>
            <ul>
              {ga ? (
                <li>
                  <strong>Google Analytics</strong> (<code>_ga</code>,{' '}
                  <code>_gid</code>, <code>_ga_*</code>). Used to see how
                  visitors use the site. Provider: Google Ireland Limited.
                </li>
              ) : null}
              {posthog ? (
                <li>
                  <strong>PostHog</strong> (<code>ph_*</code>). Same purpose:
                  page views and events. Provider: PostHog (EU).
                </li>
              ) : null}
            </ul>
          </>
        ) : (
          <p>
            Analytics is not configured on this environment yet. When Google
            Analytics or PostHog is added, they only load after you accept.
          </p>
        )}
        <p>
          Follow on Shop, if you use it, is Shopify. Checkout and customer
          accounts are also Shopify and may set their own cookies there.
        </p>

        <h2>Changes</h2>
        <p>
          We will update this page if the cookies we use change. The date at the
          top is the last change.
        </p>

        <h2>Contact</h2>
        <p>
          Questions: <Link href="/contact">Contact</Link>. Privacy:{' '}
          <Link href="/privacy">/privacy</Link>.
        </p>
      </div>
    </div>
  );
}
