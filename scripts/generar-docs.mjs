/* =============================================================================
 * Generador de documentación.
 * Escribe docs/plan-maestro.md y docs/modelo-financiero.md A PARTIR del código
 * (src/plan.js, src/model.js, src/engine.js) para que la documentación y la
 * herramienta no se desincronicen.
 * Ejecutar: npm run docs
 * ========================================================================== */

import { writeFileSync, mkdirSync } from 'node:fs';
import { FASES, DERIVADAS, REGLAS_DURAS } from '../src/plan.js';
import { MODELO, SUPUESTOS, UMBRALES_DEFAULT } from '../src/model.js';
import { mxn, computarKpis } from '../src/engine.js';
import { FUENTES } from '../src/fuentes.js';

mkdirSync('docs', { recursive: true });

/* Escapa el pipe para que no rompa las tablas de Markdown. */
const cel = (v) => String(v ?? '—').replace(/\|/g, '\\|');

/* ---------------------------- Plan maestro ------------------------------ */
const L = [];
L.push('# Plan Maestro de 12 Meses — Apertura de oficina franquiciada');
L.push('');
L.push('> **Documento generado automáticamente** desde `src/plan.js` por `npm run docs`.');
L.push('> No editar a mano: cualquier cambio se hace en el código y se regenera.');
L.push('');
L.push('Las cifras marcadas `SP2` provienen del modelo de apertura del franquiciatario. Las marcadas `SP1`');
L.push('son **supuestos operativos propuestos por AnalisisZonaTec** (metas de diseño, no datos observados ni');
L.push('documentación oficial de TECNOCASA) y son editables.');
L.push('');
L.push('---');
L.push('');

for (const f of FASES) {
  const num = f.id.replace('f', '');
  L.push(`## Fase ${num} — ${f.nombre}`);
  L.push('');
  L.push(`**Periodo:** ${f.periodo}`);
  L.push('');
  L.push(`**Objetivo:** ${f.objetivo.replace(/^\[SP[12]\]\s*/, '')}`);
  L.push('');
  L.push('### Acciones');
  L.push('');
  L.push('| # | Acción | Responsable | Origen |');
  L.push('| --- | --- | --- | --- |');
  f.acciones.forEach((a, i) => {
    const origen = a.texto.startsWith('[SP2]') ? 'SP2' : 'SP1';
    L.push(`| ${i + 1} | ${cel(a.texto.replace(/^\[SP[12]\]\s*/, ''))} | ${cel(a.responsable || '—')} | ${origen} |`);
  });
  L.push('');
  L.push('### KPIs de la fase');
  L.push('');
  L.push('| KPI | Cómo se calcula | Umbral | Fuente | Origen |');
  L.push('| --- | --- | --- | --- | --- |');
  for (const k of f.kpis) {
    L.push(`| **${cel(k.nombre)}** | ${cel(k.formula)} | ${cel(k.umbral)} | ${cel(k.fuente)} | ${k.origen} |`);
  }
  L.push('');
  L.push(`**Entregable:** ${f.entregable}`);
  L.push('');
  L.push('### Alertas de riesgo');
  L.push('');
  f.alertasCriticas.forEach((a) => L.push(`- ⚠️ ${a}`));
  L.push('');
  L.push('---');
  L.push('');
}

L.push('## Cifras derivadas del modelo');
L.push('');
L.push('| Concepto | Valor | Trazabilidad |');
L.push('| --- | --- | --- |');
DERIVADAS.forEach((d) => L.push(`| ${cel(d.concepto)} | **${cel(d.valor)}** | ${cel(d.nota)} |`));
L.push('');
L.push('## Reglas duras de operación');
L.push('');
REGLAS_DURAS.forEach((r) => L.push(`- ${r.texto.replace(/^\[SP[12]\]\s*/, '')} — *${r.origen}*`));
L.push('');
L.push('## Supuestos declarados');
L.push('');
L.push('| Supuesto | Valor por defecto | Por qué existe |');
L.push('| --- | --- | --- |');
L.push(`| Captación de la oficina en el año 1 | ${SUPUESTOS.participacionMercadoAnio1Pct}% de las ventas del polígono | El modelo base estima las ventas de la zona, pero no define qué fracción captura una oficina nueva. Sin esta variable, cualquier zona con precios de mercado saldría viable. |`);
L.push(`| Colchón de capital | ${SUPUESTOS.colchonMesesDefault} meses | Meses de costo operativo que el franquiciatario puede financiar sin ingreso. |`);
L.push(`| Ciclo de venta | ${SUPUESTOS.diasCicloVenta} días | Referencia operativa para dimensionar la paciencia del colchón. |`);
L.push('');
L.push(`> ${SUPUESTOS.nota}`);
L.push('');
writeFileSync('docs/plan-maestro.md', L.join('\n'), 'utf8');

/* ------------------------- Modelo financiero ---------------------------- */
const M = [];
M.push('# Modelo Financiero Base (INMUTABLE)');
M.push('');
M.push('> Generado automáticamente desde `src/model.js` por `npm run docs`.');
M.push('');
M.push(`**Versión del modelo:** ${MODELO.version} · **Moneda:** ${MODELO.moneda}`);
M.push('');
M.push('## Costo operativo mensual');
M.push('');
M.push('| Concepto | Mínimo | Máximo |');
M.push('| --- | --- | --- |');
MODELO.desgloseBase.forEach((d) => M.push(`| ${cel(d.concepto)} | ${mxn(d.min)} | ${mxn(d.max)} |`));
M.push(`| **Suma del desglose** | **${mxn(MODELO.desgloseBase.reduce((s, d) => s + d.min, 0))}** | **${mxn(MODELO.desgloseBase.reduce((s, d) => s + d.max, 0))}** |`);
M.push('');
M.push('| Escenario | Costo mensual | Ticket mínimo al 6% para cubrirlo con 1 venta |');
M.push('| --- | --- | --- |');
M.push(`| Base | ${mxn(MODELO.costoBaseMensual)} | ${mxn(MODELO.costoBaseMensual / (MODELO.comisionEstandarPct / 100))} |`);
M.push(`| Con buffer (+${MODELO.colchonPct * 100}%) | ${mxn(MODELO.costoRealConBuffer)} | ${mxn(MODELO.ticketMinBuffer)} |`);
M.push(`| Conservador alto | ${mxn(MODELO.costoEscenarioAlto)} | ${mxn(MODELO.costoEscenarioAlto / (MODELO.comisionEstandarPct / 100))} |`);
M.push('');
M.push('## Consistencia interna del desglose');
M.push('');
const sumaMin = MODELO.desgloseBase.reduce((s, d) => s + d.min, 0);
const sumaMax = MODELO.desgloseBase.reduce((s, d) => s + d.max, 0);
M.push(`- Suma de los mínimos del desglose: **${mxn(sumaMin)}**`);
M.push(`- Suma de los máximos del desglose: **${mxn(sumaMax)}**`);
M.push(`- Costo base declarado por el modelo: **${mxn(MODELO.costoBaseMensual)}** (dentro del rango ${mxn(sumaMin)}–${mxn(sumaMax)})`);
M.push('');
M.push(`> **Observación de AnalisisZonaTec:** el desglose no suma exactamente ${mxn(MODELO.costoBaseMensual)}; los conceptos`);
M.push(`> se comportan como rangos y el costo base queda en un punto medio. Consecuencia práctica: si varios`);
M.push(`> conceptos se van simultáneamente a su máximo, el costo mensual alcanza ${mxn(sumaMax)}, que es **${mxn(sumaMax - MODELO.costoRealConBuffer)} mayor** que el escenario con buffer (${mxn(MODELO.costoRealConBuffer)}).`);
M.push(`> Por eso el techo de planeación debe ser el escenario conservador alto (${mxn(MODELO.costoEscenarioAlto)}), no el buffer.`);
M.push('');
M.push('## Parámetros de operación');
M.push('');
M.push(`- Comisión estándar: **${MODELO.comisionEstandarPct}%** del precio de venta (vendedor, comprador o split 3%+3%).`);
M.push(`- Delimitación territorial: **${MODELO.propiedadesPorOficina.toLocaleString('es-MX')} propiedades por oficina** (no modificable).`);
M.push(`- Rango de rotación urbana CDMX: **${MODELO.rotacionMinPct}% – ${MODELO.rotacionMaxPct}%** anual.`);
M.push('');
M.push('## Aritmética verificable');
M.push('');
M.push('| Concepto | Valor | Cómo se obtiene |');
M.push('| --- | --- | --- |');
DERIVADAS.forEach((d) => M.push(`| ${cel(d.concepto)} | **${cel(d.valor)}** | ${cel(d.nota)} |`));
M.push('');
M.push('## Umbrales del dictamen (criterio propuesto, editable)');
M.push('');
M.push('> Estos umbrales **no** provienen del modelo del franquiciatario ni de documentación oficial de');
M.push('> TECNOCASA: son el criterio con el que AnalisisZonaTec traduce números a semáforo. Deben validarse');
M.push('> con el franquiciador antes de usarse como regla contractual.');
M.push('');
M.push('| Umbral | Valor |');
M.push('| --- | --- |');
Object.entries(UMBRALES_DEFAULT).forEach(([k, v]) => M.push(`| ${k} | ${v} |`));
M.push('');
M.push('## Ejemplo de verificación manual');
M.push('');
const demo = computarKpis({
  comisionPct: MODELO.comisionEstandarPct, rotacionPct: MODELO.rotacionMinPct,
  participacionMercadoPct: SUPUESTOS.participacionMercadoAnio1Pct, competidoresNum: 8, colchonMeses: 12,
  propiedades: Array.from({ length: 20 }, (_, i) => ({ estado: 'valido', escriturado: 'si', fuenteUrl: 'x', precio: 2_400_000 + i * 50_000 })),
});
M.push('Con 20 inmuebles válidos cuya mediana de precio es `$2,400,000`, comisión 6%, rotación 1.5% y una captación asumida de 10%:');
M.push('');
M.push(`- Comisión mediana: ${mxn(demo.comisionMediana)}`);
M.push(`- Ventas de la zona: 5,500 × 1.5% = ${demo.ventasAnualesZona.toFixed(0)} al año (${demo.ventasMensualesZona.toFixed(1)} al mes)`);
M.push(`- Ventas de la oficina: ${demo.ventasAnualesOficina.toFixed(2)} al año · ingreso ${mxn(demo.ingresoMensualEstimado)}/mes`);
M.push(`- Costo del escenario con buffer: ${mxn(demo.costoMensual)}/mes → cobertura ${demo.coberturaPct.toFixed(1)}% · margen ${mxn(demo.margenMensualEstimado)}`);
M.push(`- Ventas requeridas para equilibrio: ${demo.ventasAnualesRequeridas.toFixed(2)} al año → participación requerida ${demo.participacionRequeridaPct.toFixed(1)}% del mercado de la zona`);
M.push('');
M.push('Estas cifras se pueden reproducir a mano y están cubiertas por las pruebas automatizadas (`npm test`).');
M.push('');
writeFileSync('docs/modelo-financiero.md', M.join('\n'), 'utf8');

/* --------------------------- Fuentes (índice) --------------------------- */
const F = [];
F.push('# Índice de fuentes de verificación');
F.push('');
F.push('> Generado automáticamente desde `src/fuentes.js` por `npm run docs`.');
F.push('');
F.push('| Fuente | Tipo | Uso | URL | Verificada |');
F.push('| --- | --- | --- | --- | --- |');
FUENTES.forEach((f) => F.push(`| **${cel(f.nombre)}** | ${cel(f.tipo)} | ${cel(f.uso)} | ${f.url ? `<${f.url}>` : '—'} | ${f.verificada ? 'sí' : '**no**'} |`));
F.push('');
F.push('## Notas por fuente');
F.push('');
FUENTES.forEach((f) => {
  F.push(`### ${f.nombre}`);
  F.push('');
  F.push(f.uso);
  F.push('');
  F.push(`**Nota:** ${f.nota}`);
  F.push('');
});
writeFileSync('docs/fuentes.md', F.join('\n'), 'utf8');

console.log('Documentación generada:');
console.log('  · docs/plan-maestro.md');
console.log('  · docs/modelo-financiero.md');
console.log('  · docs/fuentes.md');
