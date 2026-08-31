'use client';

import { useEffect } from 'react';

/** Full document navigation. Next `<Link>` / RSC fetch cannot start OAuth. */
export function DocumentRedirect({ href }: { href: string }) {
  useEffect(() => {
    window.location.replace(href);
  }, [href]);

  return <p className="muted">Redirecting…</p>;
}
