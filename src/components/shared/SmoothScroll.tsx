'use client';

import Lenis from 'lenis';
import { useReducedMotion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function SmoothScroll() {
  const reduced = useReducedMotion();
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({ lerp: 0.16, smoothWheel: true, anchors: true });
    lenisRef.current = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Lenis aims anchor clicks from its own scroll position, which goes stale when the page was
    // moved natively (scrollbar, keyboard, touch). Re-read the real position first.
    const syncToNativeScroll = () =>
      lenis.scrollTo(window.scrollY, { immediate: true, force: true });
    window.addEventListener('click', syncToNativeScroll, true);

    return () => {
      window.removeEventListener('click', syncToNativeScroll, true);
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) {
      lenis.scrollTo(0, { immediate: true });
      return;
    }

    // The page streams in and shifts while it settles, and Lenis measures it asynchronously, so a
    // single jump to the hash can miss (the target may not be there yet, or the page is still
    // short and the jump is clamped to the top). Aim again on every size change for a moment,
    // unless the visitor has already started scrolling.
    const aim = () => {
      const target = document.getElementById(id);
      if (!target) return;
      lenis.resize();
      lenis.scrollTo(target, { immediate: true, force: true });
    };
    aim();

    const observer = new ResizeObserver(aim);
    observer.observe(document.documentElement);
    const events = ['wheel', 'touchstart', 'keydown'] as const;
    let timer = 0;
    const stop = () => {
      window.clearTimeout(timer);
      observer.disconnect();
      events.forEach((e) => window.removeEventListener(e, stop));
    };
    timer = window.setTimeout(stop, 2500);
    events.forEach((e) => window.addEventListener(e, stop, { once: true, passive: true }));
    return stop;
  }, [pathname]);

  return null;
}
