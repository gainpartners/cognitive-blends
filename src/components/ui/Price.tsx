import { cn, formatMoney } from '@/lib/utils';

export function Price({
  amount,
  currencyCode = 'EUR',
  size = 'md',
}: {
  amount: string | number;
  currencyCode?: string;
  size?: 'md' | 'lg';
}) {
  return (
    <span className={cn('price', size === 'lg' && 'price--lg')}>
      {formatMoney(amount, currencyCode)}
    </span>
  );
}
