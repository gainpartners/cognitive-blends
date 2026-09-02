'use client';

import { useActionState } from 'react';
import { contactAction } from '@/app/actions/contact';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { contactPage } from '@/content/pages/contact';

export function ContactForm() {
  const [state, action, pending] = useActionState(contactAction, {
    ok: false,
    error: null,
    name: '',
    email: '',
    phone: '',
    comment: '',
  });

  if (state.ok) {
    return (
      <p className="contact-page__success" aria-live="polite">
        {contactPage.success}
      </p>
    );
  }

  return (
    <form className="contact-form" action={action}>
      <div className="contact-form__row">
        <Field label={contactPage.form.name} hideLabel>
          <input
            type="text"
            name="name"
            autoComplete="name"
            placeholder={contactPage.form.name}
            defaultValue={state.name}
            disabled={pending}
          />
        </Field>
        <Field label={`${contactPage.form.email} *`} hideLabel>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            placeholder={`${contactPage.form.email} *`}
            defaultValue={state.email}
            disabled={pending}
          />
        </Field>
      </div>
      <Field label={contactPage.form.phone} hideLabel>
        <input
          type="tel"
          name="phone"
          autoComplete="tel"
          placeholder={contactPage.form.phone}
          defaultValue={state.phone}
          disabled={pending}
        />
      </Field>
      <Field label={contactPage.form.comment} hideLabel>
        <textarea
          name="comment"
          rows={8}
          placeholder={contactPage.form.comment}
          defaultValue={state.comment}
          disabled={pending}
        />
      </Field>
      {state.error ? (
        <p className="error-text" aria-live="polite">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending}>
        {contactPage.form.submit}
      </Button>
    </form>
  );
}
