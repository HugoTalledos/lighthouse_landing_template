# Landing Page Template

Template de landing page "marca blanca" hecho con Astro, TypeScript y Tailwind CSS. Solo maquetación y componentes de ejemplo — sin copy real de ningún negocio.

## Requisitos

- Node.js
- npm

## Uso

```bash
npm install
cp .env.example .env   # completa PUBLIC_API_URL, PUBLIC_API_KEY y PUBLIC_PLATFORM_NAME
npm run dev      # servidor de desarrollo en http://localhost:4321
npm run build    # build de producción en dist/
npm run preview  # sirve el build de producción localmente
npm run check    # type-check con astro check
```

## Variables de entorno

| Variable | Descripción |
| --- | --- |
| `PUBLIC_API_URL` | URL del servicio backend al que el formulario de captura envía los datos (`POST`). |
| `PUBLIC_API_KEY` | API key del servicio backend, enviada en el header `x-api-key`. |
| `PUBLIC_PLATFORM_NAME` | Identificador de la plataforma/proyecto que se envía en el payload (campo `platform`). |

**Importante:** al llevar el prefijo `PUBLIC_`, Astro expone estos valores en el bundle de JavaScript que se sirve al navegador — no son secretos ocultos. Cualquiera que inspeccione el sitio puede ver la API key. Esto es inherente a que el formulario es 100% client-side, sin backend propio intermedio.

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

El formulario en `CaptureForm.astro` valida nombre, correo y celular en el cliente (el celular debe tener 10 dígitos e iniciar en 3) y, si pasa la validación, envía los datos por `fetch` a `PUBLIC_API_URL`. Mientras espera la respuesta el botón muestra "Enviando...". Si el backend responde con éxito se muestra el mensaje de agradecimiento y se limpia el formulario; si falla (red o respuesta no exitosa) se muestra un mensaje de error y los datos ingresados se conservan para reintentar.
