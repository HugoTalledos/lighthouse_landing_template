# Landing Page Template

Template de landing page "marca blanca" hecho con Astro, TypeScript y Tailwind CSS. Solo maquetación y componentes de ejemplo — sin copy real de ningún negocio.

## Requisitos

- Node.js
- npm

## Uso

```bash
npm install
npm run dev      # servidor de desarrollo en http://localhost:4321
npm run build    # build de producción en dist/
npm run preview  # sirve el build de producción localmente
npm run check    # type-check con astro check
```

## Estructura

```
src/
  assets/          # SVGs y otros assets estáticos importados por componentes
  component/
    atoms/         # Button, Container, Heading, Input, Label, Text
    molecules/     # BenefitCard, FormField, Logo
    organisms/     # Hero, BenefitsSection, CaptureForm
  layouts/         # BaseLayout.astro
  pages/           # index.astro — compone Hero + BenefitsSection + CaptureForm
  styles/          # global.css — tokens de diseño y directivas de Tailwind
  utils/           # cn.ts — helper para combinar clases (clsx + tailwind-merge)
```

## Personalizar la marca

Los colores y tipografía viven como variables CSS en `src/styles/global.css`:

```css
:root {
  --color-primary: #4f46e5;
  --color-primary-foreground: #ffffff;
  --color-secondary: #0ea5e9;
  --color-bg: #ffffff;
  --color-bg-muted: #f3f4f6;
  --color-text: #111827;
  --color-text-muted: #6b7280;
  --font-sans: 'Inter', system-ui, sans-serif;
}
```

Cambiar estos valores actualiza los componentes en todo el sitio sin tocar markup, ya que los atoms/molecules/organisms referencian los tokens vía clases de Tailwind como `bg-[var(--color-primary)]`.

El copy de ejemplo (títulos, descripciones de beneficios, textos del formulario) está hardcodeado directamente en los organisms (`Hero.astro`, `BenefitsSection.astro`, `CaptureForm.astro`) — reemplázalo por el contenido real de cada proyecto.

## Formulario de captura

El formulario en `CaptureForm.astro` es solo UI: valida campos requeridos en el cliente y muestra un mensaje de éxito simulado. No envía datos a ningún backend — hay que conectarlo al servicio que corresponda en cada proyecto.
