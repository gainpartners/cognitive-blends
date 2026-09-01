'use client';

import type { FormEvent } from 'react';
import { Field } from '@/components/ui/Field';
import { footer } from '@/content/footer';

export function FooterSubscribe() {
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form className="footer-subscribe" onSubmit={onSubmit}>
      <p>{footer.subscribePrompt}</p>
      <Field label="Email">
        <input type="email" name="email" autoComplete="email" />
      </Field>
    </form>
  );
}
