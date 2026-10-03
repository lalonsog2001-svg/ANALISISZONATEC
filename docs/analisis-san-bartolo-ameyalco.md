# Estudio de zona Fase 0 — San Bartolo Ameyalco (Álvaro Obregón, CDMX)

**Polígono AO-04 «Poniente»** · Apertura de oficina Tecnocasa
**Fecha del estudio:** 2 de octubre de 2026 · **Captura de muestra:** 2 de octubre de 2026
**Escenario de costo:** con buffer (+20%) = $144,000/mes

> Este informe cierra la **Fase 0** del protocolo de apertura. Todas las cifras de mercado provienen de la captura de avisos publicada en el anexo de datos; **ningún precio se inventó ni se estimó a ojo**. Donde no hay dato medido, el informe lo dice y señala la fuente oficial para medirlo. Los supuestos están marcados como `[SPA-xx]` y listados en el §8.

---

## a) Fase actual

**Fase 0 — Estudio de zona y dictamen (Mes −3 a −1).** Estamos en el día 1 del calendario de apertura. La salida de esta fase es un **DICTAMEN** con semáforo financiero, y ese dictamen es este documento.

| | |
| --- | --- |
| **Fase** | 0 de 5 — estudio de zona |
| **Estado** | Dictamen emitido: **🟡 VIABLE CON CONDICIONES / RIESGO** (90/100) |
| **Puerta de salida (gate)** | **No se firma local, ni se contrata personal, ni se paga publicidad de apertura** hasta cerrar las dos condiciones del §d |
| **Siguiente fase** | Fase 1 — local, marca y equipo (arranca solo con la condición 1 cerrada) |
| **Muestra medida** | 59 avisos válidos de 70 capturados (11 excluidos por filtro) |
| **Certeza jurídica** | **SIN MEDIR** — 0 de 59 inmuebles con folio real verificado en el RPP |

**Respuesta directa:** la zona **no se descarta y tampoco se aprueba**. Es un mercado con demanda suficiente para sostener una oficina de $144,000/mes, pero con un riesgo registral documentado en el propio DOF que **todavía no se ha medido**. Ese es el único bloqueo real.

---

## b) Acciones concretas (calendario de las 12 semanas de Fase 0)

### Bloque 1 — Cerrar la geometría y el denominador del modelo (S1–S3)

| # | Acción | Entregable | Fuente / herramienta |
| --- | --- | --- | --- |
| 1.1 | Levantar los **vértices del polígono en WGS84** y el conteo de predios y cuentas catastrales dentro de él | `poligono.geojson` + conteo de predios | SIG CDMX — Catastro: `https://sig.cdmx.gob.mx/datos/descarga` (CSV + shapefiles) |
| 1.2 | Verificar que el polígono contiene **~5,500 propiedades habitacionales**, que es el denominador fijo del modelo `[SPA-01]` | Reporte «predios en polígono vs. 5,500» | Catastro + OVICA `https://ovica.finanzas.cdmx.gob.mx/` |
| 1.3 | Confirmar la zonificación predio por predio: **Programa Parcial de Poblado Rural 1993** (H2/70/R en el casco) vs. **Suelo de Conservación** (PGOEDF, "Agroecológico") | Mapa de zonificación del polígono | PAOT `/documentos/paot/estudios/SanBartolo.pdf`; DOF 08-nov-1994; `ordenjuridico.gob.mx` (wo61256.pdf) |
| 1.4 | Barrido de **competencia real**: conteo de oficinas físicas en 1.5 km | Tabla DENUE + recorrido físico | DENUE `https://www.inegi.org.mx/app/mapa/denue/` (SCIAN 5311) |

### Bloque 2 — Cerrar la certeza jurídica (S3–S7) ← **condición crítica**

| # | Acción | Entregable |
| --- | --- | --- |
| 2.1 | Seleccionar **20 inmuebles de la muestra** (los 20 más caros y los 20 del casco, priorizando los que se vayan a captar) | Lista con cuenta catastral y dirección |
| 2.2 | **Consulta de folio real en el RPP CDMX** por inmueble: folio, titular registral, gravámenes, y contraste **titular registral vs. poseedor actual** | Ficha registral por inmueble |
| 2.3 | Medir el **% de la muestra con escritura y folio concordante** y recalcular el dictamen con el motor | Este informe **v2** con `escriturado` capturado en el expediente |
| 2.4 | Revisar el estado de los polígonos de regularización (DGRT/CORETT) en el área `[SPA-11]` | Reporte de estatus de regularización |

**Por qué es crítica:** el DOF del 18/11/1994 documentó que en esta zona «un gran porcentaje» de los antecedentes registrales **no coincide con el inmueble que amparan**; hubo tres expropiaciones (1976, 1977 y 1991, vía CORETT: 78-86-05.94 ha) y 10 polígonos excluidos (38,510.388 m²). Sin folio verificado, una casa "en venta" puede no ser escriturable.

### Bloque 3 — Medir el precio real, no el de vitrina (S6–S10)

| # | Acción | Entregable |
| --- | --- | --- |
| 3.1 | Ajuste de **precio de oferta → precio de cierre** con fuentes oficiales (no con opiniones de asesores) | Factor de ajuste documentado |
| 3.2 | Consulta de **valores de suelo y cierres** por colonia: OVICA (valores catastrales) e Índice SHF de precios de vivienda | Serie de precio por m² del polígono |
| 3.3 | Repetir el muestreo en los **3 portales del protocolo** (Inmuebles24, Propiedades.com, Lamudi) con la misma ventana de captura | Muestra v2 balanceada por portal (hoy: 55 / 14 / 1 — ver §7) |

### Bloque 4 — Local, marca y decisión (S8–S12)

| # | Acción | Entregable |
| --- | --- | --- |
| 4.1 | Preseleccionar 5 locales sobre **Calzada al Desierto de los Leones / Av. Hidalgo**, 40–60 m², estacionamiento y visibilidad | Fichas con renta y contrato |
| 4.2 | Verificar suministro de agua y drenaje del local (**la zona opera con pipas** en varias calles) y accesos por pendiente (30–45%) | Checklist técnico |
| 4.3 | Plan de captación puerta a puerta de los **dos submercados realmente operables**: casco ≤ $8M y corredor $8M–$20M | Lista de 300 puertas + guion |
| 4.4 | **Junta de inversión: go / no-go** con este informe actualizado y las 2 condiciones cerradas | Acta de decisión |

---

## c) KPIs

### c.1 Zona completa (polígono AO-04)

| KPI | Valor |
| --- | --- |
| Muestra válida | **59** inmuebles (11 excluidos de 70 capturados) |
| Mediana de precio | **$18,500,000** |
| Promedio | $22,081,185 |
| Rango P25 – P75 | $7,475,000 – $28,600,000 |
| Precio por m² (mediana) | $36,588 |
| Dispersión (CV) | 77% |
| Comisión mediana (6%) | $1,110,000 |
| Ticket mínimo requerido (1 venta/mes) | $2,400,000 |
| Brecha vs. ticket mínimo | +$16,100,000 (671%) — la mediana supera el mínimo |
| Ventas/año para equilibrio | 1.56 |
| Demanda estimada de la zona | 83 ventas/año (6.9/mes) `[SPA-01][SPA-02]` |
| Captación asumida (10%) | 8.25 ventas/año → 0.69/mes `[SPA-03]` |
| Ingreso de la oficina | $762,300/mes → $9,147,600/año |
| Costo de la oficina | $144,000/mes → $1,728,000/año |
| Cobertura del costo | 530% |
| **Margen estimado** | **$619,125/mes → $7,429,500/año** |
| Participación de mercado requerida | 1.9% (verde ≤ 15%) |
| Trazabilidad | 59/59 inmuebles con URL de origen (100%) |
| Certeza jurídica | **SIN MEDIR** (0 de 59 verificados en RPP) |
| Competencia | **30 marcas** con inventario publicado = **piso documentado**, no conteo a 1.5 km |

### c.2 Segmentación — aquí está la lectura operativa

La mediana de la zona ($18,500,000) está inflada por un bolsillo de lujo. El mercado donde realmente opera una oficina nueva es la banda baja. **Prueba de piso:**

| Banda | Inmuebles | Mediana | Comisión (6%) | Ventas/año para equilibrio | Participación requerida | Cobertura con 10% | Margen/mes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **≤ $8M** — casco y popular-medio | 16 | **$4,500,000** | $270,000 | **6.4** | 7.8% | 129% | **$41,625** |
| $8M – $20M — medio-alto | 16 | $15,750,000 | $945,000 | 1.83 | 2.2% | 451% | $505,688 |
| > $20M — lujo / Rancho San Francisco | 27 | $32,000,000 | $1,920,000 | 0.90 | 1.1% | 917% | $1,176,000 |

**Lectura:** si la oficina solo capta el casco, el negocio **funciona pero es delgado** ($41,625/mes en el escenario conservador, 1.5% de rotación). El negocio se vuelve sólido cuando la cartera mezcla el casco con el corredor medio-alto. La comisión mediana del polígono ($1,110,000) **no se debe usar para decidir**: usa la de la banda.

### c.3 Sensibilidad por rotación (banda completa)

| Rotación anual | Ventas zona/año | Participación requerida | Cobertura | Margen/mes |
| --- | --- | --- | --- | --- |
| 1.5% (mínimo de referencia) | 83 | 1.9% | 530% | $619,125 |
| 2.3% (medio) | 124 | 1.3% | 795% | $1,000,688 |
| 3.0% (máximo de referencia) | 165 | 0.9% | 1060% | $1,382,250 |

---

## d) Semáforo financiero

### 🟡 VIABLE CON CONDICIONES / RIESGO — puntaje 90/100

| Criterio | Estado | Medición |
| --- | --- | --- |
| Muestra válida | 🟢 | 59 válidos (≥ 20 exigidos) |
| Ticket vs. punto de equilibrio | 🟢 | mediana $18,500,000 ⇒ comisión $1,110,000 ≥ $2,400,000 |
| Participación requerida | 🟢 | 1.9% del mercado (verde ≤ 15%) |
| Cobertura del costo | 🟢 | 530% con captación del 10% |
| **Certeza jurídica** | 🟡 | **SIN MEDIR** — 0 de 59 verificados en RPP |
| **Competencia a 1.5 km** | 🟡 | 30 marcas = piso documentado; falta conteo de oficinas |
| Trazabilidad | 🟢 | 59/59 con URL |
| Colchón de capital | 🟢 | 12 meses = $1,728,000 |

**Regla del semáforo:** un solo criterio 🔴 tumba el dictamen a 🔴 NO VIABLE. Y **no hay 🟢 mientras un criterio duro esté sin medir**: el motor bloquea la luz verde si la certeza jurídica no se midió (`certezaFuente === 'sin_medir'`) o si la competencia es un piso de marcas y no un conteo.

**Qué lo vuelve 🟢:** ≥ 20 folios verificados en el RPP con ≥ 80% de certeza + conteo DENUE ≤ 8 oficinas en 1.5 km + plan de captación que cubra el costo (ya cubierto: 530%).
**Qué lo vuelve 🔴:** certeza registral < 60% de la muestra, o que la participación requerida pase de 30% (hoy 1.9%: no está cerca).

---

## e) Alerta de riesgo

1. **Riesgo registral (el que manda).** El DOF del 18/11/1994 —la expropiación de 393,150.048 m² del casco— dejó constancia de que los antecedentes del RPP **no concordaban con los poseedores**. Sumado a las expropiaciones de 1976, 1977 y 1991 (CORETT) y a los 10 polígonos excluidos, hay una probabilidad **no medida** de que parte del inventario "en venta" no sea escriturable. Mitigación: ninguna operación con exclusividad sin folio real y cuenta catastral a la vista; consulta registral por inmueble antes de invertir en captación.
2. **Suelo de Conservación.** Buena parte del polígono (barranca Guadalupe, Cerro de Atesquillo) es Suelo de Conservación con zonificación agroecológica: menos producto nuevo, restricciones de construcción y menor financiabilidad. Limita el techo de inventario futuro.
3. **Agua y topografía.** El poblado se abastece en parte **por pipas** y tiene pendientes de 30–45%. Afecta el atractivo de producto envejecido y el costo de remodelación. Verificar antes de prometer producto a un propietario.
4. **Mediana contaminada por lujo.** CV de 77–170% entre bandas: cualquier decisión tomada sobre la mediana global ($18,500,000, PR 1.9%) sobreestima el negocio. El número de trabajo es **$4,500,000 ⇒ 6.4 ventas/año** para equilibrio en la banda baja.
5. **Precios de oferta, no de cierre.** Nadie publica precios de cierre y no se van a inventar: el ajuste se mide con OVICA y el Índice SHF (Bloque 3).
6. **Competencia sin medir.** 30 marcas ya anuncian aquí y Tecnocasa **no tiene oficina en San Bartolo** (sí agentes de zona en Santa Fe, San Ángel y Olivar, aprovechables como marca). Sin el conteo DENUE, no se puede declarar el criterio verde.
7. **Denominador del modelo.** El cálculo de demanda usa la regla inmutable de **5,500 propiedades por oficina** `[SPA-01]`; nadie ha confirmado todavía con Catastro cuántas propiedades hay realmente dentro del polígono. Si el polígono tuviera menos, la demanda baja proporcionalmente y el dictamen cambia. **Verificación S1–S3.**

---

## 3. Polígono propuesto AO-04 «Poniente»

**Elección y justificación.** Se propone un polígono que **no se queda en el casco**: el casco por sí solo es demasiado delgado (equilibrio con 6.4 ventas/año y margen de $41,625/mes), y el enclave de lujo aislado es poco operable (0.9 ventas/año de equilibrio, producto de nicho). El polígono integra los tres submercados para que una sola oficina pueda vivir del corredor medio-alto sin depender del casco ni del lujo.

| | |
| --- | --- |
| **Ancla** | 19.33286, −99.26549 (Pueblo de San Bartolo Ameyalco) — [ver en mapas](https://www.google.com/maps/search/?api=1&query=19.33286,-99.26549) |
| **Norte** | Av. Desierto de los Leones (tramo Hacienda Buenavista – entronque Calzada al Desierto de los Leones) |
| **Este** | Calzada al Desierto de los Leones y límite con Lomas de los Cedros / Pueblo de Tetelpan |
| **Sur** | Camino al Desierto de los Leones y línea de Suelo de Conservación (Cerro de Atesquillo / barranca Guadalupe) |
| **Oeste** | Límite con el Pueblo de Santa Rosa Xochiac |
| **CP** | 01800 / 01807 |
| **Colonias y parajes incluidos** | Pbo. San Bartolo Ameyalco, Rancho San Bartolo Ameyalco, Rancho San Francisco del Pbo. San Bartolo Ameyalco, Ampl. Rancho San Francisco, Rancho del Carmen, Barrio/Ampl. Tlacoyaque, El Capulín, Paraje El Caballito y Caballito 2ª Sección, Lomas de Chamontoya |
| **Antecedentes normativos** | Programa Parcial de Poblado Rural 1993 (H2/70/R, 1 casa por 500 m², 3 niveles, 60% área libre), ZEDEC Tlacoyaque (DOF 05/10/1994), expropiación del casco (DOF 18/11/1994) |

**Pendiente de cierre (S1–S3):** los vértices en WGS84 y el conteo de predios se levantan con el SIG de Catastro. La delimitación de arriba es la de campo, verificable en el recorrido; **no se publica un GeoJSON con coordenadas aproximadas de memoria** porque eso sería precisamente el tipo de dato inventado que este estudio prohíbe.

---

## 7. Fuentes, trazabilidad y límites de la muestra

| Fuente | Uso | Estado |
| --- | --- | --- |
| `expedientes/san-bartolo-ameyalco.json` + `docs/anexo-datos-sba-ao-04.md` §10 | 70 avisos con URL individual, precios, m², estatus y nota | ✅ cerrado |
| Propiedades.com (5 páginas), Inmuebles24 (casas, deptos, terrenos), icasas.mx (142 + 43 remates), MercadoLibre, Lamudi | Captura de la muestra | ⚠️ cruce desigual: 55 / 1 / 14 avisos en el JSON; completar en S3 |
| SIG CDMX (Catastro), OVICA, RPP CDMX (`data.consejeria.cdmx.gob.mx`), DENUE, Índice SHF | Verificación oficial | ⏳ pendiente (Bloques 1–3) |
| DOF 18/11/1994 y 05/10/1994, PAOT `SanBartolo.pdf`, Programa Parcial 1993, tesis UNAM (manantial Atexquilo) | Contexto normativo y de riesgo | ✅ consultado |
| Estatus `escriturado` por inmueble | **Sin capturar: 0 de 59** | ⏳ bloqueo de la condición 1 |

**Límites declarados:** muestra **no probabilística** de avisos activos (no es censo ni cierre); sin terrenos, rentas ni anuncios en USD dentro del cálculo; sin ajuste oferta→cierre; el conteo de competencia es un piso de marcas; y el denominador de demanda es la regla corporativa de 5,500 propiedades. Ninguno de esos límites se "rellenó" con estimaciones: se declaran y se miden en las fases 1–3 del calendario.

---

## 8. Supuestos (explícitos, no dados por hechos)

| ID | Supuesto |
| --- | --- |
| `[SPA-01]` | **5,500 propiedades habitacionales por oficina** (regla inmutable del modelo corporativo). No verificado aún contra Catastro del polígono. |
| `[SPA-02]` | Rotación anual de referencia **1.5%** (banda 1.5–3%); el escenario base usa el mínimo por prudencia. |
| `[SPA-03]` | **Participación de mercado asumida: 10%** de las ventas de la zona. Es una meta de operación, no un dato medido. |
| `[SPA-04]` | Comisión **6%** sobre el precio de venta, sin IVA. |
| `[SPA-05]` | Precios **de oferta**; no se aplicó factor de negociación porque no existe fuente pública de cierres (se medirá con OVICA/SHF). |
| `[SPA-06]` | **Competencia = 30 marcas** con inventario publicado en el polígono: **piso**, no conteo de oficinas en 1.5 km. |
| `[SPA-07]` | Costos: opex $120,000/mes; buffer +20% ⇒ **$144,000/mes**; escenario alto **$160,000/mes**. |
| `[SPA-08]` | Colchón de capital para **12 meses** de operación = **$1,728,000**. |
| `[SPA-09]` | Muestra de avisos activos al 2-oct-2026, sin series históricas de tiempo en mercado. |
| `[SPA-10]` | Excluidos del cálculo: terrenos, rentas, anuncios en USD, remates (3) y cesiones de derechos (1) por el filtro de Fase 0. |

---

## 9. Reproducibilidad

```bash
# Motor + anexo de datos (regenera docs/anexo-datos-sba-ao-04.md)
node scripts/analizar-zona.mjs expedientes/san-bartolo-ameyalco.json

# Comprueba que este informe cita las cifras que calculó el motor
node scripts/analizar-zona.mjs expedientes/san-bartolo-ameyalco.json --verificar docs/analisis-san-bartolo-ameyalco.md

# Pruebas del motor y de la interfaz
npm test
```

El anexo de datos (`docs/anexo-datos-sba-ao-04.md`) contiene la tabla completa de los 70 avisos con URL, los criterios, la sensibilidad y el filtro aplicado. Es el respaldo auditable de cada cifra de este informe.

---

*Fases 1 a 5 (local y equipo, captación, operación, expansión, control) están documentadas en `docs/prompt-tecnolaunch.md` y `docs/plan-maestro.md`, con sus supuestos marcados.*
