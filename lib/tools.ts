/**
 * Either a single file that reads on both themes, or a pair named for the
 * theme each appears on — `onDark` is the version shown on the dark theme, so
 * it is usually the light-coloured artwork, and vice versa.
 *
 * Naming by context rather than by ink colour is what stops the two being
 * swapped by mistake.
 */
export type ToolIcon = string | { onDark: string; onLight: string };

export type Tool = {
  name: string;
  /** Path under `public/tools/`. Omit and the tile renders empty. */
  icon?: ToolIcon;
  /**
   * Which theme a flat monochrome mark needs flipping on. A black mark vanishes
   * against the dark theme (`"dark"`); a white one vanishes against the light
   * theme (`"light"`). Inverting swaps black for white, which is what each
   * brand's opposite variant looks like anyway — a faithful result, not a hack.
   *
   * One field rather than two booleans, because a mark can never need both.
   *
   * Only valid for genuinely monochrome artwork: inverting a coloured mark
   * would produce its hue complement. Supply a proper `onDark`/`onLight` pair
   * instead if a brand ships one.
   */
  invertOn?: "dark" | "light";
};

/** Order is the order they scroll past. */
export const TOOLS: Tool[] = [
  { name: "Figma", icon: "/tools/figma.svg" },
  { name: "Claude", icon: "/tools/claude.svg" },
  { name: "Next.js", icon: "/tools/nextjs.svg", invertOn: "dark" },
  { name: "Vercel", icon: "/tools/vercel.svg", invertOn: "dark" },
  { name: "Supabase", icon: "/tools/supabase.svg" },
  { name: "GitHub", icon: "/tools/github.svg", invertOn: "dark" },
  { name: "Firebase", icon: "/tools/firebase.svg" },
  { name: "Expo", icon: "/tools/expo.svg", invertOn: "dark" },
  { name: "Lovable", icon: "/tools/lovable.svg" },
  { name: "LottieFiles", icon: "/tools/lottiefiles.svg" },
  { name: "Midjourney", icon: "/tools/midjourney.svg", invertOn: "dark" },
  { name: "Firecrawl", icon: "/tools/firecrawl.svg" },
  // White artwork — the one mark that needs flipping the other way.
  { name: "Weavy", icon: "/tools/weavy.svg", invertOn: "light" },
];
