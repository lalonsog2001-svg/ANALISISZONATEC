# Plan Maestro de 12 Meses — Apertura de oficina franquiciada

> **Documento generado automáticamente** desde `src/plan.js` por `npm run docs`.
> No editar a mano: cualquier cambio se hace en el código y se regenera.

Las cifras marcadas `SP2` provienen del modelo de apertura del franquiciatario. Las marcadas `SP1`
son **supuestos operativos propuestos por AnalisisZonaTec** (metas de diseño, no datos observados ni
documentación oficial de TECNOCASA) y son editables.

---

## Fase 0 — Segmentación y viabilidad

**Periodo:** Meses -3 a -1 (PRE-APERTURA)

**Objetivo:** Validar que la zona de 5,500 propiedades genera el ticket mínimo de $2.4M–$2.67M y tiene rotación suficiente.

### Acciones

| # | Acción | Responsable | Origen |
| --- | --- | --- | --- |
| 1 | Solicitar colonia, código postal o polígono tentativos. | Franquiciatario | SP2 |
| 2 | Cruzar datos de portales (Inmuebles24, Propiedades.com, Lamudi) para obtener una muestra mínima de 20 inmuebles activos en la zona. | Franquiciatario | SP2 |
| 3 | Filtrar: eliminar remates, cesiones de derechos, propiedades sin escritura RPP, "solo contado" y juicios. | Franquiciatario | SP2 |
| 4 | Calcular precio promedio, mediana, comisión al 6% y balance vs. costo operativo ($144k–$160k). | AnalisisZonaTec | SP2 |
| 5 | Verificar rotación: estimar cuántas propiedades de las 5,500 se venden al año (tasa de rotación urbana CDMX: 1.5%–3%). | AnalisisZonaTec | SP2 |
| 6 | Verificar competencia: identificar cuántas inmobiliarias activas hay en el radio de 1.5 km. | Franquiciatario | SP2 |
| 7 | Verificar certeza jurídica: % de inmuebles escriturados vs. comunales/ejidales (fuente: Catastro CDMX / RPP). | Franquiciatario | SP2 |
| 8 | Emitir DICTAMEN: 🟢 VIABLE / 🟡 VIABLE CON CONDICIONES / 🔴 NO VIABLE. | AnalisisZonaTec | SP2 |

### KPIs de la fase

| KPI | Cómo se calcula | Umbral | Fuente | Origen |
| --- | --- | --- | --- | --- |
| **Muestra válida** | Inmuebles capturados que pasan el filtro de exclusión | [SP1] ≥ 20 válidos (≥ 30) | Inmuebles24 / Propiedades.com / Lamudi | SP1 |
| **Ticket mediano vs. punto de equilibrio** | Mediana(precio) × 6% ≥ $144,000 | [SP2] ≥ $2,400,000 de precio | Portales (captura del usuario) | SP2 |
| **Cobertura del costo operativo** | (5,500 × rotación × captación asumida) ÷ 12 × mediana × 6% ÷ costo mensual | [SP1] ≥ 100% | Modelo + índice SHF para tendencia | SP1 |
| **Participación de mercado requerida** | Ventas anuales necesarias para cubrir el costo ÷ ventas anuales del polígono | [SP1] ≤ 15% verde \| > 30% rojo | Cálculo propio sobre la rotación capturada | SP1 |
| **Certeza jurídica** | % de la muestra con folio real / escritura verificada | [SP1] ≥ 80% (rojo < 60%) | RPP CDMX + Catastro CDMX (SIG / OVICA) | SP1 |
| **Competencia en radio de 1.5 km** | Conteo de unidades SCIAN 5311 en el polígono | [SP1] ≤ 8 verde \| > 15 rojo | DENUE INEGI + recorrido físico | SP1 |
| **Trazabilidad del expediente** | % de inmuebles válidos con URL de publicación | [SP1] ≥ 80% | Expediente de captura | SP1 |
| **Colchón de capital** | Meses de costo operativo financiados sin ingreso | [SP1] ≥ 12 (rojo < 6) | Estados financieros del franquiciatario | SP1 |

**Entregable:** Expediente de zona con dictamen semáforo y anexo de fuentes.

### Alertas de riesgo

- ⚠️ Menos de 20 inmuebles válidos capturados → el dictamen no es defendible.
- ⚠️ Cualquier KPI en rojo → no se firma contrato de local.
- ⚠️ Rotación supuesta por debajo de 1.5% → no existe escenario de cobertura.

---

## Fase 1 — Apertura y arranque operativo

**Periodo:** Mes 1 (POST-APERTURA)

**Objetivo:** Abrir la oficina operando: marca instalada, equipo contratado y primeros 15 inmuebles propios en cartera. El mes 1 no se mide por ventas, se mide por captación.

### Acciones

| # | Acción | Responsable | Origen |
| --- | --- | --- | --- |
| 1 | Cerrar local y montar identidad de marca completa (fachada, vitrina, señalización, papelería). | Franquiciatario | SP1 |
| 2 | Contratar y capacitar al equipo base: 1 gerente, 1 admin y 3–4 asesores comisionistas. | Franquiciatario | SP1 |
| 3 | Alta en portales (Inmuebles24, Propiedades.com, Lamudi) y web de la oficina vinculada a la marca. | Franquiciatario | SP1 |
| 4 | Campaña de captación puerta a puerta por manzana: volanteo, lonas y pauta local de Facebook/Instagram (presupuesto modelo: $8k–$12k). | Gerente de oficina | SP1 |
| 5 | Levantar base de propietarios de la delimitación (5,500 propiedades): recorrido físico y cruce con Catastro CDMX. | Equipo de asesores | SP1 |
| 6 | Implementar guion de captación, mandato de exclusiva y expediente de propiedad (folio real, predial, uso de suelo). | Gerente de oficina | SP1 |

### KPIs de la fase

| KPI | Cómo se calcula | Umbral | Fuente | Origen |
| --- | --- | --- | --- | --- |
| **Captaciones nuevas (mandatos firmados)** | Altas de cartera propia en el mes | [SP1] 12–15 | — | SP1 |
| **Cartera activa al cierre** | Inmuebles captados y vigentes | [SP1] ≥ 15 | — | SP1 |
| **Propietarios contactados** | Contactos efectivos del barrido de zona | [SP1] 400–600 | — | SP1 |
| **Publicación de cartera** | Inmuebles con ficha en portales y web | [SP1] 100% de la cartera | — | SP1 |
| **Instalación de marca** | Checklist de identidad completo | [SP1] 100% | — | SP1 |

**Entregable:** Oficina operando con cartera inicial publicada y base de propietarios cargada.

### Alertas de riesgo

- ⚠️ Menos de 8 captaciones en el mes 1 → el problema es actividad del equipo, no mercado. Auditar agenda diaria.
- ⚠️ Rotación de asesores antes del mes 3 → revisar esquema de comisionamiento y perfil de contratación.

---

## Fase 2 — Tracción y primeras operaciones

**Periodo:** Meses 2 a 4

**Objetivo:** Cerrar las primeras 2–4 operaciones y validar que el ciclo completo captación → oferta → firma funciona con los precios de la zona.

### Acciones

| # | Acción | Responsable | Origen |
| --- | --- | --- | --- |
| 1 | Operar rutina comercial semanal: lunes de cartera, miércoles de prospección, viernes de seguimiento de ofertas. | Gerente de oficina | SP1 |
| 2 | Medir Time on Market real de la cartera propia y ajustar precio de salida de inmuebles con más de 90 días publicados. | Gerente de oficina | SP1 |
| 3 | Abrir convenio con 2–3 bancos/brókers hipotecarios para precalificar compradores. | Franquiciatario | SP1 |
| 4 | Reforzar pauta digital en las manzanas con mayor respuesta de propietarios. | Marketing local | SP1 |
| 5 | Primer control de expediente: verificar folio real y gravamen de cada inmueble antes de publicar. | Admin | SP1 |

### KPIs de la fase

| KPI | Cómo se calcula | Umbral | Fuente | Origen |
| --- | --- | --- | --- | --- |
| **Captaciones nuevas por mes** | Altas de cartera | [SP1] 15–20 | — | SP1 |
| **Cartera activa** | Inmuebles vigentes | [SP1] 45–60 | — | SP1 |
| **Visitas a propiedad** | Citas efectivas realizadas | [SP1] 60–80/mes | — | SP1 |
| **Ofertas emitidas** | Propuestas formales presentadas | [SP1] 3–5/mes | — | SP1 |
| **Ventas cerradas** | Operaciones escrituradas | [SP1] 1 (mes 3) → 2 (mes 4) | — | SP1 |
| **Días de captación a firma** | Promedio de días entre mandato y notaría | [SP1] ≤ 90 días | — | SP1 |

**Entregable:** Primeras 2–4 escrituras firmadas y proceso comercial documentado.

### Alertas de riesgo

- ⚠️ Cero ofertas al cierre del mes 3 → revisar precio de salida de la cartera antes de culpar al mercado: el 80% de los inmuebles que no se venden están mal preciados.
- ⚠️ Cartera con 0% de exclusivas → la oficina está compitiendo contra sí misma con otros anunciantes.

---

## Fase 3 — Productividad y punto de equilibrio

**Periodo:** Meses 5 a 8

**Objetivo:** Alcanzar y sostener el punto de equilibrio: 2 ventas al mes a ticket mediano ≥ $2.4M producen $288,000 MXN de ingreso bruto, suficiente para cubrir el costo con buffer y generar margen.

### Acciones

| # | Acción | Responsable | Origen |
| --- | --- | --- | --- |
| 1 | Instalar tablero de productividad por asesor (captaciones, visitas, ofertas, cierres) y revisarlo semanalmente. | Gerente de oficina | SP1 |
| 2 | Reforzar captación de exclusivas: meta de 50% de la cartera en mandato exclusivo. | Equipo de asesores | SP1 |
| 3 | Activar convenios con notarías y gestores para acelerar cierre y postventa. | Admin | SP1 |
| 4 | Depurar cartera: dar de baja inmuebles sin actividad a 120 días o renegociar precio con el propietario. | Gerente de oficina | SP1 |
| 5 | Plan de choque si dos meses consecutivos cierran por debajo de $120,000 de ingreso: barrido de zona dirigido y revisión de precios de cartera completa. | Franquiciatario | SP1 |

### KPIs de la fase

| KPI | Cómo se calcula | Umbral | Fuente | Origen |
| --- | --- | --- | --- | --- |
| **Ventas cerradas por mes** | Operaciones escrituradas | [SP1] ≥ 2 sostenido | — | SP1 |
| **Ingreso mensual por comisiones** | Ventas × ticket × 6% | [SP1] ≥ $144,000 | — | SP1 |
| **Cartera activa** | Inmuebles vigentes | [SP1] 80–120 | — | SP1 |
| **Ratio cartera/ventas** | Cartera ÷ ventas del mes | [SP1] ≈ 8:1 | — | SP1 |
| **% de exclusivas** | Exclusivas ÷ cartera total | [SP1] ≥ 50% | — | SP1 |
| **Ventas por asesor** | Ventas del mes ÷ asesores activos | [SP1] ≥ 0.5/mes | — | SP1 |

**Entregable:** Punto de equilibrio sostenido 3 meses consecutivos con margen operativo positivo.

### Alertas de riesgo

- ⚠️ Dos meses consecutivos por debajo de $120,000 de ingreso → plan de choque obligatorio (Fase 3, acción 5).
- ⚠️ Ticket promedio de cartera por debajo de $2.4M → la cartera migró de segmento: reencauzar captación.

---

## Fase 4 — Consolidación y decisión de escala

**Periodo:** Meses 9 a 12

**Objetivo:** Consolidar 3+ ventas al mes, margen operativo ≥ 20% y decidir con datos si se abre segunda oficina o se profundiza la penetración del polígono actual. La delimitación de 5,500 propiedades no se modifica.

### Acciones

| # | Acción | Responsable | Origen |
| --- | --- | --- | --- |
| 1 | Auditoría de calidad de cartera: depuración y renovación de inventario a 150+ inmuebles activos. | Gerente de oficina | SP1 |
| 2 | Programa de reputación: metas de reseñas Google ≥ 4.5★ y referencias de clientes cerrados. | Marketing local | SP1 |
| 3 | Análisis de rentabilidad por tipología y manzana: identificar el 20% del polígono que produce el 80% de los cierres. | Franquiciatario | SP1 |
| 4 | Evaluación de segunda oficina: solo si la primera sostiene 3 ventas/mes y el polígono colinda con un área de 5,500 propiedades adicionales sin canibalizar la delimitación. | Franquiciatario | SP1 |
| 5 | Renovar planeación anual con el modelo financiero actualizado y los datos reales de 12 meses. | Franquiciatario | SP1 |

### KPIs de la fase

| KPI | Cómo se calcula | Umbral | Fuente | Origen |
| --- | --- | --- | --- | --- |
| **Ventas cerradas por mes** | Operaciones escrituradas | [SP1] ≥ 3 | — | SP1 |
| **Ingreso mensual por comisiones** | Ventas × ticket × 6% | [SP1] ≥ $216,000 | — | SP1 |
| **Margen operativo** | (Ingreso − costo operativo) ÷ ingreso | [SP1] ≥ 20% | — | SP1 |
| **Cartera activa** | Inmuebles vigentes | [SP1] ≥ 150 | — | SP1 |
| **Reputación** | Calificación promedio en Google | [SP1] ≥ 4.5★ | — | SP1 |
| **Eficiencia por asesor** | Ventas trimestrales ÷ asesores | [SP1] ≥ 1/trimestre | — | SP1 |

**Entregable:** Expediente de 12 meses con decisión documentada: segunda oficina o profundización del polígono.

### Alertas de riesgo

- ⚠️ Ventas por asesor por debajo de 0.5/trimestre → problema de cobertura de zona o de perfil de contratación, no de esfuerzo.
- ⚠️ Margen por debajo de 10% con 3 ventas al mes → revisar estructura de costo fijo y regalías con el franquiciador.

---

## Cifras derivadas del modelo

| Concepto | Valor | Trazabilidad |
| --- | --- | --- |
| Costo operativo base mensual | **$120,000 MXN** | [SP2] Suma del desglose del modelo. |
| Colchón de seguridad (+20%) | **$24,000 MXN** | [SP2] 120,000 × 0.20. |
| Costo operativo real con buffer | **$144,000 MXN/mes** | [SP2] Escenario de trabajo. |
| Escenario conservador alto | **$160,000 MXN/mes** | [SP2] Techo del rango. |
| Ticket mínimo (buffer 144k) | **$2,400,000 MXN** | [SP2] 144,000 ÷ 0.06. |
| Ticket mínimo (alto 160k) | **$2,666,667 MXN** | [SP2] 160,000 ÷ 0.06. |
| Costo operativo anual (buffer) | **$1,728,000 MXN** | [SP1 derivado] 144,000 × 12. |
| Comisión requerida anual (buffer) | **$1,728,000 MXN** | [SP1 derivado] Igual al costo anual. |
| Ventas anuales requeridas a ticket $2.4M | **12 operaciones/año** | [SP1 derivado] 1,728,000 ÷ (2.4M × 0.06) = 1 por mes. |
| Ventas anuales requeridas a ticket $2.67M | **10.8 operaciones/año** | [SP1 derivado] 160,000 ÷ (2.67M × 0.06) ≈ 1 por mes con margen. |
| Rotación requerida si el ticket mediano fuera el mínimo | **0.22% anual (escenario alto: 0.24%) → 12 a 13.3 ventas/año** | [SP1 derivado] 12 ÷ 5,500 = 0.218% y 13.33 ÷ 5,500 = 0.242%. Exigencia muy por debajo del rango del modelo (1.5%–3%), por lo que el riesgo real NO es la rotación de la ciudad sino tu captación efectiva. |
| Ingreso a 3 ventas/mes (ticket $2.4M) | **$432,000 MXN/mes** | [SP1 derivado] 3 × 2.4M × 6%. |
| Margen a 3 ventas/mes vs. costo con buffer | **$288,000 MXN/mes** | [SP1 derivado] 432,000 − 144,000. Coincide con el margen que usa la Fase 4. |

## Reglas duras de operación

- Delimitación territorial de 5,500 propiedades por oficina. No se modifica. — *SP2*
- Comisión estándar 6% del precio de venta (vendedor, comprador o split 3%+3% según mercado local). — *SP2*
- No se inventan datos de mercado: si no es verificable, se declara y se indica la fuente donde obtenerlo. — *SP2*
- Ningún inmueble sin escritura RPP entra a la muestra ni a la cartera. — *SP2*
- El inventario de 5,500 propiedades es el techo de captación, no el techo de ventas: las ventas dependen de la actividad comercial del equipo. — *SP1*

## Supuestos declarados

| Supuesto | Valor por defecto | Por qué existe |
| --- | --- | --- |
| Captación de la oficina en el año 1 | 10% de las ventas del polígono | El modelo base estima las ventas de la zona, pero no define qué fracción captura una oficina nueva. Sin esta variable, cualquier zona con precios de mercado saldría viable. |
| Colchón de capital | 12 meses | Meses de costo operativo que el franquiciatario puede financiar sin ingreso. |
| Ciclo de venta | 90 días | Referencia operativa para dimensionar la paciencia del colchón. |

> Supuestos [SP1] de AnalisisZonaTec. Editables en la interfaz. No son datos oficiales de TECNOCASA ni del modelo del franquiciatario.
