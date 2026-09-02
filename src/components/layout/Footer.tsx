import { copyrightLine, footer } from '@/content/footer';
import { isStorefrontConfigured } from '@/lib/config/server';
import { getLocalization } from '@/lib/shopify/localization';
import { CountrySelector } from './CountrySelector';
import { FooterSubscribe } from './FooterSubscribe';

export async function Footer() {
  const year = new Date().getFullYear();
  const localization = isStorefrontConfigured() ? await getLocalization() : null;

  return (
    <footer className="site-footer">
      <div className="shell site-footer__inner">
        <FooterSubscribe />
        <p>
          <a href={footer.instagram.href} rel="noreferrer" target="_blank">
            {footer.instagram.label}
          </a>
        </p>
        {localization ? (
          <CountrySelector
            current={localization.country}
            countries={localization.availableCountries}
          />
        ) : null}
        <p>{copyrightLine(year)}</p>
      </div>
    </footer>
  );
}
