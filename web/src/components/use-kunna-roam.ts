"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { usePathname } from "next/navigation";
import { EXIT_LINE, FORM_DONE, FORM_ERROR, IDLE_LINE, introFor, nudgeFor, thoughtFor, type Thought } from "@/lib/kunna-brain";
import type { KunnaMood } from "./kunna";

export type Pt = { x: number; y: number };

const SPEED = 170; // px per second, strolling
const HOP_SPEED = 420; // a quick trot, for getting to a section's side
const MIN_TRAVEL_MS = 600;
const EDGE = 12;
const HEADER = 84;
const BUBBLE_SHOW = 9500;
const BUBBLE_GAP = 9000;
const BUBBLE_GAP_PHONE = 15_000;
const MAX_BUBBLES = 14;
const IDLE_POKE = 20_000;
const FORM_HOLD = 15_000;
const HUSH_FOR = 180_000;
const MET_KEY = "kunna-met";
const INTRO_KEY = "kunna-intro";
const EXIT_KEY = "kunna-exit";
const SECTION_MOOD: Record<string, KunnaMood> = { services: "excited", certifications: "curious", assistant: "excited", testimonials: "happy", footer: "happy" };

const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const store = {
  get: (k: string, area: "session" | "local" = "session") => {
    try {
      return (area === "local" ? localStorage : sessionStorage).getItem(k);
    } catch {
      return null;
    }
  },
  set: (k: string, v: string, area: "session" | "local" = "session") => {
    try {
      (area === "local" ? localStorage : sessionStorage).setItem(k, v);
    } catch {}
  },
};
const interactive = (t: EventTarget | null) => (t instanceof Element ? t.closest<HTMLElement>("a,button,[role='button'],input,select,textarea,summary") : null);
const inRoot = (t: EventTarget | null) => t instanceof Element && !!t.closest("[data-kunna-root]");
const center = (el: Element): Pt => {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
};

/**
 * Kunna's life on the page: she wanders the screen on her own, drifts to a side when a new section
 * comes into view, watches what the visitor hovers, reacts to forms, pokes a visitor who goes quiet,
 * and speaks up now and then. All of it holds still while the chat is open, under reduced motion, or
 * in low-power mode, and the speech is capped per session.
 */
export function useKunnaRoam({
  size,
  bodyRef,
  parked,
  asleep,
  lastActive,
  react,
}: {
  size: number;
  bodyRef: RefObject<HTMLButtonElement | null>;
  parked: boolean;
  asleep: boolean;
  lastActive: RefObject<number>;
  react: (m: KunnaMood, ms: number) => void;
}) {
  const path = usePathname();
  const [vp, setVp] = useState({ w: 0, h: 0 });
  const [pos, setPos] = useState<Pt | null>(null);
  const [ms, setMs] = useState(0);
  const [moving, setMoving] = useState(false);
  const [gaze, setGaze] = useState<Pt | null>(null);
  const [bubble, setBubble] = useState<Thought | null>(null);
  const [still, setStill] = useState(true);

  const live = useRef({ parked, asleep, still: true, w: 0, h: 0 });
  const posRef = useRef<Pt>({ x: 0, y: 0 });
  const arrive = useRef(0);
  const bubbleTimer = useRef(0);
  const hoverTimer = useRef(0);
  const lastSay = useRef(0);
  const said = useRef(0);
  const hushedUntil = useRef(0);
  const introFollow = useRef(0);
  const formAt = useRef(0);
  const section = useRef<string | null>(null);
  const greeted = useRef(new Set<string>());
  const poked = useRef(false);
  const lastClick = useRef(0);
  const visits = useRef(new Map<string, number>());
  const walking = useRef(false);
  const speaking = useRef(false);

  useEffect(() => {
    live.current.parked = parked;
    live.current.asleep = asleep;
  }, [parked, asleep]);

  const region = useCallback(() => {
    const { w, h } = live.current;
    const phone = w < 768;
    return { minX: EDGE, maxX: Math.max(EDGE, w - size - EDGE), minY: phone ? h * 0.6 : HEADER, maxY: Math.max(EDGE, h - size - EDGE) };
  }, [size]);
  const dock = useCallback((): Pt => ({ x: live.current.w - size - 20, y: live.current.h - size - 20 }), [size]);

  const moveTo = useCallback(
    (to: Pt, speed = SPEED) => {
      const from = posRef.current;
      const dur = Math.max(MIN_TRAVEL_MS, (Math.hypot(to.x - from.x, to.y - from.y) / speed) * 1000);
      posRef.current = to;
      window.clearTimeout(arrive.current);
      window.clearTimeout(bubbleTimer.current);
      speaking.current = false;
      setBubble(null);
      setMs(dur);
      setPos(to);
      walking.current = true;
      setMoving(true);
      setGaze({ x: to.x + size / 2, y: to.y + size / 2 });
      arrive.current = window.setTimeout(() => {
        walking.current = false;
        setMoving(false);
        setGaze(null);
      }, dur + 40);
      return dur;
    },
    [size],
  );

  /** Stop where she is right now (a click, or the chat opening mid-walk). */
  const freeze = useCallback(() => {
    const r = bodyRef.current?.getBoundingClientRect();
    window.clearTimeout(arrive.current);
    if (r) {
      posRef.current = { x: r.left, y: r.top };
      setPos(posRef.current);
    }
    setMs(0);
    walking.current = false;
    setMoving(false);
    setGaze(null);
  }, [bodyRef]);

  const say = useCallback(
    (thought: Thought | string, { force = false, mood = "thinking" as KunnaMood } = {}) => {
      const L = live.current;
      if (Date.now() < hushedUntil.current || L.parked || said.current >= MAX_BUBBLES) return;
      const now = Date.now();
      if (!force && now - lastSay.current < (L.w < 768 ? BUBBLE_GAP_PHONE : BUBBLE_GAP)) return;
      lastSay.current = now;
      said.current += 1;
      speaking.current = true;
      setBubble(typeof thought === "string" ? { text: thought } : thought);
      react(mood, 1800);
      window.clearTimeout(bubbleTimer.current);
      bubbleTimer.current = window.setTimeout(() => {
        speaking.current = false;
        setBubble(null);
      }, typeof thought !== "string" && thought.choices ? BUBBLE_SHOW + 6000 : BUBBLE_SHOW);
    },
    [react],
  );

  const dismissBubble = useCallback(() => {
    window.clearTimeout(bubbleTimer.current);
    speaking.current = false;
    setBubble(null);
    hushedUntil.current = Date.now() + HUSH_FOR;
  }, []);
  const hideBubble = useCallback(() => {
    window.clearTimeout(bubbleTimer.current);
    speaking.current = false;
    setBubble(null);
  }, []);

  // Viewport, motion preference, and the first spot (her dock in the bottom-right corner).
  useEffect(() => {
    const motionOff = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.motion === "static";
    const sync = () => {
      live.current.w = window.innerWidth;
      live.current.h = window.innerHeight;
      live.current.still = motionOff();
      setStill(live.current.still);
      setVp({ w: window.innerWidth, h: window.innerHeight });
      const r = region();
      const p = posRef.current.x || posRef.current.y ? { x: clamp(posRef.current.x, r.minX, r.maxX), y: clamp(posRef.current.y, r.minY, r.maxY) } : dock();
      posRef.current = p;
      setMs(0);
      setPos(p);
    };
    let enter = 0;
    const init = window.setTimeout(() => {
      sync();
      // She trots in from the right edge to her dock.
      if (live.current.still) return;
      const dockAt = posRef.current;
      posRef.current = { x: live.current.w + 10, y: dockAt.y };
      setPos(posRef.current);
      enter = window.setTimeout(() => moveTo(dockAt, HOP_SPEED * 0.6), 150);
    }, 0);
    window.addEventListener("resize", sync);
    return () => {
      window.clearTimeout(init);
      window.clearTimeout(enter);
      window.removeEventListener("resize", sync);
    };
  }, [region, dock, moveTo]);

  // The wander loop: walk somewhere new, glance about, or just stand a while.
  useEffect(() => {
    if (!vp.w) return;
    let t = 0;
    const next = (d: number) => {
      t = window.setTimeout(step, d);
    };
    const step = () => {
      const L = live.current;
      if (L.still || L.parked || L.asleep || document.hidden || speaking.current || Date.now() - formAt.current < FORM_HOLD) return next(2500);
      const roll = Math.random();
      if (roll < 0.6) {
        const r = region();
        const from = posRef.current;
        const angle = rand(0, Math.PI * 2);
        const dist = rand(160, 420);
        const to = { x: clamp(from.x + Math.cos(angle) * dist, r.minX, r.maxX), y: clamp(from.y + Math.sin(angle) * dist, r.minY, r.maxY) };
        return next(moveTo(to) + rand(2500, 5500));
      }
      if (roll < 0.85) {
        const r = region();
        setGaze({ x: rand(r.minX, r.maxX + size), y: rand(r.minY, r.maxY + size) });
        window.setTimeout(() => setGaze(null), 1400);
      }
      next(rand(2500, 5000));
    };
    next(5500);
    return () => window.clearTimeout(t);
  }, [vp.w, vp.h, region, moveTo, size]);

  // On arrival she introduces herself in a different style each visit, then offers the page's own line.
  // Pages visited later in the session just get that line.
  useEffect(() => {
    if (greeted.current.has(path)) return;
    const first = greeted.current.size === 0;
    const t = window.setTimeout(
      () => {
        greeted.current.add(path);
        if (first) {
          const returning = store.get(MET_KEY, "local") === "1";
          const intro = introFor(new Date().getHours(), returning, Number(store.get(INTRO_KEY, "local") ?? -1));
          store.set(MET_KEY, "1", "local");
          store.set(INTRO_KEY, String(intro.id), "local");
          say(intro.thought, { force: true, mood: intro.mood });
          introFollow.current = window.setTimeout(() => say(nudgeFor(path, 0)), 12_000);
        } else say(nudgeFor(path, 0), { force: true, mood: "happy" });
      },
      first ? 2200 : 2500,
    );
    return () => window.clearTimeout(t);
  }, [path, say]);

  // Sections: when a new one fills the screen she reacts, drifts to a side, and may comment.
  useEffect(() => {
    section.current = null;
    let settle = 0;
    // Sections are often taller than the screen, so "the one under the middle of the screen once
    // scrolling pauses" beats a visibility threshold.
    const look = () => {
      const els = Array.from(document.querySelectorAll<HTMLElement>("[data-screen-label], main > section"));
      const mid = window.innerHeight * 0.5;
      const el = els.find((e) => {
        const r = e.getBoundingClientRect();
        return r.top <= mid && r.bottom > mid;
      });
      if (!el) return;
      const key = el.id || (el.getAttribute("data-screen-label") ?? "").replace(/^\w+\s/, "").toLowerCase() || `section-${els.indexOf(el)}`;
      if (key === section.current) return;
      const first = section.current === null;
      section.current = key;
      if (first) return;
      const L = live.current;
      if (L.parked || L.asleep) return;
      const idx = els.indexOf(el);
      const visit = visits.current.get(`${path}|${key}`) ?? 0;
      const thought = visit < 2 ? thoughtFor(key, el.querySelector("h1,h2")?.textContent ?? undefined, path, idx, visit) : null;
      react(thought ? "thinking" : (SECTION_MOOD[key] ?? "curious"), 1800);
      if (thought) visits.current.set(`${path}|${key}`, visit + 1);
      if (L.still || Date.now() - formAt.current < FORM_HOLD) {
        if (thought) say(thought);
        return;
      }
      const r = region();
      const dur = moveTo({ x: Math.random() < 0.5 ? rand(r.minX, r.minX + 40) : rand(r.maxX - 40, r.maxX), y: rand(r.minY, r.maxY) }, HOP_SPEED);
      if (thought) window.setTimeout(() => say(thought), dur + 150);
    };
    const onScroll = () => {
      window.clearTimeout(settle);
      settle = window.setTimeout(look, 450);
    };
    const first = window.setTimeout(look, 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(settle);
      window.clearTimeout(first);
      window.removeEventListener("scroll", onScroll);
    };
  }, [path, region, moveTo, react, say]);

  // The visitor: what they hover, click, fill in and send.
  useEffect(() => {
    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || inRoot(e.target)) return;
      const el = interactive(e.target);
      if (!el || live.current.parked || walking.current) return;
      window.clearTimeout(hoverTimer.current);
      setGaze(center(el));
      if (el.matches("a[href^='/request-a-quote'], a[href='/contact']")) react("excited", 900);
      hoverTimer.current = window.setTimeout(() => !walking.current && setGaze(null), 900);
    };
    const onClick = (e: MouseEvent) => {
      if (inRoot(e.target) || !interactive(e.target)) return;
      const now = Date.now();
      if (now - lastClick.current < 1500) return;
      lastClick.current = now;
      react("happy", 700);
    };
    const onFocusIn = (e: FocusEvent) => {
      const t = e.target;
      if (!(t instanceof HTMLElement) || !t.matches("input,textarea,select") || inRoot(t)) return;
      formAt.current = Date.now();
      const d = dock();
      const near = Math.hypot(posRef.current.x - d.x, posRef.current.y - d.y) < 40;
      if (!near && !live.current.still && !live.current.parked) moveTo(d);
      window.setTimeout(() => setGaze(center(t)), near ? 0 : 900);
    };
    const onSubmit = (e: SubmitEvent) => {
      if (inRoot(e.target)) return;
      formAt.current = Date.now();
      window.setTimeout(() => {
        if (document.querySelector("[aria-invalid='true']")) {
          react("confused", 2200);
          say(FORM_ERROR, { force: true, mood: "confused" });
        } else react("happy", 1000);
      }, 350);
      const poll = (n: number) => {
        if (document.querySelector("[data-kunna-done]")) {
          react("celebrate", 3200);
          say(FORM_DONE, { force: true, mood: "celebrate" });
        } else if (n < 10) window.setTimeout(() => poll(n + 1), 700);
      };
      window.setTimeout(() => poll(0), 600);
    };
    const onLeave = (e: MouseEvent) => {
      if (e.relatedTarget || e.clientY > 0 || store.get(EXIT_KEY) || live.current.parked) return;
      store.set(EXIT_KEY, "1");
      if (!live.current.still) moveTo({ x: clamp(e.clientX - size / 2, EDGE, live.current.w - size - EDGE), y: HEADER });
      window.setTimeout(() => say(EXIT_LINE, { force: true, mood: "excited" }), 700);
    };
    let hiddenAt = 0;
    const onVisible = () => {
      if (document.hidden) hiddenAt = Date.now();
      else if (hiddenAt && Date.now() - hiddenAt > 15_000) react("excited", 1500);
    };
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("click", onClick, { passive: true });
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("submit", onSubmit, true);
    document.addEventListener("mouseout", onLeave);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("click", onClick);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("submit", onSubmit, true);
      document.removeEventListener("mouseout", onLeave);
      document.removeEventListener("visibilitychange", onVisible);
      window.clearTimeout(hoverTimer.current);
    };
  }, [dock, moveTo, react, say, size]);

  // A visitor who goes quiet gets one poke per quiet spell, ahead of her nodding off.
  useEffect(() => {
    const tick = window.setInterval(() => {
      const idle = Date.now() - lastActive.current;
      if (idle < IDLE_POKE) poked.current = false;
      else if (!poked.current && idle < IDLE_POKE + 8000 && !live.current.parked) {
        poked.current = true;
        const r = region();
        const dur = live.current.still ? 0 : moveTo({ x: clamp(live.current.w * rand(0.55, 0.8), r.minX, r.maxX), y: clamp(live.current.h * rand(0.5, 0.7), r.minY, r.maxY) });
        window.setTimeout(() => say(IDLE_LINE, { force: true }), dur + 150);
      }
    }, 2000);
    return () => window.clearInterval(tick);
  }, [lastActive, region, moveTo, say]);

  useEffect(
    () => () => {
      window.clearTimeout(arrive.current);
      window.clearTimeout(bubbleTimer.current);
      window.clearTimeout(introFollow.current);
    },
    [],
  );

  return { vp, pos, ms, moving, gaze, bubble, still, dismissBubble, hideBubble, freeze };
}
