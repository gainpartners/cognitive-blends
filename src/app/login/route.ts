import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { CUSTOMER_ACCOUNT_API_CLIENT_ID } from '@/lib/config/server';
import {
  customerAccountReady,
  getOpenIdConfig,
  oauthCallbackUrl,
} from '@/lib/shopify/customer-account';
import {
  generateCodeChallenge,
  generateCodeVerifier,
  generateNonce,
  generateState,
} from '@/lib/pkce';

export async function GET() {
  if (!customerAccountReady()) {
    return NextResponse.json(
      { error: 'Customer Account API is not configured' },
      { status: 503 },
    );
  }

  const { authorization_endpoint } = await getOpenIdConfig();
  const verifier = generateCodeVerifier();
  const state = generateState();
  const nonce = generateNonce();
  const challenge = generateCodeChallenge(verifier);

  const jar = await cookies();
  jar.set(
    'cb_pkce',
    JSON.stringify({ verifier, state, nonce }),
    {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 10,
    },
  );

  const url = new URL(authorization_endpoint);
  url.searchParams.set('client_id', CUSTOMER_ACCOUNT_API_CLIENT_ID);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('redirect_uri', oauthCallbackUrl());
  url.searchParams.set('scope', 'openid email customer-account-api:full');
  url.searchParams.set('state', state);
  url.searchParams.set('nonce', nonce);
  url.searchParams.set('code_challenge', challenge);
  url.searchParams.set('code_challenge_method', 'S256');

  return NextResponse.redirect(url);
}
