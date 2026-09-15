import { TOOLS, type Tool } from "@/lib/tools";
import styles from "./ToolCarousel.module.css";

/*
 * Decorative SVGs at a fixed ~30px box, so next/image's optimisation pipeline
 * has nothing to contribute and its wrapper markup would only fight the tile's
 * grid centring.
 *
 * A single icon renders once. A pair renders both, with CSS showing the right
 * one — choosing in JS would mean reading the theme after hydration and
 * flashing the wrong artwork on first paint.
 */
function Icon({
  icon,
  invertOn,
}: {
  icon: NonNullable<Tool["icon"]>;
  invertOn?: Tool["invertOn"];
}) {
  const inversion =
    invertOn === "dark"
      ? styles.invertOnDark
      : invertOn === "light"
        ? styles.invertOnLight
        : "";
  const base = `${styles.logo} ${inversion}`;

  if (typeof icon === "string") {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className={base} src={icon} alt="" />;
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={`${base} ${styles.onDark}`} src={icon.onDark} alt="" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={`${base} ${styles.onLight}`} src={icon.onLight} alt="" />
    </>
  );
}

function Tile({ tool }: { tool: Tool }) {
  return (
    /*
     * The name rides on a data attribute and is drawn by CSS. Rendering it as
     * an element would put every tool's name in the document twice over — once
     * per marquee copy — for a screen reader to wade through, when the
     * viewport's own label already lists them all exactly once.
     */
    <span className={styles.tile} data-name={tool.name}>
      {tool.icon ? <Icon icon={tool.icon} invertOn={tool.invertOn} /> : null}
    </span>
  );
}

/**
 * An endlessly scrolling row of tool logos.
 *
 * The loop works by rendering the list twice and translating the track exactly
 * -50%. At the end of the animation the second copy sits precisely where the
 * first started, so the jump back to 0 is invisible — no measuring, no JS, and
 * it stays seamless at any width.
 */
export function ToolCarousel() {
  return (
    <div
      className={styles.viewport}
      // Longer lists take proportionally longer, so the logos always drift past
      // at the same speed rather than sprinting when there are more of them.
      style={{ "--marquee-duration": `${TOOLS.length * 3}s` } as React.CSSProperties}
      role="img"
      aria-label={`Tools: ${TOOLS.map((tool) => tool.name).join(", ")}`}
    >
      <div className={styles.track}>
        {/* The visible pass. */}
        {TOOLS.map((tool) => (
          <Tile key={tool.name} tool={tool} />
        ))}

        {/* The seam-filler. aria-hidden so the list is not announced twice —
            the viewport above already carries the full set as its label. */}
        {TOOLS.map((tool) => (
          <Tile key={`${tool.name}-repeat`} tool={tool} />
        ))}
      </div>
    </div>
  );
}
