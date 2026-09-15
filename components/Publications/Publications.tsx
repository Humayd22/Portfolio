import { AUTHOR_URL, PUBLICATIONS } from "@/lib/publications";
import styles from "./Publications.module.css";

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

export function Publications() {
  if (PUBLICATIONS.length === 0) {
    return (
      <p className={styles.empty}>
        Books coming soon.{" "}
        <a
          className={styles.emptyLink}
          href={AUTHOR_URL}
          target="_blank"
          rel="noreferrer"
        >
          See them on Amazon
        </a>
      </p>
    );
  }

  return (
    <ul className={styles.grid}>
      {PUBLICATIONS.map((publication) => (
        <li key={publication.url}>
          <a
            className={styles.book}
            href={publication.url}
            target="_blank"
            rel="noreferrer"
          >
            {/*
             * A fixed 2:3 plate, the standard book proportion. Covers vary
             * slightly, and without a shared frame two books side by side sit
             * at different heights and the row stops reading as a set.
             */}
            <span className={styles.cover}>
              {publication.cover ? (
                /* alt="" — the title sits right beneath it, so describing the
                   cover as well would announce the same book twice. */
                // eslint-disable-next-line @next/next/no-img-element
                <img src={publication.cover} alt="" className={styles.coverImage} />
              ) : null}
            </span>

            <span className={styles.text}>
              <span className={styles.title}>
                {publication.title}
                <ArrowIcon />
              </span>
              {publication.subtitle ? (
                <span className={styles.subtitle}>{publication.subtitle}</span>
              ) : null}
              <span className={styles.year}>{publication.year}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
