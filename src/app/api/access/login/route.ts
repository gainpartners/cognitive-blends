import { NextResponse } from 'next/server';
import { signAccessToken } from '@/lib/access-auth';
import { ACCESS_PASSWORD } from '@/lib/config/server';
import { logger } from '@/lib/log';

const log = logger('access');

export async function POST(request: Request) {
  let password: unknown;
  try {
    const body = (await request.json()) as { password?: unknown };
    password = body.password;
  } catch {
    log.warn('login body was not JSON');
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }

  if (!ACCESS_PASSWORD) {
    log.warn('login failed; ACCESS_PASSWORD is not set');
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }
  if (password !== ACCESS_PASSWORD) {
    log.warn('login failed; incorrect password');
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
