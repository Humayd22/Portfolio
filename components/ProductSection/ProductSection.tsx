import QRCode from "qrcode";
import { ExpandableImage } from "@/components/ExpandableImage/ExpandableImage";
import { PINIT, SMART_LINK_PATH, siteOrigin } from "@/lib/products";
import styles from "./ProductSection.module.css";

function AppleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={styles.storeIcon}
    >
      <path d="M16.4 12.8c0-2.2 1.8-3.3 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.7.8-3.3.8-.7 0-1.7-.8-2.8-.8-1.5 0-2.8.8-3.6 2.1-1.5 2.6-.4 6.5 1.1 8.7.7 1 1.6 2.2 2.7 2.2 1.1 0 1.5-.7 2.8-.7s1.6.7 2.8.7 1.9-1.1 2.6-2.1c.8-1.2 1.1-2.3 1.2-2.4-.1 0-2.2-.9-2.2-3.5zM14.2 5.6c.6-.7 1-1.7.9-2.7-.9 0-2 .6-2.6 1.3-.6.6-1.1 1.7-.9 2.6 1 .1 2-.5 2.6-1.2z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      className={styles.nameArrow}
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

function PlayIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={styles.storeIcon}
    >
      <path d="M3.6 2.3c-.3.3-.5.8-.5 1.4v16.6c0 .6.2 1.1.5 1.4l.1.1 9.3-9.3v-.2L3.7 2.9l-.1-.1zm12.5 6.2L13.8 6.2 4.6 2.1l11.5 6.4zM4.6 21.9l9.2-9.2 2.3 2.3-11.5 6.9zM19.9 10.7l-2.6-1.5-2.5 2.5 2.5 2.5 2.6-1.5c.8-.4.8-1.6 0-2z" />
    </svg>
  );
}

/**
 * A product I built, with the two store links and a single QR that resolves to
 * whichever store the scanning device needs.
 *
 * A server component, so the QR is rendered into the HTML at build time — no
 * client library, no runtime request, and nothing to load before it is visible.
 */
export async function ProductSection() {
  const smartLink = `${siteOrigin()}${SMART_LINK_PATH}`;

  const qrSvg = (
    await QRCode.toString(smartLink, {
      type: "svg",
      margin: 0,
      // Medium recovery: enough redundancy to survive a phone camera at an
      // angle without inflating the module count and making it hard to scan
      // at this size.
      errorCorrectionLevel: "M",
      color: { dark: "#000000", light: "#00000000" },
    })
  )
    // Strip the intrinsic size so CSS owns it; without this the SVG carries a
    // fixed width and ignores the container.
    .replace(/\s(width|height)="[^"]*"/g, "");

  return (
    <div className={styles.body}>
      <div className={styles.media}>
        {PINIT.image ? (
          <ExpandableImage
            src={PINIT.image}
            alt={`${PINIT.name} app`}
            className={styles.image}
          />
        ) : null}
      </div>

      <div className={styles.copy}>
        {/* The link wraps the whole lockup, so the arrow is part of the target
            rather than a separate tap the size of an icon. */}
        <h3 className={styles.name}>
          <a
            className={styles.nameLink}
            href={PINIT.website}
            target="_blank"
            rel="noreferrer"
          >
            {PINIT.name}
            <ArrowIcon />
          </a>
        </h3>
        <p className={styles.tagline}>{PINIT.tagline}</p>
        <p className={styles.description}>{PINIT.description}</p>

        <div className={styles.download}>
          {/* Introduces everything below it, so it is a heading for the
                group rather than a caption on the buttons alone. */}
          <p className={styles.downloadLabel}>Download now on:</p>

          <div className={styles.actions}>
            <div className={styles.stores}>
              <a
                className={styles.store}
                href={PINIT.appStore}
                target="_blank"
                rel="noreferrer"
              >
                <AppleIcon />
                App Store
              </a>

              <a
                className={styles.store}
                href={PINIT.playStore}
                target="_blank"
                rel="noreferrer"
              >
                <PlayIcon />
                Google Play
              </a>
            </div>

            {/* aria-hidden: it separates two ways of doing the same thing
                  visually, and announcing "or" between them adds nothing. */}
            <span className={styles.divider} aria-hidden="true">
              OR
            </span>

            {/*
             * Dark modules on a light plate in both themes, deliberately. An
             * inverted QR is unreadable to a good number of scanners, so this
             * one keeps its polarity even when the page around it is dark.
             */}
            <div className={styles.qr}>
              <div
                className={styles.qrCode}
                role="img"
                aria-label={`QR code to download ${PINIT.name}`}
                dangerouslySetInnerHTML={{ __html: qrSvg }}
              />
              <p className={styles.qrHint}>Scan to download</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
