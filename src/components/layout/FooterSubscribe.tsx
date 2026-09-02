'use client';

import { useActionState } from 'react';
import { subscribeAction } from '@/app/actions/subscribe';
import { idleSubscribeState } from '@/lib/shopify/subscribe-fields';
import { Field } from '@/components/ui/Field';
import { footer } from '@/content/footer';
import { ArrowIcon } from './icons';

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
      <h2 className="footer-subscribe__heading">{footer.subscribePrompt}</h2>
      <div className="footer-subscribe__field">
        <Field label={footer.emailLabel} hideLabel>
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder={footer.emailLabel}
            required
            disabled={pending}
          />
        </Field>
        <button
          type="submit"
          className="footer-subscribe__submit"
          aria-label={footer.subscribe}
          disabled={pending}
        >
          <ArrowIcon />
        </button>
      </div>
      {state.error ? <p className="error-text">{state.error}</p> : null}
    </form>
  );
}
