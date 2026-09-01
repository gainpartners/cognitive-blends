import { loadEnvFiles } from './lib/env-file.mjs';

const { env } = loadEnvFiles(import.meta.url) as {
  env: Record<string, string>;
  loadedAny: boolean;
};

const token = env.JUDGEME_API_TOKEN;
const shopDomain = env.JUDGEME_SHOP_DOMAIN || env.SHOPIFY_STORE_DOMAIN;
const externalId = '9529568592136';

if (!token || !shopDomain) {
  console.error('Need JUDGEME_API_TOKEN and JUDGEME_SHOP_DOMAIN (or SHOPIFY_STORE_DOMAIN)');
  process.exit(1);
}

function judgeUrl(path: string, params: Record<string, string>): URL {
  const url = new URL(`https://judge.me/api/v1${path}`);
  url.searchParams.set('api_token', token);
  url.searchParams.set('shop_domain', shopDomain);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return url;
}

function keysOf(value: unknown): string[] {
  return value && typeof value === 'object' ? Object.keys(value) : [];
}

async function getJson(url: URL): Promise<{ status: number; body: unknown }> {
  const response = await fetch(url, { signal: AbortSignal.timeout(15_000) });
  const body: unknown = await response.json().catch(() => null);
  return { status: response.status, body };
}

function summariseReview(review: Record<string, unknown>) {
  return {
    keys: Object.keys(review),
    id: review.id,
    rating: review.rating,
    title: review.title,
    body_type: typeof review.body,
    body_html_type: typeof review.body_html,
    reviewer_name: review.reviewer_name,
    reviewer_initial: review.reviewer_initial,
    is_anonymous_reviewer: review.is_anonymous_reviewer,
    verified_buyer: review.verified_buyer,
    verified: review.verified,
    created_at: review.created_at,
    source: review.source,
    transparency_badges: review.transparency_badges,
    reviewer_keys: keysOf(review.reviewer),
    pictures_urls: review.pictures_urls,
    video_external_ids: review.video_external_ids,
  };
}

async function main() {
  const lookup = await getJson(
    judgeUrl('/products/-1', { external_id: externalId }),
  );
  const lookupBody = lookup.body as { product?: { id?: number } } | null;
  const productId = lookupBody?.product?.id;

  console.log('lookup.status', lookup.status);
  console.log('lookup.top_keys', keysOf(lookup.body));
  console.log('lookup.product.keys', keysOf(lookupBody?.product));
  console.log('lookup.product.id', productId);
  if (productId) {
    console.log(`map entry:  '${externalId}': ${productId},`);
  }

  if (!productId) {
    console.error('No product.id from lookup; not calling /reviews with Shopify id');
    process.exit(1);
  }

  const list = await getJson(
    judgeUrl('/reviews', {
      product_id: String(productId),
      per_page: '100',
      page: '1',
    }),
  );
  const listBody = list.body as {
    reviews?: Record<string, unknown>[];
    current_page?: unknown;
    per_page?: unknown;
    total?: unknown;
    total_count?: unknown;
    meta?: unknown;
  } | null;

  console.log('reviews.status', list.status);
  console.log('reviews.top_keys', keysOf(list.body));
  console.log('reviews.count', listBody?.reviews?.length ?? 0);
  console.log('reviews.current_page', listBody?.current_page);
  console.log('reviews.per_page', listBody?.per_page);
  console.log('reviews.total', listBody?.total);
  console.log('reviews.total_count', listBody?.total_count);
  console.log('reviews.meta', listBody?.meta);

  for (const review of listBody?.reviews ?? []) {
    console.log('review', JSON.stringify(summariseReview(review)));
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
