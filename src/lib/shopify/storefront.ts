import 'server-only';
import {
  SHOPIFY_STOREFRONT_API_TOKEN,
  isStorefrontConfigured,
  storefrontEndpoint,
} from '@/lib/config/server';
import { logger } from '@/lib/log';

const log = logger('storefront');

const REQUEST_TIMEOUT_MS = 15_000;

function operationName(query: string): string {
  const match = query.match(/\b(?:query|mutation)\s+([A-Za-z0-9_]+)/);
  return match?.[1] ?? 'anonymous';
}

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

function fail(
  message: string,
  status: number,
  fields?: Record<string, unknown>,
  details?: unknown,
): never {
  log.error(message, fields);
  throw new StorefrontError(message, status, details);
}

export async function storefrontFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  options?: { cache?: RequestCache; revalidate?: number },
): Promise<T> {
  const operation = operationName(query);

  if (!isStorefrontConfigured()) {
    fail(
      'SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_API_TOKEN must be set',
      503,
      { operation },
    );
  }

  const token = SHOPIFY_STOREFRONT_API_TOKEN.trim();
  if (token.startsWith('shpat_')) {
    fail(
      'SHOPIFY_STOREFRONT_API_TOKEN is an Admin API token (shpat_). Use the Headless Storefront API public or private token instead.',
      401,
      { operation },
    );
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token.startsWith('shfpt_') || token.startsWith('shpss_')) {
    headers['Shopify-Storefront-Private-Token'] = token;
  } else {
    headers['X-Shopify-Storefront-Access-Token'] = token;
  }

  let response: Response;
  try {
    response = await fetch(storefrontEndpoint(), {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
      cache: options?.cache ?? 'no-store',
      next:
        options?.revalidate != null ? { revalidate: options.revalidate } : undefined,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === 'TimeoutError';
    fail(
      timedOut ? 'Storefront request timed out' : 'Could not reach Shopify',
      504,
      {
        operation,
        timedOut,
        name: error instanceof Error ? error.name : 'unknown',
      },
    );
  }

  const raw = await response.text();
  let payload: { data?: T; errors?: { message: string }[] };
  try {
    payload = raw ? JSON.parse(raw) : {};
  } catch {
    fail('Storefront returned a malformed response', 502, {
      operation,
      status: response.status,
      body: raw.slice(0, 300),
    }, raw.slice(0, 500));
  }

  if (!response.ok) {
    fail(`Storefront HTTP ${response.status}`, response.status, {
      operation,
      status: response.status,
    }, payload);
  }

  if (payload.errors?.length) {
    fail(payload.errors[0].message, 502, {
      operation,
      errors: payload.errors.map((entry) => entry.message),
    }, payload.errors);
  }

  if (!payload.data) {
    fail('Storefront returned no data', 502, { operation }, payload);
  }

  return payload.data;
}
