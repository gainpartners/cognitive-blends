'use client';

import { useActionState } from 'react';
import { subscribeAction } from '@/app/actions/subscribe';
import { idleSubscribeState } from '@/lib/shopify/subscribe-fields';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { footer } from '@/content/footer';

export function FooterSubscribe() {
  const [state, action, pending] = useActionState(
    subscribeAction,
    idleSubscribeState,
  );

  if (state.ok) {
    return (
      <div className="footer-subscribe" aria-live="polite">
        <p>{state.alreadyOnList ? footer.subscribeAlready : footer.subscribeSuccess}</p>
      </div>
    );
  }

  return (
    <form className="footer-subscribe" action={action}>
      <p>{footer.subscribePrompt}</p>
      <div className="footer-subscribe__row">
        <Field label={footer.emailLabel}>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            disabled={pending}
          />
        </Field>
        <Button type="submit" disabled={pending}>
          {footer.subscribe}
        </Button>
      </div>
      {state.error ? <p className="error-text">{state.error}</p> : null}
    </form>
  );
}
