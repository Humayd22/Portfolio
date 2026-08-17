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
