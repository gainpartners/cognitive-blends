import { Reveal } from '@/components/ui/Reveal';
import { testimonials } from '@/content/home';

function QuoteStars() {
  return (
    <span className="quote__stars" aria-label="5 stars">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className="quote__star"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            fill="currentColor"
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          />
        </svg>
      ))}
    </span>
  );
}

export function QuoteGrid() {
  return (
    <section className="section quotes">
      <div className="shell">
        <div className="quotes__grid">
          {testimonials.quotes.map((quote, index) => (
            <Reveal key={quote.name} as="blockquote" className="quote" order={index}>
              <QuoteStars />
              <p>{quote.body}</p>
              <footer>{quote.name}</footer>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
