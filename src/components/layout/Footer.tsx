import { copyrightLine, footer } from '@/content/footer';
import { FooterSubscribe } from './FooterSubscribe';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="shell site-footer__inner">
        <FooterSubscribe />
        <p>
          <a href={footer.instagram.href} rel="noreferrer" target="_blank">
            {footer.instagram.label}
          </a>
        </p>
        <p>{copyrightLine(year)}</p>
      </div>
    </footer>
  );
}
