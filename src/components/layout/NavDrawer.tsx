'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { MenuIcon } from './icons';
import { NavLinks } from './NavLinks';

export function NavDrawer() {
  const pathname = usePathname();
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.open = false;
  }, [pathname]);

  return (
    <details ref={ref} className="nav-drawer">
      <summary className="header-icon" aria-label="Menu">
        <MenuIcon />
      </summary>
      <NavLinks label="Menu" />
    </details>
  );
}
