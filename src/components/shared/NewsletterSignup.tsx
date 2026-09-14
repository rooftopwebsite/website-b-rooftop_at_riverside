'use client';

import { useActionState, useId } from 'react';
import { useFormStatus } from 'react-dom';
import { subscribeToNewsletter, type ActionState } from '@/app/actions';
import { Button } from './Button';
import { Heading } from './Type';

/**
 * El newsletter, DENTRO del footer, como una tarjeta levantada sobre la losa
 * oscura. Lo monta `Footer.tsx` —ya no `layout.tsx`— así que sigue apareciendo
 * en las 23 páginas.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ESTE BLOQUE SE BORRÓ UNA VEZ Y VOLVIÓ, y conviene leer por qué antes de
 * tocarlo.
 *
 * El 2026-09-09 se eliminó del footer con este argumento: «la web actual no
 * tiene nada parecido y el cliente no lo pidió». El argumento era correcto y
 * la premisa falsa — `eatdrinkparadise.com` sí lo tiene, en el pre-footer,
 * verificado el 2026-09-11. Lo que falló fue el inventario, que no lo
 * registró; ya está corregido en `docs/current-site-inventory.md`.
 *
 * El copy es el del sitio original, textual: «Sign Up», la bajada, «Join» y
 * «Thanks for subscribing!». No es falta de imaginación: es el único texto del
 * sitio nuevo que el cliente ya aprobó al publicarlo él mismo.
 *
 * ⚠️ SON DOS CAMPOS Y EL ORIGINAL TIENE TRES. Se cayó el apellido. En una
 * lista de correo el apellido no se usa para nada —no se personaliza un envío
 * con «Hola Juan Pérez»— y cada campo de más baja la conversión. El nombre sí
 * queda, que es el que sirve para encabezar el mail.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ PENDIENTE BLOQUEANTE: LA PLANILLA NO EXISTE. Sin
 * `NEWSLETTER_SHEETS_WEBHOOK_URL` la action responde error y el alta NO se
 * guarda. El formulario está terminado, el destino no. Paso a paso y código del
 * Apps Script en `docs/pedido-al-cliente.md`, ítem 24.
 *
 * ⚠️ Y FALTA LA POLÍTICA DE PRIVACIDAD. Esto capta datos personales y el sitio
 * todavía no tiene páginas legales, así que no hay a dónde linkear. Cuando
 * existan, el link va en la línea fina de abajo del formulario — está marcada
 * con un comentario.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ERA UNA BANDA `bone` PROPIA Y AHORA ES UNA TARJETA `deeper` ADENTRO DEL
 * FOOTER. Pedido de Camila: «que esto esté en una card más oscura dentro del
 * footer, como pasa con Visit us en el footer de the-orient».
 *
 * Es el mismo patrón que the-orient resuelve en su `pre-footer.tsx`: la
 * sección comparte el fondo del footer y adentro lleva una card de bajo
 * contraste, que se lee como superficie levantada y no como bloque aparte.
 * Acá el par es `deeper` (#013434) sobre `deep` (#014545) — 1.26:1— y es el
 * mismo escalón que ya usan las tarjetas de `WhatsOn` y `EventsBanner`.
 *
 * ⚠️ ESTO NO ROMPE «NUNCA DOS SUPERFICIES DE COLOR SEGUIDAS». La versión
 * anterior de esta nota decía que el bloque no podía ser oscuro porque dejaría
 * dos losas pegadas, y la salida es la que usa the-orient: no hay dos losas,
 * hay UNA. El newsletter dejó de ser una banda y pasó a ser contenido del
 * footer.
 *
 * ⚠️ LO QUE SÍ CAMBIA, y conviene saberlo: en las dos rutas que terminan en una
 * sección `deep` —`/our-story` y `/nfc-north-hq`— el footer ahora queda pegado
 * a otra superficie oscura. Lo que marca el corte es el arco: el
 * `rounded-t-band` de 88px se mudó de este archivo al `<footer>`, y sus
 * esquinas dejan ver el blanco de la página. Ya pasaba igual con la banda
 * `bone`, que también apoyaba su arco contra esas secciones.
 *
 * ⚠️ NO ENTRA EN EL MAPA DE `surface-rhythm.mjs`, y no es un olvido: ese guard
 * recorre los `page.tsx` y lee sus imports. Esto vive en el footer, así que
 * ninguna página lo declara. Si algún día se mueve a una página, hay que
 * agregarlo al mapa en el mismo commit.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ Es un `<form action={...}>` de verdad, igual que el de eventos: funciona
 * sin JavaScript. Ver la nota de `InquiryForm.tsx`.
 */

const INITIAL: ActionState = { status: 'idle', message: '' };

/**
 * ⚠️ EL MISMO `INPUT_BASE` QUE `InquiryForm`, copiado a propósito y no
 * importado. Los dos formularios del sitio tienen que verse iguales, pero
 * `InquiryForm` es una sección de página con su propia escala y éste es una
 * banda global: el día que uno de los dos cambie de alto de campo, compartir la
 * constante obligaría a cambiar el otro. Si aparece un tercero, ahí sí vale la
 * pena subirlo a `shared/`.
 *
 * ⚠️ `text-[16px]` NO ES DECORATIVO: abajo de 16px Safari en iOS hace zoom solo
 * al enfocar el campo y descuadra la página entera.
 *
 * ⚠️ PÍLDORA Y PADDING DE 22px. El porqué está escrito una sola vez, en el
 * `INPUT_BASE` de `InquiryForm.tsx`. Los dos tienen que cambiar juntos: son
 * copias deliberadas, y si uno queda con el radio viejo, los dos formularios
 * del sitio dejan de verse iguales, que es justo lo que la nota de arriba
 * pide evitar.
 *
 * ⚠️ EL ALTO ES 42px, EL MISMO QUE EL BOTÓN. Ver la nota de `INPUT_BASE` en
 * `InquiryForm.tsx`: los dos formularios tienen que cambiar juntos.
 */
const INPUT_BASE =
  'h-10.5 w-full rounded-pill border bg-paper px-[22px] font-body text-[16px] text-ink transition-colors placeholder:text-body/45 focus-visible:border-deep';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    /* Crema y no naranja: la tarjeta del newsletter es `deeper`, o sea la
       superficie más oscura del sitio. Ver la nota de `EventsBanner`. */
    <Button type="submit" variant="onDark" size="lg" disabled={pending} className="w-full sm:w-auto">
      {pending ? 'Adding…' : 'Join'}
    </Button>
  );
}

export default function NewsletterSignup() {
  const [state, action] = useActionState(subscribeToNewsletter, INITIAL);
  const id = useId();
  const fid = (campo: string) => `${id}-${campo}`;

  const errores = state.fieldErrors ?? {};

  return (
    /*
      ⚠️ YA NO TRAE `GUTTER` NI `caja`. Los pone el footer, que es quien lo
      contiene: así el título de la tarjeta y el logo del footer arrancan del
      mismo margen sin que este archivo tenga que saber cuánto vale.

      Antes sí los traía, y la nota de acá explicaba por qué eran los del footer
      y no los de la home. El problema se disolvió solo al meterse adentro.

      ⚠️ `rounded-shell` (32px) y no `rounded-card` (10px). Es el radio que ya
      usan las tarjetas oscuras del sitio —las de `WhatsOn` y las de
      `EventsBanner`— y esta es de la misma familia: una superficie levantada
      sobre la losa, no un recuadro de contenido.
    */
    <section
      aria-labelledby={`${id}-title`}
      className="rounded-shell bg-deeper sombra-card px-6 py-10 sm:px-9 lg:px-12 lg:py-12"
    >
      {/*
            ⚠️ DOS COLUMNAS DESIGUALES (`1fr` / `1.15fr`) y no mitades. El texto
            son tres renglones cortos y el formulario son dos campos más un
            botón: partido al medio, la columna del texto queda con un pozo de
            aire a la derecha y la del formulario aprieta los campos. El peso
            extra va donde hay más piezas.

            ⚠️ LAS DOS COLUMNAS ARRANCAN EN `md` Y NO EN `lg`. Pedido de Camila
            sobre la tarjeta en tablet: el texto de un lado y los campos del
            otro. A 834px la tarjeta mide 700 y de sobra da para partirla; con
            el corte en `lg` (1024) quedaba el título arriba y los tres
            controles en una fila abajo, cada input en 200px para un
            placeholder de «First name».
          */}
          <div className="grid items-center gap-9 md:grid-cols-[1fr_1.15fr] md:gap-10 lg:gap-16">
            <div>
              <Heading level={2} id={`${id}-title`} className="m-0 text-d3 text-paper">
                Sign up
              </Heading>
              {/*
                `bajada` Y NO un color literal: la utilidad lee `--lead-ink`, que
                vale `muted` sobre claro y `muted-dark` dentro de `.on-dark` — la
                clase que ahora trae el `<footer>`. Acá eso da 7.48:1 sobre la
                tarjeta `deeper`.

                Antes iba `text-body/80`, que es tinta sobre hueso: sobre esta
                tarjeta habría quedado en 1.2:1, o sea invisible.
              */}
              <p className="bajada mt-gap-bajada max-w-[38ch] font-body text-lead font-light">
                Stay up to date with all the latest from Rooftop at Riverside.
              </p>
            </div>

            {/*
              ⚠️ `status === 'ok'` REEMPLAZA AL FORMULARIO, no le agrega un
              cartel abajo. Dejar los campos llenos al lado de un «gracias»
              invita a mandarlo de nuevo, y un alta repetida ensucia la planilla.

              `role="status"` y no `role="alert"`: es una confirmación esperada,
              no una interrupción. El lector de pantalla la anuncia cuando
              termina lo que está diciendo.
            */}
            {state.status === 'ok' ? (
              <p
                role="status"
                className="rounded-card border border-paper/20 bg-deep px-6 py-5 font-body text-lead text-paper"
              >
                {state.message}
              </p>
            ) : (
              <form action={action} noValidate className="flex flex-col gap-3">
                {/*
                  ⚠️ LOS CAMPOS SE APILAN HASTA `desk` Y RECIÉN AHÍ VAN EN FILA.
                  Estaba en `sm` (640), o sea que en tablet los dos inputs y el
                  botón compartían renglón dentro de media tarjeta: medido a
                  834px eso deja 130px por campo, menos que el propio
                  placeholder.

                  Apilados —«First name» arriba, «Email» abajo, «Join» debajo—
                  cada campo usa el ancho entero de su columna, que es
                  exactamente lo que Camila marcó con las dos elipses.

                  ⚠️ EL CORTE ES `desk` (1344) Y NO `lg`. La fila de tres sólo
                  entra cómoda cuando la columna del formulario pasa los 500px,
                  y eso recién pasa con la caja en su ancho máximo.
                */}
                <div className="flex flex-col gap-3 desk:flex-row desk:items-start">
                  <div className="flex-1">
                    {/*
                      ⚠️ LABEL REAL Y OCULTO, no un `placeholder` haciendo de
                      rótulo. El placeholder desaparece al escribir —y con él, la
                      única pista de qué va en el campo— y varios lectores de
                      pantalla directamente no lo anuncian. Acá el rótulo existe
                      en el DOM y el placeholder es una ayuda, no el rótulo.
                    */}
                    <label htmlFor={fid('firstName')} className="sr-only">
                      First name
                    </label>
                    <input
                      id={fid('firstName')}
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      placeholder="First name"
                      aria-invalid={errores.firstName ? true : undefined}
                      aria-describedby={errores.firstName ? fid('firstName-err') : undefined}
                      className={`${INPUT_BASE} ${errores.firstName ? 'border-2 border-tomato' : 'border-ink/20'}`}
                    />
                  </div>

                  <div className="flex-1">
                    <label htmlFor={fid('email')} className="sr-only">
                      Email
                    </label>
                    <input
                      id={fid('email')}
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="Email"
                      aria-invalid={errores.email ? true : undefined}
                      aria-describedby={errores.email ? fid('email-err') : undefined}
                      className={`${INPUT_BASE} ${errores.email ? 'border-2 border-tomato' : 'border-ink/20'}`}
                    />
                  </div>

                  <SubmitButton />
                </div>

                {/*
                  El honeypot. Oculto con `sr-only` + `aria-hidden` + `tabIndex`
                  negativo: invisible para quien ve, inalcanzable por teclado y
                  no anunciado por el lector. Un bot que completa el formulario a
                  ciegas sí lo llena.

                  ⚠️ NO se oculta con `display:none`: hay bots que ignoran los
                  campos ocultos por CSS, con lo cual la trampa no dispara.
                */}
                <div className="sr-only" aria-hidden="true">
                  <label htmlFor={fid('website')}>Leave this empty</label>
                  <input id={fid('website')} name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>

                {/*
                  ⚠️ EL `aria-live` EXISTE SIEMPRE EN EL DOM, vacío mientras no
                  hay nada que decir. Si el nodo se montara recién con el error,
                  buena parte de los lectores de pantalla no lo anuncia: sólo
                  vigilan las regiones que ya estaban cuando cambian.
                */}
                <p aria-live="polite" className="sr-only">
                  {state.status === 'error' ? state.message : ''}
                </p>

                {state.status === 'error' ? (
                  <div className="flex flex-col gap-1">
                    {/* Los errores se dicen con TEXTO además del borde rojo: el
                        color solo no es un medio de comunicación accesible.

                        ⚠️ `tomato-soft` y no `terra`. `terra` es el rojo para
                        superficie CLARA y sobre esta tarjeta da 1.16:1. Ver la
                        nota del token en globals.css. */}
                    {errores.firstName ? (
                      <p id={fid('firstName-err')} className="font-body text-dato text-tomato-soft">
                        {errores.firstName}
                      </p>
                    ) : null}
                    {errores.email ? (
                      <p id={fid('email-err')} className="font-body text-dato text-tomato-soft">
                        {errores.email}
                      </p>
                    ) : null}
                    {!errores.firstName && !errores.email ? (
                      <p className="font-body text-dato text-tomato-soft">{state.message}</p>
                    ) : null}
                  </div>
                ) : null}

                {/* ⚠️ ACÁ VA EL LINK A LA POLÍTICA DE PRIVACIDAD cuando la
                    página exista. Hoy no hay a dónde apuntar y un link a un 404
                    es peor que no tenerlo. Ver la nota del encabezado.

                    ⚠️ VA EN `bajada` Y NO EN UNA OPACIDAD. El primer intento fue
                    `text-body/60` y lo cazó `npm run a11y`: a 13px esa
                    transparencia daba 4.42:1 contra el mínimo de 4.5. Después
                    fue `text-muted`, que es opaco y resolvía el caso mientras el
                    bloque era claro; con la tarjeta en `deeper` ese verde medio
                    cae a 2.5:1.

                    `bajada` es el mecanismo que ya tiene el sitio para esto:
                    lee `--lead-ink` y elige el token según la superficie. Acá
                    resuelve en `muted-dark`, 7.48:1.
                */}
                {/*
                  ⚠️ CENTRADO CONTRA LOS CAMPOS, NO CONTRA LA TARJETA. Pedido
                  de Camila: «esto centrado a los inputs y cta del form».

                  El `<p>` es hermano del bloque de campos dentro del mismo
                  `<form>`, así que su caja mide exactamente lo que miden los
                  inputs y el botón: centrar el texto ahí lo centra contra
                  ellos y no contra la mitad de la tarjeta, que es más ancha.

                  ⚠️ Y SE CENTRA SÓLO MIENTRAS LOS CAMPOS ESTÉN APILADOS. En
                  `desk` los tres controles pasan a una fila y la columna deja
                  de existir: ahí el texto vuelve a la izquierda, alineado con
                  el borde del primer campo, que es de donde cuelga. Camila:
                  «en desk el texto este sí va marginado; el centro solo en
                  mobile y tablet».
                */}
                <p className="bajada text-center font-body text-micro desk:text-left">
                  No spam. Unsubscribe any time.
                </p>
              </form>
            )}
      </div>
    </section>
  );
}
