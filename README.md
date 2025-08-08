<div align="center">

# FinData Chile

**Inteligencia Financiera Accesible y Accionable para el Mercado Chileno**  
Datos históricos estructurados de empresas chilenas listos para análisis, modelos y decisiones rápidas.

</div>

## 🧠 Resumen Ejecutivo

FinData Chile concentra, normaliza y distribuye estados financieros históricos de empresas chilenas en un formato consistente, listo para uso inmediato (Excel estructurado / futuro API). Ahorra horas de recopilación manual, reduce errores y acelera la toma de decisiones para analistas, inversionistas, consultores y equipos de corporate finance.

## � Propuesta de Valor

| Necesidad del Cliente                | Cómo lo Resuelve FinData Chile                                      | Beneficio Tangible                       |
| ------------------------------------ | ------------------------------------------------------------------- | ---------------------------------------- |
| Datos dispersos / desordenados       | Curación + estandarización multi-sector                             | Menos preparación previa (−70% tiempo)   |
| Retrasos en actualización            | Pipeline y jobs de scraping estructurados                           | Acceso temprano a datos recientes        |
| Formatos inconsistentes              | Excel multi-hojas normalizado (Resultados, Balance, Flujo, Resumen) | Integración directa a modelos existentes |
| Validación manual de compra / acceso | Control de derechos por transacción / suscripción                   | Seguridad y cumplimiento                 |
| Escalabilidad futura                 | Arquitectura modular (scraping, ETL, API)                           | Roadmap claro a API y dashboards         |

## 🧩 El Problema

Recolectar y estructurar estados financieros en Chile implica: buscar en múltiples fuentes (CMF, reportes PDF, sitios corporativos), limpiar datos y homogeneizar criterios contables. Estos pasos consumen recursos y generan fricción para equipos que deberían enfocarse en interpretar, no formatear.

## ✅ La Solución

Una plataforma centralizada con: catálogo navegable, descarga segura, pagos locales (Transbank), planes de suscripción y base técnica preparada para automatizar ingreso de nuevas series y métricas.

## 👥 ¿Para Quién?

- Inversionistas retail y semi-profesionales.
- Family offices y gestores de portafolio.
- Consultoras financieras / boutiques M&A.
- Startups Fintech que requieren datasets estructurados.
- Universidades y laboratorios de investigación aplicada.

## 🔍 Casos de Uso Clave

| Caso                                                     | Resultado                                          |
| -------------------------------------------------------- | -------------------------------------------------- |
| Modelos de valoración (DCF / comparables)                | Inputs limpios y consistentes por empresa / sector |
| Construcción de dashboards (Power BI / Looker / Tableau) | Excel directo a importación / futuras APIs         |
| Screening sectorial rápido                               | Filtros por sector, rango de años, tipo de dato    |
| Backtesting estrategias                                  | Series históricas ordenadas por trimestre / año    |
| Preparación de due diligence                             | Consolidación multifuente en minutos               |

## ⚙️ Beneficios Clave

- Tiempo de preparación → análisis (en vez de limpieza).
- Datos estructurados que minimizan errores humanos.
- Integración natural con procesos existentes (Excel primero, API después).
- Escalable a métricas derivadas (márgenes, ratios, growth, volatilidad).
- Diseño pensado para compliance y control de acceso.

## 🥇 Diferenciadores

| FinData Chile                           | Alternativas Manuales  | Otras Fuentes Genéricas              |
| --------------------------------------- | ---------------------- | ------------------------------------ |
| Foco local profundo (empresas Chilenas) | Alto esfuerzo personal | Menor resolución / cobertura parcial |
| Pagos WebPay (confianza mercado local)  | No aplica              | Tarjetas internacionales / fricción  |
| Estructura consistente multi-sector     | Inconsistente          | Normalización limitada               |
| Roadmap API + dashboards                | No escalable           | Roadmap no focalizado regionalmente  |
| Control de derechos por compra          | Riesgo compartido      | Accesos amplios / sin granularidad   |

## 💼 Modelo de Negocio

1. Venta puntual de datasets (Excel por empresa / rango de años).
2. Suscripciones (mensual / trimestral / anual) con acceso a múltiples empresas y actualizaciones periódicas.
3. Futuro: API premium, paquetes sectoriales, métricas derivadas, alertas y monitoreo.

## 📈 Métricas que Importan (KPIs Objetivo Inicial)

- Tasa de conversión visita → primera descarga.
- Tiempo medio entre compra y segunda compra (retención).
- % usuarios que migran a suscripción luego de 2+ compras.
- Latencia de actualización: diferencia entre publicación oficial y disponibilidad en plataforma.

## 🚀 Estado Actual (MVP Técnico Listo)

- Catálogo navegable y filtrable.
- Descarga segura controlada por compra validada.
- Pagos con Transbank en modo integración listo para pasar a producción.
- Infraestructura de scraping y generación de Excels preparada (simulada / acoplable a fuentes reales CMF).
- Suscripciones definidas a nivel de modelo (fácil activación de lógica recurrente).

## 🛤️ Roadmap Comercial Corto Plazo

| Fase | Objetivo           | Entregable                          |
| ---- | ------------------ | ----------------------------------- |
| 1    | Validación mercado | 50 clientes de compra única         |
| 2    | Activar retención  | Conversión 25% a plan mensual       |
| 3    | Escalar producto   | API pública (lectura)               |
| 4    | Profundizar valor  | Dashboards comparativos sectoriales |
| 5    | Expansión          | Integración métricas ESG / riesgo   |

## 📣 Llamado a la Acción

¿Necesitas bases financieras limpias y listas hoy?

1. Explora el catálogo.
2. Agrega empresas al carrito.
3. Paga con WebPay y descarga en segundos.
4. Escala a un plan si necesitas actualización continua.

Contacto comercial: (agregar email / formulario)

---

# 🛠 Guía Técnica (Para Desarrolladores / Operaciones)

## Tecnologías Base

Next.js 15 · React 19 · TypeScript · Tailwind · Radix UI · Postgres · Transbank SDK · XLSX · Arquitectura modular para scraping / ETL.

## Arquitectura (Resumen)

| Capa                 | Descripción                                                                                              |
| -------------------- | -------------------------------------------------------------------------------------------------------- |
| Next.js (App Router) | Pages públicas, panel admin, endpoints API serverless.                                                   |
| Base de Datos        | Postgres (users, products, cart_items, purchases, download_history, transactions, transaction_products). |
| Archivos             | `public/excel-products`, `storage/`, Vercel Blob (tokens).                                               |
| Autenticación        | JWT custom admin + user (HMAC).                                                                          |
| Pagos                | WebPay Plus (transbank-sdk).                                                                             |
| Datos                | Generación Excel + pipeline scraping escalable.                                                          |

## Estructura Relevante

```
app/
  page.tsx                Landing / catálogo
  api/                    Endpoints (productos, pago, carrito, descargas, auth)
components/               UI y módulos de panel / ecommerce
lib/                      Lógica de negocio, BD, scraping, auth, pagos
public/excel-products/    Archivos Excel servidos
scripts/                  Utilidades (check-env, setup vercel)
storage/                  Archivos subidos / pagados (modo local)
```

## Variables de Entorno (Resumen)

```
ADMIN_USERNAME=...
ADMIN_PASSWORD=...
ADMIN_JWT_SECRET=...
USER_JWT_SECRET=...
JWT_SECRET=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
PGHOST=...
PGPORT=5432
PGDATABASE=...
PGUSER=...
PGPASSWORD=...
TRANSBANK_COMMERCE_CODE=...
TRANSBANK_API_KEY=...
TRANSBANK_ENVIRONMENT=integration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
STORAGE_ROOT=./storage
BLOB_READ_WRITE_TOKEN=...
```

Recomendaciones: Secrets largos; separar ambientes; rotación periódica.

## Base de Datos (Operaciones)

Funciones clave: `createUser`, `addToCart`, `createPurchase`, `recordDownload`, `canUserDownload`, `upsertProduct`.

## Pago (WebPay) Flujo

1. `POST /api/payment/initiate`
2. Generación `buyOrder` + `sessionId`
3. Creación transacción → Redirección WebPay
4. Retorno → Validación / marcado `completed`
5. Descarga habilitada

## Carrito

Endpoints: `/api/cart/add`, `/api/cart/remove`, `/api/cart/items`, `/api/cart/clear`.  
Guests → cookie `guestId`; usuarios → `userToken`.

## Productos

`GET /api/products` (param `showAll=true` para admin). Transformación snake_case→camelCase en capa API.

## Scraping & Excel

`scraping-workflow.ts` (jobs + raw + procesado) y `excel-generator.ts` (workbook estandarizado).

## Scripts

| Script           | Descripción        |
| ---------------- | ------------------ |
| `pnpm dev`       | Desarrollo local   |
| `pnpm build`     | Build producción   |
| `pnpm start`     | Servir build       |
| `pnpm check-env` | Validación entorno |

## Puesta en Marcha Local

```bash
cp env.example .env.local
pnpm install
# Crear / migrar BD
pnpm dev
```

Abrir: http://localhost:3000

## Descargas Seguras

Control por tabla `purchases` (status `completed`) + validación `canUserDownload`.

## Suscripciones

Definidas en `product-management.ts`; extender a cron / webhooks para cobrar y actualizar.

## Seguridad

- No exponer secrets en cliente.
- Cookies SameSite=Lax.
- Validar inputs (recomendado zod adicional).
- Rotación secrets.

## Licencia

Derechos Reservados © FinData Chile. Uso interno / propietario.

## Contacto

Agregar email / canal para acuerdos comerciales, soporte técnico y formatos personalizados.

---

Este documento mezcla visión comercial y guía técnica. Ajustar narrativa según público (inversionistas, clientes, socios).
