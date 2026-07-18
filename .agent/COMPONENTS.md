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

| Prop          | Type                  | Default      | Notes |
|---------------|-----------------------|--------------|-------|
| `title`       | `string`              | — (required) | Rendered via `Heading as="h3" size="sm"` |
| `description` | `string`              | — (required) | Rendered via `Text muted` |
| `align`       | `'left' \| 'center'`  | — (required) | Controls card content alignment; passed through to the internal `Heading` |
| `class`       | `string`              | —            | Appended, not merged |

Named slot `icon` — pass an inline SVG (see `BenefitsSection.astro`'s
`set:html={checkIcon}` pattern for importing an SVG with `?raw` and injecting
it).

```astro
<BenefitCard title={benefit.title} description={benefit.description} align="left">
  <Fragment slot="icon" set:html={checkIcon} />
</BenefitCard>
```

### Logo

`molecules/Logo.astro`

**Use when** rendering the brand mark in the header (or anywhere else the
brand name needs to appear). Renders brand text plus an optional inline SVG
icon read via a named slot. Don't hardcode the brand name elsewhere; route
through this component so re-skinning only touches one file.

| Prop    | Type     | Default        | Notes |
|---------|----------|----------------|-------|
| `text`  | `string` | `'[Tu Marca]'` | Brand name/wordmark |
| `class` | `string` | —              | Appended, not merged |

Named slot `icon` — pass an inline SVG, same convention as `BenefitCard`
(see that entry above for the `set:html`/`?raw` pattern). The icon wrapper
only renders when the slot actually produces content — the component checks
via `await Astro.slots.render('icon')`, not `Astro.slots.has()`, because
`.has()` returns `true` for a statically-present `<Fragment slot="icon">`
even when the caller's own conditional around it evaluates to falsy at
runtime. If you add a new component with an optional icon slot, use the same
`Astro.slots.render()` check rather than `.has()`.

```astro
<Logo text="Acme Inc." class="text-[var(--color-primary)]">
  <Fragment slot="icon" set:html={acmeIcon} />
</Logo>

<Logo text="Acme Inc." />
```

---

## Organisms

Organisms compose atoms + molecules into a full page section. `src/pages/index.astro`
composes these three, in order, to build the whole landing page. Don't add a
fourth top-level section without confirming with the user first — the
template is deliberately scoped to Hero → Beneficios → Formulario.

### Hero

`organisms/Hero.astro`

**Use when** you need the page's top section: header bar (logo) + hero
banner (headline, subtitle, primary CTA button, image placeholder). Copy,
layout, and CTA props are required — there are no defaults, so every usage
must pass them explicitly. `logoText`/`logoIcon` are optional and forwarded
straight through to `Logo`; omit them to fall back to `Logo`'s own default
(`'[Tu Marca]'`, no icon). The CTA button always links to
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
| `logoText`     | `string`               | —            | Forwarded to `Logo`'s `text` prop |
| `logoIcon`     | `string`               | —            | Raw SVG string forwarded to `Logo`'s `icon` slot via `set:html` |

```astro
<Hero
  title="Título principal de tu producto o servicio"
  subtitle="Subtítulo de apoyo que explica en una frase el valor de lo que ofreces."
  ctaLabel="Comenzar ahora"
  align="left"
  textPosition="left"
  logoText="Acme Inc."
  logoIcon={acmeIcon}
/>
```

### BenefitsSection

`organisms/BenefitsSection.astro`

**Use when** you need the benefits/features grid (`md:grid-cols-3`, wraps
for other counts). All copy, alignment, and the card list come from
required props — there are no defaults. Renders with `id="beneficios"` for
anchor-linking. Uses `BenefitCard` under the hood, so follow that
molecule's icon-slot convention if you customize per-item icons.

| Prop           | Type                  | Default      | Notes |
|----------------|-----------------------|--------------|-------|
| `heading`      | `string`              | — (required) | Rendered via `Heading as="h2" size="md"` |
| `headingAlign` | `'left' \| 'center'`  | — (required) | Passed to the section `Heading` |
| `cardAlign`    | `'left' \| 'center'`  | — (required) | Passed to every `BenefitCard` uniformly |
| `items`        | `BenefitItem[]`       | — (required) | `{ title: string; description: string; icon?: string }[]`. Length is variable — not fixed to 3. `icon` is a raw SVG string; omit to fall back to the placeholder icon. |

```astro
<BenefitsSection
  heading="Beneficios"
  headingAlign="center"
  cardAlign="left"
  items={[
    { title: 'Beneficio uno', description: 'Descripción breve del primer beneficio ofrecido.' },
    { title: 'Beneficio dos', description: 'Descripción breve del segundo beneficio ofrecido.' },
    { title: 'Beneficio tres', description: 'Descripción breve del tercer beneficio ofrecido.' },
  ]}
/>
```

### CaptureForm

`organisms/CaptureForm.astro` (+ `CaptureForm.client.ts`)

**Use when** you need the lead-capture form section: nombre / email / celular
fields + submit button + success/error messages. Heading, subtitle,
alignment, and the submit button's label come from required props (no
defaults); the fields themselves stay hardcoded in the markup via
`FormField`, since they're tied to the validation logic in
`CaptureForm.client.ts`. Renders with `id="formulario-captura"` (must match
`Hero`'s CTA anchor).

| Prop       | Type                  | Default      | Notes |
|------------|-----------------------|--------------|-------|
| `heading`  | `string`              | — (required) | Rendered via `Heading as="h2" size="md"` |
| `subtitle` | `string`              | — (required) | Rendered via `Text muted` |
| `align`    | `'left' \| 'center'`  | — (required) | Alignment of the heading/subtitle block; passed to `Heading` |
| `ctaLabel` | `string`              | — (required) | Submit button text |

To add a new field: add a `FormField` with `required` if it should be
validated, and if it needs custom validation beyond "non-empty", add a
field-specific branch in `CaptureForm.client.ts` next to the existing
`celular` regex check (see `.agent/CONTEXT.md`'s "CaptureForm" section for
the full validation/submit contract — request shape, headers, env vars).
Don't inline new client logic into `CaptureForm.astro`'s `<script>` tag; add
it to `CaptureForm.client.ts`.

```astro
<CaptureForm
  heading="Déjanos tus datos"
  subtitle="Te contactaremos con más información."
  align="center"
  ctaLabel="Enviar"
/>
```

---

## Composition example (page-level)

`src/pages/index.astro` reads `src/data/page.json` (a `PageComposition` written
by `lighthouse_back`'s `page_renderer.py` before `astro build` runs) and maps
its `hero` and `features` sections onto `Hero` and `BenefitsSection` props,
falling back to the placeholder copy below when a section is absent. Theme
colors (`theme.primary_color`/`secondary_color`/`font_family`) are validated
(hex-only colors, alnum-only font name) and passed to `BaseLayout` as CSS
custom property overrides. `theme.logo_text`/`theme.logo_icon` are passed
straight through (no fallback/sanitization at the `index.astro` level — `??
undefined` only handles `null`) to `Hero`'s `logoText`/`logoIcon`, which
forwards them to `Logo`; `Logo` itself supplies the `'[Tu Marca]'` default
when `logo_text` is absent. `CaptureForm` stays hardcoded — `PageComposition`
has no section type that maps to it. See `src/pages/index.astro` for the
current implementation.

Known gap: `testimonials`/`pricing`/`faq`/`cta`/`footer` section types from
`PageComposition` have no organism yet and are silently ignored if present in
`page.json`. `HeroSection.image_url`/`cta_url`, `FeatureItem.icon`, and
`theme.logo_url` are read (or present in the fixture) but not rendered —
`theme.logo_text`/`theme.logo_icon` were added to this repo's fixture and
wired to `Logo`, but confirm `lighthouse_back`'s `page_renderer.py` actually
emits these two fields before relying on them outside this template repo.

If asked to build a new page or a variant, compose from these three
organisms first before reaching for atoms/molecules directly — that's the
level this template is designed to be assembled at.
