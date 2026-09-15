"use client";

import { ArrowsOutSimple, X } from "@phosphor-icons/react";
import { useRef } from "react";
import styles from "./ExpandableImage.module.css";

/**
 * An image that opens full size when clicked.
 *
 * Built on the native <dialog> with showModal(), which brings focus trapping,
 * Esc-to-close, inert background content and focus restoration on close — all
 * of it correct, and none of it worth hand-rolling.
 *
 * No state: the dialog element is the state. Mirroring open/closed into React
 * would give two sources of truth that can disagree, since Esc closes the
 * dialog without telling React.
 */
export function ExpandableImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => dialog.current?.showModal()}
        aria-label={`View ${alt} larger`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className={className} />

        <span className={styles.hint} aria-hidden="true">
          <ArrowsOutSimple weight="light" className={styles.hintIcon} />
        </span>
      </button>

      <dialog
        ref={dialog}
        className={styles.dialog}
        /* A click landing on the dialog itself is a click on the backdrop —
           anything on the image hits the <img> and never reaches here. */
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <button
          type="button"
          className={styles.close}
          onClick={() => dialog.current?.close()}
          aria-label="Close"
        >
          <X weight="light" className={styles.closeIcon} />
        </button>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className={styles.full} />
      </dialog>
    </>
  );
}
