/* =============================================================================
 * Verificación en navegador simulado con jsdom (OPCIONAL).
 * Carga index.html real, ejecuta src/app.js, interactúa con eventos reales y
 * reporta cualquier error de consola o excepción.
 *
 * Requiere jsdom (devDependency opcional):  npm i -D jsdom
 * Ejecutar:                                 node scripts/verificar-navegador.mjs
 *
 * Las pruebas que corren siempre (sin dependencias) son las de tests/.
 * ========================================================================== */

import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const errores = [];
let ok = 0, fail = 0;

const html = readFileSync('index.html', 'utf8');
const dom = new JSDOM(html, {
  url: 'http://localhost:8000/',
  runScripts: 'outside-only',
  pretendToBeVisual: true,
  resources: undefined,
});

const { window } = dom;
window.addEventListener('error', (e) => errores.push(`error global: ${e.message}`));
const capturar = (nivel) => (...args) => {
  const texto = args.map(String).join(' ');
  if (nivel === 'error' || nivel === 'warn') errores.push(`${nivel}: ${texto}`);
};
window.console = { ...console, error: capturar('error'), warn: capturar('warn') };

/* Ejecuta los módulos ES aplanando los imports (jsdom no resuelve módulos). */
const modulos = ['src/model.js', 'src/engine.js', 'src/fuentes.js', 'src/plan.js', 'src/parser.js', 'src/app.js'];
const fuentes = Object.fromEntries(modulos.map((m) => [m, readFileSync(m, 'utf8')]));

const codigo = fuentes['src/app.js']
  .replace(/^import[\s\S]*?from\s+'\.\/([\w-]+)\.js';$/gm, (m, nombre) => `/* import ${nombre} */`)
  .replace(/^import[\s\S]*?from\s+'\.\.\/src\/([\w-]+)\.js';$/gm, '/* import */')
  .replace(/^export\s+/gm, '');

// Se cargan los módulos en un único ámbito IIFE en el orden de dependencias.
const cuerpo = [fuentes['src/model.js'], fuentes['src/engine.js'], fuentes['src/fuentes.js'], fuentes['src/plan.js'], fuentes['src/parser.js'], codigo]
  .map((c) => c.replace(/^import[\s\S]*?from\s+'[^']+';$/gm, '').replace(/^export\s+/gm, ''))
  .join('\n;\n');

try {
  window.eval(`(function(){\n${cuerpo}\n})();`);
} catch (e) {
  errores.push(`excepción al ejecutar la app: ${e.message}`);
}

const $ = (sel) => window.document.querySelector(sel);
const $$ = (sel) => [...window.document.querySelectorAll(sel)];
const clic = (el) => el.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
const escribir = (el, valor) => {
  el.value = valor;
  el.dispatchEvent(new window.Event('input', { bubbles: true }));
};
const vista = () => $('#vista').innerHTML;

const t = (nombre, fn) => {
  try { fn(); ok++; console.log(`  ✅ ${nombre}`); }
  catch (e) { fail++; console.log(`  ❌ ${nombre}\n     ${e.message}`); }
};
const contiene = (texto, donde) => {
  if (!vista().includes(texto)) throw new Error(`${donde || ''}: no contiene "${texto}"`);
};

console.log('\n── Navegador simulado (jsdom): DOM real de index.html ──');

t('la app se ejecuta sin excepciones', () => {
  if (errores.some((e) => e.startsWith('excepción'))) throw new Error(errores.join(' | '));
});

t('el DOM declara las 5 pestañas del producto', () => {
  const tabs = $$('.tab').map((t) => t.dataset.vista);
  ['zonas', 'detalle', 'comparar', 'plan', 'fuentes'].forEach((v) => {
    if (!tabs.includes(v)) throw new Error(`falta la pestaña ${v}`);
  });
});

t('la barra del modelo muestra las cifras inmutables', () => {
  const textos = $$('.modelo-strip .strip-v').map((e) => e.textContent).join(' | ');
  if (!textos.includes('144,000')) throw new Error(`sin costo con buffer: ${textos}`);
  if (!textos.includes('5,500')) throw new Error(`sin delimitación: ${textos}`);
});

t('renderiza el listado de zonas y el aviso de datos no inventados', () => {
  contiene('Zonas candidatas');
  if (!$('.aviso')) throw new Error('falta el aviso de método');
});

t('crear zona con el botón real crea los campos del formulario', () => {
  clic($('[data-action="nueva-zona"]'));
  contiene('Análisis de zona');
  if (!$('#z-nombre') || !$('#z-participacion') || !$('#z-competidores')) {
    throw new Error('faltan campos del formulario de zona');
  }
  if (!$('#in-precio') || !$('#in-estado') || !$('#in-url')) {
    throw new Error('faltan campos del formulario de inmueble');
  }
});

t('capturar el nombre por input real actualiza el dictamen', () => {
  escribir($('#z-nombre'), 'Polígono Piloto');
  if (!$('#salida-analisis').innerHTML.includes('Polígono Piloto')) {
    throw new Error('el panel de análisis no se refrescó');
  }
});

t('importar por lote con el textarea real acepta 24 inmuebles', () => {
  const lote = Array.from({ length: 24 }, (_, i) =>
    `Departamento, ${2_800_000 + i * 70_000}, ${75 + i}, https://www.inmuebles24.com/p${i}, escriturado`).join('\n');
  $$('details').forEach((d) => { d.open = true; });
  escribir($('#lote'), lote);
  clic($('[data-action="importar-lote"]'));
  contiene('24 capturados');
  contiene('Dictamen');
});

t('el dictamen se emite con semáforo explícito', () => {
  const dict = $('.dictamen');
  if (!dict) throw new Error('no hay bloque de dictamen');
  if (!/verde|amarillo|rojo|sin-datos/.test(dict.className)) throw new Error(`clase inesperada: ${dict.className}`);
  if (!dict.querySelector('.badge')) throw new Error('sin badge de semáforo');
});

t('la tabla de inmuebles enlaza las fuentes con target seguro', () => {
  const enlaces = $$('#vista a[target="_blank"]');
  if (!enlaces.length) throw new Error('sin enlaces de fuente');
  if (enlaces.some((a) => !a.rel.includes('noopener'))) throw new Error('enlace sin rel=noopener');
});

t('cambiar el escenario de costo recalcula el ticket', () => {
  clic($('[data-escenario="alto"]'));
  if (!$('[data-modelo="ticket"]').textContent.includes('2,666,667')) throw new Error('ticket no actualizado');
  clic($('[data-escenario="buffer"]'));
  if (!$('[data-modelo="ticket"]').textContent.includes('2,400,000')) throw new Error('ticket no restaurado');
});

t('con una sola zona, comparar muestra su estado vacío guiado', () => {
  clic($$('.tab').find((b) => b.dataset.vista === 'comparar'));
  contiene('Se necesitan al menos 2 zonas');
});

t('con dos zonas, comparar despliega la tabla y la lectura conjunta', () => {
  clic($$('.tab').find((b) => b.dataset.vista === 'zonas'));
  clic($('[data-action="demo"]'));
  clic($$('.tab').find((b) => b.dataset.vista === 'comparar'));
  contiene('Comparar zonas candidatas');
  contiene('Lectura conjunta');
  const columnas = $$('#vista table thead th').length;
  if (columnas < 3) throw new Error(`columnas en la comparativa: ${columnas}`);
  if ($$('#vista .pill').length < 2) throw new Error('faltan selectores de zona');
});

t('las 5 vistas renderizan sin excepciones', () => {
  ['comparar', 'plan', 'fuentes', 'zonas', 'detalle'].forEach((v) => {
    clic($$('.tab').find((b) => b.dataset.vista === v));
    if (vista().length < 200) throw new Error(`la vista ${v} renderizó vacía`);
  });
  if (errores.length) throw new Error(`errores de consola: ${errores.join(' | ')}`);
});

t('el plan muestra las 5 fases con acciones y KPIs', () => {
  clic($$('.tab').find((b) => b.dataset.vista === 'plan'));
  const fases = $$('.fase');
  if (fases.length !== 5) throw new Error(`fases = ${fases.length}`);
  contiene('Participación de mercado requerida', 'plan');
  contiene('Cifras derivadas del modelo', 'plan');
});

t('los umbrales son editables desde la interfaz', () => {
  clic($$('.tab').find((b) => b.dataset.vista === 'fuentes'));
  const campo = $('[data-umbral="participacionRojoPct"]');
  if (!campo) throw new Error('sin campo de umbral');
  escribir(campo, '25');
  clic($('[data-action="reset-umbrales"]'));
  if ($('[data-umbral="participacionRojoPct"]').value !== '30') throw new Error('no se restauró el umbral');
});

t('persistencia: localStorage guarda el estado', () => {
  const bruto = window.localStorage.getItem('analisiszonatec.v1');
  if (!bruto) throw new Error('sin persistencia');
  const d = JSON.parse(bruto);
  if (!d.zonas.length || !d.zonas[0].propiedades.length) throw new Error('estado incompleto');
});

console.log(`\n  Errores/warnings de consola capturados: ${errores.length}`);
errores.slice(0, 10).forEach((e) => console.log(`   · ${e}`));
console.log(`\n─────────────────────────────\n  ${ok} pruebas OK, ${fail} fallidas\n─────────────────────────────\n`);
process.exit(fail ? 1 : 0);
