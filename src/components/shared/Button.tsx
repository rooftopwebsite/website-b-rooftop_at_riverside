import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { CAJA_ALTA_CLS } from '@/lib/flags';

const VARIANTS = {
  primary: 'bg-sunset text-ink hover:bg-sunset-hover',
  secondary: 'bg-paper text-ink ring-1 ring-fog hover:ring-ink/35',
  outline: 'bg-transparent text-ink ring-1 ring-ink/25 hover:ring-ink/55',
  dark: 'bg-ink text-paper hover:bg-ink/85',
  onDark: 'bg-cream text-deep hover:bg-paper',
  ghostDark: 'bg-transparent text-paper ring-1 ring-paper/35 hover:ring-paper/70',
} as const;

const SIZES = {
  sm: 'h-9 px-4 text-dato',
  md: 'h-10 px-5.5 text-base',
  lg: 'h-10.5 px-7 text-d7',
} as const;

export type ButtonVariant = keyof typeof VARIANTS;

const BASE = [
  'inline-flex items-center justify-center gap-2.25',
  'toque',
  'whitespace-nowrap',
  'font-body font-semibold',
  CAJA_ALTA_CLS,
  'rounded-pill',
  'rueda',
  'transition-colors duration-200',
  'disabled:opacity-50 disabled:pointer-events-none',
].join(' ');

export function Rodillo({ children }: { readonly children: ReactNode }) {
  return (
    <span className="rodillo">
      <span className="rodillo-cara rodillo-base">{children}</span>
      <span aria-hidden="true" className="rodillo-cara rodillo-copia">
        {children}
      </span>
    </span>
  );
}

function classes(variant: ButtonVariant, size: keyof typeof SIZES, className?: string) {
  return cn(BASE, VARIANTS[variant], SIZES[size], className);
}

export function ButtonLink({
  href,
  variant = 'secondary',
  size = 'md',
  className,
  children,
  external = false,
  ...rest
}: {
  readonly href: string;
  readonly variant?: ButtonVariant;
  readonly size?: keyof typeof SIZES;
  readonly className?: string;
  readonly children: ReactNode;
  readonly external?: boolean;
} & Omit<ComponentProps<typeof Link>, 'href' | 'className' | 'children'>) {
  const cls = classes(variant, size, className);

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
        {...(rest as ComponentProps<'a'>)}
      >
        <Rodillo>{children}</Rodillo>
        <ExternalIcon />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    );
  }

  return (
    <Link href={href} className={cls} {...rest}>
      <Rodillo>{children}</Rodillo>
    </Link>
  );
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: {
  readonly variant?: ButtonVariant;
  readonly size?: keyof typeof SIZES;
  readonly className?: string;
  readonly children: ReactNode;
} & ComponentProps<'button'>) {
  return (
    <button className={classes(variant, size, className)} {...rest}>
      <Rodillo>{children}</Rodillo>
    </button>
  );
}

export function AnnouncementChip({
  tag,
  children,
  href,
}: {
  readonly tag: string;
  readonly children: ReactNode;
  readonly href: string;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2.5 rounded-pill bg-paper py-1.75 pr-3.5 pl-2 shadow-btn ring-1 ring-fog transition-shadow duration-200 hover:ring-ink/20"
    >
      <span className="rounded-pill bg-cream px-2.25 py-0.75 font-body text-caption font-bold uppercase tracking-eyebrow text-terra">
        {tag}
      </span>
      <span className="font-body text-dato font-medium text-body">{children}</span>
      <svg
        width="13"
        height="9"
        viewBox="0 0 16 10"
        fill="none"
        aria-hidden="true"
        className="shrink-0 text-body/75 transition-transform duration-200 group-hover:translate-x-0.75"
      >
        <path
          d="M0 5h14M10 1l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}

export function ExternalIcon({ className = '' }: { readonly className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className={['shrink-0', className].filter(Boolean).join(' ')}
    >
      <path
        d="M4.5 1.5H10.5V7.5M10.5 1.5L5 7M8 8.5V10.5H1.5V4H3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowLink({
  href,
  children,
  className = '',
  external = false,
}: {
  readonly href: string;
  readonly children: ReactNode;
  readonly className?: string;
  readonly external?: boolean;
}) {
  const inner = (
    <>
      <span className="link-texto">{children}</span>
      <svg
        width="16"
        height="10"
        viewBox="0 0 16 10"
        fill="none"
        aria-hidden="true"
        className="shrink-0 transition-transform duration-200 group-hover:translate-x-1"
      >
        <path
          d="M0 5h14M10 1l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {external ? <span className="sr-only">(opens in a new tab)</span> : null}
    </>
  );

  const cls = ['group inline-flex items-center gap-2.25 font-body text-base font-medium', CAJA_ALTA_CLS, className]
    .filter(Boolean)
    .join(' ');

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
