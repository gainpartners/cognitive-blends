import type { Metadata } from 'next';
import { ContactForm } from '@/components/content/ContactForm';
import { Reveal } from '@/components/ui/Reveal';
import { contactPage } from '@/content/pages/contact';

export const metadata: Metadata = {
  title: contactPage.title,
};

export default function ContactPage() {
  return (
    <div className="contact-page">
      <Reveal className="shell">
        <h1 className="contact-page__title">{contactPage.heading}</h1>
        {contactPage.intro.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <ContactForm />
      </Reveal>
    </div>
  );
}
