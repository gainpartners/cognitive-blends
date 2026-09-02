import Image from 'next/image';
import Link from 'next/link';
import { formatEuroComma, formatMoney, formatPlainAmount } from '@/lib/utils';
import { Price } from './Price';
import { StarRating } from './StarRating';

function shopAmount(
  amount: string,
  currencyCode: string,
  subscribe: boolean,
): string {
  if (currencyCode === 'EUR') {
    return subscribe ? formatPlainAmount(amount) : formatEuroComma(amount);
  }
  return formatMoney(amount, currencyCode);
}

export type ProductCardData = {
  handle: string;
  title: string;
  image?: { url: string; altText?: string | null; width?: number; height?: number } | null;
  amount: string;
  currencyCode: string;
  compareAtAmount?: string | null;
  subscribeAmount?: string | null;
  oneTimeLabel?: string;
  subscribeLabel?: string;
  rating?: number | null;
  ratingCount?: number | null;
  showRating?: boolean;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const shopLayout = Boolean(product.oneTimeLabel);

  return (
    <Link href={`/products/${product.handle}`} className="product-card">
      <div className="product-card__image">
        {product.image?.url ? (
          <Image
            src={product.image.url}
            alt={product.image.altText || product.title}
            width={product.image.width ?? 800}
            height={product.image.height ?? 800}
          />
        ) : null}
      </div>
      <div className="product-card__body">
        <h2>{product.title}</h2>
        <div className="product-card__price">
          {product.oneTimeLabel ? (
            <span className="product-card__price-label">{product.oneTimeLabel}</span>
          ) : null}
          {product.compareAtAmount ? (
            <span className="product-card__compare">
              {shopLayout ? (
                shopAmount(product.compareAtAmount, product.currencyCode, false)
              ) : (
                <Price amount={product.compareAtAmount} currencyCode={product.currencyCode} />
              )}
            </span>
          ) : null}
          {shopLayout ? (
            <span className="price">{shopAmount(product.amount, product.currencyCode, false)}</span>
          ) : (
            <Price amount={product.amount} currencyCode={product.currencyCode} />
          )}
        </div>
        {product.subscribeAmount ? (
          <div className="product-card__subscribe">
            {product.subscribeLabel ? (
              <span className="product-card__price-label">{product.subscribeLabel}</span>
            ) : null}
            {shopLayout ? (
              <span className="price">
                {shopAmount(product.subscribeAmount, product.currencyCode, true)}
              </span>
            ) : (
              <Price amount={product.subscribeAmount} currencyCode={product.currencyCode} />
            )}
          </div>
        ) : null}
        {product.showRating === false ? null : (
          <StarRating value={product.rating ?? null} count={product.ratingCount} />
        )}
      </div>
    </Link>
  );
}
