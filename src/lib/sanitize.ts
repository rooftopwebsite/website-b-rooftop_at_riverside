export function safeSubject(s: string): string {
  return s.replace(/[\r\n]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

const MAX_NAME = 100;

export function safeFilename(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? '';
  const clean = base.replace(/[\u0000-\u001f\u007f<>:"|?*]/g, '').trim();
  if (!clean) return 'attachment';
  if (clean.length <= MAX_NAME) return clean;
  const dot = clean.lastIndexOf('.');
  const ext = dot > 0 && clean.length - dot <= 10 ? clean.slice(dot) : '';
  return clean.slice(0, MAX_NAME - ext.length) + ext;
}

export function prune(hits: Map<string, number[]>, now: number, windowMs: number, cap: number): void {
  if (hits.size <= cap) return;
  for (const [key, stamps] of hits) {
    if (!stamps.some((t) => now - t < windowMs)) hits.delete(key);
  }
  if (hits.size <= cap) return;
  const order = [...hits].sort((a, b) => Math.max(...a[1]) - Math.max(...b[1]));
  for (const [key] of order.slice(0, hits.size - cap)) hits.delete(key);
}
