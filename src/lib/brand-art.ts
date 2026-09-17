/**
 * Arte de marca sacado del archivo de Figma, no dibujado a mano.
 *
 * Fuente: «Rooftop at Riverside (Copy)», página «Elementos», nodo 2001:2414.
 * https://www.figma.com/design/en8wZdHkR3Nsn1UdiktAlV/Rooftop-at-Riverside--Copy-?node-id=2001-2414
 *
 * ⚠️ Vive en un módulo aparte y no dentro del componente porque el path pesa
 * 2,3 KB: si dos secciones lo usan, la constante se comparte y el archivo
 * fuente no lo lleva escrito dos veces.
 */

/**
 * La cenefa de olas: el separador del brand book.
 *
 * En Figma está tres veces —crema, teal y naranja— y es el MISMO dibujo con
 * distinto relleno, así que acá va una sola vez y el color lo pone quien lo usa.
 *
 * ⚠️ El período de repetición es `OLA.periodo` y NO el ancho del motivo. El
 * motivo mide 422px pero al repetirlo cada 422 queda un hueco visible entre la
 * cresta grande y la primera ola de la copia siguiente: la tira no cierra sola.
 * En el archivo el diseñador la resolvió SUPERPONIENDO las copias, y lo hizo a
 * ojo — los dos solapes del archivo son distintos, 383,5 y 399,8.
 *
 * Renderizadas las tres posibilidades una al lado de la otra, 383,5 es la única
 * que corre continua; 422 y 400 dejan el hueco. Así que 383,5 es el período
 * bueno y el tercer motivo del archivo está mal colocado.
 */
export const OLA = {
  /** Ancho del dibujo. Más que el período: las copias se superponen. */
  ancho: 422,
  alto: 50,
  /** Cada cuánto se repite para que la tira corra sin corte. Medido. */
  periodo: 383.5,
  d: 'M418.337 49.3358C417.035 49.2016 415.731 49.0833 414.425 48.9775C406.663 48.343 398.794 48.4172 391.139 46.9335C389.510 46.6194 387.898 46.2232 386.327 45.715C372.321 41.1787 377.981 21.9745 389.463 17.6987C391.149 17.0705 391.311 14.9492 389.738 14.1142C388.613 13.516 387.664 12.9935 387.410 12.8609C374.008 5.87501 360.614 7.78646 351.970 19.6812C347.125 26.3482 345.303 34.338 338.637 39.8497C331.506 45.7465 319.006 46.692 315.038 36.8476C313.324 32.5939 314.610 27.6283 318.084 24.4242C318.726 23.8323 319.475 23.2388 319.644 22.4196C320.407 18.7199 310.563 15.8993 307.799 15.3453C302.854 14.3572 297.562 14.8166 293.054 16.9821C288.186 19.3213 284.726 23.4819 282.853 28.146C280.664 33.5962 279.063 39.2878 273.100 42.3199C266.228 45.8144 259.523 43.7309 258.522 43.4026C242.106 38.0077 254.279 16.9521 266.103 14.1505C266.599 14.0337 267.054 13.7875 267.382 13.4292C268.212 12.5263 267.656 11.7608 267.102 11.131C253.736 -4.07827 237.047 4.30294 227.459 17.05C219.980 26.9938 212.288 44.3055 197.013 45.3914C190.762 45.8349 185.091 41.4881 185.306 35.6386C185.512 29.9927 191.181 25.578 196.503 23.5971C198.188 22.9689 198.351 20.8476 196.778 20.0126C195.651 19.4144 194.703 18.8919 194.450 18.7594C191.508 17.2268 188.365 15.9688 185.077 15.208C177.291 13.4055 167.773 14.9776 162.481 20.8665C153.911 30.4015 155.329 35.8107 146.613 39.8482C138.256 43.7199 126.088 41.5796 119.786 34.6063C118.787 33.4999 116.018 30.3494 115.607 25.6522C115.138 20.2746 118.060 16.3255 118.917 15.2033C123.325 9.42954 131.038 7.40762 134.768 6.42902C134.768 6.42902 126.987 -2.13052 112.578 0.5038C102.813 2.28895 97.663 9.94568 94.427 18.0996C90.823 27.1769 88.132 39.9902 76.831 43.7199C70.274 45.8839 62.021 43.2196 59.030 37.4632C55.911 31.4622 59.851 23.0542 67.135 21.8467C67.688 21.7551 68.217 21.542 68.634 21.198C70.177 19.9289 68.917 18.2211 67.660 17.162C60.196 10.8801 47.820 8.65771 39.867 14.4141C36.197 17.0705 33.936 20.9723 31.396 24.5647C23.760 35.3687 12.745 44.154 0.000 49.6089C53.481 49.6152 106.962 49.6183 160.445 49.6183C172.799 49.6183 229.728 49.7304 229.728 49.7304C229.570 49.6925 229.334 49.6562 229.059 49.6183L248.994 49.6183C283.486 49.6183 317.977 49.6183 352.467 49.6183C364.822 49.6183 421.750 49.7304 421.750 49.7304C421.098 49.5773 419.161 49.4194 418.336 49.3326L418.337 49.3358Z',
} as const;

/**
 * LA ONDULACIÓN SUAVE, media. Es el mismo dibujo que sirve
 * `public/brand/wave-only.svg` —la ola que usa `PhotoDivider` en la home—
 * pero acá va inline y CORTADA POR LA MITAD, y las dos cosas tienen motivo.
 *
 * ⚠️ POR QUÉ MEDIA. El archivo son dos caminos espejados que se encuentran en
 * el centro del `viewBox` (x≈785 de 1570) y ahí las curvas no empalman: forman
 * un vértice. Estirado al ancho de una pantalla, ese vértice se lee como un
 * pico en el medio. Camila lo marcó sobre la página: «no quiero que tenga este
 * pico». Con una sola mitad no hay junta que disimular.
 *
 * ⚠️ POR QUÉ INLINE Y NO EL `<img>`. Un SVG servido como imagen respeta su
 * propio `preserveAspectRatio`, así que al forzarle una caja más apaisada el
 * navegador NO lo estira: lo encoge y lo centra, y aparece la franja vacía a
 * los costados. Inline se le puede poner `preserveAspectRatio="none"` y el
 * dibujo se estira a cualquier alto. Es lo mismo que hace `WaveBorder`.
 *
 * ⚠️ EL DIBUJO SE PASA DEL `viewBox` A PROPÓSITO: el camino va de x=-31 a 855
 * y la caja corta en 800, así que la curva entra y sale de cuadro en vez de
 * terminar contra el borde.
 */
export const OLA_SUAVE = {
  viewBox: '0 0 800 169',
  /** Alto del `viewBox`. Lo necesita el espejo vertical del path. */
  alto: 169,
  d: 'M854.986 152.046C847.829 142.39 835.337 141.609 824.337 139.365C788.251 131.979 751.609 126.483 715.776 118.265C648.308 102.787 582.307 84.8632 510.995 106.72C389.31 154.062 313.8 96.2073 213.432 90.989C128.693 86.6026 39.7301 99.1568 -31.0254 155.222C-6.01569 183.532 20.6883 210.455 54.2959 231.606L66.5352 229.11C117.263 218.724 169.71 208.01 221.069 196.388C274.452 184.313 326.975 173.826 378.587 173.877C379.371 173.877 380.181 173.877 380.965 173.877C381.673 173.877 382.355 173.877 383.063 173.877C385.516 173.877 387.995 173.952 390.447 174.103C411.588 174.809 432.602 177.355 453.414 182.523C485.479 190.464 518.379 197.296 550.191 203.901L566.325 207.253C624.057 219.303 690.235 228.681 762.988 235.21C798.897 211.816 830.052 184.515 854.96 152.046H854.986Z',
} as const;
