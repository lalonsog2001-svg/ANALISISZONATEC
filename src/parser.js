/* =============================================================================
 * AnalisisZonaTec — PARSER DE CAPTURA MASIVA
 * -----------------------------------------------------------------------------
 * Convierte líneas pegadas por el usuario (CSV/pipe/tab) en inmuebles. El orden
 * de los campos es libre: cada campo se detecta por su contenido.
 * Reglas de detección:
 *   · http(s)://...              → URL de fuente (y de ahí se infiere el portal)
 *   · "120 m2"                   → superficie
 *   · número ≥ 1000              → precio en MXN
 *   · número < 1000              → superficie en m²
 *   · "3.5 m" / "3.5 mdp"        → precio en millones
 *   · palabras clave             → estatus de la muestra / certeza jurídica
 * ========================================================================== */

import { TIPOS_PROPIEDAD } from './model.js';
import { num, nuevaPropiedad } from './engine.js';

export function portalDe(url) {
  const u = String(url || '').toLowerCase();
  if (u.includes('inmuebles24')) return 'Inmuebles24';
  if (u.includes('propiedades.com')) return 'Propiedades.com';
  if (u.includes('lamudi')) return 'Lamudi';
  if (u.includes('metroscubicos')) return 'Metros Cúbicos';
  if (u.includes('easybroker')) return 'EasyBroker';
  if (u.includes('mercadolibre')) return 'Mercado Libre';
  return url ? 'Otra fuente' : '';
}

/* Quita separadores de miles dentro de números: 2,400,000 -> 2400000 */
export const quitarSeparadores = (linea) =>
  String(linea).replace(/(\d),(?=\d{3}\b)/g, '$1').replace(/(\d),(?=\d{3}\b)/g, '$1');

export const ESTATUS_POR_PALABRA = Object.freeze([
  { re: /remate/i, estado: 'remate' },
  { re: /cesi[oó]n\s+de\s+derechos|cesi[oó]n/i, estado: 'cesion' },
  { re: /juicio|litigio|demanda/i, estado: 'juicio' },
  { re: /solo\s+contado|únicamente\s+contado/i, estado: 'solo_contado' },
  { re: /sin\s+escritura|no\s+escritur|fuera\s+de\s+rpp/i, estado: 'sin_escritura' },
]);

export function parsearLinea(linea) {
  const partes = quitarSeparadores(linea)
    .split(/\s*[;|\t]\s*|\s*,\s*/)
    .map((s) => s.trim())
    .filter(Boolean);

  const p = nuevaPropiedad();
  const textoLibre = [];

  for (const parte of partes) {
    const low = parte.toLowerCase();

    if (/^https?:\/\//i.test(parte)) { p.fuenteUrl = parte; p.portal = portalDe(parte); continue; }

    const estatus = ESTATUS_POR_PALABRA.find((e) => e.re.test(parte));
    if (estatus) {
      p.estado = estatus.estado;
      if (estatus.estado === 'sin_escritura') p.escriturado = 'no';
      continue;
    }
    if (/escritur|folio\s+real|\brpp\b/i.test(parte)) { p.escriturado = 'si'; continue; }

    if (/^[\d.,]+\s*m(2|²|ts)?$/i.test(parte)) { p.m2 = num(parte); continue; }

    if (/^[\d.,]+\s*(m|mdp|mill(ones)?)\b/i.test(parte) && !/m2|m²/i.test(parte)) {
      p.precio = num(parte) * 1_000_000; continue;
    }

    if (/^[\d.,]+$/.test(parte) || /^(mxn|\$)/i.test(parte)) {
      const n = num(parte);
      if (n >= 1000) { p.precio = n; continue; }
      if (n > 0) { p.m2 = n; continue; }
      continue;
    }

    const tipo = TIPOS_PROPIEDAD.find((t) => low === t.toLowerCase())
      || TIPOS_PROPIEDAD.find((t) => t !== 'Otro' && low.includes(t.toLowerCase().split(' ')[0]));
    if (tipo && low.length < 30) { p.tipo = tipo; continue; }

    textoLibre.push(parte);
  }

  if (!p.portal && p.fuenteUrl) p.portal = portalDe(p.fuenteUrl);
  p.nota = textoLibre.join(' · ').slice(0, 120);
  return p;
}

export function parsearLote(texto) {
  return String(texto || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map(parsearLinea);
}
