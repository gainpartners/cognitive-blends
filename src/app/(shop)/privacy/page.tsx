import type { Metadata } from 'next';
import Link from 'next/link';
import { privacyPolicy } from '@/content/pages/legal';
import {
  isGaConfigured,
  isPostHogConfigured,
} from '@/lib/config/public';

export const metadata: Metadata = {
  title: privacyPolicy.title,
};

export default function PrivacyPage() {
  const analyticsOn = isGaConfigured() || isPostHogConfigured();

  return (
    <div className="legal-page">
      <div className="shell">
        <h1 className="page-title">{privacyPolicy.heading}</h1>
        <p className="legal-page__meta">Last updated: {privacyPolicy.updated}</p>
        <p className="legal-page__lede">{privacyPolicy.lede}</p>

        <h2>Who we are</h2>
        <p>
          Cognitive Blends is a supplement shop based in the West of Ireland.
          Shopify is the system of record for catalog, cart, checkout, and
          customer accounts. This site is the shopper storefront.
        </p>

        <h2>What we collect</h2>
        <ul>
          <li>
            Signup and mailing list: name and email, with marketing consent. We
            create a Shopify customer record.
          </li>
          <li>
            Contact form: name, email, phone if you give one, and your message.
            Posted to Shopify as a contact submission.
          </li>
          <li>
            Cart and country so the shop can show the right prices and hold your
            bag.
          </li>
          <li>
            Orders and payment: Shopify checkout. We do not take card details on
            this site.
          </li>
          <li>
            Customer accounts: Shopify-hosted sign-in. We do not run our own
            account portal.
          </li>
        </ul>

        <h2>Analytics</h2>
        {analyticsOn ? (
          <p>
            If you accept analytics cookies, we use Google Analytics and/or
            PostHog to see which pages people open. Analytics is off until you
            accept. Essential cookies stay on. Change this any time from Cookie
            settings in the footer.
          </p>
        ) : (
          <p>
            Optional analytics (Google Analytics or PostHog) only loads after
            you accept cookies, and only when those services are configured.
            Essential cookies stay on.
          </p>
        )}

        <h2>Cookies</h2>
        <p>
          Full detail, including cookie names, is on the{' '}
          <Link href="/cookie-policy">cookie policy</Link>.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy: <Link href="/contact">Contact</Link>.
        </p>
      </div>
    </div>
  );
}
