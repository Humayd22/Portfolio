import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import { INTRO_SCRIPT } from "@/lib/intro";
import { DEFAULT_THEME, NO_FLASH_SCRIPT } from "@/lib/theme";
import "./globals.css";

// Variable font: the full 100-900 range arrives in one self-hosted file,
// so weight selection stays a styling decision, not a loading one.
const sans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Humayd Mohamed",
  description: "Design portfolio",
  /*
   * Declared here rather than as app/icon.png, because the file convention
   * emits a single tag with no media control — and the mark is transparent, so
   * one ink cannot serve both. The white mark disappears on a light tab bar and
   * the black one on a dark bar.
   *
   * Named for the ground each sits on, as elsewhere: "on-dark" is the version
   * shown against a dark browser chrome, so it is the light artwork.
   */
  icons: {
    icon: [
      {
        url: "/icons/icon-on-light.png",
        media: "(prefers-color-scheme: light)",
        type: "image/png",
        sizes: "512x512",
      },
      {
        url: "/icons/icon-on-dark.png",
        media: "(prefers-color-scheme: dark)",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    /* iOS composites home-screen icons on the user's wallpaper and offers no
       media query, so this takes the dark mark, which survives a light or busy
       background better than a white one. */
    apple: { url: "/icons/apple-icon.png", sizes: "180x180" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme={DEFAULT_THEME}
      className={sans.variable}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
