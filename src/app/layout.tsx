import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Assistant, EB_Garamond } from 'next/font/google';
import { Consent } from '@/components/analytics/Consent';
import { PostHogProvider } from '@/components/analytics/PostHogProvider';
import { shouldNoIndex } from '@/lib/access';
import './globals.css';

const assistant = Assistant({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-assistant',
});

const garamond = EB_Garamond({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-eb-garamond',
});

export const metadata: Metadata = {
  title: {
    default: 'Cognitive Blends',
    template: '%s · Cognitive Blends',
  },
  description: 'Formulas for modern living. Made in the West of Ireland.',
  robots: shouldNoIndex ? { index: false, follow: false } : undefined,
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en-IE" className={`${assistant.variable} ${garamond.variable}`}>
      <body>
        {children}
        <Suspense fallback={null}>
          <PostHogProvider />
        </Suspense>
        <Consent />
      </body>
    </html>
  );
}
