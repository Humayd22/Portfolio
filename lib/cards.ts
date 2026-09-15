/**
 * What the headline reads for each bento card.
 *
 * Single source of truth: the grid renders these as its card labels and the
 * hero pre-renders one slot per value. If the two lists ever drifted, a card
 * could ask the headline for text that has no slot to appear in — and nothing
 * would happen on hover.
 */
export const CARD_LABELS = {
  about: "About me",
  work: "My work",
  contact: "Let's connect",
  portrait: "Me",
  tools: "Tools",
  resume: "Resume",
} as const;

export const HERO_SLOTS: readonly string[] = Object.values(CARD_LABELS);

/**
 * The opening sentence on each level-two page.
 *
 * PLACEHOLDER COPY — written to get the typography right, not to be shipped.
 * Replace with your own before this goes anywhere near a hiring manager.
 */
export const PAGE_HEADLINES = {
  about: "A designer who builds, and an engineer who cares how it looks.",
  work: "A few projects that shaped how I think about product, systems and craft.",
  contact:
    "Whether it's a design systems problem, a product from zero, or just a conversation, I'd love to hear from you.",
  resume:
    "A little about the work I've done and the places I've done it.",
} as const;
