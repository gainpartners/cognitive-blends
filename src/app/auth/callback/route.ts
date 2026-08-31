import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { originFromRequest } from '@/lib/config/public';
import {
  exchangeAuthorizationCode,
  oauthCallbackUrl,
} from '@/lib/shopify/customer-account';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const jar = await cookies();
  const raw = jar.get('cb_pkce')?.value;

  jar.delete('cb_pkce');

  if (!code || !state || !raw) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const stored = JSON.parse(raw) as {
    verifier: string;
    state: string;
    redirectUri?: string;
  };
  if (stored.state !== state) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  await exchangeAuthorizationCode(
    code,
    stored.verifier,
    stored.redirectUri ?? oauthCallbackUrl(originFromRequest(request)),
  );
  return NextResponse.redirect(new URL('/account', request.url));
}
