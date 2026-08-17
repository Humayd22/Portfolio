import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
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
  description: "Design and engineering portfolio.",
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
      </head>
      <body>{children}</body>
    </html>
  );
}
