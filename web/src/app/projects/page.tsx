import { PageHead } from "@/components/page-head";
import { ProjectFilter } from "@/components/project-filter";
import { container, padX, QuoteBand } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Projects & case studies",
  description: "Hydrotesting, shutdown calibration and load testing projects delivered by SAFETAG across Saudi Arabia.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <main id="content">
      <PageHead
        crumbs={[{ name: "Projects", path: "/projects" }]}
        title="Proven on live assets, under real schedules."
        intro="A selection of recent work. Figures and client names are withheld until SAFETAG confirms what can be published."
      />
      <section aria-label="Case studies" className={`py-14 md:py-20 ${padX}`}>
        <div className={container}>
          <ProjectFilter />
        </div>
      </section>
      <QuoteBand title="Have a project with a hard deadline?" />
    </main>
  );
}
