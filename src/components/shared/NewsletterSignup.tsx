'use client';

import { useActionState, useId } from 'react';
import { useFormStatus } from 'react-dom';
import { subscribeToNewsletter, type ActionState } from '@/app/actions';
import { Button } from './Button';
import { GUTTER } from './Section';
import { Heading } from './Type';

/**
 * El pre-footer de newsletter. Va en `layout.tsx`, arriba del `Footer`, así
 * que aparece en las 23 páginas.
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
 * ⚠️ LA SUPERFICIE ES `bone` Y NO PUEDE SER OSCURA. El footer es `deep`: una
 * banda de color acá dejaría dos losas oscuras pegadas, que es la regla más
 * estricta del ritmo de superficies —«nunca dos de color seguidas», ver
 * `scripts/surface-rhythm.mjs`—. Claro → oscuro es además el cierre que el
 * sitio ya tiene.
 *
 * ⚠️ NO ENTRA EN EL MAPA DE `surface-rhythm.mjs`, y no es un olvido: ese guard
 * recorre los `page.tsx` y lee sus imports. Esto vive en el layout, igual que
 * el `Footer`, así que ninguna página lo declara. Si algún día se mueve a una
 * página, hay que agregarlo al mapa en el mismo commit.
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
 */
const INPUT_BASE =
  'h-[50px] w-full rounded-btn border bg-paper px-[14px] font-body text-[16px] text-ink transition-colors placeholder:text-body/45 focus-visible:border-deep';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" size="lg" disabled={pending} className="w-full sm:w-auto">
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
    <section
      aria-labelledby={`${id}-title`}
      className="rounded-t-band bg-bone pt-14 pb-16 lg:pt-20 lg:pb-20"
    >
      {/*
        ⚠️ `GUTTER` + `caja`, QUE ES EL SISTEMA DEL FOOTER — y NO `caja-ancha`,
        que es el de las secciones de la home.

        Los dos topes valen hoy 1280, pero las cajas no son la misma: `caja`
        lleva el gutter POR FUERA y `caja-ancha` por dentro. Con `caja-ancha`
        este bloque quedaba 56px más adentro que el footer que tiene pegado
        abajo, y el escalón se veía en las 23 páginas —medido: el título
        arrancaba en 128.5 y el logo del footer en 72.5—.

        La regla es cuál es el vecino: esto se apoya sobre el footer, así que se
        alinea con el footer.
      */}
      <div className={GUTTER}>
        <div className="caja">
          {/*
            ⚠️ DOS COLUMNAS DESIGUALES (`1fr` / `1.15fr`) y no mitades. El texto
            son tres renglones cortos y el formulario son dos campos más un
            botón: partido al medio, la columna del texto queda con un pozo de
            aire a la derecha y la del formulario aprieta los campos. El peso
            extra va donde hay más piezas.
          */}
          <div className="grid items-center gap-9 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
            <div>
              <Heading level={2} id={`${id}-title`} className="m-0 text-d3 text-ink">
                Sign up
              </Heading>
              <p className="mt-gap-bajada max-w-[38ch] font-body text-lead font-light text-body/80">
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
                className="rounded-card border border-deep/20 bg-paper px-6 py-5 font-body text-lead text-ink"
              >
                {state.message}
              </p>
            ) : (
              <form action={action} noValidate className="flex flex-col gap-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
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
                        color solo no es un medio de comunicación accesible. */}
                    {errores.firstName ? (
                      <p id={fid('firstName-err')} className="font-body text-dato text-terra">
                        {errores.firstName}
                      </p>
                    ) : null}
                    {errores.email ? (
                      <p id={fid('email-err')} className="font-body text-dato text-terra">
                        {errores.email}
                      </p>
                    ) : null}
                    {!errores.firstName && !errores.email ? (
                      <p className="font-body text-dato text-terra">{state.message}</p>
                    ) : null}
                  </div>
                ) : null}

                {/* ⚠️ ACÁ VA EL LINK A LA POLÍTICA DE PRIVACIDAD cuando la
                    página exista. Hoy no hay a dónde apuntar y un link a un 404
                    es peor que no tenerlo. Ver la nota del encabezado.

                    ⚠️ `text-muted` Y NO `text-body/60`, que fue el primer
                    intento y lo cacheó `npm run a11y`: a 13px sobre `bone` esa
                    transparencia da 4.42:1 y el mínimo son 4.5. `muted` es el
                    token que existe justamente para esto —4.96:1 sobre `bone`,
                    medido en la tabla de contraste— y además es un color
                    OPACO, así que su contraste no depende de sobre qué caiga.
                */}
                <p className="font-body text-micro text-muted">No spam. Unsubscribe any time.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
