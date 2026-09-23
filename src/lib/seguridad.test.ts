import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { asuntoSeguro, nombreSeguro, podar } from './saneo.ts';
import { firmaCoincide } from './file-signature.ts';

describe('asuntoSeguro', () => {
  it('reemplaza saltos de línea por un espacio', () => {
    assert.equal(asuntoSeguro('Hola\r\nBcc: x@y.com'), 'Hola Bcc: x@y.com');
  });
  it('colapsa espacios repetidos y recorta', () => {
    assert.equal(asuntoSeguro('  Job   application:\n\nAna  '), 'Job application: Ana');
  });
  it('deja intacto un asunto normal', () => {
    assert.equal(asuntoSeguro('Booking request: The Band'), 'Booking request: The Band');
  });
});

describe('nombreSeguro', () => {
  it('saca las rutas de Windows y Unix', () => {
    assert.equal(nombreSeguro('C:\\Users\\ana\\cv.pdf'), 'cv.pdf');
    assert.equal(nombreSeguro('../../etc/passwd'), 'passwd');
  });
  it('quita caracteres de control y prohibidos', () => {
    assert.equal(nombreSeguro('mi<cv>:"|?*\u0000\u001f.pdf'), 'micv.pdf');
  });
  it('recorta a 100 caracteres conservando la extensión', () => {
    const largo = `${'a'.repeat(150)}.pdf`;
    const r = nombreSeguro(largo);
    assert.equal(r.length, 100);
    assert.ok(r.endsWith('.pdf'));
  });
  it('recorta un nombre largo sin extensión a 100', () => {
    assert.equal(nombreSeguro('b'.repeat(130)).length, 100);
  });
  it('no trata un punto inicial como extensión', () => {
    assert.equal(nombreSeguro('.bashrc'), '.bashrc');
  });
  it('cae a attachment si queda vacío', () => {
    assert.equal(nombreSeguro(''), 'attachment');
    assert.equal(nombreSeguro('///'), 'attachment');
    assert.equal(nombreSeguro('<>?'), 'attachment');
  });
});

describe('podar', () => {
  const VENTANA = 1000;
  it('no toca nada si está por debajo del tope', () => {
    const hits = new Map([['a', [0]]]);
    podar(hits, 5000, VENTANA, 10);
    assert.equal(hits.size, 1);
  });
  it('descarta las claves vencidas cuando supera el tope', () => {
    const hits = new Map([
      ['vieja', [0]],
      ['nueva', [4800]],
      ['otra', [4900]],
    ]);
    podar(hits, 5000, VENTANA, 2);
    assert.deepEqual([...hits.keys()].sort(), ['nueva', 'otra']);
  });
  it('si siguen sobrando, descarta las de actividad más vieja', () => {
    const hits = new Map([
      ['a', [4100]],
      ['b', [4900]],
      ['c', [4500]],
    ]);
    podar(hits, 5000, VENTANA, 2);
    assert.deepEqual([...hits.keys()].sort(), ['b', 'c']);
  });
});

const b = (...xs: number[]) => new Uint8Array([...xs, ...new Array(16).fill(0)]);
const ascii = (s: string) => [...s].map((c) => c.charCodeAt(0));
const DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

describe('firmaCoincide', () => {
  it('PDF', () => {
    assert.ok(firmaCoincide(b(...ascii('%PDF-1.7')), 'application/pdf'));
    assert.ok(!firmaCoincide(b(...ascii('hola mundo')), 'application/pdf'));
  });
  it('DOCX (ZIP)', () => {
    assert.ok(firmaCoincide(b(0x50, 0x4b, 0x03, 0x04), DOCX));
    assert.ok(!firmaCoincide(b(...ascii('%PDF-1.7')), DOCX));
  });
  it('DOC (OLE)', () => {
    assert.ok(firmaCoincide(b(0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1), 'application/msword'));
    assert.ok(!firmaCoincide(b(0x50, 0x4b, 0x03, 0x04), 'application/msword'));
  });
  it('JPEG', () => {
    assert.ok(firmaCoincide(b(0xff, 0xd8, 0xff, 0xe0), 'image/jpeg'));
    assert.ok(!firmaCoincide(b(0x89, 0x50, 0x4e, 0x47), 'image/jpeg'));
  });
  it('PNG', () => {
    assert.ok(firmaCoincide(b(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a), 'image/png'));
    assert.ok(!firmaCoincide(b(0xff, 0xd8, 0xff), 'image/png'));
  });
  it('WebP', () => {
    assert.ok(firmaCoincide(b(...ascii('RIFF'), 0, 0, 0, 0, ...ascii('WEBP')), 'image/webp'));
    assert.ok(!firmaCoincide(b(...ascii('RIFF'), 0, 0, 0, 0, ...ascii('WAVE')), 'image/webp'));
  });
  it('AVIF', () => {
    assert.ok(firmaCoincide(b(0, 0, 0, 0x20, ...ascii('ftypavif')), 'image/avif'));
    assert.ok(firmaCoincide(b(0, 0, 0, 0x20, ...ascii('ftypavis')), 'image/avif'));
    assert.ok(!firmaCoincide(b(0, 0, 0, 0x20, ...ascii('ftypheic')), 'image/avif'));
  });
  it('un tipo desconocido nunca coincide', () => {
    assert.ok(!firmaCoincide(b(...ascii('%PDF-1.7')), 'text/plain'));
  });
  it('un archivo más corto que la firma no coincide', () => {
    assert.ok(!firmaCoincide(new Uint8Array([0x25, 0x50]), 'application/pdf'));
  });
});
