/* =============================================================================
 * AnalisisZonaTec — INTERFAZ
 * Sin dependencias, sin build. Persistencia en localStorage del navegador.
 * ========================================================================== */

import {
  MODELO, UMBRALES_DEFAULT, ESTADOS_PROPIEDAD, ESTADO_POR_ID, TIPOS_PROPIEDAD,
  ESCENARIOS, SEMAFORO, SUPUESTOS,
} from './model.js';
import {
  computarKpis, dictaminar, fusionarZonas, nuevaZona, nuevaPropiedad, validarZona,
  resumenTexto, num, mxn, mxnCompacto, pct,
} from './engine.js';
import { FUENTES, AVISO_LIMITACION } from './fuentes.js';
import { FASES, DERIVADAS, REGLAS_DURAS } from './plan.js';
import { portalDe, parsearLote } from './parser.js';

/* ------------------------------- estado -------------------------------- */

const CLAVE = 'analisiszonatec.v1';

const estado = {
  zonas: [],
  zonaId: null,
  vista: 'zonas',
  escenario: 'buffer',
  umbrales: { ...UMBRALES_DEFAULT },
  comparar: [],
  edicion: null,       // id del inmueble en edición
  faseAbierta: 'f0',
  expedientes: [],     // expedientes publicados en /expedientes (cargados por fetch)
};

function guardar() {
  try {
    localStorage.setItem(CLAVE, JSON.stringify({
      zonas: estado.zonas, zonaId: estado.zonaId, escenario: estado.escenario,
      umbrales: estado.umbrales, comparar: estado.comparar,
    }));
  } catch { /* modo privado: se opera en memoria */ }
}

function cargar() {
  try {
    const bruto = localStorage.getItem(CLAVE);
    if (!bruto) return false;
    const d = JSON.parse(bruto);
    if (Array.isArray(d.zonas)) estado.zonas = d.zonas;
    if (d.zonaId) estado.zonaId = d.zonaId;
    if (d.escenario) estado.escenario = d.escenario;
    if (d.umbrales) estado.umbrales = { ...UMBRALES_DEFAULT, ...d.umbrales };
    if (Array.isArray(d.comparar)) estado.comparar = d.comparar;
    return true;
  } catch { return false; }
}

/* ----------------------------- utilidades ------------------------------- */

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const $ = (sel) => document.querySelector(sel);

function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('visible');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove('visible'), 3200);
}

const zonaActual = () => estado.zonas.find((z) => z.id === estado.zonaId) || null;

const badge = (sem, grande = false) =>
  `<span class="badge ${sem.clase}${grande ? ' grande' : ''}">${sem.icono} ${esc(sem.etiqueta)}</span>`;

const urlValida = (u) => /^https?:\/\/\S+\.\S+/i.test(String(u || '').trim());

/* -------------------------------- render -------------------------------- */

function render() {
  document.querySelectorAll('.tab').forEach((t) => {
    t.classList.toggle('activo', t.dataset.vista === estado.vista);
  });
  document.querySelectorAll('[data-escenario]').forEach((b) => {
    b.classList.toggle('activo', b.dataset.escenario === estado.escenario);
  });
  document.querySelectorAll('[data-modelo="ticket"]').forEach((el) => {
    el.textContent = mxn(ESCENARIOS[estado.escenario].ticketMinimo);
  });
  document.querySelectorAll('[data-modelo="buffer"]').forEach((el) => { el.textContent = mxn(MODELO.costoRealConBuffer); });
  document.querySelectorAll('[data-modelo="alto"]').forEach((el) => { el.textContent = mxn(MODELO.costoEscenarioAlto); });
  document.querySelectorAll('[data-modelo="version"]').forEach((el) => { el.textContent = MODELO.version; });

  const v = $('#vista');
  if (estado.vista === 'zonas') v.innerHTML = vistaZonas();
  else if (estado.vista === 'detalle') v.innerHTML = vistaDetalle();
  else if (estado.vista === 'comparar') v.innerHTML = vistaComparar();
  else if (estado.vista === 'plan') v.innerHTML = vistaPlan();
  else if (estado.vista === 'fuentes') v.innerHTML = vistaFuentes();
  v.scrollTop = 0;
}

/* ----------------------------- vista: zonas ----------------------------- */

function vistaZonas() {
  const h = [];
  h.push(`<div class="seccion-titulo">
    <h2>Zonas candidatas <span class="sub">5,500 propiedades de delimitación por oficina</span></h2>
    <div class="fila">
      <button class="btn" data-action="demo" type="button">Cargar zona de ejemplo</button>
      <button class="btn btn-primario" data-action="nueva-zona" type="button">+ Nueva zona</button>
    </div>
  </div>`);

  if (!estado.zonas.length) {
    h.push(`<div class="vacio">
      <h3>Sin zonas capturadas</h3>
      <p>Una zona = un polígono de 5,500 propiedades. Captura la muestra de inmuebles con su fuente para emitir dictamen.</p>
      <p class="chico">¿Quieres ver cómo funciona? <button class="link" data-action="demo" type="button">Carga una zona de ejemplo</button> (datos ilustrativos, no son precios de mercado reales) o <button class="link" data-vista="plan" type="button">revisa el Plan de 12 meses</button>.</p>
    </div>`);
  }
  if (estado.expedientes.length) {
    h.push(`<div class="seccion-titulo"><h2>Expedientes publicados en este repositorio</h2><span class="hint">capturas reales con URL por inmueble · se cargan en tu navegador</span></div>`);
    h.push('<div class="grid grid-2">');
    for (const e of estado.expedientes) {
      h.push(`<div class="fuente">
        <div class="fila"><h4>${esc(e.nombre)}</h4><span class="tipo-fuente tipo-portal">${esc(e.fecha || '')}</span></div>
        <p>${esc(e.descripcion || '')}</p>
        ${e.advertencia ? `<p class="muted">⚠️ ${esc(e.advertencia)}</p>` : ''}
        <button class="btn btn-primario mt" data-action="cargar-expediente" data-archivo="${esc(e.archivo)}" type="button">Cargar expediente</button>
      </div>`);
    }
    h.push('</div>');
  }
  if (!estado.zonas.length) return h.join('');

  h.push('<div class="grid grid-3">');
  for (const z of estado.zonas) {
    const d = dictaminar(z, estado.umbrales, estado.escenario);
    const k = d.kpis;
    const ubic = [z.colonia, z.alcaldia, z.cp].filter(Boolean).join(' · ') || 'Sin delimitación capturada';
    h.push(`<article class="zona-card ${d.semaforo.clase}" data-action="abrir-zona" data-id="${esc(z.id)}">
      <h3>${esc(z.nombre || 'Zona sin nombre')}</h3>
      <p class="zona-ubic">${esc(ubic)}</p>
      <div class="zona-metricas">
        <div><div class="metrica-k">Mediana</div><div class="metrica-v">${k.precioMediana ? mxnCompacto(k.precioMediana) : '—'}</div></div>
        <div><div class="metrica-k">Muestra válida</div><div class="metrica-v">${k.nValidas}</div></div>
        <div><div class="metrica-k">Cobertura costo</div><div class="metrica-v">${k.nValidas ? pct(k.coberturaPct, 0) : '—'}</div></div>
        <div><div class="metrica-k">Participación req.</div><div class="metrica-v">${Number.isFinite(k.participacionRequeridaPct) ? pct(k.participacionRequeridaPct, 0) : '—'}</div></div>
      </div>
      <div class="zona-pie">
        ${badge(d.semaforo)}
        <span class="fila">
          <button class="btn btn-chico" data-action="duplicar" data-id="${esc(z.id)}" type="button">Duplicar</button>
          <button class="btn btn-chico btn-riesgo" data-action="borrar" data-id="${esc(z.id)}" type="button">Borrar</button>
        </span>
      </div>
    </article>`);
  }
  h.push('</div>');
  return h.join('');
}

/* ---------------------------- vista: detalle ---------------------------- */

function vistaDetalle() {
  const z = zonaActual();
  if (!z) {
    return `<div class="vacio"><h3>No hay zona seleccionada</h3>
      <p>Elige una zona en la pestaña <button class="link" data-vista="zonas" type="button">Zonas</button> o crea una nueva.</p>
      <button class="btn btn-primario" data-action="nueva-zona" type="button">+ Nueva zona</button></div>`;
  }

  const d = dictaminar(z, estado.umbrales, estado.escenario);
  const errs = validarZona(z);

  return `
  <div class="seccion-titulo">
    <h2>Análisis de zona <span class="sub">Fase 0 · Segmentación y viabilidad</span></h2>
    <div class="fila">
      <button class="btn" data-vista="zonas" type="button">← Todas las zonas</button>
      <button class="btn" data-action="copiar-expediente" type="button">📋 Copiar expediente</button>
    </div>
  </div>

  ${errs.length ? `<div class="bloque-aviso"><strong>Faltan datos de identificación:</strong><ul class="lista-acciones">${errs.map((e) => `<li>${esc(e)}</li>`).join('')}</ul></div>` : ''}

  <div class="tarjeta">
    <div class="grid grid-4">
      <div class="campo"><label for="z-nombre">Nombre de la zona</label>
        <input id="z-nombre" data-zcampo="nombre" value="${esc(z.nombre)}" placeholder="Ej. Polígono Del Valle Norte" /></div>
      <div class="campo"><label for="z-colonia">Colonia</label>
        <input id="z-colonia" data-zcampo="colonia" value="${esc(z.colonia)}" placeholder="Ej. Del Valle Centro" /></div>
      <div class="campo"><label for="z-alcaldia">Alcaldía</label>
        <input id="z-alcaldia" data-zcampo="alcaldia" value="${esc(z.alcaldia)}" placeholder="Ej. Benito Juárez" /></div>
      <div class="campo"><label for="z-cp">Código postal</label>
        <input id="z-cp" data-zcampo="cp" value="${esc(z.cp)}" placeholder="Ej. 03100" /></div>
    </div>
    <div class="campo mt"><label for="z-poligono">Polígono / delimitación <span class="ayuda">calles o límites del territorio de 5,500 propiedades</span></label>
      <input id="z-poligono" data-zcampo="poligono" value="${esc(z.poligono)}" placeholder="Ej. Av. Universidad – Eje 8 Sur – Av. Coyoacán – Insurgentes" /></div>

    <div class="grid grid-4 mt">
      <div class="campo"><label for="z-comision">Comisión <span class="tag tag-sp2">SP2</span></label>
        <input id="z-comision" type="number" min="0" max="20" step="0.5" data-zcampo="comisionPct" value="${esc(z.comisionPct)}" />
        <span class="campo-ayuda">Estándar 6% (vendedor, comprador o split 3+3).</span></div>
      <div class="campo"><label for="z-rotacion">Rotación anual de la zona <span class="tag tag-sp2">SP2</span></label>
        <input id="z-rotacion" type="number" min="0.1" max="10" step="0.1" data-zcampo="rotacionPct" value="${esc(z.rotacionPct)}" />
        <span class="campo-ayuda">Rango del modelo: 1.5% – 3.0% urbano CDMX.</span></div>
      <div class="campo"><label for="z-participacion">Captación de la oficina <span class="tag tag-sp1">SP1</span></label>
        <input id="z-participacion" type="number" min="0.1" max="100" step="0.5" data-zcampo="participacionMercadoPct" value="${esc(z.participacionMercadoPct)}" />
        <span class="campo-ayuda">% de las ventas del polígono que captura tu oficina. Supuesto, no dato.</span></div>
      <div class="campo"><label for="z-competidores">Inmobiliarias en 1.5 km <span class="tag tag-sp1">SP1</span></label>
        <input id="z-competidores" type="number" min="0" step="1" data-zcampo="competidoresNum" value="${esc(z.competidoresNum)}" placeholder="Conteo DENUE" />
        <span class="campo-ayuda">Fuente: DENUE INEGI (SCIAN 5311) + recorrido físico.</span></div>
      <div class="campo"><label for="z-colchon">Colchón de capital (meses) <span class="tag tag-sp1">SP1</span></label>
        <input id="z-colchon" type="number" min="0" step="1" data-zcampo="colchonMeses" value="${esc(z.colchonMeses)}" />
        <span class="campo-ayuda">Meses de costo operativo financiados sin ingreso.</span></div>
    </div>
    <div class="campo mt"><label for="z-notas">Notas de campo</label>
      <textarea id="z-notas" data-zcampo="notas" placeholder="Observaciones: oferta nueva, licencias de construcción, obras, percepción de seguridad, etc.">${esc(z.notas)}</textarea></div>
  </div>

  <div id="salida-analisis">${panelAnalisis(z, d)}</div>

  ${tablaInmuebles(z)}
  <p class="hint mt">La estadística se calcula <strong>solo</strong> con inmuebles válidos: remates, cesiones, litigios, "solo contado", sin escritura RPP y sin precio publicado quedan fuera de la muestra por regla del modelo.</p>
  `;
}

/* Salida de análisis (se refresca mientras se escribe, sin perder el foco) */
function panelAnalisis(z, d) {
  const k = d.kpis;

  const kpi = (etiqueta, valor, unidad, clase = '') =>
    `<div class="kpi ${clase}"><div class="kpi-k">${etiqueta}</div><div class="kpi-v">${valor}</div><div class="kpi-u">${unidad}</div></div>`;

  const claseCob = k.coberturaPct >= 100 ? 'bien' : k.coberturaPct >= 70 ? 'alerta' : 'mal';
  const claseTicket = k.precioMediana >= k.ticketMinimo ? 'bien' : k.precioMediana >= k.ticketMinimo * 0.75 ? 'alerta' : 'mal';
  const clasePart = !Number.isFinite(k.participacionRequeridaPct) ? '' :
    k.participacionRequeridaPct <= estado.umbrales.participacionVerdePct ? 'bien' :
      k.participacionRequeridaPct <= estado.umbrales.participacionRojoPct ? 'alerta' : 'mal';

  const filasEscalera = k.escalera.map((e) => `
    <tr>
      <td class="num">${pct(e.rotacionPct)}</td>
      <td class="num">${e.ventasAnioZona.toFixed(0)}</td>
      <td class="num">${e.ventasMesZona.toFixed(1)}</td>
      <td class="num">${Number.isFinite(e.participacionRequeridaPct) ? pct(e.participacionRequeridaPct) : '—'}</td>
      <td class="num">${mxn(e.ingresoMensual)}</td>
      <td class="num">${pct(e.coberturaPct, 0)}</td>
      <td class="num ${e.cubre ? 'mejor' : 'peor'}">${mxn(e.margenMensual)}</td>
    </tr>`).join('');

  const criterios = d.criterios.map((c) => `
    <div class="criterio ${c.estado}">
      <span class="icono">${SEMAFORO[c.estado].icono}</span>
      <div>
        <div class="nombre">${esc(c.nombre)}</div>
        <div class="detalle">${esc(c.valorTexto)}</div>
        <div class="umbral">Umbral: ${esc(c.umbral)}</div>
        <div class="mensaje">${esc(c.mensaje)}</div>
      </div>
      <span class="muted chico">peso ${c.peso}</span>
    </div>`).join('');

  const siguientes = d.siguientes.length ? `
    <div class="bloque-aviso">
      <strong>Qué hacer para cerrar cada brecha:</strong>
      <ul class="lista-acciones">${d.siguientes.map((s) => `<li><strong>${esc(s.criterio)}:</strong> ${esc(s.accion)}</li>`).join('')}</ul>
    </div>` : '';

  return `
  <div class="seccion-titulo"><h2>KPIs de Fase 0 <span class="sub">escenario ${esc(k.escenario.etiqueta)} · ${mxn(k.costoMensual)}/mes</span></h2>
    <span class="hint">Todos los importes en MXN. Cálculo recalculado en vivo.</span></div>

  <div class="kpi-grid">
    ${kpi('Mediana de la muestra', k.precioMediana ? mxnCompacto(k.precioMediana) : '—', `${k.nValidas} válidos de ${k.nCapturadas} capturados`)}
    ${kpi('Comisión mediana', k.comisionMediana ? mxnCompacto(k.comisionMediana) : '—', `${k.comisionPct}% del precio de venta`)}
    ${kpi('Ticket mínimo requerido', mxnCompacto(k.ticketMinimo), `1 venta/mes cubre ${mxn(k.costoMensual)}`, claseTicket)}
    ${kpi('Ventas de la zona / año', k.ventasAnualesZona ? k.ventasAnualesZona.toFixed(0) : '—', `5,500 × ${pct(k.rotacionPct)} = ${k.ventasMensualesZona.toFixed(1)}/mes`)}
    ${kpi('Ventas que captura tu oficina', k.ventasAnualesOficina ? k.ventasAnualesOficina.toFixed(1) : '—', `${pct(k.participacionMercadoPct)} de captación asumida`)}
    ${kpi('Ingreso mensual estimado', mxn(k.ingresoMensualEstimado), `vs. costo ${mxn(k.costoMensual)}`, claseCob)}
    ${kpi('Cobertura del costo', k.nValidas ? pct(k.coberturaPct, 0) : '—', k.margenMensualEstimado >= 0 ? `margen ${mxn(k.margenMensualEstimado)}/mes` : `faltan ${mxn(Math.abs(k.margenMensualEstimado))}/mes`, claseCob)}
    ${kpi('Participación requerida', Number.isFinite(k.participacionRequeridaPct) ? pct(k.participacionRequeridaPct) : '—', `del mercado de la zona para equilibrio`, clasePart)}
    ${kpi('Certeza jurídica', k.nValidas ? pct(k.certezaPct, 0) : '—', 'escritura verificada / RPP')}
    ${kpi('Trazabilidad', k.nValidas ? pct(k.trazabilidadPct, 0) : '—', `${k.nConFuente} con URL de fuente`)}
    ${kpi('Competencia 1.5 km', k.competidores == null ? '—' : k.competidores, k.ventasPorCompetidor ? `${k.ventasPorCompetidor.toFixed(1)} ventas/año por competidor` : 'sin conteo DENUE')}
    ${kpi('Colchón de capital', `${k.colchonMeses} meses`, `${mxn(k.colchonMeses * k.costoMensual)} financiados`)}
  </div>

  <div class="seccion-titulo"><h2>Dictamen</h2><span class="puntaje">puntaje ponderado ${(d.puntaje * 100).toFixed(0)}/100</span></div>
  <div class="dictamen ${d.semaforo.clase}">
    <div class="dictamen-head">
      ${badge(d.semaforo, true)}
      <span class="muted chico">${esc(z.nombre || 'Zona sin nombre')} · ${esc([z.colonia, z.alcaldia].filter(Boolean).join(', ') || 'sin ubicación')}</span>
    </div>
    <p class="titular">${esc(d.titular)}</p>
    ${d.bloqueos.length ? `<div class="bloque-alerta"><strong>🔴 Bloqueos (${d.bloqueos.length}):</strong> impiden abrir con este polígono mientras no se resuelvan: <ul class="lista-acciones">${d.bloqueos.map((b) => `<li><strong>${esc(b.nombre)}</strong> — ${esc(b.valorTexto)}</li>`).join('')}</ul></div>` : ''}
    ${d.condiciones.length ? `<div class="bloque-aviso"><strong>🟡 Condiciones (${d.condiciones.length}):</strong> no bloquean, pero deben quedar documentadas en el expediente antes de firmar contrato de local.<ul class="lista-acciones">${d.condiciones.map((b) => `<li><strong>${esc(b.nombre)}</strong> — ${esc(b.mensaje)}</li>`).join('')}</ul></div>` : ''}
    ${siguientes}
    <div class="criterios">${criterios}</div>
  </div>

  <div class="seccion-titulo"><h2>Sensibilidad por rotación <span class="sub">el mismo polígono a 1.5%, 2.25% y 3% anual</span></h2></div>
  <div class="tabla-wrap">
    <table>
      <thead><tr>
        <th class="num">Rotación</th><th class="num">Ventas zona/año</th><th class="num">Ventas zona/mes</th>
        <th class="num">Participación requerida</th><th class="num">Ingreso oficina/mes</th>
        <th class="num">Cobertura</th><th class="num">Margen/mes</th>
      </tr></thead>
      <tbody>${filasEscalera}</tbody>
    </table>
  </div>
  <div class="nota mt">La participación requerida es el KPI que decide: dice qué fracción de <em>todas</em> las ventas del polígono necesita tu oficina solo para no perder dinero. Por encima de ${pct(estado.umbrales.participacionRojoPct, 0)} el plan depende de dominar el mercado local, y eso no ocurre en el año 1.</div>
  `;
}

/* --------------------------- tabla de inmuebles ------------------------- */

function tablaInmuebles(z) {
  const props = z.propiedades || [];
  const ed = estado.edicion ? props.find((p) => p.id === estado.edicion) : null;

  const filas = props.map((p) => {
    const est = ESTADO_POR_ID[p.estado] || ESTADO_POR_ID.valido;
    const malUrl = p.fuenteUrl && !urlValida(p.fuenteUrl);
    const escr = p.escriturado === 'si' ? '✅ RPP' : p.escriturado === 'no' ? '❌ Sin escritura' : '❔ No verificado';
    return `<tr class="${est.excluye ? 'excluida' : ''}">
      <td>${esc(p.tipo)}</td>
      <td class="num precio">${p.precio ? mxn(num(p.precio)) : '—'}</td>
      <td class="num">${p.m2 ? `${num(p.m2)} m²` : '—'}</td>
      <td class="num">${p.m2 && num(p.m2) > 0 && num(p.precio) > 0 ? mxn(num(p.precio) / num(p.m2)) : '—'}</td>
      <td>${esc(est.etiqueta)}</td>
      <td class="chico">${escr}</td>
      <td class="chico">${p.fuenteUrl ? (malUrl ? `⚠️ ${esc(String(p.fuenteUrl).slice(0, 34))}…` : `<a href="${esc(p.fuenteUrl)}" target="_blank" rel="noopener noreferrer">${esc((p.portal || 'fuente').slice(0, 18))}</a>`) : '<span class="muted">sin URL</span>'}</td>
      <td class="chico">${esc(p.fechaCaptura || '')}</td>
      <td class="fila">
        <button class="btn btn-chico" data-action="editar-inmueble" data-id="${esc(p.id)}" type="button">Editar</button>
        <button class="btn btn-chico btn-riesgo" data-action="borrar-inmueble" data-id="${esc(p.id)}" type="button">✕</button>
      </td>
    </tr>`;
  }).join('');

  const opcionesEstado = ESTADOS_PROPIEDAD
    .map((e) => `<option value="${e.id}" ${ed?.estado === e.id ? 'selected' : ''}>${esc(e.etiqueta)}</option>`).join('');
  const opcionesTipo = TIPOS_PROPIEDAD
    .map((t) => `<option value="${esc(t)}" ${ed?.tipo === t ? 'selected' : ''}>${esc(t)}</option>`).join('');
  const opcionesEscr = [['no_verificado', '❔ No verificado'], ['si', '✅ Escriturado / RPP'], ['no', '❌ Sin escritura']]
    .map(([v, t]) => `<option value="${v}" ${ed?.escriturado === v ? 'selected' : ''}>${t}</option>`).join('');

  return `
  <div class="seccion-titulo">
    <h2>Muestra de inmuebles <span class="sub">${props.length} capturados · ${(z.propiedades || []).filter((p) => !ESTADO_POR_ID[p.estado]?.excluye).length} válidos</span></h2>
    <span class="hint">Cada precio necesita URL de fuente. Sin fuente, el dato no entra al expediente.</span>
  </div>

  <div class="tarjeta">
    <div class="grid grid-4">
      <div class="campo"><label>Tipo</label><select id="in-tipo">${opcionesTipo}</select></div>
      <div class="campo"><label>Precio de publicación (MXN)</label><input id="in-precio" type="number" min="0" step="1000" placeholder="3200000" value="${ed ? esc(ed.precio) : ''}" /></div>
      <div class="campo"><label>Superficie (m²)</label><input id="in-m2" type="number" min="0" step="1" placeholder="100" value="${ed ? esc(ed.m2) : ''}" /></div>
      <div class="campo"><label>Estatus de la muestra</label><select id="in-estado">${opcionesEstado}</select></div>
      <div class="campo"><label>Certeza jurídica</label><select id="in-escriturado">${opcionesEscr}</select></div>
      <div class="campo"><label>URL de la publicación</label><input id="in-url" type="url" placeholder="https://www.inmuebles24.com/..." value="${ed ? esc(ed.fuenteUrl) : ''}" /></div>
      <div class="campo"><label>Portal / fuente</label><input id="in-portal" placeholder="Inmuebles24 / Propiedades.com / Lamudi" value="${ed ? esc(ed.portal) : ''}" /></div>
      <div class="campo"><label>Nota</label><input id="in-nota" placeholder="Ej. piso 5, sin estacionamiento" value="${ed ? esc(ed.nota) : ''}" /></div>
    </div>
    <div class="fila mt">
      <button class="btn btn-primario" data-action="guardar-inmueble" type="button">${ed ? '💾 Guardar cambios' : '+ Agregar inmueble'}</button>
      ${ed ? '<button class="btn" data-action="cancelar-edicion" type="button">Cancelar edición</button>' : ''}
      <span class="sep"></span>
      <span class="hint">Atajos: guarda con Enter en cualquier campo.</span>
    </div>

    <details class="mt">
      <summary class="link">Importación rápida por lote (pegar lista)</summary>
      <p class="hint mt">Pega un inmueble por línea. El orden de los campos es libre; se detectan por contenido. Ejemplos válidos:</p>
      <pre class="mono">Departamento, 3200000, 100, https://www.inmuebles24.com/x
Casa | 4,500,000 | 220 m2 | https://propiedades.com/y</pre>
      <textarea id="lote" class="mt" placeholder="Departamento, 3200000, 100, https://..."></textarea>
      <div class="fila mt">
        <button class="btn" data-action="importar-lote" type="button">Importar lote</button>
        <span class="hint">Palabras clave reconocidas: remate, cesión, juicio, contado, sin escritura, escriturado.</span>
      </div>
    </details>
  </div>

  ${props.length ? `<div class="tabla-wrap mt">
    <table>
      <thead><tr><th>Tipo</th><th class="num">Precio</th><th class="num">m²</th><th class="num">$/m²</th><th>Estatus</th><th>Certeza</th><th>Fuente</th><th>Captura</th><th></th></tr></thead>
      <tbody>${filas}</tbody>
    </table>
  </div>` : '<div class="vacio mt"><h3>Sin inmuebles capturados</h3><p>La Fase 0 exige una muestra mínima de 20 inmuebles válidos. Usa el formulario o la importación por lote.</p></div>'}
  `;
}

/* ---------------------------- vista: comparar --------------------------- */

function vistaComparar() {
  if (estado.zonas.length < 2) {
    return `<div class="vacio"><h3>Se necesitan al menos 2 zonas para comparar</h3>
      <p>Crea dos o tres polígonos candidatos y vuelve aquí para ver la comparación lado a lado.</p>
      <button class="btn btn-primario" data-action="nueva-zona" type="button">+ Nueva zona</button></div>`;
  }

  const sel = estado.comparar.filter((id) => estado.zonas.some((z) => z.id === id));
  if (!sel.length) estado.comparar = estado.zonas.slice(0, 3).map((z) => z.id);

  const pills = estado.zonas.map((z) => {
    const on = estado.comparar.includes(z.id);
    return `<button class="pill ${on ? 'activo' : ''}" data-action="toggle-comparar" data-id="${esc(z.id)}" type="button">${on ? '✓ ' : '+ '}${esc(z.nombre || 'Sin nombre')}</button>`;
  }).join('');

  const elegidas = estado.zonas.filter((z) => estado.comparar.includes(z.id));
  const dicts = elegidas.map((z) => ({ z, d: dictaminar(z, estado.umbrales, estado.escenario) }));

  const celdaMejor = (vals, idx, fmt, mayorMejor = true) => {
    const nums = vals.map((v) => (Number.isFinite(v) ? v : null));
    const validos = nums.filter((v) => v !== null);
    if (!validos.length) return fmt(vals[idx]);
    const mejor = mayorMejor ? Math.max(...validos) : Math.min(...validos);
    return nums[idx] === mejor ? `<span class="mejor">${fmt(vals[idx])}</span>` : fmt(vals[idx]);
  };

  const med = dicts.map((x) => x.d.kpis.precioMediana);
  const cob = dicts.map((x) => x.d.kpis.coberturaPct);
  const pr = dicts.map((x) => x.d.kpis.participacionRequeridaPct);
  const mar = dicts.map((x) => x.d.kpis.margenMensualEstimado);
  const mue = dicts.map((x) => x.d.kpis.nValidas);
  const piz = dicts.map((x) => x.d.puntaje * 100);

  const filas = [
    ['Dictamen', dicts.map((x) => badge(x.d.semaforo))],
    ['Puntaje ponderado', piz.map((v, i) => celdaMejor(piz, i, (x) => `${x.toFixed(0)}/100`))],
    ['Muestra válida', mue.map((v, i) => celdaMejor(mue, i, (x) => String(x)))],
    ['Mediana de precio', med.map((v, i) => celdaMejor(med, i, (x) => (x ? mxn(x) : '—')))],
    ['Comisión mediana al 6%', dicts.map((x) => mxn(x.d.kpis.comisionMediana))],
    ['Ticket mínimo requerido', dicts.map((x) => mxn(x.d.kpis.ticketMinimo))],
    ['Ventas de la zona / año', dicts.map((x) => `${x.d.kpis.ventasAnualesZona.toFixed(0)}`)],
    ['Ventas que captura la oficina', dicts.map((x) => x.d.kpis.ventasAnualesOficina.toFixed(1))],
    ['Ingreso mensual estimado', dicts.map((x) => mxn(x.d.kpis.ingresoMensualEstimado))],
    ['Cobertura del costo', cob.map((v, i) => celdaMejor(cob, i, (x) => pct(x, 0)))],
    ['Participación requerida', pr.map((v, i) => celdaMejor(pr, i, (x) => (Number.isFinite(x) ? pct(x) : '—'), false))],
    ['Margen mensual estimado', mar.map((v, i) => celdaMejor(mar, i, (x) => mxn(x)))],
    ['Certeza jurídica', dicts.map((x) => pct(x.d.kpis.certezaPct, 0))],
    ['Competidores 1.5 km', dicts.map((x) => (x.d.kpis.competidores == null ? '—' : String(x.d.kpis.competidores)))],
    ['Colchón de capital', dicts.map((x) => `${x.d.kpis.colchonMeses} meses`)],
    ['Bloqueos / condiciones', dicts.map((x) => `${x.d.bloqueos.length} / ${x.d.condiciones.length}`)],
  ];

  const fus = elegidas.length >= 2 ? fusionarZonas(elegidas, estado.umbrales, estado.escenario) : null;

  return `
  <div class="seccion-titulo">
    <h2>Comparar zonas candidatas <span class="sub">selecciona 2 o 3 polígonos</span></h2>
    <span class="hint">Verde = mejor valor de la fila. En "participación requerida" y "competidores", menos es mejor.</span>
  </div>
  <div class="tarjeta"><div class="comparar-barra">${pills}</div></div>

  <div class="tabla-wrap mt">
    <table>
      <thead><tr><th>Indicador</th>${elegidas.map((z) => `<th>${esc(z.nombre || 'Sin nombre')}<div class="muted chico">${esc([z.colonia, z.alcaldia].filter(Boolean).join(' · ') || '—')}</div></th>`).join('')}</tr></thead>
      <tbody>${filas.map(([k, vs]) => `<tr><th>${esc(k)}</th>${vs.map((v) => `<td>${v}</td>`).join('')}</tr>`).join('')}</tbody>
    </table>
  </div>

  ${fus ? `
  <div class="seccion-titulo"><h2>Lectura conjunta</h2></div>
  <div class="tarjeta">
    <p><strong>${fus.semaforo.icono} ${esc(fus.semaforo.etiqueta)}</strong> al promediar el comportamiento de las ${elegidas.length} zonas (${fus.kpis.nValidas} inmuebles válidos en conjunto, mediana ${mxn(fus.kpis.precioMediana)}).</p>
    <p class="chico muted">${esc(fus.titular)}</p>
    <div class="nota mt"><strong>Advertencia sobre fusionar polígonos:</strong> unir zonas mejora la muestra estadística, pero <em>no</em> crea capacidad comercial. La delimitación es de 5,500 propiedades por oficina y no se modifica: dos zonas son dos oficinas, no una más grande. La fusión aquí sirve para leer atractivo del mercado, no para diluir el punto de equilibrio.</div>
  </div>` : ''}

  <div class="seccion-titulo"><h2>Semáforo individual</h2></div>
  <div class="grid grid-3">
    ${elegidas.map((z) => {
      const d = dictaminar(z, estado.umbrales, estado.escenario);
      return `<article class="zona-card ${d.semaforo.clase}">
        <h3>${esc(z.nombre || 'Sin nombre')}</h3>
        <p class="zona-ubic">${esc([z.colonia, z.alcaldia].filter(Boolean).join(' · ') || 'Sin ubicación')}</p>
        ${badge(d.semaforo)}
        <p class="chico mt">${esc(d.titular)}</p>
        <div class="zona-pie"><span class="hint">${d.bloqueos.length} bloqueo(s) · ${d.condiciones.length} condición(es)</span>
        <button class="btn btn-chico" data-action="abrir-zona" data-id="${esc(z.id)}" type="button">Analizar →</button></div>
      </article>`;
    }).join('')}
  </div>`;
}

/* ------------------------------- vista: plan ---------------------------- */

function vistaPlan() {
  const fases = FASES.map((f) => {
    const abierta = estado.faseAbierta === f.id;
    const num = f.id.replace('f', '');
    const acciones = f.acciones.map((a) => {
      const tag = a.texto.startsWith('[SP2]') ? '<span class="tag tag-sp2">SP2</span>' : '<span class="tag tag-sp1">SP1</span>';
      return `<li>${tag} ${esc(a.texto.replace(/^\[SP[12]\]\s*/, ''))} <span class="muted chico">· ${esc(a.responsable || '')}</span></li>`;
    }).join('');
    const kpisFila = f.kpis.map((k) => `<tr>
      <td>${esc(k.nombre)}</td>
      <td class="chico">${esc(k.formula)}</td>
      <td class="chico">${esc(k.umbral)} <span class="tag tag-${k.origen.toLowerCase()}">${k.origen}</span></td>
      <td class="chico">${esc(k.fuente || '—')}</td>
    </tr>`).join('');

    return `<section class="fase">
      <div class="fase-head" data-action="toggle-fase" data-id="${f.id}">
        <div class="fase-num">F${num}</div>
        <div>
          <h3>${esc(f.nombre)}</h3>
          <div class="fase-periodo">${esc(f.periodo)}</div>
        </div>
        <span class="fase-chevron">${abierta ? '▲' : '▼'}</span>
      </div>
      ${abierta ? `<div class="fase-body">
        <p class="fase-objetivo">${esc(f.objetivo.replace(/^\[SP[12]\]\s*/, ''))}</p>
        <div class="seccion-titulo"><h2>Acciones</h2></div>
        <ul class="lista-acciones">${acciones}</ul>
        <div class="seccion-titulo"><h2>KPIs de la fase</h2></div>
        <div class="tabla-wrap"><table>
          <thead><tr><th>KPI</th><th>Cómo se calcula</th><th>Umbral</th><th>Fuente</th></tr></thead>
          <tbody>${kpisFila}</tbody>
        </table></div>
        <div class="seccion-titulo"><h2>Entregable</h2></div>
        <p class="chico">${esc(f.entregable)}</p>
        <div class="bloque-alerta"><strong>Alertas de riesgo de la fase:</strong>
          <ul class="lista-acciones">${f.alertasCriticas.map((a) => `<li>${esc(a)}</li>`).join('')}</ul></div>
      </div>` : ''}
    </section>`;
  }).join('');

  const derivadas = DERIVADAS.map((d) => `<tr><td>${esc(d.concepto)}</td><td class="num mono">${esc(d.valor)}</td><td class="chico muted">${esc(d.nota)}</td></tr>`).join('');

  return `
  <div class="seccion-titulo">
    <h2>Plan Maestro de 12 meses <span class="sub">5 fases · Fase 0 pre-apertura</span></h2>
    <span class="hint">Modelo financiero inmutable. Las cifras <span class="tag tag-sp2">SP2</span> vienen de tu modelo de apertura; las <span class="tag tag-sp1">SP1</span> son supuestos propuestos por AnalisisZonaTec y son editables.</span>
  </div>
  ${fases}

  <div class="seccion-titulo"><h2>Cifras derivadas del modelo</h2><span class="hint">aritmética verificable, sin supuestos externos</span></div>
  <div class="tabla-wrap"><table>
    <thead><tr><th>Concepto</th><th class="num">Valor</th><th>Trazabilidad</th></tr></thead>
    <tbody>${derivadas}</tbody>
  </table></div>

  <div class="seccion-titulo"><h2>Reglas duras de operación</h2></div>
  <ul class="lista-acciones">${REGLAS_DURAS.map((r) => `<li><span class="tag tag-${r.origen.toLowerCase()}">${r.origen}</span> ${esc(r.texto.replace(/^\[SP[12]\]\s*/, ''))}</li>`).join('')}</ul>
  `;
}

/* ------------------------------ vista: fuentes -------------------------- */

function vistaFuentes() {
  const tipoClase = { Oficial: 'tipo-oficial', Portal: 'tipo-portal', 'Consultora privada (paga)': 'tipo-privada', Franquiciador: 'tipo-franquiciador' };

  const fuentes = FUENTES.map((f) => `<div class="fuente">
    <div class="fila"><h4>${esc(f.nombre)}</h4><span class="tipo-fuente ${tipoClase[f.tipo] || 'tipo-portal'}">${esc(f.tipo)}</span>${f.verificada ? '' : '<span class="tag tag-sp1">URL SIN VERIFICAR</span>'}</div>
    ${f.url ? `<a href="${esc(f.url)}" target="_blank" rel="noopener noreferrer">${esc(f.url)}</a>` : '<span class="chico muted">Sin portal público: dato disponible solo vía franquiciador.</span>'}
    <p><strong>Para qué sirve:</strong> ${esc(f.uso)}</p>
    <p class="muted">${esc(f.nota)}</p>
  </div>`).join('');

  const umbralCampo = (campo, etiqueta, sufijo = '') => `<div class="campo">
    <label for="u-${campo}">${etiqueta}</label>
    <input id="u-${campo}" type="number" step="1" data-umbral="${campo}" value="${esc(estado.umbrales[campo])}" />
    <span class="campo-ayuda">${sufijo}</span>
  </div>`;

  return `
  <div class="seccion-titulo"><h2>Método, fuentes y límites</h2></div>

  <div class="tarjeta">
    <h3 class="mt">Cómo se construye el dictamen</h3>
    <ol class="lista-acciones">
      <li><strong>Muestra:</strong> se capturan inmuebles de la zona con precio, superficie, tipo y URL de la publicación.</li>
      <li><strong>Filtro obligatorio:</strong> se excluyen remates, cesiones de derechos, litigios, "solo contado", inmuebles sin escritura RPP y anuncios sin precio.</li>
      <li><strong>Estadística:</strong> mediana, P25/P75, precio por m² y dispersión de la muestra válida. La mediana manda sobre el promedio.</li>
      <li><strong>Ticket:</strong> precio mediano × 6% de comisión vs. costo operativo mensual (${mxn(MODELO.costoRealConBuffer)} con buffer o ${mxn(MODELO.costoEscenarioAlto)} en escenario alto).</li>
      <li><strong>Demanda:</strong> 5,500 propiedades × rotación anual = ventas de la zona; por captación asumida = ventas de tu oficina; se compara contra las ventas mínimas para cubrir el costo y se obtiene la <em>participación requerida</em>.</li>
      <li><strong>Cualitativos:</strong> certeza jurídica (RPP), competencia (DENUE) y trazabilidad (fuentes con URL).</li>
      <li><strong>Dictamen:</strong> ponderación de 8 criterios; cualquier criterio en rojo bloquea; el puntaje define verde (≥ 85) o amarillo.</li>
    </ol>
  </div>

  <div class="seccion-titulo"><h2>Fuentes de verificación</h2><span class="hint">dónde obtener cada dato que la app no puede inventar</span></div>
  <div class="grid grid-2">${fuentes}</div>

  <div class="seccion-titulo"><h2>Umbrales del dictamen <span class="sub">editables · criterio propuesto, no oficial</span></h2></div>
  <div class="tarjeta">
    <p class="chico muted">Estos umbrales <strong>no</strong> provienen del modelo financiero del franquiciatario ni de documentación oficial de TECNOCASA: son el criterio operativo con el que AnalisisZonaTec convierte números en semáforo. Ajústalos a tu realidad y valídalos con el franquiciador antes de usarlos como regla contractual.</p>
    <div class="grid grid-4 mt">
      ${umbralCampo('muestraMinima', 'Muestra mínima válida', 'inmuebles')}
      ${umbralCampo('muestraRobusta', 'Muestra robusta', 'inmuebles')}
      ${umbralCampo('certezaVerdePct', 'Certeza jurídica verde', '% escriturado')}
      ${umbralCampo('certezaAmarillaPct', 'Certeza jurídica roja', '% piso')}
      ${umbralCampo('participacionVerdePct', 'Participación requerida verde', '% del mercado')}
      ${umbralCampo('participacionRojoPct', 'Participación requerida roja', '% del mercado')}
      ${umbralCampo('competidoresVerde', 'Competidores verde', 'máximo')}
      ${umbralCampo('competidoresAmarillo', 'Competidores rojo', 'máximo')}
      ${umbralCampo('trazabilidadMinPct', 'Trazabilidad mínima', '% con URL')}
    </div>
    <div class="fila mt">
      <button class="btn" data-action="reset-umbrales" type="button">Restaurar umbrales sugeridos</button>
    </div>
  </div>

  <div class="seccion-titulo"><h2>Limitaciones explícitas</h2></div>
  <div class="nota">${esc(AVISO_LIMITACION)}</div>
  <div class="bloque-alerta mt"><strong>Dos supuestos propios de esta herramienta que debes validar antes de invertir:</strong>
    <ul class="lista-acciones">
      <li><strong>Captación de la oficina nueva:</strong> el modelo base estima las ventas de la zona, pero no especifica qué porcentaje captura una oficina recién abierta. Aquí se asume ${pct(SUPUESTOS.participacionMercadoAnio1Pct, 0)} en el año 1, editable. Si tu supuesto real es distinto, el dictamen cambia.</li>
      <li><strong>Rotación aplicada al polígono completo:</strong> se aplica la tasa de rotación (1.5%–3%) a las 5,500 propiedades del territorio como si todas fueran elegibles para tu oficina. En la práctica, parte del inventario no es comercializable (no está en venta, es de uso propio, o ya tiene mandato con otro competidor). Trátalo como techo teórico, no como cartera disponible.</li>
    </ul>
    ${esc(SUPUESTOS.nota)}
  </div>
  <div class="nota mt"><strong>Consistencia del desglose de costos:</strong> los mínimos del desglose suman $101,000 y los máximos $145,000. El costo base declarado ($120,000) queda en un punto medio del rango. Si varios conceptos se van a su máximo al mismo tiempo, el costo mensual llega a $145,000, es decir $1,000 por encima del escenario con buffer ($144,000). Conclusión: planea con el escenario alto ($160,000), no con el buffer.</div>`;
}

/* -------------------------------- eventos ------------------------------- */

document.addEventListener('click', (e) => {
  const objetivo = e.target.closest('[data-action], [data-vista], [data-escenario]');
  if (!objetivo) return;

  if (objetivo.dataset.vista) {
    estado.vista = objetivo.dataset.vista;
    if (estado.vista === 'detalle' && !zonaActual() && estado.zonas.length) estado.zonaId = estado.zonas[0].id;
    render();
    return;
  }

  if (objetivo.dataset.escenario) {
    estado.escenario = objetivo.dataset.escenario;
    guardar(); render();
    toast(`Escenario de costo: ${ESCENARIOS[estado.escenario].etiqueta} — ${mxn(ESCENARIOS[estado.escenario].costoMensual)}/mes`);
    return;
  }

  const id = objetivo.dataset.id;
  switch (objetivo.dataset.action) {
    case 'nueva-zona': {
      const z = nuevaZona({ nombre: `Zona ${estado.zonas.length + 1}` });
      estado.zonas.push(z);
      estado.zonaId = z.id;
      estado.vista = 'detalle';
      guardar(); render();
      toast('Zona creada. Captura la muestra de inmuebles para emitir dictamen.');
      break;
    }
    case 'abrir-zona':
      estado.zonaId = id; estado.vista = 'detalle'; estado.edicion = null;
      guardar(); render();
      break;
    case 'duplicar': {
      const orig = estado.zonas.find((z) => z.id === id);
      if (!orig) break;
      const copia = nuevaZona({ ...orig, id: undefined, nombre: `${orig.nombre} (copia)`,
        propiedades: (orig.propiedades || []).map((p) => nuevaPropiedad({ ...p, id: undefined })) });
      estado.zonas.push(copia);
      guardar(); render();
      toast('Zona duplicada.');
      break;
    }
    case 'borrar': {
      const z = estado.zonas.find((x) => x.id === id);
      if (!z) break;
      if (!confirm(`¿Borrar la zona "${z.nombre}" y sus ${(z.propiedades || []).length} inmuebles capturados? Esta acción no se puede deshacer.`)) break;
      estado.zonas = estado.zonas.filter((x) => x.id !== id);
      if (estado.zonaId === id) estado.zonaId = estado.zonas[0]?.id || null;
      estado.comparar = estado.comparar.filter((c) => c !== id);
      guardar(); render();
      toast('Zona eliminada.');
      break;
    }
    case 'cargar-expediente': {
      const archivo = objetivo.dataset.archivo;
      fetch(`expedientes/${archivo}`, { cache: 'no-store' })
        .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
        .then((d) => {
          if (!Array.isArray(d.zonas) || !d.zonas.length) throw new Error('El expediente no contiene zonas.');
          const nuevas = d.zonas.filter((z) => !estado.zonas.some((x) => x.id === z.id));
          estado.zonas.push(...nuevas);
          estado.zonaId = nuevas[0]?.id || estado.zonaId;
          if (d.umbrales) estado.umbrales = { ...UMBRALES_DEFAULT, ...d.umbrales };
          if (d.escenario) estado.escenario = d.escenario;
          estado.comparar = estado.zonas.slice(0, 3).map((z) => z.id);
          estado.vista = 'detalle';
          guardar(); render();
          toast(nuevas.length ? `Expediente cargado: ${nuevas.map((z) => z.nombre).join(', ')}` : 'Ese expediente ya estaba cargado.');
        })
        .catch((err) => toast(`No se pudo cargar el expediente: ${err.message}`));
      break;
    }
    case 'demo': {
      const z = zonaDemo();
      estado.zonas.push(z);
      estado.zonaId = z.id;
      estado.vista = 'detalle';
      guardar(); render();
      toast('Zona de ejemplo cargada. Los precios son ILUSTRATIVOS: reemplázalos por capturas reales con fuente.');
      break;
    }
    case 'guardar-inmueble': {
      guardarInmueble();
      break;
    }
    case 'cancelar-edicion':
      estado.edicion = null; render(); break;
    case 'editar-inmueble': {
      estado.edicion = id;
      render();
      document.querySelector('#in-precio')?.focus();
      break;
    }
    case 'borrar-inmueble': {
      const z = zonaActual(); if (!z) break;
      z.propiedades = (z.propiedades || []).filter((p) => p.id !== id);
      if (estado.edicion === id) estado.edicion = null;
      guardar(); render();
      break;
    }
    case 'importar-lote': {
      importarLote();
      break;
    }
    case 'toggle-fase':
      estado.faseAbierta = estado.faseAbierta === id ? null : id;
      render();
      break;
    case 'toggle-comparar': {
      const on = estado.comparar.includes(id);
      if (on) estado.comparar = estado.comparar.filter((c) => c !== id);
      else if (estado.comparar.length >= 3) { toast('Máximo 3 zonas para comparar. Quita una primero.'); break; }
      else estado.comparar.push(id);
      guardar(); render();
      break;
    }
    case 'copiar-expediente': {
      const z = zonaActual(); if (!z) break;
      const texto = resumenTexto(z, dictaminar(z, estado.umbrales, estado.escenario));
      navigator.clipboard?.writeText(texto)
        .then(() => toast('Expediente copiado al portapapeles.'))
        .catch(() => { descargar(`${z.nombre || 'expediente'}-analisiszonatec.txt`, texto, 'text/plain'); });
      break;
    }
    case 'reset-umbrales':
      estado.umbrales = { ...UMBRALES_DEFAULT };
      guardar(); render();
      toast('Umbrales restaurados al criterio sugerido.');
      break;
    case 'exportar': {
      const datos = JSON.stringify({ version: MODELO.version, exportado: new Date().toISOString(), zonas: estado.zonas, umbrales: estado.umbrales, escenario: estado.escenario }, null, 2);
      descargar('analisiszonatec-expediente.json', datos, 'application/json');
      toast('Expediente exportado.');
      break;
    }
    case 'importar':
      document.getElementById('archivo-import').click();
      break;
  }
});

/* Cambios en campos: se recalcula en vivo sin perder el foco. */
document.addEventListener('input', (e) => {
  const campo = e.target.dataset?.zcampo;
  if (campo) {
    const z = zonaActual(); if (!z) return;
    const v = e.target.value;
    z[campo] = ['nombre', 'colonia', 'alcaldia', 'cp', 'poligono', 'notas'].includes(campo) ? v : (v === '' ? '' : num(v));
    guardar();
    const cont = document.querySelector('#salida-analisis');
    if (cont) cont.innerHTML = panelAnalisis(z, dictaminar(z, estado.umbrales, estado.escenario));
    return;
  }
  const u = e.target.dataset?.umbral;
  if (u) {
    estado.umbrales[u] = e.target.value === '' ? UMBRALES_DEFAULT[u] : num(e.target.value);
    guardar();
  }
});

/* Enter guarda el inmueble */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target.closest('#in-precio, #in-m2, #in-url, #in-portal, #in-nota') && !e.shiftKey) {
    e.preventDefault();
    guardarInmueble();
  }
});

document.getElementById('archivo-import').addEventListener('change', (ev) => {
  const archivo = ev.target.files?.[0];
  if (!archivo) return;
  const lector = new FileReader();
  lector.onload = () => {
    try {
      const d = JSON.parse(String(lector.result));
      if (!Array.isArray(d.zonas)) throw new Error('El archivo no contiene zonas.');
      estado.zonas = d.zonas;
      estado.umbrales = { ...UMBRALES_DEFAULT, ...(d.umbrales || {}) };
      estado.escenario = d.escenario || 'buffer';
      estado.zonaId = estado.zonas[0]?.id || null;
      estado.comparar = estado.zonas.slice(0, 3).map((z) => z.id);
      guardar(); render();
      toast(`${estado.zonas.length} zona(s) importadas.`);
    } catch (err) {
      toast(`No se pudo importar: ${err.message}`);
    }
    ev.target.value = '';
  };
  lector.readAsText(archivo);
});

/* --------------------------- lógica de inmuebles ------------------------ */

function guardarInmueble() {
  const z = zonaActual(); if (!z) return;
  const fuenteUrl = String(document.querySelector('#in-url')?.value || '').trim();
  const portalEscrito = String(document.querySelector('#in-portal')?.value || '').trim();
  const datos = {
    tipo: document.querySelector('#in-tipo')?.value || 'Departamento',
    precio: num(document.querySelector('#in-precio')?.value),
    m2: num(document.querySelector('#in-m2')?.value),
    estado: document.querySelector('#in-estado')?.value || 'valido',
    escriturado: document.querySelector('#in-escriturado')?.value || 'no_verificado',
    fuenteUrl,
    portal: portalEscrito || portalDe(fuenteUrl),
    nota: String(document.querySelector('#in-nota')?.value || '').trim(),
  };

  if (!datos.precio && !ESTADO_POR_ID[datos.estado]?.excluye) {
    toast('Falta el precio de publicación: sin precio el inmueble no se puede evaluar.');
    return;
  }
  if (datos.fuenteUrl && !urlValida(datos.fuenteUrl)) {
    toast('La URL no parece válida. Corrige la fuente o déjala vacía (quedará marcada como no trazable).');
    return;
  }

  if (estado.edicion) {
    const p = (z.propiedades || []).find((x) => x.id === estado.edicion);
    if (p) Object.assign(p, datos);
    estado.edicion = null;
    toast('Inmueble actualizado.');
  } else {
    z.propiedades = [...(z.propiedades || []), nuevaPropiedad(datos)];
    toast('Inmueble agregado a la muestra.');
  }
  guardar();
  render();
  document.querySelector('#in-precio')?.focus();
}

function importarLote() {
  const z = zonaActual(); if (!z) return;
  const texto = document.querySelector('#lote')?.value || '';
  if (!texto.trim()) { toast('Pega al menos una línea para importar.'); return; }

  const nuevas = parsearLote(texto).filter((p) => p.precio > 0 || ESTADO_POR_ID[p.estado]?.excluye);
  if (!nuevas.length) { toast('No se reconoció ningún inmueble. Revisa el formato del ejemplo.'); return; }

  z.propiedades = [...(z.propiedades || []), ...nuevas];
  guardar(); render();
  const sinUrl = nuevas.filter((p) => !p.fuenteUrl).length;
  toast(`${nuevas.length} inmueble(s) importados.${sinUrl ? ` ${sinUrl} sin URL: marcados como no trazables.` : ''}`);
}

/* ------------------------------ utilidades ------------------------------ */

function descargar(nombre, contenido, tipo) {
  const blob = new Blob([contenido], { type: `${tipo};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = nombre;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

/* Zona de ejemplo: precios ILUSTRATIVOS generados por la herramienta.
 * Sirven para mostrar el mecanismo de cálculo — NO son precios de mercado. */
function zonaDemo() {
  const base = 2_100_000;
  const factores = [1.0, 0.85, 1.15, 0.95, 1.30, 0.78, 1.05, 1.22, 0.9, 1.42, 0.82, 1.12, 0.99, 1.35, 0.75, 1.08, 1.18, 0.88, 1.25, 1.02, 0.93, 1.45, 0.8, 1.1, 1.28, 0.86];
  const tipos = ['Departamento', 'Departamento', 'Casa', 'Departamento', 'Casa en condominio'];
  const props = factores.map((f, i) => nuevaPropiedad({
    direccion: '',
    tipo: tipos[i % tipos.length],
    precio: Math.round((base * f + i * 15_000) / 1000) * 1000,
    m2: 62 + (i % 7) * 12,
    estado: i === 7 ? 'remate' : i === 19 ? 'sin_escritura' : i === 24 ? 'solo_contado' : 'valido',
    escriturado: i === 19 ? 'no' : 'si',
    fuenteUrl: i === 5 || i === 17 ? '' : 'https://www.inmuebles24.com/ejemplo-ilustrativo',
    portal: 'Inmuebles24',
    nota: 'REGISTRO ILUSTRATIVO — no es un precio de mercado real',
  }));
  return nuevaZona({
    nombre: 'Zona de ejemplo (datos ilustrativos)',
    colonia: 'Colonia de ejemplo',
    alcaldia: 'Alcaldía de ejemplo',
    cp: '00000',
    poligono: 'Delimitación de ejemplo — reemplazar por el polígono real',
    rotacionPct: 1.8,
    participacionMercadoPct: SUPUESTOS.participacionMercadoAnio1Pct,
    competidoresNum: 7,
    colchonMeses: 12,
    notas: 'Zona generada por la herramienta para demostrar el cálculo. Sustituye los inmuebles por capturas reales con su URL antes de tomar cualquier decisión.',
    propiedades: props,
  });
}

/* --------------------------------- inicio ------------------------------- */

/* Expedientes publicados en el repositorio (opcional). Si no existen, la app
 * funciona igual: el usuario captura o importa su propio JSON. */
async function cargarExpedientesPublicados() {
  try {
    const r = await fetch('expedientes/index.json', { cache: 'no-store' });
    if (!r.ok) return;
    const d = await r.json();
    if (Array.isArray(d.expedientes) && d.expedientes.length) {
      estado.expedientes = d.expedientes;
      render();
    }
  } catch { /* servido sin carpeta de expedientes: se ignora */ }
}

if (!cargar()) {
  // Primera visita: se abre con el plan a la vista para entender el marco.
}
if (!estado.zonaId && estado.zonas.length) estado.zonaId = estado.zonas[0].id;
if (!estado.comparar.length && estado.zonas.length) estado.comparar = estado.zonas.slice(0, 3).map((z) => z.id);
render();
cargarExpedientesPublicados();
