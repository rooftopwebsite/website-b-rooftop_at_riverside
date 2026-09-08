'use client';

import Image from 'next/image';

import { useEffect, useRef, useState } from 'react';

/**
 * El camión recorre la página con vos: la barra de progreso ES la ruta.
 *
 * Es el gesto que Camila señaló en ronnsquare.fr —un mismo elemento de marca
 * que te acompaña toda la historia en vez de aparecer sólo en el hero—. Allá
 * es un `.brand-clone` fijo en z-220 que se transforma con el scroll.
 *
 * ⚠️ PRIMER INTENTO DESCARTADO, y por qué. Empecé con el isotipo suelto en una
 * esquina, en trazo, al 10% de opacidad, avanzando en X. Se veía, en captura,
 * exactamente igual que un placeholder de foto faltante — y este sitio usa
 * recuadros grises con texto justamente para las fotos que el cliente todavía
 * no mandó (`PhotoPending`). Un adorno que se lee como un error es peor que no
 * tener adorno.
 *
 * La versión buena junta el gesto con algo que además sirve: una regla de 2px
 * al pie, el tramo recorrido en Sunset Orange, y el camión manejando sobre esa
 * línea hasta el final. Ya no es decoración ambigua: es un indicador de
 * progreso, y el que lo dibuja es el isotipo.
 *
 * Decisiones de color, que no son cosméticas:
 *
 *   · El camión va en **naranja**, no en teal. Al final del scroll queda sobre
 *     el footer, que es teal profundo: un camión teal ahí desaparecería. El
 *     naranja se lee sobre blanco y sobre `deep`.
 *   · La ruta sin recorrer va en `ink/10`, que sobre el footer no se ve — y no
 *     hace falta, porque para cuando llegás ahí el tramo ya está casi entero
 *     pintado de naranja.
 *
 * ⚠️ SÍ se monta con `prefers-reduced-motion`. La posición sigue al scroll 1:1,
 * sin easing, sin inercia y sin vida propia: es respuesta directa a lo que hace
 * el usuario, igual que la barra de scroll del navegador. Lo que esa preferencia
 * pide que apagues es el movimiento autónomo, no el feedback directo.
 *
 * ⚠️ `aria-hidden` y `pointer-events-none`. El progreso de scroll ya lo informa
 * el navegador; repetirlo en el árbol de accesibilidad es ruido.
 *
 * ⚠️ La medición va en un `rAF` y `scrollHeight` se lee ahí, no en el handler.
 * Leerlo en cada evento de scroll fuerza reflow y convierte un detalle en jank.
 */
export default function BrandTrail() {
  const [mounted, setMounted] = useState(false);
  const fillRef = useRef<HTMLSpanElement | null>(null);
  const truckRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;

    let frame = 0;
    let ticking = false;

    const apply = () => {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const pct = p * 100;
      if (fillRef.current) fillRef.current.style.width = `${pct}%`;
      /* El camión avanza con el progreso pero nunca se sale: al 0% arranca
         pegado al borde izquierdo y al 100% queda justo dentro del derecho.
         El ancho se MIDE — cambia con el breakpoint — en vez de ir escrito a
         mano, que es como se desalinea sin que nadie se entere. */
      if (truckRef.current) {
        const w = truckRef.current.offsetWidth;
        truckRef.current.style.left = `calc(${pct}% - ${(pct / 100) * w}px)`;
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      frame = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [mounted]);

  /* Sin JS no hay progreso que mostrar, y una ruta vacía al pie de la página
     sería una línea sin sentido. No se renderiza nada. */
  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] h-[2px] bg-ink/10"
    >
      <span ref={fillRef} className="absolute inset-y-0 left-0 block w-0 bg-sunset" />
      {/* El isotipo REAL del brand book (Figma `Logo-reduccion`), no un camión
          dibujado a mano. Viene en un solo `fill` #F58521, que es exactamente
          el token `sunset` — así que no hay que recolorearlo ni corregirlo. */}
      <span ref={truckRef} className="absolute bottom-[2px] left-0 block">
        {/* Más chico en el teléfono: a 38px sobre 390px de ancho el camión se
            monta encima del contenido del pie de página. */}
        <Image
          src="/brand/isotype-truck.svg"
          alt=""
          width={552}
          height={390}
          className="w-[26px] lg:w-[38px]"
        />
      </span>
    </div>
  );
}
