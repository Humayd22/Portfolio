import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import styles from "./TopBar.module.css";

/**
 * The bar every page shares. The left slot is the only thing that differs:
 * identity on the home page, a way back on everything below it. The theme
 * toggle is constant, so it never moves between levels.
 */
export function TopBar({
  back = false,
  backHref = "/",
}: {
  back?: boolean;
  /** Where "Back" goes. A case study returns to the list, not to home. */
  backHref?: string;
}) {
  return (
    <header className={styles.bar}>
      {back ? (
        <Link href={backHref} className={styles.back}>
          <ArrowLeft weight="light" className={styles.backIcon} aria-hidden="true" />
          Back
        </Link>
      ) : (
        <div className={styles.identity}>
          <span className={styles.name}>Humayd Mohamed</span>
          <span className={styles.role}>
            Product Design &amp; Design System Manager
          </span>
        </div>
      )}

      <ThemeToggle />
    </header>
  );
}
