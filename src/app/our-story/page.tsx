import type { Metadata } from 'next';
import { Button } from '@/components/ui/Button';
import { ourStory } from '@/content/pages/our-story';

export const metadata: Metadata = {
  title: ourStory.title,
};

export default function OurStoryPage() {
  return (
    <div className="shell stack page-copy">
      <h1 className="page-title">{ourStory.heading}</h1>
      {ourStory.intro.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}

      {ourStory.people.map((person) => (
        <section key={person.heading} className="stack">
          <h2>{person.heading}</h2>
          {'credentials' in person && person.credentials ? (
            <p className="muted">{person.credentials}</p>
          ) : null}
          {person.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ))}

      <section className="stack">
        <h2>{ourStory.contact.heading}</h2>
        <Button as="a" href={ourStory.contact.cta.href}>
          {ourStory.contact.cta.label}
        </Button>
      </section>
    </div>
  );
}
