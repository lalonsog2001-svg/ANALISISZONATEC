/* =============================================================================
 * Verifica la COPIA AUTÓNOMA: carga el HTML único como si se abriera con doble
 * clic (file://), SIN servidor y SIN fetch nativo, y comprueba que el caso está
 * a la vista. Requiere jsdom (npm i -D jsdom).
 *
 * Ejecutar: node scripts/verificar-copia.mjs [ruta.html]
 * ========================================================================== */

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { JSDOM } from 'jsdom';

const ruta = resolve(process.argv[2] || 'copias/analisiszonatec-san-bartolo-ameyalco.html');
if (!existsSync(ruta)) {
  console.error(`❌ No existe ${ruta}. Genera la copia con: node scripts/construir-copia.mjs`);
  process.exit(1);
}

const html = readFileSync(ruta, 'utf8');
const errores = [];
let ok = 0, fail = 0;

const dom = new JSDOM(html, {
  url: `file://${ruta}`,
  runScripts: 'dangerously',
  pretendToBeVisual: true,
});
const { window } = dom;
window.addEventListener('error', (e) => errores.push(`error global: ${e.message}`));
window.console = { ...console, error: (...a) => errores.push('error: ' + a.join(' ')), warn: (...a) => errores.push('warn: ' + a.join(' ')) };

const es = (nombre, condicion, detalle = '') => {
  if (condicion) { ok++; console.log(`  ✅ ${nombre}`); }
  else { fail++; console.log(`  ❌ ${nombre}${detalle ? ` — ${detalle}` : ''}`); }
};

es('el archivo no depende de módulos externos', !html.includes('type="module"') && !html.includes('src="src/'));
es('los estilos vienen embebidos', html.includes('<style>'));

await new Promise((r) => setTimeout(r, 300));

const vista = window.document.querySelector('#vista')?.textContent || '';
es('la vista se renderizó con contenido', vista.length > 500, `largo=${vista.length}`);
es('trae el polígono del caso', vista.includes('San Bartolo Ameyalco'));
es('trae el dictamen', vista.includes('VIABLE CON CONDICIONES'));
es('trae la mediana medida', vista.includes('$18,500,000'));
es('trae la certeza sin medir', vista.includes('SIN MEDIR'));
es('trae el piso de competencia', vista.includes('30 marcas'));
es('marca que es copia autónoma', window.document.body.textContent.includes('Copia autónoma'));
es('sin errores de consola', errores.length === 0, errores.join(' | '));

console.log(`\n  ${ok} pruebas OK, ${fail} fallidas`);
process.exit(fail ? 1 : 0);
