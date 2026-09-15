/**
 * A logo under `public/logos/`, named for the ground it sits on — the same
 * convention and the same files as `Project["logo"]` in lib/projects.ts.
 */
export type Logo = {
  onDark: string;
  /**
   * Optional, unlike the project logos: a mark drawn in white is invisible on
   * the light canvas, so where only one artwork exists it is better to show
   * nothing in that theme than to point both keys at a file that vanishes.
   */
  onLight?: string;
};

/**
 * A client engagement carried out under an employer rather than a job of its
 * own. Consultancy work is genuinely nested like this, and flattening it into
 * five employers — which this file used to do — reads as five jobs in six
 * years and misstates the actual career.
 */
export type Client = {
  name: string;
  /** The title held on this engagement — it was not the same across all three. */
  role: string;
  /** Free text, matching Position["period"]. */
  period: string;
  logo?: Logo;
  description: string;
  /** The measurable outcomes, as the CV states them. */
  accomplishments?: string[];
};

export type Position = {
  role: string;
  company: string;
  logo?: Logo;
  /** Free text: the end is sometimes "Present", so this is not a date pair. */
  period: string;
  /** What the work actually was. Omitted where the clients carry the detail. */
  description?: string;
  accomplishments?: string[];
  /** Set only for consultancy roles, where the work was done for others. */
  clients?: Client[];
};

/** Most recent first. Content copied from the CV, which is the source of truth. */
export const EXPERIENCE: Position[] = [
  {
    // "Product & Design System Manager", not the "Product design manager" the
    // PDF still carries — the CV is the one that needs correcting here.
    role: "Product & Design System Manager",
    company: "Pura (Pure Health)",
    logo: {
      onDark: "/logos/pure-health-on-dark.svg",
      onLight: "/logos/pure-health-on-light.svg",
    },
    period: "June 2025 - Present",
    description:
      "Lead design operations across Pure Health's digital product (Pura) while building and managing a comprehensive design system. I was responsible for ensuring seamless design delivery while aligning product and design teams and streamlining workflows to improve team efficiency. I oversaw the design system's complete lifecycle, from component creation and documentation to implementation across design and development and ensuring consistent, scalable user experiences throughout Pura.",
    accomplishments: [
      "Built a scalable, tokenized design system from the ground up, introducing a tokenized system that increased component maintainability, ensured consistency across products, and reduced technical complexities and debt.",
      "Established streamlined workflows between product, design, and development teams, significantly improving delivery speed and output quality.",
      "Lead and mentored a team of designers ensuring world class experiences are delivered as part of the digital transformation that we are undergoing.",
    ],
  },
  {
    role: "Senior Product Designer",
    company: "Abu Dhabi Islamic Bank",
    logo: {
      onDark: "/logos/adib-on-dark.svg",
      onLight: "/logos/adib-on-light.svg",
    },
    period: "February 2023 - June 2025",
    description:
      "Led the following value streams: Personal Finance, Takaful Insurance, Children accounts, and the Design System (creation, documentation, and implementation). My work centred on enhancing existing customer journeys to improve usability and drive business growth as well as successfully launching new products within these value streams driving both user engagement and business growth.",
    accomplishments: [
      "Finance bookings via the ADIB Mobile app approached 31% of total Personal Finance & Al Yusr volumes booked, with Digital contributing to a 90%+ year-on-year growth.",
      "Takaful Insurance product purchases saw an increase of 650% in total product acquisitions digitally through the ADIB Mobile app as compared to the traditional in branch channel.",
    ],
  },
  {
    role: "Product Designer",
    company: "IQbusiness",
    logo: {
      onDark: "/logos/iqbusiness-on-dark.svg",
      /* Derived from the dark artwork by recolouring the wordmark's 24 white
         fills to black. The gradient mark beside it is brand colour and was
         left untouched. Replace with an official export if one exists. */
      onLight: "/logos/iqbusiness-on-light.svg",
    },
    period: "February 2020 - January 2023",
    // No description of its own: at a consultancy the work is the engagements,
    // and inventing a paragraph about the employer would say nothing the three
    // clients below do not say better.
    clients: [
      {
        name: "Absa",
        role: "Product Designer",
        period: "March 2021 - January 2023",
        logo: {
          onDark: "/logos/absa-on-dark.png",
          onLight: "/logos/absa-on-light.png",
        },
        description:
          "I enhanced products across both physical and voice channels, focusing on new-to-bank and new-to-product journeys for transactional products (CASA), personal loans, and credit cards. These enhancements not only improved the overall experience but also increased productivity and significantly reduced turnaround times for product acquisitions by reducing product inconsistencies and accelerating the delivery process.",
        accomplishments: [
          "Rolled out the Personal Loans journey, digitizing and streamlining the application process which led to increased product acquisition and user satisfaction.",
          "Contributed to the adoption of an omnichannel strategy, enabling customers to seamlessly acquire products through both physical and voice channels, ensuring a consistent and integrated experience.",
        ],
      },
      {
        name: "Clientêle",
        role: "Product Designer",
        period: "October 2020 - February 2021",
        logo: {
          onDark: "/logos/clientele-on-dark.svg",
          onLight: "/logos/clientele-on-light.svg",
        },
        description:
          "I oversaw the implementation of a design system that improved scalability and consistency across all products, achieving a reduction of 65+% in design and development time. I also created a culture where UX became a priority by involving stakeholders in design thinking workshops and user testing sessions. This hands-on approach allowed them to directly observe customer feedback on the current and future state we had for the mobile application, this aligned the team on the importance of user-centered design and driving meaningful experiences.",
        accomplishments: [
          "Achieving a reduction of 65+% in design and development time, measured by looking at delivery time before and after the design system was implemented.",
          "Established a culture where user-centered design became a priority, this allowed design to drive more impact and ensure that we were the voice of the customer in any discussion or decision that was being made.",
        ],
      },
      {
        name: "Nedbank",
        role: "UX Designer",
        period: "May 2020 - October 2020",
        logo: {
          onDark: "/logos/nedbank-on-dark.svg",
          onLight: "/logos/nedbank-on-light.svg",
        },
        description:
          "As part of the insurance design team, I focused on research and creating intuitive, user-friendly designs to enhance the customer experience. By analyzing data on insurance products predominantly purchased in-branch or through other channels, we identified key opportunities and successfully launched new products on Nedbank's mobile app. This initiative enabled customers to seamlessly purchase these products through a Straight-Through Process (STP), improving accessibility and convenience.",
        accomplishments: [
          "Enabled Funeral Insurance, Personal Accident Insurance, and Health Assist Insurance on the mobile app by leveraging customer data to identify high-demand products.",
        ],
      },
    ],
  },
];

export type ExperienceRow = {
  role: string;
  company: string;
  period: string;
};

/**
 * The career as a flat run of rows, one per place the work was actually done —
 * so a consultancy contributes its three clients rather than a single line.
 *
 * Derived rather than a second hand-maintained list, which is what makes it
 * safe: the résumé timeline and this cannot fall out of step, because there is
 * still only one place to edit.
 */
export const EXPERIENCE_ROWS: ExperienceRow[] = EXPERIENCE.flatMap((position) =>
  position.clients
    ? position.clients.map((client) => ({
        role: client.role,
        company: client.name,
        period: client.period,
      }))
    : [{ role: position.role, company: position.company, period: position.period }],
);

/** Closes the résumé — the work above, and what it is for. */
export const RESUME_QUOTE = {
  text:
    "Where do ideas come from? From looking at one thing, and seeing another. " +
    "From fooling around, from playing with possibilities, from speculating, " +
    "from changing, pushing, pulling, transforming, and if you’re lucky, you " +
    "come up with something worth saving, using, and building on. That’s where " +
    "the game stops and the work begins.",
  author: "Saul Bass",
};

/**
 * The downloadable CV. Drop the file at `public/resume.pdf` — the button hides
 * itself while it is missing, rather than offering a download that 404s.
 */
export const RESUME_FILE = "/resume.pdf";

/** First year of the earliest role, used to keep the experience stat honest. */
const CAREER_START_YEAR = 2020;

/** The professional summary, in your own words. */
export const RESUME_SUMMARY =
  "A seasoned Product Designer with experience working for top financial, insurance and healthcare companies in the UAE and South Africa. My passion lies in crafting user-friendly digital experiences that simplify complex processes and deliver real value to both businesses and their customers.";

export type ResumeStat = { value: string; label: string };

/**
 * Derived from the data above wherever possible, so they cannot quietly go
 * stale — the company count follows the list, and the years count rolls over on
 * its own each January.
 *
 * A function, not a const. A module-level array would be built once when the
 * module first loads and then hold that year for the life of the process, which
 * would defeat the résumé page's daily revalidate: the page would re-render and
 * read the same frozen number back. Calling this per render is what lets the
 * rollover actually reach the page.
 */
export function resumeStats(): ResumeStat[] {
  return [
    {
      value: `${new Date().getFullYear() - CAREER_START_YEAR}+`,
      label: "Years experience",
    },
    { value: `${EXPERIENCE.length}`, label: "Companies" },
    // Your figure, not derived — nothing in this file could count it.
    { value: "30+", label: "Products/features shipped" },
  ];
}
