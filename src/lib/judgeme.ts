import 'server-only';
import { JUDGEME_API_TOKEN, JUDGEME_SHOP_DOMAIN } from '@/lib/config/server';
import {
  REVIEWS_PER_PAGE,
  mapJudgeMeReviews,
  resolveJudgeMeProductId,
  type ListReviewsResult,
} from '@/lib/judgeme-model';

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

export async function listReviews(externalId: string): Promise<ListReviewsResult> {
  const productId = resolveJudgeMeProductId(externalId);
  if (!productId || !JUDGEME_API_TOKEN || !JUDGEME_SHOP_DOMAIN) {
    return { reviews: [], ok: false };
  }

  try {
    const response = await fetch(reviewsUrl(productId), {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) return { reviews: [], ok: false };
    const payload: unknown = await response.json();
    return { reviews: mapJudgeMeReviews(payload), ok: true };
  } catch {
    return { reviews: [], ok: false };
  }
}
