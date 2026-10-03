/* =============================================================================
 * Construye la COPIA AUTÓNOMA de un solo archivo HTML.
 *
 * Toma index.html + styles.css + los módulos de src/ + un expediente JSON y
 * produce un único .html que funciona con doble clic, SIN servidor y SIN red:
 * los módulos se aplanan en un solo <script> y `fetch` se sustituye por los
 * datos embebidos.
 *
 * Uso:
 *   node scripts/construir-copia.mjs
 *   node scripts/construir-copia.mjs expedientes/san-bartolo-ameyalco.json
 * ========================================================================== */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { basename } from 'node:path';

const rutaExpediente = process.argv[2] || 'expedientes/san-bartolo-ameyalco.json';
const rutaIndice = 'expedientes/index.json';

const expediente = JSON.parse(readFileSync(rutaExpediente, 'utf8'));
const indice = JSON.parse(readFileSync(rutaIndice, 'utf8'));
const nombreArchivo = basename(rutaExpediente);
const slug = nombreArchivo.replace(/\.json$/, '');
/* `copias/` y NO `dist/`: dist/ se excluye de los respaldos del workspace y la
 * copia desaparece entre sesiones (el usuario se queda con un 404). */
const salida = `copias/analisiszonatec-${slug}.html`;

/* Orden de dependencias del aplanado. */
const MODULOS = ['src/model.js', 'src/fuentes.js', 'src/engine.js', 'src/plan.js', 'src/parser.js', 'src/app.js'];

const aplanar = (codigo) => codigo
  .replace(/^import[\s\S]*?from\s+'[^']+';$/gm, '')
  .replace(/^export\s+/gm, '')
  .trim();

const cuerpo = MODULOS
  .map((m) => `/* ==================== ${m} ==================== */\n${aplanar(readFileSync(m, 'utf8'))}`)
  .join('\n\n');

const datosEmbebidos = JSON.stringify({ [rutaIndice]: indice, [`expedientes/${nombreArchivo}`]: expediente });

const puente = `
/* --- Puente de datos: reemplaza a fetch() para que la copia funcione sin
 * servidor. Cualquier ruta que no esté embebida responde 404, igual que un
 * servidor sin esa carpeta. */
const __DATOS_EMBEBIDOS = ${datosEmbebidos};
window.fetch = async (url) => {
  const ruta = String(url).replace(/^\\.\\//, '');
  const clave = Object.keys(__DATOS_EMBEBIDOS).find((k) => k === ruta || k.endsWith('/' + ruta));
  if (!clave) return { ok: false, status: 404, json: async () => ({}) };
  return { ok: true, status: 200, json: async () => JSON.parse(JSON.stringify(__DATOS_EMBEBIDOS[clave])) };
};
`;

const css = readFileSync('styles.css', 'utf8');
let html = readFileSync('index.html', 'utf8');

/* Aviso visible de que es una copia autónoma con el caso cargado. */
const banner = `
<div class="aviso aviso-copia" role="note" style="border-left-color:#4ea1ff">
  <strong>Copia autónoma del caso.</strong> Archivo único, sin servidor y sin conexión: trae embebido el expediente
  <em>${expediente.zonas[0]?.nombre || nombreArchivo}</em> con sus ${expediente.zonas[0]?.propiedades?.length || 0} anuncios capturados.
  No se conecta a portales, RPP ni Catastro. Precios <strong>de oferta</strong>, no de cierre.
</div>`;

/* OJO: las substituciones van con función, no con cadena. Si el reemplazo es una
 * cadena, `$'` y `$&` dentro del código aplanado se interpretan como patrones
 * especiales de String.replace y el JavaScript sale mutilado. */
html = html
  .replace('<link rel="stylesheet" href="styles.css" />', () => `<style>\n${css}\n</style>`)
  .replace('</header>', () => `</header>${banner}`)
  .replace(
    '<script type="module" src="src/app.js"></script>',
    () => `<script>\n/* Copia autónoma generada por scripts/construir-copia.mjs — no editar a mano. */\n${puente}\n${cuerpo}\n</script>`,
  )
  .replace(
    '<p class="brand-sub">Director de Apertura y Operaciones · Franquicia inmobiliaria · CDMX</p>',
    () => '<p class="brand-sub">Director de Apertura y Operaciones · Franquicia inmobiliaria · CDMX · <strong>copia autónoma</strong></p>',
  );

mkdirSync('copias', { recursive: true });
writeFileSync(salida, html);

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
console.log(`✅ Copia autónoma escrita en ${salida} (${kb(Buffer.byteLength(html))})`);
console.log(`   · expediente embebido: ${nombreArchivo} — ${expediente.zonas.length} zona(s), ${expediente.zonas[0]?.propiedades?.length || 0} anuncios`);
console.log('   · ábrela con doble clic; no necesita servidor ni internet.');
