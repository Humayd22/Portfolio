"use client";

import { ArrowsOutSimple, X } from "@phosphor-icons/react";
import Image from "next/image";
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
  width,
  height,
  sizes,
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  /* Supply both to render the closed state through next/image. Artwork here
     is exported at several thousand pixels wide and drawn at a fraction of
     that, so serving the source file to size it down in the browser wastes
     most of the bytes on a phone. The open state stays a plain <img>: full
     size is the entire point of opening it. */
  width?: number;
  height?: number;
  sizes?: string;
  style?: React.CSSProperties;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const optimised = width !== undefined && height !== undefined;

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => dialog.current?.showModal()}
        aria-label={`View ${alt} larger`}
      >
        {optimised ? (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={className}
            sizes={sizes}
            style={style}
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={src} alt={alt} className={className} />
        )}

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
