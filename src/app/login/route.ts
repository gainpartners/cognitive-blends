import { NextResponse } from 'next/server';
import { shopifyHostedAccountUrl } from '@/lib/config/server';
import { logger } from '@/lib/log';

const log = logger('account');

export async function GET(request: Request) {
  const account = shopifyHostedAccountUrl();
  if (!account) {
    log.warn('login redirect skipped; SHOPIFY_SHOP_ID is not set');
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.redirect(account);
}
