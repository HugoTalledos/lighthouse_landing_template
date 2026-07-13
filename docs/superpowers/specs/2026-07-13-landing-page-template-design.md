# Landing Page Template (Astro) — Design Spec

Fecha: 2026-07-13

## Objetivo

Crear un template de landing page en Astro, "marca blanca" (sin temática ni
copy real de ningún cliente), pensado para reutilizarse como punto de partida
en futuros proyectos. Debe seguir Atomic Design en sus componentes y sólo
resolver maquetación/estructura — no lógica de negocio, no backend, no
contenido definitivo.

## Alcance

Incluido:
- Proyecto Astro nuevo con TypeScript y Tailwind CSS.
- Estructura de carpetas pedida por el usuario:
  `src/assets`, `src/component`, `src/layouts`, `src/pages`, `src/styles`,
  `src/utils`. (No se incluye `src/content` — se descartó explícitamente).
- Componentes organizados en Atomic Design dentro de `src/component`:
  `atoms/`, `molecules/`, `organisms/`.
- Una página (`index.astro`) que compone tres secciones: Hero, Beneficios,
  Formulario de captura.
- Texto de ejemplo/placeholder genérico en español (ej. "[Tu Marca]",
  "Título principal", "Beneficio 1"), sin copy definitivo de ningún dominio.
- Estilos con tokens de diseño neutros (variables CSS para color primario/
  secundario, tipografía) fácilmente sobreescribibles.

Excluido (fuera de alcance de este spec):
- Contenido/copy real o específico de un negocio.
- Content Collections (`src/content`) — descartado por el usuario.
- Backend o integración real del formulario (Formspree, API routes, etc.) —
  el formulario sólo tiene UI y validación de cliente (`preventDefault` +
  mensaje simulado de éxito).
- SEO avanzado, analítica, i18n, testing automatizado.

## Stack

- Astro (última versión estable) con TypeScript.
- Tailwind CSS para utilidades de estilo.
- npm como gestor de paquetes.
- Sin frameworks de UI adicionales (React/Vue/etc.) — todo en componentes
  `.astro`.

## Estructura de directorios

```
src/
  assets/            # imágenes/SVG placeholder (logo genérico, ilustración hero)
  component/
    atoms/
      Button.astro
      Heading.astro
      Text.astro
      Input.astro
      Label.astro
      Container.astro
    molecules/
      FormField.astro
      BenefitCard.astro
      Logo.astro
    organisms/
      Hero.astro
      BenefitsSection.astro
      CaptureForm.astro
  layouts/
    BaseLayout.astro
  pages/
    index.astro
  styles/
    global.css
  utils/
    cn.ts
```

## Componentes (Atomic Design)

### Atoms
- **Button.astro** — props `variant` (`primary` | `secondary`), `href?`,
  `type?`. Renderiza `<a>` si hay `href`, si no `<button>`.
- **Heading.astro** — props `as` (`h1`|`h2`|`h3`), `size`, `align?`.
- **Text.astro** — párrafo, props `size?`, `muted?`.
- **Input.astro** — props `type`, `name`, `placeholder?`, `required?`,
  estado de error vía clase condicional.
- **Label.astro** — props `for`, texto vía slot.
- **Container.astro** — wrapper con `max-width` y padding responsivo, slot
  por defecto.

### Molecules
- **FormField.astro** — combina `Label` + `Input` + slot opcional para
  mensaje de error. Props: `label`, `name`, `type`, `placeholder?`,
  `required?`.
- **BenefitCard.astro** — slot para ícono + props `title`, `description`.
- **Logo.astro** — placeholder de marca (texto `[Tu Marca]`), sin logo real.

### Organisms
- **Hero.astro** — usa `Logo`, `Heading`, `Text`, `Button`; incluye espacio
  para imagen/ilustración placeholder (puede ser un bloque con fondo gris o
  SVG genérico en `assets/`). Texto de ejemplo genérico.
- **BenefitsSection.astro** — `Heading` de sección + grid de 3
  `BenefitCard` con contenido de ejemplo hardcodeado directamente en el
  componente (no viene de datos externos).
- **CaptureForm.astro** — usa `FormField` (nombre, email) + `Button` tipo
  submit. Incluye un `<script>` inline que hace `preventDefault`, valida
  campos requeridos en cliente y muestra un mensaje de éxito simulado. No
  hay llamada a red ni endpoint.

## Layout y página

- **layouts/BaseLayout.astro** — `<html lang="es">`, `<head>` con meta tags
  genéricos (charset, viewport, título placeholder "Landing Page Template"),
  favicon placeholder, importa `styles/global.css`, expone `<slot />` en
  `<body>`.
- **pages/index.astro** — usa `BaseLayout` y renderiza, en orden: `Hero`,
  `BenefitsSection`, `CaptureForm`.

## Estilos

- `src/styles/global.css` con las directivas de Tailwind (`@tailwind base;
  @tailwind components; @tailwind utilities;`) más un bloque `:root` con
  variables CSS para tokens neutros:
  - `--color-primary`, `--color-primary-foreground`
  - `--color-secondary`
  - `--color-bg`, `--color-bg-muted`
  - `--color-text`, `--color-text-muted`
  - `--font-sans`
- Los componentes usan clases de Tailwind referenciando estas variables
  (vía `tailwind.config` extend o `var(--color-primary)` directo en clases
  arbitrarias) para que cambiar la paleta sea trivial.

## Utils

- **cn.ts** — helper para combinar clases condicionalmente (`clsx` +
  `tailwind-merge`), usado por los atoms/molecules que aceptan clases
  adicionales.

## Testing / verificación

No hay lógica de negocio ni backend que testear. La verificación es visual:
levantar `npm run dev` y confirmar que las tres secciones se ven y son
responsivas (mobile/desktop), que el formulario valida campos requeridos y
muestra el mensaje de éxito simulado al enviarse correctamente.

## Decisiones registradas durante brainstorming

- Se descartó `src/content` / Content Collections — fue un error al pedir
  los directorios iniciales.
- El formulario no se conecta a ningún backend ni servicio externo; sólo UI
  + validación de cliente.
- Todo el copy es texto de ejemplo genérico en español, sin temática de
  ningún negocio particular (requisito explícito de "marca blanca").
- Niveles de atomic design: atoms / molecules / organisms (sin templates
  separados; el layout + index.astro cumplen ese rol).
