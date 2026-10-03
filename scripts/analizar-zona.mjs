/* =============================================================================
 * Analizador de expedientes.
 * Lee un expediente JSON (formato que exporta/importa la app), ejecuta el motor
 * y escribe el anexo de datos en Markdown. También verifica que el informe
 * narrativo cite las cifras que realmente calculó el motor.
 *
 * Uso:
 *   node scripts/analizar-zona.mjs expedientes/san-bartolo-ameyalco.json
 *   node scripts/analizar-zona.mjs expedientes/san-bartolo-ameyalco.json --verificar docs/analisis-san-bartolo-ameyalco.md
 * ========================================================================== */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dictaminar, mxn, mxnCompacto, pct, mediana, promedio, num } from '../src/engine.js';
import { ESTADO_POR_ID, MODELO } from '../src/model.js';

const args = process.argv.slice(2);
const rutaExpediente = args[0] || 'expedientes/san-bartolo-ameyalco.json';
const idxVerificar = args.indexOf('--verificar');
const rutaInforme = idxVerificar >= 0 ? args[idxVerificar + 1] : null;

const exp = JSON.parse(readFileSync(rutaExpediente, 'utf8'));
const umbrales = exp.umbrales || undefined;
const escenario = exp.escenario || 'buffer';

/* Marcas con inventario publicado en el polígono, detectadas en la captura.
 * Es un PISO del conteo de competencia: no equivale al conteo DENUE de
 * oficinas físicas en 1.5 km, que queda pendiente. */
const MARCAS_DETECTADAS = [
  'Cattori Inmobiliaria', 'Pi Real Estate', 'VIBRA Bienes Raíces', 'MC&M Inmobiliaria',
  'Kobëh Bienes Raíces', 'DEGOHOUSE Inmobiliaria', 'Zona R&G Poniente', 'Norgui Inmobiliaria',
  'Diseñare Inmobiliaria', 'RBKasesora', 'Meroci Asesoras Inmobiliarias', 'Lomelin Hermanos Bienes Raíces',
  'Coldwell Banker B Real', 'PADS', 'Grupo EMCO Inmobiliaria', 'Neximo', 'IADMEXICO',
  'Círculo Bienes Raíces', 'Inmobiliaria ROME', 'Latitud Inmobiliaria', 'DIMA Real Estate Brokers',
  'PIAT Grupo Inmobiliario', 'My Own Space Inmobiliaria', 'Marca Inmobiliaria', 'Great Homes Rs',
  'AG NOR', 'Nocnok', 'Easy Rent & Sell', 'Avipar Innovación Inmobiliaria', 'Inmobiliaria Melo',
].filter(Boolean);

/* Segmentación por BANDA DE PRECIO: objetivo, reproducible y auditable.
 * (La lectura por calle confirma el mismo patrón, pero no depende de ella.) */
const BANDAS = [
  { id: 'casco', etiqueta: '≤ $8M — casco y mercado popular-medio', hasta: 8_000_000 },
  { id: 'medio', etiqueta: '$8M – $20M — medio-alto', hasta: 20_000_000 },
  { id: 'lujo', etiqueta: '> $20M — fraccionamientos y residencias de lujo', hasta: Infinity },
];
const segmentoDe = (p) => {
  const precio = num(p.precio);
  return (BANDAS.find((b) => precio > 0 && precio <= b.hasta) || BANDAS[BANDAS.length - 1]).etiqueta;
};

const lineas = [];
const L = (s = '') => lineas.push(s);

const resultados = [];

for (const zona of exp.zonas) {
  const dict = dictaminar(zona, umbrales, escenario);
  const k = dict.kpis;

  const validas = zona.propiedades.filter((p) => !ESTADO_POR_ID[p.estado]?.excluye);
  const excluidas = zona.propiedades.filter((p) => ESTADO_POR_ID[p.estado]?.excluye);

  /* Segmentación por submercado */
  const grupos = {};
  for (const p of validas) {
    const s = segmentoDe(p);
    (grupos[s] ||= []).push(p);
  }
  const segmentos = Object.entries(grupos).map(([nombre, props]) => {
    const precios = props.map((p) => num(p.precio)).filter((v) => v > 0);
    const m2s = props.filter((p) => num(p.m2) > 0).map((p) => num(p.precio) / num(p.m2));
    return {
      nombre, n: props.length,
      mediana: mediana(precios), promedio: promedio(precios),
      min: Math.min(...precios), max: Math.max(...precios),
      comision: (mediana(precios) * k.comisionPct) / 100,
      precioM2: mediana(m2s),
      ventasNecesarias: mediana(precios) > 0 ? (k.costoAnual / ((mediana(precios) * k.comisionPct) / 100)) : Infinity,
    };
  }).sort((a, b) => BANDAS.findIndex((x) => x.etiqueta === a.nombre) - BANDAS.findIndex((x) => x.etiqueta === b.nombre));

  /* Conteo de portales y cobertura de fuentes */
  const portales = {};
  for (const p of validas) portales[p.portal || 'Sin portal'] = (portales[p.portal || 'Sin portal'] || 0) + 1;

  const sinM2 = validas.filter((p) => !num(p.m2)).length;
  const sinDireccion = validas.filter((p) => /sin dirección/i.test(p.direccion)).length;

  /* ------------------------------- ANEXO ------------------------------- */
  L(`# Anexo de datos — ${zona.nombre}`);
  L('');
  L(`> **Generado automáticamente** por \`scripts/analizar-zona.mjs\` a partir de \`${rutaExpediente}\`.`);
  L(`> Fecha de captura de la muestra: ${validas[0]?.fechaCaptura || 'sin fecha'}. Escenario de costo: ${k.escenario.etiqueta} (${mxn(k.costoMensual)}/mes).`);
  L('');
  L('## 1. Delimitación');
  L('');
  L(`- **Alcaldía:** ${zona.alcaldia}`);
  L(`- **Colonia:** ${zona.colonia}`);
  L(`- **Código postal:** ${zona.cp}`);
  L(`- **Polígono:** ${zona.poligono}`);
  L('');
  L('## 2. Dictamen');
  L('');
  L(`**${dict.semaforo.icono} ${dict.semaforo.etiqueta}** — puntaje ponderado ${(dict.puntaje * 100).toFixed(0)}/100`);
  L('');
  L(`> ${dict.titular}`);
  L('');
  L('## 3. KPIs');
  L('');
  L('| KPI | Valor |');
  L('| --- | --- |');
  L(`| Muestra válida | ${k.nValidas} inmuebles (${k.nExcluidas} excluidos de ${k.nCapturadas}) |`);
  L(`| Mediana de precio | ${mxn(k.precioMediana)} |`);
  L(`| Promedio | ${mxn(k.precioPromedio)} |`);
  L(`| Rango P25 – P75 | ${mxn(k.precioP25)} – ${mxn(k.precioP75)} |`);
  L(`| Precio por m² (mediana) | ${k.precioM2Mediana ? mxn(k.precioM2Mediana) : 'sin datos suficientes'} |`);
  L(`| Dispersión (CV) | ${pct(k.coeficienteVariacion, 0)} |`);
  L(`| Comisión mediana (${k.comisionPct}%) | ${mxn(k.comisionMediana)} |`);
  L(`| Ticket mínimo requerido | ${mxn(k.ticketMinimo)} |`);
  L(`| Brecha vs. ticket mínimo | ${mxn(k.brechaTicket)} (${pct(k.brechaTicketPct, 0)}) |`);
  L(`| Demanda de la zona | 5,500 × ${pct(k.rotacionPct)} = ${k.ventasAnualesZona.toFixed(0)} ventas/año (${k.ventasMensualesZona.toFixed(1)}/mes) |`);
  L(`| Captación asumida | ${pct(k.participacionMercadoPct)} → ${k.ventasAnualesOficina.toFixed(2)} ventas/año (${k.ventasMensualesOficina.toFixed(2)}/mes) |`);
  L(`| Ingreso mensual estimado | ${mxn(k.ingresoMensualEstimado)} |`);
  L(`| Cobertura del costo | ${pct(k.coberturaPct, 0)} → margen ${mxn(k.margenMensualEstimado)}/mes |`);
  L(`| **Participación requerida** | **${Number.isFinite(k.participacionRequeridaPct) ? pct(k.participacionRequeridaPct) : 'no calculable'} del mercado de la zona** |`);
  L(`| Ventas/año para equilibrio | ${Number.isFinite(k.ventasAnualesRequeridas) ? k.ventasAnualesRequeridas.toFixed(2) : '∞'} |`);
  L(`| Certeza jurídica | ${k.certezaFuente === 'sin_medir' ? '**SIN MEDIR** (0 de ' + k.nValidas + ' verificados en RPP)' : pct(k.certezaPct, 0)} |`);
  L(`| Trazabilidad | ${pct(k.trazabilidadPct, 0)} (${k.nConFuente} de ${k.nValidas} con URL) |`);
  L(`| Competencia | ${k.competidores == null ? 'sin dato' : `${k.competidores} marcas con inventario publicado`} |`);
  L(`| Colchón de capital | ${k.colchonMeses} meses (${mxn(k.colchonMeses * k.costoMensual)}) |`);
  L('');
  L('## 4. Criterios del dictamen');
  L('');
  L('| Criterio | Estado | Valor medido | Umbral |');
  L('| --- | --- | --- | --- |');
  for (const c of dict.criterios) {
    L(`| ${c.nombre} | ${c.estado === 'verde' ? '🟢' : c.estado === 'amarillo' ? '🟡' : '🔴'} | ${c.valorTexto} | ${c.umbral} |`);
  }
  L('');
  if (dict.bloqueos.length) {
    L('### Bloqueos');
    L('');
    for (const b of dict.bloqueos) L(`- **${b.nombre}** — ${b.mensaje}`);
    L('');
  }
  if (dict.condiciones.length) {
    L('### Condiciones');
    L('');
    for (const b of dict.condiciones) L(`- **${b.nombre}** — ${b.mensaje}`);
    L('');
  }
  L('### Acciones de verificación pendientes');
  L('');
  for (const s of dict.siguientes) L(`- **${s.criterio}:** ${s.accion}`);
  L('');
  L('## 5. Segmentación del mercado capturado');
  L('');
  L('| Submercado | Inmuebles | Mediana | Promedio | Rango | Comisión mediana | Ventas/año para equilibrio |');
  L('| --- | --- | --- | --- | --- | --- | --- |');
  for (const s of segmentos) {
    L(`| ${s.nombre} | ${s.n} | ${mxn(s.mediana)} | ${mxn(s.promedio)} | ${mxnCompacto(s.min)} – ${mxnCompacto(s.max)} | ${mxn(s.comision)} | ${Number.isFinite(s.ventasNecesarias) ? s.ventasNecesarias.toFixed(1) : '—'} |`);
  }
  L('');
  L('## 6. Sensibilidad por rotación');
  L('');
  L('| Rotación anual | Ventas zona/año | Ventas zona/mes | Participación requerida | Ingreso oficina/mes | Cobertura | Margen/mes |');
  L('| --- | --- | --- | --- | --- | --- | --- |');
  for (const e of k.escalera) {
    L(`| ${pct(e.rotacionPct)} | ${e.ventasAnioZona.toFixed(0)} | ${e.ventasMesZona.toFixed(1)} | ${Number.isFinite(e.participacionRequeridaPct) ? pct(e.participacionRequeridaPct) : '—'} | ${mxn(e.ingresoMensual)} | ${pct(e.coberturaPct, 0)} | ${mxn(e.margenMensual)} |`);
  }
  L('');
  L('> La **participación requerida** del §3 se calcula con la comisión mediana del polígono completo. Si esa mediana está inflada por el segmento de lujo, la participación requerida aparece artificialmente baja: por eso el §5 segmenta por banda de precio. La **prueba de piso** es la participación requerida calculada con la mediana de la banda de menor precio (el mercado donde realmente va a operar una oficina nueva).');
  L('');
  L('## 7. Filtro aplicado a la muestra');
  L('');
  L(`Se excluyeron **${excluidas.length}** anuncios por las reglas del modelo:`);
  L('');
  if (Object.keys(k.motivosExclusion).length) {
    L('| Motivo | Anuncios |');
    L('| --- | --- |');
    for (const [m, n] of Object.entries(k.motivosExclusion)) L(`| ${m} | ${n} |`);
    L('');
  }
  excluidas.forEach((p) => L(`- ${ESTADO_POR_ID[p.estado]?.etiqueta || p.estado} — ${p.direccion}${p.precio ? ` · ${mxn(p.precio)}` : ''}. Fuente: ${p.fuenteUrl}`));
  L('');
  L('## 8. Composición de la muestra');
  L('');
  L('| Portal | Anuncios válidos |');
  L('| --- | --- |');
  for (const [p, n] of Object.entries(portales).sort((a, b) => b[1] - a[1])) L(`| ${p} | ${n} |`);
  L('');
  L(`- Anuncios sin superficie publicada: **${sinM2}** de ${k.nValidas}`);
  L(`- Anuncios sin dirección publicada: **${sinDireccion}** de ${k.nValidas}`);
  L(`- Dispersión de precios: coeficiente de variación de **${pct(k.coeficienteVariacion, 0)}** (por encima de 40% indica segmentos mezclados, y aquí es el caso)`);
  L('');
  L('## 9. Competencia detectada');
  L('');
  L(`**${MARCAS_DETECTADAS.length} marcas distintas** con inventario publicado en el polígono durante la captura:`);
  L('');
  MARCAS_DETECTADAS.forEach((m) => L(`- ${m}`));
  L('');
  L('> Este conteo es un **piso** del criterio "inmobiliarias activas en el radio de 1.5 km": cuenta marcas con inventario publicado, no oficinas físicas. El conteo exacto corresponde al DENUE (INEGI), filtro SCIAN 5311 sobre el polígono. Varias de estas marcas operan de forma virtual o desde Santa Fe / San Ángel, no dentro del polígono.');
  L('');
  L('## 10. Muestra completa');
  L('');
  L('| # | Dirección | Tipo | Precio | m² | $/m² | Estatus | Segmento | Fuente |');
  L('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  zona.propiedades.forEach((p, i) => {
    const excl = ESTADO_POR_ID[p.estado]?.excluye;
    const m2 = num(p.m2);
    const precio = num(p.precio);
    L(`| ${i + 1} | ${p.direccion || '—'} | ${p.tipo} | ${precio ? mxn(precio) : '—'} | ${m2 || '—'} | ${m2 && precio ? mxn(precio / m2) : '—'} | ${excl ? ESTADO_POR_ID[p.estado].etiqueta : '✅ Válida'} | ${excl ? '—' : segmentoDe(p)} | [${p.portal}](${p.fuenteUrl}) |`);
  });
  L('');
  L('---');
  L('');
  L('## Advertencias sobre estos datos');
  L('');
  L('1. **Los precios son de OFERTA, no de cierre.** En CDMX el cierre suele quedar por debajo del anuncio; aplica un descuento de negociación antes de decidir. La mediana de oferta sirve para comparar, no para prometer resultados.');
  L('2. **No se verificó ni un folio real.** Toda la columna de certeza jurídica está en "no verificado": la evidencia documental de la zona (DOF 18/11/1994) señala irregularidad sistémica, pero eso no sustituye la consulta registral inmueble por inmueble.');
  L('3. **La captura se hizo el 2026-10-02** desde resultados de búsqueda de portales. Los anuncios se dan de baja, cambian de precio o se duplican entre agencias; los duplicados detectados están marcados. Antes de invertir, re-verifica cada URL.');
  L('4. **El inventario de 5,500 propiedades no está verificado.** No existe un conteo público consultado en esta herramienta. Debe confirmarse descargando el padrón catastral de la alcaldía (SIG CDMX, CSV por alcaldía) y contando predios dentro de la poligonal.');
  L('');
  L(`_Modelo financiero v${MODELO.version} · importes en MXN · generado sin intervención manual de cifras._`);

  resultados.push({
    zona, dict, k, segmentos, validas, excluidas,
    salida: lineas.join('\n'),
  });
}

/* ------------------------------ salida ------------------------------ */
mkdirSync('docs', { recursive: true });
for (const r of resultados) {
  const slug = r.zona.id || 'zona';
  const archivo = `docs/anexo-datos-${slug}.md`;
  writeFileSync(archivo, r.salida, 'utf8');

  console.log(`\n═══ ${r.zona.nombre} ═══`);
  console.log(`${r.dict.semaforo.icono} ${r.dict.semaforo.etiqueta}  (puntaje ${(r.dict.puntaje * 100).toFixed(0)}/100)`);
  console.log(`Muestra: ${r.k.nValidas} válidos de ${r.k.nCapturadas} capturados (${r.k.nExcluidas} excluidos)`);
  console.log(`Mediana: ${mxn(r.k.precioMediana)} · comisión ${mxn(r.k.comisionMediana)} · ticket mínimo ${mxn(r.k.ticketMinimo)}`);
  console.log(`Participación requerida: ${Number.isFinite(r.k.participacionRequeridaPct) ? pct(r.k.participacionRequeridaPct) : '—'} · cobertura ${pct(r.k.coberturaPct, 0)} · margen ${mxn(r.k.margenMensualEstimado)}/mes`);
  console.log('Segmentos:');
  r.segmentos.forEach((s) => console.log(`  · ${s.nombre}: ${s.n} inmuebles · mediana ${mxn(s.mediana)} · comisión ${mxn(s.comision)} · ${Number.isFinite(s.ventasNecesarias) ? s.ventasNecesarias.toFixed(1) : '—'} ventas/año para equilibrio`));
  console.log(`\nAnexo escrito en ${archivo}`);
}

/* --------------------- verificación del informe --------------------- */
if (rutaInforme) {
  const informe = readFileSync(rutaInforme, 'utf8');
  const r = resultados[0];
  const esperadas = [
    mxn(r.k.precioMediana),
    String(r.k.nValidas),
    Number.isFinite(r.k.participacionRequeridaPct) ? pct(r.k.participacionRequeridaPct) : null,
    r.segmentos[0] ? mxn(r.segmentos[0].mediana) : null,
  ].filter(Boolean);

  let fallos = 0;
  for (const cifra of esperadas) {
    if (!informe.includes(cifra)) {
      console.error(`⚠️  El informe no cita la cifra calculada: ${cifra}`);
      fallos++;
    }
  }
  if (fallos) {
    console.error(`\n${fallos} cifra(s) del motor no aparecen en ${rutaInforme}. Actualiza el informe.`);
    process.exit(1);
  }
  console.log(`\n✅ ${rutaInforme} cita las cifras clave que calculó el motor.`);
}
