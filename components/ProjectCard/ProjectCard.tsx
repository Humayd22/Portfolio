import Link from "next/link";
import { LottieBackground } from "@/components/LottieBackground/LottieBackground";
import { GRADIENTS, frameSrc } from "@/lib/gradients";
import type { Project } from "@/lib/projects";
import styles from "./ProjectCard.module.css";

function ArrowIcon() {
  return (
    <svg
      className={styles.arrow}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

/** Which artwork sits behind a card: one still frame, or the animation itself. */
export type Background = number | "animation";

export function ProjectCard({
  project,
  featured = false,
  background,
  editing = false,
  controls,
}: {
  project: Project;
  /** Renders wide, above the grid: the mark beside the copy rather than over it. */
  featured?: boolean;
  /** Overrides the gradient's own default. Ignored where a project has none. */
  background?: Background;
  /** While editing, the card stops being a link so the picker can be used. */
  editing?: boolean;
  controls?: React.ReactNode;
}) {
  const { slug, title, summary, logo, client, stats, gradient } = project;

  const art = gradient ? GRADIENTS[gradient] : undefined;
  const showing = background ?? art?.defaultFrame ?? "animation";

  /*
   * Either treatment puts pale artwork behind the card in BOTH themes, so the
   * contents have to stop following the theme's ink. One flag drives that,
   * rather than each background having to remember to ask for it.
   */
  const lightGround = Boolean(art);

  const body = (
    <>
      {art ? (
        showing === "animation" ? (
          <>
            {/*
             * The first frame, underneath. On a phone this is the whole
             * background: the player above it is display:none below the
             * breakpoint, so its IntersectionObserver never fires and
             * lottie-web is never fetched — not fetched and paused, not
             * fetched and hidden. On anything wider the player covers this
             * completely, so it costs one cached SVG.
             */}
            <div
              className={styles.still}
              style={{
                backgroundImage: `url("${frameSrc(art.key, art.frames[0])}")`,
              }}
              aria-hidden="true"
            />
            <LottieBackground src={art.animation} />
          </>
        ) : (
          <div
            className={styles.still}
            style={{ backgroundImage: `url("${frameSrc(art.key, showing)}")` }}
            aria-hidden="true"
          />
        )
      ) : null}

      {/* Fixed-height slot whether or not a logo exists yet, so headings line
          up across a row. */}
      <div className={styles.logo}>
        {logo ? (
          /*
           * Both variants are rendered and CSS shows the right one. Choosing in
           * JS would mean reading the theme after hydration, which flashes the
           * wrong mark on first paint — the same problem the theme script
           * exists to solve.
           */
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo.onDark}
              alt={client}
              className={`${styles.logoImg} ${styles.onDark}`}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo.onLight}
              alt={client}
              className={`${styles.logoImg} ${styles.onLight}`}
            />
          </>
        ) : (
          <span className={styles.logoFallback}>{client}</span>
        )}
      </div>

      {/* Pinned to the card, not to the heading, so every card's arrow lands in
          the same place regardless of how its title wraps. */}
      <ArrowIcon />

      {/* Copy and figures in one column. The featured card lays its children
          out in a row, and without this the stats become a third column beside
          the summary rather than sitting under it. */}
      <div className={styles.column}>
        <div className={styles.body}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.summary}>{summary}</p>
        </div>

        {/*
         * A description list: each stat is genuinely a term and its value, and
         * the pairing survives when the two columns collapse on narrow screens.
         *
         * Skipped entirely where a project has no figures yet — an empty list
         * still occupies the foot of the card and knocks the row out of step.
         */}
        {stats?.length ? (
          <dl className={styles.stats}>
            {stats.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <dt className={styles.statLabel}>{stat.label}</dt>
                <dd className={styles.statValue}>{stat.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>

      {controls}
    </>
  );

  const className = [
    styles.card,
    featured && styles.featured,
    lightGround && styles.lightGround,
  ]
    .filter(Boolean)
    .join(" ");

  /*
   * A div while editing, not a disabled link. The whole card is the link
   * target, so leaving it live would mean every click on a swatch also
   * navigated away — and a link that silently swallows its own clicks is worse
   * than one that is plainly not a link for the moment.
   */
  return editing ? (
    <div className={className}>{body}</div>
  ) : (
    <Link href={`/work/${slug}`} className={className}>
      {body}
    </Link>
  );
}
