'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { SOLO_HOME } from '@/lib/flags';

/**
 * La tranca de navegación mientras el rediseño está en revisión.
 *
 * Lee `SOLO_HOME` de `lib/flags.ts`, que es donde está explicado el porqué y
 * cómo se saca. Acá sólo está el CÓMO.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ES UN SOLO LISTENER Y NO UN COMPONENTE `<Link>` PROPIO, y la decisión
 * es la parte importante del archivo.
 *
 * La alternativa era un `<SiteLink>` que envuelve a `next/link` y decide si
 * navega. Se descartó: hay 60 y pico de links entre el header, el footer, las
 * ocho secciones de la home y las 22 internas. Migrarlos a todos para una
 * tranca TEMPORAL significa tocar cada archivo dos veces —una para poner el
 * wrapper y otra para sacarlo— y garantizar que en la segunda pasada queden
 * tres olvidados.
 *
 * Un listener en captura sobre el documento agarra todo, incluido lo que se
 * agregue mañana, y desaparece cambiando un booleano.
 *
 * ⚠️ VA EN CAPTURA (`capture: true`) y no en burbujeo. `next/link` maneja su
 * propio `onClick` para hacer la navegación del lado del cliente; en burbujeo
 * el nuestro corre DESPUÉS y la navegación ya arrancó. En captura corre
 * primero y `stopPropagation` impide que el handler de Link llegue a verlo.
 *
 * ⚠️ El `preventDefault` hace falta ADEMÁS del `stopPropagation`: sin él, el
 * navegador sigue la `href` del `<a>` a la vieja usanza y recarga la página.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ QUÉ NO BLOQUEA, y cada excepción tiene su motivo:
 *
 *   · Los anclajes de la MISMA página. La home tiene `#whats-on`, `#trucks`,
 *     `#yard`, `#events` y `#find-us`, y son parte de cómo se recorre.
 *   · Otro origen. Instagram, Facebook, Google, Toast y el mapa son los
 *     destinos externos reales del sitio y no tienen nada que ver con que las
 *     internas estén sin rediseñar.
 *   · `mailto:` y `tel:`. Son las dos vías de contacto del negocio; trancarlas
 *     sería trancar el teléfono.
 *   · Cualquier clic que ya venga con `defaultPrevented`, o con Cmd/Ctrl/Shift
 *     apretado, o del botón del medio: eso es «abrir en otra pestaña», que el
 *     navegador maneja solo y que no queremos pisar.
 */
export default function NavLock() {
  const pathname = usePathname();

  useEffect(() => {
    if (!SOLO_HOME) return;

    const onClick = (e: MouseEvent) => {
      /* Clic con modificador o del botón del medio: es «abrir en otra
         pestaña». Lo resuelve el navegador y no es navegación de esta. */
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (e.button !== 0) return;

      const anchor = (e.target as HTMLElement | null)?.closest?.('a[href]');
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const href = anchor.getAttribute('href') ?? '';

      // `mailto:`, `tel:` y cualquier otro esquema que no sea http(s).
      if (/^[a-z][a-z0-9+.-]*:/i.test(href) && !/^https?:/i.test(href)) return;

      // Anclaje puro a esta misma página.
      if (href.startsWith('#')) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      // Otro sitio.
      if (url.origin !== window.location.origin) return;

      // Misma ruta con hash: es un anclaje escrito largo (`/#find-us`).
      const actual = pathname.replace(/\/$/, '') || '/';
      const destino = url.pathname.replace(/\/$/, '') || '/';
      if (destino === actual) return;

      e.preventDefault();
      e.stopPropagation();
    };

    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, [pathname]);

  return null;
}
