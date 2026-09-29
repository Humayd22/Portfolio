"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import styles from "./Tabs.module.css";

export type TabItem = {
  /** Stable, and used for the tab and panel DOM ids, so it has to be unique
      across the whole page: a nested set prefixes its own. */
  id: string;
  label: string;
  panel: React.ReactNode;
};

/**
 * `segmented` is the page-level switch: a filled pill that travels behind the
 * labels. `raised` is for a second level inside one of those panels, and is
 * modelled on the design system's own Horizontal Tab: the same travelling
 * shape, but a lifted surface rather than an emphasis fill, and no tray behind
 * the strip. That is what keeps the two levels apart at a glance.
 */
export type TabsVariant = "segmented" | "raised";

/**
 * A segmented switch over any number of panels.
 *
 * Panels arrive as props rather than being built here, so each can stay a
 * server component — one of the callers generates a QR code at build time,
 * which it could not do inside a client boundary.
 *
 * Real tab semantics rather than buttons that hide things: a screen reader is
 * told this is a set, which one is selected, and the arrow keys move between
 * them, which is what the role promises.
 */
export function Tabs({
  label,
  tabs,
  variant = "segmented",
}: {
  label: string;
  tabs: TabItem[];
  variant?: TabsVariant;
}) {
  /* Derived from the array, so reordering moves the default with it rather than
     leaving a hardcoded id pointing at whichever is now second. */
  const [active, setActive] = useState(tabs[0]?.id);
  const buttons = useRef<Record<string, HTMLButtonElement | null>>({});
  const strip = useRef<HTMLDivElement>(null);

  /*
   * The indicator is measured from the selected button rather than computed as
   * a fraction of the strip.
   *
   * A fraction only works if every tab is the same width, and they are not: the
   * strip is sized to its own content, and under content-based sizing equal
   * `1fr` tracks take their own contributions rather than levelling out. So a
   * long label makes its tab wider and any share-based pill lands short. This
   * also means labels no longer have to be a similar length to look right.
   */
  const place = useCallback(() => {
    const node = buttons.current[active];
    const box = strip.current;
    if (!node || !box) return;
    box.style.setProperty("--tab-x", `${node.offsetLeft}px`);
    box.style.setProperty("--tab-w", `${node.offsetWidth}px`);
  }, [active]);

  useLayoutEffect(() => {
    place();

    /* Re-measured on resize and once webfonts land, both of which change label
       widths after the first measurement. */
    const observer = new ResizeObserver(place);
    if (strip.current) observer.observe(strip.current);
    document.fonts?.ready.then(place).catch(() => {});

    return () => observer.disconnect();
  }, [place]);

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    const step = event.key === "ArrowRight" ? 1 : -1;
    const index = tabs.findIndex((tab) => tab.id === active);
    // Wraps, so the set has no dead ends at either edge.
    const next = tabs[(index + step + tabs.length) % tabs.length];

    setActive(next.id);
    buttons.current[next.id]?.focus();
    event.preventDefault();
  }

  return (
    <div className={`${styles.tabbed} ${styles[variant]}`}>
      <div
        className={styles.tabs}
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        ref={strip}
      >
        {/* Slides behind the labels. A sibling rather than a background on the
            active tab, so it can travel between them instead of blinking. */}
        <span className={styles.indicator} aria-hidden="true" />

        {tabs.map((tab) => (
          <button
            key={tab.id}
            ref={(node) => {
              buttons.current[tab.id] = node;
            }}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            className={styles.tab}
            aria-selected={active === tab.id}
            aria-controls={`panel-${tab.id}`}
            /* Only the selected tab is tabbable; arrows move within the set.
               That is the expected behaviour for a tablist, and it keeps Tab
               moving past the whole control rather than through every option. */
            tabIndex={active === tab.id ? 0 : -1}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/*
       * Every panel stays mounted and the inactive ones are hidden. Unmounting
       * would throw away server-rendered markup and make the switch feel like a
       * load.
       */}
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={active !== tab.id}
          className={styles.panel}
        >
          {tab.panel}
        </div>
      ))}
    </div>
  );
}
