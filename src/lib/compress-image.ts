/**
 * ACHICA UNA FOTO EN EL NAVEGADOR ANTES DE SUBIRLA.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ EXISTE POR EL TECHO DE 4,5 MB DE VERCEL. El formulario de artistas deja
 * elegir fotos de hasta 15 MB (es lo que promete el del cliente), y dos fotos
 * de teléfono ya pasan el techo del request. Redibujadas a 2400px del lado
 * largo y en JPEG al 85%, una foto de 8 MB queda en menos de 1 MB, que para
 * decidir si una banda entra en el escenario sobra.
 *
 * ⚠️ SÓLO SE TOCA LO QUE HACE FALTA. Si la imagen ya pesa menos que `umbral`,
 * vuelve tal cual: un logo en PNG de 200 KB no tiene nada que ganar y sí
 * mucho que perder (la transparencia, los bordes nítidos).
 *
 * ⚠️ UN PNG SE PASA A WEBP Y NO A JPEG, porque el JPEG no tiene transparencia
 * y un logo recortado llegaría con fondo negro. Safari viejo no codifica WebP
 * desde un canvas y devuelve PNG: en ese caso se queda el más liviano de los
 * dos, que puede ser el original.
 *
 * ⚠️ SI ALGO FALLA, VUELVE EL ORIGINAL. Un formato que el navegador no sabe
 * decodificar no es motivo para bloquear el envío: el servidor valida el
 * tamaño igual y, si pasa del techo, la persona ve el error de ese campo.
 * ══════════════════════════════════════════════════════════════════════════
 */
export async function compressImage(
  file: File,
  { maxPx = 2400, quality = 0.85, umbral = 900 * 1024 } = {},
): Promise<File> {
  if (!file.type.startsWith('image/') || file.size <= umbral) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const escala = Math.min(1, maxPx / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * escala);
    const h = Math.round(bitmap.height * escala);

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();

    const conAlfa = file.type === 'image/png' || file.type === 'image/webp';
    const tipo = conAlfa ? 'image/webp' : 'image/jpeg';
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, tipo, quality));
    if (!blob || blob.size >= file.size) return file;

    const ext = blob.type === 'image/webp' ? 'webp' : blob.type === 'image/png' ? 'png' : 'jpg';
    const nombre = file.name.replace(/\.[^.]+$/, '') + '.' + ext;
    return new File([blob], nombre, { type: blob.type, lastModified: Date.now() });
  } catch {
    return file;
  }
}
