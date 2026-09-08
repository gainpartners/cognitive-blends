'use client';

import { useState } from 'react';
import { MediaImage } from '@/components/ui/MediaImage';
import { imageSizes } from '@/lib/shopify/image';
import type { ShopifyImage } from '@/lib/shopify/types';
import { CaretIcon } from '@/components/layout/icons';

export function ProductGallery({
  images,
  productTitle,
}: {
  images: ShopifyImage[];
  productTitle: string;
}) {
  const slides = images.filter((image) => image.url);
  const [index, setIndex] = useState(0);
  const current = slides[index] ?? slides[0];

  if (!current) return null;

  const count = slides.length;
  const many = count > 1;

  function go(next: number) {
    setIndex((next + count) % count);
  }

  return (
    <div className="product-gallery" aria-label="Gallery">
      <div className="product-gallery__stage">
        {slides.map((image, i) => (
          <div
            key={image.url}
            className="product-gallery__slide"
            hidden={i !== index}
            aria-hidden={i !== index}
            aria-label={`${i + 1} of ${count}`}
          >
            <MediaImage
              src={image.url}
              alt={image.altText || productTitle}
              fill
              sizes={imageSizes.pdp}
              preload={i === 0}
            />
          </div>
        ))}
      </div>
      {many ? (
        <div className="product-gallery__controls">
          <button
            type="button"
            className="product-gallery__nav product-gallery__nav--prev"
            aria-label="Slide left"
            onClick={() => go(index - 1)}
          >
            <CaretIcon />
          </button>
          <p className="product-gallery__count">
            <span>{index + 1}</span>
            <span aria-hidden> / </span>
            <span className="visually-hidden">of</span>
            <span>{count}</span>
          </p>
          <button
            type="button"
            className="product-gallery__nav product-gallery__nav--next"
            aria-label="Slide right"
            onClick={() => go(index + 1)}
          >
            <CaretIcon />
          </button>
        </div>
      ) : null}
      {many ? (
        <ul className="product-gallery__thumbs">
          {slides.map((image, i) => (
            <li key={image.url}>
              <button
                type="button"
                className="product-gallery__thumb"
                aria-label={`Load image ${i + 1} in gallery view`}
                aria-current={i === index ? 'true' : undefined}
                onClick={() => setIndex(i)}
              >
                <MediaImage
                  src={image.url}
                  alt=""
                  width={image.width ?? 88}
                  height={image.height ?? 88}
                  sizes={imageSizes.galleryThumb}
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
