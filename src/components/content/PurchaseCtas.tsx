import { Button } from '@/components/ui/Button';

export function PurchaseCtas({
  items,
}: {
  items: readonly { label: string; href: string }[];
}) {
  return (
    <div className="purchase-toggle">
      {items.map((item, index) => (
        <Button
          key={item.label}
          as="a"
          href={item.href}
          variant={index === 0 ? 'primary' : 'ghost'}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
}
