export type ProjectStat = {
  label: string;
  value: string;
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  /**
   * Client logo SVGs under `public/logos/`, named for the theme they appear in
   * — `onDark` is the version that sits on the dark theme, so it is usually the
   * light-coloured artwork, and vice versa. Naming by context rather than by
   * ink colour is what stops the two being swapped by mistake.
   *
   * Point both keys at the same file for a full-colour mark that works either
   * way. Omit entirely and the client's name stands in.
   */
  logo?: {
    onDark: string;
    onLight: string;
  };
  /** Used as the logo's alt text, and shown if there is no logo yet. */
  client: string;
  /** Optional: a card with no figures yet renders without the block. */
  stats?: ProjectStat[];
  /**
   * Key into GRADIENTS. Decides which brand artwork sits behind the card, and
   * which frames the "Edit background" control offers for it. Omit for a
   * project with no artwork yet — the card keeps the plain surface.
   */
  gradient?: string;
};

/**
 * The current work, shown above the grid at full width rather than as one tile
 * among four. It is the only project still being built, so it leads.
 */
export const FEATURED_PROJECT: Project = {
  slug: "pura",
  client: "Pura by PureHealth",
  gradient: "pura",
  logo: {
    onDark: "/logos/pure-health-on-dark.svg",
    onLight: "/logos/pure-health-on-light.svg",
  },
  title: "Product design, design systems and ops for Pura",
  summary:
    "Lead design operations across Pure Health's digital product while building and managing a comprehensive design system, from component creation and documentation through to implementation across design and development, ensuring consistent, scalable experiences throughout Pura.",
  // NEEDS YOUR NUMBERS. The CV gives no figures for this role, and the card
  // renders without the block rather than carrying invented ones.
};

export const PROJECTS: Project[] = [
  {
    slug: "adib",
    client: "ADIB",
    logo: {
      onDark: "/logos/adib-on-dark.svg",
      onLight: "/logos/adib-on-light.svg",
    },
    gradient: "adib",
    title: "Driving growth and innovation at ADIB",
    summary:
      "I led the Personal Finance, Takaful Insurance, Children accounts and Design System value streams, focused on enhancing existing and new customer journeys to improve usability and drive business growth.",
    stats: [
      { label: "Personal Finance sales increase", value: "31%" },
      { label: "Takaful (Insurance) sales increase", value: "650%" },
    ],
  },
  {
    slug: "absa",
    client: "ABSA",
    gradient: "absa",
    // The ABSA mark is a single red that works on either ground, so both
    // variants are the same file.
    logo: {
      onDark: "/logos/absa-on-dark.png",
      onLight: "/logos/absa-on-light.png",
    },
    title: "Salesforce migration and adoption at ABSA",
    summary:
      "I enhanced products across both physical and voice channels, focusing on new-to-bank and new-to-product journeys for transactional products (CASA), personal loans, and credit cards.",
    stats: [{ label: "Features/products launched & enhanced", value: "20+" }],
  },
  {
    slug: "clientele",
    client: "Clientèle",
    logo: {
      onDark: "/logos/clientele-on-dark.svg",
      onLight: "/logos/clientele-on-light.svg",
    },
    gradient: "clientele",
    title: "Clientele Insurance design system",
    summary:
      "I developed a comprehensive design system that established a strong foundation for the design team. This system was crafted with a focus on scalability, productivity, and consistency, enabling the team to work more efficiently and cohesively. It improved both design and code quality, minimized siloed knowledge which enabled collaboration between designers and product teams.",
    stats: [{ label: "Reduction in Design and Development time", value: "65%" }],
  },
  {
    slug: "nedbank",
    client: "Nedbank",
    logo: {
      onDark: "/logos/nedbank-on-dark.svg",
      onLight: "/logos/nedbank-on-light.svg",
    },
    gradient: "nedbank",
    title: "Enhancing Nedbanks insurance capabilities",
    summary:
      "I focused on research and creating intuitive, user-friendly designs to enhance the customer experience. By analyzing data on insurance products predominantly purchased in-branch or through other channels, we identified key opportunities and successfully launched new products on Nedbank's mobile app.",
    stats: [{ label: "New products launched", value: "3" }],
  },
];
