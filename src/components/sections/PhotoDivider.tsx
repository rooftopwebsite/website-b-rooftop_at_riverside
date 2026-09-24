import Image from 'next/image';

const PHOTOS = [
  { src: '/images/venue/wall-cocktails-rooftop.webp', alt: 'The rooftop bar at sunset', w: 'w-85 md:w-122.5', h: 'h-65 md:h-95' },
  { src: '/images/venue/wall-food-platter.webp', alt: 'A plate from one of the kitchens', w: 'w-70 md:w-100', h: 'h-90 md:h-130' },
  { src: '/images/venue/wall-bartender.webp', alt: 'Cocktails at the Sunset Bar', w: 'w-105 md:w-150', h: 'h-60 md:h-87.5' },
  { src: '/images/venue/wall-truck-window-day.webp', alt: 'A truck window in the yard', w: 'w-75 md:w-107.5', h: 'h-82.5 md:h-120' },
  { src: '/images/venue/wall-live-music-tent.webp', alt: 'Live music in the yard', w: 'w-95 md:w-137.5', h: 'h-67.5 md:h-97.5' },
  { src: '/images/venue/wall-yard-night-table.webp', alt: 'A table in the yard at night', w: 'w-65 md:w-92.5', h: 'h-85 md:h-122.5' },
] as const;

export default function PhotoDivider() {
  return (
    <section aria-hidden="true" className="relative z-[1] bg-ink">
      <Image
        src="/brand/seal.svg"
        alt=""
        width={196}
        height={196}
        unoptimized
        className="rt-sway absolute -top-14.5 left-4 z-40 hidden w-32.5 lg:left-30 lg:block lg:w-49"
      />
      <div className="relative h-[42rem] w-full md:h-[56rem] lg:h-[66vw] lg:max-h-[60rem] lg:min-h-[56rem]">
        <Image
          src="/images/venue/leaf-backdrop.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/60" />

        <div className="absolute inset-x-0 top-1/2 z-20 -translate-y-1/2">
          <div className="w-full overflow-hidden py-13">
            <div className="rt-marquee-rev flex w-max items-center gap-6">
              {[...PHOTOS, ...PHOTOS].map((photo, i) => (
                <div
                  key={`${photo.src}-${i}`}
                  className={`${photo.w} ${photo.h} relative shrink-0 overflow-hidden rounded-shell bg-fog sombra-card`}
                >
                  <Image
                    src={photo.src}
                    alt=""
                    width={420}
                    height={360}
                    sizes="420px"
                    className="size-full object-cover"
                  />
                  <div
                    className="pointer-events-none absolute inset-3.5 rounded-ticket border border-dashed border-paper/85 [filter:drop-shadow(0_1px_1px_rgb(0_0_0/0.35))]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-[-1px] z-10 h-[calc(var(--radius-band)+8px)] rounded-b-band bg-bone grano lg:h-22.5" />
      <div className="grano-capa pointer-events-none absolute inset-x-0 bottom-[-1px] z-30 overflow-hidden">
        <Image
          src="/brand/wave-only.svg"
          alt=""
          width={1600}
          height={120}
          unoptimized
          className="rt-wave block max-h-[177px] w-[114%] max-w-none -ml-[7%]"
        />
      </div>
      <div className="pointer-events-none absolute bottom-[-1px] left-1/2 z-30 w-[18%] -translate-x-1/2 translate-y-[32.9%] md:w-[11%] md:translate-y-[22.3%] lg:w-[16.11%] lg:max-w-[232px] lg:translate-y-[30.9%]">
        <Image
          src="/brand/emblem.svg"
          alt=""
          width={253}
          height={253}
          unoptimized
          className="sticker block w-full"
        />
      </div>
    </section>
  );
}
