# Components

## BaseLayout (`src/layouts/BaseLayout.astro`)

Acepta una prop opcional `theme` para sobreescribir, por instancia de página, los tokens de color y tipografía definidos en `:root` en `src/styles/global.css`. Cada campo es opcional: si se omite, se usa el valor definido en `global.css`.

```ts
interface Theme {
  primaryColor?: string;          // --color-primary
  primaryForegroundColor?: string; // --color-primary-foreground
  secondaryColor?: string;         // --color-secondary
  bgColor?: string;                // --color-bg
  bgMutedColor?: string;           // --color-bg-muted
  textColor?: string;              // --color-text
  textMutedColor?: string;         // --color-text-muted
  fontFamily?: string;             // --font-sans
}

interface Props {
  title?: string;
  theme?: Theme;
}
```

Uso:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout
  title="Mi Landing"
  theme={{
    primaryColor: '#e11d48',
    bgColor: '#0f172a',
    textColor: '#f8fafc',
    fontFamily: 'Poppins',
  }}
>
  <slot />
</BaseLayout>
```

Internamente, `BaseLayout` inyecta un bloque `<style>` en `<head>` que redefine solo las variables CSS presentes en `theme`, sobreescribiendo los defaults de `global.css` sin tocar markup ni las clases Tailwind (`bg-[var(--color-primary)]`, etc.) que ya referencian estos tokens.
