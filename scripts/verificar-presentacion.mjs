/* =============================================================================
 * Auditoría de la presentación: comprueba que cada cifra citada en
 * `docs/presentacion-san-bartolo-ameyalco.html` coincide EXACTAMENTE con lo que
 * calcula el motor sobre el expediente. Si alguien toca el expediente o el
 * motor y la presentación queda vieja, esta prueba truena.
 *
 * Sin dependencias. Ejecutar: node scripts/verificar-presentacion.mjs
 * ========================================================================== */

import { readFileSync } from 'node:fs';
import { dictaminar, mxn, mediana } from '../src/engine.js';

const RUTA_DECK = 'docs/presentacion-san-bartolo-ameyalco.html';
const RUTA_EXPEDIENTE = 'expedientes/san-bartolo-ameyalco.json';

const deck = readFileSync(RUTA_DECK, 'utf8');
const exp = JSON.parse(readFileSync(RUTA_EXPEDIENTE, 'utf8'));
const zona = exp.zonas[0];
const d = dictaminar(zona, exp.umbrales, exp.escenario);
const k = d.kpis;

/* Segmentación por banda, con el mismo corte del analizador. */
const validas = zona.propiedades.filter((p) => p.estado === 'valido');
const banda = (filtro) => {
  const ps = validas.filter(filtro);
  const md = mediana(ps.map((p) => p.precio));
  const comision = md * (k.comisionPct / 100);
  const requeridas = k.costoAnual / comision;
  const ingreso = ((k.ventasAnualesZona * k.participacionMercadoPct) / 100 / 12) * comision;
  return { n: ps.length, md, comision, requeridas, ingreso, margen: ingreso - k.costoMensual };
};
const casco = banda((p) => p.precio <= 8_000_000);
const medio = banda((p) => p.precio > 8_000_000 && p.precio <= 20_000_000);
const lujo = banda((p) => p.precio > 20_000_000);
const margenMezcla = (((casco.comision + medio.comision) / 2) * ((k.ventasAnualesZona * k.participacionMercadoPct) / 100 / 12)) - k.costoMensual;

const esperadas = [
  ['semáforo', 'VIABLE CON CONDICIONES'],
  ['puntaje', String((d.puntaje * 100).toFixed(0))],
  ['inmuebles capturados', String(k.nCapturadas)],
  ['inmuebles válidos', String(k.nValidas)],
  ['mediana', mxn(k.precioMediana)],
  ['promedio', mxn(k.precioPromedio)],
  ['P25', mxn(k.precioP25)],
  ['P75', mxn(k.precioP75)],
  ['precio por m²', mxn(k.precioM2Mediana)],
  ['comisión mediana', mxn(k.comisionMediana)],
  ['cobertura', `${k.coberturaPct.toFixed(0)}%`],
  ['margen mensual', mxn(k.margenMensualEstimado)],
  ['participación requerida', `${k.participacionRequeridaPct.toFixed(1)}%`],
  ['ventas/año de la zona', `${k.ventasAnualesZona.toFixed(0)} ventas/año`],
  ['ventas/año para equilibrio', k.ventasAnualesRequeridas.toFixed(2)],
  ['ventas/año de la oficina', k.ventasAnualesOficina.toFixed(2)],
  ['trazabilidad', `${k.nConFuente} de ${k.nValidas}`],
  ['competidores (piso)', String(k.competidores)],
  ['ventas por marca', k.ventasPorCompetidor.toFixed(2)],
  ['folios verificados', `0 de ${k.nValidas}`],
  ['costo anual', mxn(k.costoAnual)],
  ['ticket mínimo', mxn(k.ticketMinimo)],
  ['costo con buffer', mxn(k.costoMensual)],
  ['banda casco · n', String(casco.n)],
  ['banda casco · mediana', mxn(casco.md)],
  ['banda casco · margen', mxn(casco.margen)],
  ['banda media · mediana', mxn(medio.md)],
  ['banda media · margen', mxn(medio.margen)],
  ['banda lujo · mediana', mxn(lujo.md)],
  ['banda lujo · margen', mxn(lujo.margen)],
  ['margen mezcla 50/50', mxn(margenMezcla)],
  ['sensibilidad 1.5%', mxn(k.escalera[0].margenMensual)],
  ['sensibilidad 2.25%', mxn(k.escalera[1].margenMensual)],
  ['sensibilidad 3%', mxn(k.escalera[2].margenMensual)],
  ['sensibilidad 2.25% · PR', `${k.escalera[1].participacionRequeridaPct.toFixed(1)}%`],
  ['duplicados excluidos', String(k.motivosExclusion['Duplicado de otra publicación'])],
  ['remates excluidos', String(k.motivosExclusion.Remate)],
  ['cesiones excluidas', String(k.motivosExclusion['Cesión de derechos'])],
];

let fallos = 0;
for (const [nombre, texto] of esperadas) {
  if (!deck.includes(String(texto))) {
    console.error(`  ❌ ${nombre}: la presentación no cita "${texto}"`);
    fallos++;
  }
}

if (fallos) {
  console.error(`\n  ${fallos} cifra(s) desalineadas entre ${RUTA_DECK} y el motor.`);
  process.exit(1);
}
console.log(`  ${esperadas.length} cifras de la presentación OK, 0 desalineadas`);
