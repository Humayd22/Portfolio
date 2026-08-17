# Portfolio — Theme Token Set (Alpha Ramps, Dark + Light)
# For Claude Code · Aug 2026 · mirrors the Pura Health primitive structure

Related: [[Atlas]]

---

## Approach

Monochrome, using the same primitive model as the Pura design system: a **black alpha ramp** and a **white alpha ramp** (opacity steps of 000000 and FFFFFF), plus one solid canvas per theme. Semantic tokens pick which alpha ramp they pull from, and the theme switch flips the ramp. Alpha means every surface, border and overlay composites over the canvas automatically, so almost nothing needs a hand-picked hex per theme.

Three layers:
1. **Canvas** (one solid colour per theme, the thing everything composites over).
2. **Alpha primitives** (black/white at opacity steps, mode-independent).
3. **Semantic tokens** (point at black-alpha in light, white-alpha in dark).

## 1. Alpha primitives (raw, never change) — matches Pura naming

```
black/050  = rgba(0,0,0,0.05)      white/050  = rgba(255,255,255,0.05)
black/100  = rgba(0,0,0,0.10)      white/100  = rgba(255,255,255,0.10)
black/200  = rgba(0,0,0,0.20)      white/200  = rgba(255,255,255,0.20)
black/300  = rgba(0,0,0,0.30)      white/300  = rgba(255,255,255,0.30)
black/400  = rgba(0,0,0,0.40)      white/400  = rgba(255,255,255,0.40)
black/500  = rgba(0,0,0,0.50)      white/500  = rgba(255,255,255,0.50)
black/600  = rgba(0,0,0,0.60)      white/600  = rgba(255,255,255,0.60)
black/700  = rgba(0,0,0,0.70)      white/700  = rgba(255,255,255,0.70)
black/800  = rgba(0,0,0,0.80)      white/800  = rgba(255,255,255,0.80)
black/900  = rgba(0,0,0,0.90)      white/900  = rgba(255,255,255,0.90)
black/1000 = #000000               white/1000 = #FFFFFF
```

## 2. Canvas (solid, one per theme)

```
Dark:  --canvas = #0A0A0A   (near-black)
Light: --canvas = #FFFFFF   (pure white)
```

## 3. Semantic tokens

Dark pulls from **white-alpha** over a black canvas. Light pulls from **black-alpha** over a white canvas. Same step numbers, opposite ramp.

| Token | Dark (white-alpha on black) | Light (black-alpha on white) | Used for |
|---|---|---|---|
| `--bg` | `--canvas` (#0A0A0A) | `black/050` (subtle grey) | Page background |
| `--surface` | `white/100` | `--canvas` (#FFF) | Bento cards, panels |
| `--surface-hover` | `white/200` | `black/050` | Card hover |
| `--border` | `white/100` | `black/100` | Hairlines, card edges |
| `--text-primary` | `white/1000` | `black/1000` | Headings, key text |
| `--text-secondary` | `white/500` | `black/500` | Labels, supporting |
| `--text-muted` | `white/400` | `black/400` | Timestamps, hints |
| `--emphasis` | `white/1000` | `black/1000` | The "Design" word, active states |

Why this is clean: the surface/hover/border tokens are all alpha, so they sit correctly on the canvas without you choosing a solid grey. In light mode the bg is a faint `black/050` grey and cards are pure white, which gives the card separation the dark theme gets for free. Same trick, inverted.

## Name glow (dark-mode signature)
```
--name-glow: 0 0 80px rgba(255,255,255,0.35);   /* dark */
[data-theme="light"] { --name-glow: none; }      /* light: crisp solid type */
```
Glow is a dark-mode flourish. In light, render the name as solid `--text-primary`. A dark blur on white looks muddy.

## Implementation (for Claude Code)
- Define the two alpha ramps and both canvases as raw CSS custom properties (they never change).
- Map the semantic tokens on `:root` (dark, using white-alpha) and override under `[data-theme="light"]` (using black-alpha). Only the semantic layer flips.
- Switcher toggles `data-theme` on `<html>`, persists to `localStorage`, honours `prefers-color-scheme` on first visit (default dark).
- Zero hardcoded colour in components. Everything reads `--bg`, `--surface`, `--text-*`, `--border`, `--emphasis`.
- Elevation: in light mode, cards can add a soft `rgba(0,0,0,0.05)` shadow if the border alone feels flat. In dark, the lighter alpha surface is the elevation.

## Accessibility
- Alpha composited over the fixed canvas gives predictable contrast here (the canvas is always pure black or pure white). `--text-primary` and `--text-secondary` both pass AA on their surfaces. Keep `--text-muted` off body copy.
- Toggle needs an accessible label and keyboard focus.
