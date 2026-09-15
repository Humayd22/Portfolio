"use client";

import Link from "next/link";
import { useHeroLabel } from "@/components/HeroLabel/HeroLabel";
import { Portrait } from "@/components/Portrait/Portrait";
import { ToolCarousel } from "@/components/ToolCarousel/ToolCarousel";
import { CARD_LABELS } from "@/lib/cards";
import styles from "./BentoGrid.module.css";


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

type LinkCardProps = {
  href: string;
  label: string;
  index: number;
  className?: string;
};

/**
 * A card that goes somewhere. The label and its arrow are the affordance, so
 * every interactive card carries both — and, conversely, nothing without them
 * is interactive.
 */
function LinkCard({ href, label, index, className }: LinkCardProps) {
  const { setLabel } = useHeroLabel();

  /*
   * Focus mirrors hover so the headline responds to keyboard navigation too —
   * otherwise tabbing through the grid gives no feedback at all, while pointing
   * at it rewrites the largest text on the page.
   */
  const show = () => setLabel(label);
  const clear = () => setLabel(null);

  return (
    <Link
      href={href}
      className={`${styles.card} ${className ?? ""}`}
      onMouseEnter={show}
      onMouseLeave={clear}
      onFocus={show}
      onBlur={clear}
      // Drives the stagger. A custom property rather than an inline
      // animation-delay, so the value cannot outrank the class rules.
      style={{ "--card-index": index } as React.CSSProperties}
    >
      <span className={styles.foot}>
        <span className={styles.label}>{label}</span>
        <ArrowIcon />
      </span>
    </Link>
  );
}

/**
 * A card with no label, no arrow and no destination. It still speaks to the
 * headline on hover — that readout is ambient feedback, not a click affordance,
 * so it costs nothing to give these cards a voice without implying they lead
 * somewhere.
 *
 * Pointer only, deliberately: these are not focusable, so there is no keyboard
 * equivalent to mirror.
 */
function DisplayCard({
  heroLabel,
  index,
  className,
  children,
}: {
  heroLabel: string;
  index: number;
  className?: string;
  children: React.ReactNode;
}) {
  const { setLabel } = useHeroLabel();

  return (
    <div
      className={`${styles.card} ${className ?? ""}`}
      onMouseEnter={() => setLabel(heroLabel)}
      onMouseLeave={() => setLabel(null)}
      style={{ "--card-index": index } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

export function BentoGrid() {
  return (
    <section className={styles.grid} aria-label="Sections">
      {/* Row one: a narrow card and a wide one. */}
      <LinkCard href="/about" label={CARD_LABELS.about} index={0} className={styles.about} />
      <LinkCard
        href="/work"
        label={CARD_LABELS.work}
        index={1}
        className={styles.portfolio}
      />

      {/* Row two: three slots carrying four cards — the last slot splits. */}
      <LinkCard
        href="/contact"
        label={CARD_LABELS.contact}
        index={2}
        className={styles.contact}
      />

      <div className={styles.stack}>
        <LinkCard
          href="/resume"
          label={CARD_LABELS.resume}
          index={3}
          className={styles.resume}
        />

        <DisplayCard heroLabel={CARD_LABELS.tools} index={4} className={styles.tools}>
          <ToolCarousel />
        </DisplayCard>
      </div>

      <DisplayCard heroLabel={CARD_LABELS.portrait} index={5} className={styles.portrait}>
        <Portrait />
      </DisplayCard>
    </section>
  );
}
