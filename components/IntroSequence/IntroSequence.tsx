"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  flightDelay,
  handoffDuration,
  HERO_WORD_ID,
  INTRO_ATTRIBUTE,
  INTRO_EASING,
  INTRO_SESSION_KEY,
  INTRO_TIMING,
  INTRO_WORDS,
  sequenceDuration,
  sweepDuration,
  wordDelay,
} from "@/lib/intro";
import styles from "./IntroSequence.module.css";

type Phase = "play" | "leaving" | "done";

/*
 * The pre-paint script decides whether the intro runs; this reads that verdict
 * once, at hydration, and caches it. Caching matters: the attribute later
 * changes to drive the handoff, and a snapshot that tracked it live would
 * unmount the overlay mid-transition — killing the very animation it exists to
 * perform. useSyncExternalStore also requires a stable snapshot.
 *
 * The cache lives at module scope, which outlives the component: navigating to
 * a level-two page and back remounts IntroSequence without reloading the
 * module, so the verdict must be retired when the intro finishes (see
 * markIntroFinished) or the second visit replays it from a stale `true`.
 * The pre-paint script cannot correct this — it only runs on a full load, not
 * on client-side navigation.
 */
let cachedIsPlaying: boolean | null = null;

function getIsPlaying(): boolean {
  if (cachedIsPlaying === null) {
    cachedIsPlaying =
      document.documentElement.getAttribute(INTRO_ATTRIBUTE) === "play";
  }
  return cachedIsPlaying;
}

/** Retires the cached verdict so a later remount does not replay the intro. */
function markIntroFinished(): void {
  cachedIsPlaying = false;
}

/** The value never changes after hydration, so there is nothing to subscribe to. */
function subscribe(): () => void {
  return () => {};
}

/*
 * The server cannot know whether this visitor has already seen the intro, so it
 * renders the overlay unconditionally and CSS hides it for those who opted out
 * — no flash either way, and no state write on mount.
 */
function getServerSnapshot(): boolean {
  return true;
}

/**
 * Set the convergence distance: equal and opposite, so the two halves travel at
 * the same speed and arrive at the midpoint together. The S-words move right as
 * one block and "Design" moves left to meet them.
 *
 * Derived from where "Design" actually sits rather than assumed, so it stays
 * correct at any viewport and any font.
 */
function measureConvergence(
  line: HTMLElement,
  group: HTMLElement,
  payoff: HTMLElement,
): void {
  const lineCentre = line.clientWidth / 2;
  const payoffCentre = payoff.offsetLeft + payoff.offsetWidth / 2;
  const distance = payoffCentre - lineCentre;

  group.style.setProperty("--converge", `${distance}px`);
  payoff.style.setProperty("--converge", `${-distance}px`);
}

/**
 * Measure the flight: where "Design" sits now, and the exact box it has to land
 * in to become the home page's hero word.
 *
 * The hero is `visibility: hidden` at this point, not `display: none`, so it
 * still occupies real layout and can be measured. Scaling from a shared top-left
 * origin maps one box onto the other exactly, which is what lets the flying word
 * be swapped for the real one at the end without anything appearing to move.
 */
function measureFlight(payoff: HTMLElement): void {
  const hero = document.getElementById(HERO_WORD_ID);
  if (!hero) return;

  const from = payoff.getBoundingClientRect();
  const to = hero.getBoundingClientRect();
  if (from.width === 0 || to.width === 0) return;

  payoff.style.setProperty("--hero-dx", `${to.left - from.left}px`);
  payoff.style.setProperty("--hero-dy", `${to.top - from.top}px`);
  payoff.style.setProperty("--hero-scale", `${to.width / from.width}`);
}

export function IntroSequence() {
  const isPlaying = useSyncExternalStore(subscribe, getIsPlaying, getServerSnapshot);
  const [phase, setPhase] = useState<Phase>("play");
  const lineRef = useRef<HTMLParagraphElement>(null);
  const groupRef = useRef<HTMLSpanElement>(null);
  const payoffRef = useRef<HTMLSpanElement>(null);

  const finish = useCallback(() => {
    /*
     * Measured here, imperatively, rather than in an effect: this runs before
     * React re-renders with the leaving class, so the distances are already in
     * place on the animation's first frame. Measuring afterwards would animate
     * to zero for a frame. Measuring now also means the real font has long since
     * loaded, so the boxes are the ones actually on screen.
     */
    const line = lineRef.current;
    const group = groupRef.current;
    const payoff = payoffRef.current;
    if (line && group && payoff) measureConvergence(line, group, payoff);
    if (payoff) measureFlight(payoff);

    setPhase((current) => (current === "play" ? "leaving" : current));
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    try {
      sessionStorage.setItem(INTRO_SESSION_KEY, "1");
    } catch {
      // Storage unavailable (private mode). The intro still plays; it just
      // will not be suppressed on the next navigation this session.
    }

    const timer = window.setTimeout(finish, sequenceDuration(INTRO_WORDS.length));
    return () => window.clearTimeout(timer);
  }, [isPlaying, finish]);

  useEffect(() => {
    if (phase !== "leaving") return;

    const root = document.documentElement;
    root.setAttribute(INTRO_ATTRIBUTE, "handoff");

    const timer = window.setTimeout(() => {
      /*
       * The swap. The real hero is revealed in the same tick the flying word is
       * torn down: the two occupy identical boxes by now, so the exchange is
       * invisible. Revealing the page any earlier would show two copies of the
       * word at once.
       */
      root.setAttribute(INTRO_ATTRIBUTE, "done");
      markIntroFinished();
      setPhase("done");
    }, handoffDuration());

    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (!isPlaying || phase !== "play") return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") finish();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isPlaying, phase, finish]);

  // Unmounted once finished so it cannot trap focus or swallow clicks.
  if (!isPlaying || phase === "done") return null;

  const count = INTRO_WORDS.length;

  return (
    <div
      className={styles.overlay}
      data-phase={phase}
      style={
        {
          "--intro-fade": `${INTRO_TIMING.wordFade}ms`,
          "--intro-lead-in": `${INTRO_TIMING.leadIn}ms`,
          "--intro-sweep": `${sweepDuration()}ms`,
          "--intro-flight": `${INTRO_TIMING.flight}ms`,
          "--intro-flight-delay": `${flightDelay()}ms`,
          "--intro-easing": INTRO_EASING,
        } as React.CSSProperties
      }
    >
      <button type="button" className={styles.skip} onClick={finish}>
        Skip
      </button>

      {/* aria-hidden: the words are a typographic flourish, and the home page
          underneath carries the real content — including its own copy of this
          last word, which a screen reader reaches instead. */}
      <p ref={lineRef} className={styles.line} aria-hidden="true">
        {/*
         * The S-words are wrapped so they can leave as a single block. They
         * still arrive one at a time — the entrance animation stays on the
         * individual words — but the exit belongs to the group, which is what
         * keeps the line travelling as one piece instead of unravelling.
         */}
        <span ref={groupRef} className={styles.group}>
          {INTRO_WORDS.slice(0, -1).map((word, index) => (
            <span
              key={word}
              className={styles.word}
              /*
               * The delay travels as a custom property, never as an inline
               * `animation-delay`. An inline declaration outranks every class
               * rule, so any later animation would inherit this entrance delay
               * and fire seconds late — or, past teardown, never at all.
               */
              style={{ "--word-delay": `${wordDelay(index)}ms` } as React.CSSProperties}
            >
              {word}
            </span>
          ))}
        </span>

        <span
          ref={payoffRef}
          className={styles.payoff}
          style={
            { "--word-delay": `${wordDelay(count - 1)}ms` } as React.CSSProperties
          }
        >
          {INTRO_WORDS[count - 1]}
        </span>
      </p>
    </div>
  );
}
