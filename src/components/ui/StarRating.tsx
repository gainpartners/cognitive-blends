export function parseRatingValue(raw: string | null | undefined): number | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { value?: string | number };
    const n = Number.parseFloat(String(parsed.value ?? raw));
    return Number.isFinite(n) ? n : null;
  } catch {
    const n = Number.parseFloat(raw);
    return Number.isFinite(n) ? n : null;
  }
}

export function StarRating({
  value,
  count,
  showValue = true,
}: {
  value: number | null;
  count?: number | null;
  showValue?: boolean;
}) {
  if (value == null) return null;
  const rounded = Math.round(value);
  const marks = '★★★★★'.slice(0, Math.min(5, Math.max(0, rounded))).padEnd(5, '☆');

  return (
    <span className="stars">
      <span className="stars__marks" aria-hidden>
        {marks}
      </span>
      {showValue ? (
        <span>
          {value.toFixed(1)}
          {count != null ? ` · ${count} review${count === 1 ? '' : 's'}` : ''}
        </span>
      ) : null}
    </span>
  );
}
