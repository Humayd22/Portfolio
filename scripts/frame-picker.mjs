/*
 * Builds a self-contained page for choosing which frame each brand's still
 * should be captured from.
 *
 * The player and the animation data are inlined, so the file works offline and
 * can be moved anywhere. Every tile is a live lottie instance stopped on its
 * own frame, which means what you see is exactly what capture-frame.mjs would
 * write out for that number.
 */
import { readFileSync, writeFileSync } from "node:fs";

const PLAYER = "node_modules/lottie-web/build/player/lottie.min.js";
/* [name, source, frame in use, or null where the card plays the animation] */
const BRANDS = [
  ["Pura", "public/animations/Gradient BG 3.json", null],
  ["ADIB", "public/animations/gradient-adib.json", null],
  ["Clientele", "public/animations/gradient-clientele.json", null],
  ["Nedbank", "public/animations/gradient-nedbank.json", null],
  ["ABSA", "public/animations/gradient-absa.json", null],
];
const FRAMES = [0, 60, 120, 180, 240, 300, 360, 420, 480, 540];

/*
 * The sampled frames, with the one a brand actually uses swapped in over its
 * nearest neighbour.
 *
 * Appending it instead would leave a card sitting off the sampling interval —
 * ADIB on 200, against a list stepping by 60 — showing one more tile than the
 * others, and the grids stop lining up. Swapping keeps every brand at the same
 * count while guaranteeing the in-use frame is on screen to be marked.
 */
function framesFor(current) {
  if (current === null || FRAMES.includes(current)) return [...FRAMES];

  const nearest = FRAMES.reduce((best, f) =>
    Math.abs(f - current) < Math.abs(best - current) ? f : best,
  );
  return FRAMES.map((f) => (f === nearest ? current : f)).sort((a, b) => a - b);
}

const data = BRANDS.map(([name, path, current]) => ({
  name,
  current,
  frames: framesFor(current),
  json: JSON.parse(readFileSync(path, "utf8")),
}));

const OUT = "previews/gradient-frame-picker.html";

writeFileSync(
  OUT,
  `<!doctype html><meta charset="utf-8"><title>Gradient frame picker</title>
<style>
  :root { color-scheme: dark }
  body { margin:0; background:#0a0a0a; color:#e8e8e8;
         font:14px/1.5 ui-sans-serif,system-ui,-apple-system,sans-serif }
  header { padding:28px 24px 8px }
  h1 { margin:0 0 4px; font-size:20px; font-weight:600 }
  p { margin:0; color:#888 }
  h2 { margin:32px 24px 0; font-size:15px; font-weight:600 }
  .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr));
          gap:16px; padding:14px 24px 8px }
  figure { margin:0 }
  .tile { height:190px; border-radius:16px; overflow:hidden; background:#fff; position:relative }
  .tile svg { position:absolute; inset:0; width:100%!important; height:100%!important; display:block }
  figcaption { padding-top:8px; color:#8a8a8a; font-variant-numeric:tabular-nums }
  .now { color:#5aa2ff; font-weight:600 }
  .now .tile { outline:2px solid #5aa2ff; outline-offset:3px }
</style>
<header>
  <h1>Gradient frame picker</h1>
  <p>Every tile is the live animation stopped on that frame, cropped exactly as the card crops it.
     Blue marks what each card uses now. Tell me a brand and a number.</p>
</header>
<div id="out"></div>
<script>${readFileSync(PLAYER, "utf8")}</script>
<script>
  var BRANDS = ${JSON.stringify(data)};
  var out = document.getElementById("out");

  BRANDS.forEach(function (brand) {
    var h = document.createElement("h2");
    h.textContent = brand.current === null
      ? brand.name + " — plays the animation, no still"
      : brand.name + " — using frame " + brand.current;
    out.appendChild(h);

    var grid = document.createElement("div");
    grid.className = "grid";
    out.appendChild(grid);

    brand.frames.forEach(function (frame) {
      var fig = document.createElement("figure");
      if (frame === brand.current) fig.className = "now";
      var tile = document.createElement("div");
      tile.className = "tile";
      var cap = document.createElement("figcaption");
      cap.textContent = "frame " + frame + (frame === brand.current ? "  · in use" : "");
      fig.appendChild(tile);
      fig.appendChild(cap);
      grid.appendChild(fig);

      lottie.loadAnimation({
        container: tile,
        renderer: "svg",
        loop: false,
        autoplay: false,
        animationData: JSON.parse(JSON.stringify(brand.json)),
        // Matches the card exactly: fill, and crop from the top.
        rendererSettings: { preserveAspectRatio: "xMidYMin slice" }
      }).goToAndStop(frame, true);
    });
  });
</script>`,
);
console.log(`wrote ${OUT}`);
