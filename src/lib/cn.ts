import clsx, { type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const TAMANOS_DE_TEXTO = [
  'hero',
  'h1',
  'h2',
  'h3',
  'titan',
  'banda',
  'nav',
  'pastilla',
  'd1',
  'd2',
  'd3',
  'd4',
  'd5',
  'd6',
  'd7',
  'intro',
  'lead',
  'base',
  'cta',
  'dato',
  'micro',
  'caption',
];

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: TAMANOS_DE_TEXTO }],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
