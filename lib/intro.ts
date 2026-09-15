/** The four words, in order. The last one is the payoff and is styled apart. */
export const INTRO_WORDS = ["Systems.", "Strategy.", "Structure.", "Design."];

/** sessionStorage key marking that the intro has played this session. */
export const INTRO_SESSION_KEY = "portfolio-intro-played";

/** Attribute on <html> that the intro and hero CSS key off. */
export const INTRO_ATTRIBUTE = "data-intro";

/**
 * Timings from the intro spec, in milliseconds. Exported so the component
 * and the stylesheet cannot drift: the component derives its schedule from
 * these, and publishes them to CSS as custom properties.
 */
export const INTRO_TIMING = {
  /**
   * A beat of empty screen before the first word. Without it the opening word
   * begins fading on the very first painted frame, so the sequence appears to
   * start already in progress rather than from nothing.
   */
  leadIn: 1000,
  /** Opacity 0 to 1 for a single word. */
  wordFade: 650,
  /** Gap between one word finishing and the next starting. */
  wordGap: 250,
  /** How long the completed four-word line sits before leaving. */
  hold: 800,

  /**
   * How long the two halves take to close on the midpoint. Set directly rather
   * than derived from the entrance cadence: the words used to leave one at a
   * time, so the exit inherited the entrance's beat. They now leave as a single
   * block, and tying this to the entrance only made the exit drag.
   */
  converge: 1400,

  /** "Design" expands and travels to its hero position, top left. */
  flight: 700,
} as const;

/**
 * The home page's hero word. The intro's "Design" flies to this element's exact
 * position and size, then swaps for it — so the two must carry identical text,
 * or the geometries will not line up on the handoff.
 */
export const HERO_WORD_ID = "hero-word";

/**
 * One beat: how long between one word starting and the next starting. The
 * words leave on this same beat that they arrived on, so the sequence reads
 * as one rhythm running forwards then backwards rather than two ideas.
 */
export const WORD_CADENCE = INTRO_TIMING.wordFade + INTRO_TIMING.wordGap;

/** Gentle deceleration, used on the hero's arrival. */
export const INTRO_EASING = "cubic-bezier(0.22, 0.61, 0.36, 1)";

/** Delay before word `index` fades in, measured from the first painted frame. */
export function wordDelay(index: number): number {
  return INTRO_TIMING.leadIn + index * WORD_CADENCE;
}

/**
 * How long "Design" spends travelling. The S-word block is wiped over exactly
 * the same window, so the two arrive at the midpoint together.
 */
export function sweepDuration(): number {
  return INTRO_TIMING.converge;
}

/** "Design" begins its flight once it has arrived and the line behind it is clear. */
export function flightDelay(): number {
  return INTRO_TIMING.converge;
}

/** Time from first frame until the handoff should begin. */
export function sequenceDuration(wordCount: number): number {
  return wordDelay(wordCount - 1) + INTRO_TIMING.wordFade + INTRO_TIMING.hold;
}

/** Total handoff length: when the flying word has landed and can be swapped out. */
export function handoffDuration(): number {
  return flightDelay() + INTRO_TIMING.flight;
}

/**
 * Runs synchronously in <head>, before first paint, for the same reason the
 * theme script does: the decision must be made before anything renders.
 * Deciding in an effect would flash the home page for a visitor who is about
 * to see the intro, or flash the intro at a visitor who has opted out.
 *
 * Sets data-intro to "play" or "skip".
 */
export const INTRO_SCRIPT = `
(function () {
  try {
    var played = sessionStorage.getItem("${INTRO_SESSION_KEY}");
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.setAttribute(
      "${INTRO_ATTRIBUTE}",
      played || reduced ? "skip" : "play"
    );
  } catch (e) {
    document.documentElement.setAttribute("${INTRO_ATTRIBUTE}", "skip");
  }
})();
`;
