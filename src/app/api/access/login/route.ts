import { NextResponse } from 'next/server';
import { signAccessToken } from '@/lib/access-auth';
import { ACCESS_PASSWORD } from '@/lib/config/server';

export async function POST(request: Request) {
  const { password } = await request.json();

  if (!ACCESS_PASSWORD || password !== ACCESS_PASSWORD) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }

  const token = await signAccessToken();
  const response = NextResponse.json({ success: true });
  response.cookies.set('cb_access', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
  return response;
}
