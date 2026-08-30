import 'server-only';
import { JUDGEME_API_TOKEN, JUDGEME_SHOP_DOMAIN } from '@/lib/config/server';

export type JudgeMeReview = {
  id: number;
  title: string | null;
  body: string;
  rating: number;
  reviewer_name?: string;
  reviewer?: { name?: string };
  created_at: string;
};

export async function listReviews(externalId: string): Promise<JudgeMeReview[]> {
  if (!JUDGEME_API_TOKEN || !JUDGEME_SHOP_DOMAIN || !externalId) return [];

  const url = new URL('https://judge.me/api/v1/reviews');
  url.searchParams.set('api_token', JUDGEME_API_TOKEN);
  url.searchParams.set('shop_domain', JUDGEME_SHOP_DOMAIN);
  url.searchParams.set('external_id', externalId);
  url.searchParams.set('per_page', '20');

  try {
    const response = await fetch(url, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) return [];
    const payload = (await response.json()) as {
      reviews?: JudgeMeReview[];
    };
    return payload.reviews ?? [];
  } catch {
    return [];
  }
}
