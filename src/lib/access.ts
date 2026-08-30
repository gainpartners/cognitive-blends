import { SITE_ACCESS, type SiteAccess } from './config/server';

export { SITE_ACCESS };
export type { SiteAccess };

const ALWAYS_OPEN = [
  '/brand/login',
  '/api/access/login',
  '/api/access/logout',
  '/_next',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/.well-known',
];

export function isAlwaysOpen(pathname: string): boolean {
  return ALWAYS_OPEN.some(
    (open) => pathname === open || pathname.startsWith(`${open}/`),
  );
}

export function requiresAuth(pathname: string): boolean {
  if (pathname.startsWith('/brand')) return true;
  return SITE_ACCESS === 'preview';
}

export function comingSoonAllows(pathname: string): boolean {
  return pathname === '/coming-soon' || pathname.startsWith('/api');
}

export const shouldNoIndex = SITE_ACCESS !== 'public';

export function safeNext(
  raw: string | null | undefined,
  fallback = '/',
): string {
  if (!raw) return fallback;
  if (!raw.startsWith('/')) return fallback;
  if (raw.startsWith('//') || raw.startsWith('/\\')) return fallback;
  if (raw.includes('://')) return fallback;
  if (raw === '/brand/login' || raw.startsWith('/brand/login?')) return fallback;
  return raw;
}
