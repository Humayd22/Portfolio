"use client";

import { useState } from "react";
import { SKILLS, SKILLS_VISIBLE } from "@/lib/skills";
import styles from "./Skills.module.css";

export function Skills() {
  const [expanded, setExpanded] = useState(false);
  const hasMore = SKILLS.length > SKILLS_VISIBLE;
  const shown = expanded || !hasMore ? SKILLS : SKILLS.slice(0, SKILLS_VISIBLE);
  const hiddenCount = SKILLS.length - SKILLS_VISIBLE;

  return (
    <section className={styles.skills} aria-labelledby="skills-heading">
      <h2 id="skills-heading" className={styles.heading}>
        Skills
      </h2>

      {/*
       * A list, not a row of divs: this is an enumeration, and a screen reader
       * announcing "list, 14 items" is the difference between hearing a set and
       * hearing fourteen unrelated words.
       */}
      <ul className={styles.chips}>
        {shown.map((skill) => (
          <li key={skill} className={styles.chip}>
            {skill}
          </li>
        ))}

        {hasMore ? (
          <li>
            <button
              type="button"
              className={`${styles.chip} ${styles.more}`}
              onClick={() => setExpanded((open) => !open)}
              /* Names what is hidden rather than just "More", so the control
                 is meaningful when read out of context. */
              aria-label={
                expanded
                  ? "Show fewer skills"
                  : `Show ${hiddenCount} more skills`
              }
              aria-expanded={expanded}
            >
              {expanded ? "− Less" : "+ More"}
            </button>
          </li>
        ) : null}
      </ul>
    </section>
  );
}
