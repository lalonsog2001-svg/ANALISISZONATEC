/* =============================================================================
 * AnalisisZonaTec — MOTOR DE CÁLCULO
 * -----------------------------------------------------------------------------
 * Traduce una captura de zona (inmuebles con fuente) a KPIs de Fase 0 y a un
 * DICTAMEN con semáforo. Todo el cálculo es determinista y auditable: cada KPI
 * se reproduce a mano con los datos capturados.
 *
 * ⚠️ DECISIÓN DE MODELADO [SP1] — LÉELA ANTES DE USAR EL DICTAMEN
 * El modelo base dice: "estimar cuántas propiedades de las 5,500 se venden al
 * año (rotación 1.5%–3%)". Eso da el número de ventas DE LA ZONA, pero no dice
 * qué fracción captura TU oficina. Si se asume 100%, cualquier zona con precios
 * de mercado sale viable y el dictamen no sirve para nada.
 * Por eso esta herramienta introduce una variable explícita y editable:
 *   PARTICIPACIÓN DE MERCADO de la oficina nueva sobre las ventas del polígono.
 * Es un SUPUESTO [SP1], no un dato del modelo [SP2]. Default: 10% Año 1.
 * El KPI que realmente decide es la PARTICIPACIÓN REQUERIDA para no perder
 * dinero: si exige dominar más de la tercera parte del mercado de la zona, el
 * dictamen es rojo aunque el ticket esté bien.
 * ========================================================================== */

import {
  MODELO, UMBRALES_DEFAULT, ESTADO_POR_ID, ESCENARIOS, SEMAFORO, SUPUESTOS,
} from './model.js';
import { RUTA_VERIFICACION } from './fuentes.js';

/* ------------------------------ utilidades ------------------------------ */

export const num = (v) => {
  const n = typeof v === 'number' ? v : parseFloat(String(v ?? '').replace(/[$,\s]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

export const mxn = (v, dec = 0) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency', currency: 'MXN',
    minimumFractionDigits: dec, maximumFractionDigits: dec,
  }).format(Number.isFinite(v) ? v : 0);

export const mxnCompacto = (v) => {
  const n = Number.isFinite(v) ? v : 0;
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
  return mxn(n);
};

export const pct = (v, dec = 1) =>
  `${Number.isFinite(v) ? v.toFixed(dec) : '0.0'}%`;

const ordenar = (arr) => [...arr].sort((a, b) => a - b);

export function mediana(arr) {
  const a = ordenar(arr.filter((v) => Number.isFinite(v)));
  if (!a.length) return 0;
  const mid = Math.floor(a.length / 2);
  return a.length % 2 ? a[mid] : (a[mid - 1] + a[mid]) / 2;
}

export const promedio = (arr) => {
  const a = arr.filter((v) => Number.isFinite(v));
  return a.length ? a.reduce((s, v) => s + v, 0) / a.length : 0;
};

export function percentil(arr, p) {
  const a = ordenar(arr.filter((v) => Number.isFinite(v)));
  if (!a.length) return 0;
  if (a.length === 1) return a[0];
  const idx = (a.length - 1) * (p / 100);
  const lo = Math.floor(idx), hi = Math.ceil(idx);
  return lo === hi ? a[lo] : a[lo] + (a[hi] - a[lo]) * (idx - lo);
}

export function desviacionEstandar(arr) {
  const a = arr.filter((v) => Number.isFinite(v));
  if (a.length < 2) return 0;
  const m = promedio(a);
  return Math.sqrt(a.reduce((s, v) => s + (v - m) ** 2, 0) / (a.length - 1));
}

/* --------------------------- criterios y semáforo ------------------------ */

const nivel = (id) => ({ verde: 0, amarillo: 1, rojo: 2 }[id] ?? 0);

function criterio({ id, nombre, valor, valorTexto, umbral, estado, peso, mensaje }) {
  return { id, nombre, valor, valorTexto, umbral, estado, peso, mensaje };
}

/* Pesos del dictamen. Muestra y ticket pesan más: sin ellos el resto es cosmética. */
const PESOS = Object.freeze({
  muestra: 3, ticket: 3, demanda: 2, cobertura: 2, certeza: 2, competencia: 1, trazabilidad: 1, colchon: 1,
});

/* ------------------------------- KPIs ----------------------------------- */

export function computarKpis(zona = {}, umbrales = UMBRALES_DEFAULT, escenarioId = 'buffer') {
  const u = { ...UMBRALES_DEFAULT, ...(umbrales || {}) };
  const escenario = ESCENARIOS[escenarioId] ?? ESCENARIOS.buffer;
  const costoMensual = escenario.costoMensual;
  const ticketMinimo = escenario.ticketMinimo;

  const comisionPct = num(zona.comisionPct) || MODELO.comisionEstandarPct;
  const propiedades = Array.isArray(zona.propiedades) ? zona.propiedades : [];

  const excluidas = propiedades.filter((p) => ESTADO_POR_ID[p.estado]?.excluye);
  const validas = propiedades.filter((p) => !ESTADO_POR_ID[p.estado]?.excluye);

  const precios = validas.map((p) => num(p.precio)).filter((v) => v > 0);
  const preciosM2 = validas.filter((p) => num(p.m2) > 0).map((p) => num(p.precio) / num(p.m2));

  const motivos = {};
  for (const p of excluidas) {
    const m = ESTADO_POR_ID[p.estado]?.motivo || 'Otro';
    motivos[m] = (motivos[m] || 0) + 1;
  }

  /* --- Estadística de precio de la muestra --- */
  const precioPromedio = promedio(precios);
  const precioMediana = mediana(precios);
  const precioP25 = percentil(precios, 25);
  const precioP75 = percentil(precios, 75);
  const precioMin = precios.length ? Math.min(...precios) : 0;
  const precioMax = precios.length ? Math.max(...precios) : 0;
  const desviacion = desviacionEstandar(precios);
  const coeficienteVariacion = precioPromedio ? (desviacion / precioPromedio) * 100 : 0;
  const precioM2Mediana = mediana(preciosM2);

  /* --- Ticket vs. punto de equilibrio --- */
  const comisionMediana = (precioMediana * comisionPct) / 100;
  const brechaTicket = precioMediana - ticketMinimo;
  const brechaTicketPct = ticketMinimo ? (brechaTicket / ticketMinimo) * 100 : 0;

  /* --- Demanda de la zona y participación de la oficina --- */
  const inventario = MODELO.propiedadesPorOficina;                 // [SP2] 5,500
  const rotacionPct = num(zona.rotacionPct) || MODELO.rotacionMinPct; // [SP2] rango 1.5–3%
  const participacionMercadoPct = zona.participacionMercadoPct == null || zona.participacionMercadoPct === ''
    ? SUPUESTOS.participacionMercadoAnio1Pct
    : num(zona.participacionMercadoPct);

  // Ventas ANUALES de todo el polígono (mercado total del territorio)
  const ventasAnualesZona = (inventario * rotacionPct) / 100;
  const ventasMensualesZona = ventasAnualesZona / 12;

  // Ventas que captura LA OFICINA según la participación asumida
  const ventasAnualesOficina = (ventasAnualesZona * participacionMercadoPct) / 100;
  const ventasMensualesOficina = ventasAnualesOficina / 12;

  const ingresoMensualEstimado = ventasMensualesOficina * comisionMediana;
  const ingresoAnualEstimado = ingresoMensualEstimado * 12;
  const costoAnual = costoMensual * 12;

  // Ventas mínimas para no perder dinero y participación requerida del mercado
  const ventasAnualesRequeridas = comisionMediana > 0 ? costoAnual / comisionMediana : Infinity;
  const ventasMensualesRequeridas = ventasAnualesRequeridas / 12;
  const participacionRequeridaPct = ventasAnualesZona > 0
    ? (ventasAnualesRequeridas / ventasAnualesZona) * 100
    : Infinity;

  const coberturaPct = costoMensual ? (ingresoMensualEstimado / costoMensual) * 100 : 0;
  const margenMensualEstimado = ingresoMensualEstimado - costoMensual;
  const margenAnualEstimado = margenMensualEstimado * 12;

  // Holgura sobre la participación asumida (negativo = falta captación)
  const holguraParticipacionPct = participacionMercadoPct > 0
    ? (participacionMercadoPct - participacionRequeridaPct) / participacionMercadoPct * 100
    : 0;

  /* --- Certeza jurídica --- */
  const conEstatus = propiedades.filter((p) => p.escriturado && p.escriturado !== 'no_verificado');
  const escriturados = conEstatus.filter((p) => p.escriturado === 'si').length;
  const certezaPct = conEstatus.length
    ? (escriturados / conEstatus.length) * 100
    : num(zona.certezaJuridicaPct);

  /* --- Trazabilidad --- */
  const conFuente = validas.filter((p) => String(p.fuenteUrl || '').trim().length > 6).length;
  const trazabilidadPct = validas.length ? (conFuente / validas.length) * 100 : 0;

  /* --- Competencia y capital --- */
  const competidores = zona.competidoresNum == null || zona.competidoresNum === ''
    ? null
    : num(zona.competidoresNum);
  const ventasPorCompetidor = competidores != null && competidores > 0
    ? ventasAnualesZona / competidores
    : null;
  const colchonMeses = zona.colchonMeses == null || zona.colchonMeses === ''
    ? SUPUESTOS.colchonMesesDefault
    : num(zona.colchonMeses);

  /* --- Escalera de sensibilidad por rotación --- */
  const escalera = [MODELO.rotacionMinPct, (MODELO.rotacionMinPct + MODELO.rotacionMaxPct) / 2, MODELO.rotacionMaxPct]
    .map((r) => {
      const ventasZona = (inventario * r) / 100;
      const partReq = ventasZona > 0 ? (ventasAnualesRequeridas / ventasZona) * 100 : Infinity;
      const ventasOficina = (ventasZona * participacionMercadoPct) / 100;
      const ingresoMes = (ventasOficina / 12) * comisionMediana;
      return {
        rotacionPct: r,
        ventasAnioZona: ventasZona,
        ventasMesZona: ventasZona / 12,
        participacionRequeridaPct: partReq,
        ventasAnioOficina: ventasOficina,
        ingresosAnioOficina: ventasOficina * comisionMediana,
        ingresoMensual: ingresoMes,
        coberturaPct: costoMensual ? (ingresoMes / costoMensual) * 100 : 0,
        margenMensual: ingresoMes - costoMensual,
        cubre: ingresoMes >= costoMensual,
      };
    });

  return {
    escenario, costoMensual, ticketMinimo, comisionPct, inventario,
    // conteos
    nCapturadas: propiedades.length, nValidas: validas.length, nExcluidas: excluidas.length,
    motivosExclusion: motivos, nConFuente: conFuente,
    // precio
    precioPromedio, precioMediana, precioP25, precioP75, precioMin, precioMax,
    desviacion, coeficienteVariacion, precioM2Mediana,
    // ticket
    comisionMediana, brechaTicket, brechaTicketPct,
    // demanda
    rotacionPct, participacionMercadoPct,
    ventasAnualesZona, ventasMensualesZona,
    ventasAnualesOficina, ventasMensualesOficina,
    ventasAnualesRequeridas, ventasMensualesRequeridas, participacionRequeridaPct,
    // resultado
    ingresoMensualEstimado, ingresoAnualEstimado, costoAnual,
    coberturaPct, margenMensualEstimado, margenAnualEstimado, holguraParticipacionPct,
    // cualitativos
    certezaPct, trazabilidadPct, competidores, ventasPorCompetidor, colchonMeses,
    escalera, umbrales: u,
  };
}

/* ------------------------------ dictamen -------------------------------- */

export function evaluarCriterios(kpis) {
  const u = kpis.umbrales;
  const c = [];

  /* 1. Muestra válida */
  c.push(criterio({
    id: 'muestra',
    nombre: 'Muestra válida de la zona',
    valor: kpis.nValidas,
    valorTexto: `${kpis.nValidas} inmuebles válidos (${kpis.nExcluidas} excluidos de ${kpis.nCapturadas} capturados)`,
    umbral: `≥ ${u.muestraMinima} válidos`,
    peso: PESOS.muestra,
    estado: kpis.nValidas >= u.muestraRobusta ? 'verde' : kpis.nValidas >= u.muestraMinima ? 'amarillo' : 'rojo',
    mensaje: kpis.nValidas >= u.muestraRobusta
      ? 'Muestra robusta: la mediana de precio es estable.'
      : kpis.nValidas >= u.muestraMinima
        ? `Muestra suficiente pero justa: la mediana se mueve con 2–3 registros atípicos. Amplía a ${u.muestraRobusta}+ antes de firmar.`
        : `Muestra insuficiente: con menos de ${u.muestraMinima} inmuebles válidos no hay dictamen defendible.`,
  }));

  /* 2. Ticket vs. punto de equilibrio */
  const cubreTicket = kpis.precioMediana >= kpis.ticketMinimo;
  c.push(criterio({
    id: 'ticket',
    nombre: 'Ticket vs. punto de equilibrio',
    valor: kpis.precioMediana,
    valorTexto: `Mediana ${mxn(kpis.precioMediana)} | comisión ${kpis.comisionPct}% = ${mxn(kpis.comisionMediana)} | mínimo ${mxn(kpis.ticketMinimo)}`,
    umbral: `≥ ${mxn(kpis.ticketMinimo)} por operación (1 venta/mes)`,
    peso: PESOS.ticket,
    estado: cubreTicket ? 'verde' : kpis.precioMediana >= kpis.ticketMinimo * 0.75 ? 'amarillo' : 'rojo',
    mensaje: cubreTicket
      ? `Una sola venta a precio mediano cubre el costo del mes (${kpis.escenario.etiqueta}).`
      : kpis.precioMediana >= kpis.ticketMinimo * 0.75
        ? `La mediana queda ${mxn(Math.abs(kpis.brechaTicket))} (${pct(Math.abs(kpis.brechaTicketPct))}) por debajo del ticket mínimo: necesitas 2 ventas al mes o subir el segmento de la cartera.`
        : 'La mediana de la zona está muy por debajo del punto de equilibrio: esta estructura de costos no se sostiene con este inventario.',
  }));

  /* 3. Participación de mercado requerida — EL KPI QUE DECIDE */
  const pr = kpis.participacionRequeridaPct;
  const prFinita = Number.isFinite(pr);
  c.push(criterio({
    id: 'demanda',
    nombre: 'Participación de mercado requerida',
    valor: pr,
    valorTexto: prFinita
      ? `Necesitas ${kpis.ventasAnualesRequeridas.toFixed(1)} de las ${kpis.ventasAnualesZona.toFixed(0)} ventas/año de la zona = ${pct(pr)} del mercado`
      : 'Sin datos suficientes para calcular la participación requerida',
    umbral: `Verde ≤ ${u.participacionVerdePct}% | Rojo > ${u.participacionRojoPct}%`,
    peso: PESOS.demanda,
    estado: !prFinita ? 'rojo' : pr <= u.participacionVerdePct ? 'verde' : pr <= u.participacionRojoPct ? 'amarillo' : 'rojo',
    mensaje: !prFinita
      ? 'No se puede estimar demanda con la muestra actual.'
      : pr <= u.participacionVerdePct
        ? `Exigencia razonable: ${pct(pr)} del mercado de la zona te deja en equilibrio. Con ${kpis.competidores ?? 'varios'} competidores, es una tajada alcanzable.`
        : pr <= u.participacionRojoPct
          ? `Exigencia alta: para no perder dinero necesitas capturar ${pct(pr)} de todas las ventas del polígono. Es posible, pero es el supuesto más frágil del plan: cada competidor adicional te quita margen.`
          : `Exigencia inviable: ${pct(pr)} del mercado de la zona. Ninguna oficina nueva domina un tercio del mercado de su polígono en el año 1. Replantea: sube ticket mediano, baja costo fijo o cambia de zona.`,
  }));

  /* 4. Cobertura del costo con la CAPTACIÓN ASUMIDA.
   * Nota de diseño: este criterio evalúa el supuesto que escribió el usuario, no
   * la viabilidad estructural de la zona (esa la mide `demanda`). Por eso solo
   * llega a rojo cuando la zona además exige una participación fuera de rango:
   * si la participación requerida es alcanzable, el problema es el supuesto de
   * captación —se corrige ajustándolo— y eso es una condición, no un bloqueo. */
  const cobertura = kpis.coberturaPct;
  const zonaEstructuralmenteInviable = !Number.isFinite(pr) || pr > u.participacionRojoPct;
  let estadoCobertura;
  if (cobertura < 70 && zonaEstructuralmenteInviable) estadoCobertura = 'rojo';
  else if (cobertura < 100 || kpis.holguraParticipacionPct < 0) estadoCobertura = 'amarillo';
  else estadoCobertura = 'verde';

  const captacionNecesariaPct = Number.isFinite(pr) ? Math.max(pr, kpis.participacionMercadoPct) : null;

  c.push(criterio({
    id: 'cobertura',
    nombre: 'Cobertura del costo con la captación asumida',
    valor: cobertura,
    valorTexto: `Captación asumida ${pct(kpis.participacionMercadoPct)} de ${kpis.ventasAnualesZona.toFixed(0)} ventas/año → ${kpis.ventasMensualesOficina.toFixed(2)} ventas/mes → ${mxn(kpis.ingresoMensualEstimado)} vs. costo ${mxn(kpis.costoMensual)}`,
    umbral: '≥ 100% con holgura ≥ 0%',
    peso: PESOS.cobertura,
    estado: estadoCobertura,
    mensaje: estadoCobertura === 'verde'
      ? `Cubre el costo con margen de ${mxn(kpis.margenMensualEstimado)}/mes (${mxn(kpis.margenAnualEstimado)}/año).`
      : estadoCobertura === 'amarillo' && Number.isFinite(pr)
        ? `Con ${pct(kpis.participacionMercadoPct)} de captación faltan ${mxn(Math.abs(kpis.margenMensualEstimado))} al mes (cobertura ${pct(cobertura)}). El equilibrio pide ${pct(pr)} de captación${captacionNecesariaPct && captacionNecesariaPct > kpis.participacionMercadoPct ? `, es decir subir el supuesto de ${pct(kpis.participacionMercadoPct)} a ${pct(pr)}` : ''}. Si esa meta es alcanzable con tu equipo, la zona procede; si no, el problema es el tamaño de la operación, no el mercado.`
        : `Con la captación asumida la oficina pierde ${mxn(Math.abs(kpis.margenMensualEstimado))} al mes y la zona exige ${Number.isFinite(pr) ? pct(pr) : 'una participación no calculable'} del mercado: no hay ajuste de supuesto que salve este polígono.`,
  }));

  /* 5. Certeza jurídica */
  c.push(criterio({
    id: 'certeza',
    nombre: 'Certeza jurídica (% escriturado / RPP)',
    valor: kpis.certezaPct,
    valorTexto: `${pct(kpis.certezaPct)} de la muestra con estatus registral verificado`,
    umbral: `≥ ${u.certezaVerdePct}%`,
    peso: PESOS.certeza,
    estado: kpis.certezaPct >= u.certezaVerdePct ? 'verde' : kpis.certezaPct >= u.certezaAmarillaPct ? 'amarillo' : 'rojo',
    mensaje: kpis.certezaPct >= u.certezaVerdePct
      ? 'Zona con tenencia regular: operable con el filtro estándar de captación.'
      : kpis.certezaPct >= u.certezaAmarillaPct
        ? `Hay núcleos de irregularidad (${pct(100 - kpis.certezaPct)} sin acreditar): verificación registral individual antes de invertir en captación.`
        : `Riesgo registral alto: ${pct(100 - kpis.certezaPct)} de la muestra sin certeza. No se construye cartera con inventario no escriturable.`,
  }));

  /* 6. Competencia */
  const comp = kpis.competidores;
  let estadoComp = 'amarillo';
  let msgComp = 'Sin conteo de competencia. Cárgalo con DENUE (SCIAN 5311) para cerrar el criterio.';
  if (comp != null) {
    if (comp <= u.competidoresVerde) { estadoComp = 'verde'; msgComp = `${comp} oficinas/agencias en el radio de 1.5 km: hay espacio para una operación nueva. Confirma con recorrido físico.`; }
    else if (comp <= u.competidoresAmarillo) { estadoComp = 'amarillo'; msgComp = `${comp} competidores en 1.5 km: zona disputada. Compite con posicionamiento de marca y captación puerta a puerta, no con precio.`; }
    else { estadoComp = 'rojo'; msgComp = `${comp} competidores en 1.5 km: saturación. Exige un diferenciador verificable antes de abrir.`; }
  }
  c.push(criterio({
    id: 'competencia',
    nombre: 'Competencia en radio de 1.5 km',
    valor: comp,
    valorTexto: comp == null
      ? 'Sin dato capturado'
      : `${comp} inmobiliarias activas${kpis.ventasPorCompetidor ? ` | ${kpis.ventasPorCompetidor.toFixed(1)} ventas/año por competidor si todos comparten el mercado` : ''}`,
    umbral: `≤ ${u.competidoresVerde} verde | > ${u.competidoresAmarillo} rojo`,
    peso: PESOS.competencia, estado: estadoComp, mensaje: msgComp,
  }));

  /* 7. Trazabilidad */
  c.push(criterio({
    id: 'trazabilidad',
    nombre: 'Trazabilidad (fuente y URL por inmueble)',
    valor: kpis.trazabilidadPct,
    valorTexto: `${kpis.nConFuente} de ${kpis.nValidas} inmuebles válidos con URL`,
    umbral: `≥ ${u.trazabilidadMinPct}%`,
    peso: PESOS.trazabilidad,
    estado: kpis.trazabilidadPct >= u.trazabilidadMinPct ? 'verde' : kpis.trazabilidadPct >= 50 ? 'amarillo' : 'rojo',
    mensaje: kpis.trazabilidadPct >= u.trazabilidadMinPct
      ? 'Expediente auditable: cada precio se rastrea a su publicación.'
      : `${pct(100 - kpis.trazabilidadPct)} de la muestra sin URL. Un dictamen sin trazabilidad es una opinión, no un análisis.`,
  }));

  /* 8. Colchón de capital */
  c.push(criterio({
    id: 'colchon',
    nombre: 'Colchón de capital (meses financiados)',
    valor: kpis.colchonMeses,
    valorTexto: `${kpis.colchonMeses} meses a ${mxn(kpis.costoMensual)}/mes = ${mxn(kpis.colchonMeses * kpis.costoMensual)}`,
    umbral: '≥ 12 meses verde | ≤ 6 meses rojo',
    peso: PESOS.colchon,
    estado: kpis.colchonMeses >= 12 ? 'verde' : kpis.colchonMeses >= 6 ? 'amarillo' : 'rojo',
    mensaje: kpis.colchonMeses >= 12
      ? 'El colchón cubre el año completo de ramp-up del Plan Maestro.'
      : kpis.colchonMeses >= 6
        ? `Colchón corto: ${kpis.colchonMeses} meses. Con un ciclo de venta de 2–4 meses en CDMX, dos operaciones trabadas consumen el margen.`
        : `Colchón crítico: ${kpis.colchonMeses} mes(es). No se abre una oficina franquiciada sin al menos 6 meses de gasto fijo financiado.`,
  }));

  return c;
}

export function dictaminar(zona = {}, umbrales = UMBRALES_DEFAULT, escenarioId = 'buffer') {
  const kpis = computarKpis(zona, umbrales, escenarioId);
  const criterios = evaluarCriterios(kpis);

  const hayRojo = criterios.some((c) => c.estado === 'rojo');
  const ponderacionMax = criterios.reduce((s, c) => s + c.peso, 0);
  const puntaje = criterios.reduce(
    (s, c) => s + c.peso * (c.estado === 'verde' ? 1 : c.estado === 'amarillo' ? 0.5 : 0), 0
  ) / ponderacionMax;

  /* Regla de oro: no hay luz verde si el plan capturado pierde dinero. El verde
   * exige puntaje alto, muestra suficiente Y cobertura del costo ≥ 100%. */
  const planCubreCosto = kpis.coberturaPct >= 100;

  let semaforo;
  if (kpis.nValidas === 0) semaforo = SEMAFORO.sinDatos;
  else if (hayRojo) semaforo = SEMAFORO.rojo;
  else if (puntaje >= 0.85 && kpis.nValidas >= kpis.umbrales.muestraMinima && planCubreCosto) semaforo = SEMAFORO.verde;
  else semaforo = SEMAFORO.amarillo;

  const bloqueos = criterios.filter((c) => c.estado === 'rojo');
  const condiciones = criterios.filter((c) => c.estado === 'amarillo');

  const siguientes = [...bloqueos, ...condiciones]
    .map((c) => ({ criterio: c.nombre, accion: RUTA_VERIFICACION[c.id] || 'Documenta el dato con fuente oficial.' }));

  const orden = [...criterios].sort((a, b) => nivel(b.estado) - nivel(a.estado) || b.peso - a.peso);
  const titular = semaforo.id === 'sinDatos'
    ? 'Sin inmuebles capturados: no hay dictamen posible. Captura la muestra mínima de la zona.'
    : orden[0].estado === 'verde'
      ? `Zona operable: cubre ${mxn(kpis.costoMensual)}/mes necesitando ${pct(kpis.participacionRequeridaPct)} del mercado de la zona, con ticket mediano de ${mxn(kpis.precioMediana)}.`
      : `${orden[0].nombre}: ${orden[0].mensaje}`;

  return { kpis, criterios, semaforo, puntaje, bloqueos, condiciones, siguientes, titular };
}

/* ------------------------------ fusión ---------------------------------- */
/* Compara 2–3 zonas en paralelo. ADVERTENCIA: fusionar suma inventario de
 * muestra para mejorar la estimación estadística, pero NO multiplica la
 * capacidad de una sola oficina: la delimitación de 5,500 propiedades no se
 * modifica y cada oficina opera su propio polígono. */

export function fusionarZonas(zonas = [], umbrales = UMBRALES_DEFAULT, escenarioId = 'buffer') {
  const props = zonas.flatMap((z) => (Array.isArray(z.propiedades) ? z.propiedades : []));
  const merged = {
    nombre: `Fusión: ${zonas.map((z) => z.nombre || 'sin nombre').join(' + ')}`,
    comisionPct: zonas[0]?.comisionPct ?? MODELO.comisionEstandarPct,
    rotacionPct: mediana(zonas.map((z) => num(z.rotacionPct)).filter((v) => v > 0)) || MODELO.rotacionMinPct,
    participacionMercadoPct: zonas[0]?.participacionMercadoPct ?? SUPUESTOS.participacionMercadoAnio1Pct,
    competidoresNum: zonas.some((z) => z.competidoresNum != null && z.competidoresNum !== '')
      ? zonas.reduce((s, z) => s + num(z.competidoresNum), 0)
      : null,
    colchonMeses: Math.min(...zonas.map((z) => (z.colchonMeses == null || z.colchonMeses === '' ? SUPUESTOS.colchonMesesDefault : num(z.colchonMeses))).concat([SUPUESTOS.colchonMesesDefault])),
    propiedades: props,
  };
  const r = dictaminar(merged, umbrales, escenarioId);
  return {
    zona: merged,
    ...r,
    familias: zonas.map((z) => {
      const d = dictaminar(z, umbrales, escenarioId);
      return {
        id: z.id, nombre: z.nombre || 'Sin nombre',
        semaforo: d.semaforo, puntaje: d.puntaje,
        mediana: d.kpis.precioMediana, nValidas: d.kpis.nValidas,
        coberturaPct: d.kpis.coberturaPct, margenMensual: d.kpis.margenMensualEstimado,
        participacionRequeridaPct: d.kpis.participacionRequeridaPct,
      };
    }),
  };
}

/* -------------------------------- zonas -------------------------------- */

export function nuevaZona(parcial = {}) {
  return {
    id: parcial.id || `z${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`,
    nombre: '', alcaldia: '', colonia: '', cp: '', poligono: '',
    comisionPct: MODELO.comisionEstandarPct,
    rotacionPct: MODELO.rotacionMinPct,
    participacionMercadoPct: SUPUESTOS.participacionMercadoAnio1Pct,
    competidoresNum: '',
    colchonMeses: SUPUESTOS.colchonMesesDefault,
    certezaJuridicaPct: '',
    propiedades: [],
    notas: '',
    ...parcial,
  };
}

export function nuevaPropiedad(parcial = {}) {
  return {
    id: parcial.id || `p${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`,
    direccion: '', tipo: 'Departamento', precio: '', m2: '',
    estado: 'valido', escriturado: 'no_verificado',
    fuenteUrl: '', portal: '', fechaCaptura: new Date().toISOString().slice(0, 10),
    nota: '', ...parcial,
  };
}

export function validarZona(zona = {}) {
  const errores = [];
  if (!String(zona.nombre || '').trim()) errores.push('La zona necesita un nombre para el expediente.');
  if (!String(zona.colonia || '').trim() && !String(zona.cp || '').trim() && !String(zona.poligono || '').trim()) {
    errores.push('Captura colonia, código postal o polígono: sin delimitación geográfica no hay Fase 0.');
  }
  return errores;
}

/* Resumen exportable para pegar en el expediente. */
export function resumenTexto(zona, dict) {
  const k = dict.kpis;
  const L = [];
  L.push(`ANALISISZONATEC — ${zona.nombre || 'Zona sin nombre'}`);
  L.push(`Ubicación: ${[zona.colonia, zona.alcaldia, zona.cp].filter(Boolean).join(', ') || 'sin capturar'}`);
  L.push(`Escenario de costo: ${k.escenario.etiqueta} — ${mxn(k.costoMensual)}/mes`);
  L.push(`Muestra: ${k.nValidas} válidos de ${k.nCapturadas} capturados (${k.nExcluidas} excluidos)`);
  L.push(`Mediana: ${mxn(k.precioMediana)} | Comisión ${k.comisionPct}% = ${mxn(k.comisionMediana)}`);
  L.push(`Ticket mínimo: ${mxn(k.ticketMinimo)} → ${k.precioMediana >= k.ticketMinimo ? 'CUBRE' : 'NO CUBRE'}`);
  L.push(`Demanda de la zona: 5,500 × ${pct(k.rotacionPct)} = ${k.ventasAnualesZona.toFixed(0)} ventas/año (${k.ventasMensualesZona.toFixed(1)}/mes)`);
  L.push(`Captación asumida de la oficina: ${pct(k.participacionMercadoPct)} → ${k.ventasMensualesOficina.toFixed(2)} ventas/mes → ${mxn(k.ingresoMensualEstimado)} (cobertura ${pct(k.coberturaPct)})`);
  L.push(`Participación requerida para equilibrio: ${pct(k.participacionRequeridaPct)} del mercado de la zona`);
  L.push(`Margen mensual estimado: ${mxn(k.margenMensualEstimado)}`);
  L.push('');
  L.push(`DICTAMEN: ${dict.semaforo.icono} ${dict.semaforo.etiqueta} (puntaje ${(dict.puntaje * 100).toFixed(0)}/100)`);
  L.push(dict.titular);
  if (dict.bloqueos.length) {
    L.push(''); L.push('BLOQUEOS:');
    dict.bloqueos.forEach((b) => L.push(`  🔴 ${b.nombre}: ${b.valorTexto}`));
  }
  if (dict.condiciones.length) {
    L.push(''); L.push('CONDICIONES:');
    dict.condiciones.forEach((b) => L.push(`  🟡 ${b.nombre}: ${b.mensaje}`));
  }
  L.push(''); L.push('Fuentes: Inmuebles24, Propiedades.com, Lamudi (captura del usuario); DENUE INEGI; RPP CDMX; Catastro CDMX (SIG/OVICA); Índice SHF.');
  if (dict.kpis.participacionMercadoPct === SUPUESTOS.participacionMercadoAnio1Pct) {
    L.push(`⚠️ La captación de ${pct(SUPUESTOS.participacionMercadoAnio1Pct)} es un SUPUESTO de AnalisisZonaTec, no un dato del modelo base. Valídala con el franquiciador y con datos reales de la red.`);
  }
  return L.join('\n');
}
