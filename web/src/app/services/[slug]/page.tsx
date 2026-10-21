import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { Disclosure } from "@/components/accordion";
import { PageHead } from "@/components/page-head";
import { btnOutline, btnPrimary, chip, container, h2, JsonLd, padX, QuoteBand, Tbc, textLink } from "@/components/ui";
import { getService, industries, industryHref, projectHref, projects, serviceHref, services, whereLabel } from "@/lib/content";
import { faqs } from "@/lib/faqs";
import { pageMetadata, SITE_URL } from "@/lib/seo";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">) {
  const s = getService((await params).slug);
  if (!s) return {};
  return pageMetadata({ title: s.title, description: s.description, path: serviceHref(s) });
}

// How every engagement runs, whatever the service.
const PROCESS = [
  ["Scope", "Tell us the equipment, standard and location. An engineer confirms the scope and quotes."],
  ["Plan", "We agree the procedure, schedule and any site access or permits with your team."],
  ["Test", "Qualified technicians perform the work with calibrated equipment, in our labs or on site."],
  ["Certify", "You receive a report or certificate traceable to reference standards."],
] as const;

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const s = getService((await params).slug);
  if (!s) notFound();

  const sectors = industries.filter((i) => i.services.includes(s.slug));
  const related = services.filter((o) => o.group === s.group && o.slug !== s.slug).slice(0, 4);
  const cases = projects.filter((p) => p.serviceSlug === s.slug);
  const questions = faqs.filter((f) => f.serviceSlug === s.slug);
  const quote = `/request-a-quote?service=${s.slug}`;

  return (
    <main id="content">
      <PageHead
        crumbs={[
          { name: "Services", path: "/services" },
          { name: s.title, path: serviceHref(s) },
        ]}
        title={s.title}
        intro={s.description}
        actions={
          <>
            <Link href={quote} className={`${btnPrimary} h-13 gap-2.5 px-6 text-base`}>
              Request a Quote
              <ArrowRight className="size-[18px]" />
            </Link>
            <Link href="/contact" className={`${btnOutline} h-13 px-6 text-base`}>
              Talk to an engineer
            </Link>
          </>
        }
        aside={
          <dl data-surface="inverse" className="m-0 flex flex-col gap-4 rounded-md bg-ink p-6 text-white">
            <div className="flex items-center gap-3 border-b border-grey-700 pb-4">
              <span className="flex size-11 items-center justify-center rounded bg-green-500">
                <s.icon className="size-6 text-ink" />
              </span>
              <span className="font-mono text-[12px] font-semibold tracking-[.08em] text-grey-300">SERVICE {s.num} / 13</span>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="font-mono text-[11.5px] tracking-[.08em] text-grey-300">WHERE</dt>
              <dd className="m-0 text-[15.5px]">{whereLabel[s.where]}</dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <dt className="font-mono text-[11.5px] tracking-[.08em] text-grey-300">
                WORKS TO <Tbc />
              </dt>
              <dd className="m-0 flex flex-wrap gap-1.5">
                {s.standards.map((st) => (
                  <span key={st} className="rounded-[2px] border border-grey-600 px-2 py-1 font-mono text-[12px]">
                    {st}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        }
      />

      <section aria-labelledby="scope" className={`py-16 md:py-24 ${padX}`}>
        <div className={`${container} grid gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]`}>
          <h2 id="scope" className={h2}>
            What the service covers
            <Tbc className="align-top" />
          </h2>
          <ul className="m-0 grid list-none gap-x-8 p-0 sm:grid-cols-2">
            {s.scope.map((item) => (
              <li key={item} className="flex gap-3 border-t border-grey-200 py-4 text-[16px] leading-normal">
                <Check className="mt-0.5 size-[18px] flex-none text-green-700" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="process" className={`grid-paper border-y border-grey-200 py-16 md:py-24 ${padX}`}>
        <div className={`${container} flex flex-col gap-10`}>
          <h2 id="process" className={h2}>
            From request to certificate
          </h2>
          <ol className="m-0 grid list-none gap-px overflow-hidden rounded-md border border-grey-200 bg-grey-200 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map(([verb, body]) => (
              <li key={verb} className="flex flex-col gap-3 bg-white p-6">
                <span className="display-92 text-[24px] leading-none font-extrabold">{verb}</span>
                <span className="text-[15px] leading-normal text-grey-700">{body}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {(sectors.length > 0 || cases.length > 0) && (
        <section aria-labelledby="where-used" className={`py-16 md:py-24 ${padX}`}>
          <div className={`${container} grid gap-12 lg:grid-cols-2`}>
            {sectors.length > 0 && (
              <div className="flex flex-col gap-5">
                <h2 id="where-used" className="display m-0 text-[clamp(26px,2.4vw,34px)] leading-[1.1] font-extrabold">
                  Industries that rely on it
                </h2>
                <ul className="m-0 flex list-none flex-col gap-2 p-0">
                  {sectors.map((i) => (
                    <li key={i.slug}>
                      <Link href={industryHref(i)} className="flex items-center gap-3 rounded-md border border-grey-200 bg-white px-4 py-3.5 text-ink no-underline hover:border-ink hover:text-ink">
                        <i.icon className="size-5 flex-none text-green-700" />
                        <span className="flex-1 font-semibold">{i.title}</span>
                        <ArrowRight className="size-4 text-grey-500" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {cases.length > 0 && (
              <div className="flex flex-col gap-5">
                <h2 className="display m-0 text-[clamp(26px,2.4vw,34px)] leading-[1.1] font-extrabold">Recent work</h2>
                {cases.map((p) => (
                  <Link key={p.slug} href={projectHref(p)} className="flex flex-col gap-2 rounded-md border border-grey-200 bg-white p-5 text-ink no-underline hover:border-ink hover:text-ink">
                    <span className="font-mono text-[11px] font-medium tracking-[.06em] text-grey-600">{p.location}</span>
                    <span className="display-92 text-[20px] leading-[1.2] font-bold">{p.title}</span>
                    <span className="text-[14.5px] font-semibold text-green-700">Read the case study</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {questions.length > 0 && (
        <section aria-labelledby="questions" className={`border-t border-grey-200 bg-grey-50 py-16 md:py-20 ${padX}`}>
          <div className={`${container} grid gap-x-12 gap-y-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]`}>
            <h2 id="questions" className="display m-0 text-[clamp(26px,2.4vw,34px)] leading-[1.1] font-extrabold">
              Common questions
            </h2>
            <div className="flex flex-col">
              {questions.map((f) => (
                <Disclosure key={f.q} q={f.q}>
                  {f.a}
                </Disclosure>
              ))}
              <Link href="/faq" className={`${textLink} mt-5`}>
                All questions
                <ArrowRight className="size-[15px]" />
              </Link>
            </div>
          </div>
        </section>
      )}

      <section aria-label="Related services" className={`py-14 ${padX}`}>
        <div className={`${container} flex flex-wrap items-center gap-2`}>
          <span className="label-mono me-2">RELATED</span>
          {related.map((r) => (
            <Link key={r.slug} href={serviceHref(r)} className={chip}>
              {r.title}
            </Link>
          ))}
          <Link href="/services" className={chip}>
            All services
          </Link>
        </div>
      </section>

      <QuoteBand title={`Request a ${s.title.replace(/ \(.*\)$/, "")} quotation.`} service={s.slug} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: s.title,
          description: s.description,
          serviceType: s.title,
          url: `${SITE_URL}${serviceHref(s)}`,
          areaServed: { "@type": "Country", name: "Saudi Arabia" },
          provider: { "@type": "Organization", name: "SAFETAG", url: SITE_URL },
        }}
      />
    </main>
  );
}
