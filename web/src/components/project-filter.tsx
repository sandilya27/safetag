"use client";

import { useState } from "react";
import { projects } from "@/lib/content";
import { ProjectGrid } from "./project-grid";

/** Service filter over the case-study grid. */
export function ProjectFilter() {
  const [svc, setSvc] = useState<string | null>(null);
  const options = [...new Map(projects.map((p) => [p.serviceSlug, p.service])).entries()];
  const shown = svc ? projects.filter((p) => p.serviceSlug === svc) : projects;
  const pill = (on: boolean) =>
    `h-10 cursor-pointer rounded-full border px-4 text-sm font-medium transition-colors duration-150 ${on ? "border-ink bg-ink text-white" : "border-grey-300 bg-white text-ink hover:border-ink"}`;
  return (
    <div className="flex flex-col gap-8">
      <div role="group" aria-label="Filter by service" className="flex flex-wrap gap-2">
        <button type="button" aria-pressed={!svc} onClick={() => setSvc(null)} className={pill(!svc)}>
          All work
        </button>
        {options.map(([slug, label]) => (
          <button key={slug} type="button" aria-pressed={svc === slug} onClick={() => setSvc(slug)} className={`${pill(svc === slug)} capitalize`}>
            {label.toLowerCase()}
          </button>
        ))}
      </div>
      <p aria-live="polite" className="sr-only">
        Showing {shown.length} case {shown.length === 1 ? "study" : "studies"}
      </p>
      <ProjectGrid items={shown} />
    </div>
  );
}
