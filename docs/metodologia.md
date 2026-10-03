# Metodología del dictamen

Este documento explica **cómo se calcula cada número** de AnalisisZonaTec, con la aritmética completa para que cualquier cifra se pueda reproducir a mano y auditar.

---

## 1. De la captura al dictamen

```
Inmuebles capturados (precio, m², tipo, URL, estatus, certeza)
        │
        ├── Filtro obligatorio de exclusión  →  remates, cesiones, litigios,
        │                                       "solo contado", sin escritura RPP,
        │                                       sin precio publicado
        ▼
Muestra válida  →  mediana, P25, P75, precio/m², dispersión
        │
        ▼
KPIs  →  ticket · demanda · captación · cobertura · certeza · competencia · trazabilidad · colchón
        │
        ▼
8 criterios ponderados  →  bloqueos (rojo) + condiciones (amarillo)
        │
        ▼
DICTAMEN  🟢 / 🟡 / 🔴 / ⚪ (sin datos suficientes)
```

## 2. Estadística de la muestra

- **Mediana**: valor central de los precios válidos. Manda sobre el promedio porque es robusta a los inmuebles atípicos (penthouse o bodega mal clasificada).
- **P25 / P75**: rango donde vive el 50% central del mercado de la zona.
- **Coeficiente de variación** (desviación ÷ promedio): si supera ~40%, la zona tiene segmentos mezclados y conviene partir la muestra por tipología.
- **Precio por m²**: solo con los registros que traen superficie.

Regla de trazabilidad: un inmueble sin URL de publicación no cuenta para el indicador y baja el criterio de trazabilidad (peso 1).

## 3. Ticket vs. punto de equilibrio

```
Comisión por operación = Mediana(precio) × 6%
```

| Escenario | Costo mensual | Ticket mínimo para 1 venta/mes |
| --- | --- | --- |
| Con buffer | $144,000 | $2,400,000 |
| Conservador alto | $160,000 | $2,666,667 |

Si la mediana de la zona queda por debajo, la estructura **no se sostiene con una operación al mes**: exige dos, o migrar la cartera a un segmento más alto.

⚠️ **Consistencia del desglose de costos**: los mínimos del desglose suman $101,000 y los máximos $145,000. El costo base declarado ($120,000) queda en un punto medio. Si varios conceptos se van simultáneamente a su máximo, el costo mensual llega a $145,000, es decir $1,000 arriba del escenario con buffer ($144,000). De ahí que el techo de planeación deba ser el escenario alto ($160,000).

## 4. Demanda de la zona y captación de la oficina

Esta es la parte que el modelo base deja abierta y donde se concentra el riesgo del plan.

```
Ventas anuales de la ZONA      = 5,500 propiedades × rotación anual (1.5% – 3%)
Ventas anuales de TÚ OFICINA   = Ventas de la zona × captación asumida (default 10%)
Ingreso mensual estimado       = (Ventas de tu oficina ÷ 12) × comisión mediana
Cobertura del costo            = Ingreso mensual ÷ costo mensual
```

Ejemplo a rotación 1.5%, captación 10%, mediana $2.4M:

| Paso | Cálculo | Resultado |
| --- | --- | --- |
| Comisión mediana | 2,400,000 × 6% | $144,000 |
| Ventas de la zona | 5,500 × 1.5% | 82.5 al año (6.9/mes) |
| Ventas de tu oficina | 82.5 × 10% | 8.25 al año (0.69/mes) |
| Ingreso mensual | 0.69 × 144,000 | $99,000 |
| Cobertura | 99,000 ÷ 144,000 | **68.8%** ❌ |
| Margen | 99,000 − 144,000 | **−$45,000/mes** |

## 5. El KPI que decide: participación de mercado requerida

```
Ventas anuales necesarias = Costo anual ÷ Comisión mediana
Participación requerida   = Ventas necesarias ÷ Ventas anuales de la zona
```

Con el ejemplo anterior: `1,728,000 ÷ 144,000 = 12 ventas/año`; `12 ÷ 82.5 = **14.5%** del mercado de la zona`.

| Participación requerida | Lectura | Semáforo |
| --- | --- | --- |
| ≤ 15% | Tajada alcanzable con el tamaño de la zona | 🟢 |
| 15% – 30% | Exigente: cada competidor adicional quita margen | 🟡 |
| > 30% | Ninguna oficina nueva domina un tercio del mercado en el año 1 | 🔴 |

Este indicador es el que evita el error más caro del plan: una zona con ticket perfecto y mercado demasiado chico para la estructura de costos.

## 6. Criterios cualitativos

### Certeza jurídica
```
% escriturado = inmuebles con folio real / inmuebles con estatus verificado
```
Fuente: Registro Público de la Propiedad CDMX (folio real, gravámenes) y Catastro CDMX (cuenta catastral, valor de suelo). Los inmuebles marcados "sin escritura" además salen de la muestra por el filtro de exclusión.

### Competencia
Conteo de unidades económicas SCIAN 5311 en el polígono de 1.5 km vía **DENUE (INEGI)**, complementado con recorrido físico. El indicador derivado útil es:
```
Ventas anuales de la zona ÷ número de competidores = ventas/año por competidor si todos compartieran el mercado
```
Si esa cifra es de un dígito, el pastel no alcanza para todos.

### Trazabilidad
```
% trazabilidad = inmuebles válidos con URL ÷ inmuebles válidos
```
Umbral 80%. Un expediente con menos es una opinión, no un análisis.

### Colchón de capital
```
Costo del colchón = meses financiados × costo mensual
```
12 meses = $1,728,000 con buffer. Con ciclo de venta de 2–4 meses en CDMX, menos de 6 meses de colchón es exposición crítica.

## 7. Ponderación y dictamen

| Criterio | Peso | Verde | Amarillo | Rojo |
| --- | --- | --- | --- | --- |
| Muestra válida | 3 | ≥ 30 | 20–29 | < 20 |
| Ticket vs. equilibrio | 3 | ≥ 100% del mínimo | 75–99% | < 75% |
| Participación requerida | 2 | ≤ 15% | 15–30% | > 30% |
| Cobertura del costo (captación asumida) | 2 | ≥ 100% y holgura ≥ 0 | 70–99% o holgura < 0 | < 70% **y** participación requerida > 30% |
| Certeza jurídica | 2 | ≥ 80% | 60–79% | < 60% |
| Competencia | 1 | ≤ 8 | 9–15 | > 15 |
| Trazabilidad | 1 | ≥ 80% | 50–79% | < 50% |
| Colchón de capital | 1 | ≥ 12 meses | 6–11 | < 6 |

```
Puntaje = Σ (peso × valor) ÷ Σ pesos        verde = 1 · amarillo = 0.5 · rojo = 0
```

**Reglas de decisión**
1. Cualquier criterio en **rojo** → dictamen 🔴 con ese criterio listado como bloqueo.
2. Sin rojos, puntaje ≥ 0.85, muestra ≥ mínimo **y cobertura ≥ 100%** → 🟢.
3. Sin rojos y cualquiera de las condiciones anteriores sin cumplir → 🟡 con las condiciones por resolver.
4. Sin inmuebles válidos → ⚪ sin dictamen (no se emite opinión con cero datos).

**Por qué la cobertura solo llega a rojo cuando la participación requerida supera el 30%.** Son dos preguntas distintas: la participación requerida mide si el polígono puede sostener la estructura de costos (viabilidad de la zona); la cobertura mide si *tu supuesto de captación* alcanza (viabilidad de tu plan). Si la zona solo exige 13% y tu supuesto dice 10%, el veredicto correcto es 🟡 con la instrucción de subir el supuesto: castigar eso con 🔴 enterraría zonas buenas por un dato mal escrito.

**Por qué no hay 🟢 con cobertura < 100%.** Un puntaje alto con un plan que pierde dinero al mes produce una falsa señal de "adelante": la última condición cierra esa puerta.

Estos umbrales son **criterio operativo propuesto por AnalisisZonaTec**, no documentación oficial de TECNOCASA ni del franquiciatario, y son editables en la interfaz.

## 8. Verificación

`npm test` ejecuta 93 pruebas: aritmética del modelo, estadística, KPIs de muestra controlada, semáforos en zonas sintéticas viables y no viables, comparación, parser de captura masiva y humo de cada vista de la interfaz. Cualquier cambio en el motor que altere un número rompe una prueba.

Todas las cifras del modelo se pueden reproducir a mano: `144,000 ÷ 0.06 = 2,400,000`; `5,500 × 1.5% ÷ 12 = 6.875` ventas al mes en la zona.
