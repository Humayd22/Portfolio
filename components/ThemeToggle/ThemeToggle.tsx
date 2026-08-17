"use client";

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
    <button
      type="button"
      className={styles.toggle}
      onClick={toggle}
      aria-label={`Switch to ${destination} theme`}
    >
      <span aria-hidden="true">{destination}</span>
    </button>
  );
}
