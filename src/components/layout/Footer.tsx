import Link from 'next/link';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell">
        Formulas for modern living. Made in the West of Ireland.{' '}
        <Link href="/brand">Brand</Link>
      </div>
    </footer>
  );
}
