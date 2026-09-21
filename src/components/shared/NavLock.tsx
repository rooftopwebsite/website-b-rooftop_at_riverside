'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { esNavegable } from '@/lib/flags';

/**
 * La tranca de navegación mientras las páginas internas se terminan.
 *
 * Lee `PAGINAS_PUBLICADAS` de `lib/flags.ts`, que es donde está el porqué y
 * cómo se abre una página. Acá sólo está el CÓMO.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ES UN SOLO LISTENER Y NO UN COMPONENTE `<Link>` PROPIO, y la decisión
 * es la parte importante del archivo.
 *
 * La alternativa era un `<SiteLink>` que envuelve a `next/link` y decide si
 * navega. Se descartó: hay 60 y pico de links entre el header, el footer, las
 * ocho secciones de la home y las internas. Migrarlos a todos para una tranca
 * TEMPORAL significa tocar cada archivo dos veces —una para poner el wrapper
 * y otra para sacarlo— y garantizar que en la segunda pasada queden tres
 * olvidados.
 *
 * Un listener en captura sobre el documento agarra todo, incluido lo que se
 * agregue mañana, y desaparece borrando dos archivos.
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
 *   · Las páginas publicadas. Son las cuatro de `PAGINAS_PUBLICADAS` y son
 *     justamente lo que el cliente tiene que poder recorrer.
 *   · Los anclajes de la MISMA página, sea cual sea. La home tiene
 *     `#whats-on`, `#trucks`, `#yard`, `#events` y `#find-us`, y son parte de
 *     cómo se recorre. Vale también estando parado en una página no
 *     publicada: si entraste escribiendo la URL, adentro te movés.
 *   · Otro origen. Instagram, Facebook, Google, Toast y el mapa son los
 *     destinos externos reales del sitio y no tienen nada que ver con que las
 *     internas estén sin terminar.
 *   · `mailto:` y `tel:`. Son las dos vías de contacto del negocio; trancarlas
 *     sería trancar el teléfono.
 *   · Cualquier clic que ya venga con `defaultPrevented`, o con Cmd/Ctrl/Shift
 *     apretado, o del botón del medio: eso es «abrir en otra pestaña», que el
 *     navegador maneja solo y que no queremos pisar.
 */
export default function NavLock() {
  const pathname = usePathname();

  useEffect(() => {
    /**
     * ¿Este `<a>` lleva a una página que todavía no se puede navegar?
     *
     * Devuelve `false` ante la menor duda: una URL que no parsea, otro
     * esquema, otro origen. La tranca es de presentación y equivocarse de
     * más significa romper un link que funcionaba.
     */
    const bloqueado = (anchor: HTMLAnchorElement): boolean => {
      const href = anchor.getAttribute('href') ?? '';

      // `mailto:`, `tel:` y cualquier otro esquema que no sea http(s).
      if (/^[a-z][a-z0-9+.-]*:/i.test(href) && !/^https?:/i.test(href)) return false;

      // Anclaje puro a esta misma página.
      if (href.startsWith('#')) return false;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return false;
      }

      // Otro sitio.
      if (url.origin !== window.location.origin) return false;

      // Misma ruta con hash: es un anclaje escrito largo (`/#find-us`).
      const actual = pathname.replace(/\/$/, '') || '/';
      const destino = url.pathname.replace(/\/$/, '') || '/';
      if (destino === actual) return false;

      return !esNavegable(destino);
    };

    const onClick = (e: MouseEvent) => {
      /* Clic con modificador o del botón del medio: es «abrir en otra
         pestaña». Lo resuelve el navegador y no es navegación de esta. */
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (e.button !== 0) return;

      const anchor = (e.target as HTMLElement | null)?.closest?.('a[href]');
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (!bloqueado(anchor)) return;

      e.preventDefault();
      e.stopPropagation();
    };

    /**
     * ⚠️ LA MANITO. Un botón que no navega no puede seguir mostrando el
     * cursor de link: el cliente clickea, no pasa nada, y el sitio parece
     * roto en vez de parecer incompleto.
     *
     * Se marca al pasar el mouse por encima y no en un barrido inicial,
     * porque la mitad de estos links aparecen después —el drawer de mobile, el
     * mega-menú, las tarjetas que monta el calendario— y un barrido los
     * perdería. Marcar en el `pointerover` no necesita un `MutationObserver`
     * y llega siempre antes que el clic.
     *
     * El atributo lo pinta `globals.css`; acá no se toca ni una propiedad de
     * estilo.
     */
    const onOver = (e: PointerEvent) => {
      const anchor = (e.target as HTMLElement | null)?.closest?.('a[href]');
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (bloqueado(anchor)) anchor.dataset.sinDestino = '';
      else delete anchor.dataset.sinDestino;
    };

    document.addEventListener('click', onClick, { capture: true });
    document.addEventListener('pointerover', onOver, { capture: true });
    return () => {
      document.removeEventListener('click', onClick, { capture: true });
      document.removeEventListener('pointerover', onOver, { capture: true });
    };
  }, [pathname]);

  return null;
}
