import Link from "next/link";
import { FlaskConical, Truck } from "lucide-react";
import { PageHead } from "@/components/page-head";
import { container, h2, padX, QuoteBand, Tbc } from "@/components/ui";
import { labZones } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Laboratories",
  description: "SAFETAG laboratories for calibration and metrology, metallurgical and mechanical testing, NDT evaluation, environmental and concrete and soil testing.",
  path: "/laboratories",
});

const MODES = [
  {
    icon: FlaskConical,
    title: "At our laboratory",
    body: "Controlled temperature and humidity, the full range of reference standards and the lowest measurement uncertainty.",
    best: ["High-accuracy calibration", "Destructive and material testing", "Instruments you can ship or drop off"],
  },
  {
    icon: Truck,
    title: "At your site",
    body: "Portable reference standards and test rigs, brought to your plant so equipment stays in service or inside a shutdown window.",
    best: ["Installed or heavy equipment", "Shutdowns and turnarounds", "Large instrument populations"],
  },
];

export default function LaboratoriesPage() {
  return (
    <main id="content">
      <PageHead
        crumbs={[{ name: "Laboratories", path: "/laboratories" }]}
        title="Our certified labs. Your trusted results."
        intro="Separate controlled environments for each discipline, so every test and calibration is repeatable and traceable."
      />

      <section aria-labelledby="zones" className={`py-16 md:py-24 ${padX}`}>
        <div className={`${container} grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]`}>
          <div className="flex flex-col gap-6 lg:sticky lg:top-[calc(var(--header)+48px)] lg:self-start">
            <h2 id="zones" className={h2}>
              Five laboratory zones
            </h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/hero-dial-caliper.svg" alt="" className="h-auto w-full max-w-[520px] -rotate-6" />
            <p className="m-0 max-w-[46ch] text-[15.5px] leading-[1.6] text-grey-700">
              Equipment lists are indicative and will be replaced with SAFETAG’s confirmed inventory and accreditation scope.
              <Tbc />
            </p>
          </div>
          <ol className="m-0 flex list-none flex-col gap-4 p-0">
            {labZones.map((z) => (
              <li key={z.n} className="grid grid-cols-[52px_minmax(0,1fr)] gap-x-4 gap-y-4 rounded-md border border-grey-200 bg-white p-6">
                <span className="font-mono text-[15px] font-semibold text-green-700">{z.n}</span>
                <div className="flex flex-col gap-2">
                  <h3 className="display-92 m-0 text-[22px] leading-[1.2] font-bold">{z.title}</h3>
                  <p className="m-0 text-[15.5px] leading-normal text-grey-700">{z.description}</p>
                </div>
                <ul className="col-start-2 m-0 flex list-none flex-wrap gap-1.5 p-0">
                  {z.equipment.map((e) => (
                    <li key={e} className="rounded-[2px] bg-grey-50 px-2.5 py-1.5 font-mono text-[12px] text-grey-700">
                      {e}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="where" className={`grid-paper border-t border-grey-200 py-16 md:py-24 ${padX}`}>
        <div className={`${container} flex flex-col gap-10`}>
          <h2 id="where" className={`${h2} max-w-[20ch]`}>
            In our labs or at your site
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {MODES.map((m) => (
              <div key={m.title} className="flex flex-col gap-4 rounded-md border border-ink bg-white p-7">
                <m.icon className="size-7 text-green-700" />
                <h3 className="display-92 m-0 text-[26px] leading-[1.15] font-bold">{m.title}</h3>
                <p className="m-0 text-[16px] leading-[1.6] text-grey-700">{m.body}</p>
                <ul className="m-0 mt-auto flex list-none flex-col border-t border-grey-200 p-0 pt-2">
                  {m.best.map((b) => (
                    <li key={b} className="py-1.5 text-[15px] font-medium">
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="m-0 text-[15px] text-grey-700">
            Need both? Most shutdown scopes combine on-site work with lab calibration of removed instruments.{" "}
            <Link href="/services/shutdown-jobs">See shutdown jobs</Link>.
          </p>
        </div>
      </section>
      <QuoteBand title="Book laboratory time or a site visit." />
    </main>
  );
}
