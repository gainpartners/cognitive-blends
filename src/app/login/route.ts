import { NextResponse } from 'next/server';
import { shopifyHostedAccountUrl } from '@/lib/config/server';

export async function GET(request: Request) {
  const account = shopifyHostedAccountUrl();
  if (!account) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.redirect(account);
}
