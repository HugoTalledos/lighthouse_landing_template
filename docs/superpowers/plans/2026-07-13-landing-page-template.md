# Landing Page Template (Astro) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a white-label Astro landing page template with Hero, Beneficios, and Formulario de captura sections, using Atomic Design components, with no real business content.

**Architecture:** A single Astro page (`src/pages/index.astro`) wrapped in `BaseLayout`, composed from three organisms (`Hero`, `BenefitsSection`, `CaptureForm`). Organisms are built from molecules, molecules from atoms. Tailwind CSS drives styling, with brand colors expressed as CSS custom properties in `src/styles/global.css` so the palette can be swapped later without touching component markup. The capture form is client-side only: a plain `<script>` intercepts `submit`, validates required fields, and shows a simulated success message — no network calls.

**Tech Stack:** Astro (TypeScript, strict), Tailwind CSS (`@astrojs/tailwind`), `clsx` + `tailwind-merge` (via a `cn()` util), npm.

## Global Constraints

- Directories: `src/assets`, `src/component` (singular) with `atoms/`, `molecules/`, `organisms/`, `src/layouts`, `src/pages`, `src/styles`, `src/utils`. No `src/content`.
- Language: TypeScript, strict mode (`astro/tsconfigs/strict`).
- Styling: Tailwind CSS, no other CSS framework.
- Package manager: npm only.
- All visible copy is generic placeholder text in Spanish (e.g. "[Tu Marca]", "Título principal de tu producto o servicio") — no real business/domain content.
- Formulario de captura: UI + client-side validation only. No backend, no API route, no external service, no `fetch`/`XMLHttpRequest` calls anywhere.
- No content collections, no test framework (Vitest/Jest) is introduced. Verification is via `npm run build` + grepping build output, `astro check` for type errors, and a manual `npm run dev` smoke check.
- Every component (`atoms/molecules/organisms`) is a `.astro` file — no React/Vue/Svelte islands.

---

### Task 1: Scaffold Astro project + folder skeleton + minimal page

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/env.d.ts`
- Create: `public/favicon.svg`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/pages/index.astro`
- Create (empty dirs, via `.gitkeep`): `src/assets/.gitkeep`, `src/component/atoms/.gitkeep`, `src/component/molecules/.gitkeep`, `src/component/organisms/.gitkeep`, `src/utils/.gitkeep`

**Interfaces:**
- Produces: `BaseLayout.astro` accepting `Props = { title?: string }`, rendering `<slot />` in `<body>`. Later tasks import it as `import BaseLayout from '../layouts/BaseLayout.astro'` from `src/pages/index.astro`.

- [ ] **Step 1: Create the directory skeleton**

```bash
mkdir -p src/assets src/component/atoms src/component/molecules src/component/organisms src/layouts src/pages src/styles src/utils public
touch src/assets/.gitkeep src/component/atoms/.gitkeep src/component/molecules/.gitkeep src/component/organisms/.gitkeep src/utils/.gitkeep
```

- [ ] **Step 2: Initialize package.json and install dependencies**

```bash
npm init -y
npm install astro clsx tailwind-merge
npm install -D typescript @astrojs/check
```

- [ ] **Step 3: Edit package.json (type + scripts)**

Open `package.json` and set:

```json
{
  "name": "landing-page-template",
  "type": "module",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check"
  }
}
```

Keep the `dependencies`/`devDependencies` blocks that `npm install` already wrote; only add/replace the fields above.

- [ ] **Step 4: Create astro.config.mjs**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({});
```

- [ ] **Step 5: Create tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 6: Create src/env.d.ts**

```ts
/// <reference types="astro/client" />
```

- [ ] **Step 7: Create public/favicon.svg**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <circle cx="12" cy="12" r="9"/>
</svg>
```

- [ ] **Step 8: Create src/layouts/BaseLayout.astro**

```astro
---
interface Props {
  title?: string;
}

const { title = 'Landing Page Template' } = Astro.props;
---

<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 9: Create src/pages/index.astro (scratch content for this task only)**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout>
  <p>OK</p>
</BaseLayout>
```

- [ ] **Step 10: Build and verify**

```bash
npm run build
grep -F "OK" dist/index.html
```

Expected: build exits 0, `dist/index.html` is created, and the grep prints the matching line (containing `OK`).

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "Scaffold Astro project with folder skeleton and base layout"
```

---

### Task 2: Add Tailwind CSS + design tokens

**Files:**
- Modify: `package.json` (add `@astrojs/tailwind`, `tailwindcss`)
- Modify: `astro.config.mjs`
- Create: `tailwind.config.mjs`
- Create: `src/styles/global.css`
- Modify: `src/layouts/BaseLayout.astro` (import global.css)

**Interfaces:**
- Consumes: `BaseLayout.astro` from Task 1 (`Props = { title?: string }`).
- Produces: CSS custom properties available globally: `--color-primary`, `--color-primary-foreground`, `--color-secondary`, `--color-bg`, `--color-bg-muted`, `--color-text`, `--color-text-muted`, `--font-sans`. Later atoms reference these via Tailwind arbitrary-value classes, e.g. `bg-[var(--color-primary)]`.

- [ ] **Step 1: Install Tailwind and the Astro integration**

```bash
npm install @astrojs/tailwind tailwindcss
```

- [ ] **Step 2: Update astro.config.mjs to register the integration**

```js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
});
```

- [ ] **Step 3: Create tailwind.config.mjs**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

- [ ] **Step 4: Create src/styles/global.css with design tokens**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

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

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
}
```

- [ ] **Step 5: Import global.css in BaseLayout**

Edit `src/layouts/BaseLayout.astro`, adding the import as the first line of the frontmatter:

```astro
---
import '../styles/global.css';

interface Props {
  title?: string;
}

const { title = 'Landing Page Template' } = Astro.props;
---
```

- [ ] **Step 6: Add a Tailwind utility class to the scratch page to prove wiring**

Edit `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout>
  <p class="text-4xl">OK</p>
</BaseLayout>
```

- [ ] **Step 7: Build and verify Tailwind actually processed the class**

```bash
npm run build
grep -F "text-4xl" dist/index.html
grep -rlF "text-4xl" dist/_astro/*.css
```

Expected: both greps find a match — the first proves the class made it into the HTML, the second proves Tailwind generated a corresponding CSS rule (i.e., Tailwind is wired in, not just passing an unrecognized class through).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Add Tailwind CSS integration and design token CSS variables"
```

---

### Task 3: Utils (cn helper) + Atoms

**Files:**
- Create: `src/utils/cn.ts`
- Create: `src/component/atoms/Container.astro`
- Create: `src/component/atoms/Label.astro`
- Create: `src/component/atoms/Input.astro`
- Create: `src/component/atoms/Text.astro`
- Create: `src/component/atoms/Heading.astro`
- Create: `src/component/atoms/Button.astro`
- Modify: `src/pages/index.astro` (scratch rendering of all atoms, replaced in Task 6)

**Interfaces:**
- Produces: `cn(...inputs: ClassValue[]): string` from `src/utils/cn.ts`.
- Produces: `Container` (`Props = { class?: string }`), `Label` (`Props = { for: string; class?: string }`), `Input` (`Props = { type?: 'text' | 'email'; name: string; id?: string; placeholder?: string; required?: boolean; class?: string }`), `Text` (`Props = { size?: 'lg' | 'md' | 'sm'; muted?: boolean; class?: string }`), `Heading` (`Props = { as?: 'h1' | 'h2' | 'h3'; size?: 'lg' | 'md' | 'sm'; align?: 'left' | 'center'; class?: string }`), `Button` (`Props = { variant?: 'primary' | 'secondary'; href?: string; type?: 'button' | 'submit' | 'reset'; class?: string }`). All render `<slot />` for their content. These exact prop shapes are relied on by molecules/organisms in Tasks 4–5.

- [ ] **Step 1: Add scratch atom usage to index.astro first (should fail to build — atoms don't exist yet)**

Edit `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Container from '../component/atoms/Container.astro';
import Heading from '../component/atoms/Heading.astro';
import Text from '../component/atoms/Text.astro';
import Label from '../component/atoms/Label.astro';
import Input from '../component/atoms/Input.astro';
import Button from '../component/atoms/Button.astro';
---

<BaseLayout>
  <Container>
    <Heading as="h1" size="lg">Encabezado de prueba</Heading>
    <Text muted>Texto de prueba</Text>
    <Label for="test-input">Etiqueta de prueba</Label>
    <Input name="test-input" placeholder="Campo de prueba" />
    <Button variant="primary">Botón de prueba</Button>
  </Container>
</BaseLayout>
```

- [ ] **Step 2: Run build and confirm it fails**

```bash
npm run build
```

Expected: build fails with a "Could not resolve" / "does not exist" error for one of the atom import paths.

- [ ] **Step 3: Create src/utils/cn.ts**

```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 4: Create src/component/atoms/Container.astro**

```astro
---
interface Props {
  class?: string;
}

const { class: className } = Astro.props;
---

<div class={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className ?? ''}`}>
  <slot />
</div>
```

- [ ] **Step 5: Create src/component/atoms/Label.astro**

```astro
---
interface Props {
  for: string;
  class?: string;
}

const { for: htmlFor, class: className } = Astro.props;
---

<label for={htmlFor} class={`mb-1 block text-sm font-medium ${className ?? ''}`}>
  <slot />
</label>
```

- [ ] **Step 6: Create src/component/atoms/Input.astro**

```astro
---
interface Props {
  type?: 'text' | 'email';
  name: string;
  id?: string;
  placeholder?: string;
  required?: boolean;
  class?: string;
}

const {
  type = 'text',
  name,
  id = name,
  placeholder,
  required = false,
  class: className,
} = Astro.props;
---

<input
  type={type}
  name={name}
  id={id}
  placeholder={placeholder}
  required={required}
  class={`w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] ${className ?? ''}`}
/>
```

- [ ] **Step 7: Create src/component/atoms/Text.astro**

```astro
---
interface Props {
  size?: 'lg' | 'md' | 'sm';
  muted?: boolean;
  class?: string;
}

const { size = 'md', muted = false, class: className } = Astro.props;

const sizes = {
  lg: 'text-lg',
  md: 'text-base',
  sm: 'text-sm',
};
---

<p class={`${sizes[size]} ${muted ? 'text-[var(--color-text-muted)]' : ''} ${className ?? ''}`}>
  <slot />
</p>
```

- [ ] **Step 8: Create src/component/atoms/Heading.astro**

```astro
---
interface Props {
  as?: 'h1' | 'h2' | 'h3';
  size?: 'lg' | 'md' | 'sm';
  align?: 'left' | 'center';
  class?: string;
}

const { as: Tag = 'h2', size = 'md', align = 'left', class: className } = Astro.props;

const sizes = {
  lg: 'text-4xl md:text-5xl font-bold',
  md: 'text-2xl md:text-3xl font-bold',
  sm: 'text-xl font-semibold',
};

const aligns = {
  left: 'text-left',
  center: 'text-center',
};
---

<Tag class={`${sizes[size]} ${aligns[align]} ${className ?? ''}`}>
  <slot />
</Tag>
```

- [ ] **Step 9: Create src/component/atoms/Button.astro**

```astro
---
import { cn } from '../../utils/cn';

interface Props {
  variant?: 'primary' | 'secondary';
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  class?: string;
}

const { variant = 'primary', href, type = 'button', class: className } = Astro.props;

const base =
  'inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-medium transition-colors';
const variants = {
  primary: 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:opacity-90',
  secondary: 'bg-[var(--color-bg-muted)] text-[var(--color-text)] hover:opacity-90',
};

const classes = cn(base, variants[variant], className);
---

{
  href ? (
    <a href={href} class={classes}>
      <slot />
    </a>
  ) : (
    <button type={type} class={classes}>
      <slot />
    </button>
  )
}
```

- [ ] **Step 10: Build and verify all atoms render**

```bash
npm run build
grep -F "Encabezado de prueba" dist/index.html
grep -F "Botón de prueba" dist/index.html
grep -F "bg-[var(--color-primary)]" dist/index.html
```

Expected: build exits 0, all three greps find a match.

- [ ] **Step 11: Type-check**

```bash
npx astro check
```

Expected: output ends with `0 errors`.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "Add cn() util and atom components (Container, Label, Input, Text, Heading, Button)"
```

---

### Task 4: Molecules (Logo, BenefitCard, FormField)

**Files:**
- Create: `src/assets/icon-placeholder.svg`
- Create: `src/component/molecules/Logo.astro`
- Create: `src/component/molecules/BenefitCard.astro`
- Create: `src/component/molecules/FormField.astro`
- Modify: `src/pages/index.astro` (extend scratch rendering, replaced in Task 6)

**Interfaces:**
- Consumes: `Heading`, `Text`, `Label`, `Input` atoms from Task 3 (exact prop shapes as defined there).
- Produces: `Logo` (`Props = { class?: string }`, no slot, renders literal text `[Tu Marca]`). `BenefitCard` (`Props = { title: string; description: string; class?: string }`, named slot `icon`). `FormField` (`Props = { label: string; name: string; type?: 'text' | 'email'; placeholder?: string; required?: boolean }`, renders a `<span data-error-for={name}>` for validation messages). Organisms in Task 5 rely on these exact prop names and the `icon` slot name and `data-error-for` attribute.

- [ ] **Step 1: Add scratch molecule usage to index.astro first (should fail to build)**

Edit `src/pages/index.astro`, adding these imports and markup below the existing atom scratch block (keep the atom block from Task 3 as-is):

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Container from '../component/atoms/Container.astro';
import Heading from '../component/atoms/Heading.astro';
import Text from '../component/atoms/Text.astro';
import Label from '../component/atoms/Label.astro';
import Input from '../component/atoms/Input.astro';
import Button from '../component/atoms/Button.astro';
import Logo from '../component/molecules/Logo.astro';
import BenefitCard from '../component/molecules/BenefitCard.astro';
import FormField from '../component/molecules/FormField.astro';
---

<BaseLayout>
  <Container>
    <Heading as="h1" size="lg">Encabezado de prueba</Heading>
    <Text muted>Texto de prueba</Text>
    <Label for="test-input">Etiqueta de prueba</Label>
    <Input name="test-input" placeholder="Campo de prueba" />
    <Button variant="primary">Botón de prueba</Button>
    <Logo />
    <BenefitCard title="Beneficio de prueba" description="Descripción de prueba">
      <span slot="icon">*</span>
    </BenefitCard>
    <FormField label="Campo de prueba" name="campo-prueba" />
  </Container>
</BaseLayout>
```

- [ ] **Step 2: Run build and confirm it fails**

```bash
npm run build
```

Expected: build fails with a resolve error for one of the new molecule import paths.

- [ ] **Step 3: Create src/assets/icon-placeholder.svg**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M20 6 9 17l-5-5"/>
</svg>
```

- [ ] **Step 4: Create src/component/molecules/Logo.astro**

```astro
---
interface Props {
  class?: string;
}

const { class: className } = Astro.props;
---

<span class={`text-lg font-bold tracking-tight ${className ?? ''}`}>[Tu Marca]</span>
```

- [ ] **Step 5: Create src/component/molecules/BenefitCard.astro**

```astro
---
import Heading from '../atoms/Heading.astro';
import Text from '../atoms/Text.astro';

interface Props {
  title: string;
  description: string;
  class?: string;
}

const { title, description, class: className } = Astro.props;
---

<div class={`flex flex-col items-start gap-3 rounded-lg bg-[var(--color-bg-muted)] p-6 ${className ?? ''}`}>
  <div class="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--color-primary-foreground)]">
    <slot name="icon" />
  </div>
  <Heading as="h3" size="sm">{title}</Heading>
  <Text muted>{description}</Text>
</div>
```

- [ ] **Step 6: Create src/component/molecules/FormField.astro**

```astro
---
import Label from '../atoms/Label.astro';
import Input from '../atoms/Input.astro';

interface Props {
  label: string;
  name: string;
  type?: 'text' | 'email';
  placeholder?: string;
  required?: boolean;
}

const { label, name, type = 'text', placeholder, required = false } = Astro.props;
---

<div class="flex flex-col gap-1">
  <Label for={name}>{label}</Label>
  <Input type={type} name={name} placeholder={placeholder} required={required} />
  <span class="hidden text-sm text-red-600" data-error-for={name}></span>
</div>
```

- [ ] **Step 7: Build and verify**

```bash
npm run build
grep -F "[Tu Marca]" dist/index.html
grep -F "Beneficio de prueba" dist/index.html
grep -F "data-error-for=\"campo-prueba\"" dist/index.html
```

Expected: build exits 0, all three greps find a match.

- [ ] **Step 8: Type-check**

```bash
npx astro check
```

Expected: output ends with `0 errors`.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "Add molecule components (Logo, BenefitCard, FormField)"
```

---

### Task 5: Organisms (Hero, BenefitsSection, CaptureForm)

**Files:**
- Create: `src/component/organisms/Hero.astro`
- Create: `src/component/organisms/BenefitsSection.astro`
- Create: `src/component/organisms/CaptureForm.astro`
- Modify: `src/pages/index.astro` (extend scratch rendering, replaced in Task 6)

**Interfaces:**
- Consumes: `Container`, `Heading`, `Text`, `Button` atoms (Task 3); `Logo`, `BenefitCard`, `FormField` molecules (Task 4); `src/assets/icon-placeholder.svg` (Task 4).
- Produces: `Hero` (no props, self-contained), `BenefitsSection` (no props, `id="beneficios"`), `CaptureForm` (no props, `id="formulario-captura"`, form `id="capture-form"`, success message `id="capture-form-success"`). Task 6's `index.astro` renders all three with no props.

- [ ] **Step 1: Add scratch organism usage to index.astro first (should fail to build)**

Replace the body of `src/pages/index.astro` with:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../component/organisms/Hero.astro';
import BenefitsSection from '../component/organisms/BenefitsSection.astro';
import CaptureForm from '../component/organisms/CaptureForm.astro';
---

<BaseLayout>
  <Hero />
  <BenefitsSection />
  <CaptureForm />
</BaseLayout>
```

- [ ] **Step 2: Run build and confirm it fails**

```bash
npm run build
```

Expected: build fails with a resolve error for one of the organism import paths.

- [ ] **Step 3: Create src/component/organisms/Hero.astro**

```astro
---
import Container from '../atoms/Container.astro';
import Heading from '../atoms/Heading.astro';
import Text from '../atoms/Text.astro';
import Button from '../atoms/Button.astro';
import Logo from '../molecules/Logo.astro';
---

<header class="border-b border-gray-200">
  <Container class="flex items-center justify-between py-6">
    <Logo />
  </Container>
</header>

<section class="py-16 md:py-24">
  <Container class="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
    <div class="flex flex-col gap-6">
      <Heading as="h1" size="lg">Título principal de tu producto o servicio</Heading>
      <Text size="lg" muted>
        Subtítulo de apoyo que explica en una frase el valor de lo que ofreces.
      </Text>
      <div>
        <Button variant="primary" href="#formulario-captura">Comenzar ahora</Button>
      </div>
    </div>
    <div class="flex h-64 w-full items-center justify-center rounded-lg bg-[var(--color-bg-muted)] md:h-96">
      <Text muted>[Espacio para imagen o ilustración]</Text>
    </div>
  </Container>
</section>
```

- [ ] **Step 4: Create src/component/organisms/BenefitsSection.astro**

```astro
---
import Container from '../atoms/Container.astro';
import Heading from '../atoms/Heading.astro';
import BenefitCard from '../molecules/BenefitCard.astro';
import checkIcon from '../../assets/icon-placeholder.svg?raw';

const benefits = [
  { title: 'Beneficio uno', description: 'Descripción breve del primer beneficio ofrecido.' },
  { title: 'Beneficio dos', description: 'Descripción breve del segundo beneficio ofrecido.' },
  { title: 'Beneficio tres', description: 'Descripción breve del tercer beneficio ofrecido.' },
];
---

<section class="py-16 md:py-24" id="beneficios">
  <Container class="flex flex-col gap-10">
    <Heading as="h2" size="md" align="center">Beneficios</Heading>
    <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
      {benefits.map((benefit) => (
        <BenefitCard title={benefit.title} description={benefit.description}>
          <Fragment slot="icon" set:html={checkIcon} />
        </BenefitCard>
      ))}
    </div>
  </Container>
</section>
```

- [ ] **Step 5: Create src/component/organisms/CaptureForm.astro**

```astro
---
import Container from '../atoms/Container.astro';
import Heading from '../atoms/Heading.astro';
import Text from '../atoms/Text.astro';
import Button from '../atoms/Button.astro';
import FormField from '../molecules/FormField.astro';
---

<section class="py-16 md:py-24" id="formulario-captura">
  <Container class="mx-auto flex max-w-xl flex-col gap-6">
    <div class="flex flex-col gap-2 text-center">
      <Heading as="h2" size="md" align="center">Déjanos tus datos</Heading>
      <Text muted>Te contactaremos con más información.</Text>
    </div>
    <form id="capture-form" class="flex flex-col gap-4" novalidate>
      <FormField label="Nombre" name="nombre" placeholder="Tu nombre" required />
      <FormField label="Correo electrónico" name="email" type="email" placeholder="tu@correo.com" required />
      <Button type="submit" variant="primary">Enviar</Button>
      <p id="capture-form-success" class="hidden text-center text-sm text-green-600">
        ¡Gracias! Hemos recibido tu información.
      </p>
    </form>
  </Container>
</section>

<script>
  const form = document.querySelector('#capture-form');
  const successMessage = document.querySelector('#capture-form-success');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach((field) => {
      const errorEl = form.querySelector(`[data-error-for="${field.name}"]`);
      if (!field.value.trim()) {
        isValid = false;
        if (errorEl) {
          errorEl.classList.remove('hidden');
          errorEl.textContent = 'Este campo es obligatorio.';
        }
      } else if (errorEl) {
        errorEl.classList.add('hidden');
      }
    });

    if (isValid) {
      successMessage.classList.remove('hidden');
      form.reset();
    }
  });
</script>
```

- [ ] **Step 6: Build and verify**

```bash
npm run build
grep -F "Título principal de tu producto o servicio" dist/index.html
grep -F "Beneficio uno" dist/index.html
grep -F "Déjanos tus datos" dist/index.html
grep -F "capture-form" dist/index.html
```

Expected: build exits 0, all four greps find a match.

- [ ] **Step 7: Type-check**

```bash
npx astro check
```

Expected: output ends with `0 errors`.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Add organism components (Hero, BenefitsSection, CaptureForm)"
```

---

### Task 6: Final page assembly and end-to-end smoke check

**Files:**
- Modify: `src/pages/index.astro` (confirm final composition — no scratch code remains; this task mainly verifies, since Task 5 already left `index.astro` in its final form)
- Modify: `src/layouts/BaseLayout.astro` (pass a real page title)

**Interfaces:**
- Consumes: `Hero`, `BenefitsSection`, `CaptureForm` organisms (Task 5), `BaseLayout` (Task 2).

- [ ] **Step 1: Confirm index.astro is the final composition**

Open `src/pages/index.astro` and confirm it matches exactly (no leftover atom/molecule scratch markup from Tasks 3–4 — Task 5 Step 1 already replaced the body, so this is a read-only check):

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../component/organisms/Hero.astro';
import BenefitsSection from '../component/organisms/BenefitsSection.astro';
import CaptureForm from '../component/organisms/CaptureForm.astro';
---

<BaseLayout title="Landing Page Template">
  <Hero />
  <BenefitsSection />
  <CaptureForm />
</BaseLayout>
```

If the `<BaseLayout>` line doesn't pass `title="Landing Page Template"`, edit it to add that prop.

- [ ] **Step 2: Full build**

```bash
npm run build
```

Expected: exits 0, `dist/index.html` generated.

- [ ] **Step 3: Type-check**

```bash
npx astro check
```

Expected: output ends with `0 errors`.

- [ ] **Step 4: Dev-server smoke check**

```bash
npm run dev &
DEV_PID=$!
sleep 2
curl -s http://localhost:4321/ | grep -F "Beneficios"
curl -s http://localhost:4321/ | grep -F "capture-form"
kill $DEV_PID
```

Expected: both `curl | grep` calls print a matching line, confirming the dev server serves the composed page with all three sections.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Finalize landing page composition with real page title"
```

If Step 1 required no edit (title was already correct), skip this commit — there's nothing to commit.

---

## Manual Follow-Up (not automatable, do after the plan)

Per the spec's Testing/Verification section, open `npm run dev` in a browser and confirm visually:
- The three sections render correctly and responsively (mobile + desktop widths).
- Submitting the capture form with empty fields shows the "Este campo es obligatorio." error under each empty field.
- Submitting with both fields filled shows the "¡Gracias! Hemos recibido tu información." success message and clears the form.
