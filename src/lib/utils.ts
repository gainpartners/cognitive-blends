export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatMoney(
  amount: string | number,
  currencyCode = 'EUR',
): string {
  const value = typeof amount === 'string' ? Number.parseFloat(amount) : amount;
  if (!Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: currencyCode,
  }).format(value);
}

export function productNumericId(gid: string): string {
  const match = gid.match(/Product\/(\d+)/);
  return match?.[1] ?? '';
}
