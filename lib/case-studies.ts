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
  /** For artwork with transparent margins authored against a dark canvas —
      pins its container to that dark fill in both themes, since the image
      only reads correctly there and a theme-reactive surface would wash it
      out on light. Currently only the Components preview needs this. */
  alwaysDark?: boolean;
  /** Written properly: the source these came from had no alt text at all. */
  alt: string;
  width: number;
  height: number;
};

export type ProcessStep = { title: string; body: string };

export type Approach = {
  title: string;
  body: string;
  /** Shown as one row beneath the prose, each expanding on click. The row
      stays a row at every width: these are screenshots of one artefact seen
      four ways, and stacking them loses the comparison. */
  images?: CaseStudyImage[];
  /** A single screenshot beside the prose rather than under it, for a block
      whose text does not need the full measure and would otherwise leave half
      the row empty. Stacks under the prose once the column is too narrow to
      carry both. */
  aside?: CaseStudyImage;
  /**
   * Treats the aside as artwork rather than a screenshot: drawn at its own
   * ratio with no frame, and centred against the prose instead of aligned to
   * the heading.
   *
   * The two want opposite things. A screenshot is a document, so it shares a
   * top edge with the heading and takes a border because its own light UI has
   * no edge on the dark theme. A render is a composition on transparency, so
   * framing it boxes it in and cropping it to a fixed ratio cuts the phones.
   */
  asideArt?: boolean;
  /** Puts the aside in the left column and the prose in the right. Stacked, the
      prose still comes first: reading order should not depend on the width. */
  asideLeft?: boolean;
  /** Width of the artwork column, in rem. Defaults to 44. A render carries its
      own transparent margin, so how large the subject reads depends on the
      file as much as the column, and this is per-section for that reason. */
  asideWidth?: number;
  /**
   * Phone screens under the prose: a centred row, each capped so a portrait
   * capture is shown at the size a phone is, not stretched to a third of the
   * page. Separate from `images`, which is for wide captures that should take
   * an equal share of the row.
   */
  screens?: CaseStudyImage[];
};

/** One UX deliverable — a persona sheet, a journey map — with the image tied
    directly to it, rather than a numbered step in a single timeline. Not
    every artefact has one: a step can be prose only. */
export type Artefact = {
  title: string;
  body: string;
  image?: CaseStudyImage;
  /** For an artefact illustrated by a small set of screens (Usability Testing's
      tested flow) rather than one board — shown as a row of capped-width
      phone shots instead of the single wide screenshot `image` renders. */
  images?: CaseStudyImage[];
};

/** One role in a type scale — "H1", 32 — in px, the unit the original spec was
    measured in. The component converts to rem when it sets the sample's size. */
export type TypeStep = { role: string; size: number };

/**
 * One customer tier's re-skin. Only two tokens actually vary per tier —
 * segment.accent and segment.surface — everything else in the system (80+
 * other tokens: background, text, buttons, error/success/warning/info) stays
 * byte-identical across all four. That is the whole mechanism, so it is all
 * this type needs to capture.
 */
export type TierPalette = { tier: string; accent: string; surface: string };

/**
 * One primitive colour ramp, drawn at its real values.
 *
 * `plate` is the opaque ground an alpha ramp composites over — the black and
 * white ramps are stored as alpha, so without a fixed plate their low steps
 * would render as whatever the page happens to be behind them.
 */
export type Palette = {
  name: string;
  steps: { step: string; value: string }[];
  plate?: string;
};

/**
 * One text style on a shared ramp: the size, the line box it sits in, and the
 * tracking, all in the units the system specifies them in.
 *
 * `render` caps the size the specimen is actually drawn at. The top of a ramp
 * is set against a phone frame, not an 800px column, so a 100pt style drawn
 * true to size would dwarf the page while telling the reader nothing the
 * printed figure doesn't already say.
 */
export type TypeStyle = {
  name: string;
  size: number;
  lineHeight: number;
  tracking: number;
  render?: number;
};

/** A family of text styles sharing one typeface and weight. */
export type TypeTier = {
  name: string;
  face: string;
  styles: TypeStyle[];
};

/**
 * One rung of the unit ramp, and every semantic token that resolves to it.
 *
 * The mapping is the point, so the rung is the row: a reader sees at a glance
 * that `spacing/md`, `radius/md` and nothing else all land on the same 16.
 * Empty arrays are meaningful — they say that rung is used by one collection
 * and not the others.
 */
export type UnitRow = {
  unit: string;
  value: number;
  spacing?: string[];
  radius?: string[];
  border?: string[];
};

/** A semantic token whose value is not on the unit ramp at all. */
export type UnitException = {
  token: string;
  value: string;
  why: string;
};

/** One numeric primitive ramp and the three semantic collections built on it. */
export type UnitMap = {
  label: string;
  note?: string;
  rows: UnitRow[];
  exceptions?: UnitException[];
  exceptionsNote?: string;
};

/**
 * One labelled entry in a titled list: the thing, optionally the figure that
 * pins it down, and a sentence on what it means.
 *
 * Deliberately generic. It carries both the findings an audit reports and the
 * fields a file is made of, which are the same shape on the page and would be
 * two near-identical types otherwise.
 */
export type Detail = { label: string; value?: string; body: string };

export type Details = {
  heading: string;
  /** Shown as one row beneath the grid, on the same terms as Approach's. */
  images?: CaseStudyImage[];
  /** Renders the heading a level down, for when this sits under a part
      heading rather than standing on its own. */
  sub?: boolean;
  note?: string;
  items: Detail[];
};

/**
 * One row of a three-way comparison: what the reference says a value should
 * be, and what each implementation actually has.
 *
 * `ok` is per cell rather than per row because the interesting case is one
 * platform agreeing and the other not. A row where both differ and a row where
 * only one does are different findings.
 */
export type CompareRow = {
  label: string;
  expected: string;
  actual: { value: string; ok: boolean }[];
};

/**
 * The contract checked against the implementations, drawn as a table rather
 * than argued in prose: a comparison is a grid, and describing a grid in
 * sentences is what made this section a wall of text.
 */
export type Comparison = {
  heading: string;
  sub?: boolean;
  note?: string;
  /** The column everything else is measured against. */
  reference: { name: string; meta: string };
  /** The implementations, in the order their cells appear in each row. */
  columns: { name: string; meta: string }[];
  rows: CompareRow[];
};

/** How one node is produced from the one before it. */
export type PipelineLink = { label: string; kind: "generated" | "manual" };

/**
 * One node in the token pipeline: where a set of values lives, and in what
 * form. `meta` is its role, `detail` what is actually in it.
 *
 * `via` is how this node is produced from the one before it, and it belongs on
 * the node rather than on the step into the group: the three consumers are not
 * fed the same way, and flattening them to one label was what made an
 * automated path read as a manual one.
 */
export type PipelineNode = {
  name: string;
  meta: string;
  detail: string;
  via?: PipelineLink;
};

/**
 * How a value gets from the file it is defined in to the screen it is drawn
 * on. Modelled as source, handoff and consumers rather than a flat list,
 * because the shape is a fan-out: one definition, one export, three
 * independent implementations that never see each other.
 */
export type Pipeline = {
  heading: string;
  note?: string;
  source: PipelineNode;
  toHandoff: PipelineLink;
  handoff: PipelineNode;
  toConsumers: PipelineLink;
  consumers: PipelineNode[];
};

/**
 * The foundation layer, shown as evidence rather than argued in prose: the
 * ramps and scales everything else is built from.
 */
export type Foundations = {
  heading: string;
  note?: string;
  colors?: { label: string; note?: string; palettes: Palette[] };
  typeRamp?: { label: string; note?: string; tiers: TypeTier[] };
  units?: UnitMap;
};

/**
 * One platform's chosen typeface. `platform` is a fixed set rather than a
 * free label — the component owns "iOS"/"Android"/"Web" and their icons, so
 * this can't drift out of sync with a typo'd string.
 */
export type Typeface = {
  platform: "ios" | "android" | "web";
  typeface: string;
  /** Largest first — the reading order of the ramp itself. */
  scale: TypeStep[];
};

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
  /** A quieter line under the figures, for when a headline number needs its
      composition shown rather than taken on trust. */
  statsBreakdown?: Fact[];
  /** The work itself. */
  screens?: CaseStudyImage[];
  /**
   * A titled block of prose stating a decision or an idea, rather than a
   * labelled section of description.
   *
   * Takes a list as well as one, because a strand sometimes needs two of these
   * in a row: what a thing is, then what it is for. Bodies split on blank
   * lines into paragraphs.
   */
  approach?: Approach | Approach[];
  process?: ProcessStep[];
  /**
   * An alternative to `process` for a strand that is not one timeline — each
   * item is its own titled block with the artefact that illustrates it
   * directly underneath, rather than steps sharing a numbered rail.
   */
  artefacts?: { heading: string; sub?: boolean; items: Artefact[] };
  /** Research and feedback, shown after the process that produced them. */
  evidence?: CaseStudyImage[];
  conclusion?: string;
  /** Shown as cards, under a heading of their own. */
  quotes?: Quote[];
  /** The value-prop bento — photography, an app screenshot, small tiles. */
  gallery?: BentoTile[];
  /** The chosen typeface per platform, and why — documentation, not a live
      specimen: the site's own type is Hanken Grotesk, and Bliss Pro is a
      licensed face with no files to embed here. */
  typography?: { faces: Typeface[]; note: string };
  /** The tier re-skin mechanism — how the same base palette reads as four
      different products depending on which two tokens are swapped. */
  colorSystem?: { note: string; tiers: TierPalette[] };
  /** Primitive ramps and scales, rendered at their real values. */
  foundations?: Foundations;
  /** How a token travels from Figma to a screen, and which crossings are
      automated. Follows Foundations: it is the same values, seen moving. */
  pipeline?: Pipeline;
  /** Preview sheets of the component library and its documentation, shown as
      a row of equal-width thumbnails that each expand full size on click. Not
      `screens`: that field's position in the render order is fixed near the
      top of a track, ahead of the gallery and everything after it, which is
      wrong for this — it belongs at the end, after Color system. */
  components?: CaseStudyImage[];
  /**
   * A second level of tabs over groups of this strand's sections, for a strand
   * long enough that reading it as one scroll is the wrong ask.
   *
   * Each chapter is itself a Track, so it carries the same section fields and
   * needs no parallel type. Only the sections are rendered: the lead stays
   * with the parent strand and is shown above the tabs whichever chapter is
   * open, so the orienting facts never scroll out of reach. A chapter's own
   * `facts`, `challenge`, `results` and `stats` are therefore ignored.
   */
  /** A titled list of labelled entries: what a check found, or what a thing is
      made of. */
  details?: Details;
  /** The reference checked against the implementations, as a grid. */
  comparison?: Comparison;
  /** The heading over `process`. Defaults to "My process", which is right for
      a case study about work done and wrong for one about how a file is
      built. */
  processHeading?: string;
  /** A paragraph between that heading and the steps, for a part that needs
      framing before the sequence makes sense. */
  processNote?: string;
  chapters?: Track[];
  /** Stands in while a strand has no sections yet. */
  placeholder?: string;
};

export type CaseStudy = {
  /** Matches Project["slug"]. */
  slug: string;
  /** The page's own opening line, where it differs from the grid card's own
      title — the two serve different jobs (a card sells the project in one
      line; a case study opens with its own headline) and don't have to
      read the same. Falls back to the project's title when omitted. */
  headline?: string;
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
        typography: {
          faces: [
            {
              platform: "ios",
              typeface: "SF Pro Display",
              scale: [
                { role: "H1", size: 32 },
                { role: "H2", size: 28 },
                { role: "H3", size: 24 },
                { role: "H4", size: 20 },
                { role: "Body", size: 16 },
                { role: "Caption", size: 14 },
              ],
            },
            {
              platform: "android",
              typeface: "Roboto",
              // Same scale as iOS — the two platforms share sizes and only
              // diverge on which weight sits under each role.
              scale: [
                { role: "H1", size: 32 },
                { role: "H2", size: 28 },
                { role: "H3", size: 24 },
                { role: "H4", size: 20 },
                { role: "Body", size: 16 },
                { role: "Caption", size: 14 },
              ],
            },
            {
              platform: "web",
              typeface: "Bliss Pro",
              // Bigger across the board — a desktop reading distance affords
              // a taller H1 than either mobile platform's.
              scale: [
                { role: "H1", size: 52 },
                { role: "H2", size: 36 },
                { role: "H3", size: 28 },
                { role: "H4", size: 20 },
                { role: "Body", size: 16 },
                { role: "Caption", size: 12 },
              ],
            },
          ],
          note: "iOS and Android use their platforms' own system typefaces rather than a custom face. That kept implementation simple, gave every user the accessibility they already expect from their own device's text-size settings, and meant no font licensing or updates to manage, while still holding the bank's visual direction. Web carries that same direction through Bliss Pro.",
        },
        colorSystem: {
          note: "Every token in the system (background, text, buttons, error, success, warning, info) stays exactly the same across ADIB's four customer tiers. Only two tokens actually change: segment.accent and segment.surface. Swapping just those two re-skins the whole experience per tier, without touching anything else.",
          tiers: [
            { tier: "Mass", accent: "#0EA4DF", surface: "#EEF7FB" },
            { tier: "Gold", accent: "#94703D", surface: "#F2F5F7" },
            { tier: "Private", accent: "#A98450", surface: "#000000" },
            { tier: "Diamond", accent: "#333333", surface: "#F2F5F7" },
          ],
        },
        components: [
          {
            src: "/images/adib/Components.png",
            alt: "A preview sheet of ADIB components: a card stack, account and transfer cards, promotional banners, and a segmented pill group.",
            width: 2820,
            height: 1386,
            alwaysDark: true,
          },
          {
            src: "/images/adib/documentation.jpeg",
            alt: "The Components page of the design system's documentation site, showing banner variants alongside a live preview.",
            width: 1200,
            height: 675,
          },
          {
            src: "/images/adib/documentation-2.jpeg",
            alt: "The Foundation section of the design system's documentation site, showing its navigation and introduction page.",
            width: 1200,
            height: 675,
          },
        ],
      },
    ],
  },
  absa: {
    slug: "absa",
    tracks: [
      {
        id: "salesforce-migration",
        label: "Salesforce migration",
        facts: [
          { label: "Project", value: "Salesforce migration" },
          { label: "Role", value: "Product designer" },
          { label: "Industry", value: "Banking" },
        ],
        /* No `mark`: a full scene rather than a small centred logo, the same
           treatment as Takaful's card fan. */
        hero: {
          src: "/images/Absa/hero.png",
          alt: 'The ABSA logo beside its "Today, tomorrow, together." tagline, and an illustration of a customer smiling at their phone.',
          width: 4355,
          height: 3139,
        },
        challenge:
          "The bank relied on an outdated in-branch system that posed several challenges. The system needed to be migrated to Salesforce to enhance efficiency and unlock new capabilities. This included new products and services as well as the creation of a seamless omnichannel experience, enabling customers to engage across digital and physical touchpoints while ensuring a consistent and improved user journey. The migration also aimed to streamline operations, improve scalability, and future-proof the system.",
        results:
          "The migration to Salesforce successfully transitioned existing products while enhancing the overall user experience. New products were introduced for both new-to-product (NTP) and new-to-bank (NTB) customers, covering transactional accounts (CASA), personal loans, and credit cards. Additionally, multiple account maintenance journeys were implemented, ensuring seamless management and improved accessibility across these products. Through this transformation, operations were streamlined, scalability was improved, and the system was future-proofed to support long-term growth and innovation.",
        stats: [
          { value: "20+", label: "Products/Features launched & enhanced" },
          { value: "3", label: "Omnichannel products launched" },
        ],
        process: [
          {
            title: "Research & Analysis",
            body: "We conducted field studies as our primary source of research. This was to understand first hand what were the pain points our colleagues in branch were experience with regards to our old systems.",
          },
          {
            title: "Understand",
            body: "When requirements are received we had to spend a lot of time with our business analysts to understand exactly how all our old systems work, because the old systems were so complex, we knew exactly what we needed to do.",
          },
          {
            title: "Wireframing & Prototyping (confidential)",
            body: "We created prototypes to help us visualize the journey for presentation and testing purposes. We used an iterative approach with feedback being at the centre of our design process. The wireframes also assisted me in engaging in technical discussions with either business stakeholders, developers, business analysts or system analysts.",
          },
          {
            title: "Usability Testing",
            body: "We conducted usability tests with users (our branch staff) to validate the design and identify areas for improvement. Based on their feedback, we made necessary adjustments to the design.",
          },
          {
            title: "Development Hand-off & Support",
            body: "We collaborated closely with developers, providing end-to-end support to ensure the best experience is delivered. This included but is not limited to: conducting regular design-development reviews, and actively participating in all agile ceremonies.",
          },
        ],
        /*
         * The wireframe board the "confidential" step above refers to — every
         * screen deliberately illegible at this zoom, which is what makes it
         * safe to show at all. The pair is a before/after of the same board:
         * static, then with the MVP flow traced across it.
         */
        evidence: [
          {
            src: "/images/Absa/wireframe-board.png",
            alt: "An overview of the wireframe board for the Salesforce migration, showing the full density of screens without revealing their confidential content.",
            width: 2804,
            height: 2804,
          },
          {
            src: "/images/Absa/wireframe-board-flow.png",
            alt: "The same wireframe board with the MVP user flow traced across it in connecting lines.",
            width: 2804,
            height: 2804,
          },
        ],
        conclusion:
          "Multiple products and features were launched successfully, the amount of time it took branch staff to onboard customers onto various products was drastically reduced and overall branch staff experience was better.",
      },
    ],
  },
  clientele: {
    slug: "clientele",
    tracks: [
      {
        id: "design-system",
        label: "Design system",
        facts: [
          { label: "Project", value: "Design system" },
          { label: "Role", value: "Product designer" },
          { label: "Industry", value: "Insurance" },
        ],
        hero: {
          src: "/images/Clientele/hero.png",
          alt: 'The Clientèle logo beside its "Clear. Simple. Easy." tagline, and an illustration of a family smiling together.',
          width: 3718,
          height: 2276,
        },
        challenge:
          "The client needed a scalable design system for their white-label products. Rebranding the products for different clients required extensive manual work in Adobe Suite, making the process tedious, time-consuming, and inefficient. Multiple new features also needed to be launched.",
        results:
          "I oversaw the implementation of a design system that improved scalability and consistency across all products, achieving a reduction of 80+% in design and development time, as well as launched multiple new features.",
        stats: [
          { value: "80%", label: "Reduction in design and development time" },
          { value: "3", label: "New features launched" },
        ],
        approach: {
          title: "White label product theming",
          body: "One of Clientèle's products was white-labelled across multiple clients, and re-theming it used to mean redoing the branding by hand in Adobe Suite for every rebrand. I took a similar approach to the one I later used at ADIB: **background**, **surface** and **accent** are the only tokens that carry a client's brand, while everything else in the system stays fixed. That discipline is a large part of what took design and development time down by 80%.",
        },
        /*
         * Not `process`: the source page's own structure is five standalone
         * deliverables, each with its own artefact directly underneath it —
         * not steps sharing a single numbered timeline.
         */
        artefacts: {
          heading: "UX Artefacts",
          items: [
            {
              title: "Personas",
              body: "Why did we need personas? Personas were essential as they created a human-centered approach in our design process. By identifying target users, personas facilitate empathy, guide decision-making, and serve as a communication tool across multidisciplinary teams. They helped prioritize features, identify user pain points, and mitigate biases, ensuring a consistent and user-focused design approach. Personas also assisted in aligning user testing efforts and maintaining a shared understanding of the target audience, ultimately contributing to the development of products and services that better met the needs and preferences of our real users.",
              image: {
                src: "/images/Clientele/persona.png",
                alt: 'A persona sheet for "Meek n\' mild Moses", covering demographics, personality, goals, frustrations, motivation and channels.',
                width: 3721,
                height: 2113,
              },
            },
            {
              title: "Competitor analysis",
              body: "A competitor analysis was crucial for this piece of work as it provided valuable insights that informed our strategic decision-making. By assessing the strengths and weaknesses of our competitors, we could identify market trends, benchmark performance, and assess risks. Understanding how our competitors positioned their products helped us in finding unique value propositions, guiding product development, and influencing pricing strategies.",
              image: {
                src: "/logos/nedbank-on-dark.svg",
                srcOnLight: "/logos/nedbank-on-light.svg",
                mark: true,
                alt: "The Nedbank logo, one of the competitors assessed.",
                width: 283,
                height: 289,
              },
            },
            {
              title: "User journeys",
              body: "I mapped out the user journey to gain a deeper understanding of the current process. Then, I guided the team through it, ensuring everyone had a clear view of the experience and could contribute ideas. This exercise helped us identify customer pain points and uncover opportunities to enhance the process by making it digital.",
              image: {
                src: "/images/Clientele/journey-map.png",
                alt: "A user journey map for a claim follow-up, tracing Moses through Investigate, Submit information and Review + Decide, with an emotion curve and opportunities noted at each stage.",
                width: 2710,
                height: 1614,
              },
            },
            {
              title: "Wireframes",
              body: "At the start of my design process, I created wireframes for testing, allowing the client to visualize the approach we would take. Using Adobe XD, I designed low-fidelity wireframes that served as a foundation for collaboration. Feedback from both users and the business was central to our process, ensuring we crafted the best possible experience.",
              image: {
                src: "/images/Clientele/wireframes.png",
                alt: "A board of low-fidelity wireframes and component states created for testing.",
                width: 3368,
                height: 1880,
              },
            },
            {
              title: "Usability Testing",
              body: "Before designing high-fidelity wireframes, I conducted user testing to understand how customers experienced the digital flow. We selected participants who matched our personas and provided them with scenarios, allowing them to navigate the process as if they were referring a friend or claiming a voucher with their loyalty points. Based on their feedback, we shared insights with stakeholders and made necessary improvements to enhance the customer experience before finalizing the high-fidelity wireframes.",
              image: {
                src: "/images/Clientele/usability-testing.png",
                alt: 'A slide from the Clientele App usability test pack, titled "Usability test pack".',
                width: 3367,
                height: 2076,
              },
            },
          ],
        },
        // No conclusion: the source page's closing paragraph describes an
        // unrelated e-commerce checkout project, not this one — a copy error
        // on the original site rather than content to carry over. Add a real
        // one once you have it.
      },
    ],
  },
  nedbank: {
    slug: "nedbank",
    tracks: [
      {
        id: "insurance",
        label: "Insurance",
        facts: [
          { label: "Project", value: "Nedbank Insurance" },
          { label: "Role", value: "UX designer" },
          { label: "Industry", value: "Banking/Insurance" },
        ],
        hero: {
          src: "/images/Nedbank/hero.png",
          alt: 'The Nedbank logo beside its "Make the better money choice today and enjoy safe, simple banking with great rewards" tagline, and an illustration of a man smiling at his phone.',
          width: 3432,
          height: 2241,
        },
        challenge:
          "During the COVID-19 pandemic, customers were unable to visit branches to apply for insurance products, creating a significant barrier to access. This required a seamless digital solution to ensure customers could explore and purchase insurance without in-person interactions.",
        results:
          "By analyzing data on insurance products predominantly purchased in-branch or through other channels, we identified key opportunities and successfully launched new products on Nedbank's mobile app.",
        stats: [{ value: "3", label: "New products launched" }],
        artefacts: {
          heading: "UX Artefacts",
          items: [
            {
              title: "Personas",
              // The source page's own text here is actually about competitor
              // analysis, not personas, and cuts off mid-sentence — corrected
              // only for the stray typo and the incomplete final clause,
              // nothing added. Flagged to you separately: the real Personas
              // copy doesn't seem to exist on the source page.
              body: "Before any designs were done, I completed a competitor analysis to understand how our competitors were offering this product to their customers. Gaining these essential insights allowed us to shape our journey and fill in any gaps in the market.",
              image: {
                src: "/images/Nedbank/persona.png",
                alt: 'A persona sheet for "Zandi Dlamini", a 35-year-old married marketing manager, covering demographic, goals/needs and behaviour, with the quote "I need to have financial support after a loved one is lost."',
                width: 2244,
                height: 2090,
              },
            },
            {
              title: "User journeys",
              body: "I mapped out the user journey to gain a clearer understanding of the current process. By walking the team through it, we ensured a shared understanding, allowing us to brainstorm ideas collaboratively. This helped us identify customer pain points and uncover opportunities to improve their experience by digitizing the process.",
              image: {
                src: "/images/Nedbank/journey-map.png",
                alt: "An empathy map tracing a customer's steps, narrative, actions, pains, gains, quotes and feelings when calling the bank to update a dependant's details.",
                width: 4488,
                height: 2588,
              },
            },
            {
              // Merged: this used to be two separate artefacts (Wireframes,
              // then Usability Testing as its own heading+paragraph). Keeping
              // one body — Wireframes' own — since the two were saying much
              // the same thing about the same flow.
              title: "Wireframes & Usability testing",
              body: "After doing research, I created wireframes for testing to help the client visualize our approach. Using Sketch, I designed low-fidelity wireframes that served as a foundation for collaboration. Feedback from both users and the business was integral to our process, ensuring we crafted the best possible experience.",
              // The black-and-white board from the old site, with every
              // screen from the flow laid out on it. Swap to `images` (same
              // shape as the usability set below) once the three individual
              // phone shots replacing this are ready.
              image: {
                src: "/images/Nedbank/wireframes.png",
                alt: "A board of low-fidelity wireframes for the insurance claim flow, from education screens through to claim submission and confirmation.",
                width: 1123,
                height: 693,
              },
              images: [
                {
                  src: "/images/Nedbank/wireframe-1.png",
                  alt: 'Step 1 of 3: "Your insurable event", a form capturing the date of incident, cause of damage and what happened.',
                  width: 1298,
                  height: 3086,
                },
                {
                  src: "/images/Nedbank/wireframe-2.png",
                  alt: 'Step 2 of 3: "Contact details", confirming a contact number and email address before continuing.',
                  width: 1298,
                  height: 3086,
                },
                {
                  src: "/images/Nedbank/wireframe-3.png",
                  alt: 'Step 3 of 3: "Review your claim", summarising the contact details, insurable event and third-party details entered.',
                  width: 1298,
                  height: 3086,
                },
              ],
            },
          ],
        },
        conclusion:
          "We launched three new insurance products, giving customers a way to take out cover entirely digitally for the first time. The client was extremely satisfied with the work produced. This project highlighted the importance of being customer-centric and understanding the user experience, particularly after a traumatic event, when users need to claim benefits from their policy.",
      },
    ],
  },
  pura: {
    slug: "pura",
    headline: "Healthcare, Simplified",
    tracks: [
      {
        id: "design-system",
        label: "Design system",
        hero: {
          src: "/images/Pura/hero.png",
          mark: true,
          alt: "The Pura app icon: a four-pointed star drawn as a rounded outline in a warm rose gradient.",
          width: 400,
          height: 400,
        },
        facts: [
          { label: "Project", value: "Design System" },
          { label: "Role", value: "Product & Design System Manager" },
          { label: "Industry", value: "Healthcare" },
        ],
        challenge:
          "Pura's design language has to hold across four consumers that share no code: the Figma library it is defined in, a documentation site, an iOS app and an Android app. Nothing forces those four to agree. A token renamed in Figma, a component built a little differently on one platform, an icon shipped under the wrong name: none of it breaks a build, and none of it surfaces until someone notices a screen looks wrong. The hard part was never drawing the components. It was the connective tissue that keeps four independent implementations honest.",
        results:
          "I own the system end to end: **394 tokens** and **206 component sets** defined in Figma, implemented natively on iOS and Android, and documented as a versioned, schema-validated contract rather than a static site. Every component doc records the Figma file and node it was derived from and the date it was derived, so staleness is measurable instead of assumed. Automated audits catch what review misses, and report gaps back to design with the usage counts attached.",
        stats: [
          { value: "394", label: "Design tokens*" },
          { value: "206", label: "Component sets" },
          { value: "100%", label: "Component usage" },
          { value: "3", label: "Platforms" },
          { value: "2", label: "Languages, full RTL" },
        ],
        /*
         * The ten Figma variable collections, each counted whole and assigned
         * to exactly one bucket, so these five sum to the headline figure:
         * Primitive = Color Primitive 79 + Unit Primitive 11; Semantic = Color;
         * Component = Components; Typography = Text Primitive 50 + Text 45;
         * Layout = Spacing 13 + Radius 7 + Border Weight 3 + Stack position 2.
         */
        statsBreakdown: [
          { value: "90", label: "Primitive" },
          { value: "98", label: "Semantic" },
          { value: "86", label: "Component" },
          { value: "95", label: "Typography" },
          { value: "25", label: "Layout" },
        ],
        chapters: [
          {
            id: "foundations",
            label: "Foundations",
            foundations: {
              heading: "Foundations",
              note: "Nothing in the system points at a raw value directly. A component reads a semantic token, the semantic token resolves to a primitive, and that indirection is what lets a value change in one place and land everywhere.",
              colors: {
                label: "Colors",
                note: "Six hue ramps, plus black and white held as alpha rather than flat greys, so a scrim or a divider composites over whatever sits behind it instead of fighting it.",
                palettes: [
                  {
                    name: "Mist Blue",
                    steps: [
                      { step: "050", value: "#f0f5fa" },
                      { step: "100", value: "#e5f1fc" },
                      { step: "200", value: "#d0e7fb" },
                      { step: "300", value: "#b3d2ef" },
                      { step: "400", value: "#89b0d2" },
                      { step: "500", value: "#5e88a8" },
                      { step: "600", value: "#456c88" },
                      { step: "700", value: "#28506d" },
                      { step: "800", value: "#0b3551" },
                      { step: "900", value: "#0e1a2b" },
                    ],
                  },
                  {
                    name: "Sage",
                    steps: [
                      { step: "100", value: "#f5f5f2" },
                      { step: "200", value: "#e8e8e3" },
                      { step: "300", value: "#dbdbd6" },
                      { step: "400", value: "#c1c2ba" },
                      { step: "500", value: "#a7a89e" },
                      { step: "600", value: "#909087" },
                      { step: "700", value: "#717067" },
                      { step: "800", value: "#616059" },
                      { step: "900", value: "#4a4842" },
                    ],
                  },
                  {
                    name: "Warm Sand",
                    steps: [
                      { step: "100", value: "#fbefe3" },
                      { step: "200", value: "#f8e4d3" },
                      { step: "300", value: "#f7dcc9" },
                      { step: "400", value: "#f7d6c3" },
                      { step: "500", value: "#f7cdb9" },
                      { step: "600", value: "#dda991" },
                      { step: "700", value: "#b68b77" },
                      { step: "800", value: "#77584d" },
                      { step: "900", value: "#2a170e" },
                    ],
                  },
                  {
                    name: "Rose Clay",
                    steps: [
                      { step: "100", value: "#fef5f5" },
                      { step: "200", value: "#fce6e6" },
                      { step: "300", value: "#fbd7d7" },
                      { step: "400", value: "#f9c8c8" },
                      { step: "500", value: "#f7b9b9" },
                      { step: "600", value: "#dc9797" },
                      { step: "700", value: "#c16c6c" },
                      { step: "800", value: "#994c4c" },
                      { step: "900", value: "#7a2929" },
                    ],
                  },
                  {
                    name: "Purple",
                    steps: [
                      { step: "100", value: "#ebe8f2" },
                      { step: "200", value: "#d9d4e1" },
                      { step: "300", value: "#c6c0d1" },
                      { step: "400", value: "#b4acc0" },
                      { step: "500", value: "#a297af" },
                      { step: "600", value: "#90839e" },
                      { step: "700", value: "#7b6496" },
                      { step: "800", value: "#6b5b7d" },
                      { step: "900", value: "#1d1721" },
                    ],
                  },
                  {
                    name: "Neutral",
                    steps: [
                      { step: "100", value: "#f5f5f5" },
                      { step: "200", value: "#e6e6e6" },
                      { step: "300", value: "#d4d4d4" },
                      { step: "400", value: "#b3b3b3" },
                      { step: "500", value: "#919191" },
                      { step: "600", value: "#707070" },
                      { step: "700", value: "#4d4d4d" },
                      { step: "800", value: "#333333" },
                      { step: "900", value: "#1a1a1a" },
                    ],
                  },
                  {
                    name: "Black (alpha)",
                    plate: "#ffffff",
                    steps: [
                      { step: "050", value: "#0000000d" },
                      { step: "100", value: "#0000001a" },
                      { step: "200", value: "#00000033" },
                      { step: "300", value: "#0000004d" },
                      { step: "400", value: "#00000066" },
                      { step: "500", value: "#00000080" },
                      { step: "600", value: "#00000099" },
                      { step: "700", value: "#000000b3" },
                      { step: "800", value: "#000000cc" },
                      { step: "900", value: "#000000e6" },
                      { step: "1000", value: "#000000" },
                    ],
                  },
                  {
                    name: "White (alpha)",
                    plate: "#1a1a1a",
                    steps: [
                      { step: "050", value: "#ffffff0d" },
                      { step: "100", value: "#ffffff1a" },
                      { step: "200", value: "#ffffff33" },
                      { step: "300", value: "#ffffff4d" },
                      { step: "400", value: "#ffffff66" },
                      { step: "500", value: "#ffffff80" },
                      { step: "600", value: "#ffffff99" },
                      { step: "700", value: "#ffffffb2" },
                      { step: "800", value: "#ffffffcc" },
                      { step: "900", value: "#ffffffe6" },
                      { step: "1000", value: "#ffffff" },
                    ],
                  },
                ],
              },
              typeRamp: {
                label: "Typography",
                note: "Twenty styles across four tiers, on two typefaces with one weight each, except Body which carries both Medium and SemiBold. Every size is specified against Figma's 440pt frame and scales down proportionally on a narrower phone, so a label keeps the proportion it was drawn at rather than truncating.",
                tiers: [
                  {
                    name: "Display",
                    face: "Greycliff CF Medium",
                    styles: [
                      {
                        name: "xLarge",
                        size: 100,
                        lineHeight: 100,
                        tracking: -3.5,
                        render: 56,
                      },
                      {
                        name: "Large",
                        size: 64,
                        lineHeight: 64,
                        tracking: -2,
                        render: 48,
                      },
                      {
                        name: "Medium",
                        size: 48,
                        lineHeight: 48,
                        tracking: -2,
                        render: 40,
                      },
                      { name: "Small", size: 36, lineHeight: 40, tracking: -2 },
                    ],
                  },
                  {
                    name: "Heading",
                    face: "Greycliff CF Medium",
                    styles: [
                      { name: "Large", size: 36, lineHeight: 40, tracking: -1 },
                      {
                        name: "Medium",
                        size: 28,
                        lineHeight: 32,
                        tracking: -0.5,
                      },
                      {
                        name: "Small",
                        size: 24,
                        lineHeight: 28,
                        tracking: -0.5,
                      },
                      {
                        name: "xSmall",
                        size: 20,
                        lineHeight: 24,
                        tracking: -0.5,
                      },
                    ],
                  },
                  {
                    name: "Body",
                    face: "Noto Sans Medium / SemiBold",
                    styles: [
                      {
                        name: "Large",
                        size: 20,
                        lineHeight: 28,
                        tracking: -0.5,
                      },
                      {
                        name: "Medium",
                        size: 16,
                        lineHeight: 24,
                        tracking: -0.5,
                      },
                      {
                        name: "Small",
                        size: 14,
                        lineHeight: 20,
                        tracking: -0.5,
                      },
                      {
                        name: "xSmall",
                        size: 12,
                        lineHeight: 16,
                        tracking: -0.5,
                      },
                    ],
                  },
                  {
                    name: "Label",
                    face: "Greycliff CF Medium",
                    styles: [
                      {
                        name: "Large",
                        size: 20,
                        lineHeight: 28,
                        tracking: -0.25,
                      },
                      {
                        name: "Medium",
                        size: 16,
                        lineHeight: 24,
                        tracking: -0.25,
                      },
                      {
                        name: "Small",
                        size: 14,
                        lineHeight: 20,
                        tracking: -0.25,
                      },
                      {
                        name: "xSmall",
                        size: 12,
                        lineHeight: 16,
                        tracking: -0.25,
                      },
                    ],
                  },
                ],
              },
              units: {
                label: "Spacing, radius and borders",
                note: "Spacing, radius and border weight are not three scales. They are three semantic namings of the same eleven numbers, so a rung can be re-tuned once and land in all three, and a value that wants to sit between two rungs has to justify itself rather than just appear.",
                rows: [
                  {
                    unit: "00",
                    value: 0,
                    spacing: [],
                    radius: ["none"],
                    border: [],
                  },
                  {
                    unit: "01",
                    value: 1,
                    spacing: [],
                    radius: [],
                    border: ["default"],
                  },
                  {
                    unit: "02",
                    value: 2,
                    spacing: ["xxs"],
                    radius: [],
                    border: ["strong"],
                  },
                  {
                    unit: "03",
                    value: 4,
                    spacing: ["xs"],
                    radius: ["xs"],
                    border: [],
                  },
                  {
                    unit: "04",
                    value: 8,
                    spacing: ["sm"],
                    radius: ["sm"],
                    border: [],
                  },
                  {
                    unit: "05",
                    value: 16,
                    spacing: ["md"],
                    radius: ["md"],
                    border: [],
                  },
                  {
                    unit: "05-5",
                    value: 20,
                    spacing: ["base"],
                    radius: [],
                    border: [],
                  },
                  {
                    unit: "06",
                    value: 24,
                    spacing: ["lg"],
                    radius: ["lg"],
                    border: [],
                  },
                  {
                    unit: "07",
                    value: 32,
                    spacing: ["xl", "clearance-side"],
                    radius: ["xlg"],
                    border: [],
                  },
                  {
                    unit: "08",
                    value: 40,
                    spacing: ["xxl"],
                    radius: [],
                    border: [],
                  },
                  {
                    unit: "09",
                    value: 48,
                    spacing: ["xxxl"],
                    radius: [],
                    border: [],
                  },
                ],
                exceptionsNote:
                  "Four tokens sit off the ramp. One earns it; three are the system leaking.",
                exceptions: [
                  {
                    token: "radius/full",
                    value: "999",
                    why: "Deliberate. A pill is not a radius on a scale. It is an instruction to round completely, and no rung can express that.",
                  },
                  {
                    token: "border-weight/medium",
                    value: "1.5",
                    why: "Falls between 01 and 02. A hairline-and-a-half that was easier to type than to argue for a new rung.",
                  },
                  {
                    token: "spacing/clearance-top",
                    value: "78",
                    why: "Measured off a specific header rather than chosen from the scale.",
                  },
                  {
                    token: "spacing/clearance-bottom",
                    value: "50",
                    why: "Same, for the tab bar. Both are real measurements that should resolve to a rung or become their own named layout tokens.",
                  },
                ],
              },
            },
          },
          {
            id: "pipeline",
            label: "Token pipeline",
            pipeline: {
              heading: "Token pipeline",
              note: "Figma is the source of truth. Its variables are synced into a versioned token repository in W3C Design Tokens format, and that repository is what every platform builds against.",
              source: {
                name: "Figma",
                meta: "Source of truth",
                detail:
                  "Ten variable collections, 394 variables. Color carries Light and Dark modes; everything else is single-mode.",
              },
              toHandoff: { label: "Synced as a delta", kind: "generated" },
              handoff: {
                name: "pura-design-tokens",
                meta: "Versioned source",
                detail:
                  "Its own repository, seven files, 650 tokens in W3C Design Tokens format. Semantic tokens alias primitives rather than restating them, so a ramp changes in one place.",
              },
              toConsumers: { label: "Built against by", kind: "generated" },
              consumers: [
                {
                  name: "Web",
                  meta: "Documentation",
                  via: { label: "Generated", kind: "generated" },
                  detail:
                    "The build resolves the token source into 595 CSS custom properties before Next.js compiles. Components depend on the stylesheet, not the tokens, so the UI package can be lifted out and installed by another team.",
                },
                {
                  name: "iOS",
                  meta: "SwiftUI",
                  via: { label: "Implemented natively", kind: "manual" },
                  detail:
                    "The token files are vendored into PuraTheme and implemented as xcasset colorsets and Swift enums, named to match so any value can be traced back to the token it came from.",
                },
                {
                  name: "Android",
                  meta: "Compose",
                  via: { label: "Implemented natively", kind: "manual" },
                  detail:
                    "Kotlin objects in core/ui/theme, reached through a CompositionLocal so a composable reads a semantic name and never a hex value.",
                },
              ],
            },
          },
          {
            id: "contracts",
            label: "Component contracts",
            approach: [
              {
                title: "What a contract is",
                body: "A contract is a component's documentation written as data instead of prose. One file per component, saying what it is called, what choices it offers, which token each part uses under each of those choices, what it looks like inside, when to use it, and what is currently wrong with it.\n\nBecause it is structured data with a schema behind it, a program can read it. The documentation site builds its pages from that file. The audits read the same file to compare the component against Figma. Nothing anywhere keeps a second copy.",
                images: [
                  {
                    src: "/images/Pura/doc-overview.png",
                    alt: "The Button page in the documentation site, with the product nav across the top and the component index down the side: a header card naming the component, then a live button with its configuration controls.",
                    width: 3200,
                    height: 2000,
                  },
                  {
                    src: "/images/Pura/doc-variants.png",
                    alt: "The same page scrolled to the size and state controls, with the Anatomy section beginning below.",
                    width: 3200,
                    height: 2000,
                  },
                  {
                    src: "/images/Pura/doc-anatomy.png",
                    alt: "The anatomy parts table, each part numbered and marked required or optional, with the Tokens section beginning below.",
                    width: 3200,
                    height: 2000,
                  },
                  {
                    src: "/images/Pura/doc-tokens.png",
                    alt: "The Tokens table: each row a swatch, the semantic token name, and the primitive it resolves to.",
                    width: 3200,
                    height: 2000,
                  },
                ],
              },
              {
                title: "Purpose of a contract",
                body: "Most design systems document a component by writing a page about it. The trouble with a page is that nothing can check it. Rename a token, change a variant in Figma, and the page still reads perfectly well while being wrong. Nobody finds out until someone builds from it.\n\nA contract fails instead. A token that no longer resolves stops the build. A doc that has not been re-read since its component moved says so, with a date. The point was never tidier documentation. It was documentation a computer can check and reuse, so that staying current stops depending on somebody remembering to.",
              },
            ],
            processHeading: "How a contract gets made",
            process: [
              {
                title: "Read the component in Figma",
                body: "Open the real component set and go through it variant by variant, noting which variable is bound to each part. The file, the node and the date all get written down, so there is never a question later about which version of the component the doc was describing. Button's says node 2055:1663, read on 12 August 2026.",
              },
              {
                title: "Write the doc file",
                body: "One file per component, holding the description, the choices it offers, the props a developer passes, the token behind each part, the anatomy drawing and the known problems. This is the only step a person actually writes, and it is deliberately the only one.",
              },
              {
                title: "Let the build check it",
                body: "Every build validates that file against a schema and turns it into JSON. A missing field, a malformed variant or a token that does not resolve stops the build. A doc cannot be published in a shape the schema does not allow, which is what makes the rest of it trustworthy.",
              },
              {
                title: "Everything reads the same file",
                body: "The site renders its pages from that JSON, and the audits read it to compare the doc against Figma. Because there is only ever one copy, there is nothing for the two to disagree about.",
              },
            ],
            details: {
              heading: "What is inside one",
              note: "Every field answers a question someone would otherwise have to walk over and ask a designer.",
              items: [
                {
                  label: "name, section, category",
                  body: "What the component is called, and where it sits in the library.",
                },
                {
                  label: "keywords",
                  body: "The words someone might search for it by, including the ones that are not its name. Button answers to cta, fab and trigger as well as to button.",
                },
                {
                  label: "figma",
                  body: "The file and node it was read from, and the date it was read. This is what makes staleness a fact you can look up rather than a worry.",
                },
                {
                  label: "usage",
                  body: "What it is for in a sentence, then the things to do and the things to avoid, written as guidance a person can disagree with rather than rules they cannot.",
                },
                {
                  label: "axes",
                  body: "The choices the component offers. Button has four: configuration, variant, size and state. Two configurations by four variants by three sizes by three states is the 72 combinations it has to be documented for.",
                },
                {
                  label: "props",
                  body: "What a developer actually passes in code, so the doc describes the real API rather than an idea of it.",
                },
                {
                  label: "tokens",
                  body: "Which token each part uses, for every combination of choices. Button has fourteen parts across those 72 combinations, so writing it out longhand is roughly a thousand entries. A generator collapses it to the 50 rules that actually decide anything, and can be run again to check itself against what the doc claims.",
                },
                {
                  label: "diagrams, layout",
                  body: "The anatomy drawing, the labels on it, and how the pieces are arranged.",
                },
                {
                  label: "issues",
                  body: "What is wrong with the component or its documentation right now, each with an id so it can be tracked and closed rather than rediscovered. Button currently carries two.",
                },
              ],
            },
          },
          {
            id: "documentation",
            label: "Documentation",
            approach: [
              {
                title: "What the documentation is",
                body: "The documentation is a web application, not a page of screenshots. It rebuilds itself from the same sources the products build from: the token repository and the component contracts.\n\nStarting it regenerates 595 CSS custom properties, the component registry and the component stylesheets before the site compiles. A value that changes at source changes on the site without anyone opening a page to edit it, which means the documentation cannot quietly fall behind the thing it documents.",
                aside: {
                  src: "/images/Pura/site-foundation.png",
                  alt: "The documentation site's Foundation overview: the product nav across the top, the foundation index down the side, and an introduction explaining what the design system is and who it is for.",
                  width: 3200,
                  height: 2000,
                },
              },
              {
                title: "The components are real",
                body: "Every component is documented with a working implementation on the page rather than a picture of one. You see the real thing in every variant, not a render of it from the week it was drawn.\n\nThey are deliberately self-contained. A component file imports nothing from the rest of the site, and its only dependency is the generated stylesheet, which is what lets the whole set be lifted out as a package another team installs: they take the files and one stylesheet, and nothing else comes with them. The rule that keeps it that way is stated in the files themselves. Every value is a token reference, and a literal in a component file means the token is missing and belongs at source.",
                aside: {
                  src: "/images/Pura/site-atoms.png",
                  alt: "The Atoms index: a grid of cards, each rendering the live component above its description, with every atom listed in the side nav.",
                  width: 3200,
                  height: 2000,
                },
              },
            ],
            details: {
              heading: "What it covers",
              note: "The parts a design system is usually judged on are here, and so are the parts that usually live somewhere else entirely.",
              images: [
                {
                  src: "/images/Pura/site-messaging.png",
                  alt: "The Messaging Framework page, with tabs for tone of voice, writing goals, the British dictionary and cultural awareness, above a table of tone principles.",
                  width: 3200,
                  height: 2000,
                },
                {
                  src: "/images/Pura/site-motion.png",
                  alt: "The Cards motion study: a grid of the product cards it covers, above functional annotations breaking the sequence into phases with the source, timing and layering for each.",
                  width: 3200,
                  height: 2000,
                },
                {
                  src: "/images/Pura/site-resources.png",
                  alt: "The Resources section: the content strategy summary, editorial style guide, glossary and editorial checklist, each with a download button.",
                  width: 3200,
                  height: 2000,
                },
              ],
              items: [
                {
                  label: "Components",
                  body: "Each with a live implementation, every variant, the token behind each part, and the Figma node it was derived from.",
                },
                {
                  label: "Foundations",
                  body: "Colour, typography, layout, iconography, accessibility, experience principles, and release notes recording what changed and when.",
                },
                {
                  label: "Content design",
                  body: "Tone of voice, grammar and mechanics, a messaging framework, an editorial checklist, UX and UI glossaries, cultural awareness and translation guidance. The written half of the system, which most design systems leave to a different team and a different document that nobody can find.",
                },
                {
                  label: "Motion",
                  body: "Loading, navigation transitions, the agent's thinking state, the card set, the celebration coin. Each one plays on its page, because a paragraph describing an animation is not documentation of it.",
                },
                {
                  label: "Resources",
                  body: "A content strategy summary, the editorial style guide, the glossary and keyword sheet, the editorial checklist and the logo pack, for the people who need the system without ever opening Figma.",
                },
              ],
            },
          },
          {
            id: "governance",
            label: "Governance and drift",
            approach: {
              title: "Watching for drift",
              body: "A contract states what a component is supposed to be. The two apps are what it actually became. The first half of governance is the machinery that puts those side by side and writes down where they differ, plus the discipline of publishing the difference rather than quietly closing it.",
            },
            comparison: {
              heading: "A conformance check, run on Button",
              sub: true,
              note: "The contract is served as JSON with every token key already resolved, so a platform can be held against what the component is supposed to be rather than against a screenshot of it. Button is the hardest case in the library: four axes, 72 combinations, fourteen parts. Reading the same values out of the contract, the Swift and the Kotlin gives this.",
              reference: { name: "Contract", meta: "node 2055:1663" },
              columns: [
                { name: "iOS", meta: "PuraButton.swift" },
                { name: "Android", meta: "PuraButton.kt" },
              ],
              rows: [
                {
                  label: "Variants",
                  expected: "4",
                  actual: [
                    { value: "4", ok: true },
                    { value: "3 under 4 names", ok: false },
                  ],
                },
                {
                  label: "Sizes",
                  expected: "3",
                  actual: [
                    { value: "4", ok: false },
                    { value: "3, none reachable", ok: false },
                  ],
                },
                {
                  label: "Heights, large to small",
                  expected: "56 / 40 / 32",
                  actual: [
                    { value: "56 / 40 / 32", ok: true },
                    { value: "56 / 40 / 32", ok: true },
                  ],
                },
                {
                  label: "Inline padding, medium",
                  expected: "16",
                  actual: [
                    { value: "16", ok: true },
                    { value: "18", ok: false },
                  ],
                },
                {
                  label: "Corner radius",
                  expected: "radius/full",
                  actual: [
                    { value: "Capsule", ok: true },
                    { value: "48%", ok: false },
                  ],
                },
                {
                  label: "Width bounds",
                  expected: "80 to 400",
                  actual: [
                    { value: "80 to 400", ok: true },
                    { value: "unset", ok: false },
                  ],
                },
                {
                  label: "Icon button",
                  expected: "an axis on Button",
                  actual: [
                    { value: "the same axis", ok: true },
                    { value: "4 components", ok: false },
                  ],
                },
              ],
            },
            processHeading: "Design system ops",
            processNote:
              "Drift is not only a machine problem. A component can be used wrongly without anything being renamed or mistyped, and no audit catches a designer who detached an instance and nudged it. The other half of governance is a set of review points at fixed moments in a feature's life, each checking the work against a written standard rather than an opinion. The system's conventions live in a guidelines document covering token descriptions, which token group to use when, component naming and text style usage, so a review is a comparison rather than a negotiation.",
            process: [
              {
                title: "Before anything is drawn",
                body: "Start from what the system already covers. Most components that feel new are an existing one with a different label or an extra slot, and the cheapest moment to find that out is before a file exists. It is also where a genuine gap gets spotted early enough to be built properly rather than worked around.",
              },
              {
                title: "While the design is being made",
                body: "Watch for the things that look correct and are not connected to anything: detached instances, local styles, colours and spacing typed in by hand instead of taken from a token. None of it shows up in a screenshot, and all of it is expensive once it reaches a build.",
              },
              {
                title: "When something really is missing",
                body: "A gap becomes a request against the system rather than a one-off built inside a feature file. The distinction matters more than it sounds. A one-off is a component nobody owns, that no audit knows about, and that quietly becomes a second version of something the system already has.",
              },
              {
                title: "Before handoff to engineering",
                body: "A review of the file against the system before the work leaves design. The question is not whether the screen looks right. It is whether every part of it is the component it appears to be, used the way that component is meant to be used.",
              },
              {
                title: "In the pull request",
                body: "The same check from the other side: hardcoded colours and spacing, a component rebuilt locally because reaching the real one was slightly awkward. Catching it here is what keeps the implementation on the system rather than near it.",
              },
            ],
          },
        ],
      },
      {
        id: "product",
        label: "Product",
        approach: [
          {
            title: "Most people only look when something is already wrong",
            body: "By the time a symptom sends you to a doctor, the interesting part of the story happened months earlier, in numbers nobody was looking at. And those numbers are scattered: a blood panel in one portal, a watch on your wrist, a prescription in a paper bag, an appointment booked by phone. Nothing joins up, so nothing adds up to a picture you can act on.\n\nPura is the argument that it does not have to work this way. It cannot assume you arrive with a full blood panel, or a wearable, or any history at all. It has to be useful on day one with almost nothing, get sharper as your data arrives, and never show you a confident picture it has not earned.",
          },
          {
            title: "Connective health",
            body: "**Healthcare shouldn't feel like a maze of platforms, jargon, and disconnected steps.** Three sources normally live in three different places, owned by three different systems, and you are left to be the integration layer between them.\n\nYour lab results, your wearable and your own profile all resolve into the same model. Bloods are uploaded, read and turned into biomarkers. A watch streams into a normalised pipeline that speaks one vocabulary whatever device it came from. None of it is shown as three separate feeds, because the value is not in having the data. It is in the data agreeing on one answer.",
            asideArt: true,
            aside: {
              src: "/images/Pura/pura-connective-health.png",
              alt: 'Two phones: the Pura splash screen, and an onboarding screen reading "Your health, finally understood" over a translucent figure, with Lab results, Medical history and Wearables labelled on the body.',
              width: 7195,
              height: 4500,
            },
          },
          {
            title: "Preventative, not reactive",
            body: "**Meeting people in the moments and channels that matter.** You do not open a health app to be told you are fine. Something has to be paying attention on your behalf, or prevention is just a word.\n\nThe agent sits across all of it: your wearable, your last lab result, your last conversation, your last appointment. It knows what normal looks like for you, so it can tell a real shift from one bad night, and it only speaks when there is something worth saying. Then it picks its moment, whether that is a push, a card on your home screen, a note where it applies in the app, or raising it in conversation.\n\nThat is the difference between a product you remember to check and one that checks on you.",
            asideArt: true,
            asideLeft: true,
            aside: {
              src: "/images/Pura/pura-ai.png",
              alt: "The Pura agent mark: a four-pointed star in a rose gradient, ringed by a halo of dots.",
              width: 230,
              height: 230,
            },
          },
          {
            title: "Your PureScore, on your digital twin",
            body: "**A 0-100 score reflecting your overall health and lifestyle.** One number, because a page of biomarker names is not something anyone acts on.\n\nIt is built from what is already connected: your bloods, your wearable, your profile. Each pillar carries its own markers, cardiovascular through respiratory, metabolic, renal and liver, and those roll up into the score. Nothing is invented for it. The score is the same data, resolved.\n\nThen it is drawn onto a digital twin. Each system is tinted by where it sits on a five-step ramp, from critical through moderate and mild risk to good and great, so you can see which part of you is asking for attention without knowing what a single marker is called.",
            asideArt: true,
            aside: {
              src: "/images/Pura/purescore.png",
              alt: "Placeholder for the PureScore artwork.",
              width: 12000,
              height: 9000,
            },
          },
          {
            title: "Easy access to care",
            body: "**Appointments to book, labs to visit, daily medications to take.** Telling you something has shifted is the easy part. Acting on it is where most health apps stop, and the phone calls and portals begin.\n\nEverything that follows lives in the same app: finding a doctor by what is wrong rather than by guessing at a speciality, seeing them in person or on video, and ordering your prescriptions.\n\nNone of that is measured in features. It is measured in how few steps sit between noticing something and doing something about it.",
            asideArt: true,
            asideLeft: true,
            aside: {
              src: "/images/Pura/vcp.png",
              alt: "Placeholder for the care artwork.",
              width: 6000,
              height: 4740,
            },
          },
        ],
        conclusion:
          "Healthcare has always asked you to notice first. Pura moves that job to the product: your labs, your wearable and your history resolving into one score, an agent watching it for you, and care in the same place as the thing that prompted it. The measure was never how much it could show you. It was how early it could tell you, and how little stood between knowing and doing.",
      },
    ],
  },
};
