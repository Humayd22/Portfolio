/*
 * Builds a brand variant of the gradient background.
 *
 * Motion, geometry, scale and blur are left untouched — only the eight `fl`
 * fill colours are remapped. That separation is the whole point: every brand
 * gets byte-identical movement, and the file stays a faithful export rather
 * than something hand-edited.
 *
 * Each source colour keeps its LIGHTNESS and takes the brand's HUE. The blur
 * radii and layer opacities in the file were tuned against the original
 * light/dark relationships, so preserving lightness is what keeps the wash
 * looking like the reference instead of turning muddy.
 *
 *   node scripts/recolour-gradient.mjs <brand>
 */
import { readFileSync, writeFileSync } from "node:fs";

const SOURCE = "public/animations/Gradient BG 3.json";

/* Hues are taken from each brand's own logo artwork. `cool` replaces the
   original's blues, `warm` replaces its pinks and creams — keeping the
   two-family variation that stops the wash reading as a flat tint. */
const BRANDS = {
  adib: {
    cool: "#009EDC",
    warm: "#1C2B5C",
    /*
     * Saturation multipliers. Lightness is still preserved exactly — that is
     * what keeps the blur radii reading as authored — so depth of colour has to
     * come from saturation instead. Cool is pushed harder than warm so the blue
     * leads rather than the whole field shifting together.
     */
    saturate: { cool: 1.7, warm: 1.4 },
    out: "public/animations/gradient-adib.json",
  },
  clientele: {
    cool: "#17479E",
    /*
     * The logo carries a single navy, where ADIB gave two hues 29.5deg apart.
     * Rather than invent a second brand colour, the warm family is that same
     * navy rotated by a matching spread — so the wash keeps the two-family
     * variation that stops it reading as a flat tint, without claiming a colour
     * the brand has not got.
     */
    /* Narrower than ADIB's natural 29.5deg spread: rotating the navy that far
       pushed the warm family into a violet strong enough to read as a second
       brand rather than a variation of the first. */
    warmShift: 20,
    /*
     * Below 1, unlike ADIB. ADIB's cyan is already very light, so a boost read
     * as air; this navy is a much deeper hue, and the same treatment came out
     * harsh. Pulling saturation down returns it to a wash.
     */
    saturate: { cool: 0.85, warm: 0.62 },
    out: "public/animations/gradient-clientele.json",
  },
  nedbank: {
    cool: "#00633A",
    /*
     * Negative, unlike the others: rotating this green the other way lands on
     * teal, which sits close enough to ADIB's cyan that the two cards stop
     * reading as different brands. Toward leaf green keeps them apart.
     */
    warmShift: -25,
    /*
     * Lower than Clientele's. This green is the deepest brand colour in the set
     * (100% saturation at 19% lightness, against the navy's 75% at 36%), so it
     * needs more restraint again to stay a wash rather than a poster.
     */
    saturate: { cool: 0.95, warm: 0.68 },
    out: "public/animations/gradient-nedbank.json",
  },
  absa: {
    /* Sampled from the logo PNG rather than guessed — it is the colour of
       143,550 of its pixels. */
    cool: "#BE0028",
    /*
     * Positive, toward orange. Rotating this crimson the other way lands in
     * magenta, which is where Pura's own pinks already live — the two cards
     * would have read as the same artwork twice.
     */
    warmShift: 25,
    saturate: { cool: 0.95, warm: 0.66 },
    out: "public/animations/gradient-absa.json",
  },
};

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);

function toHsl([r, g, b]) {
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (!d) return [0, 0, l];
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h =
    max === r ? ((g - b) / d + (g < b ? 6 : 0)) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h / 6, s, l];
}

function toRgb(h, s, l) {
  if (!s) return [l, l, l];
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const f = (t) => {
    t = (t + 1) % 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return [f(h + 1 / 3), f(h), f(h - 1 / 3)];
}

const brandName = process.argv[2];
const brand = BRANDS[brandName];
if (!brand) throw new Error(`Unknown brand: ${brandName}. Known: ${Object.keys(BRANDS)}`);

const coolHue = toHsl(rgb(brand.cool))[0];
const warmHue = brand.warm
  ? toHsl(rgb(brand.warm))[0]
  : (coolHue + brand.warmShift / 360 + 1) % 1;

const data = JSON.parse(readFileSync(SOURCE, "utf8"));
const hex = (c) => "#" + c.slice(0, 3).map((v) => Math.round(v * 255).toString(16).padStart(2, "0")).join("").toUpperCase();

let count = 0;
for (const layer of data.layers) {
  for (const group of layer.shapes ?? []) {
    for (const item of group.it ?? []) {
      if (item.ty !== "fl") continue;
      const before = hex(item.c.k);
      const [h, s, l] = toHsl(item.c.k);
      /* Blue-ish source stops are the cool family, everything else is warm.
         The original's own hues are what decide, so the split survives any
         future re-export of the source file. */
      const isCool = h > 0.5 && h < 0.75;
      const boost = brand.saturate ? (isCool ? brand.saturate.cool : brand.saturate.warm) : 1;
      const [r, g, b] = toRgb(isCool ? coolHue : warmHue, Math.min(s * boost, 1), l);
      item.c.k = [r, g, b, item.c.k[3] ?? 1];
      count += 1;
      console.log(`  ${layer.nm.padEnd(12)} ${before} -> ${hex(item.c.k)}  (${isCool ? "cool" : "warm"}, L=${(l * 100).toFixed(0)}% held, S ${(s * 100).toFixed(0)}%->${(Math.min(s * boost, 1) * 100).toFixed(0)}%)`);
    }
  }
}

writeFileSync(brand.out, JSON.stringify(data));
console.log(`\n${count} fills remapped -> ${brand.out}`);
