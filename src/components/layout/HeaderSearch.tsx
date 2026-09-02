'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import Link from 'next/link';
import { MediaImage } from '@/components/ui/MediaImage';
import { imageSizes } from '@/lib/shopify/image';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { PredictiveSearchResult } from '@/lib/shopify/types';
import { CloseIcon, SearchIcon } from './icons';

const SearchContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

function useSearch() {
  const value = useContext(SearchContext);
  if (!value) throw new Error('SearchTrigger must be used within SearchProvider');
  return value;
}

export function SearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <SearchContext.Provider value={{ open, setOpen }}>
      {children}
      {open ? <SearchOverlay onClose={() => setOpen(false)} /> : null}
    </SearchContext.Provider>
  );
}

export function SearchTrigger({ className }: { className?: string }) {
  const { setOpen } = useSearch();
  return (
    <button
      type="button"
      className={cn('header-icon', className)}
      aria-label="Search"
      onClick={() => setOpen(true)}
    >
      <SearchIcon />
    </button>
  );
}

const emptyResult: PredictiveSearchResult = {
  products: [],
  queries: [],
  pages: [],
};

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<PredictiveSearchResult>(emptyResult);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setPending(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          setResult(emptyResult);
          return;
        }
        const data = (await response.json()) as PredictiveSearchResult;
        setResult({
          products: data.products ?? [],
          queries: data.queries ?? [],
          pages: data.pages ?? [],
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setResult(emptyResult);
      } finally {
        setPending(false);
      }
    }, 200);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query]);

  const go = useCallback(
    (href: string) => {
      onClose();
      router.push(href);
    },
    [onClose, router],
  );

  const showPanel = query.trim().length >= 2;
  const shown = showPanel ? result : emptyResult;
  const hasResults =
    shown.queries.length + shown.products.length + shown.pages.length > 0;

  return (
    <div className="search-overlay">
      <form
        className="search-overlay__form"
        role="search"
        action="/search"
        method="get"
        onSubmit={onClose}
      >
        <div className="search-overlay__field">
          <label className="search-overlay__label" htmlFor="header-search-q">
            Search
          </label>
          <input
            ref={inputRef}
            id="header-search-q"
            type="search"
            name="q"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            autoComplete="off"
            aria-autocomplete="list"
            aria-controls="header-search-results"
          />
          <button type="submit" className="search-overlay__submit" aria-label="Search">
            <SearchIcon />
          </button>
        </div>
        <button
          type="button"
          className="header-icon search-overlay__close"
          aria-label="Close search"
          onClick={onClose}
        >
          <CloseIcon />
        </button>
      </form>
      {showPanel ? (
        <div className="search-overlay__results" id="header-search-results">
          {pending && !hasResults ? <p className="muted">Searching…</p> : null}
          {!pending && !hasResults ? <p className="muted">No results found.</p> : null}
          {shown.queries.length > 0 ? (
            <ul className="search-overlay__queries">
              {shown.queries.map((entry) => (
                <li key={entry.text}>
                  <button type="button" onClick={() => go(`/search?q=${encodeURIComponent(entry.text)}`)}>
                    {entry.text}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          {shown.products.length > 0 ? (
            <ul className="search-overlay__products">
              {shown.products.map((product) => (
                <li key={product.id}>
                  <Link href={`/products/${product.handle}`} onClick={onClose}>
                    {product.featuredImage?.url ? (
                      <MediaImage
                        src={product.featuredImage.url}
                        alt={product.featuredImage.altText || product.title}
                        width={48}
                        height={48}
                        sizes={imageSizes.search}
                      />
                    ) : (
                      <span className="search-overlay__thumb" />
                    )}
                    <span>{product.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
          {shown.pages.length > 0 ? (
            <ul className="search-overlay__pages">
              {shown.pages.map((page) => (
                <li key={page.handle}>
                  <Link href={`/pages/${page.handle}`} onClick={onClose}>
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
