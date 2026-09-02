'use client';

import { useEffect, useId, useMemo, useRef, useState, useTransition } from 'react';
import { setCountryAction } from '@/app/actions/country';
import type { MarketCountry } from '@/lib/shopify/types';
import { CaretIcon } from './icons';

export function CountrySelector({
  current,
  countries,
  label,
  variant = 'plain',
}: {
  current: MarketCountry;
  countries: MarketCountry[];
  label?: string;
  variant?: 'plain' | 'select';
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [pending, startTransition] = useTransition();
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const sorted = useMemo(
    () => [...countries].sort((a, b) => a.name.localeCompare(b.name, 'en')),
    [countries],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter((country) => {
      const hay = `${country.name} ${country.isoCode} ${country.currency.isoCode} ${country.currency.symbol}`;
      return hay.toLowerCase().includes(q);
    });
  }, [sorted, query]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        setQuery('');
      }
    }

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  if (countries.length < 2) return null;

  function choose(code: string) {
    setOpen(false);
    setQuery('');
    if (code === current.isoCode) return;
    startTransition(() => setCountryAction(code));
  }

  return (
    <div
      className={variant === 'select' ? 'locale-picker locale-picker--select' : 'locale-picker'}
      ref={rootRef}
      aria-busy={pending}
    >
      {label ? (
        <p className="locale-picker__label" id={`${listId}-label`}>
          {label}
        </p>
      ) : null}
      <button
        type="button"
        className="locale-picker__toggle"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        aria-describedby={label ? `${listId}-label` : undefined}
        onClick={() => setOpen((value) => !value)}
        disabled={pending}
      >
        <span>
          {current.name} | {current.currency.isoCode} {current.currency.symbol}
        </span>
        <CaretIcon />
      </button>
      {open ? (
        <div className="locale-picker__panel" id={listId} role="listbox">
          <input
            type="search"
            className="locale-picker__search"
            placeholder="Search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            autoFocus
            aria-label="Search countries"
          />
          <ul className="locale-picker__list">
            {filtered.map((country) => (
              <li key={country.isoCode}>
                <button
                  type="button"
                  role="option"
                  aria-selected={country.isoCode === current.isoCode}
                  onClick={() => choose(country.isoCode)}
                >
                  {country.name}{' '}
                  <span className="locale-picker__currency">
                    {country.currency.isoCode} {country.currency.symbol}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
