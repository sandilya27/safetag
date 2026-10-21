"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { MessageSquare, Send, X } from "lucide-react";
import { contact, serviceHref, services, type Service } from "@/lib/content";
import { useChat } from "./chat-context";

const bubbleIn = "max-w-[88%] self-start rounded-[10px_10px_10px_2px] border border-grey-200 bg-white px-3 py-2.5 text-sm leading-[1.45]";
const bubbleOut = "max-w-[80%] self-end rounded-[10px_10px_2px_10px] bg-ink px-3 py-2.5 text-sm leading-[1.45] text-white";

// Words visitors use for each service, beyond the service title itself.
const KEYWORDS: Record<string, string[]> = {
  "calibration-services": ["calibrat", "gauge", "transmitter", "thermocouple", "rtd", "meter", "scale", "balance", "instrument", "micrometer", "caliper"],
  "non-destructive-testing": ["ndt", "ultrasonic", "radiograph", "x-ray", "magnetic particle", "penetrant", "crack", "flaw", "thickness"],
  "material-mechanical-testing": ["tensile", "hardness", "impact", "charpy", "material", "metallurg", "pmi", "composition"],
  "load-testing": ["load test", "crane", "hoist", "lifting", "sling", "shackle", "forklift"],
  "hydro-testing": ["hydro", "pressure test", "leak", "pipeline", "vessel", "tank", "pneumatic"],
  "valve-testing": ["valve", "psv", "relief", "safety valve", "set pressure"],
  "welding-testing": ["weld", "wps", "pqr", "welder"],
  "third-party-inspection": ["third party", "third-party", "tpi", "vendor", "itp", "witness", "coating", "expedit"],
  "environmental-testing": ["environment", "air quality", "emission", "stack", "noise", "water", "soil"],
  torquing: ["torqu", "bolt", "tension", "flange"],
  "shutdown-jobs": ["shutdown", "turnaround", "outage"],
  "operation-maintenance": ["maintenance", "o&m", "preventive"],
  "field-services": ["on site", "on-site", "field", "mobilis", "mobiliz"],
};

type Msg = { from: "me" | "bot"; text: string; services?: Service[]; links?: [string, string][] };

const GREETING: Msg = { from: "bot", text: "Hello. Describe your equipment or the job, and I will point you to the right SAFETAG service." };
const SUGGESTIONS = ["Pressure gauges need calibration", "PSV testing during a shutdown", "Verify a certificate"];

/** Match a question to services and site pages. Runs locally until the AI API is connected. */
function answer(q: string): Msg {
  const t = q.toLowerCase();
  if (/certificat|verif/.test(t))
    return { from: "bot", text: "You can check a certificate reference on the certifications page. For a confirmation letter, contact us with the reference.", links: [["Verify a certificate", "/certifications#verify"], ["Contact us", "/contact"]] };
  if (/price|cost|quot|how much/.test(t))
    return { from: "bot", text: "Every quotation is prepared by an engineer for your scope. The quote form takes a few minutes.", links: [["Request a Quote", "/request-a-quote"]] };
  if (/job|career|vacanc|hiring|cv/.test(t)) return { from: "bot", text: "Open roles and the application form are on the careers page.", links: [["Careers", "/careers"]] };
  if (/phone|call|email|address|contact|where are you/.test(t))
    return { from: "bot", text: `You can call ${contact.phone} or email ${contact.email}.`, links: [["Contact page", "/contact"]] };
  const scored = services
    .map((s) => ({ s, score: (KEYWORDS[s.slug] ?? []).filter((k) => t.includes(k)).length + (t.includes(s.title.toLowerCase()) ? 2 : 0) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((x) => x.s);
  if (scored.length)
    return {
      from: "bot",
      text: scored.length > 1 ? "That sounds like one of these services. Shall I start a quote with it?" : `That falls under ${scored[0].title}. Shall I start a quote with it?`,
      services: scored,
    };
  return {
    from: "bot",
    text: "I could not match that to a service. An engineer can help: send your requirement through the quote form, or call us.",
    links: [["Request a Quote", "/request-a-quote"], ["Browse all services", "/services"]],
  };
}

/** Floating "Ask SAFETAG" button and assistant panel. */
export function ChatWidget() {
  const { open, setOpen } = useChat();
  const [msgs, setMsgs] = useState<Msg[]>([GREETING]);
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [msgs]);

  const ask = (q: string) => {
    const text = q.trim();
    if (!text) return;
    setMsgs((m) => [...m, { from: "me", text }, answer(text)]);
    setDraft("");
  };
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    ask(draft);
  };
  const close = () => setOpen(false);

  return (
    <div className="fixed end-[clamp(16px,2vw,28px)] bottom-[84px] z-45 flex flex-col items-end gap-3 md:bottom-6" onKeyDown={(e) => e.key === "Escape" && close()}>
      {open && (
        <div
          role="dialog"
          aria-label="SAFETAG assistant"
          className="flex max-h-[min(600px,calc(100dvh-160px))] w-[min(380px,calc(100vw-32px))] flex-col overflow-hidden rounded-lg border border-grey-200 bg-white shadow-[0_8px_24px_rgb(11_15_14/.12)]"
        >
          <div data-surface="inverse" className="flex items-center gap-3 bg-ink px-4 py-3.5 text-white">
            <span className="flex size-9 items-center justify-center rounded-full bg-green-500">
              <MessageSquare className="size-[18px] text-ink" />
            </span>
            <div className="flex flex-1 flex-col gap-0.5">
              <span className="text-[15px] font-semibold">SAFETAG assistant</span>
              <span className="font-mono text-[11px] text-grey-300">Answers from SAFETAG-approved content</span>
            </div>
            <button type="button" onClick={close} aria-label="Close assistant" className="flex size-11 cursor-pointer items-center justify-center rounded border-0 bg-transparent hover:bg-grey-800">
              <X className="size-[18px] text-white" />
            </button>
          </div>
          <div ref={listRef} aria-live="polite" className="flex flex-1 flex-col gap-2.5 overflow-x-hidden overflow-y-auto overscroll-contain bg-grey-50 p-4">
            {msgs.map((m, i) =>
              m.from === "me" ? (
                <div key={i} className={bubbleOut}>
                  {m.text}
                </div>
              ) : (
                <div key={i} className={`${bubbleIn} flex flex-col gap-2.5`}>
                  <span>{m.text}</span>
                  {m.services?.map((s) => (
                    <div key={s.slug} className="flex flex-col gap-1.5 rounded border border-grey-200 p-2.5">
                      <Link href={serviceHref(s)} onClick={close} className="flex items-center gap-2.5 text-ink no-underline hover:text-green-700">
                        <s.icon className="size-5 flex-none text-green-700" />
                        <span className="flex-1 text-sm font-semibold">{s.title}</span>
                      </Link>
                      <Link href={`/request-a-quote?service=${s.slug}`} onClick={close} className="text-[13px] font-semibold text-green-700 no-underline hover:text-ink">
                        Start a quote
                      </Link>
                    </div>
                  ))}
                  {m.links && (
                    <div className="flex flex-wrap gap-1.5">
                      {m.links.map(([label, href]) => (
                        <Link key={href} href={href} onClick={close} className="flex h-9 items-center rounded-full border border-grey-300 px-3 text-[13px] font-semibold text-ink no-underline hover:border-ink hover:text-ink">
                          {label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ),
            )}
            {msgs.length === 1 && (
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" onClick={() => ask(s)} className="h-10 cursor-pointer rounded-full border border-grey-300 bg-white px-3.5 text-[13.5px] font-medium hover:border-ink">
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
          <form onSubmit={onSubmit} className="flex gap-2 border-t border-grey-200 p-3">
            <input
              ref={inputRef}
              aria-label="Message"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type your question"
              className="h-11 min-w-0 flex-1 rounded border border-grey-400 px-3 text-[15px] outline-none placeholder:text-grey-500 focus:border-green-700 focus:shadow-[0_0_0_3px_#A9E7C0]"
            />
            <button aria-label="Send" disabled={!draft.trim()} className="flex size-11 cursor-pointer items-center justify-center rounded border-0 bg-ink disabled:cursor-not-allowed disabled:opacity-40">
              <Send className="size-[18px] text-white" />
            </button>
          </form>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close SAFETAG assistant" : "Open SAFETAG assistant"}
        aria-expanded={open}
        className="flex h-14 cursor-pointer items-center gap-2.5 rounded-full border border-grey-700 bg-ink ps-4 pe-5 text-[15px] font-semibold whitespace-nowrap text-white shadow-[0_8px_24px_rgb(11_15_14/.18)] hover:bg-grey-800"
      >
        <span className="flex size-7 items-center justify-center rounded-full bg-green-500">
          <MessageSquare className="size-4 text-ink" />
        </span>
        {open ? "Close" : "Ask SAFETAG"}
      </button>
    </div>
  );
}
