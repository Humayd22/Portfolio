import { EnvelopeSimple, LinkedinLogo } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import { CopyEmail } from "@/components/CopyEmail/CopyEmail";
import { PageShell } from "@/components/PageShell/PageShell";
import { CARD_LABELS, PAGE_HEADLINES } from "@/lib/cards";
import {
  AVAILABILITY,
  EMAIL,
  LINKEDIN_URL,
  LOCATION,
  RESPONSE_TIME,
} from "@/lib/contact";
import styles from "./page.module.css";

export const metadata: Metadata = { title: CARD_LABELS.contact };

function ArrowIcon() {
  return (
    <svg
      className={styles.arrow}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export default function Page() {
  return (
    <PageShell headline={PAGE_HEADLINES.contact}>
      <div className={styles.contact}>
        {/*
         * Two cards rather than a stack of loose parts. The page was reading as
         * four unrelated fragments at four different weights; giving the two
         * ways of getting in touch a shared frame makes them one choice.
         */}
        <div className={styles.methods}>
          <a
            className={`${styles.card} ${styles.primary}`}
            href={LINKEDIN_URL}
            target="_blank"
            rel="noreferrer"
          >
            {/* A drawn icon rather than the brand SVG: it takes the card's own
                colour, so both cards carry the same icon-in-a-plate lockup
                instead of one of them needing a white plate to stay legible. */}
            <span className={styles.cardHead}>
              <span className={styles.iconPlate}>
                <LinkedinLogo weight="light" className={styles.icon} />
              </span>
              <ArrowIcon />
            </span>

            <span className={styles.cardBody}>
              <span className={styles.label}>LinkedIn</span>
              <span className={styles.value}>The quickest way to reach me</span>
            </span>
          </a>

          {/*
           * Not a link itself: it holds two controls already, and nesting a
           * copy button inside an anchor is invalid and unusable by keyboard.
           */}
          <div className={styles.card}>
            {/* The copy control takes the corner the LinkedIn card gives its
                arrow, so the two cards balance. */}
            <span className={styles.cardHead}>
              <span className={styles.iconPlate}>
                <EnvelopeSimple weight="light" className={styles.icon} />
              </span>
              <CopyEmail email={EMAIL} />
            </span>

            <span className={styles.cardBody}>
              <span className={styles.label}>Email</span>
              <a className={styles.email} href={`mailto:${EMAIL}`}>
                {EMAIL}
              </a>
            </span>
          </div>
        </div>

        {/* One line, not two muted fragments competing for the same quiet. */}
        <p className={styles.meta}>
          {AVAILABILITY} · {LOCATION} · {RESPONSE_TIME}
        </p>
      </div>
    </PageShell>
  );
}
