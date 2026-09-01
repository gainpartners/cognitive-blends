/** ThriveOne Shopify id → Judge.me internal product id. Filled from `npm run probe:reviews`. */
export const JUDGEME_PRODUCT_ID_BY_EXTERNAL_ID: Record<string, number> = {
  // '9529568592136': <probe>,
};

export const REVIEWS_PER_PAGE = 100;

export type ProductReview = {
  id: string;
  rating: number;
  body: string;
  reviewerName: string;
  reviewerInitial: string;
  verifiedBuyer: boolean;
  createdAt: string;
  writtenInShopApp: boolean;
};

export type ListReviewsResult = {
  reviews: ProductReview[];
  ok: boolean;
};

export type JudgeMeReviewPayload = {
  id?: number | string;
  uuid?: string;
  rating?: unknown;
  body?: unknown;
  body_html?: unknown;
  reviewer_name?: unknown;
  reviewer_initial?: unknown;
  reviewer?: { name?: unknown };
  is_anonymous_reviewer?: unknown;
  verified_buyer?: unknown;
  created_at?: unknown;
  source?: unknown;
  transparency_badges?: unknown;
};

export function resolveJudgeMeProductId(
  externalId: string,
  map: Record<string, number> = JUDGEME_PRODUCT_ID_BY_EXTERNAL_ID,
): number | null {
  if (!externalId) return null;
  const id = map[externalId];
  return typeof id === 'number' && Number.isFinite(id) ? id : null;
}

export function isWrittenInShopApp(review: JudgeMeReviewPayload): boolean {
  if (review.source === 'shop-app') return true;
  const badges = review.transparency_badges;
  if (!Array.isArray(badges)) return false;
  return badges.some((badge) => {
    if (badge === 'review_written_in_shop_app') return true;
    if (badge && typeof badge === 'object') {
      const record = badge as { type?: unknown; name?: unknown; slug?: unknown };
      return (
        record.type === 'review_written_in_shop_app' ||
        record.name === 'review_written_in_shop_app' ||
        record.slug === 'review_written_in_shop_app'
      );
    }
    return false;
  });
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function initialFrom(name: string, fallback: string): string {
  const letter = fallback || name;
  const ch = letter.charAt(0);
  return ch ? ch.toUpperCase() : '?';
}

export function mapJudgeMeReview(raw: JudgeMeReviewPayload): ProductReview | null {
  const id = raw.id != null ? String(raw.id) : text(raw.uuid);
  if (!id) return null;

  const rating = Number(raw.rating);
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) return null;

  const reviewerInitial = text(raw.reviewer_initial);
  const reviewerNameRaw = text(raw.reviewer_name) || text(raw.reviewer?.name);
  const anonymous = raw.is_anonymous_reviewer === true;
  const reviewerName = anonymous
    ? reviewerInitial || reviewerNameRaw || 'Customer'
    : reviewerNameRaw || reviewerInitial || 'Customer';

  return {
    id,
    rating,
    body: text(raw.body),
    reviewerName,
    reviewerInitial: initialFrom(reviewerName, reviewerInitial),
    verifiedBuyer: raw.verified_buyer === true,
    createdAt: text(raw.created_at),
    writtenInShopApp: isWrittenInShopApp(raw),
  };
}

export function mapJudgeMeReviews(payload: unknown): ProductReview[] {
  const reviews =
    payload && typeof payload === 'object' && 'reviews' in payload
      ? (payload as { reviews?: unknown }).reviews
      : payload;
  if (!Array.isArray(reviews)) return [];
  return reviews.flatMap((entry) => {
    if (!entry || typeof entry !== 'object') return [];
    const mapped = mapJudgeMeReview(entry as JudgeMeReviewPayload);
    return mapped ? [mapped] : [];
  });
}
