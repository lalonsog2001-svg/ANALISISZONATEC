# Índice de fuentes de verificación

> Generado automáticamente desde `src/fuentes.js` por `npm run docs`.

| Fuente | Tipo | Uso | URL | Verificada |
| --- | --- | --- | --- | --- |
| **Inmuebles24** | Portal | Muestra de inmuebles activos: precio de publicación, colonia, m², tipo. Fuente primaria para el cálculo de mediana y ticket. | <https://www.inmuebles24.com/> | sí |
| **Propiedades.com** | Portal | Muestra de respaldo y cruce de precios. Publica indicadores de Time on Market por zona. | <https://propiedades.com/> | sí |
| **Lamudi** | Portal | Tercera fuente de cruce para validar que el precio no es un artefacto de un solo portal. | <https://www.lamudi.com.mx/> | sí |
| **Sistema Abierto de Información Geográfica (SIG CDMX)** | Oficial | Valor catastral de suelo y ficha por predio. Descarga CSV/Shapefile por alcaldía con cuenta catastral, superficie, uso de suelo y niveles. | <https://sig.cdmx.gob.mx/datos/descarga> | sí |
| **OVICA — Oficina Virtual del Catastro CDMX** | Oficial | Cédula catastral, clave catastral, cuenta predial, constancias de medidas y colindancias. | <https://ovica.finanzas.cdmx.gob.mx/> | sí |
| **Registro Público de la Propiedad y de Comercio CDMX** | Oficial | Verificación de escritura, folio real, gravámenes y limitaciones de dominio. Filtro obligatorio de la Fase 0: inmuebles sin escritura quedan fuera de la muestra. | <https://data.consejeria.cdmx.gob.mx/index.php/dgrppyc> | sí |
| **DENUE — INEGI (Directorio Estadístico Nacional de Unidades Económicas)** | Oficial | Conteo exacto de competencia: filtrar SCIAN 5311 (servicios inmobiliarios) y 5312 en el polígono de operación. Conteo de servicios, bancos, escuelas y comercio para lectura de zona. | <https://www.inegi.org.mx/app/mapa/denue/> | sí |
| **Índice SHF de Precios de la Vivienda (Sociedad Hipotecaria Federal)** | Oficial | Tendencia de precios por ciudad/entidad. Valida si la zona está apreciando, plana o corrigiendo; evita asumir plusvalía no verificada. | <https://transparencia.shf.gob.mx/sitepages/IndicePV.aspx> | sí |
| **Portal de Datos Abiertos de la CDMX** | Oficial | Bases descargables (CSV) de trámites, licencias, uso de suelo y estadística de la ciudad para construir la ficha de la zona. | <https://datos.cdmx.gob.mx/> | sí |
| **Tinsa México / Softec** | Consultora privada (paga) | Inventario, absorción y time on market por segmento. Es el estándar para medir rotación real sin depender de portales. | <https://www.tinsa.com.mx/> | **no** |
| **Dirección de Franquicias TECNOCASA México** | Franquiciador | Única fuente válida para: monto y estructura de la regalía, fondo publicitario, manual de marca y la regla de delimitación territorial de 5,500 propiedades. | — | **no** |

## Notas por fuente

### Inmuebles24

Muestra de inmuebles activos: precio de publicación, colonia, m², tipo. Fuente primaria para el cálculo de mediana y ticket.

**Nota:** Los precios de portal son precios DE OFERTA, no de cierre. Aplicar descuento de negociación antes de dictaminar.

### Propiedades.com

Muestra de respaldo y cruce de precios. Publica indicadores de Time on Market por zona.

**Nota:** El portal publica análisis de Time on Market (días/meses que un anuncio permanece activo). Útil para estimar rotación real, no la del modelo.

### Lamudi

Tercera fuente de cruce para validar que el precio no es un artefacto de un solo portal.

**Nota:** Se recomienda triangular: 60% de la muestra en Inmuebles24, 25% en Propiedades.com, 15% en Lamudi.

### Sistema Abierto de Información Geográfica (SIG CDMX)

Valor catastral de suelo y ficha por predio. Descarga CSV/Shapefile por alcaldía con cuenta catastral, superficie, uso de suelo y niveles.

**Nota:** Fuente oficial del Catastro de la CDMX (Secretaría de Finanzas). Ideal para validar precio publicado vs. valor catastral y detectar sobrevaloración.

### OVICA — Oficina Virtual del Catastro CDMX

Cédula catastral, clave catastral, cuenta predial, constancias de medidas y colindancias.

**Nota:** Trámite oficial. Sirve para cerrar la certeza jurídica del predio antes de captarlo.

### Registro Público de la Propiedad y de Comercio CDMX

Verificación de escritura, folio real, gravámenes y limitaciones de dominio. Filtro obligatorio de la Fase 0: inmuebles sin escritura quedan fuera de la muestra.

**Nota:** La Dirección General del Registro Público de la Propiedad depende de la Consejería Jurídica y de Servicios Legales. Portal con consulta y seguimiento de trámites.

### DENUE — INEGI (Directorio Estadístico Nacional de Unidades Económicas)

Conteo exacto de competencia: filtrar SCIAN 5311 (servicios inmobiliarios) y 5312 en el polígono de operación. Conteo de servicios, bancos, escuelas y comercio para lectura de zona.

**Nota:** Gracias a esta fuente el criterio de "inmobiliarias en radio de 1.5 km" pasa de estimación subjetiva a conteo auditable.

### Índice SHF de Precios de la Vivienda (Sociedad Hipotecaria Federal)

Tendencia de precios por ciudad/entidad. Valida si la zona está apreciando, plana o corrigiendo; evita asumir plusvalía no verificada.

**Nota:** Datos abiertos en CSV. INEGI también publica series del mercado de vivienda (créditos, precios).

### Portal de Datos Abiertos de la CDMX

Bases descargables (CSV) de trámites, licencias, uso de suelo y estadística de la ciudad para construir la ficha de la zona.

**Nota:** Licencias de construcción y uso de suelo ayudan a prever competencia nueva (nuevos desarrollos).

### Tinsa México / Softec

Inventario, absorción y time on market por segmento. Es el estándar para medir rotación real sin depender de portales.

**Nota:** NO VERIFICADO EN ESTA HERRAMIENTA: URL y disponibilidad no confirmadas. Si no contratas el reporte, decláralo como limitación del dictamen.

### Dirección de Franquicias TECNOCASA México

Única fuente válida para: monto y estructura de la regalía, fondo publicitario, manual de marca y la regla de delimitación territorial de 5,500 propiedades.

**Nota:** NO VERIFICADO: la app no tiene acceso a documentación interna de la franquicia. Solicita el contrato de franquicia y el manual de operaciones vigente.
