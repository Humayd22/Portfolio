import Image from "next/image";
import {
  AndroidLogo,
  AppleLogo,
  Monitor,
} from "@phosphor-icons/react/dist/ssr";
import { ExpandableImage } from "@/components/ExpandableImage/ExpandableImage";
import { ProductBento } from "@/components/ProductBento/ProductBento";
import { Tabs } from "@/components/Tabs/Tabs";
import { FEEDBACK_MARKS } from "@/lib/case-studies";
import type {
  CaseStudy as Study,
  CaseStudyImage,
  PipelineNode,
  Placement,
  Track,
  Typeface,
} from "@/lib/case-studies";
import type { Project } from "@/lib/projects";
import styles from "./CaseStudy.module.css";

/** The label and icon a platform id renders as — kept out of the data so
    "iOS"/"Android"/"Web" can't drift out of sync with a typo'd string. */
const PLATFORMS: Record<
  Typeface["platform"],
  { label: string; icon: typeof AppleLogo }
> = {
  ios: { label: "iOS", icon: AppleLogo },
  android: { label: "Android", icon: AndroidLogo },
  web: { label: "Web", icon: Monitor },
};

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

/** One box in the token pipeline. Its own component only because it renders
    five times, three of them inside a nested group. */
function PipeNode({ node }: { node: PipelineNode }) {
  return (
    <div className={styles.pipeNode}>
      {/* The badge shares the meta's line rather than being absolutely placed:
          the meta is the longest thing that could collide with it, and a row
          lets the two negotiate instead of overlapping. */}
      <div className={styles.pipeHead}>
        <span className={styles.pipeMeta}>{node.meta}</span>
        {/* How this one is fed. On the card rather than on the arrow into the
            group, because the three consumers are not fed alike. */}
        {node.via ? (
          <span className={styles.pipeVia} data-kind={node.via.kind}>
            {node.via.label}
          </span>
        ) : null}
      </div>
      <span className={styles.pipeName}>{node.name}</span>
      <p className={styles.pipeDetail}>{node.detail}</p>
    </div>
  );
}

/**
 * A section's heading, dropped when it only repeats the chapter tab directly
 * above it.
 *
 * Rendering both leaves the page saying "Foundations" twice in two sizes. The
 * panel already carries aria-labelledby pointing at its tab, so nothing is
 * lost by leaving the visible one out.
 */
function SectionHeading({
  children,
  omit,
}: {
  children: string;
  omit?: string;
}) {
  if (children === omit) return null;
  return <h2 className={styles.heading}>{children}</h2>;
}

/**
 * Everything below a strand's lead. Split out so it can be rendered either
 * straight through or once per chapter, from the same code.
 */
function TrackSections({
  track,
  omitHeading,
}: {
  track: Track;
  omitHeading?: string;
}) {
  return (
    <>
      {track.screens?.length ? (
        <div className={styles.screens}>
          {track.screens.map((image) => (
            <Figure key={image.src} image={image} />
          ))}
        </div>
      ) : null}

      {track.gallery?.length ? <ProductBento tiles={track.gallery} /> : null}

      {track.typography ? (
        <section id={`${track.id}-typography`} className={styles.section}>
          <SectionHeading omit={omitHeading}>
            Platform typography
          </SectionHeading>
          <p className={styles.body}>{track.typography.note}</p>

          {/* Full width, below the prose — the same rhythm as Challenge/
              Results into Stats: narrative first, then the compact facts
              that back it up. */}
          <dl className={styles.typography}>
            {track.typography.faces.map((face) => {
              const platform = PLATFORMS[face.platform];
              const Icon = platform.icon;
              return (
                <div key={face.platform} className={styles.typeface}>
                  {/* Platform, then the typeface it names, then the scale it
                      comes in — term before definition before supporting
                      detail, in both DOM order and reading order now, so
                      there's no reversal trick to keep in sync. */}
                  <dt className={styles.typefacePlatform}>
                    <Icon
                      weight="light"
                      className={styles.typefaceIcon}
                      aria-hidden="true"
                    />
                    {platform.label}
                  </dt>
                  <dd className={styles.typefaceName}>{face.typeface}</dd>
                  {/* Not part of the term/definition pair — the dl content
                      model allows plain elements alongside dt/dd inside each
                      entry's wrapping div. Only the repeated "Aa" glyphs are
                      decorative; the role and size labels are the actual
                      content, so they stay in the accessibility tree. */}
                  <div className={styles.typefaceRamp}>
                    {face.scale.map((step) => (
                      <div key={step.role} className={styles.typefaceStep}>
                        <span
                          className={styles.typefaceGlyph}
                          style={{ fontSize: `${step.size / 16}rem` }}
                          aria-hidden="true"
                        >
                          Aa
                        </span>
                        <span className={styles.typefaceStepLabel}>
                          {step.role} {step.size}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </dl>
        </section>
      ) : null}

      {track.foundations ? (
        <section id={`${track.id}-foundations`} className={styles.section}>
          <SectionHeading omit={omitHeading}>
            {track.foundations.heading}
          </SectionHeading>
          {track.foundations.note ? (
            <p className={styles.body}>{track.foundations.note}</p>
          ) : null}

          {track.foundations.colors ? (
            <div className={styles.subsection}>
              <h3 className={styles.subheading}>
                {track.foundations.colors.label}
              </h3>
              {track.foundations.colors.note ? (
                <p className={styles.subnote}>
                  {track.foundations.colors.note}
                </p>
              ) : null}

              <div className={styles.palettes}>
                {track.foundations.colors.palettes.map((palette) => (
                  <div key={palette.name} className={styles.palette}>
                    <span className={styles.paletteName}>{palette.name}</span>
                    <div className={styles.ramp}>
                      {palette.steps.map((step) => (
                        <div key={step.step} className={styles.rampStep}>
                          {/* The swatch carries the real hex inline — these are
                            the product's values, not the site's own tokens.
                            Alpha ramps get a fixed plate underneath and the
                            value as a flat gradient on top, so a 5% black
                            reads as 5% black rather than as the page. */}
                          <span
                            className={styles.rampChip}
                            style={
                              palette.plate
                                ? {
                                    backgroundColor: palette.plate,
                                    backgroundImage: `linear-gradient(${step.value}, ${step.value})`,
                                  }
                                : { backgroundColor: step.value }
                            }
                            aria-hidden="true"
                          />
                          <span className={styles.rampLabel}>{step.step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {track.foundations.typeRamp ? (
            <div className={styles.subsection}>
              <h3 className={styles.subheading}>
                {track.foundations.typeRamp.label}
              </h3>
              {track.foundations.typeRamp.note ? (
                <p className={styles.subnote}>
                  {track.foundations.typeRamp.note}
                </p>
              ) : null}

              <div className={styles.typeRamp}>
                {track.foundations.typeRamp.tiers.map((tier) => (
                  <div key={tier.name} className={styles.typeTier}>
                    <div className={styles.typeTierHead}>
                      <span className={styles.typeTierName}>{tier.name}</span>
                      <span className={styles.typeTierFace}>{tier.face}</span>
                    </div>
                    {tier.styles.map((style) => (
                      <div key={style.name} className={styles.typeRow}>
                        <span className={styles.typeMeta}>
                          <span className={styles.typeName}>{style.name}</span>
                          <span className={styles.typeNumbers}>
                            {style.size}/{style.lineHeight} · {style.tracking}
                          </span>
                        </span>
                        {/* Set at its real size where that fits the column, and
                          at `render` where it doesn't — the printed figures
                          beside it stay the actual ones either way. */}
                        <span
                          className={styles.typeSpecimen}
                          style={{
                            fontSize: `${style.render ?? style.size}px`,
                            letterSpacing: `${style.tracking}px`,
                          }}
                        >
                          Pura
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {track.foundations.units ? (
            <div className={styles.subsection}>
              <h3 className={styles.subheading}>
                {track.foundations.units.label}
              </h3>
              {track.foundations.units.note ? (
                <p className={styles.subnote}>{track.foundations.units.note}</p>
              ) : null}

              <div>
                {/* A real table: the mapping is tabular, and the row/column
                    headers are what make it navigable without sight of the
                    alignment that carries it visually. */}
                <table className={styles.unitTable}>
                  <thead>
                    <tr>
                      {/* The column classes belong on this row: under
                          table-layout: fixed the widths are read from the
                          first row alone, and they also drop the bar column's
                          header in step with its cells on a narrow screen. */}
                      <th scope="col" className={styles.unitCell}>
                        Unit
                      </th>
                      <th scope="col" className={styles.unitBarCell}>
                        Value
                      </th>
                      <th scope="col">Spacing</th>
                      <th scope="col">Radius</th>
                      <th scope="col">Border weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {track.foundations.units.rows.map((row) => (
                      <tr key={row.unit}>
                        <th scope="row" className={styles.unitCell}>
                          {row.unit}
                        </th>
                        <td className={styles.unitBarCell}>
                          {/* Inner wrapper, not the cell itself: a display:flex
                              td drops out of the table layout and takes the
                              fixed column widths with it. */}
                          <span className={styles.unitBarWrap}>
                            <span className={styles.unitValue}>
                              {row.value}
                            </span>
                            {/* Drawn at its real value, matching the spacing
                                scale above, so the ramp reads as a ramp. */}
                            <span
                              className={styles.unitBar}
                              style={{ width: `${row.value}px` }}
                              aria-hidden="true"
                            />
                          </span>
                        </td>
                        {([row.spacing, row.radius, row.border] as const).map(
                          (tokens, i) => (
                            <td key={i} className={styles.unitTokens}>
                              {tokens?.length ? (
                                tokens.map((t) => (
                                  <span key={t} className={styles.unitToken}>
                                    {t}
                                  </span>
                                ))
                              ) : (
                                <span
                                  className={styles.unitEmpty}
                                  aria-label="none"
                                >
                                  ·
                                </span>
                              )}
                            </td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>

                {track.foundations.units.exceptions?.length ? (
                  <div className={styles.unitExceptions}>
                    {track.foundations.units.exceptionsNote ? (
                      <p className={styles.unitExceptionsNote}>
                        {track.foundations.units.exceptionsNote}
                      </p>
                    ) : null}
                    <dl className={styles.findingList}>
                      {track.foundations.units.exceptions.map((e) => (
                        <div key={e.token} className={styles.finding}>
                          <dt className={styles.findingLabel}>
                            {e.token}
                            <span className={styles.findingValue}>
                              {e.value}
                            </span>
                          </dt>
                          <dd className={styles.findingBody}>{e.why}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      {track.pipeline ? (
        <section id={`${track.id}-pipeline`} className={styles.section}>
          <SectionHeading omit={omitHeading}>
            {track.pipeline.heading}
          </SectionHeading>
          {track.pipeline.note ? (
            <p className={styles.body}>{track.pipeline.note}</p>
          ) : null}

          {/*
           * An ordered list, because the order is the content: a reader with a
           * screen reader gets "1 of 3" rather than three unrelated panels.
           * The links between them are the diagram's actual argument, so they
           * are elements with text, not CSS arrows a screen reader never sees.
           */}
          <ol className={styles.pipeline}>
            <li className={styles.pipeStage}>
              <PipeNode node={track.pipeline.source} />
            </li>

            <li
              className={styles.pipeLink}
              data-kind={track.pipeline.toHandoff.kind}
            >
              <span className={styles.pipeLinkLabel}>
                {track.pipeline.toHandoff.label}
              </span>
            </li>

            <li className={styles.pipeStage}>
              <PipeNode node={track.pipeline.handoff} />
            </li>

            <li
              className={styles.pipeLink}
              data-kind={track.pipeline.toConsumers.kind}
            >
              <span className={styles.pipeLinkLabel}>
                {track.pipeline.toConsumers.label}
              </span>
            </li>

            {/* The three consumers share one stage: they are parallel, not
                sequential, and stacking them says so without an arrow
                between them implying an order that does not exist. */}
            <li className={styles.pipeStage}>
              <div className={styles.pipeFanOut}>
                {track.pipeline.consumers.map((node) => (
                  <PipeNode key={node.name} node={node} />
                ))}
              </div>
            </li>
          </ol>
        </section>
      ) : null}

      {track.colorSystem ? (
        <section id={`${track.id}-color-system`} className={styles.section}>
          <SectionHeading omit={omitHeading}>Color system</SectionHeading>
          <p className={styles.body}>{track.colorSystem.note}</p>

          {/*
           * Each tier is one wrapping div holding a dt (the tier name) and two
           * dd's (its accent and surface) as direct children — the dl content
           * model allows a div per group, but forbids further nesting inside
           * it, so the tier name is forced onto its own row in CSS instead of
           * markup (flex-basis: 100%) rather than with an extra wrapper.
           */}
          <dl className={styles.colorSystem}>
            {track.colorSystem.tiers.map((tier) => (
              <div key={tier.tier} className={styles.tierCard}>
                <dt className={styles.tierName}>{tier.tier}</dt>
                <dd className={styles.swatch}>
                  <span
                    className={styles.swatchChip}
                    style={{ backgroundColor: tier.accent }}
                    aria-hidden="true"
                  />
                  <span className={styles.swatchLabel}>
                    Accent
                    <br />
                    {tier.accent.toUpperCase()}
                  </span>
                </dd>
                <dd className={styles.swatch}>
                  <span
                    className={styles.swatchChip}
                    style={{ backgroundColor: tier.surface }}
                    aria-hidden="true"
                  />
                  <span className={styles.swatchLabel}>
                    Surface
                    <br />
                    {tier.surface.toUpperCase()}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {/* Bare, no heading — a components sheet reads for itself, unlike the
          two sections above it which both needed prose to state a mechanism
          the image alone couldn't. */}
      {track.components?.length ? (
        <div className={styles.componentPreviews}>
          {track.components.map((image) => (
            <ExpandableImage
              key={image.src}
              src={image.src}
              alt={image.alt}
              className={
                image.alwaysDark
                  ? `${styles.componentPreview} ${styles.componentPreviewOnDark}`
                  : styles.componentPreview
              }
            />
          ))}
        </div>
      ) : null}

      {track.approach
        ? (Array.isArray(track.approach)
            ? track.approach
            : [track.approach]
          ).map((item, index) => (
            <section
              key={item.title}
              /* Indexed, because a strand can carry several of these and an
                 id has to stay unique within the page. */
              id={`${track.id}-approach${index || ""}`}
              className={styles.section}
            >
              {/* The heading goes inside the prose column when there is a
                  screenshot beside it. Left spanning the full width, it puts
                  the image's top edge level with the first paragraph instead
                  of with the heading, which reads as a misalignment rather
                  than a choice. */}
              <div
                className={[
                  item.aside && styles.withAside,
                  item.asideArt && styles.withAsideArt,
                  item.asideLeft && styles.withAsideLeft,
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={
                  item.asideWidth
                    ? ({
                        "--aside-w": `${item.asideWidth}rem`,
                      } as React.CSSProperties)
                    : undefined
                }
              >
                {/* Always the flex column, aside or not: without it the
                    heading and paragraphs stop being flex children of the
                    section and lose the gap between them. */}
                <div className={styles.asideProse}>
                  {/* The approach's own line IS the heading: it states the
                      decision rather than labelling the section. */}
                  <SectionHeading omit={omitHeading}>
                    {item.title}
                  </SectionHeading>

                  {/* Split on blank lines: the field holds one idea in some
                      strands and three paragraphs in others, and running them
                      together as one block loses the argument's structure. */}
                  {item.body.split("\n\n").map((para) => (
                    <p
                      key={para.slice(0, 32)}
                      className={`${styles.body} ${styles.highlight}`}
                    >
                      <Emphasised text={para} />
                    </p>
                  ))}
                </div>

                {item.aside && item.asideArt ? (
                  /* One set of props, two wrappers: the expandable one adds the
                     trigger and dialog around the identical image, so opening
                     it is the only difference and the closed state cannot
                     drift between the two. */
                  (() => {
                    const art = {
                      src: item.aside.src,
                      alt: item.aside.alt,
                      width: item.aside.width,
                      height: item.aside.height,
                      className: styles.asideArt,
                      /* Never drawn larger than it was made: a 230px mark in a
                         44rem column would otherwise upscale threefold. */
                      style: { maxWidth: `min(100%, ${item.aside.width}px)` },
                      sizes: "(max-width: 64rem) 100vw, 44rem",
                    };

                    /* alt is in `art`, but repeated explicitly: the a11y lint
                       rule cannot see through a spread, and an image losing its
                       alt text is exactly the thing that rule exists to catch. */
                    return item.aside.expandable ? (
                      <ExpandableImage {...art} alt={art.alt} />
                    ) : (
                      <Image {...art} alt={art.alt} />
                    );
                  })()
                ) : item.aside ? (
                  <ExpandableImage
                    src={item.aside.src}
                    alt={item.aside.alt}
                    className={styles.shot}
                  />
                ) : null}
              </div>

              {item.screens?.length ? (
                <div className={styles.screenRow}>
                  {item.screens.map((image) => (
                    <ExpandableImage
                      key={image.src}
                      src={image.src}
                      alt={image.alt}
                      className={styles.screenShot}
                    />
                  ))}
                </div>
              ) : null}

              {item.images?.length ? (
                <div className={styles.shots}>
                  {item.images.map((image) => (
                    <ExpandableImage
                      key={image.src}
                      src={image.src}
                      alt={image.alt}
                      className={styles.shot}
                    />
                  ))}
                </div>
              ) : null}
            </section>
          ))
        : null}

      {track.artefacts ? (
        <section id={`${track.id}-artefacts`} className={styles.section}>
          {track.artefacts.sub ? (
            <h3 className={styles.subheading}>{track.artefacts.heading}</h3>
          ) : (
            <SectionHeading omit={omitHeading}>
              {track.artefacts.heading}
            </SectionHeading>
          )}

          <div className={styles.artefacts}>
            {track.artefacts.items.map((item) => (
              <div key={item.title} className={styles.artefact}>
                {/* A level down again when the group itself is a subheading,
                    so the outline stays a tree rather than two peers. */}
                {track.artefacts?.sub ? (
                  <h4 className={styles.stepTitle}>{item.title}</h4>
                ) : (
                  <h3 className={styles.stepTitle}>{item.title}</h3>
                )}
                <p className={styles.body}>{item.body}</p>
                {item.image ? (
                  <Figure image={item.image} className={styles.artefactImage} />
                ) : null}
                {item.images?.length ? (
                  <div className={styles.artefactImages}>
                    {item.images.map((image) => (
                      <Figure
                        key={image.src}
                        image={image}
                        className={styles.artefactImageSmall}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {track.comparison ? (
        <section id={`${track.id}-comparison`} className={styles.section}>
          {track.comparison.sub ? (
            <h3 className={styles.subheading}>{track.comparison.heading}</h3>
          ) : (
            <SectionHeading omit={omitHeading}>
              {track.comparison.heading}
            </SectionHeading>
          )}
          {track.comparison.note ? (
            <p className={styles.subnote}>{track.comparison.note}</p>
          ) : null}

          <table className={styles.compare}>
            <thead>
              <tr>
                <th scope="col" className={styles.compareLabel}>
                  Checked
                </th>
                <th scope="col" className={styles.compareExpected}>
                  <span className={styles.compareColName}>
                    {track.comparison.reference.name}
                  </span>
                  <span className={styles.compareColMeta}>
                    {track.comparison.reference.meta}
                  </span>
                </th>
                {track.comparison.columns.map((col) => (
                  <th key={col.name} scope="col">
                    <span className={styles.compareColName}>{col.name}</span>
                    <span className={styles.compareColMeta}>{col.meta}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {track.comparison.rows.map((row) => (
                <tr key={row.label}>
                  <th scope="row" className={styles.compareLabel}>
                    {row.label}
                  </th>
                  <td className={styles.compareExpected}>{row.expected}</td>
                  {row.actual.map((cell, i) => (
                    <td
                      key={track.comparison!.columns[i].name}
                      className={styles.compareCell}
                      data-ok={cell.ok}
                    >
                      {/* The mark carries the verdict for anyone who cannot
                          see that the matching cells are the quiet ones. */}
                      <span className={styles.compareMark} aria-hidden="true">
                        {cell.ok ? "\u00b7" : "\u2715"}
                      </span>
                      {cell.value}
                      <span className={styles.srOnly}>
                        {cell.ok ? " matches" : " differs"}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}

      {track.process?.length ? (
        <section id={`${track.id}-process`} className={styles.section}>
          <SectionHeading omit={omitHeading}>
            {track.processHeading ?? "My process"}
          </SectionHeading>
          {track.processNote ? (
            <p className={styles.body}>{track.processNote}</p>
          ) : null}

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

      {track.details ? (
        <section id={`${track.id}-details`} className={styles.section}>
          {track.details.sub ? (
            <h3 className={styles.subheading}>{track.details.heading}</h3>
          ) : (
            <SectionHeading omit={omitHeading}>
              {track.details.heading}
            </SectionHeading>
          )}
          {track.details.note ? (
            <p className={styles.body}>{track.details.note}</p>
          ) : null}

          <dl className={styles.findingList}>
            {track.details.items.map((item) => (
              <div key={item.label} className={styles.finding}>
                <dt className={styles.findingLabel}>
                  {item.label}
                  <span className={styles.findingValue}>{item.value}</span>
                </dt>
                <dd className={styles.findingBody}>{item.body}</dd>
              </div>
            ))}
          </dl>

          {track.details.images?.length ? (
            <div className={styles.shots}>
              {track.details.images.map((image) => (
                <ExpandableImage
                  key={image.src}
                  src={image.src}
                  alt={image.alt}
                  className={styles.shot}
                />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {track.quotes?.length ? (
        <section id={`${track.id}-quotes`} className={styles.section}>
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
                  <blockquote className={styles.quoteBody}>
                    {quote.body}
                  </blockquote>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {track.conclusion ? (
        /* Centred and set larger than the body copy: it closes the study, so it
           reads as a statement rather than as one more section of prose. */
        <section
          id={`${track.id}-conclusion`}
          className={`${styles.section} ${styles.closing}`}
        >
          <SectionHeading omit={omitHeading}>Conclusion</SectionHeading>
          <p className={`${styles.body} ${styles.closingBody}`}>
            {track.conclusion}
          </p>
        </section>
      ) : null}

      {track.placeholder ? (
        <p className={styles.placeholder}>{track.placeholder}</p>
      ) : null}
    </>
  );
}

/** One strand: the lead, then its sections. */
function TrackPanel({ track }: { track: Track }) {
  /* A strand that opens straight into its story carries none of these, and the
     lead would otherwise render as an empty block holding a section gap. */
  const hasLead = Boolean(
    track.facts?.length ||
    track.challenge ||
    track.results ||
    track.stats?.length ||
    track.hero,
  );

  return (
    <div className={styles.track}>
      {/*
       * The mark sits beside this block rather than above it. Stacked, it
       * pushed the facts and the figures down the page; alongside, it fills
       * width the prose column was leaving empty anyway.
       */}
      {/* Three cases, not two: no mark at all, a small mark that should not be
          handed a 40rem column to float in, and a wide product render that
          wants one. */}
      {hasLead ? (
        <div
          className={[
            styles.lead,
            !track.hero && styles.leadWide,
            track.hero?.mark && styles.leadMark,
          ]
            .filter(Boolean)
            .join(" ")}
        >
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
              id={`${track.id}-overview`}
              className={
                track.facts?.length
                  ? styles.overview
                  : `${styles.overview} ${styles.overviewWide}`
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

            {/* Sits under the figures, set quieter than them: this is the
              composition of a headline number, not a figure in its own
              right. */}
            {track.statsBreakdown?.length ? (
              <dl className={styles.breakdown}>
                {/* Ties the line back to the asterisked figure above it. */}
                <span className={styles.breakdownMark} aria-hidden="true">
                  *
                </span>
                {track.statsBreakdown.map((part) => (
                  <div key={part.label} className={styles.breakdownPart}>
                    <dd className={styles.breakdownValue}>{part.value}</dd>
                    <dt className={styles.breakdownLabel}>{part.label}</dt>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>

          {track.hero ? (
            <Figure image={track.hero} className={styles.leadArt} />
          ) : null}
        </div>
      ) : null}

      {/* Either the strand's sections straight through, or a second level of
          tabs over groups of them when the strand is long enough to be worth
          splitting. The lead above stays put either way: it orients the
          reader whichever group they are looking at. */}
      {track.chapters?.length ? (
        <Tabs
          variant="raised"
          label={`${track.label} sections`}
          tabs={track.chapters.map((chapter) => ({
            /* Prefixed: tab and panel ids have to be unique across the page,
               and the strand above is already using its own. */
            id: `${track.id}-${chapter.id}`,
            label: chapter.label,
            panel: (
              <TrackSections track={chapter} omitHeading={chapter.label} />
            ),
          }))}
        />
      ) : (
        <TrackSections track={track} />
      )}
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
