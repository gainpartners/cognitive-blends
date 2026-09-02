'use client';

import {
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/utils';

type RevealTag = 'div' | 'section' | 'article' | 'blockquote';

export function Reveal({
  as = 'div',
  className,
  order = 0,
  children,
  id,
}: {
  as?: RevealTag;
  className?: string;
  order?: number;
  children: ReactNode;
  id?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const setRef = useCallback((node: HTMLElement | null) => {
    ref.current = node;
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      return;
    }

    const show = () => {
      el.classList.remove('is-pending');
      el.classList.add('is-in');
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          show();
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );

    el.classList.add('is-pending');
    io.observe(el);

    return () => io.disconnect();
  }, []);

  const props = {
    id,
    className: cn('reveal', className),
    style: { '--reveal-order': order } as CSSProperties,
  };

  if (as === 'section') {
    return (
      <section ref={setRef} {...props}>
        {children}
      </section>
    );
  }
  if (as === 'article') {
    return (
      <article ref={setRef} {...props}>
        {children}
      </article>
    );
  }
  if (as === 'blockquote') {
    return (
      <blockquote ref={setRef} {...props}>
        {children}
      </blockquote>
    );
  }
  return (
    <div ref={setRef} {...props}>
      {children}
    </div>
  );
}
