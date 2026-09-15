import { PageTransition } from "@/components/PageTransition/PageTransition";
import { TopBar } from "@/components/TopBar/TopBar";
import styles from "./PageShell.module.css";

/**
 * The standard layout for every page below the home page.
 *
 * Same frame as home — same bar position, same measure — with two differences:
 * the identity block is replaced by a way back, and there is no bento grid.
 *
 * The headline is deliberately not the home page's treatment. That one is a
 * single word, centred and enormous, sized to be flown into by the intro. This
 * one is a sentence: left-aligned, wrapping, and set at a size that stays
 * readable across two or three lines.
 */
export function PageShell({
  headline,
  backHref,
  children,
}: {
  headline: string;
  /** Passed through to the bar; defaults to home. */
  backHref?: string;
  children?: React.ReactNode;
}) {
  return (
    /* Rendered from a page, not a layout, so enter and exit both fire. */
    <PageTransition>
      <div className={styles.page}>
        <TopBar back backHref={backHref} />

        <main className={styles.main}>
          <h1 className={styles.headline}>{headline}</h1>

          {children ? <div className={styles.content}>{children}</div> : null}
        </main>
      </div>
    </PageTransition>
  );
}
