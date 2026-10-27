const bytesStartWith = (b: Uint8Array, signature: readonly number[], from = 0): boolean =>
  b.length >= from + signature.length && signature.every((x, i) => b[from + i] === x);

const ascii = (s: string): number[] => [...s].map((c) => c.charCodeAt(0));

const SIGNATURES: Readonly<Record<string, (b: Uint8Array) => boolean>> = {
  'application/pdf': (b) => bytesStartWith(b, ascii('%PDF')),
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': (b) =>
    bytesStartWith(b, [0x50, 0x4b, 0x03, 0x04]),
  'application/msword': (b) => bytesStartWith(b, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]),
  'image/jpeg': (b) => bytesStartWith(b, [0xff, 0xd8, 0xff]),
  'image/png': (b) => bytesStartWith(b, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  'image/webp': (b) => bytesStartWith(b, ascii('RIFF')) && bytesStartWith(b, ascii('WEBP'), 8),
  'image/avif': (b) =>
    bytesStartWith(b, ascii('ftyp'), 4) && (bytesStartWith(b, ascii('avif'), 8) || bytesStartWith(b, ascii('avis'), 8)),
};

export function signatureMatches(bytes: Uint8Array, mime: string): boolean {
  const rule = SIGNATURES[mime];
  return rule ? rule(bytes) : false;
}

export function detectedType(bytes: Uint8Array, candidates: readonly string[]): string | null {
  for (const candidate of candidates) {
    if (signatureMatches(bytes, candidate)) return candidate;
  }
  return null;
}
