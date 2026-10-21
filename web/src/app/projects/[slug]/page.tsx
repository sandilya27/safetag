import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { PageHead } from "@/components/page-head";
import { container, padX, Placeholder, QuoteBand, Tbc, tag, textLink } from "@/components/ui";
import { getProject, getService, industries, industryHref, projectHref, projects, serviceHref } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">) {
  const p = getProject((await params).slug);
  if (!p) return {};
  return pageMetadata({ title: p.title, description: p.challenge, path: projectHref(p) });
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const p = getProject((await params).slug);
  if (!p) notFound();
  const svc = getService(p.serviceSlug)!;
  const ind = industries.find((i) => i.slug === p.industry);
  const next = projects[(projects.indexOf(p) + 1) % projects.length];

  return (
    <main id="content">
      <PageHead
        crumbs={[
          { name: "Projects", path: "/projects" },
          { name: svc.title, path: projectHref(p) },
        ]}
        title={p.title}
      >
        <div className="flex flex-wrap gap-1.5">
          {[p.service, p.location].map((t) => (
            <span key={t} className={`${tag} bg-white`}>
              {t}
            </span>
          ))}
        </div>
      </PageHead>

      <article className={`py-14 md:py-20 ${padX}`}>
        <div className={`${container} grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]`}>
          <div className="flex min-w-0 flex-col gap-10">
            <Placeholder label={p.placeholder} className="aspect-video rounded-md border border-grey-200" />
            <div className="prose">
              <h2>The challenge</h2>
              <p>{p.challenge}</p>
              <h2>Our approach</h2>
              <ul>
                {p.approach.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
              <h2>The outcome</h2>
              <p>{p.outcome}</p>
            </div>
          </div>
          <aside className="flex flex-col gap-6 lg:sticky lg:top-[calc(var(--header)+40px)] lg:self-start">
            <dl data-surface="inverse" className="m-0 grid grid-cols-2 gap-4 rounded-md bg-ink p-6 text-white">
              {p.metrics.map(([value, label]) => (
                <div key={label} className="flex flex-col gap-1">
                  <dt className="font-mono text-[11px] tracking-[.08em] text-grey-300 uppercase">{label}</dt>
                  <dd className="m-0 font-mono text-[26px] font-medium text-green-500">
                    {value}
                    <Tbc className="align-top" />
                  </dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-col gap-3 rounded-md border border-grey-200 bg-white p-6">
              <span className="label-mono">SERVICE</span>
              <Link href={serviceHref(svc)} className="flex items-center gap-2.5 font-semibold text-ink no-underline hover:text-green-700">
                <svc.icon className="size-5 text-green-700" />
                {svc.title}
              </Link>
              {ind && (
                <>
                  <span className="label-mono mt-2">INDUSTRY</span>
                  <Link href={industryHref(ind)} className="flex items-center gap-2.5 font-semibold text-ink no-underline hover:text-green-700">
                    <ind.icon className="size-5 text-green-700" />
                    {ind.title}
                  </Link>
                </>
              )}
            </div>
            <Link href={projectHref(next)} className={textLink}>
              Next case study
              <ArrowRight className="size-[15px]" />
            </Link>
          </aside>
        </div>
      </article>
      <QuoteBand title="Planning similar work?" service={svc.slug} />
    </main>
  );
}
