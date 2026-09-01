'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navLinks } from '@/content/nav';
import { cn } from '@/lib/utils';

export function NavLinks({
  className,
  label,
}: {
  className?: string;
  label: string;
}) {
  const pathname = usePathname();

  return (
    <nav className={cn('nav-links', className)} aria-label={label}>
      {navLinks.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          aria-current={pathname === link.href ? 'page' : undefined}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
