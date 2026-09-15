"use client";

import { Check, PencilSimple } from "@phosphor-icons/react";
import { useMemo, useState, useSyncExternalStore } from "react";
import { ProjectCard, type Background } from "@/components/ProjectCard/ProjectCard";
import { GRADIENTS, frameSrc } from "@/lib/gradients";
import { FEATURED_PROJECT, PROJECTS, type Project } from "@/lib/projects";
import styles from "./WorkGallery.module.css";

/*
 * Per visitor, in their own browser. Nothing is sent anywhere and nothing is
 * shared — a choice made here changes the page for whoever made it, and for
 * nobody else.
 */
const STORE = "portfolio.card-background";

type Choices = Record<string, Background>;

/*
 * The stored choices, as an external store rather than state seeded in an
 * effect. localStorage is genuinely outside React: it does not exist on the
 * server, and another tab can change it underneath this one. Subscribing is
 * what keeps the server's HTML, this tab, and any other tab in agreement —
 * seeding state from it after mount would render the defaults first and then
 * replace them, which flashes.
 */
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  /* Fires only for changes made in OTHER tabs, which is why writes here notify
     the local listeners themselves. */
  window.addEventListener("storage", notify);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", notify);
  };
}

function notify() {
  for (const listener of listeners) listener();
}

/* Returns the raw string: getSnapshot must return something stable between
   calls, and parsing here would hand back a new object every time and spin. */
function getSnapshot(): string {
  try {
    return window.localStorage.getItem(STORE) ?? "";
  } catch {
    /* Private windows, blocked site data. Defaults are a perfectly good page. */
    return "";
  }
}

/* No storage on the server, and none before hydration. */
const getServerSnapshot = () => "";

function write(choices: Choices) {
  try {
    window.localStorage.setItem(STORE, JSON.stringify(choices));
  } catch {
    /* Not worth failing the interaction over — the choice still applies for
       this visit, it just will not survive a reload. */
  }
  notify();
}

/** The strip of options for one card: its ten frames, then the animation. */
function Picker({
  project,
  showing,
  onPick,
}: {
  project: Project;
  showing: Background;
  onPick: (choice: Background) => void;
}) {
  const art = project.gradient ? GRADIENTS[project.gradient] : undefined;
  if (!art) return null;

  return (
    <div
      className={styles.picker}
      role="group"
      aria-label={`Background for ${project.client}`}
    >
      {art.frames.map((frame) => (
        <button
          key={frame}
          type="button"
          className={styles.swatch}
          style={{ backgroundImage: `url("${frameSrc(art.key, frame)}")` }}
          aria-label={`Frame ${frame}`}
          aria-pressed={showing === frame}
          onClick={() => onPick(frame)}
        />
      ))}

      <button
        type="button"
        className={`${styles.swatch} ${styles.animate}`}
        aria-label="Animate this card"
        aria-pressed={showing === "animation"}
        onClick={() => onPick("animation")}
      >
        Animate
      </button>
    </div>
  );
}

/**
 * The work page's cards, plus the control that lets a visitor choose what sits
 * behind each one.
 *
 * The cards are static, so this is a client component only because the choosing
 * is: everything below renders identically on the server, and the stored
 * choices are applied after mount.
 */
export function WorkGallery() {
  const [editing, setEditing] = useState(false);

  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const choices = useMemo<Choices>(() => {
    if (!raw) return {};
    try {
      return JSON.parse(raw) as Choices;
    } catch {
      /* Someone else's key, or a half-written value. Start clean. */
      return {};
    }
  }, [raw]);

  function pick(slug: string, choice: Background) {
    write({ ...choices, [slug]: choice });
  }

  function reset() {
    try {
      window.localStorage.removeItem(STORE);
    } catch {
      /* As above. */
    }
    notify();
  }

  function cardFor(project: Project, featured = false) {
    const art = project.gradient ? GRADIENTS[project.gradient] : undefined;
    const showing = choices[project.slug] ?? art?.defaultFrame ?? "animation";

    return (
      <ProjectCard
        key={project.slug}
        project={project}
        featured={featured}
        background={showing}
        editing={editing}
        controls={
          editing && art ? (
            <Picker
              project={project}
              showing={showing}
              onPick={(choice) => pick(project.slug, choice)}
            />
          ) : null
        }
      />
    );
  }

  const touched = Object.keys(choices).length > 0;

  return (
    <div className={styles.work}>
      {/*
       * Right-aligned, and plain text with an icon rather than a filled pill —
       * the same weight as the Back control in the bar above. This is an aside,
       * not something the page is asking anyone to do.
       */}
      <div className={styles.bar}>
        {editing && touched ? (
          <button type="button" className={styles.reset} onClick={reset}>
            Reset
          </button>
        ) : null}

        {editing ? (
          <p className={styles.hint}>
            Pick a moment from each project&rsquo;s animation, or let it play.
            Saved in this browser only.
          </p>
        ) : null}

        <button
          type="button"
          className={styles.toggle}
          onClick={() => setEditing((on) => !on)}
          aria-pressed={editing}
        >
          {editing ? (
            <Check weight="light" className={styles.toggleIcon} aria-hidden="true" />
          ) : (
            <PencilSimple weight="light" className={styles.toggleIcon} aria-hidden="true" />
          )}
          {editing ? "Done" : "Edit card backgrounds"}
        </button>
      </div>

      {cardFor(FEATURED_PROJECT, true)}

      <div className={styles.projects}>{PROJECTS.map((project) => cardFor(project))}</div>
    </div>
  );
}
