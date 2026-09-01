import 'server-only';
import { JUDGEME_API_TOKEN, JUDGEME_SHOP_DOMAIN } from '@/lib/config/server';
import {
  JUDGEME_PRODUCT_ID_BY_EXTERNAL_ID,
  REVIEWS_PER_PAGE,
  mapJudgeMeReviews,
  resolveJudgeMeProductId,
  type ListReviewsResult,
} from '@/lib/judgeme-model';
import { errorFields, logger } from '@/lib/log';

const log = logger('judgeme');

export type { ListReviewsResult, ProductReview } from '@/lib/judgeme-model';
export { resolveJudgeMeProductId } from '@/lib/judgeme-model';

const REQUEST_TIMEOUT_MS = 10_000;
const REVALIDATE_SECONDS = 3600;

function reviewsUrl(productId: number): URL {
  const url = new URL('https://judge.me/api/v1/reviews');
  url.searchParams.set('api_token', JUDGEME_API_TOKEN);
  url.searchParams.set('shop_domain', JUDGEME_SHOP_DOMAIN);
  url.searchParams.set('product_id', String(productId));
  url.searchParams.set('per_page', String(REVIEWS_PER_PAGE));
  url.searchParams.set('page', '1');
  return url;
}

function logUrl(url: URL): string {
  const safe = new URL(url);
  if (safe.searchParams.has('api_token')) safe.searchParams.set('api_token', 'redacted');
  return safe.toString();
}

function skip(
  reason: string,
  extra: Record<string, unknown>,
): ListReviewsResult {
  log.warn('listReviews skipped', {
    reason,
    hasToken: Boolean(JUDGEME_API_TOKEN),
    shopDomain: JUDGEME_SHOP_DOMAIN || null,
    ...extra,
  });
  return { reviews: [], ok: false };
}

export async function listReviews(externalId: string): Promise<ListReviewsResult> {
  const productId = resolveJudgeMeProductId(externalId);

  if (!JUDGEME_API_TOKEN) {
    return skip('missing-token', { externalId, productId });
  }
  if (!JUDGEME_SHOP_DOMAIN) {
    return skip('missing-shop-domain', { externalId, productId });
  }
  if (!productId) {
    return skip('missing-product-id', {
      externalId,
      mappedIds: Object.keys(JUDGEME_PRODUCT_ID_BY_EXTERNAL_ID),
    });
  }

  const url = reviewsUrl(productId);
  log.debug('listReviews fetch', {
    externalId,
    productId,
    shopDomain: JUDGEME_SHOP_DOMAIN,
    url: logUrl(url),
  });

  try {
    const response = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) {
      const body = await response.text().catch(() => '');
      log.warn('listReviews http error', {
        status: response.status,
        body: body.slice(0, 300),
      });
      return { reviews: [], ok: false };
    }
    const payload: unknown = await response.json();
    const reviews = mapJudgeMeReviews(payload);
    const rawCount =
      payload && typeof payload === 'object' && Array.isArray((payload as { reviews?: unknown }).reviews)
        ? (payload as { reviews: unknown[] }).reviews.length
        : null;
    log.debug('listReviews ok', {
      rawCount,
      mappedCount: reviews.length,
      payloadKeys:
        payload && typeof payload === 'object' ? Object.keys(payload) : typeof payload,
    });
    return { reviews, ok: true };
  } catch (error) {
    log.warn('listReviews threw', errorFields(error));
    return { reviews: [], ok: false };
  }
}
