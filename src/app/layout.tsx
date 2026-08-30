import type { Metadata } from 'next';
import { Assistant, EB_Garamond } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { shouldNoIndex } from '@/lib/access';
import './globals.css';

const assistant = Assistant({
  subsets: ['latin'],
  variable: '--font-assistant',
});

const garamond = EB_Garamond({
  subsets: ['latin'],
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
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
