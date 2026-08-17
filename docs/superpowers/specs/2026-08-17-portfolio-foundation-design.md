# Portfolio — Foundation Slice (Design)

Date: 2026-08-17
Status: Approved for planning
Source material: `Portfolio - Theme Tokens.md`

---

## Context

A personal portfolio for a design + engineering hybrid, aimed at hiring managers. The
codebase is itself part of the pitch, so the implementation is held to the same standard
as the design work it presents.

One artifact exists today: a theme token specification defining a monochrome system built
from a black alpha ramp and a white alpha ramp over a solid canvas per theme. Written case
studies and shipped products exist as content but are added later, incrementally.

## Scope

This slice is **foundation only**:

- Next.js + TypeScript scaffold
- The full token layer from the token spec
- Typography layer
- Theme switcher with no-flash behaviour
- A temporary page proving the tokens render correctly in both themes

Explicitly **not** in this slice: the real homepage, the bento grid, case study routes,
work index, about, contact, analytics, SEO metadata beyond Next.js defaults.

## Stack

- Next.js (App Router) + TypeScript
- CSS Custom Properties + CSS Modules — no Tailwind, no CSS-in-JS
- `next/font/google` for typography
- npm

CSS Modules over a utility framework because the token spec is precise and prescriptive.
Custom properties let the spec become the code with no translation layer, and the theme
flip stays a single selector override.

## File structure

```
app/
  layout.tsx              root html, font class, data-theme, no-flash script
  page.tsx                temporary token-proof page
  globals.css             imports the style layers in order
styles/
  primitives.css          alpha ramps + canvases (never change)
  semantic.css            :root (dark) + [data-theme="light"] overrides
  base.css                reset, body, base typography
lib/
  theme.ts                Theme type, storage key, resolve + apply helpers, no-flash script
components/
  ThemeToggle/
    ThemeToggle.tsx
    ThemeToggle.module.css
```

## Token layer

Three CSS files mirroring the three layers described in the token spec, each independently
readable and each with one job.

### `styles/primitives.css`

The raw material. Both alpha ramps at steps 050, 100, 200, 300, 400, 500, 600, 700, 800,
900, 1000, plus both canvases. Mode-independent — nothing in this file ever changes when
the theme flips.

```css
:root {
  --black-050: rgba(0, 0, 0, 0.05);
  /* … through --black-1000: #000000 */
  --white-050: rgba(255, 255, 255, 0.05);
  /* … through --white-1000: #FFFFFF */

  --canvas-dark: #0a0a0a;
  --canvas-light: #ffffff;
}
```

### `styles/semantic.css`

The only file that knows themes exist. Dark is the default on `:root` and pulls from the
white ramp; light overrides under `[data-theme="light"]` and pulls from the black ramp.
Same step numbers, opposite ramp.

| Token | Dark | Light |
|---|---|---|
| `--canvas` | `--canvas-dark` | `--canvas-light` |
| `--bg` | `--canvas` | `--black-050` |
| `--surface` | `--white-100` | `--canvas` |
| `--surface-hover` | `--white-200` | `--black-050` |
| `--border` | `--white-100` | `--black-100` |
| `--text-primary` | `--white-1000` | `--black-1000` |
| `--text-secondary` | `--white-500` | `--black-600` |
| `--text-muted` | `--white-400` | `--black-500` |
| `--emphasis` | `--white-1000` | `--black-1000` |
| `--name-glow` | `0 0 80px rgba(255,255,255,0.35)` | `none` |

Because surface, hover and border are all alpha, they composite over the canvas correctly
without hand-picking a grey per theme. In light mode the page background is a faint
`--black-050` and cards are pure white, which buys the card separation that dark mode gets
for free.

### Accessibility

`--text-primary` is pure black-on-canvas or white-on-canvas in both themes, so it clears AA
by a wide margin everywhere it's used. `--text-secondary` and `--text-muted` are not
symmetric, and mirroring the step number between ramps does **not** mirror the contrast:
equal alpha steps do not produce equal contrast against opposite canvases, because the dark
canvas is nearly black (`#0a0a0a`) while the light canvas the page background composites
against is a pale, near-white grey. Measured ratios:

- Dark `--text-secondary` (`--white-500` over `#0a0a0a`): **5.33:1** — passes AA (4.5:1)
- Light `--text-secondary` at the mirrored `--black-500`: **3.89:1** — fails AA
- Light `--text-secondary` at `--black-600` (what the token table above specifies): **5.55:1**
  — passes AA
- Dark `--text-muted` (`--white-400` over `#0a0a0a`): **3.77:1** — already above the 3:1 floor
  for large text / non-text use
- Light `--text-muted` at the mirrored `--black-400`: **2.81:1** — fails the 3:1 floor
- Light `--text-muted` at `--black-500` (what the token table above specifies): **3.89:1** —
  clears the floor while staying visibly subordinate to the light `--text-secondary` above it

This is why the light ramp runs one step deeper than dark for `--text-secondary` and
`--text-muted`: the ramps are not mirror images of each other, only the underlying alpha
primitives are shared.

### `styles/base.css`

Minimal reset, `box-sizing: border-box`, body wired to `--bg` / `--text-primary` /
`var(--font-sans)`, base type scale, and a visible focus-visible ring drawn from
`--emphasis`.

### Rule

No component names a colour or a font family. Every component reads `--bg`, `--surface`,
`--surface-hover`, `--border`, `--text-*`, `--emphasis`, `--font-sans`. Zero hardcoded
values outside `primitives.css`.

## Typography

Hanken Grotesk via `next/font/google`, self-hosted at build time:

```ts
import { Hanken_Grotesk } from "next/font/google";

const sans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
```

The generated class goes on `<html>` alongside `data-theme`, publishing `--font-sans` as a
real custom property so it composes with the colour tokens identically.

Rationale: Apercu Pro was the first choice but is a licensed Colophon face with no files
present on this machine and no license in hand. Hanken Grotesk is SIL OFL, structurally
close (geometric grotesque), and available as a variable font — so the full 100–900 range
arrives in one file and weight selection stays a styling decision rather than a loading
one. `next/font` self-hosts, eliminating the runtime request to Google and reserving font
metrics to prevent layout shift.

A fallback stack sits behind it permanently. `base.css` composes the two rather than
relying on `--font-sans` alone:

```css
:root {
  --font-sans-fallback: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Helvetica,
    Arial, sans-serif;
}

body {
  font-family: var(--font-sans), var(--font-sans-fallback);
}
```

## Theme switching

### `lib/theme.ts` — single source of truth

Exports:

- `type Theme = "dark" | "light"`
- `THEME_STORAGE_KEY` constant
- `DEFAULT_THEME = "dark"`
- `applyTheme(theme)` — sets `data-theme` on `document.documentElement` and persists to
  `localStorage`
- `NO_FLASH_SCRIPT` — the pre-paint script as a string, built from the constants above so
  the script and the component cannot drift apart

### No-flash script

Injected into `<head>` by `layout.tsx` via `dangerouslySetInnerHTML`, running before first
paint. Resolution order:

1. `localStorage[THEME_STORAGE_KEY]` if it holds a valid theme
2. `prefers-color-scheme: light` → light
3. otherwise dark

It stamps `data-theme` on `<html>` synchronously. Without this, every reload in dark mode
flashes white. `<html>` carries `suppressHydrationWarning` because the script mutates the
attribute before React hydrates.

### `ThemeToggle`

A client component. Reads the current attribute on mount into state, flips it on click,
calls `applyTheme`. Requirements:

- A real `<button>`, not a div
- `aria-label` naming the destination, updating with state ("Switch to light theme")
- Visible `:focus-visible` ring drawn from `--emphasis`
- Styled entirely from tokens

## Proof page

`app/page.tsx` is scaffolding, not the homepage. It exists to prove the ramps composite
correctly and is replaced wholesale when the real homepage is built. Contents:

- A name in `--text-primary` carrying `--name-glow`, demonstrating the glow appears in dark
  and vanishes in light
- One supporting line in `--text-secondary`
- A labelled chip per semantic token, each rendering its own value
- The theme toggle

## Verification

Automated:

- `npm run build` completes with no TypeScript errors
- Lint passes

Manual:

- Toggle flips both directions and the whole page responds
- Choice survives a reload
- No flash of white on hard refresh in dark mode
- A fresh browser profile honours the OS colour scheme preference
- All semantic tokens visibly correct in both themes
- Keyboard: toggle reachable by Tab, activates on Enter and Space, focus ring visible in
  both themes

## Decisions and non-goals

**No test framework in this slice.** The only logic worth testing is the theme resolver,
and standing up Playwright now costs more than it returns. Tests arrive when there is
behaviour to protect. Flagged deliberately, not overlooked.

**Dark is the default** when no stored preference and no OS signal exist, per the token
spec.

**`--text-muted` is kept off body copy** — it is for timestamps and hints only, per the
accessibility note in the token spec.
