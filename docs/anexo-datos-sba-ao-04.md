# Anexo de datos — San Bartolo Ameyalco — Polígono Poniente (AO-04)

> **Generado automáticamente** por `scripts/analizar-zona.mjs` a partir de `expedientes/san-bartolo-ameyalco.json`.
> Fecha de captura de la muestra: 2026-10-02. Escenario de costo: Con buffer (+20%) ($144,000/mes).

## 1. Delimitación

- **Alcaldía:** Álvaro Obregón
- **Colonia:** Pueblo San Bartolo Ameyalco
- **Código postal:** 01800 / 01807
- **Polígono:** Norte: Av. Desierto de los Leones (tramo Hacienda Buenavista–entronque Calzada al Desierto de los Leones). Este: Calzada al Desierto de los Leones y límite con Lomas de los Cedros / Pueblo de Tetelpan. Sur: Camino al Desierto de los Leones y línea de suelo de conservación (Cerro de Atesquillo / barranca Guadalupe). Oeste: límite con el Pueblo de Santa Rosa Xochiac. Incluye: Pbo. San Bartolo Ameyalco (01800), Rancho San Bartolo Ameyalco, Rancho San Francisco del Pbo. San Bartolo Ameyalco (01807), Ampl. Rancho San Francisco, Rancho del Carmen, Barrio/Ampl. Tlacoyaque, El Capulín, Paraje El Caballito y Caballito 2a Sección, Lomas de Chamontoya.

## 2. Dictamen

**🟡 VIABLE CON CONDICIONES / RIESGO** — puntaje ponderado 90/100

> Certeza jurídica (% escriturado / RPP): No medido: no es que la zona tenga 0% de certeza, es que nadie ha verificado ni un folio real. Este criterio no puede darse por bueno sin datos: el anexo de fuentes indica cómo medirlo. Sin esta verificación no se abre oficina, porque cada mes de operación cuesta $144,000–$160,000.

## 3. KPIs

| KPI | Valor |
| --- | --- |
| Muestra válida | 59 inmuebles (11 excluidos de 70) |
| Mediana de precio | $18,500,000 |
| Promedio | $22,081,185 |
| Rango P25 – P75 | $7,475,000 – $28,600,000 |
| Precio por m² (mediana) | $36,588 |
| Dispersión (CV) | 77% |
| Comisión mediana (6%) | $1,110,000 |
| Ticket mínimo requerido | $2,400,000 |
| Brecha vs. ticket mínimo | $16,100,000 (671%) |
| Demanda de la zona | 5,500 × 1.5% = 83 ventas/año (6.9/mes) |
| Captación asumida | 10.0% → 8.25 ventas/año (0.69/mes) |
| Ingreso mensual estimado | $763,125 |
| Cobertura del costo | 530% → margen $619,125/mes |
| **Participación requerida** | **1.9% del mercado de la zona** |
| Ventas/año para equilibrio | 1.56 |
| Certeza jurídica | **SIN MEDIR** (0 de 59 verificados en RPP) |
| Trazabilidad | 100% (59 de 59 con URL) |
| Competencia | 30 marcas con inventario publicado |
| Colchón de capital | 12 meses ($1,728,000) |

## 4. Criterios del dictamen

| Criterio | Estado | Valor medido | Umbral |
| --- | --- | --- | --- |
| Muestra válida de la zona | 🟢 | 59 inmuebles válidos (11 excluidos de 70 capturados) | ≥ 20 válidos |
| Ticket vs. punto de equilibrio | 🟢 | Mediana $18,500,000 | comisión 6% = $1,110,000 | mínimo $2,400,000 | ≥ $2,400,000 por operación (1 venta/mes) |
| Participación de mercado requerida | 🟢 | Necesitas 1.6 de las 83 ventas/año de la zona = 1.9% del mercado | Verde ≤ 15% | Rojo > 30% |
| Cobertura del costo con la captación asumida | 🟢 | Captación asumida 10.0% de 83 ventas/año → 0.69 ventas/mes → $763,125 vs. costo $144,000 | ≥ 100% con holgura ≥ 0% |
| Certeza jurídica (% escriturado / RPP) | 🟡 | SIN MEDIR — 0 de 59 inmuebles verificados en el RPP | ≥ 80% |
| Competencia en radio de 1.5 km | 🟡 | 30 marcas con inventario publicado (piso documentado, no es el conteo a 1.5 km) | si todas comparten el mercado, 2.8 ventas/año por marca | ≤ 8 verde | > 15 rojo |
| Trazabilidad (fuente y URL por inmueble) | 🟢 | 59 de 59 inmuebles válidos con URL | ≥ 80% |
| Colchón de capital (meses financiados) | 🟢 | 12 meses a $144,000/mes = $1,728,000 | ≥ 12 meses verde | ≤ 6 meses rojo |

### Condiciones

- **Certeza jurídica (% escriturado / RPP)** — No medido: no es que la zona tenga 0% de certeza, es que nadie ha verificado ni un folio real. Este criterio no puede darse por bueno sin datos: el anexo de fuentes indica cómo medirlo. Sin esta verificación no se abre oficina, porque cada mes de operación cuesta $144,000–$160,000.
- **Competencia en radio de 1.5 km** — 30 marcas con inventario publicado en el polígono: es un PISO (cuántas agencias distintas anuncian), no el conteo de oficinas dentro de 1.5 km. No alcanza para verde ni para rojo: falta el conteo DENUE (SCIAN 5311) y el recorrido físico.

### Acciones de verificación pendientes

- **Certeza jurídica (% escriturado / RPP):** Criterio sin medir ≠ criterio en cero. Verifica folio real, titular y gravámenes de CADA inmueble de la muestra en el RPP CDMX, y contrasta titular registral vs. poseedor actual (el DOF del 18/11/1994 documentó que en esta zona "un gran porcentaje" de los antecedentes registrales no coincide con el inmueble que amparan). Complementa con cuenta catastral y valor de suelo en SIG CDMX / OVICA, y con el estado de los polígonos de regularización (DGRT).
- **Competencia en radio de 1.5 km:** Conteo exacto en DENUE (SCIAN 5311 servicios inmobiliarios) dentro del polígono de 1.5 km. Complementa con recorrido físico para detectar oficinas no registradas o cerradas.

## 5. Segmentación del mercado capturado

| Submercado | Inmuebles | Mediana | Promedio | Rango | Comisión mediana | Ventas/año para equilibrio |
| --- | --- | --- | --- | --- | --- | --- |
| ≤ $8M — casco y mercado popular-medio | 16 | $4,500,000 | $5,180,757 | $2.90M – $8.00M | $270,000 | 6.4 |
| $8M – $20M — medio-alto | 16 | $15,750,000 | $14,793,125 | $8.99M – $19.50M | $945,000 | 1.8 |
| > $20M — fraccionamientos y residencias de lujo | 27 | $32,000,000 | $36,415,104 | $21.00M – $69.75M | $1,920,000 | 0.9 |

## 6. Sensibilidad por rotación

| Rotación anual | Ventas zona/año | Ventas zona/mes | Participación requerida | Ingreso oficina/mes | Cobertura | Margen/mes |
| --- | --- | --- | --- | --- | --- | --- |
| 1.5% | 83 | 6.9 | 1.9% | $763,125 | 530% | $619,125 |
| 2.3% | 124 | 10.3 | 1.3% | $1,144,688 | 795% | $1,000,688 |
| 3.0% | 165 | 13.8 | 0.9% | $1,526,250 | 1060% | $1,382,250 |

> La **participación requerida** del §3 se calcula con la comisión mediana del polígono completo. Si esa mediana está inflada por el segmento de lujo, la participación requerida aparece artificialmente baja: por eso el §5 segmenta por banda de precio. La **prueba de piso** es la participación requerida calculada con la mediana de la banda de menor precio (el mercado donde realmente va a operar una oficina nueva).

## 7. Filtro aplicado a la muestra

Se excluyeron **11** anuncios por las reglas del modelo:

| Motivo | Anuncios |
| --- | --- |
| Duplicado de otra publicación | 7 |
| Remate | 3 |
| Cesión de derechos | 1 |

- 🚫 Duplicado de otra publicación — C. La Palma #27 Int. Casa 2 (130 m2) · $4,300,000. Fuente: https://propiedades.com/inmuebles/casa-en-venta-palma-27-san-bartolo-ameyalco-df-31475600
- 🚫 Duplicado de otra publicación — C. La Palma 27 (174 m2) · $4,435,000. Fuente: https://propiedades.com/inmuebles/casa-en-venta-c-la-palma-27-san-bartolo-ameyalco-alvaro-obregon-01800-ciudad-de-mexico-cdmx-27-san-bartolo-ameyalco-df-31554013
- 🚫 Duplicado de otra publicación — Muitles (60 m2) · $2,900,000. Fuente: https://propiedades.com/inmuebles/departamento-en-venta-muitles-san-bartolo-ameyalco-df-31735215
- 🚫 Duplicado de otra publicación — Miguel Hidalgo 148 (326 m2) · $15,500,000. Fuente: https://www.icasas.mx/venta/habitacionales-casas-distrito-federal-alvaro-obregon-san-bartolo-ameyalco-2_5_1_0_264_691/p_2
- 🚫 Duplicado de otra publicación — Cerrada Hidalgo 24-148 (370 m2) · $16,500,000. Fuente: https://www.icasas.mx/venta/habitacionales-casas-distrito-federal-alvaro-obregon-san-bartolo-ameyalco-2_5_1_0_264_691
- 🚫 Duplicado de otra publicación — Montpellier, Rancho San Francisco (520 m2) · $33,999,999. Fuente: https://www.icasas.mx/venta/habitacionales-casas-distrito-federal-alvaro-obregon-san-bartolo-ameyalco-2_5_1_0_264_691/p_2?dup=montpellier
- 🚫 Duplicado de otra publicación — Camino al Desierto de los Leones (508 m2) · $19,500,000. Fuente: https://www.icasas.mx/venta/habitacionales-casas-distrito-federal-alvaro-obregon-san-bartolo-ameyalco-2_5_1_0_264_691/p_2?dup=camino
- 🚫 Remate — Prol. Palmas 114 · $794,000. Fuente: https://www.icasas.mx/venta/habitacionales-casas-distrito-federal-alvaro-obregon-san-bartolo-ameyalco-2_5_1_0_264_691/f_remate-bancario
- 🚫 Remate — Segunda Cda. de Hidalgo 5 casa 12 · $3,380,000. Fuente: https://www.icasas.mx/venta/habitacionales-casas-distrito-federal-alvaro-obregon-san-bartolo-ameyalco-2_5_1_0_264_691/f_remate-bancario
- 🚫 Cesión de derechos — De Hidalgo (180 m2). Fuente: https://www.icasas.mx/venta/habitacionales-casas-distrito-federal-alvaro-obregon-san-bartolo-ameyalco-2_5_1_0_264_691/f_remate-bancario
- 🚫 Remate — Departamento 70 m2 (remate hipotecario) · $580,000. Fuente: https://www.inmuebles24.com/departamentos-en-venta-en-san-bartolo-ameyalco.html

## 8. Composición de la muestra

| Portal | Anuncios válidos |
| --- | --- |
| Propiedades.com | 52 |
| icasas.mx | 7 |

- Anuncios sin superficie publicada: **1** de 59
- Anuncios sin dirección publicada: **6** de 59
- Dispersión de precios: coeficiente de variación de **77%** (por encima de 40% indica segmentos mezclados, y aquí es el caso)

## 9. Competencia detectada

**30 marcas distintas** con inventario publicado en el polígono durante la captura:

- Cattori Inmobiliaria
- Pi Real Estate
- VIBRA Bienes Raíces
- MC&M Inmobiliaria
- Kobëh Bienes Raíces
- DEGOHOUSE Inmobiliaria
- Zona R&G Poniente
- Norgui Inmobiliaria
- Diseñare Inmobiliaria
- RBKasesora
- Meroci Asesoras Inmobiliarias
- Lomelin Hermanos Bienes Raíces
- Coldwell Banker B Real
- PADS
- Grupo EMCO Inmobiliaria
- Neximo
- IADMEXICO
- Círculo Bienes Raíces
- Inmobiliaria ROME
- Latitud Inmobiliaria
- DIMA Real Estate Brokers
- PIAT Grupo Inmobiliario
- My Own Space Inmobiliaria
- Marca Inmobiliaria
- Great Homes Rs
- AG NOR
- Nocnok
- Easy Rent & Sell
- Avipar Innovación Inmobiliaria
- Inmobiliaria Melo

> Este conteo es un **piso** del criterio "inmobiliarias activas en el radio de 1.5 km": cuenta marcas con inventario publicado, no oficinas físicas. El conteo exacto corresponde al DENUE (INEGI), filtro SCIAN 5311 sobre el polígono. Varias de estas marcas operan de forma virtual o desde Santa Fe / San Ángel, no dentro del polígono.

## 10. Muestra completa

| # | Dirección | Tipo | Precio | m² | $/m² | Estatus | Segmento | Fuente |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Muitles | Departamento | $2,900,000 | 60 | $48,333 | ✅ Válida | ≤ $8M — casco y mercado popular-medio | [Propiedades.com](https://propiedades.com/inmuebles/departamento-en-venta-muitles-san-bartolo-ameyalco-df-31099023) |
| 2 | C. La Palma #27 | Casa en condominio | $3,390,000 | 130 | $26,077 | ✅ Válida | ≤ $8M — casco y mercado popular-medio | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-venta-la-palma-27-san-bartolo-ameyalco-df-31678517) |
| 3 | C. La Palma #27 | Casa en condominio | $4,300,000 | 131 | $32,824 | ✅ Válida | ≤ $8M — casco y mercado popular-medio | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-condominio-en-venta-c-la-palma-san-bartolo-ameyalco-ciudad-de-mexico-cdmx-27-san-bartolo-ameyalco-df-30672982) |
| 4 | La Palma #93 | Casa | $4,382,114 | 166 | $26,398 | ✅ Válida | ≤ $8M — casco y mercado popular-medio | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-venta-la-palma-93-san-bartolo-ameyalco-df-28723626) |
| 5 | La Palma #27 (casa 178 m2) | Casa en condominio | $4,500,000 | 178 | $25,281 | ✅ Válida | ≤ $8M — casco y mercado popular-medio | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-condominio-en-venta-la-palma-27-san-bartolo-ameyalco-df-28570043) |
| 6 | Calle Palma 26-26 | Casa | $4,500,000 | 150 | $30,000 | ✅ Válida | ≤ $8M — casco y mercado popular-medio | [icasas.mx](https://www.icasas.mx/venta/habitacionales-casas-distrito-federal-alvaro-obregon-san-bartolo-ameyalco-2_5_1_0_264_691) |
| 7 | Cda. Cacomites | Casa | $4,590,000 | — | — | ✅ Válida | ≤ $8M — casco y mercado popular-medio | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-venta-cda-cacomites-san-bartolo-ameyalco-01800-ciudad-de-mexico-cdmx-san-bartolo-ameyalco-df-30863510) |
| 8 | Venustiano Carranza 8 | Casa | $4,300,000 | 201 | $21,393 | ✅ Válida | ≤ $8M — casco y mercado popular-medio | [icasas.mx](https://www.icasas.mx/venta/habitacionales-casas-distrito-federal-alvaro-obregon-san-bartolo-ameyalco-2_5_1_0_264_691/f_3-recamaras) |
| 9 | Desierto de Los Leones #6527 | Casa | $3,900,000 | 150 | $26,000 | ✅ Válida | ≤ $8M — casco y mercado popular-medio | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-venta-desierto-de-los-leones-6527-san-bartolo-ameyalco-df-31754920) |
| 10 | Casa sin dirección publicada (179 m2) | Casa | $4,200,000 | 179 | $23,464 | ✅ Válida | ≤ $8M — casco y mercado popular-medio | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-venta-casa-en-venta-ubicada-en-san-bartolo-ameyalco-alvaro-obregon-ciudad-de-mexico-1-san-bartolo-ameyalco-df-31088571) |
| 11 | San Diego (Hacienda San Francisco) | Casa en condominio | $6,580,000 | 226 | $29,115 | ✅ Válida | ≤ $8M — casco y mercado popular-medio | [icasas.mx](https://www.icasas.mx/venta/habitacionales-casas-distrito-federal-alvaro-obregon-san-bartolo-ameyalco-2_5_1_0_264_691/p_2) |
| 12 | Hidalgo (condominio horizontal 39 casas) | Casa en condominio | $6,950,000 | 201 | $34,577 | ✅ Válida | ≤ $8M — casco y mercado popular-medio | [icasas.mx](https://www.icasas.mx/venta/habitacionales-casas-distrito-federal-alvaro-obregon-san-bartolo-ameyalco-2_5_1_0_264_691/p_2) |
| 13 | Miguel Hidalgo 22 | Casa en condominio | $6,800,000 | 200 | $34,000 | ✅ Válida | ≤ $8M — casco y mercado popular-medio | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-condominio-en-venta-miguel-hidalgo-22-san-bartolo-ameyalco-alvaro-obregon-01800-ciudad-de-mexico-cdmx-22-san-bartolo-ameyalco-df-31566276) |
| 14 | Hidalgo (201 m2) | Casa en condominio | $6,750,000 | 201 | $33,582 | ✅ Válida | ≤ $8M — casco y mercado popular-medio | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-condominio-en-venta-hidalgo-san-bartolo-ameyalco-df-31155934) |
| 15 | Hidalgo (211 m2) | Casa en condominio | $6,850,000 | 211 | $32,464 | ✅ Válida | ≤ $8M — casco y mercado popular-medio | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-condominio-en-venta-hidalgo-san-bartolo-ameyalco-df-31394094) |
| 16 | Palmas #55 Int. Lote 130 | Casa en condominio | $8,000,000 | 350 | $22,857 | ✅ Válida | ≤ $8M — casco y mercado popular-medio | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-condominio-en-venta-palmas-55-san-bartolo-ameyalco-df-30953094) |
| 17 | Sin dirección publicada (400 m2) | Casa | $8,990,000 | 400 | $22,475 | ✅ Válida | $8M – $20M — medio-alto | [Propiedades.com](https://propiedades.com/san-bartolo-ameyalco-alvaro-obregon-df/ (ID 24884413)) |
| 18 | Sin dirección publicada (380 m2) | Casa | $9,500,000 | 380 | $25,000 | ✅ Válida | $8M – $20M — medio-alto | [Propiedades.com](https://propiedades.com/san-bartolo-ameyalco-alvaro-obregon-df/) |
| 19 | Desierto de los Leones (430 m2) | Casa en condominio | $9,600,000 | 430 | $22,326 | ✅ Válida | $8M – $20M — medio-alto | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-condominio-en-venta-desierto-de-los-leones-san-bartolo-ameyalco-df-31805385) |
| 20 | Desierto de Los Leones (362 m2) | Casa en condominio | $10,300,000 | 362 | $28,453 | ✅ Válida | $8M – $20M — medio-alto | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-condominio-en-venta-desierto-de-los-leones-san-bartolo-ameyalco-df-30940333) |
| 21 | Calz. Desierto de los Leones & Privada Hidalgo | Casa | $12,999,999 | 250 | $52,000 | ✅ Válida | $8M – $20M — medio-alto | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-venta-calzada-desierto-de-los-leones--privada-hidalgo-san-bartolo-ameyalco-df-31594397) |
| 22 | 3ra Cerrada de Hidalgo | Casa | $14,350,000 | 453 | $31,678 | ✅ Válida | $8M – $20M — medio-alto | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-venta-3ra-cerrada-de-hidalgo-san-bartolo-ameyalco-df-31735336) |
| 23 | Miguel Hidalgo (386 m2) | Casa | $14,350,000 | 386 | $37,176 | ✅ Válida | $8M – $20M — medio-alto | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-venta-miguel-hidalgo-san-bartolo-ameyalco-df-31149449) |
| 24 | Hidalgo (326 m2) | Casa | $15,500,000 | 326 | $47,546 | ✅ Válida | $8M – $20M — medio-alto | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-venta-hidalgo-san-bartolo-ameyalco-df-29848586) |
| 25 | Miguel Hidalgo #250 | Casa | $16,000,000 | 747 | $21,419 | ✅ Válida | $8M – $20M — medio-alto | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-venta-miguel-hidalgo-250-san-bartolo-ameyalco-df-28721220) |
| 26 | Hidalgo (370 m2) | Casa en condominio | $16,500,000 | 370 | $44,595 | ✅ Válida | $8M – $20M — medio-alto | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-condominio-en-venta-hidalgo-san-bartolo-ameyalco-df-31304150) |
| 27 | Álvaro Obregón (513 m2) | Casa | $16,500,000 | 513 | $32,164 | ✅ Válida | $8M – $20M — medio-alto | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-venta-alvaro-obregon-san-bartolo-ameyalco-df-30939683) |
| 28 | Montpellier, Rancho San Francisco | Casa | $17,200,000 | 423 | $40,662 | ✅ Válida | $8M – $20M — medio-alto | [icasas.mx](https://www.icasas.mx/venta/habitacionales-casas-distrito-federal-alvaro-obregon-san-bartolo-ameyalco-2_5_1_0_264_691/f_3-recamaras) |
| 29 | Hidalgo 148 (392 m2) | Casa | $18,500,000 | 392 | $47,194 | ✅ Válida | $8M – $20M — medio-alto | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-venta-hidalgo-148-col-san-bartolo-ameyalco-148-san-bartolo-ameyalco-df-31004737) |
| 30 | 2da Cerrada de San Francisco | Casa en condominio | $18,900,000 | 400 | $47,250 | ✅ Válida | $8M – $20M — medio-alto | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-condominio-en-venta-2da-cerrada-de-san-francisco-san-bartolo-ameyalco-df-31643155) |
| 31 | San Bartolo Ameyalco (338 m2) | Casa | $21,000,000 | 338 | $62,130 | ✅ Válida | > $20M — fraccionamientos y residencias de lujo | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-venta-san-bartolo-ameyalco-san-bartolo-ameyalco-df-31754466) |
| 32 | Hidalgo 170 | Casa en condominio | $21,000,000 | 350 | $60,000 | ✅ Válida | > $20M — fraccionamientos y residencias de lujo | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-condominio-en-venta-hidalgo-170-col-san-bartolo-ameyalco-alvaro-obregon-170-san-bartolo-ameyalco-df-31767884) |
| 33 | Miguel Hidalgo y Costilla (490 m2) | Casa | $21,900,000 | 490 | $44,694 | ✅ Válida | > $20M — fraccionamientos y residencias de lujo | [icasas.mx](https://www.icasas.mx/venta/habitacionales-casas-distrito-federal-alvaro-obregon-san-bartolo-ameyalco-2_5_1_0_264_691) |
| 34 | Desierto de Los Leones 01864 | Casa | $21,900,000 | 702 | $31,197 | ✅ Válida | > $20M — fraccionamientos y residencias de lujo | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-venta-desierto-de-los-leones-01864-cdmx-san-bartolo-ameyalco-df-30352535) |
| 35 | Hidalgo (398 m2) | Casa | $22,000,000 | 398 | $55,276 | ✅ Válida | > $20M — fraccionamientos y residencias de lujo | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-venta-hidalgo-san-bartolo-ameyalco-df-31586213) |
| 36 | Hidalgo (443 m2) | Casa | $22,800,000 | 443 | $51,467 | ✅ Válida | > $20M — fraccionamientos y residencias de lujo | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-venta-hidalgo-san-bartolo-ameyalco-df-31149448) |
| 37 | Miguel Hidalgo (490 m2, 22.98 M) | Casa | $22,980,000 | 490 | $46,898 | ✅ Válida | > $20M — fraccionamientos y residencias de lujo | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-venta-miguel-hidalgo-san-bartolo-ameyalco-df-31730905) |
| 38 | Rancho San Francisco (505 m2) | Casa | $26,000,000 | 505 | $51,485 | ✅ Válida | > $20M — fraccionamientos y residencias de lujo | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-venta-rancho-san-francisco-san-bartolo-ameyalco-df-30944391) |
| 39 | Circuito San Francisco #87 | Casa | $26,900,000 | 780 | $34,487 | ✅ Válida | > $20M — fraccionamientos y residencias de lujo | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-venta-circuito-san-francisco-87-rancho-san-francisco-pueblo-de-san-bartolo-ameyalco-san-bartolo-ameyalco-df-30942111) |
| 40 | San Bartolo (casa en condominio 980 m2) | Casa en condominio | $28,000,000 | 980 | $28,571 | ✅ Válida | > $20M — fraccionamientos y residencias de lujo | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-condominio-en-venta-san-bartolo-san-bartolo-ameyalco-df-31252048) |
| 41 | Rancho San Francisco (920 m2) | Casa | $28,000,000 | 920 | $30,435 | ✅ Válida | > $20M — fraccionamientos y residencias de lujo | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-venta-rancho-san-francisco-san-bartolo-ameyalco-df-31393786) |
| 42 | San Francisco (490 m2) | Casa | $29,200,000 | 490 | $59,592 | ✅ Válida | > $20M — fraccionamientos y residencias de lujo | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-venta-san-francisco-san-bartolo-ameyalco-df-31434439) |
| 43 | San Francisco (530 m2) | Casa | $32,000,000 | 530 | $60,377 | ✅ Válida | > $20M — fraccionamientos y residencias de lujo | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-venta-san-francisco-san-bartolo-ameyalco-df-31609448) |
| 44 | Montpellier, Rancho San Francisco (520 m2) | Casa | $33,999,999 | 520 | $65,385 | ✅ Válida | > $20M — fraccionamientos y residencias de lujo | [icasas.mx](https://www.icasas.mx/venta/habitacionales-casas-distrito-federal-alvaro-obregon-san-bartolo-ameyalco-2_5_1_0_264_691/p_2) |
| 45 | Rancho San Francisco #0 | Casa | $37,000,000 | 701 | $52,782 | ✅ Válida | > $20M — fraccionamientos y residencias de lujo | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-venta-rancho-san-francisco-0-san-bartolo-ameyalco-df-30944493) |
| 46 | Desierto de los Leones #0 (800 m2) | Casa | $37,000,000 | 800 | $46,250 | ✅ Válida | > $20M — fraccionamientos y residencias de lujo | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-venta-desierto-de-los-leones-0-san-bartolo-ameyalco-df-28129290) |
| 47 | Sin dirección publicada (1000 m2, 44.5 M) | Casa | $44,500,000 | 1000 | $44,500 | ✅ Válida | > $20M — fraccionamientos y residencias de lujo | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-venta-san-bartolo-ameyalco-df-30143384) |
| 48 | San Francisco (1250 m2) | Casa en condominio | $45,000,000 | 1250 | $36,000 | ✅ Válida | > $20M — fraccionamientos y residencias de lujo | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-condominio-en-venta-san-francisco-san-bartolo-ameyalco-df-31615474) |
| 49 | Sin dirección publicada (1500 m2) | Casa | $45,000,000 | 1500 | $30,000 | ✅ Válida | > $20M — fraccionamientos y residencias de lujo | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-venta-san-bartolo-ameyalco-df-30143383) |
| 50 | Rancho San Francisco (1000 m2) | Casa | $47,000,000 | 1000 | $47,000 | ✅ Válida | > $20M — fraccionamientos y residencias de lujo | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-venta-rancho-san-francisco-san-bartolo-ameyalco-df-31393827) |
| 51 | Hidalgo (1589 m2) | Casa | $49,850,000 | 1589 | $31,372 | ✅ Válida | > $20M — fraccionamientos y residencias de lujo | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-venta-hidalgo-san-bartolo-ameyalco-df-30893159) |
| 52 | San Bartolo (1200 m2) | Casa | $50,000,000 | 1200 | $41,667 | ✅ Válida | > $20M — fraccionamientos y residencias de lujo | [Propiedades.com](https://propiedades.com/san-bartolo-ameyalco-alvaro-obregon-df/) |
| 53 | Ampl. Rancho San Francisco (979 m2) | Casa en condominio | $56,000,000 | 979 | $57,201 | ✅ Válida | > $20M — fraccionamientos y residencias de lujo | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-condominio-en-venta-ampl-rancho-san-francisco-san-bartolo-ameyalco-df-31688051) |
| 54 | Sin dirección publicada (867 m2) | Casa en condominio | $59,427,820 | 867 | $68,544 | ✅ Válida | > $20M — fraccionamientos y residencias de lujo | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-condominio-en-venta-san-bartolo-ameyalco-df-31405599) |
| 55 | Rancho San Francisco (1100 m2) | Casa en condominio | $62,500,000 | 1100 | $56,818 | ✅ Válida | > $20M — fraccionamientos y residencias de lujo | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-condominio-en-venta-rancho-san-francisco-san-bartolo-ameyalco-df-31351693) |
| 56 | Ampliación San Francisco 48 | Casa | $69,750,000 | 1048 | $66,555 | ✅ Válida | > $20M — fraccionamientos y residencias de lujo | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-venta-san-bartolo-ameyalco-df-30962433) |
| 57 | Rancho San Francisco (1092 m2) | Casa | $22,500,000 | 1092 | $20,604 | ✅ Válida | > $20M — fraccionamientos y residencias de lujo | [Propiedades.com](https://propiedades.com/san-bartolo-ameyalco-alvaro-obregon-df/) |
| 58 | Casa 210 m2 (18.0 M) | Casa | $18,000,000 | 210 | $85,714 | ✅ Válida | $8M – $20M — medio-alto | [Propiedades.com](https://propiedades.com/san-bartolo-ameyalco-alvaro-obregon-df/) |
| 59 | C. La Palma #27 Int. Casa 2 (130 m2) | Casa | $4,300,000 | 130 | $33,077 | 🚫 Duplicado de otra publicación | — | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-venta-palma-27-san-bartolo-ameyalco-df-31475600) |
| 60 | C. La Palma 27 (174 m2) | Casa | $4,435,000 | 174 | $25,489 | 🚫 Duplicado de otra publicación | — | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-venta-c-la-palma-27-san-bartolo-ameyalco-alvaro-obregon-01800-ciudad-de-mexico-cdmx-27-san-bartolo-ameyalco-df-31554013) |
| 61 | Muitles (60 m2) | Departamento | $2,900,000 | 60 | $48,333 | 🚫 Duplicado de otra publicación | — | [Propiedades.com](https://propiedades.com/inmuebles/departamento-en-venta-muitles-san-bartolo-ameyalco-df-31735215) |
| 62 | Miguel Hidalgo 148 (326 m2) | Casa | $15,500,000 | 326 | $47,546 | 🚫 Duplicado de otra publicación | — | [icasas.mx](https://www.icasas.mx/venta/habitacionales-casas-distrito-federal-alvaro-obregon-san-bartolo-ameyalco-2_5_1_0_264_691/p_2) |
| 63 | Cerrada Hidalgo 24-148 (370 m2) | Casa | $16,500,000 | 370 | $44,595 | 🚫 Duplicado de otra publicación | — | [icasas.mx](https://www.icasas.mx/venta/habitacionales-casas-distrito-federal-alvaro-obregon-san-bartolo-ameyalco-2_5_1_0_264_691) |
| 64 | Montpellier, Rancho San Francisco (520 m2) | Casa | $33,999,999 | 520 | $65,385 | 🚫 Duplicado de otra publicación | — | [icasas.mx](https://www.icasas.mx/venta/habitacionales-casas-distrito-federal-alvaro-obregon-san-bartolo-ameyalco-2_5_1_0_264_691/p_2?dup=montpellier) |
| 65 | Camino al Desierto de los Leones (508 m2) | Casa en condominio | $19,500,000 | 508 | $38,386 | 🚫 Duplicado de otra publicación | — | [icasas.mx](https://www.icasas.mx/venta/habitacionales-casas-distrito-federal-alvaro-obregon-san-bartolo-ameyalco-2_5_1_0_264_691/p_2?dup=camino) |
| 66 | Camino al Desierto de los Leones (514 m2) | Casa | $19,500,000 | 514 | $37,938 | ✅ Válida | $8M – $20M — medio-alto | [Propiedades.com](https://propiedades.com/inmuebles/casa-en-venta-rancho-san-bartolo-san-bartolo-ameyalco-df-31778964) |
| 67 | Prol. Palmas 114 | Casa | $794,000 | 190 | $4,179 | 🚫 Remate | — | [icasas.mx](https://www.icasas.mx/venta/habitacionales-casas-distrito-federal-alvaro-obregon-san-bartolo-ameyalco-2_5_1_0_264_691/f_remate-bancario) |
| 68 | Segunda Cda. de Hidalgo 5 casa 12 | Casa | $3,380,000 | 230 | $14,696 | 🚫 Remate | — | [icasas.mx](https://www.icasas.mx/venta/habitacionales-casas-distrito-federal-alvaro-obregon-san-bartolo-ameyalco-2_5_1_0_264_691/f_remate-bancario) |
| 69 | De Hidalgo (180 m2) | Casa | — | 180 | — | 🚫 Cesión de derechos | — | [icasas.mx](https://www.icasas.mx/venta/habitacionales-casas-distrito-federal-alvaro-obregon-san-bartolo-ameyalco-2_5_1_0_264_691/f_remate-bancario) |
| 70 | Departamento 70 m2 (remate hipotecario) | Departamento | $580,000 | 70 | $8,286 | 🚫 Remate | — | [Inmuebles24](https://www.inmuebles24.com/departamentos-en-venta-en-san-bartolo-ameyalco.html) |

---

## Advertencias sobre estos datos

1. **Los precios son de OFERTA, no de cierre.** En CDMX el cierre suele quedar por debajo del anuncio; aplica un descuento de negociación antes de decidir. La mediana de oferta sirve para comparar, no para prometer resultados.
2. **No se verificó ni un folio real.** Toda la columna de certeza jurídica está en "no verificado": la evidencia documental de la zona (DOF 18/11/1994) señala irregularidad sistémica, pero eso no sustituye la consulta registral inmueble por inmueble.
3. **La captura se hizo el 2026-10-02** desde resultados de búsqueda de portales. Los anuncios se dan de baja, cambian de precio o se duplican entre agencias; los duplicados detectados están marcados. Antes de invertir, re-verifica cada URL.
4. **El inventario de 5,500 propiedades no está verificado.** No existe un conteo público consultado en esta herramienta. Debe confirmarse descargando el padrón catastral de la alcaldía (SIG CDMX, CSV por alcaldía) y contando predios dentro de la poligonal.

_Modelo financiero v1.0.0 · importes en MXN · generado sin intervención manual de cifras._