import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessToken } from '@/lib/access-auth';
import {
  SITE_ACCESS,
  comingSoonAllows,
  isAlwaysOpen,
  requiresAuth,
  shouldNoIndex,
} from '@/lib/access';

function sealed(response: NextResponse): NextResponse {
  if (shouldNoIndex) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isAlwaysOpen(pathname)) return sealed(NextResponse.next());

  if (
    SITE_ACCESS === 'coming-soon' &&
    !requiresAuth(pathname) &&
    !comingSoonAllows(pathname)
  ) {
    return sealed(NextResponse.redirect(new URL('/coming-soon', request.url)));
  }

  if (requiresAuth(pathname)) {
    const token = request.cookies.get('cb_access')?.value;

    if (!token || !(await verifyAccessToken(token))) {
      const login = new URL('/brand/login', request.url);
      login.searchParams.set('from', `${pathname}${request.nextUrl.search}`);
      return sealed(NextResponse.redirect(login));
    }
  }

  return sealed(NextResponse.next());
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf|css|js)$).*)',
  ],
};
