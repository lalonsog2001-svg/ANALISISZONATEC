/* =============================================================================
 * AnalisisZonaTec — FUENTES DE DATOS VERIFICABLES
 * -----------------------------------------------------------------------------
 * REGLA DEL AGENTE: no se inventan datos de mercado. Si un dato no es
 * verificable, se declara y se indica dónde obtenerlo.
 *
 * Las URLs listadas fueron revisadas en la construcción de esta herramienta.
 * Aun así, verifica siempre en el portal antes de usarlas en un expediente:
 * los organismos migran de dominio y las páginas de trámites cambian.
 * ========================================================================== */

export const FUENTES = Object.freeze([
  {
    id: 'inmuebles24',
    nombre: 'Inmuebles24',
    tipo: 'Portal',
    uso: 'Muestra de inmuebles activos: precio de publicación, colonia, m², tipo. Fuente primaria para el cálculo de mediana y ticket.',
    url: 'https://www.inmuebles24.com/',
    verificada: true,
    nota: 'Los precios de portal son precios DE OFERTA, no de cierre. Aplicar descuento de negociación antes de dictaminar.',
  },
  {
    id: 'propiedades',
    nombre: 'Propiedades.com',
    tipo: 'Portal',
    uso: 'Muestra de respaldo y cruce de precios. Publica indicadores de Time on Market por zona.',
    url: 'https://propiedades.com/',
    verificada: true,
    nota: 'El portal publica análisis de Time on Market (días/meses que un anuncio permanece activo). Útil para estimar rotación real, no la del modelo.',
  },
  {
    id: 'lamudi',
    nombre: 'Lamudi',
    tipo: 'Portal',
    uso: 'Tercera fuente de cruce para validar que el precio no es un artefacto de un solo portal.',
    url: 'https://www.lamudi.com.mx/',
    verificada: true,
    nota: 'Se recomienda triangular: 60% de la muestra en Inmuebles24, 25% en Propiedades.com, 15% en Lamudi.',
  },
  {
    id: 'sigcdmx',
    nombre: 'Sistema Abierto de Información Geográfica (SIG CDMX)',
    tipo: 'Oficial',
    uso: 'Valor catastral de suelo y ficha por predio. Descarga CSV/Shapefile por alcaldía con cuenta catastral, superficie, uso de suelo y niveles.',
    url: 'https://sig.cdmx.gob.mx/datos/descarga',
    verificada: true,
    nota: 'Fuente oficial del Catastro de la CDMX (Secretaría de Finanzas). Ideal para validar precio publicado vs. valor catastral y detectar sobrevaloración.',
  },
  {
    id: 'ovica',
    nombre: 'OVICA — Oficina Virtual del Catastro CDMX',
    tipo: 'Oficial',
    uso: 'Cédula catastral, clave catastral, cuenta predial, constancias de medidas y colindancias.',
    url: 'https://ovica.finanzas.cdmx.gob.mx/',
    verificada: true,
    nota: 'Trámite oficial. Sirve para cerrar la certeza jurídica del predio antes de captarlo.',
  },
  {
    id: 'rpp',
    nombre: 'Registro Público de la Propiedad y de Comercio CDMX',
    tipo: 'Oficial',
    uso: 'Verificación de escritura, folio real, gravámenes y limitaciones de dominio. Filtro obligatorio de la Fase 0: inmuebles sin escritura quedan fuera de la muestra.',
    url: 'https://data.consejeria.cdmx.gob.mx/index.php/dgrppyc',
    verificada: true,
    nota: 'La Dirección General del Registro Público de la Propiedad depende de la Consejería Jurídica y de Servicios Legales. Portal con consulta y seguimiento de trámites.',
  },
  {
    id: 'denue',
    nombre: 'DENUE — INEGI (Directorio Estadístico Nacional de Unidades Económicas)',
    tipo: 'Oficial',
    uso: 'Conteo exacto de competencia: filtrar SCIAN 5311 (servicios inmobiliarios) y 5312 en el polígono de operación. Conteo de servicios, bancos, escuelas y comercio para lectura de zona.',
    url: 'https://www.inegi.org.mx/app/mapa/denue/',
    verificada: true,
    nota: 'Gracias a esta fuente el criterio de "inmobiliarias en radio de 1.5 km" pasa de estimación subjetiva a conteo auditable.',
  },
  {
    id: 'shf',
    nombre: 'Índice SHF de Precios de la Vivienda (Sociedad Hipotecaria Federal)',
    tipo: 'Oficial',
    uso: 'Tendencia de precios por ciudad/entidad. Valida si la zona está apreciando, plana o corrigiendo; evita asumir plusvalía no verificada.',
    url: 'https://transparencia.shf.gob.mx/sitepages/IndicePV.aspx',
    verificada: true,
    nota: 'Datos abiertos en CSV. INEGI también publica series del mercado de vivienda (créditos, precios).',
  },
  {
    id: 'datosabiertos',
    nombre: 'Portal de Datos Abiertos de la CDMX',
    tipo: 'Oficial',
    uso: 'Bases descargables (CSV) de trámites, licencias, uso de suelo y estadística de la ciudad para construir la ficha de la zona.',
    url: 'https://datos.cdmx.gob.mx/',
    verificada: true,
    nota: 'Licencias de construcción y uso de suelo ayudan a prever competencia nueva (nuevos desarrollos).',
  },
  {
    id: 'tinsa',
    nombre: 'Tinsa México / Softec',
    tipo: 'Consultora privada (paga)',
    uso: 'Inventario, absorción y time on market por segmento. Es el estándar para medir rotación real sin depender de portales.',
    url: 'https://www.tinsa.com.mx/',
    verificada: false,
    nota: 'NO VERIFICADO EN ESTA HERRAMIENTA: URL y disponibilidad no confirmadas. Si no contratas el reporte, decláralo como limitación del dictamen.',
  },
  {
    id: 'tecnocasa',
    nombre: 'Dirección de Franquicias TECNOCASA México',
    tipo: 'Franquiciador',
    uso: 'Única fuente válida para: monto y estructura de la regalía, fondo publicitario, manual de marca y la regla de delimitación territorial de 5,500 propiedades.',
    url: null,
    verificada: false,
    nota: 'NO VERIFICADO: la app no tiene acceso a documentación interna de la franquicia. Solicita el contrato de franquicia y el manual de operaciones vigente.',
  },
]);

export const FUENTE_POR_ID = Object.freeze(
  Object.fromEntries(FUENTES.map((f) => [f.id, f]))
);

/* Cómo se obtiene, paso a paso, el dato correcto de cada criterio de Fase 0.
 * Se usa en las alertas del dictamen para decirle al usuario QUÉ hacer, no solo
 * que algo está mal. */
export const RUTA_VERIFICACION = Object.freeze({
  muestra: 'Documenta al menos 20 inmuebles válidos. Captura precio, m², colonia, tipo y URL de Inmuebles24 / Propiedades.com / Lamudi. Sin URL, el dato no entra al expediente.',
  ticket: 'Eleva la calidad de la muestra: filtra por tipología (departamento/casa) y descarta la cola de inmuebles atípicos. Si la mediana no alcanza el ticket mínimo, la zona no sostiene la estructura: replantea polígono o escenario de costo.',
  cobertura: 'Mide el Time on Market real en portales (~2–4 meses en zonas líquidas de CDMX) y contrasta contra el supuesto de rotación. Si la zona no absorbe, ajusta supuesto o busca otra colonia.',
  certeza: 'Criterio sin medir ≠ criterio en cero. Verifica folio real, titular y gravámenes de CADA inmueble de la muestra en el RPP CDMX, y contrasta titular registral vs. poseedor actual (ejemplo: en San Bartolo Ameyalco el DOF del 18/11/1994 documentó que "un gran porcentaje" de los antecedentes registrales no coincide con el inmueble que amparan). Complementa con cuenta catastral y valor de suelo en SIG CDMX / OVICA, y con el estado de los polígonos de regularización (DGRT).',
  competencia: 'Conteo exacto en DENUE (SCIAN 5311 servicios inmobiliarios) dentro del polígono de 1.5 km. Complementa con recorrido físico para detectar oficinas no registradas o cerradas.',
  trazabilidad: 'Cada cifra del expediente debe tener fuente y URL. Un dictamen con menos de 80% de trazabilidad es una opinión, no un análisis.',
  colchon: 'Recalcula el capital: cada mes de operación sin ventas cuesta entre $144,000 y $160,000 MXN. Define el número de meses que puedes financiar sin ingreso antes de firmar.',
});

export const AVISO_LIMITACION = `AnalisisZonaTec no se conecta a portales inmobiliarios, al RPP, al Catastro ni a INEGI. No descarga datos de mercado ni los estima.
Todas las cifras de mercado las captura el usuario y quedan registradas con su fuente y URL.
Si un campo aparece marcado como SUPUESTO, es una estimación de diseño pendiente de verificación, no un dato observado.`;
