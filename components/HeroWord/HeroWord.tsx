"use client";

import { useHeroLabel } from "@/components/HeroLabel/HeroLabel";
import { HERO_SLOTS } from "@/lib/cards";
import { HERO_WORD_ID } from "@/lib/intro";
import styles from "./HeroWord.module.css";

/**
 * The page's headline, which doubles as a readout for whichever card is being
 * pointed at. Falls back to the word the intro sequence lands on.
 *
 * Every possible readout is rendered up front and toggled with an attribute,
 * rather than swapping the text node. Keeping them all mounted is what makes
 * the change animatable at all: the outgoing text has to still exist to fall
 * away while the incoming one rises. Doing it with a text swap would need a
 * state machine holding the previous value and a timer to retire it.
 *
 * Keeps HERO_WORD_ID: the intro's flying word measures this element and lands
 * on it, so the id has to stay put even though the text can now change.
 */
export function HeroWord({
  fallback,
  className,
}: {
  fallback: string;
  className?: string;
}) {
  const { label } = useHeroLabel();

  return (
    <h1 id={HERO_WORD_ID} className={`${className ?? ""} ${styles.hero}`}>
      {/*
       * In normal flow, so it alone defines the element's box. That keeps the
       * headline's width fixed at the fallback word regardless of which readout
       * is showing — which matters because the intro measures this box to know
       * where to fly to, and because a resizing headline would shift the grid.
       */}
      <span className={styles.base} data-active={label === null || undefined}>
        {fallback}
      </span>

      {/*
       * Absolutely positioned over the base, so they contribute no width.
       * aria-hidden throughout: these are decorative feedback, and the card
       * labels they mirror are already in the accessibility tree as links. The
       * heading keeps one stable accessible name.
       */}
      {HERO_SLOTS.map((slot) => (
        <span
          key={slot}
          className={styles.slot}
          data-active={label === slot || undefined}
          aria-hidden="true"
        >
          {slot}
        </span>
      ))}
    </h1>
  );
}
