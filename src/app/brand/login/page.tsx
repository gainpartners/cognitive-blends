import type { Metadata } from 'next';
import { safeNext } from '@/lib/access';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Sign in',
  robots: { index: false, follow: false },
};

export default async function AccessLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string | string[] }>;
}) {
  const { from } = await searchParams;
  const raw = typeof from === 'string' ? from : null;
  return <LoginForm next={safeNext(raw)} />;
}
