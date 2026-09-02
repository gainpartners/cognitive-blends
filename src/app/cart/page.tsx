import Link from 'next/link';
import { MediaImage } from '@/components/ui/MediaImage';
import { imageSizes } from '@/lib/shopify/image';
import { removeCartLineAction } from '@/app/actions/cart';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Price } from '@/components/ui/Price';
import { getCart } from '@/lib/shopify/cart';
import { isStorefrontConfigured } from '@/lib/config/server';
import { logger } from '@/lib/log';

const log = logger('cart');

export default async function CartPage() {
  if (!isStorefrontConfigured()) {
    log.warn('cart page skipped; storefront is not configured');
    return (
      <div className="shell">
        <h1 className="page-title">Cart</h1>
        <p className="muted">Storefront is not configured yet.</p>
      </div>
    );
  }

  const cart = await getCart();
  const lines = cart?.lines.nodes ?? [];

  return (
    <div className="shell">
      <h1 className="page-title">Cart</h1>
      {lines.length === 0 ? (
        <p className="muted">
          Your cart is empty. <Link href="/">Continue shopping</Link>
        </p>
      ) : (
        <>
          {lines.map((line) => (
            <div key={line.id} className="cart-line">
              {line.merchandise.image?.url ? (
                <MediaImage
                  src={line.merchandise.image.url}
                  alt={line.merchandise.image.altText || line.merchandise.product.title}
                  width={88}
                  height={88}
                  sizes={imageSizes.thumb}
                />
              ) : (
                <div />
              )}
              <div>
                <Link href={`/products/${line.merchandise.product.handle}`}>
                  {line.merchandise.product.title}
                </Link>
                <div className="muted">Qty {line.quantity}</div>
                {line.sellingPlanAllocation ? (
                  <Badge tone="subscribe">
                    {line.sellingPlanAllocation.sellingPlan.name}
                  </Badge>
                ) : (
                  <Badge tone="onetime">One-time</Badge>
                )}
              </div>
              <div>
                <Price
                  amount={line.cost.totalAmount.amount}
                  currencyCode={line.cost.totalAmount.currencyCode}
                />
                <form action={removeCartLineAction}>
                  <input type="hidden" name="lineId" value={line.id} />
                  <Button type="submit" variant="ghost" size="sm">
                    Remove
                  </Button>
                </form>
              </div>
            </div>
          ))}
          <p>
            Total{' '}
            <Price
              amount={cart!.cost.totalAmount.amount}
              currencyCode={cart!.cost.totalAmount.currencyCode}
              size="lg"
            />
          </p>
          <Button as="a" href={cart!.checkoutUrl}>
            Checkout
          </Button>
        </>
      )}
    </div>
  );
}
