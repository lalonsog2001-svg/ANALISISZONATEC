/* Pruebas del motor. Ejecutar: npm test  (o: node tests/engine.test.mjs) */
import {
  computarKpis, dictaminar, fusionarZonas, mediana, percentil, promedio,
  nuevaZona, nuevaPropiedad, resumenTexto, mxn,
} from '../src/engine.js';
import { MODELO, SUPUESTOS } from '../src/model.js';
import { parsearLinea, parsearLote, portalDe } from '../src/parser.js';

let ok = 0, fail = 0;
const cerca = (a, b, tol = 0.01) => Math.abs(a - b) <= tol;

function t(nombre, fn) {
  try {
    fn();
    ok++;
    console.log(`  ✅ ${nombre}`);
  } catch (e) {
    fail++;
    console.log(`  ❌ ${nombre}\n     ${e.message}`);
  }
}
const eq = (a, b, m) => { if (a !== b) throw new Error(`${m || ''} esperado ${b}, obtenido ${a}`); };
const aprox = (a, b, tol = 0.01, m) => { if (!cerca(a, b, tol)) throw new Error(`${m || ''} esperado ≈${b}, obtenido ${a}`); };
const es = (a, ...v) => { if (!v.includes(a)) throw new Error(`esperado uno de [${v}], obtenido ${a}`); };

console.log('\n── 1. Modelo financiero inmutable ──');

t('Costo con buffer = base × 1.20', () => aprox(MODELO.costoBaseMensual * 1.2, MODELO.costoRealConBuffer));
t('Ticket mínimo con buffer = 144,000 ÷ 6%', () => aprox(MODELO.costoRealConBuffer / 0.06, MODELO.ticketMinBuffer));
t('Ticket mínimo escenario alto = 160,000 ÷ 6%', () => aprox(MODELO.costoEscenarioAlto / 0.06, MODELO.ticketMinAlto, 1));
t('Delimitación territorial = 5,500 propiedades', () => eq(MODELO.propiedadesPorOficina, 5500));
t('Comisión estándar = 6%', () => eq(MODELO.comisionEstandarPct, 6));
t('Desglose base suma dentro del rango 120k', () => {
  const min = MODELO.desgloseBase.reduce((s, d) => s + d.min, 0);
  const max = MODELO.desgloseBase.reduce((s, d) => s + d.max, 0);
  if (min > MODELO.costoBaseMensual || max < MODELO.costoBaseMensual) {
    throw new Error(`el desglose [${min}, ${max}] no contiene ${MODELO.costoBaseMensual}`);
  }
});

console.log('\n── 2. Estadística ──');

t('mediana de arreglo impar', () => eq(mediana([3, 1, 2]), 2));
t('mediana de arreglo par', () => eq(mediana([1, 2, 3, 4]), 2.5));
t('mediana ignora valores no numéricos', () => eq(mediana([1, 'x', 3, null, 5]), 3));
t('promedio simple', () => aprox(promedio([1, 2, 3, 4]), 2.5));
t('percentil 25', () => aprox(percentil([1, 2, 3, 4, 5], 25), 2));
t('percentil de arreglo vacío = 0', () => eq(percentil([], 50), 0));
t('mediana de arreglo vacío = 0', () => eq(mediana([]), 0));

console.log('\n── 3. KPIs de la muestra ──');

/* Dataset controlado: 24 válidos (2.0M a 4.3M cada 100k) + 1 excluido. */
const preciosControl = Array.from({ length: 24 }, (_, i) => 2_000_000 + i * 100_000);
const propsControl = [
  ...preciosControl.map((p) => nuevaPropiedad({ precio: p, estado: 'valido', escriturado: 'si', fuenteUrl: 'https://www.inmuebles24.com/x' })),
  nuevaPropiedad({ precio: 9_999_999, estado: 'remate' }),
];

const zonaA = nuevaZona({
  nombre: 'Zona A', colonia: 'Del Valle', alcaldia: 'Benjamín Juárez', cp: '03100',
  rotacionPct: 1.5, participacionMercadoPct: 10, competidoresNum: 6, colchonMeses: 12,
  propiedades: propsControl,
});

const kA = computarKpis(zonaA);
t('excluye remates de la muestra', () => { eq(kA.nCapturadas, 25); eq(kA.nValidas, 24); eq(kA.nExcluidas, 1); });
t('cuenta motivos de exclusión', () => eq(kA.motivosExclusion.Remate, 1));
t('mediana de precios = 3.15M', () => aprox(kA.precioMediana, 3_150_000));
t('promedio = 3.15M (serie simétrica)', () => aprox(kA.precioPromedio, 3_150_000));
t('P25 y P75 correctos', () => { aprox(kA.precioP25, 2_575_000); aprox(kA.precioP75, 3_725_000); });
t('comisión mediana = 6% de 3.15M', () => aprox(kA.comisionMediana, 189_000));
t('ticket mínimo con buffer = 2.4M', () => aprox(kA.ticketMinimo, 2_400_000));
t('brecha vs ticket mínimo = +750k', () => aprox(kA.brechaTicket, 750_000));
t('ventas de la zona = 5,500 × 1.5% = 82.5/año', () => aprox(kA.ventasAnualesZona, 82.5));
t('captación 10% → 8.25 ventas/año oficina', () => aprox(kA.ventasAnualesOficina, 8.25));
t('ingreso mensual = 8.25/12 × 189,000', () => aprox(kA.ingresoMensualEstimado, 8.25 / 12 * 189_000));
t('cobertura = ingreso ÷ 144,000', () => aprox(kA.coberturaPct, (8.25 / 12 * 189_000) / 144_000 * 100));
t('participación requerida = 9.14/82.5', () => aprox(kA.participacionRequeridaPct, (1_728_000 / 189_000) / 82.5 * 100, 0.05));
t('certeza jurídica = 100%', () => aprox(kA.certezaPct, 100));
t('trazabilidad = 100%', () => aprox(kA.trazabilidadPct, 100));
t('precio por m² = 0 si no se capturó superficie', () => eq(kA.precioM2Mediana, 0));

t('trazabilidad parcial detecta inmuebles sin URL', () => {
  const z = nuevaZona({
    propiedades: preciosControl.map((p, i) => nuevaPropiedad({
      precio: p, fuenteUrl: i < 12 ? 'https://propiedades.com/x' : '',
    })),
  });
  aprox(computarKpis(z).trazabilidadPct, 50);
});

t('el escenario alto sube el ticket mínimo a 2,666,667', () => {
  aprox(computarKpis(zonaA, undefined, 'alto').ticketMinimo, 2_666_667, 1);
});

console.log('\n── 4. Dictamen y semáforo ──');

const dA = dictaminar(zonaA);
t('zona A: muestra de 24 = amarillo (por debajo de 30)', () => es(dA.criterios.find((c) => c.id === 'muestra').estado, 'amarillo'));
t('zona A: ticket verde (3.15M ≥ 2.4M)', () => es(dA.criterios.find((c) => c.id === 'ticket').estado, 'verde'));
t('zona A: participación requerida 11% = verde', () => es(dA.criterios.find((c) => c.id === 'demanda').estado, 'verde'));
t('zona A: cobertura 90% = amarillo', () => es(dA.criterios.find((c) => c.id === 'cobertura').estado, 'amarillo'));
t('zona A: dictamen final amarillo', () => es(dA.semaforo.id, 'amarillo'));
t('zona A: sin bloqueos rojos', () => eq(dA.bloqueos.length, 0));
t('zona A: hay condiciones por resolver', () => { if (dA.condiciones.length < 1) throw new Error('sin condiciones'); });
t('zona A: holgura de participación negativa (faltante)', () => { if (dA.kpis.holguraParticipacionPct >= 0) throw new Error('debería faltar captación'); });

/* Zona B: 40 válidos, todo en orden, rotación 2.25%, captación 12% → verde */
const propsB = Array.from({ length: 40 }, () =>
  nuevaPropiedad({ precio: 3_200_000, m2: 100, estado: 'valido', escriturado: 'si', fuenteUrl: 'https://www.inmuebles24.com/y' }));
const zonaB = nuevaZona({
  nombre: 'Zona B', colonia: 'Narvarte', rotacionPct: 2.25, participacionMercadoPct: 12,
  competidoresNum: 5, colchonMeses: 12, propiedades: propsB,
});
const dB = dictaminar(zonaB);
t('zona B: comisión mediana = 192,000', () => aprox(dB.kpis.comisionMediana, 192_000));
t('zona B: ventas de la zona = 123.75/año', () => aprox(dB.kpis.ventasAnualesZona, 123.75));
t('zona B: cobertura = 165%', () => aprox(dB.kpis.coberturaPct, 165));
t('zona B: participación requerida = 7.27%', () => aprox(dB.kpis.participacionRequeridaPct, 9 / 123.75 * 100, 0.05));
t('zona B: margen mensual = 93,600', () => aprox(dB.kpis.margenMensualEstimado, 93_600));
t('zona B: dictamen VERDE', () => es(dB.semaforo.id, 'verde'));
t('zona B: precio por m² = 32,000', () => aprox(dB.kpis.precioM2Mediana, 32_000));

/* Zona C: ticket bajo, saturación, irregularidad, colchón corto → rojo */
const propsC = Array.from({ length: 25 }, (_, i) =>
  nuevaPropiedad({
    precio: 1_500_000 + (i % 5) * 20_000, estado: 'valido',
    escriturado: i < 10 ? 'si' : 'no', fuenteUrl: '',
  }));
const zonaC = nuevaZona({
  nombre: 'Zona C', colonia: 'Zona marginal', rotacionPct: 1.5, participacionMercadoPct: 10,
  competidoresNum: 20, colchonMeses: 4, propiedades: propsC,
});
const dC = dictaminar(zonaC);
t('zona C: ticket rojo', () => es(dC.criterios.find((c) => c.id === 'ticket').estado, 'rojo'));
t('zona C: certeza 40% roja', () => es(dC.criterios.find((c) => c.id === 'certeza').estado, 'rojo'));
t('zona C: 20 competidores = rojo', () => es(dC.criterios.find((c) => c.id === 'competencia').estado, 'rojo'));
t('zona C: colchón de 4 meses = rojo', () => es(dC.criterios.find((c) => c.id === 'colchon').estado, 'rojo'));
t('zona C: dictamen ROJO', () => es(dC.semaforo.id, 'rojo'));
t('zona C: reporta bloqueos con acción de verificación', () => {
  if (dC.bloqueos.length < 3) throw new Error(`esperados ≥3 bloqueos, hay ${dC.bloqueos.length}`);
  if (!dC.siguientes.every((s) => s.accion && s.accion.length > 20)) throw new Error('acciones vacías');
});

/* Zona vacía */
t('zona sin inmuebles = sin dictamen (⚪)', () => es(dictaminar(nuevaZona({ nombre: 'Vacía' })).semaforo.id, 'sinDatos'));

/* El semáforo reacciona al escenario de costo */
t('la misma zona empeora al pasar al escenario alto', () => {
  const z = nuevaZona({ nombre: 'X', rotacionPct: 1.5, participacionMercadoPct: 10,
    propiedades: preciosControl.map((p) => nuevaPropiedad({ precio: p, fuenteUrl: 'https://x.com' })) });
  const buffer = dictaminar(z, undefined, 'buffer');
  const alto = dictaminar(z, undefined, 'alto');
  if (alto.kpis.coberturaPct >= buffer.kpis.coberturaPct) throw new Error('la cobertura no bajó');
  if (alto.kpis.ticketMinimo <= buffer.kpis.ticketMinimo) throw new Error('el ticket mínimo no subió');
});

console.log('\n── 5. Fusionar zonas (comparación 2–3) ──');

const fus = fusionarZonas([zonaA, zonaB]);
t('fusión suma la muestra de las zonas', () => eq(fus.kpis.nValidas, 64));
t('fusión suma competidores', () => eq(fus.kpis.competidores, 11));
t('fusión devuelve lectura individual por zona', () => {
  eq(fus.familias.length, 2);
  eq(fus.familias[0].nombre, 'Zona A');
  es(fus.familias[1].semaforo.id, 'verde');
});
t('fusión promedia la rotación de las zonas', () => aprox(fus.kpis.rotacionPct, 1.875));

console.log('\n── 5b. Reglas de decisión del semáforo ──');

/* Si la zona es estructuralmente viable pero el supuesto de captación es muy
 * bajo, el problema es el supuesto: condición 🟡, no bloqueo 🔴. */
const zonaSupuestoBajo = nuevaZona({
  nombre: 'Supuesto bajo', rotacionPct: 2.25, participacionMercadoPct: 1,
  competidoresNum: 5, colchonMeses: 12, propiedades: propsB,
});
const dSup = dictaminar(zonaSupuestoBajo);
t('captación asumida muy baja = amarillo, no rojo', () => {
  es(dSup.criterios.find((c) => c.id === 'cobertura').estado, 'amarillo');
  es(dSup.semaforo.id, 'amarillo');
});
t('el mensaje indica cuánto subir la captación asumida', () => {
  const msg = dSup.criterios.find((c) => c.id === 'cobertura').mensaje;
  if (!msg.includes('subir el supuesto')) throw new Error(`mensaje: ${msg}`);
});
t('no hay luz verde si el plan asumido pierde dinero', () => {
  if (dSup.kpis.coberturaPct >= 100) throw new Error('setup: debería perder dinero');
  if (dSup.puntaje < 0.85) throw new Error('setup: el puntaje debería ser alto');
  if (dSup.semaforo.id === 'verde') throw new Error('otorgó verde con cobertura < 100%');
});
t('zona B sí recibe verde porque su captación cubre el costo', () => {
  es(dB.semaforo.id, 'verde');
  if (dB.kpis.coberturaPct < 100) throw new Error('setup: debería cubrir');
});

/* Zona con mercado demasiado chico: participación requerida > 30% → rojo duro */
const propsD = Array.from({ length: 25 }, (_, i) =>
  nuevaPropiedad({ precio: 950_000 + i * 8_000, m2: 70, estado: 'valido', escriturado: 'si', fuenteUrl: 'https://propiedades.com/z' }));
const zonaD = nuevaZona({
  nombre: 'Mercado chico', rotacionPct: 1.5, participacionMercadoPct: 10,
  competidoresNum: 6, colchonMeses: 12, propiedades: propsD,
});
const dD = dictaminar(zonaD);
t('participación requerida > 30% = rojo estructural', () => {
  if (dD.kpis.participacionRequeridaPct <= 30) throw new Error(`pr = ${dD.kpis.participacionRequeridaPct}`);
  es(dD.criterios.find((c) => c.id === 'demanda').estado, 'rojo');
  es(dD.criterios.find((c) => c.id === 'cobertura').estado, 'rojo');
  es(dD.semaforo.id, 'rojo');
});

console.log('\n── 6. Expediente y supuestos ──');

t('el resumen incluye el semáforo del dictamen', () => {
  const s = resumenTexto(zonaB, dB);
  if (!s.includes('🟢')) throw new Error('falta el semáforo');
  if (!s.includes('5,500')) throw new Error('falta la delimitación territorial');
  if (!s.includes('Participación requerida')) throw new Error('falta la participación requerida');
});
t('el resumen declara la participación como SUPUESTO cuando aplica el default', () => {
  const s = resumenTexto(zonaA, dA);
  if (zonaA.participacionMercadoPct !== SUPUESTOS.participacionMercadoAnio1Pct) throw new Error('setup inválido');
  if (!s.includes('SUPUESTO')) throw new Error('no declara el supuesto');
});
t('formato de moneda MXN', () => {
  if (!mxn(2_400_000).includes('2,400,000')) throw new Error(mxn(2_400_000));
});
t('nueva propiedad nace como no verificada', () => {
  eq(nuevaPropiedad().escriturado, 'no_verificado');
  eq(nuevaPropiedad().estado, 'valido');
});

console.log('\n── 7. Coherencia entre documentación y cálculo ──');

import { DERIVADAS } from '../src/plan.js';

t('ventas anuales requeridas = costo anual ÷ comisión por venta', () => {
  const ventas = (MODELO.costoRealConBuffer * 12) / (MODELO.ticketMinBuffer * MODELO.comisionEstandarPct / 100);
  aprox(ventas, 12, 0.001, 'ventas/año a ticket mínimo:');
});

t('la fila "Rotación requerida" coincide con la aritmética del modelo', () => {
  const ventas = (MODELO.costoRealConBuffer * 12) / (MODELO.ticketMinBuffer * MODELO.comisionEstandarPct / 100);
  const rot = (ventas / MODELO.propiedadesPorOficina) * 100;
  const fila = DERIVADAS.find((d) => d.concepto.includes('Rotación requerida'));
  if (!fila) throw new Error('no existe la fila de rotación requerida');
  if (!fila.valor.includes(rot.toFixed(2))) {
    throw new Error(`la documentación dice "${fila.valor}" pero el cálculo da ${rot.toFixed(3)}%`);
  }
});

t('el ingreso a 3 ventas/mes coincide con el margen citado en Fase 4', () => {
  const ingreso = 3 * MODELO.ticketMinBuffer * (MODELO.comisionEstandarPct / 100);
  aprox(ingreso, 432_000, 1, 'ingreso:');
  aprox(ingreso - MODELO.costoRealConBuffer, 288_000, 1, 'margen:');
});

t('el costo anual citado en la documentación = 12 × costo mensual', () => {
  const fila = DERIVADAS.find((d) => d.concepto.includes('Costo operativo anual'));
  const esperado = MODELO.costoRealConBuffer * 12;
  if (!fila.valor.includes(esperado.toLocaleString('en-US')) && !fila.valor.includes('1,728,000')) {
    throw new Error(`documentación: "${fila.valor}" vs cálculo $${esperado}`);
  }
});

t('el desglose del modelo contiene al costo base declarado', () => {
  const min = MODELO.desgloseBase.reduce((s, d) => s + d.min, 0);
  const max = MODELO.desgloseBase.reduce((s, d) => s + d.max, 0);
  aprox(min, 101_000, 1, 'suma de mínimos:');
  aprox(max, 145_000, 1, 'suma de máximos:');
  if (max <= MODELO.costoRealConBuffer) throw new Error('se esperaba que el máximo del desglose superara el buffer');
});

console.log('\n── 8. Parser de captura masiva ──');

t('detecta precio, m² y URL en formato CSV', () => {
  const p = parsearLinea('Departamento, 3200000, 100, https://www.inmuebles24.com/x');
  eq(p.tipo, 'Departamento');
  eq(p.precio, 3_200_000);
  eq(p.m2, 100);
  eq(p.portal, 'Inmuebles24');
  eq(p.estado, 'valido');
});

t('acepta separador pipe y precios con separador de miles', () => {
  const p = parsearLinea('Casa | 4,500,000 | 220 m2 | https://propiedades.com/y');
  eq(p.tipo, 'Casa');
  eq(p.precio, 4_500_000);
  eq(p.m2, 220);
  eq(p.portal, 'Propiedades.com');
});

t('reconoce precio en millones (3.5 mdp)', () => {
  const p = parsearLinea('Departamento, 3.5 mdp, 95 m2');
  eq(p.precio, 3_500_000);
  eq(p.m2, 95);
});

t('reconoce estatus por palabra clave', () => {
  eq(parsearLinea('Departamento, 2000000, remate').estado, 'remate');
  eq(parsearLinea('Casa, 5000000, cesión de derechos').estado, 'cesion');
  eq(parsearLinea('Local, 1200000, en juicio').estado, 'juicio');
  eq(parsearLinea('Departamento, 900000, solo contado').estado, 'solo_contado');
  const se = parsearLinea('Casa, 1500000, sin escritura');
  eq(se.estado, 'sin_escritura');
  eq(se.escriturado, 'no');
});

t('reconoce certeza jurídica positiva', () => {
  eq(parsearLinea('Departamento, 4200000, escriturado, 120 m2').escriturado, 'si');
});

t('sin URL el inmueble queda como no trazable', () => {
  const p = parsearLinea('Departamento, 3000000, 88');
  eq(p.fuenteUrl, '');
  eq(p.portal, '');
});

t('el texto libre sobrante se guarda como nota', () => {
  const p = parsearLinea('Departamento, 3000000, 88, piso 5 con vista');
  if (!p.nota.includes('piso 5')) throw new Error(`nota = "${p.nota}"`);
});

t('parsearLote ignora líneas vacías', () => {
  const lote = parsearLote('Departamento, 3000000, 88\n\n  \nCasa, 5000000, 200\n');
  eq(lote.length, 2);
  eq(lote[1].tipo, 'Casa');
});

console.log(`\n─────────────────────────────\n  ${ok} pruebas OK, ${fail} fallidas\n─────────────────────────────\n`);
process.exit(fail ? 1 : 0);
