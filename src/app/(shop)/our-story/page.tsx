import type { Metadata } from 'next';
import { Button } from '@/components/ui/Button';
import { MediaImage } from '@/components/ui/MediaImage';
import { imageSizes } from '@/lib/shopify/image';
import { Reveal } from '@/components/ui/Reveal';
import { ourStory } from '@/content/pages/our-story';

export const metadata: Metadata = {
  title: ourStory.title,
};

function StoryParagraph({ text }: { text: string }) {
  const parts = text.split(/(Jack Carty|Dr\. Alan Farrell)/g);
  return (
    <p>
      {parts.map((part, index) =>
        part === 'Jack Carty' || part === 'Dr. Alan Farrell' ? (
          <strong key={`${part}-${index}`}>{part}</strong>
        ) : (
          part
        ),
      )}
    </p>
  );
}

export default function OurStoryPage() {
  return (
    <div className="story-page">
      <Reveal as="section" className="story-intro">
        <div className="shell">
          <h1 className="story-intro__title">{ourStory.heading}</h1>
          {ourStory.intro.map((paragraph) => (
            <StoryParagraph key={paragraph} text={paragraph} />
          ))}
        </div>
      </Reveal>

      {ourStory.people.map((person, index) => (
        <section
          key={person.heading}
          className={index % 2 === 1 ? 'bio bio--flip' : 'bio'}
        >
          <div className="shell bio__grid">
            {person.image ? (
              <Reveal className="bio__image">
                <MediaImage
                  src={person.image}
                  alt={person.heading}
                  width={index === 0 ? 1500 : 500}
                  height={index === 0 ? 844 : 500}
                  sizes={imageSizes.half}
                  style={
                    'objectPosition' in person && person.objectPosition
                      ? { objectPosition: person.objectPosition }
                      : undefined
                  }
                />
              </Reveal>
            ) : null}
            <Reveal className="bio__copy" order={1}>
              <h2>{person.heading}</h2>
              {'nameLine' in person && person.nameLine ? <p>{person.nameLine}</p> : null}
              {'credentials' in person && person.credentials ? (
                <p>{person.credentials}</p>
              ) : null}
              {person.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </Reveal>
          </div>
        </section>
      ))}

      <Reveal as="section" className="story-contact">
        <div className="shell">
          <h2>{ourStory.contact.heading}</h2>
          <Button as="a" href={ourStory.contact.cta.href}>
            {ourStory.contact.cta.label}
          </Button>
        </div>
      </Reveal>
    </div>
  );
}
