import { Button } from '@/components/ui/Button';
import { hero } from '@/content/home';

export function Hero() {
  return (
    <section className="hero">
      <video
        className="hero__video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={hero.poster}
        aria-hidden
      >
        <source src={hero.video} type="video/mp4" />
      </video>
      <div className="hero__overlay" />
      <div className="shell">
        <div className="hero__inner">
          <h1 className="hero__title">{hero.title}</h1>
          <p className="hero__body">{hero.body}</p>
          <Button as="a" href={hero.cta.href} variant="secondary" size="lg">
            {hero.cta.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
