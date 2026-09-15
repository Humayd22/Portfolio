"use client";

import { useEffect, useRef } from "react";
import { EXPERIENCE, type Logo } from "@/lib/experience";
import styles from "./Timeline.module.css";

/**
 * How much of the fill is held back before it begins, as a fraction of the
 * viewport. 0 reproduces the original mapping, where the line was already well
 * down the rail on arrival; larger values shorten what is showing at rest. It
 * does not affect where the fill finishes.
 *
 * This is the dial to turn.
 */
const SCROLL_LEAD = 0.18;

/**
 * Eases the opening of the fill. The raw mapping is linear, so the line leaves
 * at very nearly the speed of the scroll itself and the first flick reads as a
 * shove. An exponent above 1 holds it back early and lets it recover later; 1
 * is the plain linear curve, and higher is slower off the mark.
 *
 * It cannot affect where the line finishes — 1 raised to any power is still 1.
 */
const SCROLL_EASE = 1.25;

/**
 * Drives the rail's fill and the markers from one measurement, so the dot a
 * viewer sees the line touch is the dot that changes.
 *
 * The maths reproduces exactly what the CSS scroll-driven version did: progress
 * runs from the moment the rail's top edge enters the bottom of the viewport to
 * the moment its bottom edge leaves the top, which is why the line is already
 * part-filled when the section first appears.
 */
function useRailProgress() {
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = list.current;
    if (!el) return;

    /*
     * Honoured here rather than in CSS: with the fill driven by measurement,
     * skipping the work entirely is cheaper than animating and overriding it.
     */
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    let frame = 0;

    function measure() {
      frame = 0;
      const el = list.current;
      if (!el) return;

      const markers = el.querySelectorAll<HTMLElement>("[data-marker]");
      const rails = el.querySelectorAll<HTMLElement>("[data-rail]");
      const first = markers[0];
      const last = markers[markers.length - 1];
      if (!first || !last) return;

      if (still.matches) {
        el.style.setProperty("--rail-progress", "1");
        markers.forEach((m) => {
          m.dataset.passed = "true";
        });
        rails.forEach((r) => r.style.setProperty("--client-progress", "1"));
        return;
      }

      const viewport = window.innerHeight;
      const centre = (box: DOMRect) => box.top + box.height / 2;

      /*
       * Progress is still measured against the whole list, exactly as the CSS
       * scroll-driven version did — that is what keeps the line already
       * part-filled when the section arrives. Only what the number is applied
       * to has changed.
       */
      const top = centre(first.getBoundingClientRect());
      const height = el.getBoundingClientRect().bottom - top;
      if (height <= 0) return;

      /*
       * Both ends of the span are pulled in by the same amount, which shortens
       * the resting fill without stopping the line reaching the end: subtract
       * the lead from the distance travelled and from the total, and the last
       * scroll position still resolves to 1.
       */
      const lead = viewport * SCROLL_LEAD;
      const travelled = viewport - top - lead;
      const total = viewport + height - lead;
      const progress = total > 0 ? Math.min(Math.max(travelled / total, 0), 1) : 0;

      /*
       * The single leading edge, in viewport coordinates. Every track fills up
       * to this one line, which is what stops the main rail and the nested
       * client rails from disagreeing about how far the reader has got.
       *
       * The last rail could never finish: the mapping only reaches 1 once the
       * list has fully left the top of the viewport, and a page usually runs
       * out of scroll before that — so the fill stopped a fixed distance short.
       *
       * Rescaling by the most the mapping can actually achieve on this page
       * fixes it without any catch-up: the line advances a touch faster the
       * whole way down and lands exactly full at the bottom. An earlier version
       * blended toward full across the final screenfuls, which ran the blue
       * ahead of the reader long before they got there.
       *
       * Where the page does have room to complete on its own, `reachable` is 1
       * and this is a no-op.
       */
      const remaining = document.documentElement.scrollHeight - (window.scrollY + viewport);
      const topAtEnd = top - Math.max(remaining, 0);
      const reachable = Math.min(Math.max((viewport - topAtEnd - lead) / total, 0), 1);

      const scaled = reachable > 0 ? Math.min(progress / reachable, 1) : 1;
      const front = top + Math.pow(scaled, SCROLL_EASE) * height;

      /* The main rail spans dot to dot, so it is finished by the time the last
         entry begins and the client rails take over from there. */
      const railLength = centre(last.getBoundingClientRect()) - top;
      el.style.setProperty("--rail-length", `${Math.max(railLength, 0)}px`);
      el.style.setProperty(
        "--rail-progress",
        String(railLength > 0 ? Math.min(Math.max((front - top) / railLength, 0), 1) : 0),
      );

      rails.forEach((rail) => {
        const box = rail.getBoundingClientRect();
        if (box.height <= 0) return;
        const filled = Math.min(Math.max((front - box.top) / box.height, 0), 1);
        rail.style.setProperty("--client-progress", String(filled));
      });

      markers.forEach((marker) => {
        const passed = centre(marker.getBoundingClientRect()) <= front;
        /* Written only on change: a dataset assignment every frame would dirty
           the element and defeat the transition. */
        if ((marker.dataset.passed === "true") !== passed) {
          marker.dataset.passed = String(passed);
        }
      });
    }

    /* Coalesced into one frame — scroll fires far more often than the screen
       repaints, and measuring twice for the same frame is wasted layout. */
    function schedule() {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    }

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    still.addEventListener("change", schedule);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      still.removeEventListener("change", schedule);
    };
  }, []);

  return list;
}

/**
 * Both variants render and CSS shows the right one, exactly as ProjectCard does
 * it — picking in JS means reading the theme after hydration, which flashes the
 * wrong mark on first paint.
 *
 * Decorative, so alt is empty: the name is written in full directly beside or
 * below every mark, and naming it here would have a screen reader say it twice.
 */
function LogoMark({ logo, className }: { logo: Logo; className: string }) {
  return (
    <div className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo.onDark} alt="" className={`${styles.logoImg} ${styles.onDark}`} />
      {/* Skipped where no light artwork exists — an <img> with no src renders
          as a broken-image glyph, which is worse than the gap it fills. */}
      {logo.onLight ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={logo.onLight} alt="" className={`${styles.logoImg} ${styles.onLight}`} />
      ) : null}
    </div>
  );
}

/** The measurable outcomes under an employer or a client engagement. */
function Accomplishments({ items }: { items: string[] }) {
  return (
    <ul className={styles.accomplishments}>
      {items.map((item) => (
        <li key={item} className={styles.accomplishment}>
          {item}
        </li>
      ))}
    </ul>
  );
}

/**
 * The career, most recent first, on a single rail.
 *
 * An ordered list rather than a stack of divs: the sequence is the content, and
 * a screen reader announcing "3 of 5" carries the shape of a career that
 * unordered markup would throw away.
 *
 * Consultancy roles nest their client engagements rather than listing them as
 * jobs of their own. Three employers with three clients under one of them is
 * what actually happened; six flat entries would read as six jobs in six years.
 */
export function Timeline() {
  const list = useRailProgress();

  return (
    <ol className={styles.timeline} ref={list}>
      {EXPERIENCE.map((position) => (
        <li key={`${position.company}-${position.period}`} className={styles.entry}>
          {/* Drawn, not a list marker: it has to sit on the rail, and the rail
              is a border on the entry itself. */}
          <span className={styles.marker} data-marker aria-hidden="true" />

          {position.logo ? (
            <LogoMark logo={position.logo} className={styles.logo} />
          ) : null}

          <div className={styles.head}>
            <h3 className={styles.role}>{position.role}</h3>
            <p className={styles.company}>{position.company}</p>
          </div>

          <p className={styles.period}>{position.period}</p>

          {position.description ? (
            <p className={styles.description}>{position.description}</p>
          ) : null}

          {position.accomplishments ? (
            <Accomplishments items={position.accomplishments} />
          ) : null}

          {/*
           * Unordered, unlike the employers above: the clients under one role
           * are concurrent engagements with no meaningful sequence, so numbering
           * them would assert an order the CV does not give.
           */}
          {position.clients ? (
            <ul className={styles.clients}>
              {position.clients.map((client) => (
                <li key={client.name} className={styles.client} data-rail>
                  {client.logo ? (
                    <LogoMark logo={client.logo} className={styles.clientLogo} />
                  ) : null}

                  <h4 className={styles.clientName}>{client.name}</h4>

                  <p className={styles.description}>{client.description}</p>

                  {client.accomplishments ? (
                    <Accomplishments items={client.accomplishments} />
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
