/**
 * The design system's "why it matters" grid — a bento of product photography,
 * an app screenshot and small value-prop tiles, sitting in the Design system
 * tab.
 *
 * Content only. Every tile is a fully designed image — icon, background and
 * label baked into one file rather than composed from code — so this is just
 * the grid's shape and where each file lives. `app-home` is the only one that
 * exists yet; the rest point at paths that do not exist until they are
 * designed and saved there, which is deliberate: once a file lands at the path
 * a tile already names, it appears with no code change.
 */

/**
 * Where a tile sits in the grid. 1-indexed, out of 5 columns and 6 rows — the
 * LCM of the 2-tile and 3-tile columns, which is what lets every column split
 * evenly into whole rows without a fractional span anywhere.
 */
export type BentoSlot = { column: number; row: number; span: number };

export type BentoTile = {
  id: string;
  label: string;
  slot: BentoSlot;
  src: string;
  alt: string;
  /**
   * Present only for the app screenshot, which renders at its own size rather
   * than being cropped to fill the tile — see .hug in ProductBento.module.css.
   * Every other tile is a designed graphic meant to fill its tile exactly, so
   * it is cropped edge to edge instead and needs no intrinsic size.
   */
  width?: number;
  height?: number;
  /**
   * The six small value-prop tiles sit on the site's real glass surface —
   * the same --surface-glass + backdrop-filter blur the home page's bento
   * uses — rather than a flat background baked into the file.  for a
   * glass tile is therefore transparent artwork only (icon + label, no
   * background), sized to fit inside the tile rather than fill it.
   */
  glass?: boolean;
  /**
   * The light-theme version of a glass tile's artwork. The glass surface
   * itself flips — a translucent white overlay on dark, translucent black on
   * light — so it is genuinely dark in dark mode and genuinely light in light
   * mode. Ink baked into one PNG cannot follow that, which is why every other
   * themed asset in this project (the ADIB logo, the client logos) ships two
   * variants; a glass tile with only `src` shows that one ink colour on both
   * themes, which is fine only if it was drawn to work against both.
   */
  srcOnLight?: string;
};

export const PRODUCT_BENTO: BentoTile[] = [
  {
    id: "familiar",
    label: "Familiar",
    slot: { column: 1, row: 1, span: 3 },
    // 600 x 600 (square) — cropped with object-fit: cover, so exact size only
    // matters for sharpness; aspect ratio is what determines the crop.
    src: "/images/adib/bento/familiar.png",
    alt: "A customer using the ADIB app on their phone.",
  },
  {
    id: "product-system",
    label: "Product system",
    slot: { column: 1, row: 4, span: 3 },
    // 600 x 600 (square)
    src: "/images/adib/bento/product-system.png",
    alt: "A set of ADIB cards and app screens shown together as one system.",
  },

  {
    id: "scalable",
    glass: true,
    label: "Scalable",
    slot: { column: 2, row: 1, span: 2 },
    // 560 x 384 (roughly 3:2, landscape)
    src: "/images/adib/bento/scalable.png",
    srcOnLight: "/images/adib/bento/scalable-light.png",
    alt: "Scalable.",
  },
  {
    id: "build-on-success",
    glass: true,
    label: "Build on success",
    slot: { column: 2, row: 3, span: 2 },
    // 560 x 384
    src: "/images/adib/bento/build-on-success.png",
    srcOnLight: "/images/adib/bento/build-on-success-light.png",
    alt: "Build on success.",
  },
  {
    id: "trendsetting",
    glass: true,
    label: "Trendsetting",
    slot: { column: 2, row: 5, span: 2 },
    // 560 x 384
    src: "/images/adib/bento/trendsetting.png",
    srcOnLight: "/images/adib/bento/trendsetting-light.png",
    alt: "Trendsetting.",
  },

  {
    id: "app-screen",
    label: "",
    slot: { column: 3, row: 1, span: 6 },
    src: "/images/adib/bento/app-home.png",
    alt: "The ADIB app's home screen, showing the account balance, a Covered Card prompt, linked accounts and quick actions.",
    width: 375,
    height: 812,
  },

  {
    id: "easy-to-use",
    glass: true,
    label: "Easy to use",
    slot: { column: 4, row: 1, span: 2 },
    // 560 x 384
    // The -light file is the WHITE-ink artwork here, the opposite of the
    // three tiles above: these were exported in a later batch under the other
    // reading of "light" (ink colour, not theme). Verified by measuring the
    // label pixels, not by the filename — do not "correct" this to match the
    // tiles above without checking the files again.
    src: "/images/adib/bento/easy-to-use-light.png",
    srcOnLight: "/images/adib/bento/easy-to-use.png",
    alt: "Easy to use.",
  },
  {
    id: "customizable",
    glass: true,
    label: "Customizable",
    slot: { column: 4, row: 3, span: 2 },
    // 560 x 384
    // The -light file is the WHITE-ink artwork here, the opposite of the
    // three tiles above: these were exported in a later batch under the other
    // reading of "light" (ink colour, not theme). Verified by measuring the
    // label pixels, not by the filename — do not "correct" this to match the
    // tiles above without checking the files again.
    src: "/images/adib/bento/customizable-light.png",
    srcOnLight: "/images/adib/bento/customizable.png",
    alt: "Customizable.",
  },
  {
    id: "fundamentals",
    glass: true,
    label: "Fundamentals",
    slot: { column: 4, row: 5, span: 2 },
    // 560 x 384
    // The -light file is the WHITE-ink artwork here, the opposite of the
    // three tiles above: these were exported in a later batch under the other
    // reading of "light" (ink colour, not theme). Verified by measuring the
    // label pixels, not by the filename — do not "correct" this to match the
    // tiles above without checking the files again.
    src: "/images/adib/bento/fundamentals-light.png",
    srcOnLight: "/images/adib/bento/fundamentals.png",
    alt: "Fundamentals.",
  },

  {
    id: "future-proof",
    label: "Future proof",
    slot: { column: 5, row: 1, span: 4 },
    // 600 x 800 (portrait — this tile is roughly twice the height of the
    // 2-row tiles beside it)
    src: "/images/adib/bento/future-proof.png",
    alt: "Future proof.",
  },
  {
    id: "accessible",
    label: "Accessible",
    slot: { column: 5, row: 5, span: 2 },
    // 600 x 384
    src: "/images/adib/bento/accessible.png",
    alt: "Accessible.",
  },
];
