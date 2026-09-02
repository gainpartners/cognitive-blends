'use client';

import { useActionState } from 'react';
import { subscribeAction } from '@/app/actions/subscribe';
import { idleSubscribeState } from '@/lib/shopify/subscribe-fields';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { signup } from '@/content/home';

export function SignupForm() {
  const [state, action, pending] = useActionState(
    subscribeAction,
    idleSubscribeState,
  );

  if (state.ok) {
    return (
      <div className="signup-form__success" aria-live="polite">
        {state.alreadyOnList ? (
          <p>{signup.alreadyOnList}</p>
        ) : (
          <>
            <h2>{signup.successHeading}</h2>
            <p>{signup.successText}</p>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <h2 className="section-title">{signup.heading}</h2>
      <p className="signup__body">{signup.body}</p>
      <form className="stack signup-form" action={action}>
        <input type="hidden" name="requireName" value="1" />
        <Field label={signup.firstName} hideLabel>
          <input
            type="text"
            name="firstName"
            autoComplete="given-name"
            placeholder={signup.firstName}
            required
            disabled={pending}
          />
        </Field>
        <Field label={signup.lastName} hideLabel>
          <input
            type="text"
            name="lastName"
            autoComplete="family-name"
            placeholder={signup.lastName}
            required
            disabled={pending}
          />
        </Field>
        <Field label={signup.email} hideLabel>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            placeholder={signup.email}
            disabled={pending}
          />
        </Field>
        <Button type="submit" disabled={pending}>
          {pending ? 'Submitting…' : signup.submit}
        </Button>
        {state.error ? <p className="error-text">{state.error}</p> : null}
        <p className="signup-form__disclaimer">{signup.disclaimer}</p>
      </form>
    </>
  );
}
