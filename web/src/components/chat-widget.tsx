"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type FormEvent, type PointerEvent as ReactPointerEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Send, X } from "lucide-react";
import { serviceHref } from "@/lib/content";
import { answer, FOLLOW_UPS, GREETING, nudgeFor, type Msg } from "@/lib/kunna-brain";
import { useChat } from "./chat-context";
import { Kunna, type KunnaMood } from "./kunna";

const bubbleIn = "max-w-[88%] self-start rounded-[10px_10px_10px_2px] border border-grey-200 bg-white px-3 py-2.5 text-sm leading-[1.45]";
const bubbleOut = "max-w-[80%] self-end rounded-[10px_10px_2px_10px] bg-ink px-3 py-2.5 text-sm leading-[1.45] text-white";
const chipBtn = "min-h-10 cursor-pointer rounded-full border border-grey-300 bg-white px-3.5 text-[13.5px] font-medium hover:border-ink";

const POS_KEY = "kunna-pos";
const NUDGE_KEY = "kunna-nudges";
const MUTE_KEY = "kunna-muted";
const MAX_NUDGES = 4;
const NUDGE_GAP = 45_000;
const NUDGE_SHOW = 12_000;
const CHAT_SILENCE = 25_000;
const NAP_AFTER = 30_000;
const SLEEP_AFTER = 45_000;
const EDGE = 8;
const DRAG_SLOP = 6;
const GAP = 12;
const TIP_W = 232;

type Pos = { r: number; b: number };
type Place = { left: number; maxH: number } & ({ bottom: number; top?: undefined } | { top: number; bottom?: undefined });

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const store = {
  get: (k: string, area: "local" | "session" = "session") => {
    try {
      return (area === "local" ? localStorage : sessionStorage).getItem(k);
    } catch {
      return null;
    }
  },
  set: (k: string, v: string, area: "local" | "session" = "session") => {
    try {
      (area === "local" ? localStorage : sessionStorage).setItem(k, v);
    } catch {}
  },
};

/** Where a card of width `w` sits next to the launcher: above or below it, kept inside the viewport. */
function place(rect: DOMRect, w: number): Place {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const fromRight = rect.left + rect.width / 2 > vw / 2;
  const left = clamp(fromRight ? rect.right - w : rect.left, 16, Math.max(16, vw - 16 - w));
  const above = rect.top + rect.height / 2 > vh / 2;
  return above ? { left, bottom: vh - rect.top + GAP, maxH: rect.top - GAP - 16 } : { left, top: rect.bottom + GAP, maxH: vh - rect.bottom - GAP - 16 };
}
const placeStyle = (p: Place, maxH: number): CSSProperties => ({ left: p.left, top: p.top, bottom: p.bottom, maxHeight: Math.min(maxH, p.maxH) });

/**
 * Kunna: a draggable launcher with a mascot that reacts to the visitor, nudges that follow the page
 * they are on, and the assistant panel. The panel and nudges open beside wherever Kunna has been moved.
 */
export function ChatWidget() {
  const { open, setOpen } = useChat();
  const path = usePathname();
  const [msgs, setMsgs] = useState<Msg[]>([GREETING]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [hover, setHover] = useState(false);
  const [held, setHeld] = useState(false);
  const [flash, setFlash] = useState<KunnaMood | null>(null);
  const [nap, setNap] = useState<"awake" | "drowsy" | "sleeping">("sleeping");
  const [tip, setTip] = useState<string | null>(null);
  const [pos, setPos] = useState<Pos | null>(null);
  const [vp, setVp] = useState({ w: 0, h: 0 });
  const [panelAt, setPanelAt] = useState<Place | null>(null);
  const [tipAt, setTipAt] = useState<Place | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const flashTimer = useRef(0);
  const replyTimer = useRef(0);
  const lastActive = useRef(0);
  const followUps = useRef(0);
  const drag = useRef<{ x: number; y: number; r: number; b: number; w: number; h: number; moved: boolean } | null>(null);
  const skipClick = useRef(false);

  // A reaction wins; then being carried; then waiting on an answer; then hover; then the sleep cycle.
  const mood: KunnaMood = flash ?? (held ? "happy" : typing ? "thinking" : hover ? "excited" : nap === "awake" ? "idle" : nap);
  const panelW = Math.min(380, Math.max(0, vp.w - 32));

  const react = (m: KunnaMood, ms: number) => {
    window.clearTimeout(flashTimer.current);
    setFlash(m);
    flashTimer.current = window.setTimeout(() => setFlash(null), ms);
  };

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [msgs, typing]);

  // Viewport size, and the saved position kept on screen as the window changes.
  useEffect(() => {
    const sync = () => {
      setVp({ w: window.innerWidth, h: window.innerHeight });
      setPos((p) => (p && btnRef.current ? limit(p, btnRef.current.getBoundingClientRect()) : p));
    };
    const limit = (p: Pos, rect: DOMRect): Pos => ({ r: clamp(p.r, EDGE, Math.max(EDGE, window.innerWidth - rect.width - EDGE)), b: clamp(p.b, EDGE, Math.max(EDGE, window.innerHeight - rect.height - EDGE)) });
    const restore = window.setTimeout(() => {
      try {
        const saved = JSON.parse(store.get(POS_KEY, "local") ?? "null");
        if (saved && typeof saved.r === "number" && typeof saved.b === "number") setPos(saved);
      } catch {}
      sync();
    }, 0);
    window.addEventListener("resize", sync);
    return () => {
      window.clearTimeout(restore);
      window.removeEventListener("resize", sync);
    };
  }, []);

  // Panel and nudge sit beside the launcher, above or below it, wherever it has been dragged.
  useLayoutEffect(() => {
    const el = btnRef.current;
    if (!el || !vp.w) return;
    const rect = el.getBoundingClientRect();
    if (open) setPanelAt(place(rect, panelW));
    if (tip && !open) setTipAt(place(rect, Math.min(TIP_W, vp.w - 32)));
  }, [open, tip, pos, vp, panelW]);

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

  // Nudges: a short line about the page the visitor is on, a few seconds in, then now and then.
  // Capped per session, and never again once the visitor dismisses one or opens the chat.
  useEffect(() => {
    if (open || tip || store.get(MUTE_KEY)) return;
    const shown = Number(store.get(NUDGE_KEY) ?? 0);
    if (shown >= MAX_NUDGES) return;
    const show = window.setTimeout(() => {
      if (document.visibilityState !== "visible") return;
      store.set(NUDGE_KEY, String(shown + 1));
      setTip(nudgeFor(path, shown));
      react("excited", 1400);
    }, shown === 0 ? 2500 : NUDGE_GAP);
    return () => window.clearTimeout(show);
  }, [open, tip, path]);
  useEffect(() => {
    if (!tip) return;
    const hide = window.setTimeout(() => setTip(null), NUDGE_SHOW);
    return () => window.clearTimeout(hide);
  }, [tip]);

  // In an open chat, a quiet visitor gets a gentle follow-up, at most twice.
  useEffect(() => {
    if (!open || typing || followUps.current >= FOLLOW_UPS.length) return;
    const t = window.setTimeout(() => {
      setMsgs((m) => [...m, FOLLOW_UPS[followUps.current++]]);
      react("happy", 1200);
    }, CHAT_SILENCE);
    return () => window.clearTimeout(t);
  }, [open, typing, msgs]);

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
    setTip(null);
    store.set(MUTE_KEY, "1");
    if (!open) react("happy", 1400);
    setOpen(!open);
  };

  // Drag from anywhere on the launcher; a press that barely moves is a click.
  const onDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    drag.current = { x: e.clientX, y: e.clientY, r: window.innerWidth - rect.right, b: window.innerHeight - rect.bottom, w: rect.width, h: rect.height, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.moved && Math.hypot(dx, dy) < DRAG_SLOP) return;
    if (!d.moved) {
      d.moved = true;
      setHeld(true);
      setTip(null);
    }
    setPos({ r: clamp(d.r - dx, EDGE, Math.max(EDGE, window.innerWidth - d.w - EDGE)), b: clamp(d.b - dy, EDGE, Math.max(EDGE, window.innerHeight - d.h - EDGE)) });
  };
  const onUp = () => {
    const d = drag.current;
    drag.current = null;
    if (!d?.moved) return;
    skipClick.current = true;
    setHeld(false);
    setPos((p) => {
      if (p) store.set(POS_KEY, JSON.stringify(p), "local");
      return p;
    });
  };
  const onClick = () => {
    if (skipClick.current) {
      skipClick.current = false;
      return;
    }
    toggle();
  };

  const last = msgs[msgs.length - 1];

  return (
    <div
      className="fixed right-[max(clamp(16px,2vw,28px),env(safe-area-inset-right))] bottom-[calc(20px+env(safe-area-inset-bottom))] z-45 md:bottom-[calc(24px+env(safe-area-inset-bottom))]"
      style={pos ? { right: pos.r, bottom: pos.b } : undefined}
      onKeyDown={(e) => e.key === "Escape" && close()}
    >
      {open && panelAt && (
        <div
          role="dialog"
          aria-label="Kunna, SAFETAG assistant"
          style={placeStyle(panelAt, 600)}
          className="fixed flex w-[min(380px,calc(100vw-32px))] flex-col overflow-hidden rounded-lg border border-grey-200 bg-white shadow-[0_8px_24px_rgb(11_15_14/.12)]"
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
      {tip && !open && tipAt && (
        <div style={placeStyle(tipAt, 200)} className="fixed w-[min(232px,calc(100vw-32px))] rounded-lg border border-grey-200 bg-white py-3 ps-4 pe-10 shadow-[0_8px_24px_rgb(11_15_14/.12)]">
          <button type="button" onClick={toggle} className="cursor-pointer border-0 bg-transparent p-0 text-start text-[14px] leading-[1.45] text-ink">
            {tip}
          </button>
          <button
            type="button"
            onClick={() => {
              setTip(null);
              store.set(MUTE_KEY, "1");
            }}
            aria-label="Dismiss"
            className="absolute end-0 top-0 flex size-10 cursor-pointer items-center justify-center rounded border-0 bg-transparent text-grey-600 hover:text-ink"
          >
            <X className="size-4" />
          </button>
        </div>
      )}
      <button
        ref={btnRef}
        type="button"
        onClick={onClick}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
        onPointerLeave={() => setHover(false)}
        aria-label={open ? "Close Kunna" : "Ask Kunna, the SAFETAG assistant. Drag to move."}
        aria-expanded={open}
        className="flex size-14 touch-none cursor-pointer items-center justify-center gap-1 rounded-full border border-grey-700 bg-ink text-[15px] font-semibold whitespace-nowrap text-white shadow-[0_8px_24px_rgb(11_15_14/.18)] select-none hover:bg-grey-800 active:cursor-grabbing md:h-14 md:w-auto md:ps-2.5 md:pe-5"
      >
        {open ? <X className="size-5" /> : <Kunna mood={mood} className="size-10 flex-none" />}
        <span className="max-md:sr-only">{open ? "Close" : "Ask Kunna"}</span>
      </button>
    </div>
  );
}
