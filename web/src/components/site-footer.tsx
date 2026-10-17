import { Facebook, Instagram, Linkedin, Phone, Twitter } from "lucide-react";
import { companyLinks, contact, services } from "@/lib/content";
import { Logo } from "./logo";

const socials = [
  ["LinkedIn", Linkedin],
  ["X", Twitter],
  ["Instagram", Instagram],
  ["Facebook", Facebook],
] as const;

const footLink = "text-[14.5px] text-grey-100 no-underline hover:text-green-500";

export function SiteFooter() {
  return (
    <footer id="footer" data-screen-label="09 Footer" data-surface="inverse" className="bg-ink px-[clamp(20px,4vw,48px)] pt-20 pb-30 text-white md:pb-10">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-14">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-10">
          <div className="col-span-2 flex min-w-0 flex-col gap-[18px]">
            <Logo inverse title="SAFETAG" className="h-11 w-auto self-start" />
            <p className="m-0 max-w-[380px] text-[15px] leading-[1.6] text-grey-300">
              Independent calibration, testing and third-party inspection services across the Kingdom of Saudi Arabia.
            </p>
            <div className="flex flex-col gap-2 font-mono text-[15px]">
              <a href={contact.phoneHref} className="text-white no-underline hover:text-green-500">
                {contact.phone}
              </a>
              <a href={`mailto:${contact.email}`} className="text-white no-underline hover:text-green-500">
                {contact.email}
              </a>
              <span className="font-sans text-[14.5px] text-grey-300">
                {contact.address}
                <sup className="tbc">TBC</sup>
              </span>
            </div>
          </div>
          <nav aria-label="Services" className="flex flex-col gap-2.5">
            <div className="label-mono text-grey-400">SERVICES</div>
            {services.slice(0, 7).map((s) => (
              <a key={s.title} href="#" className={footLink}>
                {s.title}
              </a>
            ))}
            <a href="#services" className="text-[14.5px] font-semibold text-green-500 no-underline">
              All services
            </a>
          </nav>
          <nav aria-label="Company" className="flex flex-col gap-2.5">
            <div className="label-mono text-grey-400">COMPANY</div>
            {companyLinks.map((l) => (
              <a key={l} href="#" className={footLink}>
                {l}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-5 border-t border-grey-700 pt-6">
          <div className="flex gap-2">
            {socials.map(([label, Icon]) => (
              <a key={label} href="#" aria-label={label} className="flex size-11 items-center justify-center rounded border border-grey-700 hover:border-green-500">
                <Icon className="size-[18px] text-white" />
              </a>
            ))}
          </div>
          <div className="flex flex-wrap gap-5 text-[13.5px] text-grey-400">
            <span>© 2026 SAFETAG</span>
            <a href="#" className="text-grey-300 no-underline hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="text-grey-300 no-underline hover:text-white">
              Terms &amp; Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/** Sticky call + quote bar on phones (< 768px). */
export function MobileQuoteBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-grey-200 bg-white px-4 pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom))] md:hidden">
      <a href={contact.phoneHref} aria-label="Call SAFETAG" className="box-border flex size-12 flex-none items-center justify-center rounded border-[1.5px] border-ink">
        <Phone className="size-5 text-ink" />
      </a>
      <a href="#assistant" className="flex h-12 flex-1 items-center justify-center rounded bg-green-500 text-base font-semibold text-ink no-underline hover:text-ink">
        Request a Quote
      </a>
    </div>
  );
}
