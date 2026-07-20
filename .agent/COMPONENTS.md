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

### Link

`atoms/Link.astro`

**Use when** you need a plain text link — footer navigation links, social
links — as opposed to a CTA button. Don't reuse `Button` for these; `Button`
is styled as a filled/muted call-to-action, not an inline text link.

| Prop    | Type     | Default      | Notes |
|---------|----------|--------------|-------|
| `href`  | `string` | — (required) | |
| `class` | `string` | —            | Appended, not merged |

```astro
<Link href="/blog">Blog</Link>
```

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

| Prop           | Type                            | Default      | Notes |
|----------------|----------------------------------|--------------|-------|
| `title`        | `string`                        | — (required) | Rendered via `Heading as="h3" size="sm"` |
| `description`  | `string`                        | — (required) | Rendered via `Text muted` |
| `align`        | `'left' \| 'center' \| 'right'` | — (required) | Controls card content alignment; passed through to the internal `Heading` |
| `iconPosition` | `'left' \| 'center' \| 'right'` | `align`'s value | Independently positions the icon badge (via `self-*`), decoupled from text alignment |
| `background`   | `'primary' \| 'secondary'`      | `'secondary'` | `'secondary'` → `--color-bg-secondary`, `'primary'` → `--color-bg`. `BenefitsSection` passes whichever tone contrasts with its own section background. |
| `class`        | `string`                        | —            | Appended, not merged |

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

| Prop       | Type     | Default        | Notes |
|------------|----------|----------------|-------|
| `text`     | `string` | `'[Tu Marca]'` | Brand name/wordmark |
| `logoUrl`  | `string` | —              | Rendered as `<img>` in the icon box when the `icon` slot is empty; ignored if the `icon` slot has content |
| `class`    | `string` | —              | Appended, not merged |

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

<Logo text="Acme Inc." logoUrl="https://cdn.example.com/logo.png" />
```

### PricingCard

`molecules/PricingCard.astro`

**Use when** rendering one plan in a pricing grid — name, price, optional
period, feature list, CTA button. This is what `PricingSection` maps over.

Redesigned as a light card by default; pass `featured` to switch it to a
dark, inverted-color card (bg in `--color-text`, white text/icons, CTA
button in `--color-secondary`) — modeled as a "most popular" plan callout.
The pill badge (`badgeText`) is independent of `featured`: it only renders
when set, on either variant. Features render in a 2-column checklist
(`grid-cols-1 sm:grid-cols-2`) with a small circular check icon per item.

| Prop         | Type       | Default                  | Notes |
|--------------|------------|---------------------------|-------|
| `name`       | `string`   | — (required)               | Rendered via `Heading as="h3" size="sm"` |
| `price`      | `string`   | — (required)               | Rendered as a styled `<p>`, not through `Heading`/`Text` — neither atom offers a "large numeral" style |
| `period`     | `string`   | —                          | Appended muted after `price` when present, e.g. `/mes` |
| `features`   | `string[]` | — (required)               | Rendered as a checklist (circular check icon + `Text size="sm"`), 2 columns |
| `ctaLabel`   | `string`   | — (required)               | Button text |
| `ctaHref`    | `string`   | `'#formulario-captura'`    | Button link target |
| `featured`   | `boolean`  | `false`                    | Switches the card to the dark/inverted "most popular" visual style |
| `badgeText`  | `string`   | —                          | Pill badge text shown above `name`, e.g. `"Más popular"`. Omit for no badge — independent of `featured` |
| `background` | `'primary' \| 'secondary'` | `'secondary'` | Fill color when **not** `featured` (`featured` always uses `--color-text` regardless): `'secondary'` → `--color-bg-secondary`, `'primary'` → `--color-bg`. `PricingSection` passes whichever tone contrasts with its own section background. |
| `class`      | `string`   | —                          | Appended, not merged |

```astro
<PricingCard
  name="Plan Individual"
  price="$15.99"
  period="/mes"
  features={['Café de alta calidad', 'Entrega rápida']}
  ctaLabel="Suscríbete ahora"
/>

<PricingCard
  name="Plan Familiar"
  price="$29.99"
  period="/mes"
  features={['2x bolsas de café', 'Entrega prioritaria', 'Regalo de bienvenida']}
  ctaLabel="Suscríbete ahora"
  featured
  badgeText="Más popular"
/>
```

### FaqItem

`molecules/FaqItem.astro`

**Use when** rendering one question/answer pair in an FAQ list. Uses a
native `<details>/<summary>` element — no JavaScript, accessible by
default. This is what `FaqSection` maps over.

| Prop       | Type     | Default      | Notes |
|------------|----------|--------------|-------|
| `question` | `string` | — (required) | Rendered in `<summary>` |
| `answer`   | `string` | — (required) | Rendered via `Text muted`, shown when the `<details>` is expanded |
| `class`    | `string` | —            | Appended, not merged |

```astro
<FaqItem question="¿Cómo puedo cancelar mi suscripción?" answer="Puedes cancelar en cualquier momento." />
```

---

## Organisms

Organisms compose atoms + molecules into a full page section.
`src/pages/index.astro` always renders `Hero`, `BenefitsSection`, and
`CaptureForm`; it additionally renders `PricingSection`,
`FaqSection`, `CtaSection`, and `Footer`
conditionally, based on which section `type`s are present in `page.json`.
Don't add a section type beyond these 7 without confirming with the user
first.

### Hero

`organisms/Hero.astro`

**Use when** you need the page's top section: header bar (logo) + hero
banner (headline, subtitle, primary CTA button, optional image). Props type
is `HeroConfig` (`model/hero.types.ts`) plus `background` — props are
grouped by function (`text`/`image`/`logo`), and the CTA always links to
`#formulario-captura` (not configurable). `image.url` is optional — when
omitted, the `[Espacio para imagen o ilustración]` placeholder box renders
instead, regardless of `layout`. `layout` controls how `image.url` is
displayed: `'side'` (default) places it next to the text column,
`'background'` uses it as a full-bleed section background with a dark
overlay for contrast and switches the title/subtitle to light text; if
`layout` is `'background'` but `image.url` is absent, it falls back to
`'side'`'s rendering (placeholder box included).

| Prop         | Type                                                     | Default      | Notes |
|--------------|-----------------------------------------------------------|--------------|-------|
| `layout`     | `'side' \| 'background' \| null`                         | `'side'`     | `'side'` shows `image.url` next to the text. `'background'` renders it as a full-bleed section background with a `bg-black` overlay (opacity via `image.overlay_opacity`) and light text; falls back to `'side'`'s rendering if `image.url` is absent. |
| `text`       | `{ headline: string; headline_highlight?: string \| null; subheadline: string; cta_text: string; align: 'left' \| 'center' \| 'right' }` | — (required) | `headline` → `<h1>`; `headline_highlight` colors a substring in `--color-secondary` (see `BenefitsSection`'s `headingHighlight` for the exact-match behavior); `align` controls alignment of the whole title/subtitle/button block |
| `image`      | `{ url?: string \| null; position?: 'left' \| 'right' \| null; shape?: 'circle' \| 'rounded' \| null; blur?: boolean \| null; overlay_opacity?: number \| null }` | — (required) | `position`/`shape` only apply to `layout: 'side'`; `blur`/`overlay_opacity` only apply to `layout: 'background'` |
| `logo`       | `{ logoText?: string; logoIcon?: string; logoUrl?: string }` | — (required) | Forwarded to the header `Logo` |
| `background` | `'primary' \| 'secondary'`                                | `'primary'`  | Applies `--color-bg-secondary` to the header bar + hero section when `'secondary'`; computed automatically by `index.astro`'s section-alternation logic, not a `page.json` field |

```astro
<Hero
  layout="side"
  text={{ headline: 'Título principal de tu producto o servicio', subheadline: 'Subtítulo de apoyo.', cta_text: 'Comenzar ahora', align: 'left' }}
  image={{ url: undefined, position: 'right', shape: 'rounded' }}
  logo={{ logoText: 'Acme Inc.', logoIcon: acmeIcon }}
/>
```

### BenefitsSection

`organisms/BenefitsSection.astro`

**Use when** you need the benefits/features grid (`md:grid-cols-3`, wraps
for other counts). All copy, alignment, and the card list come from
required props — there are no defaults. Renders with `id="beneficios"` for
anchor-linking. Uses `BenefitCard` under the hood, so follow that
molecule's icon-slot convention if you customize per-item icons.

| Prop              | Type                  | Default      | Notes |
|-------------------|-----------------------|--------------|-------|
| `heading`         | `string`              | — (required) | Rendered via `Heading as="h2" size="md"` |
| `headingHighlight`| `string \| null`      | —            | Optional substring of `heading` rendered in `--color-secondary` instead of the default heading color; ignored silently if it doesn't match exactly (case/accent-sensitive) |
| `headingAlign`    | `'left' \| 'center' \| 'right'` | — (required) | Passed to the section `Heading` |
| `cardAlign`       | `'left' \| 'center' \| 'right'` | — (required) | Passed to every `BenefitCard` uniformly |
| `iconPosition`    | `'left' \| 'center' \| 'right'` | `cardAlign`'s value | Independently positions each card's icon badge (via `self-*`), decoupled from text alignment |
| `items`           | `BenefitItem[]`       | — (required) | `{ title: string; description: string; icon?: string }[]`. Length is variable — not fixed to 3. `icon` accepts either raw SVG markup (strings starting with `<`, injected via `set:html`) or a plain string/emoji (rendered as text); omit to fall back to the placeholder icon. |
| `background`      | `'primary' \| 'secondary'` | `'primary'` | Applies `--color-bg-secondary` to the section when `'secondary'`; computed automatically by `index.astro`'s section-alternation logic, not a `page.json` field. Each `BenefitCard`'s own fill automatically uses the opposite tone so it always contrasts with this section. |

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

| Prop              | Type                  | Default      | Notes |
|-------------------|-----------------------|--------------|-------|
| `heading`         | `string`              | — (required) | Rendered via `Heading as="h2" size="md"` |
| `headingHighlight`| `string \| null`      | —            | Optional substring of `heading` rendered in `--color-secondary`; ignored silently if it doesn't match exactly |
| `subtitle`        | `string`              | — (required) | Rendered via `Text muted` |
| `align`           | `'left' \| 'center'`  | — (required) | Alignment of the heading/subtitle block; passed to `Heading` |
| `ctaLabel`        | `string`              | — (required) | Submit button text |
| `background`      | `'primary' \| 'secondary'` | `'primary'` | Applies `--color-bg-secondary` to the section when `'secondary'`; computed automatically by `index.astro`'s section-alternation logic, not a `page.json` field |

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

### PricingSection

`organisms/PricingSection.astro`

**Use when** you need a pricing/plans grid (`md:grid-cols-3`, wraps for
other counts). Renders with `id="precios"`. Renders conditionally in
`index.astro` — only when a `pricing` section is present in `page.json`,
unlike `Hero`/`BenefitsSection`/`CaptureForm` which always render.

Props type is `PricingConfig` (`model/pricing.types.ts`) — `plans` uses the
JSON-native field names (`cta_text`, `featured`, `badge_text`), which
`PricingSection` maps onto each `PricingCard`'s own prop names
(`ctaLabel`, `featured`, `badgeText`).

| Prop              | Type                  | Default      | Notes |
|-------------------|-----------------------|--------------|-------|
| `heading`         | `string`              | — (required) | Rendered via `Heading as="h2" size="md"` |
| `headingHighlight`| `string \| null`      | —            | Optional substring of `heading` rendered in `--color-secondary`; ignored silently if it doesn't match exactly |
| `headingAlign`    | `'left' \| 'center' \| 'right'` | — (required) | Passed to the section `Heading` |
| `plans`           | `PricingPlanConfig[]` | — (required) | `{ name: string; price: string; period?: string \| null; features: string[]; cta_text: string; featured?: boolean \| null; badge_text?: string \| null }[]` |
| `background`      | `'primary' \| 'secondary'` | `'primary'` | Applies `--color-bg-secondary` to the section when `'secondary'`; computed automatically by `index.astro`'s section-alternation logic, not a `page.json` field. Each non-`featured` `PricingCard`'s own fill automatically uses the opposite tone so it always contrasts with this section. |

```astro
<PricingSection
  heading="Planes"
  headingAlign="center"
  plans={[
    { name: 'Plan Individual', price: '$15.99', period: '/mes', features: ['Café de alta calidad'], cta_text: 'Suscríbete ahora' },
    { name: 'Plan Familiar', price: '$29.99', period: '/mes', features: ['2x bolsas de café'], cta_text: 'Suscríbete ahora', featured: true, badge_text: 'Más popular' },
  ]}
/>
```

### FaqSection

`organisms/FaqSection.astro`

**Use when** you need an FAQ list (not a grid — items stack top-to-bottom).
Renders with `id="preguntas-frecuentes"`. Renders conditionally in
`index.astro` — only when a `faq` section is present in `page.json`.

| Prop              | Type                  | Default      | Notes |
|-------------------|-----------------------|--------------|-------|
| `heading`         | `string`              | — (required) | Rendered via `Heading as="h2" size="md"` |
| `headingHighlight`| `string \| null`      | —            | Optional substring of `heading` rendered in `--color-secondary`; ignored silently if it doesn't match exactly |
| `headingAlign`    | `'left' \| 'center'`  | — (required) | Passed to the section `Heading` |
| `items`           | `FaqEntry[]`          | — (required) | `{ question: string; answer: string }[]` |
| `background`      | `'primary' \| 'secondary'` | `'primary'` | Applies `--color-bg-secondary` to the section when `'secondary'`; computed automatically by `index.astro`'s section-alternation logic, not a `page.json` field |

```astro
<FaqSection
  heading="Preguntas frecuentes"
  headingAlign="center"
  items={[
    { question: '¿Cómo puedo cancelar mi suscripción?', answer: 'Puedes cancelar en cualquier momento.' },
  ]}
/>
```

### CtaSection

`organisms/CtaSection.astro`

**Use when** you need a standalone call-to-action banner (headline +
optional subheadline + button), distinct from `Hero`. No `id` — nothing
links to it directly. Renders conditionally in `index.astro` — only when a
`cta` section is present in `page.json`.

| Prop                | Type                  | Default                  | Notes |
|---------------------|-----------------------|---------------------------|-------|
| `headline`          | `string`              | — (required)              | Rendered via `Heading as="h2" size="md"` |
| `headlineHighlight` | `string \| null`      | —                         | Optional substring of `headline` rendered in `--color-secondary`; ignored silently if it doesn't match exactly |
| `subheadline`       | `string`              | —                         | Rendered via `Text muted`; omitted entirely if absent |
| `buttonLabel`       | `string`              | — (required)              | Button text |
| `buttonHref`        | `string`              | `'#formulario-captura'`   | Button link target |
| `align`             | `'left' \| 'center'`  | — (required)              | Alignment of the headline/subheadline/button block |
| `background`        | `'primary' \| 'secondary'` | `'primary'`          | Applies `--color-bg-secondary` to the section when `'secondary'` (replaces the old always-on `--color-bg-muted` background); computed automatically by `index.astro`'s section-alternation logic, not a `page.json` field |

```astro
<CtaSection
  headline="No esperes más para disfrutar del café de especialidad en tu casa"
  buttonLabel="Suscríbete al plan mensual"
  align="center"
/>
```

### Footer

`organisms/Footer.astro`

**Use when** you need the page footer: business name + nav links + optional
social links. Uses the `Link` atom for both link groups — social links
render as plain platform-name text (`Instagram`, `Facebook`, ...), there are
no per-platform icons/assets in this template. Renders conditionally in
`index.astro` — only when a `footer` section is present in `page.json`.

| Prop           | Type              | Default      | Notes |
|----------------|-------------------|--------------|-------|
| `businessName` | `string`          | — (required) | Rendered as plain bold text, not through `Logo` |
| `links`        | `FooterLink[]`    | — (required) | `{ label: string; url: string }[]` |
| `socialLinks`  | `SocialLink[]`    | —            | `{ platform: string; url: string }[]`; the social nav is omitted entirely if absent or empty |
| `background`   | `'primary' \| 'secondary'` | `'primary'` | Applies `--color-bg-secondary` to the footer when `'secondary'`; computed automatically by `index.astro`'s section-alternation logic, not a `page.json` field |

```astro
<Footer
  businessName="Acme Coffee"
  links={[{ label: 'Blog', url: '/blog' }]}
  socialLinks={[{ platform: 'Instagram', url: 'https://instagram.com/acmecoffee' }]}
/>
```

---

## Composition example (page-level)

`src/pages/index.astro` reads `src/data/page.json` (a `PageComposition` written
by `lighthouse_back`'s `page_renderer.py` before `astro build` runs) and maps
its `hero` and `features` sections onto `Hero` and `BenefitsSection` props,
falling back to the placeholder copy below when a section is absent — these
two, plus `CaptureForm`, always render. `pricing`/`faq`/`cta`/
`footer` sections map onto `PricingSection`/
`FaqSection`/`CtaSection`/`Footer` and render conditionally — only when
present in `page.json`, with no fallback content. Theme colors (`theme.primary_color`/`secondary_color`/`bg_color`/`bg_secondary_color`/`text_color`/`font_family`)
are validated (hex-only colors, alnum-only font name) before being interpolated into an
inline `<style>` override in `BaseLayout` — an invalid value throws and fails the build
rather than falling back silently. `bg_color`/`bg_secondary_color`/`text_color` are optional
(the other theme colors aren't); omitting or nulling them keeps `global.css`'s
`--color-bg`/`--color-bg-secondary`/`--color-text` defaults. `index.astro` also computes a
`background` prop (`'primary' | 'secondary'`, alternating `--color-bg`/`--color-bg-secondary`
per rendered section, skipping ones that don't render) passed to every organism — see each
organism's own entry above and `.agent/PAGE_JSON.md`'s "Sections" intro. `theme.logo_text`/`theme.logo_icon`/`theme.logo_url` are passed straight
through (no fallback/sanitization at the `index.astro` level — `?? undefined` only handles
`null`) to `Hero`'s `logoText`/`logoIcon`/`logoUrl`, which forwards them to `Logo`; `Logo`
itself supplies the `'[Tu Marca]'` text default when `logo_text` is absent, prefers
`logo_icon`'s inline SVG over `logo_url`'s `<img>` when both are present, and renders no icon
at all when neither is present. `CaptureForm`'s copy is sourced from an optional `capture` section type (falls back field-by-field to today's default copy when absent) — see `.agent/PAGE_JSON.md` for its shape. See `src/pages/index.astro` for the
current implementation.

`PricingSection`/`FaqSection`/`CtaSection`/`Footer`
render conditionally — only when their matching section `type`
(`pricing`/`faq`/`cta`/`footer`) is present in `page.json`.
`Hero.imageUrl`/`ctaHref` and `BenefitItem.icon`-as-text are now rendered
(previously read but ignored). `theme.logo_url`/`logo_text`/`logo_icon` are all wired to `Logo` as of this repo's
`2026-07-18-page-json-wiring-gaps.md` plan; confirm `lighthouse_back`'s `page_renderer.py`
actually emits all three before relying on them outside this template repo.

If asked to build a new page or a variant, compose from these 8 organisms
first before reaching for atoms/molecules directly — that's the level this
template is designed to be assembled at.
