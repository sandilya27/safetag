import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHead } from "@/components/page-head";
import { container, JsonLd, padX, QuoteBand } from "@/components/ui";
import { megaGroups, serviceHref, services, whereLabel } from "@/lib/content";
import { pageMetadata, SITE_URL } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Services",
  description: "Calibration, NDT, material testing, load and hydro testing, valve and welding testing, third-party inspection and field services across Saudi Arabia.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <main id="content">
      <PageHead
        crumbs={[{ name: "Services", path: "/services" }]}
        title="Thirteen disciplines, one accountable partner."
        intro="Calibration, testing and inspection under one quality system, delivered in our laboratories or at your site anywhere in the Kingdom."
      />
      <div className={`py-16 md:py-24 ${padX}`}>
        <div className={`${container} flex flex-col gap-16 md:gap-20`}>
          {megaGroups.map((g) => (
            <section key={g.group} aria-labelledby={`group-${g.group}`} className="grid gap-x-12 gap-y-6 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)]">
              <div className="lg:sticky lg:top-[calc(var(--header)+40px)] lg:self-start">
                <h2 id={`group-${g.group}`} className="display m-0 text-[clamp(28px,2.8vw,40px)] leading-[1.05] font-extrabold text-balance">
                  {g.title}
                </h2>
                <p className="m-0 mt-3 font-mono text-[13px] text-grey-600">
                  {g.items.length} service{g.items.length > 1 ? "s" : ""}
                </p>
              </div>
              <ul className="m-0 list-none border-t border-ink p-0">
                {g.items.map((s) => (
                  <li key={s.slug} className="border-b border-grey-200">
                    <Link
                      href={serviceHref(s)}
                      className="group grid grid-cols-[44px_minmax(0,1fr)] items-start gap-x-5 gap-y-2 py-6 text-ink no-underline hover:text-ink sm:grid-cols-[44px_minmax(0,1fr)_auto] sm:items-center"
                    >
                      <span className="flex size-11 items-center justify-center rounded bg-green-50 transition-colors duration-150 group-hover:bg-green-500">
                        <s.icon className="size-[22px] text-green-700 transition-colors duration-150 group-hover:text-ink" />
                      </span>
                      <span className="flex min-w-0 flex-col gap-1.5">
                        <span className="display-92 text-[22px] leading-[1.15] font-bold">{s.title}</span>
                        <span className="max-w-[62ch] text-[15px] leading-normal text-grey-700">{s.description}</span>
                        <span className="font-mono text-[12px] font-medium text-grey-600">{whereLabel[s.where]}</span>
                      </span>
                      <ArrowRight className="col-start-2 size-5 text-green-700 transition-transform duration-200 group-hover:translate-x-1 sm:col-start-3" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
      <QuoteBand title="Not sure which service you need?" />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: services.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.title, url: `${SITE_URL}${serviceHref(s)}` })),
        }}
      />
    </main>
  );
}
