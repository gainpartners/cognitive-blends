import { Reveal } from '@/components/ui/Reveal';
import { StarRating } from '@/components/ui/StarRating';
import { testimonials } from '@/content/home';

export function QuoteGrid() {
  return (
    <section className="section quotes">
      <div className="shell">
        <div className="quotes__grid">
          {testimonials.quotes.map((quote, index) => (
            <Reveal key={quote.name} as="blockquote" className="quote" order={index}>
              <StarRating value={5} showValue={false} />
              <p>{quote.body}</p>
              <footer>{quote.name}</footer>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
