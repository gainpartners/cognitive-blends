export const imageSizes = {
  card: '(min-width: 990px) 360px, (min-width: 750px) 45vw, 92vw',
  half: '(min-width: 750px) 50vw, 100vw',
  full: '100vw',
  feature: '88px',
  audience: '72px',
  thumb: '88px',
  search: '48px',
  pdp: '(min-width: 800px) 55vw, 92vw',
} as const;

export function isShopifyCdn(src: string): boolean {
  try {
    return new URL(src).hostname === 'cdn.shopify.com';
  } catch {
    return false;
  }
}

export function shopifyImageLoader({
  src,
  width,
}: {
  src: string;
  width: number;
}): string {
  const url = new URL(src);
  url.searchParams.set('width', String(Math.round(width)));
  return url.toString();
}
