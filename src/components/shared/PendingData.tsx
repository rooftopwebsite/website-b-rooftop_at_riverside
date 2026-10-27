import type { ReactNode } from 'react';

const DATA_TONES = {
  light: 'border-terra/60 bg-terra/5 text-terra',
  dark: 'border-tomato-soft/50 bg-paper/[0.06] text-tomato-soft',
} as const;

export function PendingData({
  label = 'TBD',
  detail,
  tone = 'light',
}: {
  readonly label?: string;
  readonly detail?: string;
  readonly tone?: keyof typeof DATA_TONES;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-btn border border-dashed px-2 py-0.5 align-middle font-body text-caption font-bold uppercase tracking-eyebrow ${DATA_TONES[tone]}`}
      {...(detail ? { title: detail } : {})}
    >
      {label}
      {detail ? <span className="sr-only">. {detail}</span> : null}
    </span>
  );
}

const PENDING_TONES = {
  light: {
    box: 'border-terra/50 bg-terra/[0.04]',
    label: 'text-terra',
    body: 'text-body/75',
  },
  dark: {
    box: 'border-tomato-soft/45 bg-paper/[0.06]',
    label: 'text-tomato-soft',
    body: 'text-paper/85',
  },
} as const;

export function PendingBlock({
  title,
  tone = 'light',
  children,
}: {
  readonly title: string;
  readonly tone?: keyof typeof PENDING_TONES;
  readonly children: ReactNode;
}) {
  const t = PENDING_TONES[tone];
  return (
    <div className={`rounded-card border border-dashed p-6 ${t.box}`}>
      <p className={`eyebrow ${t.label}`}>Pending · {title}</p>
      <div className={`mt-2.5 max-w-[60ch] text-base ${t.body}`}>{children}</div>
    </div>
  );
}

const GAP_TONES = {
  light: {
    box: 'border-ink/25 bg-ink/[0.06]',
    icon: 'text-ink/35',
    label: 'text-ink/65',
    brief: 'text-ink/70',
  },
  dark: {
    box: 'border-paper/30 bg-sunset/[0.18]',
    icon: 'text-paper/50',
    label: 'text-paper/80',
    brief: 'text-paper/60',
  },
} as const;

export function PhotoPending({
  brief,
  ratio = 'aspect-[4/3]',
  className = '',
  tone = 'light',
}: {
  readonly brief: string;
  readonly ratio?: string;
  readonly className?: string;
  readonly tone?: keyof typeof GAP_TONES;
}) {
  const t = GAP_TONES[tone];

  return (
    <div
      role="img"
      aria-label={`Photo pending: ${brief}`}
      className={[
        ratio,
        'relative flex flex-col items-center justify-center gap-3 overflow-hidden',
        'rounded-card border border-dashed p-6 text-center',
        t.box,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <svg
        width="34"
        height="30"
        viewBox="0 0 34 30"
        fill="none"
        aria-hidden="true"
        className={`shrink-0 ${t.icon}`}
      >
        <rect x="1" y="1" width="32" height="28" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="10.5" cy="10" r="3" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M1 22l9-8 7 6 5-4 11 9"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>

      <p className={`eyebrow ${t.label}`}>Photo missing</p>
      <p className={`max-w-[34ch] font-body text-micro leading-[1.5] ${t.brief}`}>{brief}</p>
    </div>
  );
}
