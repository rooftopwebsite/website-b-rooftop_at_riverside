import { clip, dist, dur, ease, stagger, viewport } from '@/lib/motion';

export { clip, dist, dur, ease, stagger, viewport };

export const EASE_BRAND = ease.out;
export const DURATION = { fast: dur.micro, base: dur.ui, slow: dur.reveal } as const;
export const REVEAL_OFFSET = dist.text;
export const STAGGER = stagger;
export const REVEAL_AMOUNT = 0.2;

export const revealVariants = {
  hidden: { opacity: 0, y: dist.text },
  visible: { opacity: 1, y: 0, transition: { duration: dur.reveal, ease: ease.out } },
};

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: 0.04 } },
};
