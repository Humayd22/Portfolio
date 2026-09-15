/**
 * Long-form project pages, one per slug in PROJECTS.
 *
 * Content only — no markup and no styling decisions. A project with no entry
 * here has no case study yet and its route 404s, rather than rendering an
 * empty shell.
 */

import { PRODUCT_BENTO } from "@/lib/product-bento";
import type { BentoTile } from "@/lib/product-bento";

export type Fact = { label: string; value: string };

export type CaseStudyImage = {
  src: string;
  /**
   * The light-theme artwork, where one exists. Both are rendered and CSS shows
   * the right one, as with the logos elsewhere — choosing in JS would mean
   * reading the theme after hydration and flashing the wrong one first.
   */
  srcOnLight?: string;
  /** A mark rather than a photograph: shown smaller, and centred in its column. */
  mark?: boolean;
  /** Written properly: the source these came from had no alt text at all. */
  alt: string;
  width: number;
  height: number;
};

export type ProcessStep = { title: string; body: string };

/**
 * A verbatim comment from usability testing.
 *
 * Rebuilt as content rather than kept as the flat image it came from: the words
 * are then selectable, searchable, readable by a screen reader, and they reflow
 * on a phone instead of shrinking to nothing. Only the memoji were lifted out of
 * the original, since those cannot be reproduced as text.
 */
/** A box on the board, in percentages of its width and height. */
export type Placement = {
  left: number;
  top: number;
  width: number;
  height?: number;
};

export type Quote = {
  avatar: string;
  name: string;
  body: string;
  /** Where the card sits, measured off the original artwork. */
  at: Placement;
};

export const FEEDBACK_MARKS = [
  { kind: "open" as const, left: 9.5, top: 18 },
  { kind: "close" as const, left: 81.5, top: 77.5 },
];

/**
 * One strand of work within a project, shown as a tab.
 *
 * Everything below the label is optional, so a strand can be published while
 * it is still being written rather than waiting on a full set of sections.
 * Whatever is missing is simply not rendered.
 */
/*
 * Prose fields accept **double asterisks** around a run to bold it. Deliberately
 * the only markup allowed: enough to pick product names out of a long list,
 * without turning these strings into HTML that every reader has to sanitise.
 */
export type Track = {
  /** Stable, and used for the tab's DOM ids. */
  id: string;
  label: string;
  /** Project, role, industry — the orienting facts, before the story starts. */
  facts?: Fact[];
  hero?: CaseStudyImage;
  challenge?: string;
  results?: string;
  stats?: Fact[];
  /** The work itself. */
  screens?: CaseStudyImage[];
  approach?: { title: string; body: string };
  process?: ProcessStep[];
  /** Research and feedback, shown after the process that produced them. */
  evidence?: CaseStudyImage[];
  conclusion?: string;
  /** Shown as cards, under a heading of their own. */
  quotes?: Quote[];
  /** The value-prop bento — photography, an app screenshot, small tiles. */
  gallery?: BentoTile[];
  /** Stands in while a strand has no sections yet. */
  placeholder?: string;
};

export type CaseStudy = {
  /** Matches Project["slug"]. */
  slug: string;
  /** One tab each. A single track renders without any tabs at all. */
  tracks: Track[];
};

export const CASE_STUDIES: Record<string, CaseStudy> = {
  adib: {
    slug: "adib",
    tracks: [
      {
        id: "takaful",
        label: "Takaful insurance",
        facts: [
          { label: "Project", value: "Takaful Insurance" },
          { label: "Role", value: "Senior product designer" },
          { label: "Industry", value: "Banking / Insurance" },
        ],
        hero: {
          src: "/work/adib/cards.png",
          alt: "A fan of five ADIB Visa cards, including Exceed, Cashback and Signature.",
          width: 1500,
          height: 1140,
        },
        challenge:
          "Customers seeking Takaful (Islamic insurance) products faced a lack of accessible and streamlined journeys, hindering their ability to secure essential coverage for various needs such as health, education, and vehicles.",
        results:
          "Designed comprehensive journeys enabling customers to easily access and take out Takaful products. This included **Card Takaful**, **Male/Female Takaful**, **School Fee Takaful**, **Personal Accident Takaful**, **Motor Takaful**, **Home content Takaful** and **Personal Finance Takaful**, providing a seamless and customer-centric experience.",
        stats: [
          { value: "650%", label: "Total sales increase" },
          { value: "8", label: "New products" },
          { value: "65%", label: "Reduction in operational workload" },
        ],
        screens: [
          {
            src: "/work/adib/takaful-products.png",
            alt: "The Takaful section of the ADIB app, listing Covered Cards, Motor and Personal Accident Takaful, each with a short description and a Learn more button.",
            width: 656,
            height: 1345,
          },
          {
            src: "/work/adib/covered-cards-takaful.png",
            alt: "The Covered Cards Takaful detail screen, explaining how the benefit protects card payments against unforeseen events.",
            width: 1324,
            height: 1542,
          },
        ],
        approach: {
          title: "The real problem wasn't one journey. It was eight.",
          body: "Rather than design each Takaful product from scratch, I partnered closely with the business and product teams to shape one journey pattern, built around the commercial goals, and productised it across every insurance type. **One system, eight products**, a fraction of the effort to ship and maintain each one. Of course, as always, with the best user experience in mind.",
        },
        process: [
          {
            title: "Understand",
            body: "I started by listening. User interviews surfaced where people were getting stuck, and Firebase analytics showed exactly where they dropped out. Studying how others in the market approached insurance gave me a benchmark for what good looked like.",
          },
          {
            title: "Systematise and validate",
            body: "Instead of designing eight journeys, I designed one and made sure it worked. Once the pattern held up in usability testing, each product became a case of tailoring it rather than starting over, with feedback shaping the pattern at every step.",
          },
          {
            title: "Ship and optimise",
            body: "I stayed close to the build, handing over design tokens, running design and dev reviews, and joining every agile ceremony. After launch I kept watching the real numbers, the drop-offs, the success rates, the integration failures, and kept refining the journeys as usage came in.",
          },
        ],
        evidence: [
          {
            src: "/work/adib/usability-testing.png",
            alt: "A summary of the Covered Cards Takaful usability testing, held at ADIB HQ on 18 to 19 June 2024 with 10 customers, 6 male and 4 female, across 3 nationalities, averaging a rating of 5.",
            width: 4800,
            height: 2700,
          },
        ],
        quotes: [
          {
            avatar: "/work/adib/feedback/straightforward.png",
            at: { left: 19.1, top: 17.6, width: 30.6 },
            name: "A participant wearing a light headscarf",
            body: "The process was very straight forward, I could complete the entire process in just a few clicks.",
          },
          {
            avatar: "/work/adib/feedback/intuitive.png",
            at: { left: 52.8, top: 9.8, width: 30.3 },
            name: "A participant in a keffiyeh, giving a thumbs up",
            body: "I found the journey intuitive, and the payment step was seamless. Everything was clear, and I felt confident making the purchase.",
          },
          {
            avatar: "/work/adib/feedback/awesome.png",
            at: { left: 3.6, top: 40, width: 26.1 },
            name: "A participant with glasses and a beard",
            body: "The feature is awesome, I would love to add this Takaful when I got my card.",
          },
          {
            avatar: "/work/adib/feedback/smooth.png",
            at: { left: 66.6, top: 32.2, width: 29.7 },
            name: "A participant wearing a dark headscarf",
            body: "The experience was smooth from start to finish. I appreciated how easy it was to review the policy details before confirming my purchase.",
          },
          {
            avatar: "/work/adib/feedback/clean.png",
            at: { left: 66.6, top: 54.1, width: 29.7 },
            name: "A participant with short dark hair",
            body: "The design is clean, and I liked that I could complete the process in just a few steps.",
          },
          {
            avatar: "/work/adib/feedback/simple.png",
            at: { left: 15, top: 68.3, width: 30.3 },
            name: "A participant in a keffiyeh",
            body: "The interface was simple, The only thing I would suggest is having an option to download the policy document immediately after payment instead of waiting for an email.",
          },
          {
            avatar: "/work/adib/feedback/friendly.png",
            at: { left: 47.8, top: 74.7, width: 30 },
            name: "A participant wearing a pale headscarf",
            body: "I found the journey very user-friendly, and everything worked smoothly. A minor improvement could be making the key benefits more prominent in the plan selection screen.",
          },
        ],
        conclusion:
          "Before this, there was no proper digital way to take out Takaful, just a broken web flow. I built the in-app experience from scratch and turned it into a system: eight products from a single journey pattern, sales up 650%, and operational workload down 65%. For the first time, customers had a simple, consistent way to get the cover they needed.",
      },
      {
        id: "design-system",
        label: "Design system",
        facts: [{ label: "Project", value: "Design System" }],
        hero: {
          // The pair differ only in a glow: white reads on the dark canvas, the
          // grey one on light.
          src: "/logos/adib-logo-light.svg",
          srcOnLight: "/logos/adib-logo-dark.svg",
          mark: true,
          alt: "The ADIB logo.",
          width: 606,
          height: 606,
        },
        challenge:
          "ADIB's product spanned iOS, Android and web, and mobile alone had multiple teams building in parallel. That's where design systems usually fall apart: without a shared source of truth, every team drifts, the same component gets rebuilt three slightly different ways, and tokens diverge until the platforms stop looking like the same bank. We needed every team building the same components from the same tokens, and we needed a way to actually enforce that, not just hope for it.",
        results:
          "I built, governed and documented the design system behind ADIB's banking apps, and made it the single source of truth engineering built from. To hold quality across iOS, Android and web, I introduced a design review policy and process that enforced every team building from the same components and tokens.",
        stats: [
          { value: "109", label: "Components" },
          { value: "108", label: "Design tokens" },
          { value: "5", label: "Brand themes" },
          { value: "3", label: "Platforms" },
        ],
        gallery: PRODUCT_BENTO,
      },
    ],
  },
};
