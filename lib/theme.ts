export const THEMES = ["dark", "light"] as const;
export type Theme = (typeof THEMES)[number];

/** localStorage key holding the visitor's explicit choice. */
export const THEME_STORAGE_KEY = "portfolio-theme";

/** Attribute on <html> that the semantic CSS layer keys off. */
export const THEME_ATTRIBUTE = "data-theme";

/** Used when there is no stored choice and no OS signal. */
export const DEFAULT_THEME: Theme = "dark";

export function isTheme(value: unknown): value is Theme {
  return (THEMES as readonly unknown[]).includes(value);
}

/** Reads the theme currently painted on the document. */
export function getCurrentTheme(): Theme {
  const attribute = document.documentElement.getAttribute(THEME_ATTRIBUTE);
  return isTheme(attribute) ? attribute : DEFAULT_THEME;
}

/** Paints a theme and remembers it. */
export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be unavailable (private mode, blocked cookies).
    // The theme still applies for this session; only persistence is lost.
  }
}

/**
 * Runs synchronously in <head> before first paint.
 * Without it, every reload in dark mode flashes white while React boots.
 * Written as a string because it must execute before hydration.
 */
export const NO_FLASH_SCRIPT = `
(function () {
  try {
    var themes = ${JSON.stringify(THEMES)};
    var stored = localStorage.getItem("${THEME_STORAGE_KEY}");
    // Deliberately does NOT consult prefers-color-scheme. The dark treatment
    // is the designed first impression — the name glow and the intro sequence
    // are built for it — so every first-time visitor gets it regardless of OS
    // setting. Their own choice, once made, still wins on every later visit.
    var theme = themes.indexOf(stored) !== -1 ? stored : "${DEFAULT_THEME}";
    document.documentElement.setAttribute("${THEME_ATTRIBUTE}", theme);
  } catch (e) {
    document.documentElement.setAttribute("${THEME_ATTRIBUTE}", "${DEFAULT_THEME}");
  }
})();
`;
