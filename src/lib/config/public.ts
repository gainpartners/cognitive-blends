import { declare, url } from './env';

export const APP_URL = url(
  declare('NEXT_PUBLIC_APP_URL', process.env.NEXT_PUBLIC_APP_URL, 'defaulted'),
  'http://localhost:3000',
);
