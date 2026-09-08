import { CookieConsent } from '@/components/analytics/CookieConsent';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { getCustomerPrivacyContext } from '@/lib/shopify/customer-privacy-context';

export async function Consent() {
  const privacy = await getCustomerPrivacyContext();
  return (
    <>
      <CookieConsent privacy={privacy} />
      <GoogleAnalytics />
    </>
  );
}
