import { Suspense } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { StarRating } from '@/components/ui/StarRating';
import { listReviews, type ProductReview } from '@/lib/judgeme';

export function Reviews({
  externalId,
  rating,
  count,
}: {
  externalId: string;
  rating: number | null;
  count?: number | null;
}) {
  return (
    <section id="reviews" className="reviews">
      <header className="reviews__header">
        <h2>Customer Reviews</h2>
        {rating != null ? (
          <div className="reviews__summary">
            <span className="reviews__average">{rating.toFixed(1)}</span>
            {count != null ? (
              <span>
                {count} review{count === 1 ? '' : 's'}
              </span>
            ) : null}
            <StarRating value={rating} showValue={false} />
          </div>
        ) : null}
      </header>
      <Suspense fallback={<p className="muted">Loading reviews…</p>}>
        <ReviewList externalId={externalId} count={count} />
      </Suspense>
    </section>
  );
}

async function ReviewList({
  externalId,
  count,
}: {
  externalId: string;
  count?: number | null;
}) {
  if (count === 0) return null;

  const { reviews, ok } = await listReviews(externalId);
  if (!ok) {
    return <p className="muted">Reviews unavailable right now.</p>;
  }
  if (reviews.length === 0) return null;

  return (
    <div>
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: ProductReview }) {
  const dated = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString('en-IE')
    : null;

  return (
    <article className="review">
      <StarRating value={review.rating} showValue={false} />
      <div className="review__who">
        <Avatar initial={review.reviewerInitial} />
        <strong>{review.reviewerName}</strong>
        {review.verifiedBuyer ? <Badge tone="verified">Verified</Badge> : null}
        {dated ? (
          <time className="muted" dateTime={review.createdAt}>
            {dated}
          </time>
        ) : null}
      </div>
      {review.body ? <p>{review.body}</p> : null}
      {review.writtenInShopApp ? (
        <p className="muted">Review written in Shop App</p>
      ) : null}
    </article>
  );
}
