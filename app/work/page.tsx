import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell/PageShell";
import { WorkGallery } from "@/components/WorkGallery/WorkGallery";
import { CARD_LABELS, PAGE_HEADLINES } from "@/lib/cards";
import styles from "./page.module.css";

// The browser tab keeps the short label; the page itself opens with the
// sentence. They serve different readers.
export const metadata: Metadata = { title: CARD_LABELS.work };

export default function Page() {
  return (
    <PageShell headline={PAGE_HEADLINES.work}>
      <div className={styles.work}>
        <WorkGallery />
      </div>
    </PageShell>
  );
}
