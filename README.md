# AnalisisZonaTec

**Evaluador de viabilidad de zonas para la apertura de una oficina inmobiliaria franquiciada (CDMX).**
Convierte una captura de inmuebles con fuente en KPIs auditables y un **dictamen con semáforo** (🟢 viable / 🟡 condiciones / 🔴 no viable), midiendo el ticket de la zona contra el costo operativo del modelo de apertura.

```
Costo operativo con buffer   $144,000 MXN/mes   (escenario alto: $160,000)
Ticket mínimo al 6%          $2,400,000 MXN     (alto: $2,666,667)
Delimitación territorial     5,500 propiedades por oficina (no modificable)
```

---

## Qué resuelve

El Plan Maestro de 12 meses exige validar, antes de firmar un local, que la zona genera el ticket mínimo y tiene rotación suficiente. El punto ciego de ese cálculo es que **estimar las ventas del polígono no dice cuánto captura tu oficina**. Si se asume el 100%, cualquier zona con precios de mercado sale viable.

Esta herramienta introduce la variable que falta — **captación de la oficina** — y calcula el KPI que realmente decide: la **participación de mercado requerida** para no perder dinero.

> Ejemplo: si el polígono tiene 82 ventas al año (5,500 × 1.5%) y tu costo anual es $1,728,000, necesitas ~9 ventas al año a ticket de $2.4M: **11% del mercado de la zona**. Si ese número supera el 30%, el plan depende de dominar el territorio y el dictamen lo marca en rojo, aunque el ticket esté bien.

## Cómo se usa

```bash
npm start          # sirve la app en http://localhost:8000 (bind 0.0.0.0)
npm test           # 103 pruebas: motor, parser y humo de interfaz (sin dependencias)
npm run docs       # regenera docs/plan-maestro.md, modelo-financiero.md y fuentes.md
npm run verificar  # 16 pruebas en DOM real con jsdom (requiere: npm i -D jsdom)
```

La aplicación **no tiene dependencias**: es HTML + CSS + JavaScript nativo (módulos ES) y funciona con cualquier servidor estático; `npm test` corre sin instalar nada. `npm run verificar` es opcional y usa `jsdom` (única devDependency) para cargar el `index.html` real, ejecutar la app e interactuar con eventos de navegador.

Ábrela, crea una zona y captura la muestra (hay una zona de ejemplo con datos ilustrativos para ver el mecanismo).

Flujo de trabajo de la Fase 0:

1. **Crear zona** → colonia, CP o polígono.
2. **Capturar muestra** → precio, m² y **URL de la fuente** por inmueble (formulario o importación por lote pegando una lista).
3. **Filtrar** → remates, cesiones, litigios, "solo contado", sin escritura RPP y sin precio quedan fuera de la estadística automáticamente.
4. **Ajustar supuestos** → rotación (1.5%–3%), captación de la oficina, competidores en 1.5 km, colchón de capital.
5. **Leer el dictamen** → KPIs, criterios ponderados, bloqueos, condiciones y qué verificar a continuación.
6. **Comparar** 2–3 polígonos candidatos y **copiar/exportar el expediente**.

## Estructura

| Archivo | Contenido |
| --- | --- |
| `index.html` · `styles.css` · `src/app.js` | Interfaz (sin dependencias, sin build) |
| `src/model.js` | **Modelo financiero base inmutable**: costo, comisión, ticket mínimo, 5,500 propiedades, umbrales del dictamen |
| `src/engine.js` | Estadística de la muestra, KPIs, criterios ponderados, dictamen y comparación |
| `src/parser.js` | Captura masiva: detecta precio, m², URL, estatus y certeza por contenido |
| `src/plan.js` | Plan Maestro de 12 meses (5 fases) con acciones, KPIs y alertas |
| `src/fuentes.js` | Fuentes verificables y ruta de verificación de cada criterio |
| `tests/` | Pruebas del motor, del parser y humo de la interfaz (sin dependencias) |
| `scripts/verificar-navegador.mjs` | Verificación opcional sobre el DOM real de `index.html` con jsdom |
| `scripts/generar-docs.mjs` | Genera la documentación desde el código para que no se desincronice |
| `docs/` | Plan Maestro, modelo financiero, fuentes, metodología y prompt completo del agente |

## Los 8 criterios del dictamen

| Criterio | Peso | Verde | Rojo |
| --- | --- | --- | --- |
| Muestra válida | 3 | ≥ 30 inmuebles | < 20 |
| Ticket vs. punto de equilibrio | 3 | mediana ≥ ticket mínimo | < 75% del mínimo |
| Participación de mercado requerida | 2 | ≤ 15% | > 30% |
| Cobertura del costo (captación asumida) | 2 | ≥ 100% y holgura ≥ 0 | < 70% **y** participación requerida > 30% |
| Certeza jurídica (RPP) | 2 | ≥ 80% escriturado | < 60% |
| Competencia en 1.5 km | 1 | ≤ 8 inmobiliarias | > 15 |
| Trazabilidad (fuente con URL) | 1 | ≥ 80% | < 50% |
| Colchón de capital | 1 | ≥ 12 meses | < 6 meses |

Un criterio en rojo **bloquea** el dictamen. La luz verde exige puntaje ponderado ≥ 85, muestra suficiente **y** cobertura del costo ≥ 100%: si el plan asumido pierde dinero, el dictamen nunca es 🟢, aunque el resto esté bien.

Dos matices de diseño que evitan dictámenes engañosos:

- **Cobertura ≠ viabilidad de la zona.** La cobertura mide tu *supuesto de captación*; la viabilidad estructural la mide la *participación requerida*. Si la zona solo exige 13% del mercado pero tu supuesto dice 10%, el resultado es una 🟡 con la instrucción de subir el supuesto — no un 🔴 que entierre una zona buena.
- **El 🔴 de cobertura se reserva** para zonas que además exigen más del 30% del mercado: ahí no hay supuesto que salve el polígono.

Los umbrales son criterio operativo propuesto (no documentación oficial) y son **editables** en la pestaña *Método y fuentes*.

## Límites declarados

- La app **no descarga datos de mercado**. No se conecta a Inmuebles24, Propiedades.com, Lamudi, RPP, Catastro ni INEGI: no descarga ni estima precios. Toda cifra de mercado la captura el usuario con su fuente.
- Los precios de portal son **precios de oferta**, no de cierre: aplica descuento de negociación antes de decidir.
- La **captación de la oficina en el año 1 (10%)** y el **colchón de 12 meses** son supuestos de esta herramienta, no datos del franquiciador ni de TECNOCASA. Están marcados como `SP1` y son editables.
- Los montos de regalía y fondo publicitario ($25k–$35k) provienen del modelo del franquiciatario; la única fuente válida para confirmarlos es el contrato de franquicia vigente.
- Los dictámenes son tan confiables como los datos capturados. Un expediente sin URL de fuente no es un análisis: es una opinión.

## Convención de origen de datos

| Etiqueta | Significado |
| --- | --- |
| `SP2` | Dato provisto en el modelo de apertura del franquiciatario |
| `SP1` | Supuesto operativo propuesto por esta herramienta, editable y pendiente de validación |

---

Herramienta de cálculo y expediente. No constituye asesoría financiera, legal ni registral.
