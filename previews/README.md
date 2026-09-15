# Previews

Standalone HTML for looking at the gradient artwork outside the site. Every file
is self-contained — the Lottie player and the animation data are inlined — so
they open straight from the filesystem with no server and no network.

Nothing here ships. The folder is not under `public/`, so Next never serves it
and it adds nothing to the bundle. Everything is generated, so it can be deleted
and rebuilt at any time.

| file | what it shows | rebuild with |
|---|---|---|
| `gradient-frame-picker.html` | Every brand at ten frames, cropped exactly as the cards crop them. Use it to pick which frame a still is captured from. | `node scripts/frame-picker.mjs` |
| `gradient-preview-pura.html` | The Pura artwork playing full-window. | `node scripts/brand-preview.mjs pura` |
| `gradient-preview-adib.html` | The ADIB recolour playing full-window. | `node scripts/brand-preview.mjs adib` |
| `gradient-preview-clientele.html` | The Clientele recolour playing full-window. | `node scripts/brand-preview.mjs clientele` |
| `gradient-preview-nedbank.html` | The Nedbank recolour playing full-window. | `node scripts/brand-preview.mjs nedbank` |
| `gradient-preview-absa.html` | The ABSA recolour playing full-window. | `node scripts/brand-preview.mjs absa` |

## Where the pieces live

| path | what it is |
|---|---|
| `public/animations/*.json` | The Lottie sources. `Gradient BG 3.json` is the original export; the rest are brand recolours of it. |
| `public/images/gradient-*.svg` | Single frames captured from those, used as card backgrounds so only one animation actually runs on the page. |
| `scripts/recolour-gradient.mjs` | Builds a brand variant by remapping the eight fill colours. Motion is never touched. |
| `scripts/capture-frame.mjs` | Freezes one frame as a standalone SVG. |
| `scripts/build-gradient-frames.mjs` | Captures every selectable frame and generates `lib/gradients.ts`. |
| `scripts/brand-preview.mjs` | Builds the full-window previews above. |
| `scripts/frame-picker.mjs` | Builds the frame picker above. |

## Two things that bite

- **Renderer must be `svg`.** Every layer carries a Gaussian Blur, and the canvas
  renderer silently ignores effects — the artwork comes out as hard-edged shapes.
- **The artwork is transparent.** It has no background layer, so whatever sits
  behind shows through; on a dark card that reads as black wedges. Hence the
  white ground on the previews and on the cards, and `xMidYMin slice` so the
  empty strip at the foot of the composition is cropped away rather than centred.
