import { declare, url } from './env';

export const APP_URL = url(
  declare('NEXT_PUBLIC_APP_URL', process.env.NEXT_PUBLIC_APP_URL, 'defaulted'),
  'http://localhost:3000',
);

/** Host the browser actually hit. Do not use the docs placeholder as redirect_uri. */
export function originFromRequest(request: Request): string {
  return new URL(request.url).origin;
}
