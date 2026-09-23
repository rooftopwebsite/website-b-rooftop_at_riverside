export function asuntoSeguro(s: string): string {
  return s.replace(/[\r\n]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

const MAX_NOMBRE = 100;

export function nombreSeguro(nombre: string): string {
  const base = nombre.split(/[\\/]/).pop() ?? '';
  const limpio = base.replace(/[\u0000-\u001f\u007f<>:"|?*]/g, '').trim();
  if (!limpio) return 'attachment';
  if (limpio.length <= MAX_NOMBRE) return limpio;
  const punto = limpio.lastIndexOf('.');
  const ext = punto > 0 && limpio.length - punto <= 10 ? limpio.slice(punto) : '';
  return limpio.slice(0, MAX_NOMBRE - ext.length) + ext;
}

export function podar(hits: Map<string, number[]>, ahora: number, ventana: number, tope: number): void {
  if (hits.size <= tope) return;
  for (const [clave, marcas] of hits) {
    if (!marcas.some((t) => ahora - t < ventana)) hits.delete(clave);
  }
  if (hits.size <= tope) return;
  const orden = [...hits].sort((a, b) => Math.max(...a[1]) - Math.max(...b[1]));
  for (const [clave] of orden.slice(0, hits.size - tope)) hits.delete(clave);
}
