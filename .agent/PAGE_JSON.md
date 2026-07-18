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
  "logo_url": null,
  "logo_text": "Acme Inc.",
  "logo_icon": null
}
```

| Field             | Type             | Required | Notes |
|-------------------|------------------|----------|-------|
| `primary_color`   | `string`         | yes      | Must match `^#[0-9a-fA-F]{3,8}$` (hex only, 3–8 hex digits after `#`). Anything else silently falls back to `#4f46e5` — no error is raised, so an invalid value just gets ignored. |
| `secondary_color` | `string`         | yes      | Same hex validation; invalid values fall back to `#0ea5e9`. |
| `font_family`     | `string`         | yes      | Must match `^[A-Za-z0-9 _-]+$` (letters, digits, spaces, `_`, `-` only — no commas, no quotes, no CSS font stacks). Invalid values fall back to `'Inter'`. Use a single font name (e.g. `"Poppins"`), not a full `font-family` CSS value. |
| `logo_url`        | `string \| null` | no       | Rendered as `<img>` in the header logo when `logo_icon` is absent/`null`; if `logo_icon` is also set, `logo_icon`'s inline SVG wins and `logo_url` is ignored. Unsanitized — interpolated directly into `<img src>`. |
| `logo_text`       | `string \| null` | no       | Passed straight through to `Hero`'s `logoText` prop with no validation/sanitization. Omit or `null` to fall back to the `Logo` atom's default (`'[Tu Marca]'`). |
| `logo_icon`       | `string \| null` | no       | Raw SVG markup string, injected unsanitized via `set:html`. Same trust model as `HeroSection.image_url` and `FeatureItem.icon` below — only put trusted/sanitized SVG here, never raw user input. Omit or `null` for no icon. |

Colors and font are the only theme fields that get validated before hitting the page; the
rest are trusted verbatim.

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

`CaptureForm` (lead-capture form) also always renders, but has **no corresponding section
type** — its heading/subtitle/button copy is hardcoded in `index.astro`, not read from
`page.json` at all. Don't add a `"type": "capture"` (or similar) section expecting it to do
anything; it will be silently ignored.

#### `hero`

```json
{
  "type": "hero",
  "headline": "Café de especialidad, directo a tu puerta",
  "subheadline": "Suscríbete y recibe granos recién tostados cada mes.",
  "image_url": null,
  "cta_text": "Comenzar ahora",
  "cta_url": null
}
```

| Field         | Type             | Required | Maps to (`Hero` prop) | Notes |
|---------------|------------------|----------|------------------------|-------|
| `headline`    | `string`         | yes*     | `title`                | *Falls back to placeholder copy if the whole `hero` section is absent, but if present, treat as required. |
| `subheadline` | `string`         | yes*     | `subtitle`              | |
| `cta_text`    | `string`         | yes*     | `ctaLabel`              | |
| `image_url`   | `string \| null` | no       | `imageUrl`              | Interpolated into `<img src>` unsanitized. When omitted/`null`, renders the `[Espacio para imagen...]` placeholder box instead. |
| `cta_url`     | `string \| null` | no       | `ctaHref`               | Defaults to `#formulario-captura` (the `CaptureForm` anchor). Only set this to something else if you deliberately want the hero CTA to link elsewhere — changing it away from the default breaks the scroll-to-form behavior. |

#### `features`

```json
{
  "type": "features",
  "headline": "Beneficios",
  "items": [
    { "icon": "check", "title": "Café de alta calidad", "description": "Granos seleccionados y tostados en pequeños lotes." },
    { "icon": "🚚", "title": "Entrega rápida", "description": "Recibe tu pedido en 24–48 horas." },
    { "icon": null, "title": "Cancela cuando quieras", "description": "Sin contratos ni penalizaciones." }
  ]
}
```

| Field      | Type             | Required | Maps to (`BenefitsSection` prop) | Notes |
|------------|------------------|----------|-----------------------------------|-------|
| `headline` | `string`         | no       | `heading`                          | Falls back to `'Beneficios'` if omitted. |
| `items`    | `FeatureItem[]`  | yes*     | `items`                            | Array length is not fixed to 3 — the grid wraps for other counts. |

`FeatureItem`:

| Field         | Type              | Required | Notes |
|---------------|-------------------|----------|-------|
| `title`       | `string`          | yes      | |
| `description` | `string`          | yes      | |
| `icon`        | `string \| null`  | no       | Two accepted forms: a string starting with `<` is treated as raw inline SVG and injected via `set:html` (unsanitized); any other non-empty string (e.g. `"check"`, an emoji like `"🚚"`) is rendered as plain text. Omit or `null` to fall back to the built-in placeholder checkmark icon. Prefer a plain emoji over hand-written SVG unless you already have a trusted, sanitized SVG string. |

### Conditionally-rendering sections

`pricing`, `testimonials`, `faq`, `cta`, and `footer` only render when a section of that
`type` is present in `sections`. There is no fallback/placeholder content for these — omit
the section entirely if the page shouldn't have it, don't include an empty/partial one.

Important gotcha for `pricing`, `testimonials`, and `faq`: their section **headings are
hardcoded in `index.astro`** (`"Planes"`, `"Lo que dicen nuestros clientes"`, `"Preguntas
frecuentes"` respectively) — there is currently no JSON field that overrides them. Don't add
a `headline`/`heading` field to these three expecting it to change the rendered heading; it
will be ignored.

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

| Field   | Type          | Required | Notes |
|---------|---------------|----------|-------|
| `plans` | `PricingPlan[]` | yes    | Grid wraps for counts other than 3. |

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

| Field   | Type                | Required | Notes |
|---------|---------------------|----------|-------|
| `items` | `TestimonialItem[]` | yes      | `md:grid-cols-2` grid. |

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

| Field   | Type        | Required | Notes |
|---------|-------------|----------|-------|
| `items` | `FaqEntry[]` | yes     | Stacks top-to-bottom (not a grid). |

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
    "logo_url": null,
    "logo_text": "Acme Coffee",
    "logo_icon": null
  },
  "sections": [
    {
      "type": "hero",
      "headline": "Café de especialidad, directo a tu puerta",
      "subheadline": "Suscríbete y recibe granos recién tostados cada mes.",
      "image_url": null,
      "cta_text": "Comenzar ahora",
      "cta_url": null
    },
    {
      "type": "features",
      "headline": "Beneficios",
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
    "logo_url": null,
    "logo_text": null,
    "logo_icon": null
  },
  "sections": [
    {
      "type": "hero",
      "headline": "Título principal de tu producto o servicio",
      "subheadline": "Subtítulo de apoyo que explica en una frase el valor de lo que ofreces.",
      "image_url": null,
      "cta_text": "Comenzar ahora",
      "cta_url": null
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

1. Fill `theme.primary_color`/`secondary_color` with real hex codes — a bad value fails
   silently and falls back to the indigo/sky defaults, so double-check the hex format
   (`#` + 3–8 hex digits) rather than trusting the render to catch mistakes.
2. Always include `hero` and `features` sections with real copy — they render unconditionally
   and generic placeholder text will leak to production if left out or left as literal
   Spanish placeholders.
3. Only include `pricing`, `testimonials`, `faq`, `cta`, `footer` if the brief actually calls
   for that section — their presence alone triggers the render, there's no separate
   `"enabled": true/false` flag.
4. Don't invent extra fields (e.g. a `headline` on `pricing`/`testimonials`/`faq`, a
   `cta_url` per pricing plan, an icon per social link) — they're silently ignored, not
   errors, so a generated page that "looks right" in the JSON can still omit intended
   content at render time.
5. Don't invent a new `type` for a section not in this list (e.g. `"gallery"`,
   `"team"`) without confirming with the user first — per `.agent/COMPONENTS.md`, adding a
   9th organism/section type is a template change, not a content change.
