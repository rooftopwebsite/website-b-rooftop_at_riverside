import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { asuntoSeguro, nombreSeguro, podar } from './saneo.ts';

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
