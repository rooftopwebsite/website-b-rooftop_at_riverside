export function sinEmDash(t: string): string;
export function sinEmDash(t: string | null): string | null;
export function sinEmDash(t: string | null): string | null {
  if (!t || !t.includes('—')) return t;
  return t
    .split('—')
    .map((p) => p.trim())
    .reduce((acc, parte, i) => {
      if (i === 0) return parte;
      if (!parte) return acc;
      const palabras = acc.split(/\s+/).filter(Boolean).length;
      if (palabras <= 3) return `${acc}: ${parte}`;
      const conMayuscula = parte.charAt(0).toUpperCase() + parte.slice(1);
      return `${acc.replace(/[.,;:]$/, '')}. ${conMayuscula}`;
    }, '')
    .trim();
}
