"use client";

import { createContext, useContext, useMemo, useState } from "react";

type HeroLabelValue = {
  /** The card currently being pointed at, or null for the default word. */
  label: string | null;
  setLabel: (label: string | null) => void;
};

const HeroLabelContext = createContext<HeroLabelValue | null>(null);

/**
 * Lets the bento cards drive the hero word. The hero and the grid are siblings
 * rather than parent and child, so the state has to live above both — context
 * keeps page.tsx a server component instead of forcing the whole page client
 * just to share one string.
 */
export function HeroLabelProvider({ children }: { children: React.ReactNode }) {
  const [label, setLabel] = useState<string | null>(null);
  const value = useMemo(() => ({ label, setLabel }), [label]);

  return (
    <HeroLabelContext.Provider value={value}>{children}</HeroLabelContext.Provider>
  );
}

export function useHeroLabel(): HeroLabelValue {
  const context = useContext(HeroLabelContext);
  if (!context) {
    throw new Error("useHeroLabel must be used within a HeroLabelProvider");
  }
  return context;
}
