import Image from 'next/image';

export default function Preloader() {
  return (
    <div
      aria-hidden="true"
      className="rt-preloader pointer-events-none fixed inset-0 z-[120] overflow-hidden bg-deep grano"
    >
      <div className="grid h-full place-items-center">
        <Image
          src="/brand/logo-reversed.svg"
          alt=""
          width={303}
          height={322}
          loading="eager"
          className="rt-preloader-logo w-[150px] lg:w-[190px]"
        />
      </div>
      <div className="rt-preloader-edge absolute inset-y-0 left-0 w-[220px] mix-blend-screen" />
    </div>
  );
}
