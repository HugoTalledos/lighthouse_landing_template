# Component Reference

Catalog of every component in `src/component/`, organized by Atomic Design tier
(atoms → molecules → organisms). For each: what it is, **when to use it**, its
props, and a usage example. Read `.agent/CONTEXT.md` first for the
project-wide architecture rules (dependency direction, design tokens, class
merging) — this file only covers per-component usage.

Import paths below are relative to a file in `src/component/organisms/` or
`src/pages/`; adjust `../` depth if importing from elsewhere.

---

## Atoms

Atoms are the only tier allowed to hold raw Tailwind classes tied to design
tokens. Don't hardcode colors in molecules/organisms — reach for an atom, or
add a new atom, instead.

### Button

`atoms/Button.astro`

**Use when** you need a clickable call-to-action — either a real link
(navigates / scrolls to an anchor) or a form-submitting button. Don't use a
bare `<a>` or `<button>` in molecules/organisms; always go through this atom
so CTA styling stays centralized.

Renders as `<a>` when `href` is passed, otherwise as `<button>`.

| Prop      | Type                        | Default     | Notes |
|-----------|-----------------------------|-------------|-------|
| `variant` | `'primary' \| 'secondary'`  | `'primary'` | `primary` = filled brand color, `secondary` = muted background |
| `href`    | `string`                    | —           | If set, renders `<a href>` instead of `<button>` |
| `type`    | `'button' \| 'submit' \| 'reset'` | `'button'` | Only relevant when `href` is unset |
| `class`   | `string`                    | —           | Merged via `cn()` (real override, not append) |

```astro
<Button variant="primary" href="#formulario-captura">Comenzar ahora</Button>
<Button type="submit" variant="primary">Enviar</Button>
```

### Container

`atoms/Container.astro`

**Use when** wrapping any section's content to get the page's consistent max
width and horizontal padding (`max-w-6xl`, responsive `px-4 sm:px-6 lg:px-8`).
Every top-level `<section>` in an organism should wrap its content in a
`Container` — don't reimplement max-width/padding by hand.

| Prop    | Type     | Default | Notes |
|---------|----------|---------|-------|
| `class` | `string` | —       | Appended via template literal, not merged — can't override `max-w-6xl`/padding, only add to it |

```astro
<Container class="flex items-center justify-between py-6">
  <Logo />
</Container>
```

### Heading

`atoms/Heading.astro`

**Use when** rendering any heading-level text (`h1`/`h2`/`h3`). Don't write
raw `<h1>`/`<h2>`/`<h3>` tags in molecules/organisms — this atom keeps size
scale and alignment consistent across the page.

| Prop    | Type                        | Default  | Notes |
|---------|-----------------------------|----------|-------|
| `as`    | `'h1' \| 'h2' \| 'h3'`      | `'h2'`   | Controls the actual rendered tag |
| `size`  | `'lg' \| 'md' \| 'sm'`      | `'md'`   | `lg` = hero title, `md` = section title, `sm` = card title |
| `align` | `'left' \| 'center'`        | `'left'` | |
| `class` | `string`                    | —        | Appended, not merged |

```astro
<Heading as="h1" size="lg">Título principal de tu producto o servicio</Heading>
<Heading as="h2" size="md" align="center">Beneficios</Heading>
```

### Text

`atoms/Text.astro`

**Use when** rendering any paragraph copy (body text, subtitles, helper
text). Don't use raw `<p>` in molecules/organisms.

| Prop    | Type                   | Default | Notes |
|---------|------------------------|---------|-------|
| `size`  | `'lg' \| 'md' \| 'sm'` | `'md'`  | |
| `muted` | `boolean`              | `false` | Applies `--color-text-muted` for secondary/supporting copy |
| `class` | `string`               | —       | Appended, not merged |

```astro
<Text size="lg" muted>Subtítulo de apoyo que explica en una frase el valor de lo que ofreces.</Text>
```

### Input

`atoms/Input.astro`

**Use when** you need a styled `<input>` — but prefer the `FormField`
molecule (Label + Input + error slot together) for anything inside a form.
Reach for `Input` directly only if you explicitly don't want an attached
`<label>`.

| Prop          | Type                          | Default        | Notes |
|---------------|-------------------------------|----------------|-------|
| `type`        | `'text' \| 'email' \| 'tel'`  | `'text'`       | |
| `name`        | `string`                      | — (required)   | |
| `id`          | `string`                      | same as `name` | |
| `placeholder` | `string`                      | —              | |
| `required`    | `boolean`                     | `false`        | |
| `class`       | `string`                      | —              | Appended, not merged |

### Label

`atoms/Label.astro`

**Use when** labeling a form field — again, prefer `FormField` unless you
need a label without the paired input/error-span markup.

| Prop    | Type     | Default      | Notes |
|---------|----------|--------------|-------|
| `for`   | `string` | — (required) | Should match the paired input's `name`/`id` |
| `class` | `string` | —            | Appended, not merged |

---

## Molecules

Molecules combine 2+ atoms into a reusable unit. They don't import other
molecules or organisms, and don't touch design-token classes directly beyond
what their child atoms already provide.

### FormField

`molecules/FormField.astro`

**Use when** adding any field to a form — this is the standard way to add
input fields to `CaptureForm` or any future form organism. It bundles
`Label` + `Input` + a hidden `<span data-error-for={name}>` that
`CaptureForm.client.ts`'s generic `[required]` validation loop looks for to
show inline errors. Don't assemble `Label`/`Input` by hand inside a form —
you'll lose the error-span wiring.

| Prop          | Type                          | Default      | Notes |
|---------------|-------------------------------|--------------|-------|
| `label`       | `string`                      | — (required) | Visible label text |
| `name`        | `string`                      | — (required) | Used for `input[name]`, `label[for]`, and `data-error-for` |
| `type`        | `'text' \| 'email' \| 'tel'`  | `'text'`     | |
| `placeholder` | `string`                      | —            | |
| `required`    | `boolean`                     | `false`      | Marks the field for the client-side validation loop |

```astro
<FormField label="Correo electrónico" name="email" type="email" placeholder="tu@correo.com" required />
```

### BenefitCard

`molecules/BenefitCard.astro`

**Use when** rendering one item in a benefits/features grid — icon + title +
description card. This is what `BenefitsSection` maps over; use it for any
similar icon-title-description grid (e.g. a future "features" or "how it
works" section), not just literally "beneficios".

| Prop          | Type     | Default      | Notes |
|---------------|----------|--------------|-------|
| `title`       | `string` | — (required) | Rendered via `Heading as="h3" size="sm"` |
| `description` | `string` | — (required) | Rendered via `Text muted` |
| `class`       | `string` | —            | Appended, not merged |

Named slot `icon` — pass an inline SVG (see `BenefitsSection.astro`'s
`set:html={checkIcon}` pattern for importing an SVG with `?raw` and injecting
it).

```astro
<BenefitCard title={benefit.title} description={benefit.description}>
  <Fragment slot="icon" set:html={checkIcon} />
</BenefitCard>
```

### Logo

`molecules/Logo.astro`

**Use when** rendering the brand mark in the header (or anywhere else the
brand name needs to appear as text). Currently just styled placeholder text
(`[Tu Marca]`) — for a real client project this is the file to swap for an
`<img>`/inline SVG logo. Don't hardcode the brand name elsewhere; route
through this component so re-skinning only touches one file.

| Prop    | Type     | Default | Notes |
|---------|----------|---------|-------|
| `class` | `string` | —       | Appended, not merged |

---

## Organisms

Organisms compose atoms + molecules into a full page section. `src/pages/index.astro`
composes these three, in order, to build the whole landing page. Don't add a
fourth top-level section without confirming with the user first — the
template is deliberately scoped to Hero → Beneficios → Formulario.

### Hero

`organisms/Hero.astro`

**Use when** you need the page's top section: header bar (logo) + hero
banner (headline, subtitle, primary CTA button, image placeholder). All
copy and layout come from required props — there are no defaults, so every
usage must pass them explicitly. The CTA button always links to
`#formulario-captura`, which must match `CaptureForm`'s section `id` — that
anchor is not configurable via props, to avoid an agent breaking the link
by accident.

| Prop           | Type                   | Default      | Notes |
|----------------|------------------------|--------------|-------|
| `title`        | `string`               | — (required) | Rendered via `Heading as="h1" size="lg"` |
| `subtitle`     | `string`               | — (required) | Rendered via `Text size="lg" muted` |
| `ctaLabel`     | `string`               | — (required) | CTA button text; href is fixed to `#formulario-captura` |
| `align`        | `'left' \| 'center'`   | — (required) | Alignment of title/subtitle/button within the text column |
| `textPosition` | `'left' \| 'right'`    | — (required) | Which side the text column renders on at `md:`; the image placeholder takes the other side. Text stays first in DOM order regardless. |

```astro
<Hero
  title="Título principal de tu producto o servicio"
  subtitle="Subtítulo de apoyo que explica en una frase el valor de lo que ofreces."
  ctaLabel="Comenzar ahora"
  align="left"
  textPosition="left"
/>
```

### BenefitsSection

`organisms/BenefitsSection.astro`

**Use when** you need the 3-column benefits/features grid. No props — the
`benefits` array (title/description per card) is defined inline in the
component; edit that array to change copy/count. Renders with
`id="beneficios"` for anchor-linking. Uses `BenefitCard` under the hood, so
follow that molecule's icon-slot convention if you add more cards.

```astro
<BenefitsSection />
```

### CaptureForm

`organisms/CaptureForm.astro` (+ `CaptureForm.client.ts`)

**Use when** you need the lead-capture form section: nombre / email / celular
fields + submit button + success/error messages. No props — fields are
hardcoded in the markup via `FormField`. Renders with
`id="formulario-captura"` (must match `Hero`'s CTA anchor).

To add a new field: add a `FormField` with `required` if it should be
validated, and if it needs custom validation beyond "non-empty", add a
field-specific branch in `CaptureForm.client.ts` next to the existing
`celular` regex check (see `.agent/CONTEXT.md`'s "CaptureForm" section for
the full validation/submit contract — request shape, headers, env vars).
Don't inline new client logic into `CaptureForm.astro`'s `<script>` tag; add
it to `CaptureForm.client.ts`.

```astro
<CaptureForm />
```

---

## Composition example (page-level)

This is the entire composition surface of the template — `src/pages/index.astro`:

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

If asked to build a new page or a variant, compose from these three
organisms first before reaching for atoms/molecules directly — that's the
level this template is designed to be assembled at.
