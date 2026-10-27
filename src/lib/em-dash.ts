export function withoutEmDash(t: string): string;
export function withoutEmDash(t: string | null): string | null;
export function withoutEmDash(t: string | null): string | null {
  if (!t || !t.includes('—')) return t;
  return t
    .split('—')
    .map((p) => p.trim())
    .reduce((acc, part, i) => {
      if (i === 0) return part;
      if (!part) return acc;
      const words = acc.split(/\s+/).filter(Boolean).length;
      if (words <= 3) return `${acc}: ${part}`;
      const capitalized = part.charAt(0).toUpperCase() + part.slice(1);
      return `${acc.replace(/[.,;:]$/, '')}. ${capitalized}`;
    }, '')
    .trim();
}
