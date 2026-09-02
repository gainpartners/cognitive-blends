import { preload } from 'react-dom';
import { FeatureSection } from '@/components/content/FeatureSection';
import { Hero } from '@/components/content/Hero';
import { QuoteGrid } from '@/components/content/QuoteGrid';
import { SignupForm } from '@/components/content/SignupForm';
import { StatsPanel } from '@/components/content/StatsPanel';
import { WhoWeAreSlideshow } from '@/components/content/WhoWeAreSlideshow';
import { CatalogSection } from '@/components/shop/CatalogSection';
import { Reveal } from '@/components/ui/Reveal';
import { hero } from '@/content/home';

export default async function HomePage() {
  preload(hero.poster, { as: 'image' });

  return (
    <>
      <Hero />
      <CatalogSection />
      <Reveal as="section" className="section signup">
        <div className="shell signup__inner">
          <SignupForm />
        </div>
      </Reveal>
      <FeatureSection />
      <div className="section-spacer" aria-hidden />
      <QuoteGrid />
      <StatsPanel />
      <Reveal>
        <WhoWeAreSlideshow />
      </Reveal>
    </>
  );
}
