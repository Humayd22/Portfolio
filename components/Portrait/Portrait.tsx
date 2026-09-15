import styles from "./Portrait.module.css";

/**
 * Portrait image. Drop a file at this path to fill it; leave it absent and a
 * blank plate renders instead. Full colour is fine — it is desaturated in CSS.
 */
const PORTRAIT = "/portrait.png";

/**
 * The photo itself, without a container — the card around it belongs to
 * whatever is using it, since the home grid and the About page frame it
 * differently.
 *
 * Shared so the colour treatment lives in one place. Two copies of a grayscale
 * and brightness pair would drift the first time either is tuned.
 *
 * Fills its parent absolutely, so that parent must be positioned.
 */
export function Portrait() {
  if (!PORTRAIT) {
    return <span className={styles.placeholder} aria-hidden="true" />;
  }

  return (
    /*
     * alt="" because this is decorative: the name in the top bar already
     * identifies whose site this is, so a description here would only add
     * noise to a screen reader.
     */
    // eslint-disable-next-line @next/next/no-img-element
    <img src={PORTRAIT} alt="" className={styles.image} />
  );
}
