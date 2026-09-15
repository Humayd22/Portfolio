"use client";

import { Check, Copy } from "@phosphor-icons/react";
import { useRef, useState } from "react";
import styles from "./CopyEmail.module.css";

/**
 * Copies the address to the clipboard.
 *
 * Worth having alongside the mailto: link — a desktop visitor with no mail
 * client configured gets a dead link and gives up, and plenty of people would
 * rather paste it into whatever they already have open.
 */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // Blocked by permissions or an insecure origin. The address is visible
      // and selectable either way, so there is nothing to recover from.
      return;
    }

    setCopied(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  }

  const label = copied ? "Email address copied" : "Copy email address";

  return (
    /*
     * Icon only, so the label has to carry the meaning — and it names the
     * target, not just the verb, since "Copy" alone tells a screen reader
     * nothing about what would be copied.
     */
    <button
      type="button"
      className={styles.copy}
      onClick={copy}
      aria-label={label}
      title={label}
    >
      {copied ? (
        <Check weight="light" className={styles.icon} aria-hidden="true" />
      ) : (
        <Copy weight="light" className={styles.icon} aria-hidden="true" />
      )}

      {/*
       * The icon swap is not something a screen reader watches, so a live
       * region announces the result at the moment it happens.
       */}
      <span role="status" aria-live="polite" className={styles.srOnly}>
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </button>
  );
}
