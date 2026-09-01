import { redirect } from 'next/navigation';
import { shopifyHostedAccountUrl } from '@/lib/config/server';
import { logger } from '@/lib/log';

const log = logger('account');

export default function AccountPage() {
  const url = shopifyHostedAccountUrl();
  if (!url) {
    log.warn('hosted account URL skipped; SHOPIFY_SHOP_ID is not set');
    return (
      <div className="shell">
        <h1 className="page-title">Account</h1>
        <p className="muted">Customer accounts are not configured.</p>
      </div>
    );
  }
  redirect(url);
}
