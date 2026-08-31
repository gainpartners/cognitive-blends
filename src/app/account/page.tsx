import { cancelSubscriptionAction } from '@/app/actions/account';
import { DocumentRedirect } from '@/components/DocumentRedirect';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Price } from '@/components/ui/Price';
import { customerAccountReady, customerFetch } from '@/lib/shopify/customer-account';
import { getCustomerTokens } from '@/lib/shopify/session';

const ACCOUNT_QUERY = `#graphql
  query Account {
    customer {
      firstName
      lastName
      emailAddress { emailAddress }
      orders(first: 20) {
        nodes {
          id
          name
          processedAt
          totalPrice { amount currencyCode }
          lineItems(first: 10) { nodes { name } }
        }
      }
      subscriptionContracts(first: 20) {
        nodes {
          id
          status
          nextBillingDate
          billingPolicy { interval intervalCount { count } }
          lines(first: 20) { nodes { id name } }
        }
      }
    }
  }
`;

type AccountData = {
  customer: {
    firstName?: string | null;
    lastName?: string | null;
    emailAddress?: { emailAddress?: string | null } | null;
    orders: {
      nodes: {
        id: string;
        name: string;
        processedAt: string;
        totalPrice: { amount: string; currencyCode: string };
        lineItems: { nodes: { name: string }[] };
      }[];
    };
    subscriptionContracts: {
      nodes: {
        id: string;
        status: string;
        nextBillingDate?: string | null;
        billingPolicy?: { interval: string; intervalCount?: { count: number } | null };
        lines: { nodes: { id: string; name: string }[] };
      }[];
    };
  };
};

export default async function AccountPage() {
  if (!customerAccountReady()) {
    return (
      <div className="shell">
        <h1 className="page-title">Account</h1>
        <p className="muted">Customer Account API is not configured yet.</p>
      </div>
    );
  }

  const session = await getCustomerTokens();
  if (!session) return <DocumentRedirect href="/login" />;

  const data = await customerFetch<AccountData>(ACCOUNT_QUERY);
  const customer = data.customer;

  return (
    <div className="shell stack">
      <h1 className="page-title">Account</h1>
      <p>
        {customer.firstName} {customer.lastName}
        <br />
        <span className="muted">{customer.emailAddress?.emailAddress}</span>
      </p>

      <section className="stack">
        <h2>Orders</h2>
        {customer.orders.nodes.length === 0 ? (
          <p className="muted">No orders yet.</p>
        ) : (
          customer.orders.nodes.map((order) => (
            <div key={order.id} className="account-row">
              <div>
                <strong>{order.name}</strong>
                <div className="muted">
                  {new Date(order.processedAt).toLocaleDateString('en-IE')} ·{' '}
                  {order.lineItems.nodes.map((line) => line.name).join(', ')}
                </div>
              </div>
              <Price
                amount={order.totalPrice.amount}
                currencyCode={order.totalPrice.currencyCode}
              />
            </div>
          ))
        )}
      </section>

      <section className="stack">
        <h2>Subscriptions</h2>
        {customer.subscriptionContracts.nodes.length === 0 ? (
          <p className="muted">No subscriptions.</p>
        ) : (
          customer.subscriptionContracts.nodes.map((sub) => (
            <div key={sub.id} className="account-row">
              <div>
                <div>
                  {sub.lines.nodes.map((line) => line.name).join(', ')}
                </div>
                <div className="muted">
                  {sub.billingPolicy
                    ? `Every ${sub.billingPolicy.intervalCount?.count ?? 1} ${sub.billingPolicy.interval.toLowerCase()}`
                    : null}
                  {sub.nextBillingDate
                    ? ` · next ${new Date(sub.nextBillingDate).toLocaleDateString('en-IE')}`
                    : null}
                </div>
                <Badge tone={sub.status === 'ACTIVE' ? 'active' : 'inactive'}>
                  {sub.status}
                </Badge>
              </div>
              {sub.status === 'ACTIVE' ? (
                <form action={cancelSubscriptionAction}>
                  <input type="hidden" name="subscriptionContractId" value={sub.id} />
                  <Button type="submit" variant="ghost" size="sm">
                    Cancel
                  </Button>
                </form>
              ) : null}
            </div>
          ))
        )}
      </section>
    </div>
  );
}
