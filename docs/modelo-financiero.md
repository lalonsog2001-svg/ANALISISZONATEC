# Modelo Financiero Base (INMUTABLE)

> Generado automáticamente desde `src/model.js` por `npm run docs`.

**Versión del modelo:** 1.0.0 · **Moneda:** MXN

## Costo operativo mensual

| Concepto | Mínimo | Máximo |
| --- | --- | --- |
| Regalía Tecnocasa (royalty + fondo publicitario) | $25,000 | $35,000 |
| Renta de local comercial (60–90 m², zona media CDMX) | $25,000 | $40,000 |
| Nómina base (1 gerente + 3–4 asesores comisionistas + 1 admin) | $35,000 | $45,000 |
| Servicios (luz, agua, internet, teléfono) | $3,000 | $5,000 |
| Marketing local (volanteo, lonas, Facebook/Instagram Ads) | $8,000 | $12,000 |
| Seguros, contabilidad, misceláneos | $5,000 | $8,000 |
| **Suma del desglose** | **$101,000** | **$145,000** |

| Escenario | Costo mensual | Ticket mínimo al 6% para cubrirlo con 1 venta |
| --- | --- | --- |
| Base | $120,000 | $2,000,000 |
| Con buffer (+20%) | $144,000 | $2,400,000 |
| Conservador alto | $160,000 | $2,666,667 |

## Consistencia interna del desglose

- Suma de los mínimos del desglose: **$101,000**
- Suma de los máximos del desglose: **$145,000**
- Costo base declarado por el modelo: **$120,000** (dentro del rango $101,000–$145,000)

> **Observación de AnalisisZonaTec:** el desglose no suma exactamente $120,000; los conceptos
> se comportan como rangos y el costo base queda en un punto medio. Consecuencia práctica: si varios
> conceptos se van simultáneamente a su máximo, el costo mensual alcanza $145,000, que es **$1,000 mayor** que el escenario con buffer ($144,000).
> Por eso el techo de planeación debe ser el escenario conservador alto ($160,000), no el buffer.

## Parámetros de operación

- Comisión estándar: **6%** del precio de venta (vendedor, comprador o split 3%+3%).
- Delimitación territorial: **5,500 propiedades por oficina** (no modificable).
- Rango de rotación urbana CDMX: **1.5% – 3%** anual.

## Aritmética verificable

| Concepto | Valor | Cómo se obtiene |
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

## Umbrales del dictamen (criterio propuesto, editable)

> Estos umbrales **no** provienen del modelo del franquiciatario ni de documentación oficial de
> TECNOCASA: son el criterio con el que AnalisisZonaTec traduce números a semáforo. Deben validarse
> con el franquiciador antes de usarse como regla contractual.

| Umbral | Valor |
| --- | --- |
| muestraMinima | 20 |
| muestraRobusta | 30 |
| certezaVerdePct | 80 |
| certezaAmarillaPct | 60 |
| competidoresVerde | 8 |
| competidoresAmarillo | 15 |
| trazabilidadMinPct | 80 |
| participacionVerdePct | 15 |
| participacionRojoPct | 30 |

## Ejemplo de verificación manual

Con 20 inmuebles válidos cuya mediana de precio es `$2,400,000`, comisión 6%, rotación 1.5% y una captación asumida de 10%:

- Comisión mediana: $172,500
- Ventas de la zona: 5,500 × 1.5% = 83 al año (6.9 al mes)
- Ventas de la oficina: 8.25 al año · ingreso $118,594/mes
- Costo del escenario con buffer: $144,000/mes → cobertura 82.4% · margen -$25,406
- Ventas requeridas para equilibrio: 10.02 al año → participación requerida 12.1% del mercado de la zona

Estas cifras se pueden reproducir a mano y están cubiertas por las pruebas automatizadas (`npm test`).
