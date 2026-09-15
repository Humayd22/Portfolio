"use client";

import { Moon, Sun } from "@phosphor-icons/react";
import { useSyncExternalStore } from "react";
import { DEFAULT_THEME, applyTheme, getCurrentTheme, type Theme } from "@/lib/theme";
import styles from "./ThemeToggle.module.css";

// The pre-paint script in the root layout sets data-theme before React
// hydrates, so the server cannot know the real value. useSyncExternalStore
// is built for this: it reads the live DOM on the client while rendering
// the server's default during SSR, with no state write on mount.
function subscribe(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function getServerSnapshot(): Theme {
  return DEFAULT_THEME;
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getCurrentTheme, getServerSnapshot);

  function toggle() {
    applyTheme(theme === "dark" ? "light" : "dark");
  }

  const destination = theme === "dark" ? "light" : "dark";

  return (
    /*
     * A switch, so the state is visible rather than inferred: the knob sits over
     * whichever icon is currently active and slides to the other on press. Both
     * icons stay on screen throughout, which is what makes it read as a toggle
     * rather than a button that happens to change glyph.
     *
     * role="switch" + aria-checked reports that state to assistive tech, which a
     * plain button cannot. Checked means light, so the control has a stable
     * "on" meaning instead of one that flips with the theme.
     */
    <button
      type="button"
      role="switch"
      aria-checked={theme === "light"}
      className={styles.toggle}
      data-state={theme}
      onClick={toggle}
      aria-label={`Switch to ${destination} theme`}
      title={`Switch to ${destination} theme`}
    >
      <span className={styles.knob} aria-hidden="true" />

      <span className={styles.slot} aria-hidden="true">
        <Moon weight="light" className={styles.icon} />
      </span>
      <span className={styles.slot} aria-hidden="true">
        <Sun weight="light" className={styles.icon} />
      </span>
    </button>
  );
}
