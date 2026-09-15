/*
 * Freezes one frame of a Lottie file as a standalone SVG.
 *
 * Five looping blur animations on one page is a lot of continuous compositing,
 * so cards that do not need motion can carry a still instead. The JSON stays
 * the source of truth — this only reads it.
 *
 * SVG rather than a screenshot, for three reasons: it stays sharp at any card
 * size, it is a fraction of the weight of the equivalent PNG, and the softness
 * survives as a live feGaussianBlur rather than being baked into pixels.
 *
 * Headless Chrome does the rendering because the frame has to be built by the
 * same engine that would have played it — this asks lottie-web to lay out the
 * frame, then lifts the resulting SVG out of the DOM.
 *
 *   node scripts/capture-frame.mjs <animation.json> <frame> <out.svg>
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PLAYER = "node_modules/lottie-web/build/player/lottie.min.js";

const [src, frame, out] = process.argv.slice(2);
if (!src || frame === undefined || !out) throw new Error("usage: <json> <frame> <out.svg>");

const page = `<!doctype html><meta charset="utf-8"><div id="l"></div>
<script>${readFileSync(PLAYER, "utf8")}</script>
<script>
  var anim = lottie.loadAnimation({
    container: document.getElementById("l"),
    renderer: "svg",
    loop: false,
    autoplay: false,
    animationData: ${readFileSync(src, "utf8")}
  });
  // isFrame=true, so the number is read as a frame and not as milliseconds.
  anim.goToAndStop(${Number(frame)}, true);
</script>`;

const dir = mkdtempSync(join(tmpdir(), "lottie-capture-"));
const html = join(dir, "frame.html");
writeFileSync(html, page);

try {
  const dom = execFileSync(
    CHROME,
    ["--headless", "--disable-gpu", "--dump-dom", "--virtual-time-budget=4000", `file://${html}`],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
  );

  const start = dom.indexOf("<svg");
  const end = dom.indexOf("</svg>", start);
  if (start < 0 || end < 0) throw new Error("no SVG in the rendered DOM");
  let svg = dom.slice(start, end + "</svg>".length);

  /* The player writes a fixed pixel size and a transform-origin onto the root.
     Stripping them lets the file scale to whatever box it is dropped into,
     while the viewBox keeps the geometry. */
  svg = svg
    .replace(/\swidth="[^"]*"/, "")
    .replace(/\sheight="[^"]*"/, "")
    .replace(/\sstyle="[^"]*"/, "")
    /* Fill and crop from the top when dropped into a box of a different shape.
       The blobs stop short of the foot of the 880x480 composition, so a centred
       crop would keep part of that empty strip. */
    .replace(/\spreserveAspectRatio="[^"]*"/, ' preserveAspectRatio="xMidYMin slice"');

  if (!svg.includes("xmlns=")) svg = svg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');

  writeFileSync(out, svg);
  const kb = (Buffer.byteLength(svg) / 1024).toFixed(1);
  console.log(`frame ${frame} of ${src} -> ${out} (${kb} KB)`);
} finally {
  rmSync(dir, { recursive: true, force: true });
}
