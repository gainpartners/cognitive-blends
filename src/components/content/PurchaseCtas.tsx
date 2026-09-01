import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function PurchaseCtas({
  items,
  stacked = false,
}: {
  items: readonly { label: string; href: string }[];
  stacked?: boolean;
}) {
  return (
    <div className={cn('purchase-toggle', stacked && 'purchase-toggle--stack')}>
      {items.map((item, index) => (
        <Button
          key={item.label}
          as="a"
          href={item.href}
          variant={index === 0 ? 'secondary' : 'ghost'}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
}
