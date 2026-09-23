const empieza = (b: Uint8Array, firma: readonly number[], desde = 0): boolean =>
  b.length >= desde + firma.length && firma.every((x, i) => b[desde + i] === x);

const ascii = (s: string): number[] => [...s].map((c) => c.charCodeAt(0));

const FIRMAS: Readonly<Record<string, (b: Uint8Array) => boolean>> = {
  'application/pdf': (b) => empieza(b, ascii('%PDF')),
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': (b) =>
    empieza(b, [0x50, 0x4b, 0x03, 0x04]),
  'application/msword': (b) => empieza(b, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]),
  'image/jpeg': (b) => empieza(b, [0xff, 0xd8, 0xff]),
  'image/png': (b) => empieza(b, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  'image/webp': (b) => empieza(b, ascii('RIFF')) && empieza(b, ascii('WEBP'), 8),
  'image/avif': (b) =>
    empieza(b, ascii('ftyp'), 4) && (empieza(b, ascii('avif'), 8) || empieza(b, ascii('avis'), 8)),
};

export function firmaCoincide(bytes: Uint8Array, mime: string): boolean {
  const regla = FIRMAS[mime];
  return regla ? regla(bytes) : false;
}

export function tipoDetectado(bytes: Uint8Array, candidatos: readonly string[]): string | null {
  for (const candidato of candidatos) {
    if (firmaCoincide(bytes, candidato)) return candidato;
  }
  return null;
}
