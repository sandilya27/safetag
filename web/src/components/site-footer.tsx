import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { companyLinks, contact, serviceHref, services } from "@/lib/content";
import { Logo } from "./logo";

// Social profile URLs to be supplied by SAFETAG.
const socials = [
  ["LinkedIn", Linkedin],
  ["X", Twitter],
  ["Instagram", Instagram],
  ["Facebook", Facebook],
] as const;

const footLink = "text-[14.5px] text-grey-100 no-underline hover:text-green-500";

export function SiteFooter() {
  return (
    <footer id="footer" data-screen-label="09 Footer" data-surface="inverse" className="pl-[max(clamp(20px,4vw,48px),env(safe-area-inset-left))] pr-[max(clamp(20px,4vw,48px),env(safe-area-inset-right))] bg-ink pt-20 pb-[calc(2.5rem+env(safe-area-inset-bottom))] text-white">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-14">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-10">
          <div className="col-span-full flex min-w-0 flex-col gap-[18px] sm:col-span-2">
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
              <Link key={s.title} href={serviceHref(s)} className={footLink}>
                {s.title}
              </Link>
            ))}
            <Link href="/services" className="text-[14.5px] font-semibold text-green-500 no-underline">
              All services
            </Link>
          </nav>
          <nav aria-label="Company" className="flex flex-col gap-2.5">
            <div className="label-mono text-grey-400">COMPANY</div>
            {companyLinks.map(([label, href]) => (
              <Link key={label} href={href} className={footLink}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-5 border-t border-grey-700 pt-6">
          <div className="flex gap-2">
            {socials.map(([label, Icon]) => (
              <a key={label} href="#" aria-label={`SAFETAG on ${label}`} className="flex size-11 items-center justify-center rounded border border-grey-700 hover:border-green-500">
                <Icon className="size-[18px] text-white" />
              </a>
            ))}
          </div>
          <div className="flex flex-wrap gap-5 text-[13.5px] text-grey-400">
            <span>© 2026 SAFETAG</span>
            <Link href="/privacy-policy" className="text-grey-300 no-underline hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="text-grey-300 no-underline hover:text-white">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
