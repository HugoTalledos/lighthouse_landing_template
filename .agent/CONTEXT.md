# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A white-label ("marca blanca") Astro landing page template with three sections — Hero, Beneficios, Formulario de captura — built with Atomic Design components. It's a starting point meant to be reused across client projects: all visible copy is generic Spanish placeholder text, and branding lives entirely in CSS custom properties so it can be swapped without touching markup or component logic.

## Commands

```bash
npm install
cp .env.example .env   # fill in PUBLIC_API_URL, PUBLIC_API_KEY, PUBLIC_PLATFORM_NAME
npm run dev            # dev server at http://localhost:4321
npm run build          # production build to dist/
npm run preview        # serve the production build locally
npm run check          # type-check via astro check
```

There is no test framework in this project (by design — see "No automated tests" below) and no lint script. Verification is: `npm run build` succeeds, `npm run check` reports 0 errors/warnings/hints, and (for anything touching `CaptureForm`) a manual check in the browser.

`npm install` requires `legacy-peer-deps=true` (already set in `.npmrc`) because `@astrojs/tailwind@6.0.2`'s peer range doesn't officially list Astro 7, and this project pins Astro 7. Don't remove `.npmrc` without re-verifying `npm install` still resolves cleanly.

## Architecture

### Directory layout

```
src/
  assets/          # SVGs and other static assets imported by components (not URL-referenced)
  component/
    atoms/         # Button, Container, Heading, Input, Label, Text
    molecules/     # BenefitCard, FormField, Logo
    organisms/     # Hero, BenefitsSection, CaptureForm (+ CaptureForm.client.ts)
  layouts/         # BaseLayout.astro
  pages/           # index.astro — composes Hero + BenefitsSection + CaptureForm
  styles/          # global.css — Tailwind directives + design-token CSS variables
  utils/           # cn.ts — clsx + tailwind-merge class-combining helper
```

Note the directory is `src/component` (singular), not `src/components` — this is intentional, keep it consistent when adding files.

### Atomic Design dependency direction

Dependencies only flow one way: **atoms → molecules → organisms → pages**. Atoms don't import other components (only `cn.ts` where needed). Molecules import only atoms. Organisms import only atoms + molecules (+ local assets). Don't introduce a reverse or sibling-level import (e.g., an atom importing a molecule, or an organism reaching into another organism).

### Design tokens (white-label mechanism)

All brand colors/typography are CSS custom properties in `src/styles/global.css` (`--color-primary`, `--color-primary-foreground`, `--color-secondary`, `--color-bg`, `--color-bg-muted`, `--color-text`, `--color-text-muted`, `--font-sans`). Components reference them via Tailwind arbitrary-value classes, e.g. `bg-[var(--color-primary)]`. To re-skin the template for a project, edit `:root` in `global.css` — don't hardcode colors directly in component markup.

### Data-driven composition (`src/data/page.json`)

`src/pages/index.astro` statically imports `../data/page.json` (a plain ESM
JSON import, resolved at build time by Vite/Astro — no fetch, no SSR). In the
real pipeline, `lighthouse_back`'s `LandingBuilderService.build()` writes this
exact path (via `page_renderer.py`) *before* invoking `astro build`, so the
import always sees the brief-driven content for that build. The file
committed in this repo (Task 2 of
`lighthouse_back/docs/superpowers/plans/2026-07-17-landing-template-data-wiring.md`)
is only a fixture so `npm run dev`/`npm run check` work standalone.

`index.astro` only consumes the `hero` and `features` section types (by
`type` discriminant) — any other section type present in `page.json` is
silently ignored, and `theme.primary_color`/`secondary_color`/`font_family`
are regex-validated before being interpolated into an inline `<style>`
override in `BaseLayout`, since this content originates from an LLM and ends
up in HTML served to real visitors.

`theme.logo_text`/`theme.logo_icon` (added to this repo's `page.json` fixture
alongside the pre-existing, still-unused `theme.logo_url`) feed `Logo.astro`
via `Hero`'s `logoText`/`logoIcon` props — `logo_icon` is a raw SVG string
injected with `set:html`, unsanitized, same trust model as
`FeatureItem.icon` in `BenefitsSection`. Unlike the theme colors, these two
aren't regex-validated before reaching the DOM; if that becomes a real
concern, apply the same kind of allowlist validation used for the theme
colors before this goes to production with untrusted `page.json` input. This
addition is fixture/template-side only — verify `lighthouse_back`'s
`page_renderer.py` actually populates `logo_text`/`logo_icon` before
depending on them in the real pipeline.

`Hero.imageUrl`/`ctaHref` are also optional props, read from
`HeroSection.image_url`/`cta_url` in `page.json`. `ctaHref` was previously
documented as fixed/non-configurable to prevent an agent from accidentally
breaking the anchor link to `CaptureForm`'s `id="formulario-captura"`; it's
now optional with that same anchor as the default, so existing callers
(including `index.astro` when `cta_url` is `null`) are unaffected, and only
an explicit non-null `cta_url` overrides it. `image_url` is interpolated
into an `<img src>` unsanitized — same trust model as the fields above.

### Class-merging convention

`src/utils/cn.ts` wraps `clsx` + `tailwind-merge` for combining a component's own classes with a caller-supplied `class` prop (with proper Tailwind conflict resolution). Currently only `Button.astro` uses it; the other atoms (`Container`, `Label`, `Input`, `Text`, `Heading`) concatenate classes with template literals (`` `${...} ${className ?? ''}` ``) instead. This is inconsistent but intentional-as-shipped — if you need real override/dedup behavior on one of those atoms (not just appending), switch it to `cn()` rather than assuming the template-literal version already merges correctly.

### TypeScript strict mode gotchas

`tsconfig.json` extends `astro/tsconfigs/strict`. Two non-obvious things that came up while building this template:

- **Destructuring `Astro.props` with a lookup-object index can infer `any`.** `Heading.astro` indexes `sizes[size]` / `aligns[align]` from destructured props; without help, `size`/`align` get typed `any` under strict mode (`ts(7053)`). Fix used: annotate the destructuring pattern itself, `const { ... }: Props = Astro.props;` — not a blanket `Astro.props as Props` cast on the source, which silences errors instead of fixing the actual narrowing. Not every atom needs this (`Text.astro`'s near-identical pattern doesn't hit the bug) — only add the annotation where `astro check` actually reports the error.
- **`typescript` is pinned to `^6.0.3`, not latest.** `@astrojs/check@0.9.9` crashes (`Cannot read properties of undefined (reading 'fileExists')`) under TypeScript 7. If `npm install` ever bumps `typescript` past this range, `astro check` will silently start failing — don't attribute that to "environment issues" without checking the installed version first.

### CaptureForm: client-side logic lives in a sibling `.ts` file

`CaptureForm.astro`'s `<script>` tag only contains `import './CaptureForm.client.ts';` — all DOM/fetch logic lives in `CaptureForm.client.ts` next to it, not inline in the `.astro` file. This is the established pattern for any organism that needs non-trivial client-side behavior: keep the `.astro` file to markup + a one-line script import, and put logic in a co-located `ComponentName.client.ts`.

Inside `CaptureForm.client.ts`:
- DOM lookups are narrowed with `instanceof` guards (`form instanceof HTMLFormElement`, etc.), not TypeScript casts or `@ts-nocheck` — `document.querySelector` returns `Element | null`, and silencing the type checker previously masked 8 real null/type errors here. Keep using `instanceof` guards for any new DOM access in this file.
- Validation is generic over every `[required]` field (loops `form.querySelectorAll('[required]')`), with one field-specific branch for `celular` (must match `/^3\d{9}$/` — 10 digits, starts with 3). The `celular` input also strips non-digit characters on every `input` event.
- On successful validation, it `fetch`es `import.meta.env.PUBLIC_API_URL` with `POST`, header `x-api-key: import.meta.env.PUBLIC_API_KEY`, and a JSON body `{ email, phone, name, platform: import.meta.env.PUBLIC_PLATFORM_NAME }`. The submit button is disabled with "Enviando..." text during the request. On success: success message shown, form reset. On failure (network error or non-OK response): generic error message shown, form values kept for retry.
- `PUBLIC_`-prefixed env vars are exposed in the client JS bundle by Astro/Vite — the API key is visible to anyone who inspects the site. This is inherent to a fully client-side form with no intermediary backend of its own; it's a known, accepted tradeoff here, not a bug to fix.

### No automated tests

There is deliberately no Vitest/Playwright/etc. in this project — it's pure markup/styling with a small amount of DOM logic, and introducing a test framework was explicitly out of scope for the template. Treat `npm run build` + `npm run check` + a manual browser check (for `CaptureForm` specifically: submit with empty fields, invalid `celular`, and a full valid submission against a real or mocked `PUBLIC_API_URL`) as the verification bar for changes here.
