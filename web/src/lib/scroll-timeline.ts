// SAFETAG homepage scroll story (dial caliper concept) — single source of truth for the
// story stage. Ported from project/scroll-timeline.js.
// Two modes share one timeline. "pinned" (desktop): the stage is the whole viewport.
// "docked" (phones, tablets): the stage is a sticky band under the header, and steps may
// supply their own `docked` poses (and trigger overrides) sized for that band.
// Units: x = fraction of stage width from centre, y = fraction of stage height,
// rotate = deg, scale = unitless, explode k = 0..1 (multiplies each layer's data-dx/dy),
// gauge v = 0..1 of full scale (1152° needle sweep + 160u slider travel).
// Trigger: [selector, elementEdge, viewFraction] -> scrollY where edge meets that line of
// the readable view (whole viewport when pinned; the area below the band when docked).
import type * as Anime from "animejs";

type AnimeModule = typeof Anime;
type Ease = (t: number) => number;
type Trigger = [selector: string, edge: "top" | "bottom" | "center", viewFraction: number];
type Tween = {
  target: "layers" | "object" | "ring" | "ringItems" | "callouts" | "explode" | "gauge";
  props: Record<string, [number, number]>;
  at?: [number, number];
  ease?: string;
};
type Step = {
  id: string;
  section: string;
  label: string;
  ease: string;
  tweens: Tween[];
  start?: Trigger;
  end?: Trigger;
  trigger?: "load";
  duration?: number;
  /** Docked-mode overrides. Missing fields fall back to the pinned values. */
  docked?: { tweens?: Tween[]; start?: Trigger; end?: Trigger };
};

export type StoryMode = "pinned" | "docked";

export const CALIPER = {
  label: "Dial caliper",
  file: "/assets/hero-dial-caliper.svg",
  needle: "#cl-needle",
  slider: '[data-role="slider"]',
  rotPerUnit: 1152,
  sliderTravel: 160,
  fullScale: 40,
  // u = position in SVG viewBox units (1000 × 400), aligned to the S4 exploded pose.
  callouts: [
    { u: [290, 470], label: "Calibration & metrology" },
    { u: [620, 30], label: "Dimensional metrology" },
    { u: [10, 380], label: "Metallurgical & mechanical" },
    { u: [470, 300], label: "NDT sample evaluation" },
  ],
  // Short labels for the docked band, where the full ones would collide.
  shortCallouts: ["Calibration", "Dimensional", "Mechanical", "NDT"],
} as const;

// Resting state before any scroll (hero).
export const INITIAL: Record<StoryMode, { object: { x: number; y: number; scale: number; rotate: number } }> = {
  pinned: { object: { x: 0.24, y: 0.04, scale: 1, rotate: -14 } },
  docked: { object: { x: 0, y: 0.02, scale: 1, rotate: -8 } },
};

export const STEPS: Step[] = [
  {
    id: "S0", section: "Hero", label: "Intro draw-in (time-based, on load)",
    trigger: "load", duration: 1100, ease: "outQuart",
    tweens: [{ target: "layers", props: { opacity: [0, 1] } }],
  },
  {
    id: "S1", section: "Hero → Services", label: "Object shrinks into the hub of the service ring",
    start: ["#services", "top", 1.0], end: ["#services", "top", 0.1], ease: "inOutCubic",
    tweens: [
      { target: "object", props: { x: [0.24, -0.22], y: [0.04, 0], scale: [1, 0.36], rotate: [-14, 0] } },
      { target: "ring", props: { opacity: [0, 1], scale: [0.7, 1] }, at: [0.45, 1] },
    ],
    docked: {
      tweens: [
        { target: "object", props: { y: [0.02, 0], scale: [1, 0.34], rotate: [-8, 0] } },
        { target: "ring", props: { opacity: [0, 1], scale: [0.7, 1] }, at: [0.45, 1] },
      ],
    },
  },
  {
    id: "S2", section: "Services", label: "Ring orbits; each service comes forward (3 o’clock) in turn",
    start: ["#services", "top", 0.1], end: ["#services", "bottom", 1.0], ease: "linear",
    tweens: [
      { target: "ring", props: { rotate: [0, -315] } },
      { target: "ringItems", props: { rotate: [0, 315] } }, // counter-rotate keeps icons upright
      { target: "object", props: { rotate: [0, -45] } },
    ],
  },
  {
    id: "S3", section: "Services → Industries", label: "Ring dissolves; object turns vertical on the right",
    start: ["#industries", "top", 1.0], end: ["#industries", "top", 0.2], ease: "inOutCubic",
    tweens: [
      { target: "ring", props: { opacity: [1, 0], scale: [1, 1.25] }, at: [0, 0.6] },
      { target: "object", props: { x: [-0.22, 0.24], scale: [0.36, 0.7], rotate: [-45, -90] } },
    ],
    // The band is too short for a vertical caliper: it unwinds to level and grows instead.
    docked: {
      tweens: [
        { target: "ring", props: { opacity: [1, 0], scale: [1, 1.25] }, at: [0, 0.6] },
        { target: "object", props: { scale: [0.34, 0.9], rotate: [-45, 0] } },
      ],
    },
  },
  {
    id: "S4", section: "Industries → Laboratories", label: "Object moves left and breaks apart into labelled parts",
    start: ["#labs", "top", 1.0], end: ["#labs", "top", 0.15], ease: "inOutQuart",
    tweens: [
      { target: "object", props: { x: [0.24, -0.25], rotate: [-90, 0], scale: [0.7, 0.62] } },
      { target: "explode", props: { k: [0, 1] }, at: [0.35, 1] },
      { target: "callouts", props: { opacity: [0, 1] }, at: [0.75, 1] },
    ],
    docked: {
      tweens: [
        { target: "object", props: { scale: [0.9, 0.78], y: [0, -0.08] } },
        { target: "explode", props: { k: [0, 1] }, at: [0.35, 1] },
        { target: "callouts", props: { opacity: [0, 1] }, at: [0.75, 1] },
      ],
    },
  },
  {
    id: "S5", section: "Laboratories → Calibration", label: "Parts reassemble; object shifts right",
    start: ["#calibration", "top", 1.0], end: ["#calibration", "top", 0.3], ease: "inOutCubic",
    tweens: [
      { target: "callouts", props: { opacity: [1, 0] }, at: [0, 0.3] },
      { target: "explode", props: { k: [1, 0] }, at: [0.1, 0.9] },
      { target: "object", props: { x: [-0.25, 0.22], scale: [0.62, 0.92], rotate: [0, -6] } },
    ],
    docked: {
      tweens: [
        { target: "callouts", props: { opacity: [1, 0] }, at: [0, 0.3] },
        { target: "explode", props: { k: [1, 0] }, at: [0.1, 0.9] },
        { target: "object", props: { scale: [0.78, 1], y: [-0.08, 0], rotate: [0, -4] } },
      ],
    },
  },
  {
    id: "S6", section: "Calibration", label: "Needle sweeps to the set point and settles; readout counts up",
    start: ["#calibration", "top", 0.3], end: ["#calibration", "top", -0.55], ease: "outBack(1.6)",
    tweens: [{ target: "gauge", props: { v: [0, 0.8] } }],
    // Docked: the readout docks under the band (see Calibration in sections.tsx); sweep
    // while it is held there. #cal-sweep is a non-sticky marker at the readout's flow position.
    docked: { start: ["#cal-sweep", "top", 0.04], end: ["#cal-sweep", "top", -0.75] },
  },
  {
    id: "S7", section: "Calibration → Certifications", label: "Object lifts and fades as the dark section wipes over",
    start: ["#certifications", "top", 1.0], end: ["#certifications", "top", 0.35], ease: "inQuad",
    tweens: [{ target: "object", props: { opacity: [1, 0], scale: [0.92, 0.6], y: [0, -0.14] } }],
    docked: { tweens: [{ target: "object", props: { opacity: [1, 0], scale: [1, 0.7], y: [0, -0.12] } }] },
  },
];

export function makeEase(eases: AnimeModule["eases"], name?: string): Ease {
  if (!name || name === "linear") return (t) => t;
  const m = /^(\w+)\(([^)]*)\)$/.exec(name);
  const table = eases as unknown as Record<string, (...a: number[]) => Ease>;
  if (m) return table[m[1]](...m[2].split(",").map(Number));
  return table[name] as unknown as Ease;
}

/** The readable view triggers are measured against: its top edge and height, in px. */
export type View = { top: number; height: number };

export function triggerY([sel, edge, vf]: Trigger, view: View) {
  const el = document.querySelector(sel);
  if (!el) return 0;
  const r = el.getBoundingClientRect();
  const top = r.top + window.scrollY;
  const y = edge === "top" ? top : edge === "bottom" ? top + r.height : top + r.height / 2;
  return Math.max(0, y - view.top - view.height * vf);
}

export type StoryRefs = {
  svgRoot: HTMLElement;
  object: HTMLElement;
  ring: HTMLElement;
  ringItems: HTMLElement[];
  callouts: HTMLElement;
};

export type StoryLayout = {
  mode: StoryMode;
  /** Stage size in px: x / y fractions are multiplied by these. */
  stage: { width: number; height: number };
  view: View;
};

export type Story = ReturnType<typeof buildStory>;

// Deterministic scroll scrub. Every frame: reset to INITIAL, then apply each tween whose
// start <= scrollY in chronological order (progress clamped 0..1, eased with Anime.js eases,
// written with utils.set). Later tweens win, so fast jumps (anchor links, Home/End,
// back-scroll) always land on the correct state. Call story.apply(window.scrollY).
export function buildStory(anime: AnimeModule, refs: StoryRefs, layout: StoryLayout) {
  const { utils, eases } = anime;
  const c = CALIPER;
  const { mode, view } = layout;
  const W = layout.stage.width, H = layout.stage.height;
  const dir = document.documentElement.dir === "rtl" ? -1 : 1; // mirror for Arabic
  const conv = (prop: string, v: number) => (prop === "x" ? v * W * dir : prop === "y" ? v * H : prop === "rotate" ? v * dir : v);
  const exLayers = [...refs.svgRoot.querySelectorAll<SVGGElement>("g[data-dx]")];
  const needle = refs.svgRoot.querySelector<SVGGElement>(c.needle);
  const sliders = [...refs.svgRoot.querySelectorAll<SVGGElement>(c.slider)];
  const o = INITIAL[mode].object;
  type Target = Element | Element[];
  const initial: [Target, Record<string, number>][] = [
    [refs.object, { x: o.x * W * dir, y: o.y * H, scale: o.scale, rotate: o.rotate * dir, opacity: 1 }],
    [refs.ring, { opacity: 0, scale: 0.7, rotate: 0 }],
    [refs.ringItems, { rotate: 0 }],
    [refs.callouts, { opacity: 0 }],
    ...exLayers.map((el): [Target, Record<string, number>] => [el, { x: 0, y: 0 }]),
    ...(needle ? [[needle, { rotate: 0 }] as [Target, Record<string, number>]] : []),
    ...sliders.map((el): [Target, Record<string, number>] => [el, { x: 0 }]),
  ];
  type Scrub = { el: Target; props: Record<string, [number, number]>; a: number; b: number; ease: Ease };
  const tweens: Scrub[] = [];
  const ranges: { id: string; a: number; b: number; ease: Ease }[] = [];
  for (const s of STEPS) {
    const d = mode === "docked" ? s.docked : undefined;
    const start = d?.start ?? s.start, end = d?.end ?? s.end;
    if (s.trigger === "load" || !start || !end) continue;
    const a = triggerY(start, view), b = Math.max(a + 1, triggerY(end, view));
    ranges.push({ id: s.id, a, b, ease: makeEase(eases, s.ease) });
    for (const tw of d?.tweens ?? s.tweens) {
      const [p0, p1] = tw.at || [0, 1];
      const ta = a + (b - a) * p0, tb = Math.max(ta + 1, a + (b - a) * p1);
      const ease = makeEase(eases, tw.ease || s.ease);
      const P: Record<string, [number, number]> = {};
      for (const k in tw.props) P[k] = [conv(k, tw.props[k][0]), conv(k, tw.props[k][1])];
      const push = (el: Target | null, props: Record<string, [number, number]>) => el && tweens.push({ el, props, a: ta, b: tb, ease });
      if (tw.target === "object") push(refs.object, P);
      else if (tw.target === "ring") push(refs.ring, P);
      else if (tw.target === "ringItems") push(refs.ringItems, P);
      else if (tw.target === "callouts") push(refs.callouts, P);
      else if (tw.target === "explode")
        exLayers.forEach((el) => push(el, { x: [P.k[0] * +el.dataset.dx!, P.k[1] * +el.dataset.dx!], y: [P.k[0] * +el.dataset.dy!, P.k[1] * +el.dataset.dy!] }));
      else if (tw.target === "gauge") {
        push(needle, { rotate: [P.v[0] * c.rotPerUnit, P.v[1] * c.rotPerUnit] });
        sliders.forEach((el) => push(el, { x: [P.v[0] * c.sliderTravel, P.v[1] * c.sliderTravel] }));
      }
    }
  }
  tweens.sort((m, n) => m.a - n.a);
  const apply = (y: number) => {
    for (const [el, v] of initial) utils.set(el, v);
    for (const t of tweens) {
      if (t.a > y) break;
      const e = t.ease(Math.min(1, Math.max(0, (y - t.a) / (t.b - t.a))));
      const v: Record<string, number> = {};
      for (const k in t.props) { const [f, to] = t.props[k]; v[k] = f + (to - f) * e; }
      utils.set(t.el, v);
    }
  };
  const progress = (id: string, y: number) => {
    const r = ranges.find((q) => q.id === id);
    return r ? Math.min(1, Math.max(0, (y - r.a) / (r.b - r.a))) : 0;
  };
  const revert = () =>
    initial.forEach(([el]) => ([] as Element[]).concat(el).forEach((e) => { (e as HTMLElement).style.transform = ""; (e as HTMLElement).style.opacity = ""; }));
  return { apply, ranges, progress, revert };
}
