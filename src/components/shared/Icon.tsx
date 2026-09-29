import type { ReactNode, SVGProps } from 'react';

export type IconProps = Omit<SVGProps<SVGSVGElement>, 'children' | 'viewBox'>;

type SvgProps = IconProps & { readonly children: ReactNode };

function Svg({ className = 'size-5', ...rest }: SvgProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 ${className}`}
      {...rest}
    />
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </Svg>
  );
}

export function ArrowLeft(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M20 12H5M11 6l-6 6 6 6" />
    </Svg>
  );
}

export function ArrowUp(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 20V5M6 11l6-6 6 6" />
    </Svg>
  );
}

export function ArrowUpRight(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M7 17 17 7M8 7h9v9" />
    </Svg>
  );
}

export function X(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Svg>
  );
}

export function Pause(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8 5v14M16 5v14" />
    </Svg>
  );
}

export function Play(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M7 5.5v13a.5.5 0 0 0 .76.43l10.4-6.5a.5.5 0 0 0 0-.86L7.76 5.07A.5.5 0 0 0 7 5.5Z" />
    </Svg>
  );
}

export function CaretDown(props: IconProps) {
  return (
    <Svg strokeWidth="2" {...props}>
      <path d="m5 9 7 7 7-7" />
    </Svg>
  );
}

export function CaretUp(props: IconProps) {
  return (
    <Svg strokeWidth="2" {...props}>
      <path d="m5 15 7-7 7 7" />
    </Svg>
  );
}

export function ArrowSquareOut(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M13 4h7v7M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </Svg>
  );
}

export function Instagram(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function Facebook(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M15 8.2h-1.6a1.9 1.9 0 0 0-1.9 1.9V21M9.6 13.2h4.8" />
    </Svg>
  );
}

export function Google(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M21 12.2a9 9 0 1 1-2.6-6.3" />
      <path d="M21 12.2h-8.6" />
    </Svg>
  );
}

export function SunHorizon({ className = 'size-5', ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 ${className}`}
      {...rest}
    >
      <path d="M12 5.5a5.5 5.5 0 0 1 5.5 5.5 5.4 5.4 0 0 1-.3 1.8H6.8a5.4 5.4 0 0 1-.3-1.8A5.5 5.5 0 0 1 12 5.5Z" />
      <path
        d="M12 1.6v1.9M4.4 4.4l1.4 1.4M18.2 5.8l1.4-1.4M2.6 15.4h18.8M5.4 18.9h13.2M9 22.4h6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Moon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M20.6 14.4A8.7 8.7 0 0 1 9.6 3.4a8.7 8.7 0 1 0 11 11Z" />
    </Svg>
  );
}

export function MusicNote(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M9 17.4V5.5l11-2v11.9" />
      <circle cx="6.4" cy="17.4" r="2.6" />
      <circle cx="17.4" cy="15.4" r="2.6" />
    </Svg>
  );
}

export function Dot({ className = 'size-2', ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 ${className}`}
      {...rest}
    >
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

export function Truck(props: IconProps) {
  return (
    <Svg strokeWidth="1.4" {...props}>
      <path d="M3 8h11v8H3z" />
      <path d="M5.6 10.4h5.8v3.2H5.6z" />
      <path d="M14 11h3.6L21 14.4V16h-7z" />
      <circle cx="7.2" cy="18" r="2" />
      <circle cx="17.4" cy="18" r="2" />
    </Svg>
  );
}

export function Martini(props: IconProps) {
  return (
    <Svg strokeWidth="1.4" {...props}>
      <path d="M3.5 5h17L12 13.5 3.5 5Z" />
      <path d="M12 13.5V20M8 20h8" />
      <circle cx="15.2" cy="7.6" r="1.15" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function Balloons(props: IconProps) {
  return (
    <Svg strokeWidth="1.4" {...props}>
      <circle cx="8.8" cy="8.4" r="4.8" />
      <path d="M8.8 13.2 7.7 15.1h2.2z" />
      <path d="M8.8 15.1c0 2.3 2.7 2.6 2.7 5.1" />
      <circle cx="17.2" cy="11" r="3.6" />
      <path d="M17.2 14.6 16.3 16.2h1.8z" />
      <path d="M17.2 16.2c0 1.7-1.9 2-1.9 4" />
    </Svg>
  );
}

export function GridFour(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.6" />
      <rect x="13" y="3.5" width="7.5" height="7.5" rx="1.6" />
      <rect x="3.5" y="13" width="7.5" height="7.5" rx="1.6" />
      <rect x="13" y="13" width="7.5" height="7.5" rx="1.6" />
    </Svg>
  );
}

export function CalendarGrid(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3.2" y="5" width="17.6" height="16" rx="2.2" />
      <path d="M3.2 9.6h17.6M8 3.2v3.6M16 3.2v3.6" />
      <path d="M7.6 13.4h2M12 13.4h2M16.4 13.4h.01M7.6 17h2M12 17h.01" />
    </Svg>
  );
}

export function Ticket(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3.4 9.3V7.5a1.9 1.9 0 0 1 1.9-1.9h13.4a1.9 1.9 0 0 1 1.9 1.9v1.8a2.7 2.7 0 0 0 0 5.4v1.8a1.9 1.9 0 0 1-1.9 1.9H5.3a1.9 1.9 0 0 1-1.9-1.9v-1.8a2.7 2.7 0 0 0 0-5.4Z" />
      <path d="M14.3 7.2v1.6M14.3 11.2v1.6M14.3 15.2v1.6" />
    </Svg>
  );
}

export function Car(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4.5 12.5 6 7.8A2 2 0 0 1 7.9 6.4h8.2A2 2 0 0 1 18 7.8l1.5 4.7" />
      <path d="M3.4 12.5h17.2v4.1a1 1 0 0 1-1 1H4.4a1 1 0 0 1-1-1z" />
      <path d="M6.6 17.6v1.4M17.4 17.6v1.4" />
    </Svg>
  );
}

export function MapPin(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 21.2c4.2-4.1 6.3-7.3 6.3-9.9a6.3 6.3 0 1 0-12.6 0c0 2.6 2.1 5.8 6.3 9.9Z" />
      <circle cx="12" cy="11" r="2.4" />
    </Svg>
  );
}

export function UserCircle(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="10" r="2.6" />
      <path d="M6.9 18.6a6 6 0 0 1 10.2 0" />
    </Svg>
  );
}
