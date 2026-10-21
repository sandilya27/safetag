// Shared building blocks for every page: class strings, the TBC marker, placeholders,
// the closing quote band and JSON-LD.
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { contact } from "@/lib/content";

export const padX = "px-[clamp(20px,4vw,48px)]";
export const container = "mx-auto w-full max-w-[1280px]";
export const h2 = "display m-0 text-[clamp(32px,3.6vw,52px)] leading-[1.02] font-extrabold tracking-[-.01em] text-balance";
export const h3 = "display-92 m-0 text-[clamp(22px,2vw,28px)] leading-[1.12] font-bold text-balance";
export const lead = "m-0 max-w-[620px] text-[clamp(17px,1.4vw,19px)] leading-[1.6] text-pretty text-grey-700";
export const textLink = "flex items-center gap-1.5 text-[15px] font-semibold text-green-700 no-underline hover:text-ink";
export const btnPrimary =
  "flex items-center rounded bg-green-500 font-semibold whitespace-nowrap text-ink no-underline transition-[background-color,transform] duration-150 hover:bg-green-600 hover:text-ink active:translate-y-px active:bg-green-650 disabled:cursor-not-allowed disabled:opacity-60";
export const btnOutline =
  "box-border flex items-center rounded border-[1.5px] border-ink font-semibold whitespace-nowrap text-ink no-underline transition-[background-color,transform] duration-150 hover:bg-grey-100 hover:text-ink active:translate-y-px";
export const chip = "rounded-[2px] border border-grey-300 bg-white px-3 py-[7px] text-sm font-medium text-ink no-underline hover:border-ink hover:text-ink";
export const tag = "rounded-[2px] border border-grey-200 px-[7px] py-[3px] font-mono text-[11px] font-medium tracking-[.06em] uppercase";

export const Tbc = ({ className = "" }: { className?: string }) => (
  <sup className={`tbc ${className}`} title="To be confirmed by SAFETAG">
    TBC
  </sup>
);

/** Slot for photography SAFETAG will supply (proposal: client provides images). */
export function Placeholder({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div role="img" aria-label={`Image to come: ${label}`} className={`hatch flex items-center justify-center p-4 text-center font-mono text-[11px] text-grey-600 ${className}`}>
      {label}
    </div>
  );
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

/** Closing call to action used at the foot of inner pages. */
export function QuoteBand({ title = "Tell us what needs testing.", service }: { title?: string; service?: string }) {
  const href = service ? `/request-a-quote?service=${service}` : "/request-a-quote";
  return (
    <section data-surface="inverse" className={`bg-ink py-20 text-white ${padX}`}>
      <div className={`${container} flex flex-wrap items-end justify-between gap-8`}>
        <div className="flex max-w-[640px] flex-col gap-4">
          <h2 className="display m-0 text-[clamp(30px,3.4vw,48px)] leading-[1.04] font-extrabold text-balance">{title}</h2>
          <p className="m-0 text-[16.5px] leading-[1.6] text-grey-300">An engineer reviews every request and replies with a formal quotation.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href={href} className={`${btnPrimary} h-13 gap-2.5 px-6 text-base hover:bg-green-400`}>
            Request a Quote
            <ArrowRight className="size-[18px]" />
          </Link>
          <a href={contact.phoneHref} className="flex h-13 items-center gap-2.5 rounded border-[1.5px] border-white px-5 font-mono text-[15px] font-medium text-white no-underline hover:bg-grey-800 hover:text-white">
            <Phone className="size-4" />
            {contact.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
