"use client";

// Small interactive pieces of the homepage. Sections themselves stay server components.
import { useState } from "react";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { assistantChips, demoReadout, ringServices, services, testimonials } from "@/lib/content";
import { useChat } from "../chat-context";
import { useStory } from "./story-context";

/** Pinned services card: follows the service currently at 3 o’clock on the ring. */
export function ActiveServiceCard() {
  const { active } = useStory();
  const svc = ringServices[active] ?? ringServices[0];
  return (
    <>
      <div aria-live="polite" className="box-border flex min-h-[210px] flex-col gap-3.5 rounded-md border border-ink bg-white px-7 py-[26px]">
        <div className="flex items-center justify-between">
          <span className="flex size-11 items-center justify-center rounded bg-green-50">
            <svc.icon className="size-6 text-green-700" />
          </span>
          <span className="font-mono text-[13px] font-semibold">{String(active + 1).padStart(2, "0")} / 08</span>
        </div>
        <div className="display-92 text-[28px] leading-[1.12] font-bold">{svc.title}</div>
        <p className="m-0 text-base leading-[1.55] text-grey-700">{svc.description}</p>
        <a href="#" className="flex items-center gap-1.5 text-[15px] font-semibold text-green-700 no-underline hover:text-ink">
          View service
          <ArrowRight className="size-[15px]" />
        </a>
      </div>
      <div className="grid grid-cols-8 gap-1">
        {ringServices.map((s, i) => (
          <div key={s.title} className="h-[3px] transition-colors duration-200" style={{ background: i <= active ? "#0B0F0E" : "#DADFDD" }} />
        ))}
      </div>
    </>
  );
}

/** Dark calibration readout. Counts up with the S6 needle sweep; static mode shows final values. */
export function CalibrationReadout() {
  const { gauge } = useStory();
  const { target, unit, decimals, tolerance, label } = demoReadout;
  const live = gauge > 0.02;
  const val = target * gauge;
  const dev = live ? ((val - target) / target) * 100 : -100;
  const inTol = Math.abs(dev) <= tolerance;
  const status = live ? (inTol ? "WITHIN TOLERANCE" : "MEASURING") : "STANDBY";
  return (
    <div data-surface="inverse" className="flex flex-col gap-3.5 rounded-md bg-ink px-6 py-[22px] text-white">
      <div className="flex items-center justify-between font-mono text-[11.5px] font-semibold tracking-[.08em] text-grey-300">
        <span>CALIBRATION RUN · {label}</span>
        <span style={{ color: inTol && live ? "#50C878" : "#F2A93B" }}>{status}</span>
      </div>
      <div className="flex items-baseline gap-2.5">
        <span className="font-mono text-[clamp(40px,4vw,56px)] leading-none font-medium text-green-500 tabular-nums">{val.toFixed(decimals)}</span>
        <span className="font-mono text-lg font-medium text-grey-300">{unit}</span>
      </div>
      <div className="grid grid-cols-3 gap-3 border-t border-grey-700 pt-3 font-mono text-[12.5px] leading-normal text-grey-300">
        <div className="flex flex-col">
          <span>SET POINT</span>
          <span className="text-[15px] text-white">
            {target.toFixed(decimals)} {unit}
          </span>
        </div>
        <div className="flex flex-col">
          <span>DEVIATION</span>
          <span className="text-[15px] text-white">{live ? `${dev >= 0 ? "+" : "−"}${Math.abs(dev).toFixed(1)}%` : "—"}</span>
        </div>
        <div className="flex flex-col">
          <span>TOLERANCE</span>
          <span className="text-[15px] text-white">±{tolerance}%</span>
        </div>
      </div>
      <div className="font-mono text-[11px] text-grey-400">Illustrative values for animation only.</div>
    </div>
  );
}

export function VerifyCertificateForm() {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex min-w-[300px] flex-[0_1_380px] flex-col gap-2">
      <label htmlFor="verify" className="text-sm font-medium text-white">
        Verify a SAFETAG certificate
      </label>
      <div className="flex gap-2">
        <input
          id="verify"
          placeholder="Certificate reference"
          className="h-12 min-w-0 flex-1 rounded border border-grey-500 bg-grey-900 px-3.5 font-mono text-[15px] text-white outline-none focus:border-green-500 focus:shadow-[0_0_0_3px_#145A32]"
        />
        <button className="h-12 cursor-pointer rounded border-[1.5px] border-white bg-transparent px-[18px] text-[15px] font-semibold text-white hover:bg-grey-800">Verify</button>
      </div>
    </form>
  );
}

export function Testimonials() {
  const [i, setI] = useState(0);
  const t = testimonials[i];
  const n = testimonials.length;
  const btn = "flex size-12 cursor-pointer items-center justify-center rounded border-[1.5px] border-ink bg-white hover:bg-grey-100";
  return (
    <div className="mx-auto grid max-w-[1080px] grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-start gap-12">
      <div className="flex flex-col gap-[18px]">
        <div className="eyebrow">07 · Client feedback</div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setI((i + n - 1) % n)} aria-label="Previous testimonial" className={btn}>
            <ArrowLeft className="size-[18px] text-ink" />
          </button>
          <button type="button" onClick={() => setI((i + 1) % n)} aria-label="Next testimonial" className={btn}>
            <ArrowRight className="size-[18px] text-ink" />
          </button>
          <span className="ms-3 self-center font-mono text-[13px] font-semibold">
            {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </span>
        </div>
      </div>
      <figure aria-live="polite" className="m-0 flex flex-col gap-[22px]">
        <span className="font-display text-[64px] leading-[0.5] font-extrabold text-green-500">“</span>
        <blockquote className="m-0 text-[clamp(21px,2.1vw,28px)] leading-[1.4] font-medium text-pretty">{t.quote}</blockquote>
        <figcaption className="flex items-center gap-3 border-t border-grey-200 pt-4">
          <div className="flex size-11 items-center justify-center rounded-full border border-grey-200 bg-white font-mono text-[13px] font-semibold">{t.initials}</div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[15px] font-semibold">{t.role}</span>
            <span className="text-[13.5px] text-grey-600">{t.org}</span>
          </div>
        </figcaption>
      </figure>
    </div>
  );
}

export function AssistantChips() {
  const { setOpen } = useChat();
  return (
    <div className="flex flex-wrap gap-2">
      {assistantChips.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => setOpen(true)}
          className="h-11 cursor-pointer rounded-full border border-grey-300 bg-white px-3.5 text-sm font-medium whitespace-nowrap hover:border-ink"
        >
          {c}
        </button>
      ))}
    </div>
  );
}

export function QuickQuoteFields() {
  const [loc, setLoc] = useState<"lab" | "site">("lab");
  const radio = (value: "lab" | "site", label: string) => {
    const on = loc === value;
    return (
      <button
        type="button"
        role="radio"
        aria-checked={on}
        onClick={() => setLoc(value)}
        className="h-12 flex-1 cursor-pointer rounded border-[1.5px] text-[15px] font-medium text-white"
        style={{ borderColor: on ? "#50C878" : "#6B7472", background: on ? "#222827" : "transparent" }}
      >
        {label}
      </button>
    );
  };
  return (
    <>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">Service required</span>
        <div className="relative">
          <select className="h-12 w-full appearance-none rounded border border-grey-500 bg-grey-900 ps-3.5 pe-10 text-[15px] text-white">
            {services.map((s) => (
              <option key={s.title}>{s.title}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute end-3.5 top-4 size-4 text-white" />
        </div>
      </label>
      <div className="flex gap-2" role="radiogroup" aria-label="Location of work">
        {radio("lab", "At SAFETAG lab")}
        {radio("site", "On-site")}
      </div>
    </>
  );
}
