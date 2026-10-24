"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import Link from "next/link";
import { Send, X } from "lucide-react";
import { serviceHref } from "@/lib/content";
import { answer, FOLLOW_UPS, GREETING, type Msg } from "@/lib/kunna-brain";
import { useChat } from "./chat-context";
import { Kunna, type KunnaMood } from "./kunna";
import { KunnaThought, THOUGHT_GAP } from "./kunna-thought";
import { useKunnaRoam } from "./use-kunna-roam";

const bubbleIn = "max-w-[88%] self-start rounded-[10px_10px_10px_2px] border border-grey-200 bg-white px-3 py-2.5 text-sm leading-[1.45]";
const bubbleOut = "max-w-[80%] self-end rounded-[10px_10px_2px_10px] bg-ink px-3 py-2.5 text-sm leading-[1.45] text-white";
const chipBtn = "min-h-10 cursor-pointer rounded-full border border-grey-300 bg-white px-3.5 text-[13.5px] font-medium hover:border-ink";

const CHAT_SILENCE = 25_000;
const NAP_AFTER = 30_000;
const SLEEP_AFTER = 45_000;
const GAP = 12;
const SIZE = 60;
const TIP_W = 232;

type Place = { left: number; maxH: number; above: boolean; cx: number } & ({ bottom: number; top?: undefined } | { top: number; bottom?: undefined });

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** Where a card of width `w` sits next to Kunna: above or below her, kept inside the viewport. */
function place(rect: DOMRect, w: number, gap = GAP): Place {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const fromRight = rect.left + rect.width / 2 > vw / 2;
  const left = clamp(fromRight ? rect.right - w : rect.left, 16, Math.max(16, vw - 16 - w));
  const above = rect.top + rect.height / 2 > vh / 2;
  const cx = rect.left + rect.width / 2;
  return above
    ? { left, above, cx, bottom: vh - rect.top + gap, maxH: Math.max(220, rect.top - gap - 84) }
    : { left, above, cx, top: rect.bottom + gap, maxH: vh - rect.bottom - gap - 16 };
}
const placeStyle = (p: Place, maxH: number): CSSProperties => ({ left: p.left, top: p.top, bottom: p.bottom, maxHeight: Math.min(maxH, p.maxH) });

/**
 * Kunna: a mascot that roams the page on her own (see use-kunna-roam.ts), reacts to the visitor, and
 * opens the assistant panel beside wherever she is standing when she is clicked.
 */
export function ChatWidget() {
  const { open, setOpen } = useChat();
  const [msgs, setMsgs] = useState<Msg[]>([GREETING]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);
  const [flash, setFlash] = useState<KunnaMood | null>(null);
  const [nap, setNap] = useState<"awake" | "drowsy" | "sleeping">("sleeping");
  const [panelAt, setPanelAt] = useState<Place | null>(null);
  const [bubbleAt, setBubbleAt] = useState<Place | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const flashTimer = useRef(0);
  const replyTimer = useRef(0);
  const lastActive = useRef(0);
  const followUps = useRef(0);

  const react = useCallback((m: KunnaMood, ms: number) => {
    window.clearTimeout(flashTimer.current);
    setFlash(m);
    flashTimer.current = window.setTimeout(() => setFlash(null), ms);
  }, []);

  const roam = useKunnaRoam({ size: SIZE, bodyRef: btnRef, parked: open || focused, asleep: nap !== "awake", lastActive, react });
  const { vp, pos, ms, moving, gaze, bubble, still, freeze, hideBubble, dismissBubble } = roam;
  const panelW = Math.min(380, Math.max(0, vp.w - 32));

  // A reaction wins; then walking; then waiting on an answer; then hover; then the sleep cycle.
  const mood: KunnaMood = flash ?? (moving ? "walk" : typing ? "thinking" : hover ? "excited" : nap === "awake" ? "idle" : nap);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [msgs, typing]);

  // The chat can be opened from elsewhere on the page; if she is mid-walk, she stops where she is.
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(freeze, 0);
    return () => window.clearTimeout(t);
  }, [open, freeze]);

  // The panel and her speech bubble sit beside her, above or below.
  useLayoutEffect(() => {
    const el = btnRef.current;
    if (!el || !vp.w) return;
    const rect = el.getBoundingClientRect();
    if (open) setPanelAt(place(rect, panelW));
    if (bubble && !open) setBubbleAt(place(rect, Math.min(TIP_W, vp.w - 32), THOUGHT_GAP));
  }, [open, bubble, pos, vp, panelW]);

  // Wakes up on load, dozes off after a quiet spell, and wakes on any activity.
  useEffect(() => {
    lastActive.current = Date.now();
    const t1 = window.setTimeout(() => setNap("drowsy"), 350);
    const t2 = window.setTimeout(() => setNap("awake"), 1100);
    const bump = () => {
      lastActive.current = Date.now();
      setNap((n) => (n === "awake" ? n : "awake"));
    };
    const events = ["pointermove", "pointerdown", "keydown", "scroll", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, bump, { passive: true }));
    const tick = window.setInterval(() => {
      const idle = Date.now() - lastActive.current;
      setNap(idle > SLEEP_AFTER ? "sleeping" : idle > NAP_AFTER ? "drowsy" : "awake");
    }, 2000);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearInterval(tick);
      events.forEach((e) => window.removeEventListener(e, bump));
    };
  }, []);

  // In an open chat, a quiet visitor gets a gentle follow-up, at most twice.
  useEffect(() => {
    if (!open || typing || followUps.current >= FOLLOW_UPS.length) return;
    const t = window.setTimeout(() => {
      setMsgs((m) => [...m, FOLLOW_UPS[followUps.current++]]);
      react("happy", 1200);
    }, CHAT_SILENCE);
    return () => window.clearTimeout(t);
  }, [open, typing, msgs, react]);

  useEffect(
    () => () => {
      window.clearTimeout(flashTimer.current);
      window.clearTimeout(replyTimer.current);
    },
    [],
  );

  const ask = (q: string) => {
    const text = q.trim();
    if (!text || typing) return;
    setMsgs((m) => [...m, { from: "me", text }]);
    setDraft("");
    setTyping(true);
    window.clearTimeout(replyTimer.current);
    replyTimer.current = window.setTimeout(() => {
      const reply = answer(text);
      setTyping(false);
      setMsgs((m) => [...m, reply]);
      if (reply.miss) react("confused", 2200);
      else react("happy", 1800);
    }, 900);
  };
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    ask(draft);
  };
  const close = () => setOpen(false);
  const toggle = () => {
    hideBubble();
    freeze();
    if (!open) react("happy", 1400);
    setOpen(!open);
  };

  const last = msgs[msgs.length - 1];
  const moveStyle: CSSProperties = {
    width: SIZE,
    height: SIZE,
    transform: `translate3d(${pos?.x ?? 0}px, ${pos?.y ?? 0}px, 0)`,
    transition: ms && !still ? `transform ${ms}ms cubic-bezier(0.45, 0.05, 0.25, 1)` : "none",
  };

  return (
    <div data-kunna-root className="pointer-events-none fixed inset-0 z-45" onKeyDown={(e) => e.key === "Escape" && close()}>
      {open && panelAt && (
        <div
          role="dialog"
          aria-label="Kunna, SAFETAG assistant"
          style={placeStyle(panelAt, 600)}
          className="pointer-events-auto fixed flex w-[min(380px,calc(100vw-32px))] flex-col overflow-hidden rounded-lg border border-grey-200 bg-white shadow-[0_8px_24px_rgb(11_15_14/.12)]"
        >
          <div data-surface="inverse" className="flex items-center gap-3 bg-ink px-4 py-3 text-white">
            <Kunna mood={mood} className="size-12 flex-none" />
            <div className="flex flex-1 flex-col gap-0.5">
              <span className="text-[15px] font-semibold">Kunna</span>
              <span className="font-mono text-[11px] text-grey-300">SAFETAG assistant · approved content only</span>
            </div>
            <button type="button" onClick={close} aria-label="Close Kunna" className="flex size-11 cursor-pointer items-center justify-center rounded border-0 bg-transparent hover:bg-grey-800">
              <X className="size-[18px] text-white" />
            </button>
          </div>
          <div ref={listRef} aria-live="polite" className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-x-hidden overflow-y-auto overscroll-contain bg-grey-50 p-4">
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
                      <Link
                        href={`/request-a-quote?service=${s.slug}`}
                        onClick={() => {
                          react("celebrate", 2600);
                          close();
                        }}
                        className="text-[13px] font-semibold text-green-700 no-underline hover:text-ink"
                      >
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
            {typing && (
              <div className={`${bubbleIn} flex items-center gap-1.5 py-3`}>
                <span className="sr-only">Kunna is typing</span>
                {[0, 1, 2].map((d) => (
                  <span key={d} aria-hidden="true" className="kunna-dot size-1.5 rounded-full bg-grey-500" style={{ animationDelay: `${d * 0.15}s` }} />
                ))}
              </div>
            )}
            {!typing && last.from === "bot" && last.chips && (
              <div className="flex flex-wrap gap-1.5">
                {last.chips.map((c) => (
                  <button key={c} type="button" onClick={() => ask(c)} className={chipBtn}>
                    {c}
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
            <button aria-label="Send" disabled={!draft.trim() || typing} className="flex size-11 cursor-pointer items-center justify-center rounded border-0 bg-ink disabled:cursor-not-allowed disabled:opacity-40">
              <Send className="size-[18px] text-white" />
            </button>
          </form>
        </div>
      )}
      {bubble && !open && bubbleAt && (
        <KunnaThought
          thought={bubble}
          style={placeStyle(bubbleAt, 260)}
          above={bubbleAt.above}
          tailX={clamp(bubbleAt.cx - bubbleAt.left, 24, Math.min(TIP_W, vp.w - 32) - 24)}
          onOpen={toggle}
          onGo={hideBubble}
          onChoose={(q) => {
            hideBubble();
            freeze();
            setOpen(true);
            ask(q);
          }}
          onDismiss={dismissBubble}
        />
      )}
      {pos && (
        <div className="absolute top-0 left-0" style={moveStyle}>
          <button
            ref={btnRef}
            type="button"
            onClick={toggle}
            onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
            onPointerLeave={() => setHover(false)}
            onFocus={() => {
              freeze();
              setFocused(true);
            }}
            onBlur={() => setFocused(false)}
            aria-label={open ? "Close Kunna" : "Ask Kunna, the SAFETAG assistant"}
            aria-expanded={open}
            className="group pointer-events-auto relative flex size-full cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 drop-shadow-[0_6px_8px_rgb(11_15_14/.22)]"
          >
            <Kunna mood={mood} look={gaze} className="size-full" />
            {!open && !moving && (
              <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded bg-ink px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
                Ask Kunna
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
