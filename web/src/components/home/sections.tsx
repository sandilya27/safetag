// Homepage sections 01–08. Each section has up to three layouts: the static fallback
// (default classes), the pinned desktop story (`pinned:`) and the docked phone/tablet story
// (`docked:`; `story:` targets both). Section heights in story modes (services 360vh / 300svh,
// industries 130vh, labs 150vh, calibration 200vh) are what the scroll triggers rely on;
// keep them in step with lib/scroll-timeline.ts.
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { certifications, extraServices, heroFacts, industries, industryHref, labZones, serviceHref, services } from "@/lib/content";
import { btnOutline, btnPrimary, chip, h2, padX, Tbc, textLink } from "../ui";
import { ProjectGrid } from "../project-grid";
import { ActiveServiceCard, AssistantChips, CalibrationReadout, QuickQuoteFields, Testimonials, VerifyCertificateForm } from "./islands";

const CALIPER_SRC = "/assets/hero-dial-caliper.svg";
// Docked sections: anchors land below the band, and headings shrink to fit the shorter view.
const dockedAnchor = "docked:scroll-mt-(--band)";

export function Hero() {
  return (
    <section
      id="hero"
      data-screen-label="01 Hero"
      className={`relative z-1 box-border flex min-h-svh items-center pt-30 pb-18 docked:min-h-0 docked:items-start docked:pt-7 docked:pb-16 ${padX}`}
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-wrap items-center gap-12">
        <div className="flex max-w-[600px] flex-[1_1_440px] flex-col gap-7 docked:gap-5">
          <div className="flex items-center gap-2.5 font-mono text-[12.5px] font-medium tracking-[.08em] text-grey-700 uppercase docked:text-[11.5px]">
            <span className="size-2 flex-none rounded-full border border-ink bg-green-500" />
            Independent third-party services · Kingdom of Saudi Arabia
          </div>
          <h1 className="display m-0 text-[clamp(44px,6.2vw,84px)] leading-[0.98] font-extrabold tracking-[-.018em] text-balance docked:text-[clamp(34px,7.6vw,56px)]">
            Accredited calibration, testing and inspection for critical industry.
          </h1>
          <p className="m-0 max-w-[520px] text-[clamp(17px,1.4vw,19.5px)] leading-[1.55] text-pretty text-grey-700">
            SAFETAG delivers traceable calibration, non-destructive testing and third-party inspection, in our laboratories or at your site, so your equipment meets
            national and international standards.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/request-a-quote" className={`${btnPrimary} h-13 gap-2.5 px-6 text-base`}>
              Request a Quote
              <ArrowRight className="size-[18px]" />
            </Link>
            <a href="#services" className={`${btnOutline} h-13 px-6 text-base`}>
              Our Services
            </a>
          </div>
          <div className="mt-3 grid grid-cols-3 border-t border-ink">
            {heroFacts.map((f, i) => (
              <div
                key={f.label}
                className={`flex flex-col gap-1 pt-3.5 ${i === 0 ? "pe-4" : i === heroFacts.length - 1 ? "ps-4" : "px-4"} ${i > 0 ? "border-s border-grey-200" : ""} max-sm:px-2.5 max-sm:first:ps-0`}
              >
                <span className="font-mono text-[13px] font-semibold max-sm:text-[12px]">
                  {f.value}
                  {f.needsConfirmation && <Tbc />}
                </span>
                <span className="text-[13px] text-grey-600 max-sm:text-[12px]">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-[1_1_420px] justify-center story:hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CALIPER_SRC} alt="" className="h-auto w-full max-w-[640px] -rotate-8" />
        </div>
      </div>
    </section>
  );
}

export function Services() {
  return (
    <section id="services" data-screen-label="02 Services" className={`relative z-1 h-auto pinned:h-[360vh] ${dockedAnchor}`}>
      {/* Track: the scroll distance over which the ring orbits and the card follows it. */}
      <div className="pinned:h-full docked:h-[260svh]">
        <div
          className={`sticky top-0 box-border hidden h-screen items-center pt-24 pb-12 pinned:flex docked:flex docked:top-(--view-top) docked:h-[calc(100svh-var(--view-top))] docked:items-start docked:pt-6 docked:pb-4 ${padX}`}
        >
          <div className="mx-auto grid w-full max-w-[1280px] grid-cols-12 gap-6">
            <div className="col-[7/span_6] flex flex-col gap-[22px] docked:col-span-full docked:mx-auto docked:w-full docked:max-w-[640px] docked:gap-4">
              <div className="eyebrow docked:hidden">02 · Core services</div>
              <h2 className="display m-0 text-[clamp(34px,3.6vw,52px)] leading-[1.02] font-extrabold tracking-[-.01em] text-balance docked:text-[clamp(26px,6.4vw,40px)]">
                Thirteen disciplines, one accountable partner.
              </h2>
              <ActiveServiceCard />
              <div className="flex flex-col gap-2 docked:hidden">
                <div className="label-mono">ALSO AVAILABLE</div>
                <ExtraServiceChips />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`mx-auto hidden w-full max-w-[640px] flex-col gap-2 pt-4 pb-16 docked:flex ${padX}`}>
        <div className="label-mono">ALSO AVAILABLE</div>
        <ExtraServiceChips />
      </div>
      <div className={`mx-auto flex max-w-[1280px] flex-col gap-7 py-18 story:hidden ${padX}`}>
        <div className="eyebrow">02 · Core services</div>
        <h2 className="display m-0 text-[clamp(32px,4vw,52px)] leading-[1.02] font-extrabold text-balance">Thirteen disciplines, one accountable partner.</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3">
          {services.map((s) => (
            <Link key={s.title} href={serviceHref(s)} className="flex flex-col gap-3 rounded-md border border-grey-200 bg-white p-[22px] text-ink no-underline hover:border-ink hover:text-ink">
              <div className="flex justify-between">
                <span className="flex size-10 items-center justify-center rounded bg-green-50">
                  <s.icon className="size-[22px] text-green-700" />
                </span>
                <span className="font-mono text-xs font-medium text-grey-600">{s.num}</span>
              </div>
              <div className="display-92 text-xl leading-[1.15] font-bold">{s.title}</div>
              <div className="text-[14.5px] leading-normal text-grey-700">{s.description}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExtraServiceChips() {
  return (
    <div className="flex flex-wrap gap-1.5">
      {extraServices.map((s) => (
        <Link key={s.title} href={serviceHref(s)} className={chip}>
          {s.title}
        </Link>
      ))}
    </div>
  );
}

export function Industries() {
  return (
    <section
      id="industries"
      data-screen-label="03 Industries"
      className={`relative z-1 box-border flex min-h-0 items-center py-24 pinned:min-h-[130vh] docked:pt-14 docked:pb-10 ${dockedAnchor} ${padX}`}
    >
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-12 gap-6">
        <div className="col-span-full flex flex-col gap-[22px] pinned:col-[1/span_6]">
          <div className="eyebrow">03 · Industries served</div>
          <h2 className={h2}>Trusted across the Kingdom’s most demanding sectors.</h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-2.5">
            {industries.map((i) => (
              <Link
                key={i.title}
                href={industryHref(i)}
                className="flex flex-col gap-2 rounded-md border border-grey-200 bg-white px-5 py-[18px] text-ink no-underline transition-colors duration-150 hover:border-ink hover:text-ink"
              >
                <div className="flex items-center gap-2.5">
                  <i.icon className="size-5 flex-none text-green-700" />
                  <span className="display-92 text-lg leading-[1.2] font-bold">{i.title}</span>
                </div>
                <div className="text-sm leading-normal text-grey-700">{i.description}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Labs() {
  return (
    <section id="labs" data-screen-label="04 Laboratories" className={`relative z-1 box-border flex min-h-0 items-center py-24 pinned:min-h-[150vh] docked:pt-14 docked:pb-10 ${dockedAnchor} ${padX}`}>
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-12 gap-6">
        <div className="col-span-full story:hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CALIPER_SRC} alt="" className="h-auto w-full max-w-[560px]" />
        </div>
        <div className="col-span-full flex flex-col gap-[22px] pinned:col-[7/span_6]">
          <div className="eyebrow">04 · Laboratories &amp; capabilities</div>
          <h2 className={h2}>Our certified labs. Your trusted results.</h2>
          <p className="m-0 max-w-[560px] text-[17px] leading-[1.6] text-grey-700">
            Fully equipped, professionally managed laboratories with separate controlled environments for each discipline. Every test and calibration is repeatable and
            traceable.
          </p>
          <ol className="m-0 list-none border-t border-ink p-0">
            {labZones.map((z) => (
              <li key={z.n} className="grid grid-cols-[48px_minmax(0,1fr)] gap-3 border-b border-grey-200 py-4">
                <span className="font-mono text-[13px] font-semibold text-green-700">{z.n}</span>
                <div className="flex flex-col gap-1">
                  <span className="display-92 text-lg leading-[1.25] font-bold">{z.title}</span>
                  <span className="text-[14.5px] leading-normal text-grey-600">{z.description}</span>
                </div>
              </li>
            ))}
          </ol>
          <Link href="/laboratories" className={textLink}>
            Explore our laboratories
            <ArrowRight className="size-[15px]" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Calibration() {
  return (
    <section id="calibration" data-screen-label="04b Calibration" className={`relative z-1 h-auto pinned:h-[200vh] ${dockedAnchor}`}>
      <div className={`relative top-0 box-border flex min-h-svh items-center py-24 pinned:sticky docked:min-h-0 docked:items-start docked:pt-14 docked:pb-10 ${padX}`}>
        <div className="mx-auto grid w-full max-w-[1280px] grid-cols-12 gap-6">
          <div className="col-span-full flex flex-col gap-[22px] pinned:col-[1/span_5] docked:mx-auto docked:w-full docked:max-w-[640px]">
            <div className="eyebrow">Calibration &amp; metrology</div>
            <h2 className="display m-0 text-[clamp(30px,3.2vw,46px)] leading-[1.04] font-extrabold tracking-[-.01em] text-balance">
              Every reading traced back to a reference standard.
            </h2>
            <p className="m-0 text-[16.5px] leading-[1.6] text-grey-700">
              Pressure, temperature, dimensional, electrical, flow, torque and mechanical instruments are calibrated against standards that are themselves periodically
              verified. Each result ships as a digitally authenticated certificate.
            </p>
            {/* Scroll-trigger marker at the readout's flow position (sticky elements move). Nets zero height. */}
            <span id="cal-sweep" aria-hidden="true" className="-mt-[22px] block h-0" />
            <div className="docked:sticky docked:top-[calc(var(--view-top)+12px)]">
              <CalibrationReadout />
            </div>
            {/* Docked: how long the readout stays docked under the band. A spacer, not padding:
                sticky elements cannot travel into their container's padding. */}
            <div aria-hidden="true" className="hidden h-[60svh] docked:block" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function Certifications() {
  return (
    <section id="certifications" data-screen-label="05 Certifications" data-surface="inverse" className={`relative z-1 bg-ink py-30 text-white docked:z-30 docked:py-20 ${padX}`}>
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="flex max-w-[640px] flex-col gap-[18px]">
            <div className="eyebrow text-green-500">05 · Certifications &amp; accreditations</div>
            <h2 className="display m-0 text-[clamp(32px,3.6vw,52px)] leading-[1.02] font-extrabold tracking-[-.01em]">Aligned with ISO, SASO, GAC and ASTM standards.</h2>
            <p className="m-0 text-[16.5px] leading-[1.6] text-grey-300">
              The certification names below are placeholders. SAFETAG will confirm each accreditation body, scope and certificate reference before launch.
            </p>
          </div>
          <VerifyCertificateForm />
        </div>
        <CertificationGrid />
        <Link href="/certifications" className="flex items-center gap-1.5 self-start text-[15px] font-semibold text-green-500 no-underline hover:text-white">
          Accreditation scope and documents
          <ArrowRight className="size-[15px]" />
        </Link>
      </div>
    </section>
  );
}

export function CertificationGrid() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(280px,100%),1fr))] gap-3">
      {certifications.map((c) => (
        <div key={c.name} className="flex flex-col gap-3.5 rounded-md border border-grey-700 bg-grey-900 p-[22px]">
          <div className="flex items-center gap-3.5">
            <div className="flex size-14 flex-none items-center justify-center rounded border border-grey-700 bg-[repeating-linear-gradient(135deg,#151A19_0_6px,#222827_6px_12px)] font-mono text-[9px] text-grey-400">
              LOGO
            </div>
            <div className="flex flex-col gap-1">
              <div className="display-92 text-lg leading-[1.2] font-bold">{c.name}</div>
              <div className="text-[13.5px] leading-[1.4] text-grey-300">{c.description}</div>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-grey-700 pt-3 font-mono text-[11.5px] text-grey-300">
            <span>Body · scope · reference</span>
            <span className="rounded-[2px] bg-amber px-1.5 py-0.5 font-semibold text-ink">TBC</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Projects() {
  return (
    <section id="projects" data-screen-label="06 Projects" className={`bg-paper py-30 max-md:py-20 ${padX}`}>
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex max-w-[680px] flex-col gap-[18px]">
            <div className="eyebrow">06 · Projects &amp; case studies</div>
            <h2 className={h2}>Proven on live assets, under real schedules.</h2>
          </div>
          <Link href="/projects" className={`${btnOutline} h-12 px-5 text-[15px]`}>
            All case studies
          </Link>
        </div>
        <ProjectGrid />
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section id="testimonials" data-screen-label="07 Testimonials" className={`border-y border-grey-200 bg-grey-50 py-28 max-md:py-20 ${padX}`}>
      <Testimonials />
    </section>
  );
}

export function AssistantQuote() {
  return (
    <section id="assistant" data-screen-label="08 Assistant + Quote" className={`bg-paper py-30 max-md:py-20 ${padX}`}>
      <div className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(340px,100%),1fr))] gap-6">
        <div className="flex flex-col gap-5 rounded-md border border-grey-200 bg-white p-[clamp(24px,3vw,40px)]">
          <div className="eyebrow">08 · Kunna, SAFETAG assistant</div>
          <h2 className="display m-0 text-[clamp(28px,2.8vw,40px)] leading-[1.05] font-extrabold text-balance">Ask about a service, a standard or a certificate.</h2>
          <div className="flex flex-col gap-2.5 rounded-md bg-grey-50 p-4">
            <div className="max-w-[80%] self-end rounded-[12px_12px_2px_12px] bg-ink px-3.5 py-2.5 text-[14.5px] leading-[1.45] text-white">
              We need our pressure gauges recalibrated before a shutdown next month.
            </div>
            <div className="max-w-[86%] self-start rounded-[12px_12px_12px_2px] border border-grey-200 bg-white px-3.5 py-2.5 text-[14.5px] leading-[1.45]">
              That falls under <strong>Calibration Services</strong>, and the team can work on site during your shutdown window. How many gauges, and what pressure range?
            </div>
          </div>
          <AssistantChips />
        </div>
        <div data-surface="inverse" className="flex flex-col gap-5 rounded-md bg-ink p-[clamp(24px,3vw,40px)] text-white">
          <div className="eyebrow text-green-500">Request a quote</div>
          <h2 className="display m-0 text-[clamp(28px,2.8vw,40px)] leading-[1.05] font-extrabold text-balance">
            A formal quotation, usually within one working day.
            <Tbc className="ms-1.5! px-1! align-top text-[9px]!" />
          </h2>
          <QuickQuoteFields />
          <div className="text-[13px] text-grey-300">Six short steps: contact, company, service, location, requirement, documents.</div>
        </div>
      </div>
    </section>
  );
}
