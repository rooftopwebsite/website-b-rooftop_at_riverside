import type { ReactNode } from 'react';

export type HeadingLevel = 1 | 2 | 3 | 4;

const OUTSIDE_DISPLAY =
  'font-body font-medium text-[20px] leading-[1.3] normal-case lg:text-[24px]';

const LABEL =
  'font-subhead font-medium text-[15px] leading-[1.3] tracking-label uppercase lg:text-[16px]';

const SIZES: Record<HeadingLevel, string> = {
  1: 'text-h1',
  2: 'text-h2',
  3: 'text-h3',
  4: OUTSIDE_DISPLAY,
};

const ROLES = {
  section: null,
  hero: 'text-hero',
  card: OUTSIDE_DISPLAY,
  label: LABEL,
} as const;

export type HeadingRole = keyof typeof ROLES;

export function Heading({
  level,
  role = 'section',
  className = '',
  id,
  children,
}: {
  readonly level: HeadingLevel;
  readonly role?: HeadingRole;
  readonly className?: string;
  readonly id?: string;
  readonly children: ReactNode;
}) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4';
  return (
    <Tag
      {...(id ? { id } : {})}
      className={[
        'font-display font-semibold uppercase',
        ROLES[role] ?? SIZES[level],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Tag>
  );
}

export function Accent({
  on,
  children,
}: {
  readonly on: 'light' | 'dark';
  readonly children: ReactNode;
}) {
  return <span className={on === 'dark' ? 'text-sunset' : 'text-sunset-deep'}>{children}</span>;
}

const EYEBROW_TONES = {
  deep: 'text-deep',
  plum: 'text-plum',
  terra: 'text-terra',
  magenta: 'text-magenta',
  cream: 'text-cream',
  ink: 'text-ink',
} as const;

export function Eyebrow({
  children,
  tone = 'deep',
  className = '',
  as: Tag = 'p',
}: {
  readonly children: ReactNode;
  readonly tone?: keyof typeof EYEBROW_TONES;
  readonly className?: string;
  readonly as?: 'p' | 'span' | 'div';
}) {
  return (
    <Tag className={['eyebrow', EYEBROW_TONES[tone], className].filter(Boolean).join(' ')}>
      {children}
    </Tag>
  );
}

export function SectionHead({
  eyebrow,
  eyebrowTone,
  title,
  lead,
  level = 2,
  id,
  align = 'left',
  measure = 'head',
  className = '',
  children,
}: {
  readonly eyebrow?: string;
  readonly eyebrowTone?: keyof typeof EYEBROW_TONES;
  readonly title: ReactNode;
  readonly lead?: ReactNode;
  readonly level?: HeadingLevel;
  readonly id?: string;
  readonly align?: 'left' | 'center';
  readonly measure?: 'head' | 'full';
  readonly className?: string;
  readonly children?: ReactNode;
}) {
  const centered = align === 'center';
  const width = measure === 'full' ? 'max-w-none' : 'max-w-head';
  return (
    <div
      className={[
        centered ? `mx-auto ${width} text-center` : width,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {eyebrow ? (
        <Eyebrow tone={eyebrowTone} className="mb-gap-kicker">
          {eyebrow}
        </Eyebrow>
      ) : null}
      <Heading level={level} id={id}>
        {title}
      </Heading>
      {lead ? (
        <p
          className={[
            'mt-gap-subhead max-w-[60ch] text-lead subhead',
            centered ? 'mx-auto' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {lead}
        </p>
      ) : null}
      {children}
    </div>
  );
}
