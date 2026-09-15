import { EXPERIENCE_ROWS } from "@/lib/experience";
import styles from "./Experience.module.css";

export function Experience() {
  return (
    <section className={styles.experience} aria-labelledby="experience-heading">
      <h2 id="experience-heading" className={styles.heading}>
        Experience
      </h2>

      {/*
       * An ordered list: these run most recent first, and that sequence is
       * information. A screen reader announcing "1 of 5" carries the career
       * shape that a stack of divs would throw away.
       *
       * Flat rows, one per place the work was done — the consultancy's clients
       * each get their own line here rather than being nested under it, which
       * is what the résumé timeline is for. This page is the scannable summary.
       */}
      <ol className={styles.roles}>
        {EXPERIENCE_ROWS.map((row) => (
          <li key={`${row.company}-${row.period}`} className={styles.role}>
            <h3 className={styles.title}>{row.role}</h3>

            <div className={styles.meta}>
              <p className={styles.company}>{row.company}</p>
              <p className={styles.period}>{row.period}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
