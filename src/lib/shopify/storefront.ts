import 'server-only';
import {
  SHOPIFY_STOREFRONT_API_TOKEN,
  isStorefrontConfigured,
  storefrontEndpoint,
} from '@/lib/config/server';

const REQUEST_TIMEOUT_MS = 15_000;

export class StorefrontError extends Error {
  constructor(
    message: string,
    public status = 502,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'StorefrontError';
  }
}

export async function storefrontFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  options?: { cache?: RequestCache; revalidate?: number },
): Promise<T> {
  if (!isStorefrontConfigured()) {
    throw new StorefrontError(
      'SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_API_TOKEN must be set',
      503,
    );
  }

  const token = SHOPIFY_STOREFRONT_API_TOKEN.trim();
  if (token.startsWith('shpat_')) {
    throw new StorefrontError(
      'SHOPIFY_STOREFRONT_API_TOKEN is an Admin API token (shpat_). Use the Headless Storefront API public or private token instead.',
      401,
    );
  }

  const authHeader = token.startsWith('shfpt_') || token.startsWith('shpss_')
    ? { 'Shopify-Storefront-Private-Token': token }
    : { 'X-Shopify-Storefront-Access-Token': token };

  let response: Response;
  try {
    response = await fetch(storefrontEndpoint(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify({ query, variables }),
      cache: options?.cache ?? 'no-store',
      next:
        options?.revalidate != null ? { revalidate: options.revalidate } : undefined,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === 'TimeoutError';
    throw new StorefrontError(
      timedOut ? 'Storefront request timed out' : 'Could not reach Shopify',
      504,
    );
  }

  const raw = await response.text();
  let payload: { data?: T; errors?: { message: string }[] };
  try {
    payload = raw ? JSON.parse(raw) : {};
  } catch {
    throw new StorefrontError('Storefront returned a malformed response', 502, raw.slice(0, 500));
  }

  if (!response.ok) {
    throw new StorefrontError(`Storefront HTTP ${response.status}`, response.status, payload);
  }

  if (payload.errors?.length) {
    throw new StorefrontError(payload.errors[0].message, 502, payload.errors);
  }

  if (!payload.data) {
    throw new StorefrontError('Storefront returned no data', 502, payload);
  }

  return payload.data;
}
