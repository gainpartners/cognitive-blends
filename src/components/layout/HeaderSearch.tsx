import { cn } from '@/lib/utils';
import { SearchIcon } from './icons';

export function HeaderSearch({ className }: { className?: string }) {
  return (
    <details className={cn('header-search', className)}>
      <summary className="header-icon" aria-label="Search">
        <SearchIcon />
      </summary>
      <form role="search" action="/" method="get">
        <input type="search" name="q" placeholder="Search" aria-label="Search" />
      </form>
    </details>
  );
}
