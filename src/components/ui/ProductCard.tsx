import Link from 'next/link';
import { formatEuroComma, formatMoney } from '@/lib/utils';
import { imageSizes } from '@/lib/shopify/image';
import { MediaImage } from './MediaImage';
import { Price } from './Price';
import { StarRating } from './StarRating';

function shopAmount(amount: string, currencyCode: string): string {
  if (currencyCode === 'EUR') return formatEuroComma(amount);
  return formatMoney(amount, currencyCode);
}

export type ProductCardData = {
  handle: string;
  title: string;
  image?: { url: string; altText?: string | null; width?: number; height?: number } | null;
  amount: string;
  currencyCode: string;
  compareAtAmount?: string | null;
  oneTimeLabel?: string;
  subscribeSave?: string | null;
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
          <MediaImage
            src={product.image.url}
            alt={product.image.altText || product.title}
            width={product.image.width ?? 800}
            height={product.image.height ?? 800}
            sizes={imageSizes.card}
          />
        ) : null}
        {product.compareAtAmount ? <span className="product-card__sale">Sale</span> : null}
      </div>
      <div className="product-card__body">
        <h2>{product.title}</h2>
        <div className="product-card__pricing">
          <div className="product-card__price">
            {product.oneTimeLabel ? (
              <span className="product-card__price-label">{product.oneTimeLabel}</span>
            ) : null}
            {product.compareAtAmount ? (
              <span className="product-card__compare">
                {shopLayout ? (
                  shopAmount(product.compareAtAmount, product.currencyCode)
                ) : (
                  <Price amount={product.compareAtAmount} currencyCode={product.currencyCode} />
                )}
              </span>
            ) : null}
            {shopLayout ? (
              <span className="price">{shopAmount(product.amount, product.currencyCode)}</span>
            ) : (
              <Price amount={product.amount} currencyCode={product.currencyCode} />
            )}
          </div>
          {product.subscribeSave ? (
            <div className="product-card__subscribe">
              <span className="price">{product.subscribeSave}</span>
            </div>
          ) : null}
        </div>
        {product.showRating === false ? null : (
          <StarRating value={product.rating ?? null} count={product.ratingCount} />
        )}
      </div>
    </Link>
  );
}
