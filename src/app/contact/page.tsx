import type { Metadata } from 'next';
import { ContactForm } from '@/components/content/ContactForm';
import { contactPage } from '@/content/pages/contact';

export const metadata: Metadata = {
  title: contactPage.title,
};

export default function ContactPage() {
  return (
    <div className="shell stack page-copy">
      <h1 className="page-title">{contactPage.heading}</h1>
      {contactPage.intro.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      <ContactForm />
    </div>
  );
}
