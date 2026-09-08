import Link from 'next/link';
import { copyrightLine, footer } from '@/content/footer';
import {
  SHOPIFY_STORE_DOMAIN,
  isStorefrontConfigured,
  shopifyHostedAccountUrl,
} from '@/lib/config/server';
import { getLocalization } from '@/lib/shopify/localization';
import { CountrySelector } from './CountrySelector';
import { FooterSubscribe } from './FooterSubscribe';
import { InstagramIcon } from './icons';
import { ShopFollowButton } from './ShopFollowButton';
import { CookieSettingsLink } from './CookieSettingsLink';

export async function Footer() {
  const year = new Date().getFullYear();
  const localization = isStorefrontConfigured() ? await getLocalization() : null;
  const accountUrl = shopifyHostedAccountUrl() ?? '/account';

  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="site-footer__top">
          <FooterSubscribe />
          <div className="site-footer__social">
            {SHOPIFY_STORE_DOMAIN ? (
              <ShopFollowButton shop={SHOPIFY_STORE_DOMAIN} returnUri={accountUrl} />
            ) : null}
            <a
              href={footer.instagram.href}
              rel="noreferrer"
              target="_blank"
              className="site-footer__instagram"
              aria-label={footer.instagram.label}
            >
              <InstagramIcon />
            </a>
          </div>
        </div>
        <div className="site-footer__bottom">
          {localization ? (
            <CountrySelector
              variant="select"
              label={footer.countryLabel}
              current={localization.country}
              countries={localization.availableCountries}
            />
          ) : null}
          <p className="site-footer__copy">{copyrightLine(year)}</p>
          <nav className="site-footer__legal" aria-label="Legal">
            <Link href="/privacy">{footer.privacy}</Link>
            <Link href="/cookie-policy">{footer.cookiePolicy}</Link>
            <CookieSettingsLink>{footer.cookieSettings}</CookieSettingsLink>
          </nav>
        </div>
      </div>
    </footer>
  );
}
