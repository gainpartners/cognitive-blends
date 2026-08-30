import { NextResponse } from 'next/server';
import { logoutRedirectUrl } from '@/lib/shopify/customer-account';

export async function GET() {
  try {
    return NextResponse.redirect(await logoutRedirectUrl());
  } catch {
    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
  }
}
