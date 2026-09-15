export type Product = {
  name: string;
  tagline: string;
  description: string;
  /** Screenshot or mockup under `public/`. */
  image?: string;
  appStore: string;
  playStore: string;
  /** Where desktop visitors go — they cannot install from a store page. */
  website: string;
};

export const PINIT: Product = {
  name: "Pinit",
  tagline: "Never lose a great spot again.",
  description:
    "A home for every place you love. Saved, organised by category, and ready the moment someone asks for a recommendation. Built and shipped end to end, on iOS and Android.",
  image: "/pinit.jpg",
  appStore: "https://apps.apple.com/us/app/pin-t/id6772275587",
  playStore: "https://play.google.com/store/apps/details?id=com.pinit.mobile",
  website: "https://www.pinit.website/",
};

/**
 * The path the smart QR encodes. A single URL for both platforms: the route
 * behind it reads the scanning device's user agent and forwards to the right
 * store, so one printed code serves iOS, Android and desktop.
 */
export const SMART_LINK_PATH = "/get/pinit";

/**
 * Absolute origin for that link. A QR has to carry a full URL — it is scanned
 * by a device that has no idea what site it came from, so a relative path is
 * meaningless.
 *
 * Vercel supplies the production domain automatically; NEXT_PUBLIC_SITE_URL
 * overrides it for any other host. The localhost fallback is only ever right in
 * development, where the code is unscannable by an external phone anyway.
 */
export function siteOrigin(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}
