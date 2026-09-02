'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { MediaImage } from '@/components/ui/MediaImage';
import { imageSizes } from '@/lib/shopify/image';
import { whoWeAre } from '@/content/home';
import { CaretIcon, PauseIcon, PlayIcon } from '@/components/layout/icons';

export function WhoWeAreSlideshow() {
  const slides = whoWeAre.people;
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!playing || slides.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, whoWeAre.autoplayMs);
    return () => window.clearInterval(timer);
  }, [playing, slides.length]);

  return (
    <section
      className="who-slideshow"
      aria-roledescription="Carousel"
      aria-label={whoWeAre.ariaLabel}
    >
      <div className="who-slideshow__viewport">
        {slides.map((person, i) => (
          <article
            key={person.name}
            className="who-slide"
            hidden={i !== index}
            aria-hidden={i !== index}
            aria-label={`${i + 1} of ${slides.length}`}
          >
            <MediaImage
              src={person.image}
              alt=""
              fill
              sizes={imageSizes.full}
              className="who-slide__image"
              style={{ objectPosition: person.objectPosition }}
              loading="eager"
            />
            <div className="who-slide__copy shell">
              <h2 className="who-slide__heading">{whoWeAre.heading}</h2>
              <p className="who-slide__credit">
                {person.name} - {person.role}
              </p>
              <Button as="a" href={person.cta.href}>
                {person.cta.label}
              </Button>
            </div>
          </article>
        ))}
      </div>
      {slides.length > 1 ? (
        <div className="who-slideshow__controls">
          <button
            type="button"
            className="who-slideshow__nav who-slideshow__nav--prev"
            aria-label="Previous slide"
            onClick={() =>
              setIndex((current) => (current - 1 + slides.length) % slides.length)
            }
          >
            <CaretIcon />
          </button>
          <p className="who-slideshow__count">
            <span>{index + 1}</span>
            <span aria-hidden> / </span>
            <span className="visually-hidden">of</span>
            <span>{slides.length}</span>
          </p>
          <button
            type="button"
            className="who-slideshow__nav who-slideshow__nav--next"
            aria-label="Next slide"
            onClick={() => setIndex((current) => (current + 1) % slides.length)}
          >
            <CaretIcon />
          </button>
          <button
            type="button"
            className="who-slideshow__autoplay"
            aria-label={playing ? 'Pause slideshow' : 'Play slideshow'}
            onClick={() => setPlaying((value) => !value)}
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
        </div>
      ) : null}
    </section>
  );
}
