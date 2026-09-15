import { existsSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell/PageShell";
import { ResumeProfile } from "@/components/ResumeProfile/ResumeProfile";
import { Timeline } from "@/components/Timeline/Timeline";
import { CARD_LABELS, PAGE_HEADLINES } from "@/lib/cards";
import { RESUME_FILE } from "@/lib/experience";
import styles from "./page.module.css";

export const metadata: Metadata = { title: CARD_LABELS.resume };

/*
 * Rebuilt daily. The years-of-experience stat is derived from the current year,
 * and a purely static page bakes that number into HTML at build time — it would
 * still read "6+" in January 2027 until something else forced a deploy. A day is
 * far finer than the once-a-year change it exists to catch.
 *
 * Still valid in Next 16 because Cache Components is not enabled; if it is ever
 * turned on in next.config.ts, this export is ignored and the stat needs
 * cacheLife instead.
 */
export const revalidate = 86400;

export default function Page() {
  /*
   * Checked at build time rather than assumed. A download button that 404s is
   * worse than no button, and this is the one thing on the page that depends on
   * a file nobody is forced to add.
   */
  const hasResume = existsSync(path.join(process.cwd(), "public", RESUME_FILE));

  return (
    <PageShell headline={PAGE_HEADLINES.resume}>
      <div className={styles.resume}>
        {/* Wrapped so the grid has one element to place: the profile is a
            column of its own beside the timeline from the wide breakpoint. */}
        <div className={styles.profileColumn}>
          <ResumeProfile hasResume={hasResume} />
        </div>

        <section className={styles.experience} aria-label="Experience">
          <h2 className={styles.heading}>Experience</h2>
          <Timeline />
        </section>
      </div>
    </PageShell>
  );
}
