### Guía de Estilos Corporativos – FinData Chile

Esta guía define la identidad visual y los lineamientos de diseño para mantener coherencia en todas las interfaces y comunicaciones de FinData Chile.

---

### Principios de marca

- **Profesional**: tono sobrio, claro y orientado a negocios.
- **Claro**: jerarquía tipográfica limpia y espacios generosos.
- **Confiable**: uso consistente de azules corporativos y grises neutros.
- **Accesible**: contraste suficiente y tamaños legibles.

---

### Logotipos y assets

Ubicación de archivos en `public/`:

- `public/logo-horizontal.svg` (principal, fondos claros)
- `public/logo-horizontal-light.svg` (versión clara para fondos oscuros/azules)
- `public/logo-compact.svg` (uso en espacios reducidos, favicon-dimensional)
- `public/favicon.svg`

Lineamientos de uso:

- **Clear space**: mantener un margen mínimo alrededor equivalente al 50% de la altura del logotipo.
- **Tamaños mínimos**: 24 px de alto en UI; 14 px en barras compactas.
- **Fondos**:
  - Fondos claros → `logo-horizontal.svg`
  - Fondos oscuros o azules → `logo-horizontal-light.svg`
- **No permitido**: distorsionar, rotar, aplicar sombras, contornos, efectos de brillo o cambiar colores del logo.

Ejemplos de uso en Next.js:

```tsx
import Image from "next/image"

// Fondo claro
<Image src="/logo-horizontal.svg" alt="FinData Chile" width={180} height={40} />

// Fondo azul/oscuro
<Image src="/logo-horizontal-light.svg" alt="FinData Chile" width={180} height={40} />
```

---

### Paleta de colores (Tailwind)

Colores corporativos principales (azules suaves y profesionales):

- Primario: `blue-600` (#2563EB)
- Primario hover: `blue-700` (#1D4ED8)
- Secundario/acento frío: `sky-600` (#0284C7)
- Éxito/validación: `emerald-600` (#059669)
- Aviso: `amber-600` (#D97706)

Neutros (tipografía y bordes):

- Títulos: `slate-900` / `slate-800`
- Texto: `slate-700` / `slate-600`
- Bordes: `slate-200`
- Superficie clara: `slate-50` / `white`

Reglas generales:

- Evitar texto con gradientes. Usar colores sólidos para legibilidad.
- Botones y CTAs usan azules (600 → hover 700).
- Acentos suaves con `sky-*`, confirmaciones con `emerald-*`.

---

### Tipografía y jerarquía

Tipografía base (Tailwind por defecto o fuente del proyecto):

- Títulos: peso fuerte/bold, tracking-tight, alturas amplias.
- Cuerpo: `text-slate-600`/`700` con `leading-relaxed`.

Escalas sugeridas:

- H1: `text-5xl md:text-7xl` (landing hero)
- H2: `text-3xl md:text-5xl` (secciones)
- H3: `text-xl` (cards y subtítulos)
- Párrafo destacado: `text-xl md:text-2xl`
- Cuerpo: `text-base` / `text-sm` para detalles

No usar: decoración con gradientes en texto, subrayados decorativos o sombras en títulos.

---

### Espaciado, bordes y sombras

- Espaciado vertical de secciones: `py-12` a `py-24` según contexto.
- Cards: `rounded-lg`, borde `border-slate-200`, fondo `bg-white`.
- Sombras: `shadow-sm` (base), `shadow-lg` (hover), evitar sombras excesivas.
- Bordes de énfasis en hover: variar a `border-blue-200`/`sky-200`.

---

### Componentes (tokens y variantes)

Botón primario (CTA):

```tsx
<Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl" />
```

Botón secundario (outline):

```tsx
<Button
  variant="outline"
  className="border-blue-200 text-blue-700 hover:bg-blue-50"
/>
```

Badge informativo:

```tsx
<Badge className="bg-slate-50 text-slate-700 border-slate-200" />
```

Card estándar:

```tsx
<Card className="border border-slate-200 bg-white shadow-lg hover:shadow-xl" />
```

Indicadores de confianza (puntos de color):

```html
<div class="h-2 w-2 rounded-full bg-blue-500"></div>
<div class="h-2 w-2 rounded-full bg-sky-500"></div>
<div class="h-2 w-2 rounded-full bg-emerald-500"></div>
```

Iconografía:

- Librería: `lucide-react`
- Tamaños comunes: 16–32 px en UI, 40–64 px en hero/cards destacados.
- Colores: `text-blue-600`, `text-sky-600`, `text-emerald-600` (según contexto).

---

### Fondos y patrones

Fondos corporativos sutiles (opcional):

```html
<div
  class="absolute inset-0 [background:radial-gradient(circle_at_center,rgba(0,0,0,0.01)_1px,transparent_1px)] [background-size:60px_60px]"></div>
<div
  class="absolute inset-0 bg-[linear-gradient(to_right,rgba(100,116,139,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.03)_1px,transparent_1px)] [background-size:120px_120px]"></div>
```

- Evitar fondos recargados; priorizar `white`/`slate-50`.
- No usar gradientes en texto; para fondos, usar gradientes suaves si se requiere (`from-blue-50 via-sky-50 to-slate-50`).

---

### Formularios

- Inputs con `border-slate-200`, foco con `ring-1 ring-blue-200`.
- Placeholders `text-slate-400`.
- Espaciado vertical: `space-y-2`/`space-y-3`.

---

### Accesibilidad (A11y)

- Contraste mínimo AA para texto: usar azules 600+ sobre fondos claros.
- Tamaños de toque: 44x44 px mínimo.
- Estados de foco visibles (outline o ring).
- No depender solo del color para comunicar estados.

---

### Tonos de comunicación (UX writing)

- Claridad y beneficio directo (ej: “Ir al Marketplace”, “Ver ejemplo”).
- Evitar jerga técnica innecesaria en CTAs.
- Voz: profesional, directa, confiable.

---

### Ejemplos recomendados

CTA principal en landing:

```tsx
<Link href="/tienda">
  <Button
    size="lg"
    className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 h-auto shadow-lg">
    Ir al Marketplace
  </Button>
</Link>
```

Bloque de estadísticas:

```html
<div
  class="bg-gradient-to-br from-blue-50 via-sky-50 to-slate-50 rounded-2xl p-8 border border-blue-100">
  <!-- números y etiquetas -->
</div>
```

Card de beneficios:

```html
<div
  class="border border-slate-200 bg-white rounded-lg shadow-lg hover:shadow-xl">
  <!-- contenido -->
</div>
```

---

### Do / Don’t

**Do**

- Usar `blue-600` para acciones principales y `blue-700` en hover
- Mantener jerarquía clara y espacios generosos
- Usar logos correctos según fondo (light/dark)

**Don’t**

- No aplicar gradientes en texto ni efectos decorativos al logo
- No usar azules demasiado saturados/oscuros fuera de 600–700 para CTAs
- No mezclar múltiples acentos en la misma vista
- No utilizar emojis.

---

### Versionado y contacto

- Esta guía se mantiene en `styles_guide.md` y se revisa con cada cambio visual relevante.
- Para propuestas de cambio, abrir PR con capturas y racional.
