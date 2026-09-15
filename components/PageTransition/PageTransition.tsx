import { ViewTransition } from "react";

/**
 * Animates a whole page in and out on navigation, using the same gesture the
 * hero readout uses when it swaps: the outgoing view falls away while the
 * incoming one rises into place.
 *
 * Must be rendered inside a page, never inside a layout. Layouts persist across
 * navigations, so a ViewTransition placed in one would never see an enter or an
 * exit — it simply would not fire.
 *
 * `default="none"` keeps this out of unrelated transitions (Suspense reveals,
 * router.refresh) so only real navigations animate.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      {children}
    </ViewTransition>
  );
}
