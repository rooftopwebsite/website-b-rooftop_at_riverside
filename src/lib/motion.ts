export const ease = {
  out: [0.16, 1, 0.3, 1] as const,
  inOut: [0.22, 1, 0.36, 1] as const,
} as const;

export const dur = {
  micro: 0.2,
  ui: 0.35,
  reveal: 0.7,
  hero: 1.1,
} as const;

export const stagger = 0.08;

export const dist = {
  text: 32,
  media: 48,
} as const;

export const viewport = { once: true, margin: '0px 0px -20% 0px' } as const;

export const clip = {
  hidden: 'inset(0% 0% 100% 0%)',
  visible: 'inset(0% 0% 0% 0%)',
} as const;
