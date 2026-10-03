/* =============================================================================
 * Smoke test de la interfaz con DOM simulado.
 * No reemplaza una prueba en navegador: verifica que cada vista renderiza sin
 * lanzar excepciones y que los flujos básicos (crear zona, cargar ejemplo,
 * editar, comparar) producen contenido esperado.
 * Ejecutar: node tests/ui.smoke.mjs
 * ========================================================================== */

let ok = 0, fail = 0;
const t = (nombre, fn) => {
  try { fn(); ok++; console.log(`  ✅ ${nombre}`); }
  catch (e) { fail++; console.log(`  ❌ ${nombre}\n     ${e.message}`); }
};
const contiene = (html, texto, donde) => {
  if (!String(html).includes(texto)) throw new Error(`${donde}: no contiene "${texto}"`);
};
const noContiene = (html, texto, donde) => {
  if (String(html).includes(texto)) throw new Error(`${donde}: NO debería contener "${texto}"`);
};

/* ------------------------------ DOM simulado ---------------------------- */
const crearNodo = (id = '') => ({
  id, innerHTML: '', textContent: '', value: '', files: null, hidden: false,
  dataset: {}, style: {},
  classList: { _s: new Set(), add(c) { this._s.add(c); }, remove(c) { this._s.delete(c); }, toggle(c, on) { on ? this._s.add(c) : this._s.delete(c); }, contains(c) { return this._s.has(c); } },
  addEventListener() {}, click() { this._clicked = true; }, remove() {}, focus() {}, appendChild() {},
  querySelector() { return null; }, querySelectorAll() { return []; },
});

const nodos = { '#toast': crearNodo('toast'), 'archivo-import': crearNodo('archivo-import') };
const oyentes = {};

/* #vista se comporta como el contenedor real: al re-renderizar, los nodos
 * hijos (como #salida-analisis) desaparecen. Evita falsos positivos por HTML
 * obsoleto entre vistas. */
nodos['#vista'] = crearNodo('vista');
Object.defineProperty(nodos['#vista'], 'innerHTML', {
  get() { return this._html || ''; },
  set(v) { this._html = v; delete nodos['#salida-analisis']; },
});

globalThis.document = {
  querySelector: (sel) => (nodos[sel] ||= crearNodo(sel)),
  querySelectorAll: () => [],
  getElementById: (id) => (nodos[id] ||= crearNodo(id)),
  addEventListener: (tipo, fn) => { (oyentes[tipo] ||= []).push(fn); },
  createElement: () => crearNodo(),
  body: { appendChild() {} },
};
const almacen = new Map();
globalThis.localStorage = {
  getItem: (k) => (almacen.has(k) ? almacen.get(k) : null),
  setItem: (k, v) => almacen.set(k, v),
  removeItem: (k) => almacen.delete(k),
};
Object.defineProperty(globalThis, 'navigator', {
  value: { clipboard: { writeText: async () => {} } }, configurable: true, writable: true,
});
Object.defineProperty(globalThis, 'confirm', { value: () => true, configurable: true, writable: true });
globalThis.Blob = class { constructor(p) { this.partes = p; } };
globalThis.URL.createObjectURL = () => 'blob:x';
globalThis.URL.revokeObjectURL = () => {};
globalThis.FileReader = class { readAsText() {} };

/* -------------------------------- ejecución ----------------------------- */
const clic = (dataset, id = undefined) => {
  const objetivo = { dataset: { ...dataset, ...(id ? { id } : {}) } };
  const ev = { target: { closest: () => objetivo }, preventDefault() {} };
  oyentes.click.forEach((fn) => fn(ev));
};
const teclear = (campo, valor) => {
  const ev = { target: { dataset: { zcampo: campo }, value: valor }, preventDefault() {} };
  oyentes.input.forEach((fn) => fn(ev));
};
const vista = () => nodos['#vista'].innerHTML + (nodos['#salida-analisis']?.innerHTML || '');

console.log('\n── UI: carga inicial ──');

await import('../src/app.js');

t('la vista inicial renderiza el listado de zonas', () => contiene(vista(), 'Zonas candidatas', 'zonas'));
t('sin zonas muestra el estado vacío con invitación al ejemplo', () => contiene(vista(), 'Sin zonas capturadas', 'zonas'));
t('el estado vacío advierte que el ejemplo son datos ilustrativos', () => contiene(vista(), 'no son precios de mercado reales', 'zonas'));

console.log('\n── UI: crear zona y capturar inmuebles ──');

t('crear zona abre la vista de análisis', () => {
  clic({ action: 'nueva-zona' });
  contiene(vista(), 'Análisis de zona', 'detalle');
});

t('la vista de análisis pide delimitación cuando falta', () => {
  contiene(vista(), 'Captura colonia, código postal o polígono', 'detalle');
  contiene(vista(), 'Sin inmuebles capturados', 'detalle');
});

t('el dictamen sin muestra es ⚪ sin dictamen', () => {
  contiene(vista(), 'SIN DICTAMEN', 'detalle');
  contiene(vista(), 'Participación de mercado requerida', 'detalle');
});

t('capturar campos de la zona recalcula en vivo', () => {
  teclear('nombre', 'Prueba Polígono');
  teclear('colonia', 'Del Valle');
  teclear('rotacionPct', 2);
  teclear('participacionMercadoPct', 12);
  teclear('competidoresNum', 6);
  contiene(vista(), 'Prueba Polígono', 'detalle');
});

t('la zona queda con los valores capturados', () => {
  const z = JSON.parse(almacen.get('analisiszonatec.v1')).zonas[0];
  if (z.rotacionPct !== 2) throw new Error(`rotación = ${z.rotacionPct}`);
  if (z.participacionMercadoPct !== 12) throw new Error(`participación = ${z.participacionMercadoPct}`);
  if (z.colonia !== 'Del Valle') throw new Error(`colonia = ${z.colonia}`);
});

console.log('\n── UI: importación por lote y dictamen ──');

t('importar lote agrega inmuebles por encima del mínimo', () => {
  // el textarea del lote se lee vía document.querySelector('#lote')
  nodos['#lote'] = crearNodo('lote');
  nodos['#lote'].value = Array.from({ length: 32 }, (_, i) =>
    `Departamento, ${2_600_000 + i * 60_000}, ${70 + i}, https://www.inmuebles24.com/p${i}, escriturado`).join('\n');
  clic({ action: 'importar-lote' });
  contiene(vista(), '32 capturados', 'detalle');
});

t('con muestra robusta el veredicto deja de estar bloqueado', () => {
  noContiene(vista(), 'Muestra insuficiente', 'detalle');
  contiene(vista(), 'Dictamen', 'detalle');
});

t('la tabla muestra la mediana de la muestra capturada', () => {
  contiene(vista(), 'Mediana de la muestra', 'detalle');
  contiene(vista(), 'Participación requerida', 'detalle');
});

t('la sensibilidad por rotación muestra los tres escenarios', () => {
  contiene(vista(), '2.25%', 'detalle');
  contiene(vista(), 'Sensibilidad por rotación', 'detalle');
});

t('editar un inmueble carga la vista de edición', () => {
  const z = JSON.parse(almacen.get('analisiszonatec.v1')).zonas[0];
  clic({ action: 'editar-inmueble' }, z.propiedades[0].id);
  contiene(vista(), 'Guardar cambios', 'detalle');
  clic({ action: 'cancelar-edicion' });
  noContiene(vista(), 'Guardar cambios', 'detalle');
});

t('borrar un inmueble reduce la muestra', () => {
  const z = JSON.parse(almacen.get('analisiszonatec.v1')).zonas[0];
  clic({ action: 'borrar-inmueble' }, z.propiedades[0].id);
  contiene(vista(), '31 capturados', 'detalle');
});

console.log('\n── UI: escenarios de costo ──');

t('cambiar a escenario alto recalcula el ticket mínimo', () => {
  clic({ escenario: 'alto' });
  contiene(vista(), '$2,666,667', 'detalle');
  clic({ escenario: 'buffer' });
  contiene(vista(), '$2,400,000', 'detalle');
});

console.log('\n── UI: comparación y plan ──');

t('cargar la zona de ejemplo crea una segunda zona', () => {
  clic({ action: 'demo' });
  contiene(vista(), 'datos ilustrativos', 'detalle');
  const st = JSON.parse(almacen.get('analisiszonatec.v1'));
  if (st.zonas.length !== 2) throw new Error(`zonas = ${st.zonas.length}`);
});

t('la vista comparar exige y muestra dos zonas', () => {
  clic({ vista: 'comparar' });
  contiene(vista(), 'Comparar zonas candidatas', 'comparar');
  contiene(vista(), 'Participación requerida', 'comparar');
  contiene(vista(), 'Lectura conjunta', 'comparar');
  contiene(vista(), 'capacidad comercial', 'comparar');
});

t('la vista del plan muestra las 5 fases y la Fase 0 abierta', () => {
  clic({ vista: 'plan' });
  contiene(vista(), 'Plan Maestro de 12 meses', 'plan');
  contiene(vista(), 'Segmentación y viabilidad', 'plan');
  contiene(vista(), 'Mes 1 (POST-APERTURA)', 'plan');
  contiene(vista(), 'Meses 5 a 8', 'plan');
  contiene(vista(), 'Meses 9 a 12', 'plan');
  contiene(vista(), 'Delimitación territorial de 5,500 propiedades', 'plan');
});

t('abrir otra fase cambia el acordeón', () => {
  clic({ action: 'toggle-fase' }, 'f3');
  contiene(vista(), 'Productividad y punto de equilibrio', 'plan');
  contiene(vista(), 'Dos meses consecutivos por debajo de $120,000', 'plan');
});

t('la vista de método lista fuentes oficiales con URL', () => {
  clic({ vista: 'fuentes' });
  contiene(vista(), 'sig.cdmx.gob.mx', 'fuentes');
  contiene(vista(), 'inegi.org.mx/app/mapa/denue', 'fuentes');
  contiene(vista(), 'data.consejeria.cdmx.gob.mx', 'fuentes');
  contiene(vista(), 'transparencia.shf.gob.mx', 'fuentes');
});

t('la vista de método declara las limitaciones y los supuestos', () => {
  contiene(vista(), 'No descarga datos de mercado ni los estima', 'fuentes');
  contiene(vista(), 'SUPUESTO', 'fuentes');
  contiene(vista(), 'Captación de la oficina nueva', 'fuentes');
  contiene(vista(), 'URL SIN VERIFICAR', 'fuentes');
});

console.log('\n── UI: persistencia y expediente ──');

t('el estado persiste en localStorage', () => {
  const st = JSON.parse(almacen.get('analisiszonatec.v1'));
  if (!st.zonas.length) throw new Error('sin zonas persistidas');
  if (!st.umbrales.muestraMinima) throw new Error('sin umbrales persistidos');
});

t('copiar expediente no lanza excepciones', () => {
  clic({ vista: 'zonas' });
  const st = JSON.parse(almacen.get('analisiszonatec.v1'));
  clic({ action: 'abrir-zona' }, st.zonas[0].id);
  clic({ action: 'copiar-expediente' });
  contiene(vista(), 'Copiar expediente', 'detalle');
});

console.log(`\n─────────────────────────────\n  ${ok} pruebas OK, ${fail} fallidas\n─────────────────────────────\n`);
process.exit(fail ? 1 : 0);
