import { redirect } from 'next/navigation';
import { shopifyHostedAccountUrl } from '@/lib/config/server';

export default function AccountPage() {
  const url = shopifyHostedAccountUrl();
  if (!url) {
    return (
      <div className="shell">
        <h1 className="page-title">Account</h1>
        <p className="muted">Customer accounts are not configured.</p>
      </div>
    );
  }
  redirect(url);
}
