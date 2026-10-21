import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHead } from "@/components/page-head";
import { container, h2, padX, Placeholder, QuoteBand, Tbc, textLink } from "@/components/ui";
import { companyFacts, companyIntro, leadership, milestones, principles } from "@/lib/company";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About us",
  description: "SAFETAG is an independent calibration, testing and third-party inspection company in the Kingdom of Saudi Arabia.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main id="content">
      <PageHead
        crumbs={[{ name: "About", path: "/about" }]}
        title="An independent technical authority."
        intro={companyIntro}
        aside={
          <dl data-surface="inverse" className="m-0 grid grid-cols-2 gap-px overflow-hidden rounded-md bg-grey-700 text-white">
            {companyFacts.map((f) => (
              <div key={f.label} className="flex flex-col gap-1 bg-ink p-5">
                <dt className="order-2 text-[13px] text-grey-300">{f.label}</dt>
                <dd className="m-0 font-mono text-[28px] font-medium text-green-500">
                  {f.value}
                  {f.needsConfirmation && <Tbc className="align-top" />}
                </dd>
              </div>
            ))}
          </dl>
        }
      />

      <section aria-labelledby="principles" className={`py-16 md:py-24 ${padX}`}>
        <div className={`${container} grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]`}>
          <div className="flex flex-col gap-6">
            <h2 id="principles" className={h2}>
              What a third-party result is worth
            </h2>
            <Placeholder label="photo · SAFETAG engineers on site" className="aspect-[4/3] rounded-md border border-grey-200" />
          </div>
          <ol className="m-0 flex list-none flex-col p-0">
            {principles.map((p) => (
              <li key={p.title} className="flex flex-col gap-2 border-t border-ink py-7 last:border-b last:border-b-grey-200">
                <h3 className="display m-0 text-[clamp(28px,2.8vw,40px)] leading-none font-extrabold">{p.title}</h3>
                <p className="m-0 max-w-[52ch] text-[17px] leading-[1.6] text-grey-700">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="history" className={`grid-paper border-y border-grey-200 py-16 md:py-24 ${padX}`}>
        <div className={`${container} flex flex-col gap-10`}>
          <h2 id="history" className={h2}>
            Milestones
            <Tbc className="align-top" />
          </h2>
          {/* A scale, not a timeline widget: each milestone is a graduation on the rule. */}
          <ol className="relative m-0 grid list-none gap-8 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {milestones.map((m) => (
              <li key={m.text} className="flex flex-col gap-3 border-s-2 border-ink ps-5">
                <span className="font-mono text-[22px] font-medium text-green-700">{m.year}</span>
                <span className="text-[16px] leading-normal">{m.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="leadership" className={`py-16 md:py-24 ${padX}`}>
        <div className={`${container} flex flex-col gap-10`}>
          <h2 id="leadership" className={h2}>
            Leadership
            <Tbc className="align-top" />
          </h2>
          <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {leadership.map((l) => (
              <li key={l.role} className="flex flex-col gap-3">
                <Placeholder label={`portrait · ${l.role.toLowerCase()}`} className="aspect-[4/5] rounded-md border border-grey-200" />
                <span className="flex flex-col gap-0.5">
                  <span className="text-[16px] font-semibold">Name to be confirmed</span>
                  <span className="text-[14.5px] text-grey-600">{l.role}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-6">
            <Link href="/certifications" className={textLink}>
              Our accreditations
              <ArrowRight className="size-[15px]" />
            </Link>
            <Link href="/careers" className={textLink}>
              Work with us
              <ArrowRight className="size-[15px]" />
            </Link>
          </div>
        </div>
      </section>
      <QuoteBand />
    </main>
  );
}
