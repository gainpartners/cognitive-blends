import { StarRating } from '@/components/ui/StarRating';
import type { JudgeMeReview } from '@/lib/judgeme';

export function Reviews({
  reviews,
  rating,
  count,
}: {
  reviews: JudgeMeReview[];
  rating: number | null;
  count?: number | null;
}) {
  return (
    <section>
      <h2>Reviews</h2>
      <StarRating value={rating} count={count ?? reviews.length} />
      {reviews.length === 0 ? (
        <p className="muted">Reviews unavailable right now.</p>
      ) : (
        reviews.map((review) => (
          <article key={review.id} className="review">
            <StarRating value={review.rating} />
            <h3>{review.title || 'Review'}</h3>
            <p>{review.body}</p>
            <p className="muted">
              {review.reviewer_name || review.reviewer?.name || 'Customer'} ·{' '}
              {new Date(review.created_at).toLocaleDateString('en-IE')}
            </p>
          </article>
        ))
      )}
    </section>
  );
}
