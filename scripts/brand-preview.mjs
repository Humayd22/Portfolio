/*
 * Builds a full-window preview of one brand's gradient, playing on a loop.
 *
 * Self-contained: the player and the animation data are inlined, so it opens
 * from the filesystem with no server and no network. Written from the repo's
 * own files rather than adapted from an exported demo, so every file in
 * previews/ can be regenerated from what is committed here.
 *
 *   node scripts/brand-preview.mjs <brand>
 */
import { readFileSync, writeFileSync } from "node:fs";

const PLAYER = "node_modules/lottie-web/build/player/lottie.min.js";
const SOURCES = {
  pura: "public/animations/Gradient BG 3.json",
  adib: "public/animations/gradient-adib.json",
  clientele: "public/animations/gradient-clientele.json",
  nedbank: "public/animations/gradient-nedbank.json",
  absa: "public/animations/gradient-absa.json",
};

const brand = process.argv[2];
const src = SOURCES[brand];
if (!src) throw new Error(`Unknown brand: ${brand}. Known: ${Object.keys(SOURCES)}`);

const out = `previews/gradient-preview-${brand}.html`;

writeFileSync(
  out,
  `<!doctype html><meta charset="utf-8"><title>${brand} gradient</title>
<style>
  /* White, because the artwork is transparent wherever its blobs do not reach
     and assumes a white ground behind it. */
  html,body{margin:0;height:100%;overflow:hidden;background:#fff}
  #stage{position:fixed;inset:0;background:#fff}
  #stage svg{position:absolute;inset:0;width:100%!important;height:100%!important;display:block}
</style>
<div id="stage"></div>
<script>${readFileSync(PLAYER, "utf8")}</script>
<script>
  lottie.loadAnimation({
    container: document.getElementById("stage"),
    renderer: "svg",              // canvas ignores the Gaussian Blur on every layer
    loop: true,
    autoplay: true,
    animationData: ${readFileSync(src, "utf8")},
    rendererSettings: { preserveAspectRatio: "xMidYMin slice" }
  });
</script>`,
);
console.log(`wrote ${out}`);
