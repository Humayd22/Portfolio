import { Tabs } from "@/components/Tabs/Tabs";

/**
 * The app and the publications, behind a segmented switch.
 *
 * The switch itself lives in Tabs, shared with the project case studies so the
 * two cannot drift apart. This is a server component again now that it holds no
 * state of its own — the panels pass straight through, and the app panel keeps
 * generating its QR at build time.
 */
export function Showcase({
  publications,
  app,
}: {
  publications: React.ReactNode;
  app: React.ReactNode;
}) {
  return (
    <section>
      <Tabs
        label="Publications and app"
        /* Order here is the order on screen, and the first loads selected. */
        tabs={[
          { id: "app", label: "My app", panel: app },
          { id: "publications", label: "My publications", panel: publications },
        ]}
      />
    </section>
  );
}
