import { DownloadSimple, EnvelopeSimple, LinkedinLogo } from "@phosphor-icons/react/dist/ssr";
import { EMAIL, LINKEDIN_URL } from "@/lib/contact";
import { RESUME_FILE, RESUME_SUMMARY, resumeStats } from "@/lib/experience";
import styles from "./ResumeProfile.module.css";

/**
 * The header of the résumé: who, in one paragraph, then the three things a
 * recruiter might want to do next, then the numbers.
 */
export function ResumeProfile({ hasResume }: { hasResume: boolean }) {
  return (
    <section className={styles.profile} aria-label="Profile">
      <div className={styles.identity}>
        <h2 className={styles.name}>Humayd Mohamed</h2>
        <p className={styles.role}>Product &amp; Design System Manager</p>
      </div>

      <p className={styles.summary}>{RESUME_SUMMARY}</p>

      <div className={styles.actions}>
        {/* Straight into a compose window, the same mailto: the contact page's
            address uses — a recruiter reading a résumé wants to write, not to
            be routed to another page first. */}
        <a className={`${styles.action} ${styles.primary}`} href={`mailto:${EMAIL}`}>
          <EnvelopeSimple weight="light" className={styles.actionIcon} />
          Get in touch
        </a>

        <a
          className={styles.action}
          href={LINKEDIN_URL}
          target="_blank"
          rel="noreferrer"
        >
          <LinkedinLogo weight="light" className={styles.actionIcon} />
          LinkedIn
        </a>

        {/* Hidden until the file exists — a download that 404s is worse than no
            download at all. */}
        {hasResume ? (
          <a className={styles.action} href={RESUME_FILE} download>
            <DownloadSimple weight="light" className={styles.actionIcon} />
            Download PDF
          </a>
        ) : null}
      </div>

      {/*
       * A description list: each stat is a value and what it counts, and that
       * pairing survives when the row wraps on a narrow screen.
       */}
      <dl className={styles.stats}>
        {resumeStats().map((stat) => (
          <div key={stat.label} className={styles.stat}>
            <dt className={styles.statLabel}>{stat.label}</dt>
            <dd className={styles.statValue}>{stat.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
