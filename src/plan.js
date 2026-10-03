/* =============================================================================
 * AnalisisZonaTec — PLAN MAESTRO DE 12 MESES
 * -----------------------------------------------------------------------------
 * ETIQUETAS DE ORIGEN
 *   [SP2] = Dato provisto por el usuario (definición del agente TecnoLaunch AI).
 *   [SP1] = SUPUESTO PROPUESTO POR ANALISISZONATEC. NO es dato observado ni
 *           cifra oficial de TECNOCASA. Son metas operativas de diseño,
 *           pendientes de validar contra el manual de franquicia y contra los
 *           resultados reales de la red. Todo lo marcado [SP1] es EDITABLE.
 * ========================================================================== */

export const FASES = Object.freeze([
  /* ----------------------------- FASE 0 ------------------------------- */
  {
    id: 'f0',
    nombre: 'Segmentación y viabilidad',
    periodo: 'Meses -3 a -1 (PRE-APERTURA)',
    objetivo: '[SP2] Validar que la zona de 5,500 propiedades genera el ticket mínimo de $2.4M–$2.67M y tiene rotación suficiente.',
    acciones: [
      { id: 'f0-a1', texto: '[SP2] Solicitar colonia, código postal o polígono tentativos.', responsable: 'Franquiciatario' },
      { id: 'f0-a2', texto: '[SP2] Cruzar datos de portales (Inmuebles24, Propiedades.com, Lamudi) para obtener una muestra mínima de 20 inmuebles activos en la zona.', responsable: 'Franquiciatario' },
      { id: 'f0-a3', texto: '[SP2] Filtrar: eliminar remates, cesiones de derechos, propiedades sin escritura RPP, "solo contado" y juicios.', responsable: 'Franquiciatario' },
      { id: 'f0-a4', texto: '[SP2] Calcular precio promedio, mediana, comisión al 6% y balance vs. costo operativo ($144k–$160k).', responsable: 'AnalisisZonaTec' },
      { id: 'f0-a5', texto: '[SP2] Verificar rotación: estimar cuántas propiedades de las 5,500 se venden al año (tasa de rotación urbana CDMX: 1.5%–3%).', responsable: 'AnalisisZonaTec' },
      { id: 'f0-a6', texto: '[SP2] Verificar competencia: identificar cuántas inmobiliarias activas hay en el radio de 1.5 km.', responsable: 'Franquiciatario' },
      { id: 'f0-a7', texto: '[SP2] Verificar certeza jurídica: % de inmuebles escriturados vs. comunales/ejidales (fuente: Catastro CDMX / RPP).', responsable: 'Franquiciatario' },
      { id: 'f0-a8', texto: '[SP2] Emitir DICTAMEN: 🟢 VIABLE / 🟡 VIABLE CON CONDICIONES / 🔴 NO VIABLE.', responsable: 'AnalisisZonaTec' },
    ],
    kpis: [
      {
        id: 'muestra', nombre: 'Muestra válida',
        formula: 'Inmuebles capturados que pasan el filtro de exclusión',
        umbral: '[SP1] ≥ 20 válidos (≥ 30)',
        fuente: 'Inmuebles24 / Propiedades.com / Lamudi',
        origen: 'SP1',
      },
      {
        id: 'ticket', nombre: 'Ticket mediano vs. punto de equilibrio',
        formula: 'Mediana(precio) × 6% ≥ $144,000',
        umbral: '[SP2] ≥ $2,400,000 de precio',
        fuente: 'Portales (captura del usuario)',
        origen: 'SP2',
      },
      {
        id: 'cobertura', nombre: 'Cobertura del costo operativo',
        formula: '(5,500 × rotación × captación asumida) ÷ 12 × mediana × 6% ÷ costo mensual',
        umbral: '[SP1] ≥ 100%',
        fuente: 'Modelo + índice SHF para tendencia',
        origen: 'SP1',
      },
      {
        id: 'demanda', nombre: 'Participación de mercado requerida',
        formula: 'Ventas anuales necesarias para cubrir el costo ÷ ventas anuales del polígono',
        umbral: '[SP1] ≤ 15% verde | > 30% rojo',
        fuente: 'Cálculo propio sobre la rotación capturada',
        origen: 'SP1',
      },
      {
        id: 'certeza', nombre: 'Certeza jurídica',
        formula: '% de la muestra con folio real / escritura verificada',
        umbral: '[SP1] ≥ 80% (rojo < 60%)',
        fuente: 'RPP CDMX + Catastro CDMX (SIG / OVICA)',
        origen: 'SP1',
      },
      {
        id: 'competencia', nombre: 'Competencia en radio de 1.5 km',
        formula: 'Conteo de unidades SCIAN 5311 en el polígono',
        umbral: '[SP1] ≤ 8 verde | > 15 rojo',
        fuente: 'DENUE INEGI + recorrido físico',
        origen: 'SP1',
      },
      {
        id: 'trazabilidad', nombre: 'Trazabilidad del expediente',
        formula: '% de inmuebles válidos con URL de publicación',
        umbral: '[SP1] ≥ 80%',
        fuente: 'Expediente de captura',
        origen: 'SP1',
      },
      {
        id: 'colchon', nombre: 'Colchón de capital',
        formula: 'Meses de costo operativo financiados sin ingreso',
        umbral: '[SP1] ≥ 12 (rojo < 6)',
        fuente: 'Estados financieros del franquiciatario',
        origen: 'SP1',
      },
    ],
    entregable: 'Expediente de zona con dictamen semáforo y anexo de fuentes.',
    alertasCriticas: [
      'Menos de 20 inmuebles válidos capturados → el dictamen no es defendible.',
      'Cualquier KPI en rojo → no se firma contrato de local.',
      'Rotación supuesta por debajo de 1.5% → no existe escenario de cobertura.',
    ],
  },

  /* ----------------------------- FASE 1 ------------------------------- */
  {
    id: 'f1',
    nombre: 'Apertura y arranque operativo',
    periodo: 'Mes 1 (POST-APERTURA)',
    objetivo: '[SP1] Abrir la oficina operando: marca instalada, equipo contratado y primeros 15 inmuebles propios en cartera. El mes 1 no se mide por ventas, se mide por captación.',
    acciones: [
      { id: 'f1-a1', texto: '[SP1] Cerrar local y montar identidad de marca completa (fachada, vitrina, señalización, papelería).', responsable: 'Franquiciatario' },
      { id: 'f1-a2', texto: '[SP1] Contratar y capacitar al equipo base: 1 gerente, 1 admin y 3–4 asesores comisionistas.', responsable: 'Franquiciatario' },
      { id: 'f1-a3', texto: '[SP1] Alta en portales (Inmuebles24, Propiedades.com, Lamudi) y web de la oficina vinculada a la marca.', responsable: 'Franquiciatario' },
      { id: 'f1-a4', texto: '[SP1] Campaña de captación puerta a puerta por manzana: volanteo, lonas y pauta local de Facebook/Instagram (presupuesto modelo: $8k–$12k).', responsable: 'Gerente de oficina' },
      { id: 'f1-a5', texto: '[SP1] Levantar base de propietarios de la delimitación (5,500 propiedades): recorrido físico y cruce con Catastro CDMX.', responsable: 'Equipo de asesores' },
      { id: 'f1-a6', texto: '[SP1] Implementar guion de captación, mandato de exclusiva y expediente de propiedad (folio real, predial, uso de suelo).', responsable: 'Gerente de oficina' },
    ],
    kpis: [
      { id: 'f1-k1', nombre: 'Captaciones nuevas (mandatos firmados)', formula: 'Altas de cartera propia en el mes', umbral: '[SP1] 12–15', origen: 'SP1' },
      { id: 'f1-k2', nombre: 'Cartera activa al cierre', formula: 'Inmuebles captados y vigentes', umbral: '[SP1] ≥ 15', origen: 'SP1' },
      { id: 'f1-k3', nombre: 'Propietarios contactados', formula: 'Contactos efectivos del barrido de zona', umbral: '[SP1] 400–600', origen: 'SP1' },
      { id: 'f1-k4', nombre: 'Publicación de cartera', formula: 'Inmuebles con ficha en portales y web', umbral: '[SP1] 100% de la cartera', origen: 'SP1' },
      { id: 'f1-k5', nombre: 'Instalación de marca', formula: 'Checklist de identidad completo', umbral: '[SP1] 100%', origen: 'SP1' },
    ],
    entregable: 'Oficina operando con cartera inicial publicada y base de propietarios cargada.',
    alertasCriticas: [
      'Menos de 8 captaciones en el mes 1 → el problema es actividad del equipo, no mercado. Auditar agenda diaria.',
      'Rotación de asesores antes del mes 3 → revisar esquema de comisionamiento y perfil de contratación.',
    ],
  },

  /* ----------------------------- FASE 2 ------------------------------- */
  {
    id: 'f2',
    nombre: 'Tracción y primeras operaciones',
    periodo: 'Meses 2 a 4',
    objetivo: '[SP1] Cerrar las primeras 2–4 operaciones y validar que el ciclo completo captación → oferta → firma funciona con los precios de la zona.',
    acciones: [
      { id: 'f2-a1', texto: '[SP1] Operar rutina comercial semanal: lunes de cartera, miércoles de prospección, viernes de seguimiento de ofertas.', responsable: 'Gerente de oficina' },
      { id: 'f2-a2', texto: '[SP1] Medir Time on Market real de la cartera propia y ajustar precio de salida de inmuebles con más de 90 días publicados.', responsable: 'Gerente de oficina' },
      { id: 'f2-a3', texto: '[SP1] Abrir convenio con 2–3 bancos/brókers hipotecarios para precalificar compradores.', responsable: 'Franquiciatario' },
      { id: 'f2-a4', texto: '[SP1] Reforzar pauta digital en las manzanas con mayor respuesta de propietarios.', responsable: 'Marketing local' },
      { id: 'f2-a5', texto: '[SP1] Primer control de expediente: verificar folio real y gravamen de cada inmueble antes de publicar.', responsable: 'Admin' },
    ],
    kpis: [
      { id: 'f2-k1', nombre: 'Captaciones nuevas por mes', formula: 'Altas de cartera', umbral: '[SP1] 15–20', origen: 'SP1' },
      { id: 'f2-k2', nombre: 'Cartera activa', formula: 'Inmuebles vigentes', umbral: '[SP1] 45–60', origen: 'SP1' },
      { id: 'f2-k3', nombre: 'Visitas a propiedad', formula: 'Citas efectivas realizadas', umbral: '[SP1] 60–80/mes', origen: 'SP1' },
      { id: 'f2-k4', nombre: 'Ofertas emitidas', formula: 'Propuestas formales presentadas', umbral: '[SP1] 3–5/mes', origen: 'SP1' },
      { id: 'f2-k5', nombre: 'Ventas cerradas', formula: 'Operaciones escrituradas', umbral: '[SP1] 1 (mes 3) → 2 (mes 4)', origen: 'SP1' },
      { id: 'f2-k6', nombre: 'Días de captación a firma', formula: 'Promedio de días entre mandato y notaría', umbral: '[SP1] ≤ 90 días', origen: 'SP1' },
    ],
    entregable: 'Primeras 2–4 escrituras firmadas y proceso comercial documentado.',
    alertasCriticas: [
      'Cero ofertas al cierre del mes 3 → revisar precio de salida de la cartera antes de culpar al mercado: el 80% de los inmuebles que no se venden están mal preciados.',
      'Cartera con 0% de exclusivas → la oficina está compitiendo contra sí misma con otros anunciantes.',
    ],
  },

  /* ----------------------------- FASE 3 ------------------------------- */
  {
    id: 'f3',
    nombre: 'Productividad y punto de equilibrio',
    periodo: 'Meses 5 a 8',
    objetivo: `[SP1] Alcanzar y sostener el punto de equilibrio: 2 ventas al mes a ticket mediano ≥ $2.4M producen ${'$'}288,000 MXN de ingreso bruto, suficiente para cubrir el costo con buffer y generar margen.`,
    acciones: [
      { id: 'f3-a1', texto: '[SP1] Instalar tablero de productividad por asesor (captaciones, visitas, ofertas, cierres) y revisarlo semanalmente.', responsable: 'Gerente de oficina' },
      { id: 'f3-a2', texto: '[SP1] Reforzar captación de exclusivas: meta de 50% de la cartera en mandato exclusivo.', responsable: 'Equipo de asesores' },
      { id: 'f3-a3', texto: '[SP1] Activar convenios con notarías y gestores para acelerar cierre y postventa.', responsable: 'Admin' },
      { id: 'f3-a4', texto: '[SP1] Depurar cartera: dar de baja inmuebles sin actividad a 120 días o renegociar precio con el propietario.', responsable: 'Gerente de oficina' },
      { id: 'f3-a5', texto: '[SP1] Plan de choque si dos meses consecutivos cierran por debajo de $120,000 de ingreso: barrido de zona dirigido y revisión de precios de cartera completa.', responsable: 'Franquiciatario' },
    ],
    kpis: [
      { id: 'f3-k1', nombre: 'Ventas cerradas por mes', formula: 'Operaciones escrituradas', umbral: '[SP1] ≥ 2 sostenido', origen: 'SP1' },
      { id: 'f3-k2', nombre: 'Ingreso mensual por comisiones', formula: 'Ventas × ticket × 6%', umbral: '[SP1] ≥ $144,000', origen: 'SP1' },
      { id: 'f3-k3', nombre: 'Cartera activa', formula: 'Inmuebles vigentes', umbral: '[SP1] 80–120', origen: 'SP1' },
      { id: 'f3-k4', nombre: 'Ratio cartera/ventas', formula: 'Cartera ÷ ventas del mes', umbral: '[SP1] ≈ 8:1', origen: 'SP1' },
      { id: 'f3-k5', nombre: '% de exclusivas', formula: 'Exclusivas ÷ cartera total', umbral: '[SP1] ≥ 50%', origen: 'SP1' },
      { id: 'f3-k6', nombre: 'Ventas por asesor', formula: 'Ventas del mes ÷ asesores activos', umbral: '[SP1] ≥ 0.5/mes', origen: 'SP1' },
    ],
    entregable: 'Punto de equilibrio sostenido 3 meses consecutivos con margen operativo positivo.',
    alertasCriticas: [
      'Dos meses consecutivos por debajo de $120,000 de ingreso → plan de choque obligatorio (Fase 3, acción 5).',
      'Ticket promedio de cartera por debajo de $2.4M → la cartera migró de segmento: reencauzar captación.',
    ],
  },

  /* ----------------------------- FASE 4 ------------------------------- */
  {
    id: 'f4',
    nombre: 'Consolidación y decisión de escala',
    periodo: 'Meses 9 a 12',
    objetivo: '[SP1] Consolidar 3+ ventas al mes, margen operativo ≥ 20% y decidir con datos si se abre segunda oficina o se profundiza la penetración del polígono actual. La delimitación de 5,500 propiedades no se modifica.',
    acciones: [
      { id: 'f4-a1', texto: '[SP1] Auditoría de calidad de cartera: depuración y renovación de inventario a 150+ inmuebles activos.', responsable: 'Gerente de oficina' },
      { id: 'f4-a2', texto: '[SP1] Programa de reputación: metas de reseñas Google ≥ 4.5★ y referencias de clientes cerrados.', responsable: 'Marketing local' },
      { id: 'f4-a3', texto: '[SP1] Análisis de rentabilidad por tipología y manzana: identificar el 20% del polígono que produce el 80% de los cierres.', responsable: 'Franquiciatario' },
      { id: 'f4-a4', texto: '[SP1] Evaluación de segunda oficina: solo si la primera sostiene 3 ventas/mes y el polígono colinda con un área de 5,500 propiedades adicionales sin canibalizar la delimitación.', responsable: 'Franquiciatario' },
      { id: 'f4-a5', texto: '[SP1] Renovar planeación anual con el modelo financiero actualizado y los datos reales de 12 meses.', responsable: 'Franquiciatario' },
    ],
    kpis: [
      { id: 'f4-k1', nombre: 'Ventas cerradas por mes', formula: 'Operaciones escrituradas', umbral: '[SP1] ≥ 3', origen: 'SP1' },
      { id: 'f4-k2', nombre: 'Ingreso mensual por comisiones', formula: 'Ventas × ticket × 6%', umbral: `[SP1] ≥ $216,000`, origen: 'SP1' },
      { id: 'f4-k3', nombre: 'Margen operativo', formula: '(Ingreso − costo operativo) ÷ ingreso', umbral: '[SP1] ≥ 20%', origen: 'SP1' },
      { id: 'f4-k4', nombre: 'Cartera activa', formula: 'Inmuebles vigentes', umbral: '[SP1] ≥ 150', origen: 'SP1' },
      { id: 'f4-k5', nombre: 'Reputación', formula: 'Calificación promedio en Google', umbral: '[SP1] ≥ 4.5★', origen: 'SP1' },
      { id: 'f4-k6', nombre: 'Eficiencia por asesor', formula: 'Ventas trimestrales ÷ asesores', umbral: '[SP1] ≥ 1/trimestre', origen: 'SP1' },
    ],
    entregable: 'Expediente de 12 meses con decisión documentada: segunda oficina o profundización del polígono.',
    alertasCriticas: [
      'Ventas por asesor por debajo de 0.5/trimestre → problema de cobertura de zona o de perfil de contratación, no de esfuerzo.',
      'Margen por debajo de 10% con 3 ventas al mes → revisar estructura de costo fijo y regalías con el franquiciador.',
    ],
  },
]);

export const FASE_POR_ID = Object.freeze(Object.fromEntries(FASES.map((f) => [f.id, f])));

/* ---------------------------------------------------------------------------
 * CIFRAS DERIVADAS DEL MODELO (todas trazables a las cifras [SP2])
 * ------------------------------------------------------------------------ */
export const DERIVADAS = Object.freeze([
  { concepto: 'Costo operativo base mensual', valor: '$120,000 MXN', nota: '[SP2] Suma del desglose del modelo.' },
  { concepto: 'Colchón de seguridad (+20%)', valor: '$24,000 MXN', nota: '[SP2] 120,000 × 0.20.' },
  { concepto: 'Costo operativo real con buffer', valor: '$144,000 MXN/mes', nota: '[SP2] Escenario de trabajo.' },
  { concepto: 'Escenario conservador alto', valor: '$160,000 MXN/mes', nota: '[SP2] Techo del rango.' },
  { concepto: 'Ticket mínimo (buffer 144k)', valor: '$2,400,000 MXN', nota: '[SP2] 144,000 ÷ 0.06.' },
  { concepto: 'Ticket mínimo (alto 160k)', valor: '$2,666,667 MXN', nota: '[SP2] 160,000 ÷ 0.06.' },
  { concepto: 'Costo operativo anual (buffer)', valor: '$1,728,000 MXN', nota: '[SP1 derivado] 144,000 × 12.' },
  { concepto: 'Comisión requerida anual (buffer)', valor: '$1,728,000 MXN', nota: '[SP1 derivado] Igual al costo anual.' },
  { concepto: 'Ventas anuales requeridas a ticket $2.4M', valor: '12 operaciones/año', nota: '[SP1 derivado] 1,728,000 ÷ (2.4M × 0.06) = 1 por mes.' },
  { concepto: 'Ventas anuales requeridas a ticket $2.67M', valor: '10.8 operaciones/año', nota: '[SP1 derivado] 160,000 ÷ (2.67M × 0.06) ≈ 1 por mes con margen.' },
  { concepto: 'Rotación requerida si el ticket mediano fuera el mínimo', valor: '0.22% anual (escenario alto: 0.24%) → 12 a 13.3 ventas/año', nota: '[SP1 derivado] 12 ÷ 5,500 = 0.218% y 13.33 ÷ 5,500 = 0.242%. Exigencia muy por debajo del rango del modelo (1.5%–3%), por lo que el riesgo real NO es la rotación de la ciudad sino tu captación efectiva.' },
  { concepto: 'Ingreso a 3 ventas/mes (ticket $2.4M)', valor: '$432,000 MXN/mes', nota: '[SP1 derivado] 3 × 2.4M × 6%.' },
  { concepto: 'Margen a 3 ventas/mes vs. costo con buffer', valor: '$288,000 MXN/mes', nota: '[SP1 derivado] 432,000 − 144,000. Coincide con el margen que usa la Fase 4.' },
]);

/* Reglas duras que NO se negocian en la operación. */
export const REGLAS_DURAS = Object.freeze([
  { texto: '[SP2] Delimitación territorial de 5,500 propiedades por oficina. No se modifica.', origen: 'SP2' },
  { texto: '[SP2] Comisión estándar 6% del precio de venta (vendedor, comprador o split 3%+3% según mercado local).', origen: 'SP2' },
  { texto: '[SP2] No se inventan datos de mercado: si no es verificable, se declara y se indica la fuente donde obtenerlo.', origen: 'SP2' },
  { texto: '[SP2] Ningún inmueble sin escritura RPP entra a la muestra ni a la cartera.', origen: 'SP2' },
  { texto: '[SP1] El inventario de 5,500 propiedades es el techo de captación, no el techo de ventas: las ventas dependen de la actividad comercial del equipo.', origen: 'SP1' },
]);
