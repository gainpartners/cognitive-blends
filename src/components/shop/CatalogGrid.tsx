import { ProductCard } from '@/components/ui/ProductCard';
import { Reveal } from '@/components/ui/Reveal';
import { popularProducts } from '@/content/home';
import {
  compareAtPrice,
  oneTimePrice,
  subscribePrice,
} from '@/lib/shopify/products';
import type { ProductListItem } from '@/lib/shopify/types';

export function CatalogGrid({ products }: { products: ProductListItem[] }) {
  const order = popularProducts.handles;
  const ordered = [...products].sort((a, b) => {
    const ai = order.indexOf(a.handle);
    const bi = order.indexOf(b.handle);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  return (
    <div className="product-grid">
      {ordered.map((product, index) => {
        const oneTime = oneTimePrice(product);
        const compare = compareAtPrice(product);
        const subscribe = subscribePrice(product);
        return (
          <Reveal key={product.id} order={index}>
            <ProductCard
              product={{
                handle: product.handle,
                title: product.title,
                image: product.featuredImage,
                amount: oneTime.amount,
                currencyCode: oneTime.currencyCode,
                compareAtAmount: compare?.amount,
                subscribeAmount: subscribe?.amount,
                oneTimeLabel: popularProducts.oneTimeLabel,
                subscribeLabel: popularProducts.subscribeLabel,
                showRating: false,
              }}
            />
          </Reveal>
        );
      })}
    </div>
  );
}
