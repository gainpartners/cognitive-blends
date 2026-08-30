import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

type Shared = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
};

type ButtonAsButton = Shared & {
  as?: 'button';
  type?: 'button' | 'submit' | 'reset';
  href?: never;
};

type ButtonAsAnchor = Shared & {
  as: 'a';
  href: string;
  type?: never;
};

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const variantClass: Record<ButtonVariant, string> = {
  primary: 'btn--primary',
  secondary: 'btn--secondary',
  ghost: 'btn--ghost',
};

const sizeClass: Record<ButtonSize, string> = {
  sm: 'btn--sm',
  md: 'btn--md',
  lg: 'btn--lg',
};

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(props, ref) {
    const classes = cn(
      'btn',
      variantClass[props.variant ?? 'primary'],
      sizeClass[props.size ?? 'md'],
      props.className,
    );

    if (props.as === 'a') {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={props.href}
          className={classes}
        >
          {props.children}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={props.type ?? 'button'}
        className={classes}
        disabled={props.disabled}
      >
        {props.children}
      </button>
    );
  },
);

export default Button;
