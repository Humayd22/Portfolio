import { PageShell } from "@/components/PageShell/PageShell";

/*
 * Next's own default 404 UI renders inside the root layout but ignores
 * data-theme (it only follows the OS's prefers-color-scheme), and on a hard
 * navigation it triggers a dev-only "script tag" warning from the two inline
 * scripts in app/layout.tsx's <head>. A custom not-found.tsx renders through
 * the normal segment pipeline instead — same as every other page — which
 * fixes both.
 */
export default function NotFound() {
  return (
    <PageShell headline="This page doesn't exist.">
      <p>The link may be old, or the page may have moved.</p>
    </PageShell>
  );
}
