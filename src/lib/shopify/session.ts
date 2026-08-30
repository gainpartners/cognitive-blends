import 'server-only';
import { createHash } from 'crypto';
import { cookies } from 'next/headers';
import { EncryptJWT, jwtDecrypt } from 'jose';
import { ACCESS_SESSION_SECRET } from '@/lib/config/server';

const COOKIE = 'cb_customer';

export type CustomerTokens = {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresAt: number;
};

function key() {
  return createHash('sha256').update(ACCESS_SESSION_SECRET || 'missing').digest();
}

export async function getCustomerTokens(): Promise<CustomerTokens | null> {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw || !ACCESS_SESSION_SECRET) return null;
  try {
    const { payload } = await jwtDecrypt(raw, key());
    const accessToken = payload.accessToken;
    const expiresAt = payload.expiresAt;
    if (typeof accessToken !== 'string' || typeof expiresAt !== 'number') return null;
    return {
      accessToken,
      refreshToken: typeof payload.refreshToken === 'string' ? payload.refreshToken : undefined,
      idToken: typeof payload.idToken === 'string' ? payload.idToken : undefined,
      expiresAt,
    };
  } catch {
    return null;
  }
}

export async function setCustomerTokens(tokens: CustomerTokens) {
  const jwt = await new EncryptJWT({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    idToken: tokens.idToken,
    expiresAt: tokens.expiresAt,
  })
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setExpirationTime('14d')
    .encrypt(key());

  (await cookies()).set(COOKIE, jwt, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function clearCustomerTokens() {
  (await cookies()).delete(COOKIE);
}
