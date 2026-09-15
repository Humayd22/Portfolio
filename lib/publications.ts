export type Publication = {
  title: string;
  /** The line under the title on the cover, where there is one. */
  subtitle?: string;
  year: string;
  /** Cover image under `public/books/`. Falls back to a plate until one exists. */
  cover?: string;
  url: string;
};

/**
 * Most recent first.
 *
 * URLs are the canonical /dp/<ASIN> form rather than the long share links,
 * which carry session and referral parameters that expire and would leak a
 * browsing session into the page source.
 */
export const PUBLICATIONS: Publication[] = [
  {
    title: "Lessons: I wish I learnt earlier",
    year: "2024",
    cover: "/books/lessons.jpg",
    url: "https://www.amazon.co.uk/dp/B0CSZ829MS",
  },
  {
    title: "I'm twenty. Now what?",
    subtitle: "A journey of transformation",
    year: "2023",
    cover: "/books/im-twenty.jpg",
    url: "https://www.amazon.co.uk/dp/B0CHLCBLL8",
  },
];

/** The author page, shown beneath the books as a catch-all. */
export const AUTHOR_URL =
  "https://www.amazon.co.uk/stores/author/B0CWGXZZMX/allbooks";
