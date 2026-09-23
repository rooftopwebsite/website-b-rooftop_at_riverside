import Image from 'next/image';
import { AGENCY } from '@/lib/brand';
import { GUTTER } from './Section';

export default function AgencyBar() {
  const poweredBy = (
    <a
      href={AGENCY.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Powered by ${AGENCY.label}, visit restoexp.com (opens in a new tab)`}
      className="flex max-w-full flex-wrap items-center justify-center gap-x-[12px] gap-y-[4px] rounded-pill bg-[#f5f5f5] px-[16px] py-[6px] transition-opacity duration-200 hover:opacity-80"
    >
      <span className="font-body text-[16px] leading-none whitespace-nowrap text-[#5c5c5c]">
        powered by
      </span>
      <Image
        unoptimized
        src="/images/agency/resto-experience.svg"
        alt={AGENCY.label}
        width={523}
        height={74}
        className="h-[24px] w-auto shrink-0"
      />
    </a>
  );

  const año = new Date().getFullYear();

  return (
    <div
      className="relative z-[1] bg-chalk grano"
    >
      <div className="caja-ancha hidden h-[72px] items-center justify-between desk:flex">
        {poweredBy}
        <div className="flex items-center gap-[24px]">
          <span className="font-body text-[14px] text-[#5c5c5c]">{AGENCY.tagline}</span>
          <span
            aria-hidden="true"
            className="h-[40px] w-px bg-gradient-to-b from-transparent via-[#7c7c7c]/50 to-transparent"
          />
          <span className="font-body text-[14px] text-[#5c5c5c]">{año}</span>
        </div>
      </div>
      <div className="caja-ancha flex flex-col items-center gap-[10px] py-[16px] desk:hidden">
        {poweredBy}
        <span
          aria-hidden="true"
          className="h-px w-[283px] max-w-full bg-gradient-to-r from-transparent via-[#7c7c7c]/50 to-transparent opacity-70"
        />
        <div className="flex flex-wrap items-center justify-center gap-x-[12px] gap-y-[4px] text-center">
          <p className="font-body text-[12px] leading-[1.3] text-[#5c5c5c]">{AGENCY.tagline}</p>
          <p className="font-body text-[14px] leading-[1.3] text-[#5c5c5c]">{año}</p>
        </div>
      </div>
    </div>
  );
}
