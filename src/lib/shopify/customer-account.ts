import 'server-only';
import {
  CUSTOMER_ACCOUNT_API_CLIENT_ID,
  CUSTOMER_ACCOUNT_API_VERSION,
  SHOPIFY_SHOP_ID,
  SHOPIFY_STORE_DOMAIN,
  customerAccountGraphqlEndpoint,
  isCustomerAccountConfigured,
} from '@/lib/config/server';
import { APP_URL } from '@/lib/config/public';
import {
  clearCustomerTokens,
  getCustomerTokens,
  setCustomerTokens,
} from './session';

const REQUEST_TIMEOUT_MS = 15_000;

export class CustomerAccountError extends Error {
  constructor(
    message: string,
    public status = 502,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'CustomerAccountError';
  }
}

type OpenIdConfig = {
  authorization_endpoint: string;
  token_endpoint: string;
  end_session_endpoint: string;
};

export async function getOpenIdConfig(): Promise<OpenIdConfig> {
  const response = await fetch(
    `https://${SHOPIFY_STORE_DOMAIN}/.well-known/openid-configuration`,
    { cache: 'no-store', signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) },
  );
  if (!response.ok) {
    throw new CustomerAccountError('Could not load OpenID configuration', response.status);
  }
  return (await response.json()) as OpenIdConfig;
}

export function oauthCallbackUrl(origin = APP_URL) {
  return `${origin.replace(/\/+$/, '')}/auth/callback`;
}

export function customerAccountReady() {
  return isCustomerAccountConfigured();
}

async function tokenRequest(body: URLSearchParams) {
  const { token_endpoint } = await getOpenIdConfig();
  const response = await fetch(token_endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    cache: 'no-store',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  const text = await response.text();
  if (!response.ok) {
    throw new CustomerAccountError(`Token exchange failed: ${response.status}`, response.status, text);
  }
  return JSON.parse(text) as {
    access_token: string;
    refresh_token?: string;
    id_token?: string;
    expires_in: number;
  };
}

export async function exchangeAuthorizationCode(
  code: string,
  verifier: string,
  redirectUri: string,
) {
  const tokens = await tokenRequest(
    new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: CUSTOMER_ACCOUNT_API_CLIENT_ID,
      redirect_uri: redirectUri,
      code,
      code_verifier: verifier,
    }),
  );
  await setCustomerTokens({
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    idToken: tokens.id_token,
    expiresAt: Date.now() + tokens.expires_in * 1000,
  });
}

async function refreshIfNeeded() {
  const current = await getCustomerTokens();
  if (!current) return null;
  if (current.expiresAt > Date.now() + 30_000) return current;
  if (!current.refreshToken) return current;

  try {
    const tokens = await tokenRequest(
      new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: CUSTOMER_ACCOUNT_API_CLIENT_ID,
        refresh_token: current.refreshToken,
      }),
    );
    const next = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token ?? current.refreshToken,
      idToken: tokens.id_token ?? current.idToken,
      expiresAt: Date.now() + tokens.expires_in * 1000,
    };
    await setCustomerTokens(next);
    return next;
  } catch {
    return current;
  }
}

export async function customerFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const session = await refreshIfNeeded();
  if (!session) {
    throw new CustomerAccountError('Not signed in', 401);
  }

  const endpoint =
    SHOPIFY_SHOP_ID.length > 0
      ? customerAccountGraphqlEndpoint()
      : `https://${SHOPIFY_STORE_DOMAIN}/customer/api/${CUSTOMER_ACCOUNT_API_VERSION}/graphql`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: session.accessToken,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  const payload = (await response.json()) as {
    data?: T;
    errors?: { message: string }[];
  };

  if (!response.ok) {
    throw new CustomerAccountError(`Customer API HTTP ${response.status}`, response.status, payload);
  }
  if (payload.errors?.length) {
    throw new CustomerAccountError(payload.errors[0].message, 502, payload.errors);
  }
  if (!payload.data) {
    throw new CustomerAccountError('Customer API returned no data', 502, payload);
  }
  return payload.data;
}

export async function logoutRedirectUrl(origin = APP_URL) {
  const session = await getCustomerTokens();
  const { end_session_endpoint } = await getOpenIdConfig();
  const url = new URL(end_session_endpoint);
  if (session?.idToken) url.searchParams.set('id_token_hint', session.idToken);
  url.searchParams.set('post_logout_redirect_uri', `${origin.replace(/\/+$/, '')}/`);
  await clearCustomerTokens();
  return url.toString();
}
