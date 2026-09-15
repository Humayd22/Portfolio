import Image from "next/image";
import { ProductBento } from "@/components/ProductBento/ProductBento";
import { Tabs } from "@/components/Tabs/Tabs";
import { FEEDBACK_MARKS } from "@/lib/case-studies";
import type {
  CaseStudy as Study,
  CaseStudyImage,
  Placement,
  Track,
} from "@/lib/case-studies";
import type { Project } from "@/lib/projects";
import styles from "./CaseStudy.module.css";

/*
 * next/image, unlike the logos elsewhere in the project. These are large
 * photographic PNGs — two of them are 4800px wide — so the resizing and format
 * negotiation it does is worth having here, where it was not for a 9KB vector.
 * Dimensions come from the data so the space is reserved before the file loads
 * and nothing shifts as the page fills in.
 */
function Figure({
  image,
  className,
}: {
  image: CaseStudyImage;
  className?: string;
}) {
  const classes = [styles.figure, image.mark && styles.figureMark, className]
    .filter(Boolean)
    .join(" ");

  return (
    <figure className={classes}>
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        className={
          image.srcOnLight ? `${styles.image} ${styles.onDark}` : styles.image
        }
        sizes="(max-width: 60rem) 100vw, 60rem"
      />

      {/* Both variants render and CSS shows the right one — picking in JS means
          reading the theme after hydration, which flashes the wrong artwork. */}
      {image.srcOnLight ? (
        <Image
          src={image.srcOnLight}
          alt={image.alt}
          width={image.width}
          height={image.height}
          className={`${styles.image} ${styles.onLight}`}
          sizes="(max-width: 60rem) 100vw, 60rem"
        />
      ) : null}
    </figure>
  );
}

/*
 * Renders **double-asterisked** runs as bold, leaving everything else alone.
 * The alternative was putting markup in the content file, which would mean
 * every caller had to trust and sanitise it; this way the data stays plain
 * strings and only this one emphasis is possible.
 */
function Emphasised({ text }: { text: string }) {
  return (
    <>
      {text.split(/\*\*(.+?)\*\*/g).map((part, index) =>
        /* Odd indices are the captured groups, i.e. the emphasised runs. */
        index % 2 === 1 ? <strong key={index}>{part}</strong> : part,
      )}
    </>
  );
}

/* Percentages straight onto the element, since each card's position is data
   rather than something a stylesheet could know. */
function place({ left, top, width, height }: Placement): React.CSSProperties {
  return {
    left: `${left}%`,
    top: `${top}%`,
    width: `${width}%`,
    ...(height === undefined ? {} : { height: `${height}%` }),
  };
}

/** One strand's sections. Each is skipped where the content does not exist. */
function TrackPanel({ track }: { track: Track }) {
  return (
    <div className={styles.track}>
      {/*
       * The mark sits beside this block rather than above it. Stacked, it
       * pushed the facts and the figures down the page; alongside, it fills
       * width the prose column was leaving empty anyway.
       */}
      <div className={styles.lead}>
        <div className={styles.leadBody}>
          {/*
           * Facts beside the prose rather than above it: they are reference, not
           * narrative, so they sit in their own column and the reading column stays
           * uninterrupted from Challenge through to Results.
           */}
          {/* No facts column to leave room for on a strand that has none, so
              the prose starts at the page's edge rather than indented past an
              empty track. */}
          <div
            className={
              track.facts?.length ? styles.overview : `${styles.overview} ${styles.overviewWide}`
            }
          >
            {track.facts?.length ? (
              /*
               * A description list: each fact is a term and its value, and the
               * pairing survives the column collapsing on a narrow screen.
               */
              <dl className={styles.facts}>
                {track.facts.map((fact) => (
                  <div key={fact.label} className={styles.fact}>
                    <dt className={styles.factLabel}>{fact.label}</dt>
                    <dd className={styles.factValue}>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            <div className={styles.narrative}>
              {track.challenge ? (
                <section className={styles.section}>
                  <h2 className={styles.heading}>Challenge</h2>
                  <p className={styles.body}>
                    <Emphasised text={track.challenge} />
                  </p>
                </section>
              ) : null}

              {track.results ? (
                <section className={styles.section}>
                  <h2 className={styles.heading}>Results</h2>
                  <p className={styles.body}>
                    <Emphasised text={track.results} />
                  </p>
                </section>
              ) : null}
            </div>
          </div>

          {/* Full width, below both columns — the figures are the section's
            conclusion rather than part of the prose column. */}
          {track.stats?.length ? (
            <dl className={styles.stats}>
              {track.stats.map((stat) => (
                <div key={stat.label} className={styles.stat}>
                  {/* Reversed visually so the number reads first, while the DOM
                    keeps term before definition. */}
                  <dt className={styles.statLabel}>{stat.label}</dt>
                  <dd className={styles.statValue}>{stat.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>

        {track.hero ? (
          <Figure image={track.hero} className={styles.leadArt} />
        ) : null}
      </div>

      {track.screens?.length ? (
        <div className={styles.screens}>
          {track.screens.map((image) => (
            <Figure key={image.src} image={image} />
          ))}
        </div>
      ) : null}

      {track.gallery?.length ? <ProductBento tiles={track.gallery} /> : null}

      {track.approach ? (
        <section className={styles.section}>
          {/* The approach's own line IS the heading — it states the decision
              rather than labelling the section, so a generic title above it
              would only get in the way. */}
          <h2 className={styles.heading}>{track.approach.title}</h2>
          <p className={`${styles.body} ${styles.highlight}`}>
            <Emphasised text={track.approach.body} />
          </p>
        </section>
      ) : null}

      {track.process?.length ? (
        <section className={styles.section}>
          <h2 className={styles.heading}>My process</h2>

          {/*
           * Ordered: these are stages that happened in sequence, and a screen
           * reader announcing "3 of 5" carries that shape.
           */}
          <ol className={styles.process}>
            {track.process.map((step, index) => (
              <li key={step.title} className={styles.step}>
                <span className={styles.stepNumber} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.body}>{step.body}</p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {track.evidence?.length ? (
        <div className={styles.evidence}>
          {track.evidence.map((image) => (
            <Figure key={image.src} image={image} />
          ))}
        </div>
      ) : null}

      {track.quotes?.length ? (
        <section className={styles.section}>
          {/*
           * The original board rebuilt as markup. Every card is placed by
           * percentages measured off the artwork, inside a fixed-ratio box — so
           * the composition holds exactly, and at any width the whole thing
           * scales as one piece rather than reflowing. That is also what the
           * flat image it replaces used to do.
           */}
          <div className={styles.board}>
            <div className={styles.boardStage}>
              {/* Decorative: the blockquotes below already carry the quoting. */}
              {FEEDBACK_MARKS.map((mark) => (
                <span
                  key={mark.kind}
                  className={styles.mark}
                  style={{ left: `${mark.left}%`, top: `${mark.top}%` }}
                  aria-hidden="true"
                >
                  {mark.kind === "open" ? "\u201C" : "\u201D"}
                </span>
              ))}

              <h2 className={styles.wordmark}>Customer feedback.</h2>

              {track.quotes.map((quote) => (
                <figure
                  key={quote.avatar}
                  className={`${styles.card} ${styles.quote}`}
                  style={place(quote.at)}
                >
                  <Image
                    src={quote.avatar}
                    alt={quote.name}
                    width={256}
                    height={256}
                    className={styles.avatar}
                    sizes="80px"
                  />
                  {/* blockquote, so each is marked as quoted speech rather than
                      as prose that happens to sit in a card. */}
                  <blockquote className={styles.quoteBody}>{quote.body}</blockquote>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {track.conclusion ? (
        /* Centred and set larger than the body copy: it closes the study, so it
           reads as a statement rather than as one more section of prose. */
        <section className={`${styles.section} ${styles.closing}`}>
          <h2 className={styles.heading}>Conclusion</h2>
          <p className={`${styles.body} ${styles.closingBody}`}>{track.conclusion}</p>
        </section>
      ) : null}

      {track.placeholder ? (
        <p className={styles.placeholder}>{track.placeholder}</p>
      ) : null}
    </div>
  );
}

export function CaseStudy({
  project,
  study,
}: {
  project: Project;
  study: Study;
}) {
  return (
    <article className={styles.study}>
      <p className={styles.intro}>{project.summary}</p>

      {/* A single strand needs no tabs to choose between. */}
      {study.tracks.length === 1 ? (
        <TrackPanel track={study.tracks[0]} />
      ) : (
        <Tabs
          label="Strands of this project"
          tabs={study.tracks.map((track) => ({
            id: track.id,
            label: track.label,
            panel: <TrackPanel track={track} />,
          }))}
        />
      )}
    </article>
  );
}
