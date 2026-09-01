import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { footer } from '@/content/footer';

export function FooterSubscribe() {
  return (
    <form className="footer-subscribe" action="/contact" method="get">
      <p>{footer.subscribePrompt}</p>
      <div className="footer-subscribe__row">
        <Field label={footer.emailLabel}>
          <input type="email" name="email" autoComplete="email" />
        </Field>
        <Button type="submit">{footer.subscribe}</Button>
      </div>
    </form>
  );
}
