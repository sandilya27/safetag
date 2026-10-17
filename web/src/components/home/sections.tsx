// Homepage sections 01–08. Each section has two layouts: the static fallback (default
// classes) and the pinned story (`pinned:` classes). The section heights in pinned mode
// (services 360vh, industries 130vh, labs 150vh, calibration 200vh) are what the scroll
// triggers rely on; keep them in step with lib/scroll-timeline.ts.
import { ArrowRight } from "lucide-react";
import { certifications, extraServices, heroFacts, industries, labZones, projects, services } from "@/lib/content";
import { ActiveServiceCard, AssistantChips, CalibrationReadout, QuickQuoteFields, Testimonials, VerifyCertificateForm } from "./islands";

const CALIPER_SRC = "/assets/hero-dial-caliper.svg";
const padX = "px-[clamp(20px,4vw,48px)]";
const h2 = "display m-0 text-[clamp(32px,3.6vw,52px)] leading-[1.02] font-extrabold tracking-[-.01em] text-balance";
const textLink = "flex items-center gap-1.5 text-[15px] font-semibold text-green-700 no-underline hover:text-ink";
const btnPrimary = "flex items-center rounded bg-green-500 font-semibold text-ink no-underline transition-colors duration-150 hover:bg-green-600 hover:text-ink active:bg-green-650";
const btnOutline = "box-border flex items-center rounded border-[1.5px] border-ink font-semibold text-ink no-underline transition-colors duration-150 hover:bg-grey-100 hover:text-ink";

const Tbc = ({ className = "" }: { className?: string }) => <sup className={`tbc ${className}`}>TBC</sup>;

export function Hero() {
  return (
    <section id="hero" data-screen-label="01 Hero" className={`relative z-1 box-border flex min-h-screen items-center pt-30 pb-18 ${padX}`}>
      <div className="mx-auto flex w-full max-w-[1280px] flex-wrap items-center gap-12">
        <div className="flex max-w-[600px] flex-[1_1_440px] flex-col gap-7">
          <div className="flex items-center gap-2.5 font-mono text-[12.5px] font-medium tracking-[.08em] text-grey-700 uppercase">
            <span className="size-2 rounded-full border border-ink bg-green-500" />
            Independent third-party services · Kingdom of Saudi Arabia
          </div>
          <h1 className="display m-0 text-[clamp(44px,6.2vw,84px)] leading-[0.98] font-extrabold tracking-[-.018em] text-balance">
            Accredited calibration, testing and inspection for critical industry.
          </h1>
          <p className="m-0 max-w-[520px] text-[clamp(17px,1.4vw,19.5px)] leading-[1.55] text-pretty text-grey-700">
            SAFETAG delivers traceable calibration, non-destructive testing and third-party inspection, in our laboratories or at your site, so your equipment meets
            national and international standards.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#assistant" className={`${btnPrimary} h-13 gap-2.5 px-6 text-base`}>
              Request a Quote
              <ArrowRight className="size-[18px]" />
            </a>
            <a href="#services" className={`${btnOutline} h-13 px-6 text-base`}>
              Our Services
            </a>
          </div>
          <div className="mt-3 grid grid-cols-3 border-t border-ink">
            {heroFacts.map((f, i) => (
              <div
                key={f.label}
                className={`flex flex-col gap-1 pt-3.5 ${i === 0 ? "pe-4" : i === heroFacts.length - 1 ? "ps-4" : "px-4"} ${i > 0 ? "border-s border-grey-200" : ""}`}
              >
                <span className="font-mono text-[13px] font-semibold">
                  {f.value}
                  {f.needsConfirmation && <Tbc />}
                </span>
                <span className="text-[13px] text-grey-600">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-[1_1_420px] justify-center pinned:hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CALIPER_SRC} alt="" className="h-auto w-full max-w-[640px] -rotate-8" />
        </div>
      </div>
    </section>
  );
}

export function Services() {
  return (
    <section id="services" data-screen-label="02 Services" className="relative z-1 h-auto pinned:h-[360vh]">
      <div className={`sticky top-0 box-border hidden h-screen items-center pt-24 pb-12 pinned:flex ${padX}`}>
        <div className="mx-auto grid w-full max-w-[1280px] grid-cols-12 gap-6">
          <div className="col-[7/span_6] flex flex-col gap-[22px]">
            <div className="eyebrow">02 · Core services</div>
            <h2 className="display m-0 text-[clamp(34px,3.6vw,52px)] leading-[1.02] font-extrabold tracking-[-.01em] text-balance">
              Thirteen disciplines, one accountable partner.
            </h2>
            <ActiveServiceCard />
            <div className="flex flex-col gap-2">
              <div className="label-mono">ALSO AVAILABLE</div>
              <div className="flex flex-wrap gap-1.5">
                {extraServices.map((s) => (
                  <a key={s.title} href="#" className="rounded-[2px] border border-grey-300 bg-white px-3 py-[7px] text-sm font-medium text-ink no-underline hover:border-ink hover:text-ink">
                    {s.title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`mx-auto flex max-w-[1280px] flex-col gap-7 py-18 pinned:hidden ${padX}`}>
        <div className="eyebrow">02 · Core services</div>
        <h2 className="display m-0 text-[clamp(32px,4vw,52px)] leading-[1.02] font-extrabold text-balance">Thirteen disciplines, one accountable partner.</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3">
          {services.map((s) => (
            <a key={s.title} href="#" className="flex flex-col gap-3 rounded-md border border-grey-200 bg-white p-[22px] text-ink no-underline hover:border-ink hover:text-ink">
              <div className="flex justify-between">
                <span className="flex size-10 items-center justify-center rounded bg-green-50">
                  <s.icon className="size-[22px] text-green-700" />
                </span>
                <span className="font-mono text-xs font-medium text-grey-600">{s.num}</span>
              </div>
              <div className="display-92 text-xl leading-[1.15] font-bold">{s.title}</div>
              <div className="text-[14.5px] leading-normal text-grey-700">{s.description}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Industries() {
  return (
    <section id="industries" data-screen-label="03 Industries" className={`relative z-1 box-border flex min-h-0 items-center py-24 pinned:min-h-[130vh] ${padX}`}>
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-12 gap-6">
        <div className="col-span-full flex flex-col gap-[22px] pinned:col-[1/span_6]">
          <div className="eyebrow">03 · Industries served</div>
          <h2 className={h2}>Trusted across the Kingdom’s most demanding sectors.</h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-2.5">
            {industries.map((i) => (
              <a
                key={i.title}
                href="#"
                className="flex flex-col gap-2 rounded-md border border-grey-200 bg-white px-5 py-[18px] text-ink no-underline transition-colors duration-150 hover:border-ink hover:text-ink"
              >
                <div className="flex items-center gap-2.5">
                  <i.icon className="size-5 flex-none text-green-700" />
                  <span className="display-92 text-lg leading-[1.2] font-bold">{i.title}</span>
                </div>
                <div className="text-sm leading-normal text-grey-700">{i.description}</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Labs() {
  return (
    <section id="labs" data-screen-label="04 Laboratories" className={`relative z-1 box-border flex min-h-0 items-center py-24 pinned:min-h-[150vh] ${padX}`}>
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-12 gap-6">
        <div className="col-span-full pinned:hidden">
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
          <a href="#" className={textLink}>
            Explore our laboratories
            <ArrowRight className="size-[15px]" />
          </a>
        </div>
      </div>
    </section>
  );
}

export function Calibration() {
  return (
    <section id="calibration" data-screen-label="04b Calibration" className="relative z-1 h-auto pinned:h-[200vh]">
      <div className={`relative top-0 box-border flex min-h-screen items-center py-24 pinned:sticky ${padX}`}>
        <div className="mx-auto grid w-full max-w-[1280px] grid-cols-12 gap-6">
          <div className="col-span-full flex flex-col gap-[22px] pinned:col-[1/span_5]">
            <div className="eyebrow">Calibration &amp; metrology</div>
            <h2 className="display m-0 text-[clamp(30px,3.2vw,46px)] leading-[1.04] font-extrabold tracking-[-.01em] text-balance">
              Every reading traced back to a reference standard.
            </h2>
            <p className="m-0 text-[16.5px] leading-[1.6] text-grey-700">
              Pressure, temperature, dimensional, electrical, flow, torque and mechanical instruments are calibrated against standards that are themselves periodically
              verified. Each result ships as a digitally authenticated certificate.
            </p>
            <CalibrationReadout />
          </div>
        </div>
      </div>
    </section>
  );
}

export function Certifications() {
  return (
    <section id="certifications" data-screen-label="05 Certifications" data-surface="inverse" className={`relative z-1 bg-ink py-30 text-white ${padX}`}>
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
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
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
      </div>
    </section>
  );
}

export function Projects() {
  return (
    <section id="projects" data-screen-label="06 Projects" className={`bg-paper py-30 ${padX}`}>
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex max-w-[680px] flex-col gap-[18px]">
            <div className="eyebrow">06 · Projects &amp; case studies</div>
            <h2 className={h2}>Proven on live assets, under real schedules.</h2>
          </div>
          <a href="#" className={`${btnOutline} h-12 px-5 text-[15px]`}>
            All case studies
          </a>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
          {projects.map((p) => (
            <a
              key={p.title}
              href="#"
              className="flex flex-col overflow-hidden rounded-md border border-grey-200 bg-white text-ink no-underline transition-colors duration-150 hover:border-ink hover:text-ink"
            >
              <div className="flex aspect-video items-center justify-center border-b border-grey-200 bg-[repeating-linear-gradient(135deg,#F4F6F5_0_10px,#ECEFEE_10px_20px)] font-mono text-[11px] text-grey-600">
                {p.placeholder}
              </div>
              <div className="flex flex-1 flex-col gap-3 p-[22px]">
                <div className="flex flex-wrap gap-1.5">
                  {[p.service, p.location].map((tag) => (
                    <span key={tag} className="rounded-[2px] border border-grey-200 px-[7px] py-[3px] font-mono text-[11px] font-medium tracking-[.06em]">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="display-92 text-[21px] leading-[1.2] font-bold text-pretty">{p.title}</div>
                <div className="mt-auto grid grid-cols-2 gap-2.5 border-t border-grey-100 pt-3">
                  {p.metrics.map(([value, label]) => (
                    <div key={label} className="flex flex-col gap-0.5">
                      <span className="font-mono text-[19px] font-semibold">
                        {value}
                        <Tbc className="align-top" />
                      </span>
                      <span className="text-[12.5px] text-grey-600">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section id="testimonials" data-screen-label="07 Testimonials" className={`border-y border-grey-200 bg-grey-50 py-28 ${padX}`}>
      <Testimonials />
    </section>
  );
}

export function AssistantQuote() {
  return (
    <section id="assistant" data-screen-label="08 Assistant + Quote" className={`bg-paper py-30 ${padX}`}>
      <div className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(340px,1fr))] gap-6">
        <div className="flex flex-col gap-5 rounded-md border border-grey-200 bg-white p-[clamp(24px,3vw,40px)]">
          <div className="eyebrow">08 · SAFETAG assistant</div>
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
          <a href="#" className={`${btnPrimary} mt-auto h-13 justify-center gap-2.5 text-base hover:bg-green-400`}>
            Continue to full quote form
            <ArrowRight className="size-[18px]" />
          </a>
          <div className="text-[13px] text-grey-300">Six short steps: contact, company, service, location, requirement, documents.</div>
        </div>
      </div>
    </section>
  );
}
