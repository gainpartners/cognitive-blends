import { Button } from '@/components/ui/Button';
import { MediaImage } from '@/components/ui/MediaImage';
import { imageSizes } from '@/lib/shopify/image';
import { Reveal } from '@/components/ui/Reveal';
import { statsPanel } from '@/content/home';

export function StatsPanel() {
  return (
    <section className="section stats">
      <div className="shell stats__layout">
        <Reveal className="stats__image">
          <MediaImage
            src={statsPanel.image}
            alt=""
            width={600}
            height={400}
            sizes={imageSizes.half}
          />
        </Reveal>
        <Reveal className="stats__content" order={1}>
          <h2 className="section-title">{statsPanel.heading}</h2>
          <p>{statsPanel.body}</p>
          <div className="stats__grid">
            {statsPanel.stats.map((stat) => (
              <div key={stat.value} className="stat">
                <div className="stat__value">{stat.value}</div>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
          <Button as="a" href={statsPanel.cta.href} variant="secondary">
            {statsPanel.cta.label}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
