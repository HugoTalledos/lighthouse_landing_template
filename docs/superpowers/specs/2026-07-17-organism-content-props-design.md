# Content/position props for Hero, BenefitsSection, CaptureForm

## Problem

`Hero.astro`, `BenefitsSection.astro`, and `CaptureForm.astro` currently take
no props — all copy (title, subtitle, headings, button labels, benefit
items) and layout decisions (text alignment, which side the hero image sits
on) are hardcoded inline. This is documented as intentional-as-shipped in
`.agent/COMPONENTS.md` ("No props — all copy is inline placeholder text").

The goal is for an agent (or a developer) reusing this template on a new
client project to be able to choose the text content and text
position/alignment for these three organisms via props, instead of editing
component internals by hand.

## Scope

All three organisms get new props: `Hero`, `BenefitsSection`, and
`CaptureForm` (for consistency across the template's whole composition
surface). `BenefitCard` (molecule) also gets a new `align` prop, since
`BenefitsSection` needs to pass card-level alignment down to it.

All new props are **required, with no defaults** — callers must pass
content/position explicitly. `src/pages/index.astro` is updated to pass the
current placeholder text/positions as explicit prop values, so the rendered
page is unchanged.

Out of scope:
- `CaptureForm`'s form fields (nombre/email/celular), and its success/error
  messages, stay hardcoded — they're tied to the validation logic in
  `CaptureForm.client.ts` and changing that contract wasn't requested.
- `Hero`'s CTA `href` stays fixed at `#formulario-captura` — it's documented
  in `.agent/CONTEXT.md` as an invariant that must match `CaptureForm`'s
  section `id`, and making it a free-form prop risks an agent breaking that
  link without realizing it.
- Dynamic grid-column count in `BenefitsSection` based on item count — the
  grid stays `md:grid-cols-3` regardless of how many items are passed; it
  just wraps.

## Design

### `Hero.astro`

```ts
interface Props {
  title: string;
  subtitle: string;
  ctaLabel: string;
  align: 'left' | 'center';       // alignment of title/subtitle/button within their column
  textPosition: 'left' | 'right'; // which side the text column renders on; image takes the other side
}
```

- `ctaHref` is not a prop; the button always links to `#formulario-captura`.
- `textPosition` is implemented with responsive `order-*` Tailwind classes
  on the two grid children, so the text column and image placeholder can
  swap visual sides at the `md:` breakpoint. The text stays first in DOM
  order regardless of `textPosition`, so source order / SEO / accessibility
  don't change — only the visual position does.
- `align` is passed straight through to `Heading`'s existing `align` prop.
  `Text` and the button wrapper don't have their own alignment prop, so the
  outer text-column `<div>` gets conditional wrapper classes
  (`items-center text-center` vs `items-start text-left`) to align the
  subtitle and CTA button consistently with the heading.

### `BenefitCard.astro` (molecule)

Adds a required `align: 'left' | 'center'` prop (no default, matching the
rest of this change). Controls `items-start`/`text-left` vs
`items-center`/`text-center` on the card's root `<div>`, and is passed
through to the card's internal `Heading`.

### `BenefitsSection.astro`

```ts
interface BenefitItem {
  title: string;
  description: string;
  icon?: string; // raw SVG string; falls back to the current placeholder icon if omitted
}

interface Props {
  heading: string;
  headingAlign: 'left' | 'center';
  cardAlign: 'left' | 'center';
  items: BenefitItem[];
}
```

- `items` replaces the hardcoded `benefits` array. Length is variable — not
  fixed to 3 — so an agent can pass 2, 4, or any other count of benefit
  cards.
- `icon` per item is optional; when omitted, the component falls back to
  the existing placeholder icon (`assets/icon-placeholder.svg?raw`) so
  callers that only care about text don't also have to supply icon markup.
- `headingAlign` passes through to the section's `Heading`. `cardAlign`
  passes through to every `BenefitCard` uniformly (no per-card override).

### `CaptureForm.astro`

```ts
interface Props {
  heading: string;
  subtitle: string;
  align: 'left' | 'center';
  ctaLabel: string; // submit button text
}
```

- `heading`/`subtitle` replace the hardcoded "Déjanos tus datos" /
  "Te contactaremos con más información." text.
- `align` replaces the hardcoded `text-center` wrapper around the
  heading/subtitle block, and is passed through to `Heading`.
- `ctaLabel` replaces the hardcoded "Enviar" button text.
- Form fields, validation, and success/error messages are untouched.

### `src/pages/index.astro`

Updated to pass all new required props explicitly, using the current
placeholder copy and layout as values:

```astro
<Hero
  title="Título principal de tu producto o servicio"
  subtitle="Subtítulo de apoyo que explica en una frase el valor de lo que ofreces."
  ctaLabel="Comenzar ahora"
  align="left"
  textPosition="left"
/>
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
<CaptureForm
  heading="Déjanos tus datos"
  subtitle="Te contactaremos con más información."
  align="center"
  ctaLabel="Enviar"
/>
```

### Documentation

`.agent/COMPONENTS.md` is updated: the "No props" lines for `Hero`,
`BenefitsSection`, and `CaptureForm` are replaced with prop tables matching
the interfaces above, and `BenefitCard`'s prop table gains the new `align`
row.

## TypeScript notes

`.agent/CONTEXT.md` documents a strict-mode gotcha: destructuring
`Astro.props` and then indexing a lookup object with a destructured field
(e.g. `sizes[size]`) can infer `any` unless the destructuring pattern is
annotated with `: Props`. Any new `align`/`textPosition`/`headingAlign`/
`cardAlign` lookup-style class maps in `Hero.astro`, `BenefitCard.astro`,
`BenefitsSection.astro`, and `CaptureForm.astro` must use the
`const { ... }: Props = Astro.props;` annotation pattern, matching
`Heading.astro`.

## Testing

No test framework in this project (by design). Verification bar, per
`.agent/CONTEXT.md`:
- `npm run build` succeeds
- `npm run check` reports 0 errors/warnings/hints
- Manual browser check: the page renders identically to today with the
  `index.astro` prop values above, and (spot check) passing
  `textPosition="right"`, `align="center"`, and a 2-item `items` array to
  each component visibly changes layout/content as expected.
