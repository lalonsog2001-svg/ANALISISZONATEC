/* =============================================================================
 * AnalisisZonaTec — MODELO FINANCIERO BASE (INMUTABLE)
 * -----------------------------------------------------------------------------
 * Origen: definido por el franquiciatario / Dirección de Apertura.
 * Estas cifras NO se recalculan ni se "optimizan" en la app: son la regla dura
 * contra la que se mide toda zona. Cualquier cambio aquí invalida comparaciones
 * históricas y debe ser una decisión explícita del usuario.
 *
 * Todos los importes están expresados en PESOS MEXICANOS (MXN).
 * ========================================================================== */

export const MODELO = Object.freeze({
  version: '1.0.0',
  moneda: 'MXN',

  // --- Costo operativo mensual -------------------------------------------
  costoBaseMensual: 120000,        // desglose base del modelo
  colchonPct: 0.20,                // +20% de colchón de seguridad
  costoRealConBuffer: 144000,      // 120,000 * 1.20  -> escenario de trabajo
  costoEscenarioAlto: 160000,      // escenario conservador alto

  // --- Comisión y tickets mínimos ----------------------------------------
  comisionEstandarPct: 6,          // se cobra al vendedor, al comprador o split 3%+3%
  ticketMinBuffer: 2400000,        // 144,000 / 0.06  = 2,400,000
  ticketMinAlto: 2666667,          // 160,000 / 0.06  = 2,666,666.67 (redondeado en el modelo)

  // --- Delimitación territorial (regla Tecnocasa, NO MODIFICABLE) --------
  propiedadesPorOficina: 5500,

  // --- Rotación urbana de referencia CDMX (rango del modelo) -------------
  rotacionMinPct: 1.5,
  rotacionMaxPct: 3.0,

  // --- Desglose del costo base ($120,000 MXN) ----------------------------
  desgloseBase: Object.freeze([
    { concepto: 'Regalía Tecnocasa (royalty + fondo publicitario)', min: 25000, max: 35000 },
    { concepto: 'Renta de local comercial (60–90 m², zona media CDMX)', min: 25000, max: 40000 },
    { concepto: 'Nómina base (1 gerente + 3–4 asesores comisionistas + 1 admin)', min: 35000, max: 45000 },
    { concepto: 'Servicios (luz, agua, internet, teléfono)', min: 3000, max: 5000 },
    { concepto: 'Marketing local (volanteo, lonas, Facebook/Instagram Ads)', min: 8000, max: 12000 },
    { concepto: 'Seguros, contabilidad, misceláneos', min: 5000, max: 8000 },
  ]),
});

/* ---------------------------------------------------------------------------
 * UMBRALES DE DICTAMEN
 * ---------------------------------------------------------------------------
 * ⚠️ Estos umbrales NO provienen del modelo financiero del usuario ni de un
 * documento oficial de TECNOCASA. Son el criterio operativo propuesto por
 * AnalisisZonaTec para traducir los números a un semáforo. Son EDITABLES en la
 * interfaz y deben validarse con el franquiciador antes de usarse como regla
 * contractual.
 * ------------------------------------------------------------------------ */
export const UMBRALES_DEFAULT = Object.freeze({
  muestraMinima: 20,          // muestra válida mínima exigida por el proceso de Fase 0
  muestraRobusta: 30,         // por encima de esto la mediana es estadísticamente estable
  certezaVerdePct: 80,        // % de inmuebles escriturados (RPP)
  certezaAmarillaPct: 60,     // por debajo de esto: rojo
  competidoresVerde: 8,       // inmobiliarias activas en radio de 1.5 km
  competidoresAmarillo: 15,   // por encima de esto: rojo
  trazabilidadMinPct: 80,     // % de la muestra con fuente y URL verificable
  participacionVerdePct: 15,  // participación de mercado requerida: verde hasta este %
  participacionRojoPct: 30,   // participación requerida por encima de esto: rojo
});

/* ---------------------------------------------------------------------------
 * SUPUESTOS DE ANALISISZONATEC [SP1] — NO PROVIENEN DEL MODELO DEL USUARIO
 * ---------------------------------------------------------------------------
 * Son las variables que el modelo de 12 meses deja abiertas y que, si se
 * asumen implícitamente (por ejemplo, capturando el 100% de las ventas de la
 * zona), producen dictámenes falsamente positivos. Se exponen en la interfaz
 * como campos editables y se marcan como supuesto en el expediente.
 * ------------------------------------------------------------------------ */
export const SUPUESTOS = Object.freeze({
  participacionMercadoAnio1Pct: 10, // % de las ventas del polígono que captura la oficina en el año 1
  colchonMesesDefault: 12,          // meses de costo operativo financiados sin ingreso
  diasCicloVenta: 90,               // ciclo captación → escritura usado como referencia operativa
  nota: 'Supuestos [SP1] de AnalisisZonaTec. Editables en la interfaz. No son datos oficiales de TECNOCASA ni del modelo del franquiciatario.',
});

/* Estados posibles de un inmueble capturado. Los que tienen `excluye: true`
 * se descartan de la muestra estadística conforme al filtro de Fase 0. */
export const ESTADOS_PROPIEDAD = Object.freeze([
  { id: 'valido', etiqueta: '✅ Válida (se incluye)', excluye: false, motivo: null },
  { id: 'remate', etiqueta: '🚫 Remate', excluye: true, motivo: 'Remate' },
  { id: 'cesion', etiqueta: '🚫 Cesión de derechos', excluye: true, motivo: 'Cesión de derechos' },
  { id: 'sin_escritura', etiqueta: '🚫 Sin escritura / fuera de RPP', excluye: true, motivo: 'Sin escritura RPP' },
  { id: 'solo_contado', etiqueta: '🚫 Solo contado', excluye: true, motivo: 'Solo contado' },
  { id: 'juicio', etiqueta: '🚫 Litigio / juicio', excluye: true, motivo: 'Litigio / juicio' },
  { id: 'sin_precio', etiqueta: '🚫 Sin precio publicado', excluye: true, motivo: 'Sin precio publicado' },
  { id: 'duplicado', etiqueta: '🚫 Duplicado de otra publicación', excluye: true, motivo: 'Duplicado de otra publicación' },
]);

export const ESTADO_POR_ID = Object.freeze(
  Object.fromEntries(ESTADOS_PROPIEDAD.map((e) => [e.id, e]))
);

/* Tipos de inmueble para segmentar la muestra. */
export const TIPOS_PROPIEDAD = Object.freeze([
  'Departamento', 'Casa', 'Casa en condominio', 'Local comercial', 'Oficina', 'Terreno', 'Otro',
]);

/* Escenarios de costo operativo contra los que se puede dictaminar. */
export const ESCENARIOS = Object.freeze({
  buffer: {
    id: 'buffer',
    etiqueta: 'Con buffer (+20%)',
    costoMensual: MODELO.costoRealConBuffer,
    ticketMinimo: MODELO.ticketMinBuffer,
  },
  alto: {
    id: 'alto',
    etiqueta: 'Conservador alto',
    costoMensual: MODELO.costoEscenarioAlto,
    ticketMinimo: MODELO.ticketMinAlto,
  },
});

export const SEMAFORO = Object.freeze({
  verde: { id: 'verde', icono: '🟢', etiqueta: 'VIABLE', clase: 'verde' },
  amarillo: { id: 'amarillo', icono: '🟡', etiqueta: 'VIABLE CON CONDICIONES / RIESGO', clase: 'amarillo' },
  rojo: { id: 'rojo', icono: '🔴', etiqueta: 'NO VIABLE', clase: 'rojo' },
  sinDatos: { id: 'sinDatos', icono: '⚪', etiqueta: 'SIN DICTAMEN — DATOS INSUFICIENTES', clase: 'sin-datos' },
});

/* Fases del Plan Maestro (5 fases: Fase 0 pre-apertura + 4 fases de operación). */
export const FASES_ID = Object.freeze(['f0', 'f1', 'f2', 'f3', 'f4']);
