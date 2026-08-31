import { NextResponse } from 'next/server';
import { originFromRequest } from '@/lib/config/public';
import { logoutRedirectUrl } from '@/lib/shopify/customer-account';

export async function GET(request: Request) {
  const origin = originFromRequest(request);
  try {
    return NextResponse.redirect(await logoutRedirectUrl(origin));
  } catch {
    return NextResponse.redirect(new URL('/', origin));
  }
}
