'use client';

import Image, { type ImageProps } from 'next/image';
import {
  imageSizes,
  isShopifyCdn,
  shopifyImageLoader,
} from '@/lib/shopify/image';

type Props = Omit<ImageProps, 'loader'>;

export function MediaImage({
  src,
  alt,
  sizes = imageSizes.full,
  quality = 75,
  ...rest
}: Props) {
  const shopify = typeof src === 'string' && isShopifyCdn(src);
  return (
    <Image
      src={src}
      alt={alt}
      quality={quality}
      {...(shopify ? { loader: shopifyImageLoader } : {})}
      {...rest}
      sizes={sizes}
    />
  );
}
