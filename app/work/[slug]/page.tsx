import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/CaseStudy/CaseStudy";
import { PageShell } from "@/components/PageShell/PageShell";
import { CASE_STUDIES } from "@/lib/case-studies";
import { FEATURED_PROJECT, PROJECTS } from "@/lib/projects";

const ALL = [FEATURED_PROJECT, ...PROJECTS];

/*
 * Only the projects that actually have a case study written. A card whose story
 * does not exist yet still links here and still 404s — which is the honest
 * outcome, and visible, rather than an empty page that looks finished.
 */
export function generateStaticParams() {
  return Object.keys(CASE_STUDIES).map((slug) => ({ slug }));
}

function find(slug: string) {
  const study = CASE_STUDIES[slug];
  const project = ALL.find((candidate) => candidate.slug === slug);
  return study && project ? { study, project } : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const found = find((await params).slug);
  return found ? { title: found.project.title } : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const found = find((await params).slug);
  if (!found) notFound();

  return (
    /* Back returns to the list rather than home — that is where the reader came
       from, and home is one more step from there. */
    <PageShell headline={found.study.headline ?? found.project.title} backHref="/work">
      <CaseStudy project={found.project} study={found.study} />
    </PageShell>
  );
}
