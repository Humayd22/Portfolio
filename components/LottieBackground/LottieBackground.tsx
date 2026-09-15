"use client";

import { useEffect, useRef } from "react";
import styles from "./LottieBackground.module.css";

/**
 * A looping Lottie used as a card background.
 *
 * The player is ~300KB, which is far too much to spend on decoration in the
 * main bundle, so it is imported dynamically inside the effect: it becomes its
 * own chunk, fetched after paint and only on pages that actually use one. The
 * card keeps its normal surface until then, and for good if it never arrives.
 */
export function LottieBackground({ src }: { src: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = host.current;
    if (!container) return;

    /*
     * Nothing is loaded at all for these users — not paused, not hidden.
     * Downloading a 300KB player only to freeze it on frame one is the one
     * outcome worse than leaving the card on its normal surface.
     */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let animation: { destroy: () => void; play: () => void; pause: () => void } | null = null;
    let cancelled = false;
    let onscreen = false;

    /* Paused whenever it cannot be seen — scrolled away, or in a background
       tab. A decorative loop should never hold a core awake unwatched. */
    function sync() {
      if (!animation) return;
      if (onscreen && !document.hidden) animation.play();
      else animation.pause();
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        onscreen = entry.isIntersecting;
        /* Deferred until it is first needed, so a card below the fold costs
           nothing until it is scrolled to. */
        if (onscreen && !animation && !cancelled) void load();
        sync();
      },
      { rootMargin: "200px" },
    );
    observer.observe(container);

    async function load() {
      const lottie = (await import("lottie-web")).default;
      if (cancelled || !host.current) return;

      animation = lottie.loadAnimation({
        container: host.current,
        /*
         * svg, not canvas. Every shape layer in this file carries a Gaussian
         * Blur effect, and the canvas renderer silently ignores effects — it
         * drew the artwork as hard-edged shapes with none of the softness the
         * gradient is made of. Only the SVG renderer implements blur, as
         * feGaussianBlur.
         */
        renderer: "svg",
        loop: true,
        autoplay: false,
        /* Encoded here rather than at the call site: the filename has spaces
           in it, and an unencoded path silently 404s. */
        path: encodeURI(src),
        rendererSettings: {
          /*
           * slice, not meet — the artwork is 880x480 and the card is a
           * different shape, so it should fill and crop rather than letterbox.
           *
           * YMin rather than YMid because the blobs stop short of the foot of
           * the composition: a centred crop keeps part of that empty strip and
           * the card ends in a band of bare ground.
           */
          preserveAspectRatio: "xMidYMin slice",
        },
      });
      sync();
    }

    document.addEventListener("visibilitychange", sync);

    return () => {
      cancelled = true;
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      animation?.destroy();
    };
  }, [src]);

  return (
    /*
     * aria-hidden: it is decoration, carries no information, and the card is
     * already a single link with its own accessible name.
     */
    <div className={styles.background} aria-hidden="true">
      <div className={styles.player} ref={host} />
    </div>
  );
}
