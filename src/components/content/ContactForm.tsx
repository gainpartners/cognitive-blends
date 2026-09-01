'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { contactPage } from '@/content/pages/contact';

export function ContactForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  if (sent) {
    return <p>Thanks for getting in touch.</p>;
  }

  return (
    <form className="stack contact-form" onSubmit={onSubmit}>
      <Field label={contactPage.form.name}>
        <input type="text" name="name" autoComplete="name" />
      </Field>
      <Field label={`${contactPage.form.email} *`}>
        <input type="email" name="email" autoComplete="email" required />
      </Field>
      <Field label={contactPage.form.phone}>
        <input type="tel" name="phone" autoComplete="tel" />
      </Field>
      <Field label={contactPage.form.comment}>
        <textarea name="comment" rows={6} />
      </Field>
      <Button type="submit">{contactPage.form.submit}</Button>
    </form>
  );
}
