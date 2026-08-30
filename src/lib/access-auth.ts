import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { ACCESS_SESSION_SECRET } from './config/server';

const secret = new TextEncoder().encode(ACCESS_SESSION_SECRET);

export async function signAccessToken() {
  if (!ACCESS_SESSION_SECRET) {
    throw new Error('ACCESS_SESSION_SECRET is not set');
  }

  return new SignJWT({ authorized: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .setIssuedAt()
    .sign(secret);
}

export async function verifyAccessToken(token: string) {
  if (!ACCESS_SESSION_SECRET) return false;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.authorized === true;
  } catch {
    return false;
  }
}
