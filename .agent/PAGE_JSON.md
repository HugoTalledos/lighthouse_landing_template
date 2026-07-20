# `page.json` Reference

`src/data/page.json` is the single content input for this template. `src/pages/index.astro`
imports it at build time and maps it onto the organisms documented in
`.agent/COMPONENTS.md` — read that file first if you need to know what a prop actually
renders as; this file only documents the JSON shape an LLM should fill in.

This doc is written so an LLM can generate a valid `page.json` from a client brief without
reading `index.astro` itself. Every field below is traced directly to how `index.astro`
currently consumes it (as of this template's `src/pages/index.astro`) — if you change that
file's parsing logic, update this doc too.

## Top-level shape

```json
{
  "theme": { "...": "see Theme section below" },
  "sections": [ "...": "array of section objects, see Sections below" ]
}
```

Only two top-level keys: `theme` (object) and `sections` (array). There is no page title,
meta description, or other top-level field — `index.astro` hardcodes
`<BaseLayout title="Landing Page Template">`.

## Theme

```json
"theme": {
  "primary_color": "#4f46e5",
  "secondary_color": "#0ea5e9",
  "font_family": "Inter",
  "bg_color": null,
  "text_color": null,
  "logo_url": null,
  "logo_text": "Acme Inc.",
  "logo_icon": null
}
```

| Field             | Type             | Required | Notes |
|-------------------|------------------|----------|-------|
| `primary_color`   | `string`         | yes      | Must match `^#[0-9a-fA-F]{3,8}$` (hex only, 3–8 hex digits after `#`). An invalid value fails `astro build`/`astro dev` with a thrown `Error` naming the field and value — this is not a silent fallback. |
| `secondary_color` | `string`         | yes      | Same hex validation and same hard-failure behavior on an invalid value. |
| `font_family`     | `string`         | yes      | Must match `^[A-Za-z0-9 _-]+$` (letters, digits, spaces, `_`, `-` only — no commas, no quotes, no CSS font stacks). Invalid values fail the build the same way. Use a single font name (e.g. `"Poppins"`), not a full `font-family` CSS value. |
| `bg_color`        | `string \| null` | no       | Same hex validation and same hard-failure behavior as `primary_color` when present. Overrides `--color-bg` (page/body background). Omit or `null` to keep `global.css`'s default (`#ffffff`). |
| `text_color`      | `string \| null` | no       | Same hex validation and same hard-failure behavior as `primary_color` when present. Overrides `--color-text` (body text color). Omit or `null` to keep `global.css`'s default (`#111827`). |
| `logo_url`        | `string \| null` | no       | Rendered as `<img>` in the header logo when `logo_icon` is absent/`null`; if `logo_icon` is also set, `logo_icon`'s inline SVG wins and `logo_url` is ignored. Unsanitized — interpolated directly into `<img src>`. |
| `logo_text`       | `string \| null` | no       | Passed straight through to `Hero`'s `logoText` prop with no validation/sanitization. Omit or `null` to fall back to the `Logo` atom's default (`'[Tu Marca]'`). |
| `logo_icon`       | `string \| null` | no       | Raw SVG markup string, injected unsanitized via `set:html`. Same trust model as `HeroSection.image_url` and `FeatureItem.icon` below — only put trusted/sanitized SVG here, never raw user input. Omit or `null` for no icon. |

Colors (`primary_color`/`secondary_color`/`bg_color`/`text_color`) and `font_family` are the
only theme fields that get validated before hitting the page; the rest are trusted verbatim.

## Sections

`sections` is an array of objects, each discriminated by a `type` string. `index.astro`
looks up **at most one** section per `type` via `.find()` — if you include two objects with
`"type": "hero"`, only the first is used. Order within the array does not affect render
order (render order is fixed by `index.astro`: Hero → Benefits → Pricing → Testimonials →
FAQ → CTA → CaptureForm → Footer); it only affects which one wins for a duplicate `type`.

Any `type` not in the list below is silently ignored — no error, no render.

### Always-rendering sections

`hero` and `features` render unconditionally. If omitted from `sections`, `index.astro`
falls back to generic Spanish placeholder copy rather than erroring — but for a real page
you should always include both.

`CaptureForm` (lead-capture form) also always renders. Its copy is configurable via an optional `capture` section — see below — but unlike `hero`/`features`, omitting it entirely is fine too: `index.astro` falls back to today's default copy field-by-field.

#### `hero`

```json
{
  "type": "hero",
  "layout": "side",
  "text": {
    "headline": "Café de especialidad, directo a tu puerta",
    "headline_highlight": null,
    "subheadline": "Suscríbete y recibe granos recién tostados cada mes.",
    "cta_text": "Comenzar ahora",
    "align": "center"
  },
  "image": {
    "url": null,
    "position": null,
    "shape": null,
    "blur": null,
    "overlay_opacity": null
  }
}
```

Props are grouped by function (`text`/`image`), mirroring the `Hero` component's own prop
grouping — see `.agent/COMPONENTS.md`. As of the current template, `Hero.astro`'s `Props`
type *is* `HeroConfig` (`model/hero.types.ts`), so every field below maps onto the
component's props under the same key — no renaming happens between this JSON and the
component. The hero CTA always links to `#formulario-captura` (the `CaptureForm` anchor);
there is no field to override it from this JSON.

| Field   | Type          | Required | Notes |
|---------|---------------|----------|-------|
| `layout`| `string`      | yes      | **Always set this explicitly — never omit it.** Maps to `Hero`'s `layout` prop. Enum `"side"` \| `"background"` (no `null`). `"side"` shows `image.url` next to the text. `"background"` uses it as a full-bleed section background with a dark semi-transparent overlay for contrast, and the title/subtitle switch to light text. If `"background"` but `image.url` is `null`, falls back to `"side"`'s rendering (placeholder box included). |
| `text`  | `HeroText`    | yes*     | *Falls back to placeholder copy if the whole `hero` section is absent, but if present, treat as required. |
| `image` | `HeroImage`   | yes*     | Same fallback note as `text` — required if `hero` is present. |

`HeroText`:

| Field         | Type     | Required | Maps to (`Hero` prop) | Notes |
|---------------|----------|----------|------------------------|-------|
| `headline`    | `string` | yes      | `text.headline`        | Rendered as the hero's `<h1>`. |
| `headline_highlight` | `string \| null` | no | `text.headline_highlight` | Optional substring of `headline` to render in the theme's `secondary_color` instead of the default heading color (same mechanism as `features.headline_highlight` below — see that entry for exact-match/case-sensitivity behavior). Applies the same way under both `layout: "side"` and `layout: "background"`. Omit or `null` for no highlight. |
| `subheadline` | `string` | yes      | `text.subheadline`     | Rendered as supporting body text below the headline. |
| `cta_text`    | `string` | yes      | `text.cta_text`        | Button label. The button always links to `#formulario-captura` — not configurable from this JSON. |
| `align`       | `string` | yes      | `text.align`           | Enum `"left"` \| `"center"` \| `"right"`. Controls the text alignment of the headline/subheadline/button block (and their flex alignment within it). Independent of `image.position` — applies the same way under both `layout: "side"` and `layout: "background"`. `index.astro` falls back to `"center"` if omitted, but set it explicitly for a real page. |

`HeroImage`:

| Field             | Type              | Required | Maps to (`Hero` prop) | Notes |
|-------------------|-------------------|----------|------------------------|-------|
| `url`             | `string \| null`  | no       | `image.url`            | Interpolated into `<img src>` unsanitized. When omitted/`null`, renders the `[Espacio para imagen o ilustración]` placeholder box instead, regardless of `layout`. |
| `position`        | `string \| null`  | no       | `image.position`       | Only applies with `layout: "side"` (or its fallback from `"background"` without a `url`). `"left"` or `"right"` — which side the image (or its placeholder) sits on; text takes the opposite side. Defaults to `"right"` if omitted/null. |
| `shape`           | `string \| null`  | no       | `image.shape`          | Only applies with `layout: "side"` (or its fallback). `"rounded"` (default if omitted/null) or `"circle"`. |
| `blur`            | `boolean \| null` | no       | `image.blur`           | Only applies with `layout: "background"`. Defaults to `false` if omitted/null. |
| `overlay_opacity` | `number \| null`  | no       | `image.overlay_opacity`| Only applies with `layout: "background"`. `0`–`1`; `0` = no overlay, `1` = solid black. Defaults to `0.55` if omitted/null. |

#### `features`

```json
{
  "type": "features",
  "headline": "Lo que nos hace distintos",
  "headline_highlight": "distintos",
  "items": [
    { "icon": "check", "title": "Café de alta calidad", "description": "Granos seleccionados y tostados en pequeños lotes." },
    { "icon": "🚚", "title": "Entrega rápida", "description": "Recibe tu pedido en 24–48 horas." },
    { "icon": null, "title": "Cancela cuando quieras", "description": "Sin contratos ni penalizaciones." }
  ]
}
```

| Field                | Type             | Required | Maps to (`BenefitsSection` prop) | Notes |
|----------------------|------------------|----------|-----------------------------------|-------|
| `headline`           | `string`         | no       | `heading`                          | Falls back to `'Beneficios'` if omitted. |
| `headline_highlight` | `string \| null` | no       | `headingHighlight`                 | Optional substring of `headline` to render in the theme's `secondary_color` instead of the default heading color (e.g. `headline: "Lo que nos hace distintos"` + `headline_highlight: "distintos"` colors just that word). Must match a substring of `headline` **exactly** (case-sensitive, accents included) via `indexOf` — if it doesn't match (typo, wrong case) it's silently ignored and the whole heading renders in the default color, no error. Only the first occurrence is highlighted. Omit or `null` for no highlight. |
| `items`              | `FeatureItem[]`  | yes*     | `items`                            | Array length is not fixed to 3 — the grid wraps for other counts. |

`BenefitsSection`'s `Props` type is `BenefitConfig` (`model/benefit.types.ts`), which also
declares `headingAlign`, `cardAlign`, and `iconPosition` (each `"left" | "center" | "right"`) —
`cardAlign`/`headingAlign` control text alignment, and `iconPosition` independently controls
which side of the card the icon badge sits on (it does not have to match `cardAlign`). None of
these three are read from `page.json` — `index.astro` hardcodes them
(`headingAlign="center"`, `cardAlign="left"`, `iconPosition="center"`) — so there is nothing to
set for them in this file; they're documented here only for context on how `BenefitCard`
renders.

`FeatureItem`:

| Field         | Type              | Required | Notes |
|---------------|-------------------|----------|-------|
| `title`       | `string`          | yes      | |
| `description` | `string`          | yes      | |
| `icon`        | `string \| null`  | no       | Two accepted forms: a string starting with `<` is treated as raw inline SVG and injected via `set:html` (unsanitized); any other non-empty string (e.g. `"check"`, an emoji like `"🚚"`) is rendered as plain text. Omit or `null` to fall back to the built-in placeholder checkmark icon. Prefer a plain emoji over hand-written SVG unless you already have a trusted, sanitized SVG string. |

#### `capture`

```json
{
  "type": "capture",
  "headline": "Déjanos tus datos",
  "subheadline": "Te contactaremos con más información.",
  "cta_text": "Enviar"
}
```

| Field         | Type     | Required | Maps to (`CaptureForm` prop) | Notes |
|---------------|----------|----------|-------------------------------|-------|
| `headline`    | `string` | no       | `heading`                      | Falls back to `'Déjanos tus datos'` if omitted or the whole `capture` section is absent. |
| `subheadline` | `string` | no       | `subtitle`                     | Falls back to `'Te contactaremos con más información.'`. |
| `cta_text`    | `string` | no       | `ctaLabel`                     | Falls back to `'Enviar'`. |

Unlike every other section type, all three fields are individually optional — a `capture`
section can set just one of them and rely on the defaults for the rest. This section only
controls copy; the actual form fields (nombre/email/celular) and validation are hardcoded in
`CaptureForm.astro`/`CaptureForm.client.ts`, per `.agent/COMPONENTS.md`.

### Conditionally-rendering sections

`pricing`, `testimonials`, `faq`, `cta`, and `footer` only render when a section of that
`type` is present in `sections`. There is no fallback/placeholder content for these — omit
the section entirely if the page shouldn't have it, don't include an empty/partial one.

#### `pricing`

```json
{
  "type": "pricing",
  "plans": [
    {
      "name": "Plan Individual",
      "price": "$15.99",
      "period": "/mes",
      "features": ["Café de alta calidad", "Entrega rápida"],
      "cta_text": "Suscríbete ahora"
    }
  ]
}
```

| Field      | Type          | Required | Notes |
|------------|---------------|----------|-------|
| `headline` | `string`      | no       | Passed to `PricingSection`'s `heading` prop. Falls back to `'Planes'` if omitted. |
| `plans`    | `PricingPlan[]` | yes    | Grid wraps for counts other than 3. |

`PricingPlan`:

| Field      | Type             | Required | Maps to (`PricingCard` prop) | Notes |
|------------|------------------|----------|-------------------------------|-------|
| `name`     | `string`         | yes      | `name`                        | |
| `price`    | `string`         | yes      | `price`                       | Free-form string, not a number — include currency symbol, e.g. `"$15.99"`. |
| `period`   | `string \| null` | no       | `period`                      | Appended muted after the price, e.g. `/mes`. Omit or `null` for a one-time price with no period. |
| `features` | `string[]`       | yes      | `features`                    | Rendered as a `✓`-prefixed list. |
| `cta_text` | `string`         | yes      | `ctaLabel`                    | |

Note there is no `cta_url` per plan — every `PricingCard`'s button links to the default
`#formulario-captura` anchor; the template has no field to override it per plan.

#### `testimonials`

```json
{
  "type": "testimonials",
  "items": [
    { "quote": "La calidad del café es inigualable.", "author_name": "María Sánchez", "author_role": "Amante del café" }
  ]
}
```

| Field      | Type                | Required | Notes |
|------------|---------------------|----------|-------|
| `headline` | `string`            | no       | Passed to `TestimonialsSection`'s `heading` prop. Falls back to `'Lo que dicen nuestros clientes'` if omitted. |
| `items`    | `TestimonialItem[]` | yes      | `md:grid-cols-2` grid. |

`TestimonialItem`:

| Field         | Type             | Required | Maps to (`TestimonialCard` prop) | Notes |
|---------------|------------------|----------|------------------------------------|-------|
| `quote`       | `string`         | yes      | `quote`                            | Rendered wrapped in curly quotes; don't add your own quote marks. |
| `author_name` | `string`         | yes      | `authorName`                       | |
| `author_role` | `string \| null` | no       | `authorRole`                       | Omitted entirely from render if absent/`null` (e.g. skip for an anonymous testimonial). |

#### `faq`

```json
{
  "type": "faq",
  "items": [
    { "question": "¿Cómo puedo cancelar mi suscripción?", "answer": "Puedes cancelar en cualquier momento desde tu cuenta." }
  ]
}
```

| Field      | Type        | Required | Notes |
|------------|-------------|----------|-------|
| `headline` | `string`    | no       | Passed to `FaqSection`'s `heading` prop. Falls back to `'Preguntas frecuentes'` if omitted. |
| `items`    | `FaqEntry[]` | yes     | Stacks top-to-bottom (not a grid). |

`FaqEntry`:

| Field      | Type     | Required | Maps to (`FaqItem` prop) |
|------------|----------|----------|----------------------------|
| `question` | `string` | yes      | `question`                 |
| `answer`   | `string` | yes      | `answer`                   |

#### `cta`

```json
{
  "type": "cta",
  "headline": "No esperes más para disfrutar del café de especialidad en tu casa",
  "subheadline": "Suscríbete hoy y recibe 15% de descuento en tu primer pedido.",
  "button_text": "Suscríbete al plan mensual",
  "button_url": null
}
```

Unlike `pricing`/`testimonials`/`faq`, this section's own copy **is** fully read from JSON
(no hardcoded fallback text) — a standalone CTA banner distinct from the hero.

| Field          | Type             | Required | Maps to (`CtaSection` prop) | Notes |
|----------------|------------------|----------|-------------------------------|-------|
| `headline`     | `string`         | yes      | `headline`                     | |
| `subheadline`  | `string \| null` | no       | `subheadline`                  | Omitted entirely from render if absent/`null`. |
| `button_text`  | `string`         | yes      | `buttonLabel`                  | |
| `button_url`   | `string \| null` | no       | `buttonHref`                   | Defaults to `#formulario-captura` if omitted/`null`. |

#### `footer`

```json
{
  "type": "footer",
  "business_name": "Acme Coffee",
  "links": [
    { "label": "Blog", "url": "/blog" },
    { "label": "Términos y condiciones", "url": "/terminos" }
  ],
  "social_links": [
    { "platform": "Instagram", "url": "https://instagram.com/acmecoffee" }
  ]
}
```

| Field           | Type            | Required | Maps to (`Footer` prop) | Notes |
|-----------------|-----------------|----------|----------------------------|-------|
| `business_name` | `string`        | yes      | `businessName`             | Rendered as plain bold text, not through the `Logo` component — can differ from `theme.logo_text`. |
| `links`         | `FooterLink[]`  | yes      | `links`                    | `{ label: string; url: string }[]`. |
| `social_links`  | `SocialLink[]`  | no       | `socialLinks`              | `{ platform: string; url: string }[]`. Omit or leave empty to hide the social nav entirely. `platform` is rendered as plain text (e.g. `"Instagram"`) — there are no per-platform icons in this template, so don't expect an icon to appear regardless of the value used. |

## Full example

A `page.json` using every section type:

```json
{
  "theme": {
    "primary_color": "#4f46e5",
    "secondary_color": "#0ea5e9",
    "font_family": "Inter",
    "bg_color": null,
    "text_color": null,
    "logo_url": null,
    "logo_text": "Acme Coffee",
    "logo_icon": null
  },
  "sections": [
    {
      "type": "hero",
      "layout": "side",
      "text": {
        "headline": "Café de especialidad, directo a tu puerta",
        "headline_highlight": "especialidad",
        "subheadline": "Suscríbete y recibe granos recién tostados cada mes.",
        "cta_text": "Comenzar ahora",
        "align": "center"
      },
      "image": {
        "url": null,
        "position": null,
        "shape": null,
        "blur": null,
        "overlay_opacity": null
      }
    },
    {
      "type": "features",
      "headline": "Beneficios",
      "headline_highlight": null,
      "items": [
        { "icon": "☕", "title": "Café de alta calidad", "description": "Granos seleccionados y tostados en pequeños lotes." },
        { "icon": "🚚", "title": "Entrega rápida", "description": "Recibe tu pedido en 24–48 horas." },
        { "icon": null, "title": "Cancela cuando quieras", "description": "Sin contratos ni penalizaciones." }
      ]
    },
    {
      "type": "pricing",
      "plans": [
        { "name": "Plan Individual", "price": "$15.99", "period": "/mes", "features": ["Café de alta calidad", "Entrega rápida"], "cta_text": "Suscríbete ahora" },
        { "name": "Plan Familiar", "price": "$29.99", "period": "/mes", "features": ["2x bolsas de café", "Entrega prioritaria", "Regalo de bienvenida"], "cta_text": "Suscríbete ahora" }
      ]
    },
    {
      "type": "testimonials",
      "items": [
        { "quote": "La calidad del café es inigualable.", "author_name": "María Sánchez", "author_role": "Amante del café" },
        { "quote": "El servicio de entrega es excelente.", "author_name": "Carlos Ruiz", "author_role": null }
      ]
    },
    {
      "type": "faq",
      "items": [
        { "question": "¿Cómo puedo cancelar mi suscripción?", "answer": "Puedes cancelar en cualquier momento desde tu cuenta." },
        { "question": "¿Cuánto tarda el envío?", "answer": "Entre 24 y 48 horas hábiles." }
      ]
    },
    {
      "type": "cta",
      "headline": "No esperes más para disfrutar del café de especialidad en tu casa",
      "subheadline": "Suscríbete hoy y recibe 15% de descuento en tu primer pedido.",
      "button_text": "Suscríbete al plan mensual",
      "button_url": null
    },
    {
      "type": "footer",
      "business_name": "Acme Coffee",
      "links": [
        { "label": "Blog", "url": "/blog" },
        { "label": "Términos y condiciones", "url": "/terminos" }
      ],
      "social_links": [
        { "platform": "Instagram", "url": "https://instagram.com/acmecoffee" }
      ]
    }
  ]
}
```

## Minimal example

The smallest valid `page.json` — only the two always-rendering sections, everything else
omitted:

```json
{
  "theme": {
    "primary_color": "#4f46e5",
    "secondary_color": "#0ea5e9",
    "font_family": "Inter",
    "bg_color": null,
    "text_color": null,
    "logo_url": null,
    "logo_text": null,
    "logo_icon": null
  },
  "sections": [
    {
      "type": "hero",
      "layout": "side",
      "text": {
        "headline": "Título principal de tu producto o servicio",
        "headline_highlight": null,
        "subheadline": "Subtítulo de apoyo que explica en una frase el valor de lo que ofreces.",
        "cta_text": "Comenzar ahora",
        "align": "center"
      },
      "image": {
        "url": null,
        "position": null,
        "shape": null,
        "blur": null,
        "overlay_opacity": null
      }
    },
    {
      "type": "features",
      "headline": "Beneficios",
      "items": [
        { "icon": null, "title": "Beneficio uno", "description": "Descripción breve del primer beneficio ofrecido." },
        { "icon": null, "title": "Beneficio dos", "description": "Descripción breve del segundo beneficio ofrecido." },
        { "icon": null, "title": "Beneficio tres", "description": "Descripción breve del tercer beneficio ofrecido." }
      ]
    }
  ]
}
```

## Checklist for generating a `page.json` from a client brief

1. Fill `theme.primary_color`/`secondary_color`/`font_family` with valid values — an invalid
   one now fails the build outright (`astro build` throws, naming the field and value),
   rather than silently substituting a default. Double-check the hex format (`#` + 3–8 hex
   digits) and the font-name character set before generating the file. `theme.bg_color`/
   `text_color` are optional but validated the same way when present — set them (instead of
   `null`) whenever the brief calls for a non-default page background or body text color.
2. Always include `hero` and `features` sections with real copy — they render unconditionally
   and generic placeholder text will leak to production if left out or left as literal
   Spanish placeholders. `hero.layout` is required — always set it explicitly to `"side"` or
   `"background"` (pick `"background"` only if `hero.image.url` is also set, otherwise it
   silently falls back to `"side"`'s rendering) — never omit the field.
3. Only include `pricing`, `testimonials`, `faq`, `cta`, `footer` if the brief actually calls
   for that section — their presence alone triggers the render, there's no separate
   `"enabled": true/false` flag.
4. Don't invent extra fields beyond what's documented per section (e.g. a `cta_url` per
   pricing plan, an icon per social link) — they're silently ignored, not errors, so a
   generated page that "looks right" in the JSON can still omit intended content at render
   time.
5. Don't invent a new `type` for a section not in this list (e.g. `"gallery"`,
   `"team"`) without confirming with the user first — per `.agent/COMPONENTS.md`, adding a
   9th organism/section type is a template change, not a content change.
