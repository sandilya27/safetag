import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHead } from "@/components/page-head";
import { container, padX, QuoteBand } from "@/components/ui";
import { getService, industries, serviceHref } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Industries",
  description: "Calibration, testing and inspection for oil and gas, construction, EPC contractors, manufacturing, environmental agencies and utilities in Saudi Arabia.",
  path: "/industries",
});

export default function IndustriesPage() {
  return (
    <main id="content">
      <PageHead
        crumbs={[{ name: "Industries", path: "/industries" }]}
        title="Trusted across the Kingdom’s most demanding sectors."
        intro="Each sector has its own codes, schedules and failure modes. These are the problems we are most often asked to solve."
      >
        <nav aria-label="Industries on this page" className="flex flex-wrap gap-1.5 pt-2">
          {industries.map((i) => (
            <a key={i.slug} href={`#${i.slug}`} className="flex items-center gap-2 rounded-full border border-grey-300 bg-white px-3.5 py-2 text-sm font-medium text-ink no-underline hover:border-ink hover:text-ink">
              <i.icon className="size-4 text-green-700" />
              {i.title}
            </a>
          ))}
        </nav>
      </PageHead>

      <div className={`py-10 md:py-16 ${padX}`}>
        <div className={container}>
          {industries.map((ind) => (
            <section
              key={ind.slug}
              id={ind.slug}
              aria-labelledby={`${ind.slug}-title`}
              className="grid scroll-mt-[calc(var(--header)+24px)] gap-x-10 gap-y-6 border-b border-grey-200 py-12 last:border-b-0 md:grid-cols-2 lg:grid-cols-[minmax(0,4fr)_minmax(0,4fr)_minmax(0,3fr)]"
            >
              <div className="flex flex-col gap-4">
                <span className="flex size-12 items-center justify-center rounded bg-green-50">
                  <ind.icon className="size-6 text-green-700" />
                </span>
                <h2 id={`${ind.slug}-title`} className="display m-0 text-[clamp(26px,2.4vw,34px)] leading-[1.08] font-extrabold text-balance">
                  {ind.title}
                </h2>
                <p className="m-0 max-w-[48ch] text-[16px] leading-[1.6] text-grey-700">{ind.description}</p>
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="label-mono m-0">WHAT CLIENTS ASK US FOR</h3>
                <ul className="m-0 flex list-none flex-col p-0">
                  {ind.needs.map((n) => (
                    <li key={n} className="border-t border-grey-200 py-3 text-[15.5px] leading-normal">
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-3 md:col-span-2 lg:col-span-1">
                <h3 className="label-mono m-0">SERVICES</h3>
                <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
                  {ind.services.map((slug) => {
                    const s = getService(slug)!;
                    return (
                      <li key={slug}>
                        <Link href={serviceHref(s)} className="group flex items-center gap-3 rounded-md border border-grey-200 bg-white px-3.5 py-3 text-[15px] font-semibold text-ink no-underline hover:border-ink hover:text-ink">
                          <s.icon className="size-[18px] flex-none text-green-700" />
                          <span className="flex-1">{s.title}</span>
                          <ArrowRight className="size-4 text-grey-500 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>
          ))}
        </div>
      </div>
      <QuoteBand title="Working in a sector not listed here?" />
    </main>
  );
}
