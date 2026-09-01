import { cn } from '@/lib/utils';

export type BadgeTone = 'subscribe' | 'onetime' | 'active' | 'inactive' | 'verified';

export function Badge({
  tone,
  children,
}: {
  tone: BadgeTone;
  children: React.ReactNode;
}) {
  return <span className={cn('badge', `badge--${tone}`)}>{children}</span>;
}
