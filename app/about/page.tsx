import type { Metadata } from "next";
import { Experience } from "@/components/Experience/Experience";
import { PageShell } from "@/components/PageShell/PageShell";
import { ProductSection } from "@/components/ProductSection/ProductSection";
import { Publications } from "@/components/Publications/Publications";
import { Showcase } from "@/components/Showcase/Showcase";
import { Portrait } from "@/components/Portrait/Portrait";
import { Skills } from "@/components/Skills/Skills";
import { ABOUT_PARAGRAPHS } from "@/lib/about";
import { CARD_LABELS } from "@/lib/cards";
import styles from "./page.module.css";

export const metadata: Metadata = { title: CARD_LABELS.about };

export default function Page() {
  return (
    <PageShell headline={CARD_LABELS.about}>
      <div className={styles.body}>
        {/* The same photo and treatment as the home page's "Me" card, framed
            for this layout rather than for the grid. */}
        <div className={styles.portrait}>
          <Portrait />
        </div>

        <div className={styles.copy}>
          {ABOUT_PARAGRAPHS.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Full width, below both columns — it belongs to the page rather than to
          the copy beside the photo. */}
      <Skills />

      <Experience />

      {/* Panels are passed in, not built inside Showcase — ProductSection is
          async and generates its QR on the server, which it could not do
          inside a client component. */}
      <Showcase publications={<Publications />} app={<ProductSection />} />
    </PageShell>
  );
}
