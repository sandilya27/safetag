"use client";

import { useEffect, useRef, useState } from "react";
import { ringServices } from "@/lib/content";
import { buildStory, CALIPER, type Story, type StoryLayout, type StoryMode } from "@/lib/scroll-timeline";
import { useStory } from "./story-context";

// Must match the `pinned` / `docked` custom variants in globals.css.
const PINNED_QUERY = "(min-width: 1100px) and (prefers-reduced-motion: no-preference)";
const DOCKED_QUERY = "(max-width: 1099.98px) and (min-height: 560px) and (prefers-reduced-motion: no-preference)";

/** Docked band height as a fraction of the small viewport; matches --band in globals.css. */
const BAND_SVH = 0.38;

const storyMode = (): StoryMode | null => {
  if (document.documentElement.dataset.motion === "static") return null;
  if (window.matchMedia(PINNED_QUERY).matches) return "pinned";
  if (window.matchMedia(DOCKED_QUERY).matches) return "docked";
  return null;
};

/** Force the static fallback, e.g. when Anime.js or the SVG fails to load. */
const forceStatic = () => {
  document.documentElement.dataset.motion = "static";
};

const ring = ringServices.map((s, i) => {
  const a = (i * Math.PI) / 4; // 0° = 3 o’clock
  return { ...s, left: `${50 + 43 * Math.cos(a)}%`, top: `${50 + 43 * Math.sin(a)}%` };
});

const callouts = CALIPER.callouts.map((c, i) => ({ label: c.label, short: CALIPER.shortCallouts[i], left: `${c.u[0] / 10}%`, top: `${c.u[1] / 4}%` }));

/**
 * The story stage behind sections 01–05: the caliper, the service ring and the lab callouts.
 * Pinned (desktop): a full-viewport sticky layer the sections scroll over.
 * Docked (phones, tablets): a sticky band under the header that the sections scroll under.
 * Hidden by CSS in static mode; aria-hidden because every scene is described by section text.
 */
export function StoryStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const objectRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const calloutsRef = useRef<HTMLDivElement>(null);
  const { active, setStory } = useStory();
  const [hud, setHud] = useState<string | null>(null);

  useEffect(() => {
    let anime: typeof import("animejs") | null = null;
    let story: Story | null = null;
    let layout: StoryLayout | null = null;
    let disposed = false;
    let frame = 0;
    let resizeTimer: ReturnType<typeof setTimeout>;
    let lastWidth = window.innerWidth;
    const showSteps = new URLSearchParams(window.location.search).has("steps");

    const update = () => {
      frame = 0;
      if (!story) return;
      const y = window.scrollY;
      story.apply(Math.max(0, y));
      const s6 = story.ranges.find((r) => r.id === "S6")!;
      setStory({
        active: Math.round(story.progress("S2", y) * 7),
        gauge: Math.round(s6.ease(story.progress("S6", y)) * 1000) / 1000,
      });
      if (showSteps) {
        const cur = story.ranges.find((r) => y >= r.a && y <= r.b);
        const tag = `${layout?.mode} · `;
        setHud(cur ? `${tag}${cur.id} · ${Math.round(story.progress(cur.id, y) * 100)}% · y ${Math.round(y)}` : `${tag}idle · y ${Math.round(y)}`);
      }
    };
    const onScroll = () => {
      frame ||= requestAnimationFrame(update);
    };

    const measure = (mode: StoryMode): StoryLayout => {
      if (mode === "pinned") {
        const W = window.innerWidth, H = window.innerHeight;
        return { mode, stage: { width: W, height: H }, view: { top: 0, height: H } };
      }
      // Docked: the band is sized in svh, so measure it rather than innerHeight, which
      // changes every time the mobile address bar collapses.
      const band = stageRef.current!.getBoundingClientRect();
      const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header")) || 72;
      const svh = band.height / BAND_SVH;
      const top = header + band.height;
      return { mode, stage: { width: band.width, height: band.height }, view: { top, height: Math.max(1, svh - top) } };
    };

    const init = async (first: boolean) => {
      story?.revert();
      story = null;
      const mode = storyMode();
      if (!mode) {
        setStory({ active: 0, gauge: 1 });
        setHud(null);
        return;
      }
      const host = objectRef.current!;
      try {
        anime ??= await import("animejs");
        if (!host.querySelector("svg")) {
          const res = await fetch(CALIPER.file);
          if (!res.ok) throw new Error(`${CALIPER.file}: ${res.status}`);
          host.innerHTML = await res.text();
          const svg = host.querySelector("svg")!;
          svg.setAttribute("width", "100%");
          svg.setAttribute("height", "100%");
          svg.setAttribute("aria-hidden", "true");
          svg.style.overflow = "visible"; // exploded parts (S4) travel outside the viewBox
          svg.removeAttribute("role");
          first = true;
        }
      } catch (e) {
        console.warn("Motion assets failed to load, using static fallback", e);
        forceStatic();
        setStory({ active: 0, gauge: 1 });
        return;
      }
      if (disposed) return;
      layout = measure(mode);
      story = buildStory(
        anime,
        {
          svgRoot: host,
          object: host,
          ring: ringRef.current!,
          ringItems: [...ringRef.current!.querySelectorAll<HTMLElement>("[data-ring-item]")],
          callouts: calloutsRef.current!,
        },
        layout,
      );
      // S0: intro draw-in, the only time-based step.
      if (first && window.scrollY < 50) {
        anime.animate(host.querySelectorAll("g[data-role]"), { opacity: [0, 1], duration: 1100, delay: anime.stagger(45), ease: "outQuart" });
      }
      update();
    };

    const onResize = () => {
      // Phones fire height-only resizes as the address bar shows and hides; the docked
      // layout is sized in svh, so those need no re-measure.
      if (layout?.mode === "docked" && window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => init(false), 150);
    };
    const onModeChange = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => init(false), 150);
    };
    const queries = [window.matchMedia(PINNED_QUERY), window.matchMedia(DOCKED_QUERY)];
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    queries.forEach((q) => q.addEventListener("change", onModeChange));
    // Section heights change once web fonts land; re-measure the triggers.
    document.fonts?.ready.then(() => {
      if (!disposed) init(false);
    });
    init(true);

    return () => {
      disposed = true;
      clearTimeout(resizeTimer);
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      queries.forEach((q) => q.removeEventListener("change", onModeChange));
      story?.revert();
    };
  }, [setStory]);

  return (
    <>
      <div
        ref={stageRef}
        aria-hidden="true"
        className={[
          "pointer-events-none hidden overflow-hidden",
          // Stage geometry (classes, not inline style, so docked: can override): --ow object
          // width, --s ring size, --item ring item size; centres are percentages of the stage.
          "[--ow:min(48vw,880px,110vh)] [--s:min(40vw,74vh,580px)] [--item:72px]",
          "[--ring-x:28%] [--callout-x:25%] [--callout-w:calc(var(--ow)*0.62)] [--callout-dy:0px]",
          "pinned:sticky pinned:top-0 pinned:z-0 pinned:-mb-[100vh] pinned:block pinned:h-screen",
          // Docked band: sits in flow under the fixed header, so it never moves; sections scroll under it.
          "docked:grid-paper docked:sticky docked:top-(--header) docked:z-20 docked:mt-(--header) docked:block docked:h-(--band) docked:border-b docked:border-grey-200",
          "docked:[--ow:min(88vw,calc(var(--band)*2.1),640px)] docked:[--s:min(calc(var(--band)-56px),86vw)] docked:[--item:44px]",
          "docked:[--ring-x:50%] docked:[--callout-x:50%] docked:[--callout-w:calc(var(--ow)*0.78)] docked:[--callout-dy:calc(var(--band)*-0.08)]",
        ].join(" ")}
      >
        <div
          ref={ringRef}
          className="absolute opacity-0"
          style={{ width: "var(--s)", height: "var(--s)", left: "calc(var(--ring-x) - var(--s) / 2)", top: "calc(50% - var(--s) / 2)" }}
        >
          <div className="absolute inset-[7%] rounded-full border border-dashed border-grey-400" />
          <div className="absolute inset-[18%] rounded-full border border-grey-200" />
          {ring.map((r, i) => {
            const on = i === active;
            const Icon = r.icon;
            return (
              <div key={r.title} className="absolute size-0" style={{ left: r.left, top: r.top }}>
                <div data-ring-item="" className="absolute" style={{ width: "var(--item)", height: "var(--item)", left: "calc(var(--item) / -2)", top: "calc(var(--item) / -2)" }}>
                  <div
                    className="flex size-full items-center justify-center rounded-full border-[1.5px] border-ink transition-[transform,background] duration-[280ms] ease-[cubic-bezier(.22,1,.36,1)]"
                    style={{ background: on ? "#50C878" : "#fff", transform: `scale(${on ? 1.28 : 1})` }}
                  >
                    <Icon className="size-[39%] text-ink" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div
          ref={objectRef}
          className="absolute top-1/2 left-1/2 aspect-[1000/400] will-change-transform"
          style={{ width: "var(--ow)", marginLeft: "calc(var(--ow) / -2)", marginTop: "calc(var(--ow) * -0.2)" }}
        />
        <div
          ref={calloutsRef}
          className="absolute aspect-[1000/400] opacity-0"
          style={{ width: "var(--callout-w)", left: "calc(var(--callout-x) - var(--callout-w) / 2)", top: "calc(50% - var(--callout-w) * 0.2 + var(--callout-dy))" }}
        >
          {callouts.map((c) => (
            <div
              key={c.label}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-[2px] border border-ink bg-white px-2.5 py-1.5 font-mono text-[11.5px] font-medium tracking-[.06em] whitespace-nowrap text-ink uppercase docked:gap-1.5 docked:px-1.5 docked:py-1 docked:text-[10px]"
              style={{ left: c.left, top: c.top }}
            >
              <span className="size-2 rounded-full border border-ink bg-green-500 docked:size-1.5" />
              <span className="docked:hidden">{c.label}</span>
              <span className="hidden docked:inline">{c.short}</span>
            </div>
          ))}
        </div>
      </div>
      {hud && (
        <div className="pointer-events-none fixed start-4 bottom-4 z-60 rounded bg-ink px-3 py-2 font-mono text-xs font-medium text-green-500">{hud}</div>
      )}
    </>
  );
}
