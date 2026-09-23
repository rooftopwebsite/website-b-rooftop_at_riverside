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
