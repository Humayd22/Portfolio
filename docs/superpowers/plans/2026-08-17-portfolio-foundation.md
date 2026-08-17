# Portfolio Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up a Next.js + TypeScript portfolio scaffold carrying the complete monochrome alpha-ramp token system, Hanken Grotesk typography, and a no-flash dark/light theme switcher.

**Architecture:** Three layered CSS files express the token system — raw alpha primitives, a semantic layer that is the only file aware of themes, and a base layer. Components read CSS custom properties exclusively and never name a colour or font family. Theme state lives in a single `data-theme` attribute on `<html>`, stamped before first paint by an inline script and flipped at runtime by one client component. `lib/theme.ts` is the single source of truth both the script and the component derive from.

**Tech Stack:** Next.js 16.3.1 (App Router), TypeScript, CSS Modules, `next/font/google`, npm. Node v22.17.1.

**Source spec:** `docs/superpowers/specs/2026-08-17-portfolio-foundation-design.md`

## Global Constraints

- **No Tailwind.** Styling is CSS Modules plus global custom properties only.
- **No hardcoded colour values outside `styles/primitives.css`.** Every other file reads `var(--token)`.
- **No component names a font family.** Everything reads `var(--font-sans)`.
- **Dark is the default theme** when no stored preference and no OS signal exist.
- **`--text-muted` is never used for body copy** — timestamps and hints only.
- **No test framework in this slice.** This is a deliberate decision recorded in the spec: the only logic worth testing is the theme resolver, and standing up Playwright costs more than it returns right now. Each task below therefore substitutes an explicit **verification cycle** — a build or lint run plus a stated, observable browser expectation — for the usual red/green test cycle. Do not add Jest, Vitest, or Playwright as part of this plan.
- **Every task ends with a commit.**
- **The repo already exists** on branch `main` with one commit. Do not re-initialise it.
- **The name "Humayd Mohamed" and the tagline are placeholders** in this slice; they are replaced when the real homepage is built.

---

### Task 1: Scaffold the Next.js application

The working directory already contains `Portfolio - Theme Tokens.md`, `docs/`, `.gitignore`, and `.git/`. `create-next-app` refuses to scaffold into a directory containing files it does not recognise, so scaffold into a temporary directory and move the output in. This is why the task is shaped this way — do not try to run `create-next-app .`.

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `next-env.d.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `public/`
- Modify: `.gitignore` (only if the generated one adds entries the existing one lacks)

**Interfaces:**
- Consumes: nothing.
- Produces: a working Next.js App Router project at the repo root with the `@/*` import alias resolving to the repo root, `npm run dev` and `npm run build` scripts, and no Tailwind dependency.

- [ ] **Step 1: Scaffold into a temporary directory**

```bash
cd /Users/humayd.mohamed/Desktop/Portfolio
npx --yes create-next-app@16.3.1 /tmp/portfolio-scaffold \
  --typescript \
  --app \
  --eslint \
  --no-tailwind \
  --no-src-dir \
  --no-react-compiler \
  --empty \
  --import-alias "@/*" \
  --use-npm \
  --disable-git \
  --skip-install
```

`--empty` gives a minimal `page.tsx` with no boilerplate SVGs or demo CSS, which is what we want since Task 5 replaces that page anyway. `--skip-install` keeps this step fast; install happens in Step 3 at the real location.

If the CLI rejects `--no-tailwind` or `--no-react-compiler`, drop the offending flag and answer the interactive prompt with "No". Step 4 verifies the outcome regardless of how it was reached.

- [ ] **Step 2: Move the scaffold into the repo root**

```bash
cd /Users/humayd.mohamed/Desktop/Portfolio
rsync -a --exclude '.git' /tmp/portfolio-scaffold/ ./
rm -rf /tmp/portfolio-scaffold
```

`rsync` merges rather than replaces, so the existing `Portfolio - Theme Tokens.md` and `docs/` survive. The generated `.gitignore` overwrites the existing one — that is fine, it covers the same ground.

- [ ] **Step 3: Install dependencies**

```bash
npm install
```

- [ ] **Step 4: Verify the scaffold**

Run:

```bash
grep -c tailwind package.json; npm run build
```

Expected: `grep -c` prints `0` (no Tailwind dependency). `npm run build` completes with "Compiled successfully" and no TypeScript errors.

If `grep` prints anything other than `0`, remove Tailwind before continuing:

```bash
npm uninstall tailwindcss @tailwindcss/postcss
rm -f postcss.config.mjs
```

- [ ] **Step 5: Verify the dev server renders**

```bash
npm run dev
```

Open `http://localhost:3000`. Expected: a blank or near-blank page renders with no console errors. Stop the server with Ctrl-C.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app router project with TypeScript"
```

---

### Task 2: Build the three-layer token system

**Files:**
- Create: `styles/primitives.css`, `styles/semantic.css`, `styles/base.css`
- Modify: `app/globals.css` (replace entire contents)

**Interfaces:**
- Consumes: the scaffold from Task 1.
- Produces: these CSS custom properties, globally available to every later task —
  `--bg`, `--surface`, `--surface-hover`, `--border`, `--text-primary`,
  `--text-secondary`, `--text-muted`, `--emphasis`, `--name-glow`,
  `--font-sans-fallback`. Theme is selected by the attribute `data-theme` on
  `<html>` with values `"dark"` (the `:root` default) and `"light"`.

- [ ] **Step 1: Write the alpha primitives**

Create `styles/primitives.css`. These values are copied verbatim from the token spec and never change:

```css
/*
 * Layer 1 — raw alpha primitives and canvases.
 * Mode-independent. Nothing here changes when the theme flips.
 * This is the only file in the project allowed to contain literal colour values.
 */

:root {
  /* Black alpha ramp — used by the light theme */
  --black-050: rgba(0, 0, 0, 0.05);
  --black-100: rgba(0, 0, 0, 0.1);
  --black-200: rgba(0, 0, 0, 0.2);
  --black-300: rgba(0, 0, 0, 0.3);
  --black-400: rgba(0, 0, 0, 0.4);
  --black-500: rgba(0, 0, 0, 0.5);
  --black-600: rgba(0, 0, 0, 0.6);
  --black-700: rgba(0, 0, 0, 0.7);
  --black-800: rgba(0, 0, 0, 0.8);
  --black-900: rgba(0, 0, 0, 0.9);
  --black-1000: #000000;

  /* White alpha ramp — used by the dark theme */
  --white-050: rgba(255, 255, 255, 0.05);
  --white-100: rgba(255, 255, 255, 0.1);
  --white-200: rgba(255, 255, 255, 0.2);
  --white-300: rgba(255, 255, 255, 0.3);
  --white-400: rgba(255, 255, 255, 0.4);
  --white-500: rgba(255, 255, 255, 0.5);
  --white-600: rgba(255, 255, 255, 0.6);
  --white-700: rgba(255, 255, 255, 0.7);
  --white-800: rgba(255, 255, 255, 0.8);
  --white-900: rgba(255, 255, 255, 0.9);
  --white-1000: #ffffff;

  /* Canvases — the solid ground every alpha value composites over */
  --canvas-dark: #0a0a0a;
  --canvas-light: #ffffff;
}
```

- [ ] **Step 2: Write the semantic layer**

Create `styles/semantic.css`. This is the only file in the project that knows themes exist:

```css
/*
 * Layer 2 — semantic tokens.
 * Dark is the default and pulls from the white ramp.
 * Light overrides and pulls from the black ramp.
 * Same step numbers, opposite ramp.
 */

:root {
  --canvas: var(--canvas-dark);

  --bg: var(--canvas);
  --surface: var(--white-100);
  --surface-hover: var(--white-200);
  --border: var(--white-100);

  --text-primary: var(--white-1000);
  --text-secondary: var(--white-500);
  --text-muted: var(--white-400);

  --emphasis: var(--white-1000);

  --name-glow: 0 0 80px rgba(255, 255, 255, 0.35);
}

[data-theme="light"] {
  --canvas: var(--canvas-light);

  /* A faint grey page with pure-white cards buys the separation
     dark mode gets for free from its lighter alpha surface. */
  --bg: var(--black-050);
  --surface: var(--canvas);
  --surface-hover: var(--black-050);
  --border: var(--black-100);

  --text-primary: var(--black-1000);
  --text-secondary: var(--black-500);
  --text-muted: var(--black-400);

  --emphasis: var(--black-1000);

  /* A dark blur on white reads as mud. Light mode uses crisp solid type. */
  --name-glow: none;
}
```

- [ ] **Step 3: Write the base layer**

Create `styles/base.css`:

```css
/*
 * Layer 3 — reset and base element styling.
 * Reads only from the semantic layer.
 */

:root {
  --font-sans-fallback: ui-sans-serif, system-ui, -apple-system, "Segoe UI",
    Helvetica, Arial, sans-serif;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

* {
  margin: 0;
}

html {
  -webkit-text-size-adjust: 100%;
}

body {
  min-height: 100vh;
  background-color: var(--bg);
  color: var(--text-primary);
  font-family: var(--font-sans), var(--font-sans-fallback);
  font-size: 1rem;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

button {
  font: inherit;
  color: inherit;
}

a {
  color: inherit;
  text-decoration: none;
}

:focus-visible {
  outline: 2px solid var(--emphasis);
  outline-offset: 2px;
}
```

`--font-sans` is not defined yet — Task 3 supplies it via `next/font`. Until then the fallback stack carries the page, which is exactly the resilience this pattern is for.

- [ ] **Step 4: Wire the layers together**

Replace the entire contents of `app/globals.css` with:

```css
@import "../styles/primitives.css";
@import "../styles/semantic.css";
@import "../styles/base.css";
```

Order matters: primitives must be defined before the semantic layer references them.

- [ ] **Step 5: Verify the tokens compile and apply**

Run:

```bash
npm run build
```

Expected: "Compiled successfully", no CSS or TypeScript errors.

Then run `npm run dev` and open `http://localhost:3000`. Expected: the page background is now near-black (`#0a0a0a`) and any text is white — dark is the `:root` default and needs no attribute to be active. Stop the server.

- [ ] **Step 6: Commit**

```bash
git add styles app/globals.css
git commit -m "feat: add three-layer monochrome token system"
```

---

### Task 3: Typography and the no-flash theme bootstrap

**Files:**
- Create: `lib/theme.ts`
- Modify: `app/layout.tsx` (replace entire contents)

**Interfaces:**
- Consumes: the semantic tokens from Task 2.
- Produces, from `lib/theme.ts`:
  - `type Theme = "dark" | "light"`
  - `const THEME_STORAGE_KEY: string`
  - `const THEME_ATTRIBUTE: string`
  - `const DEFAULT_THEME: Theme`
  - `function isTheme(value: unknown): value is Theme`
  - `function getCurrentTheme(): Theme`
  - `function applyTheme(theme: Theme): void`
  - `const NO_FLASH_SCRIPT: string`
- Also produces the `--font-sans` custom property, published on `<html>`.

- [ ] **Step 1: Write the theme module**

Create `lib/theme.ts`. Everything about theming derives from this file so the inline script and the React component cannot drift apart:

```ts
export type Theme = "dark" | "light";

/** localStorage key holding the visitor's explicit choice. */
export const THEME_STORAGE_KEY = "portfolio-theme";

/** Attribute on <html> that the semantic CSS layer keys off. */
export const THEME_ATTRIBUTE = "data-theme";

/** Used when there is no stored choice and no OS signal. */
export const DEFAULT_THEME: Theme = "dark";

export function isTheme(value: unknown): value is Theme {
  return value === "dark" || value === "light";
}

/** Reads the theme currently painted on the document. */
export function getCurrentTheme(): Theme {
  const attribute = document.documentElement.getAttribute(THEME_ATTRIBUTE);
  return isTheme(attribute) ? attribute : DEFAULT_THEME;
}

/** Paints a theme and remembers it. */
export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be unavailable (private mode, blocked cookies).
    // The theme still applies for this session; only persistence is lost.
  }
}

/**
 * Runs synchronously in <head> before first paint.
 * Without it, every reload in dark mode flashes white while React boots.
 * Written as a string because it must execute before hydration.
 */
export const NO_FLASH_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("${THEME_STORAGE_KEY}");
    var theme =
      stored === "dark" || stored === "light"
        ? stored
        : window.matchMedia("(prefers-color-scheme: light)").matches
          ? "light"
          : "${DEFAULT_THEME}";
    document.documentElement.setAttribute("${THEME_ATTRIBUTE}", theme);
  } catch (e) {
    document.documentElement.setAttribute("${THEME_ATTRIBUTE}", "${DEFAULT_THEME}");
  }
})();
`;
```

- [ ] **Step 2: Rewrite the root layout**

Replace the entire contents of `app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import { DEFAULT_THEME, NO_FLASH_SCRIPT } from "@/lib/theme";
import "./globals.css";

// Variable font: the full 100-900 range arrives in one self-hosted file,
// so weight selection stays a styling decision, not a loading one.
const sans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Humayd Mohamed",
  description: "Design and engineering portfolio.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme={DEFAULT_THEME}
      className={sans.variable}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

`suppressHydrationWarning` is required: the inline script mutates `data-theme` before React hydrates, so the server and client markup legitimately differ on that attribute.

- [ ] **Step 3: Verify the build**

Run:

```bash
npm run build
```

Expected: "Compiled successfully", no TypeScript errors. The build downloads and self-hosts the Hanken Grotesk files — if the machine is offline this step fails, and that is the only step in the plan requiring network access.

- [ ] **Step 4: Verify the font is applied**

Run `npm run dev`, open `http://localhost:3000`, and inspect `<body>` in DevTools. Expected: computed `font-family` resolves to a Hanken Grotesk font, not the system fallback.

- [ ] **Step 5: Verify no-flash behaviour**

With the dev server running:

1. In DevTools Console, run `localStorage.setItem("portfolio-theme", "dark")` and reload.
   Expected: the page is dark from the very first frame — no white flash at any point.
2. Run `localStorage.setItem("portfolio-theme", "light")` and reload.
   Expected: the page renders light immediately, and `<html>` carries `data-theme="light"`.
3. Run `localStorage.removeItem("portfolio-theme")`, then in DevTools set the rendering
   emulation to `prefers-color-scheme: light` and reload.
   Expected: `data-theme="light"`.
4. Set emulation to `prefers-color-scheme: dark` and reload.
   Expected: `data-theme="dark"`.
5. Confirm the browser console shows no hydration mismatch warning.

Reset with `localStorage.removeItem("portfolio-theme")` and stop the server.

- [ ] **Step 6: Commit**

```bash
git add lib/theme.ts app/layout.tsx
git commit -m "feat: add Hanken Grotesk and no-flash theme bootstrap"
```

---

### Task 4: Theme toggle component

**Files:**
- Create: `components/ThemeToggle/ThemeToggle.tsx`, `components/ThemeToggle/ThemeToggle.module.css`

**Interfaces:**
- Consumes: `applyTheme`, `getCurrentTheme`, and `type Theme` from `@/lib/theme` (Task 3); the semantic tokens from Task 2.
- Produces: a named export `ThemeToggle` — `function ThemeToggle(): JSX.Element`, taking no props.

- [ ] **Step 1: Write the component**

Create `components/ThemeToggle/ThemeToggle.tsx`:

```tsx
"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_THEME, applyTheme, getCurrentTheme, type Theme } from "@/lib/theme";
import styles from "./ThemeToggle.module.css";

// The pre-paint script in the root layout sets data-theme before React
// hydrates, so the server cannot know the real value. useSyncExternalStore
// is built for this: it reads the live DOM on the client while rendering
// the server's default during SSR, with no state write on mount.
function subscribe(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function getServerSnapshot(): Theme {
  return DEFAULT_THEME;
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getCurrentTheme, getServerSnapshot);

  // applyTheme mutates data-theme; the observer fires and re-renders.
  // The DOM attribute is the single source of truth — no second copy
  // of the state exists to fall out of sync.
  function toggle() {
    applyTheme(theme === "dark" ? "light" : "dark");
  }

  const destination = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggle}
      aria-label={`Switch to ${destination} theme`}
    >
      <span aria-hidden="true">{theme === "dark" ? "Dark" : "Light"}</span>
    </button>
  );
}
```

- [ ] **Step 2: Write the component styles**

Create `components/ThemeToggle/ThemeToggle.module.css`. Every value is a token — no literal colours:

```css
.toggle {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 0.875rem;
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--text-secondary);
  font-size: 0.875rem;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition:
    background-color 150ms ease,
    color 150ms ease;
}

.toggle:hover {
  background-color: var(--surface-hover);
  color: var(--text-primary);
}

.toggle:focus-visible {
  outline: 2px solid var(--emphasis);
  outline-offset: 2px;
}
```

- [ ] **Step 3: Verify the build**

Run:

```bash
npm run build && npm run lint
```

(`next lint` was removed in Next 16 — the generated `lint` script runs ESLint directly. If no `lint` script exists in `package.json`, use `npx eslint .` instead.)

Expected: build compiles successfully; lint reports no errors. The component is not yet rendered anywhere — Task 5 mounts it. This step only proves it compiles and type-checks.

- [ ] **Step 4: Commit**

```bash
git add components/ThemeToggle
git commit -m "feat: add accessible theme toggle component"
```

---

### Task 5: Token proof page and full verification

This page is scaffolding, not the homepage. It exists to prove the ramps composite correctly in both themes, and it gets replaced wholesale when the real homepage is built.

**Files:**
- Modify: `app/page.tsx` (replace entire contents)
- Create: `app/page.module.css`

**Interfaces:**
- Consumes: `ThemeToggle` from Task 4; every semantic token from Task 2; `--name-glow` in particular.
- Produces: nothing later tasks depend on.

- [ ] **Step 1: Write the proof page**

Replace the entire contents of `app/page.tsx` with:

```tsx
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import styles from "./page.module.css";

// Every semantic token, so a glance confirms each one composites
// correctly over the canvas in both themes.
const SEMANTIC_TOKENS = [
  "--bg",
  "--surface",
  "--surface-hover",
  "--border",
  "--text-primary",
  "--text-secondary",
  "--text-muted",
  "--emphasis",
] as const;

export default function Home() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.name}>Humayd Mohamed</h1>
        <p className={styles.tagline}>Design and engineering.</p>
        <ThemeToggle />
      </header>

      <section className={styles.swatches} aria-label="Semantic token swatches">
        {SEMANTIC_TOKENS.map((token) => (
          <div key={token} className={styles.swatch}>
            <div
              className={styles.chip}
              style={{ backgroundColor: `var(${token})` }}
              aria-hidden="true"
            />
            <code className={styles.label}>{token}</code>
          </div>
        ))}
      </section>
    </main>
  );
}
```

The inline `style` here is the one deliberate exception to the no-inline-styles habit: the swatch must render the token it names, so the value has to be computed from data.

- [ ] **Step 2: Write the page styles**

Create `app/page.module.css`:

```css
.main {
  max-width: 56rem;
  margin: 0 auto;
  padding: 6rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 5rem;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
}

.name {
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.05;
  color: var(--text-primary);
  /* Dark-mode signature; resolves to `none` under [data-theme="light"]. */
  text-shadow: var(--name-glow);
}

.tagline {
  font-size: 1.125rem;
  color: var(--text-secondary);
}

.swatches {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  gap: 1rem;
}

.swatch {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
}

.chip {
  height: 3rem;
  border: 1px solid var(--border);
  border-radius: 0.375rem;
}

.label {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}
```

- [ ] **Step 3: Verify the build and lint**

Run:

```bash
npm run build && npm run lint
```

Expected: "Compiled successfully" with no TypeScript errors; lint reports no errors.

- [ ] **Step 4: Verify both themes render correctly**

Run `npm run dev` and open `http://localhost:3000`. Check each of these:

1. **Dark default:** page background near-black, name in white carrying a soft glow, eight swatch cards on a slightly lighter alpha surface with visible hairline borders.
2. **Toggle to light:** click the toggle. Background becomes a faint grey, cards become pure white and separate clearly from the page, the name loses its glow and renders as crisp solid black, all text stays legible.
3. **Toggle back to dark:** everything returns to state 1.
4. **Persistence:** with light active, reload. Expected: the page comes back light, with no dark flash.
5. **No flash:** with dark active, hard-reload (Cmd-Shift-R). Expected: no white flash at any point.
6. **Token correctness:** each swatch chip visibly matches the token it names in both themes — no chip is invisible or identical to a neighbour it should differ from.

- [ ] **Step 5: Verify keyboard accessibility**

Still in the browser:

1. Press Tab until the toggle is focused. Expected: a clearly visible focus ring.
2. Press Enter. Expected: the theme flips.
3. Press Space. Expected: the theme flips back.
4. Inspect the button. Expected: `aria-label` reads "Switch to light theme" while dark is
   active, and "Switch to dark theme" while light is active.
5. Confirm the focus ring is visible in **both** themes.

Stop the server.

- [ ] **Step 6: Verify no hardcoded colours leaked**

Run:

```bash
grep -rniE "#[0-9a-f]{3,8}\b|rgba?\(" --include="*.css" --include="*.tsx" --include="*.ts" app components lib styles | grep -v "styles/primitives.css"
```

Expected: exactly one match — the `--name-glow` value in `styles/semantic.css`. That one is intentional: it is a shadow definition, not a surface colour, and the spec defines it literally. Any other match is a violation of the global constraint and must be replaced with a token.

- [ ] **Step 7: Commit**

```bash
git add app/page.tsx app/page.module.css
git commit -m "feat: add token proof page demonstrating both themes"
```

---

## Definition of done

- `npm run build` completes with no TypeScript errors and `npm run lint` reports none.
- Dark renders by default; light renders under `data-theme="light"`.
- The toggle flips both directions, persists across reloads, and is fully keyboard operable with a visible focus ring in both themes.
- A fresh profile with no stored preference honours the OS colour scheme.
- No white flash on hard reload in dark mode.
- No hardcoded colour outside `styles/primitives.css` and the one `--name-glow` value.
- Hanken Grotesk is applied and self-hosted.
