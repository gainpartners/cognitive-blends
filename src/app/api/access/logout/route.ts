import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL('/brand/login', request.url));
  response.cookies.delete('cb_access');
  return response;
}
