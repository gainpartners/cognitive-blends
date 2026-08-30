import Image from 'next/image';
import Link from 'next/link';
import { Price } from './Price';
import { StarRating } from './StarRating';

export type ProductCardData = {
  handle: string;
  title: string;
  image?: { url: string; altText?: string | null; width?: number; height?: number } | null;
  amount: string;
  currencyCode: string;
  rating?: number | null;
  ratingCount?: number | null;
};

export function ProductCard({ product }: { product: ProductCardData }) {
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
        <Price amount={product.amount} currencyCode={product.currencyCode} />
        <StarRating value={product.rating ?? null} count={product.ratingCount} />
      </div>
    </Link>
  );
}
