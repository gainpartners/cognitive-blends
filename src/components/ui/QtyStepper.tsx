'use client';

export function QtyStepper({
  name = 'quantity',
  value,
  onChange,
  min = 1,
  max = 99,
  label = 'Quantity',
}: {
  name?: string;
  value: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
}) {
  function clamp(next: number) {
    if (!Number.isFinite(next)) return min;
    return Math.min(max, Math.max(min, next));
  }

  const interactive = Boolean(onChange);

  return (
    <div className="qty">
      <p className="qty__label">{label}</p>
      <div className="qty__control">
        <button
          type="button"
          aria-label="Decrease quantity"
          disabled={!interactive || value <= min}
          onClick={() => onChange?.(clamp(value - 1))}
        >
          −
        </button>
        <input
          name={name}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          readOnly={!interactive}
          aria-label={label}
          onChange={(event) => onChange?.(clamp(Number.parseInt(event.target.value, 10)))}
        />
        <button
          type="button"
          aria-label="Increase quantity"
          disabled={!interactive || value >= max}
          onClick={() => onChange?.(clamp(value + 1))}
        >
          +
        </button>
      </div>
    </div>
  );
}
