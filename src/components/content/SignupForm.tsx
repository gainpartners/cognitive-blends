'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { signup } from '@/content/home';

export function SignupForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  if (sent) {
    return <p>Thanks for signing up.</p>;
  }

  return (
    <form className="stack signup-form" onSubmit={onSubmit}>
      <Field label={signup.firstName}>
        <input type="text" name="firstName" autoComplete="given-name" />
      </Field>
      <Field label={signup.lastName}>
        <input type="text" name="lastName" autoComplete="family-name" />
      </Field>
      <Field label={signup.email}>
        <input type="email" name="email" autoComplete="email" required />
      </Field>
      <Button type="submit">{signup.submit}</Button>
      <p className="signup-form__disclaimer">{signup.disclaimer}</p>
    </form>
  );
}
