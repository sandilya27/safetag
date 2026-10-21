import { MapPin } from "lucide-react";
import { CareerForm } from "@/components/forms/simple-forms";
import { PageHead } from "@/components/page-head";
import { container, h2, padX, Tbc, tag } from "@/components/ui";
import { careerValues, openings } from "@/lib/careers";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Careers",
  description: "Calibration, NDT, inspection and quality roles at SAFETAG in Saudi Arabia.",
  path: "/careers",
});

export default function CareersPage() {
  return (
    <main id="content">
      <PageHead
        crumbs={[{ name: "Careers", path: "/careers" }]}
        title="Measure things that matter."
        intro="Join the engineers and technicians who keep critical plant safe and certified across the Kingdom."
        actions={
          <a href="#apply" className="flex h-13 items-center rounded bg-green-500 px-6 text-base font-semibold text-ink no-underline hover:bg-green-600 hover:text-ink">
            Apply now
          </a>
        }
      />

      <section aria-labelledby="values" className={`py-16 md:py-20 ${padX}`}>
        <div className={`${container} grid gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]`}>
          <h2 id="values" className={h2}>
            How we work
          </h2>
          <dl className="m-0 grid gap-8 sm:grid-cols-3">
            {careerValues.map((c) => (
              <div key={c.title} className="flex flex-col gap-2 border-t-2 border-ink pt-4">
                <dt className="display-92 text-[21px] leading-[1.2] font-bold">{c.title}</dt>
                <dd className="m-0 text-[15.5px] leading-[1.6] text-grey-700">{c.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="openings" className={`grid-paper border-y border-grey-200 py-16 md:py-20 ${padX}`}>
        <div className={`${container} flex flex-col gap-8`}>
          <h2 id="openings" className={h2}>
            Open roles
            <Tbc className="align-top" />
          </h2>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {openings.map((o) => (
              <li key={o.slug} id={o.slug} className="grid gap-x-8 gap-y-3 rounded-md border border-grey-200 bg-white p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                <div className="flex flex-col gap-2">
                  <h3 className="display-92 m-0 text-[22px] leading-[1.2] font-bold">{o.title}</h3>
                  <p className="m-0 max-w-[62ch] text-[15.5px] leading-normal text-grey-700">{o.summary}</p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className={tag}>{o.team}</span>
                    <span className={tag}>{o.type}</span>
                    <span className="flex items-center gap-1.5 text-[14px] text-grey-600">
                      <MapPin className="size-4" />
                      {o.location}
                    </span>
                  </div>
                </div>
                <a href="#apply" className="flex h-11 items-center justify-center rounded border-[1.5px] border-ink px-5 text-[15px] font-semibold text-ink no-underline hover:bg-grey-100 hover:text-ink">
                  Apply
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="apply" aria-labelledby="apply-title" className={`scroll-mt-[calc(var(--header)+16px)] py-16 md:py-20 ${padX}`}>
        <div className={`${container} grid gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]`}>
          <div className="flex flex-col gap-4">
            <h2 id="apply-title" className={h2}>
              Apply
            </h2>
            <p className="m-0 max-w-[40ch] text-[16px] leading-[1.6] text-grey-700">No matching role? Send an open application and we will keep your CV on file.</p>
          </div>
          <div className="min-w-0 rounded-md border border-grey-200 bg-white p-[clamp(20px,3vw,40px)]">
            <CareerForm />
          </div>
        </div>
      </section>
    </main>
  );
}
