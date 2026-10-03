/* Verificación temporal: que la app abra directamente con el caso real del
 * repositorio cuando el servidor expone /expedientes (fetch simulado a disco). */
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const html = readFileSync('index.html', 'utf8');
const dom = new JSDOM(html, { url: 'http://localhost:8000/', runScripts: 'outside-only', pretendToBeVisual: true });
const { window } = dom;

const errores = [];
window.addEventListener('error', (e) => errores.push(`error global: ${e.message}`));
window.console = { ...console, error: (...a) => errores.push('error: ' + a.join(' ')), warn: (...a) => errores.push('warn: ' + a.join(' ')) };

window.fetch = async (url) => {
  const ruta = String(url).replace(/^https?:\/\/[^/]+\//, '').replace(/^\//, '');
  if (!ruta.startsWith('expedientes/')) return { ok: false, status: 404, json: async () => ({}) };
  return { ok: true, status: 200, json: async () => JSON.parse(readFileSync(ruta, 'utf8')) };
};

const modulos = ['src/model.js', 'src/engine.js', 'src/fuentes.js', 'src/plan.js', 'src/parser.js'];
const fuentes = Object.fromEntries(modulos.map((m) => [m, readFileSync(m, 'utf8')]));
const app = readFileSync('src/app.js', 'utf8');
const cuerpo = [...Object.values(fuentes), app]
  .map((c) => c.replace(/^import[\s\S]*?from\s+'[^']+';$/gm, '').replace(/^export\s+/gm, ''))
  .join('\n;\n');
window.eval(`(function(){\n${cuerpo}\n})();`);

await new Promise((r) => setTimeout(r, 100));

const vista = window.document.querySelector('#vista').textContent;
const esperado = [
  ['nombre del polígono', 'San Bartolo Ameyalco'],
  ['dictamen', 'VIABLE CON CONDICIONES'],
  ['mediana', '$18,500,000'],
  ['número de válidos', '59'],
  ['certeza sin medir', 'SIN MEDIR'],
  ['competencia piso', '30 marcas'],
];
let ok = 0, fail = 0;
for (const [nombre, texto] of esperado) {
  if (vista.includes(texto)) { ok++; console.log(`  ✅ ${nombre}`); }
  else { fail++; console.log(`  ❌ ${nombre} — no aparece "${texto}"`); }
}
console.log(`\n  ${ok} pruebas OK, ${fail} fallidas · errores de consola: ${errores.length}`);
for (const e of errores) console.log('   -', e);
process.exit(fail || errores.length ? 1 : 0);
