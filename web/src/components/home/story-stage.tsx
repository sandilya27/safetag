"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ringServices } from "@/lib/content";
import { buildStory, CALIPER, type Story } from "@/lib/scroll-timeline";
import { useStory } from "./story-context";

// Must match the `pinned` custom variant in globals.css.
const PINNED_QUERY = "(min-width: 1100px) and (prefers-reduced-motion: no-preference)";

const isPinned = () => window.matchMedia(PINNED_QUERY).matches && document.documentElement.dataset.motion !== "static";

/** Force the static fallback, e.g. when Anime.js or the SVG fails to load. */
const forceStatic = () => {
  document.documentElement.dataset.motion = "static";
};

const ring = ringServices.map((s, i) => {
  const a = (i * Math.PI) / 4; // 0° = 3 o’clock
  return { ...s, left: `${50 + 43 * Math.cos(a)}%`, top: `${50 + 43 * Math.sin(a)}%` };
});

const callouts = CALIPER.callouts.map((c) => ({ label: c.label, left: `${c.u[0] / 10}%`, top: `${c.u[1] / 4}%` }));

/**
 * The sticky stage behind sections 01–05: the caliper, the service ring and the lab callouts.
 * Hidden by CSS in static mode; aria-hidden because every scene is described by section text.
 */
export function StoryStage() {
  const objectRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const calloutsRef = useRef<HTMLDivElement>(null);
  const { active, setStory } = useStory();
  const [hud, setHud] = useState<string | null>(null);

  useEffect(() => {
    let anime: typeof import("animejs") | null = null;
    let story: Story | null = null;
    let disposed = false;
    let resizeTimer: ReturnType<typeof setTimeout>;
    const showSteps = new URLSearchParams(window.location.search).has("steps");

    const update = () => {
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
        setHud(cur ? `${cur.id} · ${Math.round(story.progress(cur.id, y) * 100)}% · y ${Math.round(y)}` : `idle · y ${Math.round(y)}`);
      }
    };

    const init = async (first: boolean) => {
      story?.revert();
      story = null;
      if (!isPinned()) {
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
      story = buildStory(anime, {
        svgRoot: host,
        object: host,
        ring: ringRef.current!,
        ringItems: [...ringRef.current!.querySelectorAll<HTMLElement>("[data-ring-item]")],
        callouts: calloutsRef.current!,
      });
      // S0: intro draw-in, the only time-based step.
      if (first && window.scrollY < 50) {
        anime.animate(host.querySelectorAll("g[data-role]"), { opacity: [0, 1], duration: 1100, delay: anime.stagger(45), ease: "outQuart" });
      }
      update();
    };

    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => init(false), 150);
    };
    const mq = window.matchMedia(PINNED_QUERY);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", onResize);
    mq.addEventListener("change", onResize);
    // Section heights change once web fonts land; re-measure the triggers.
    document.fonts?.ready.then(() => {
      if (!disposed) init(false);
    });
    init(true);

    return () => {
      disposed = true;
      clearTimeout(resizeTimer);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", onResize);
      mq.removeEventListener("change", onResize);
      story?.revert();
    };
  }, [setStory]);

  const stageVars = { "--ow": "min(48vw, 880px, 110vh)", "--s": "min(40vw, 74vh, 580px)" } as CSSProperties;

  return (
    <>
      <div aria-hidden="true" className="pointer-events-none sticky top-0 z-0 -mb-[100vh] hidden h-screen overflow-hidden pinned:block" style={stageVars}>
        <div
          ref={ringRef}
          className="absolute opacity-0"
          style={{ width: "var(--s)", height: "var(--s)", left: "calc(28% - var(--s) / 2)", top: "calc(50% - var(--s) / 2)" }}
        >
          <div className="absolute inset-[7%] rounded-full border border-dashed border-grey-400" />
          <div className="absolute inset-[18%] rounded-full border border-grey-200" />
          {ring.map((r, i) => {
            const on = i === active;
            const Icon = r.icon;
            return (
              <div key={r.title} className="absolute size-0" style={{ left: r.left, top: r.top }}>
                <div data-ring-item="" className="absolute -top-9 -left-9 size-18">
                  <div
                    className="flex size-18 items-center justify-center rounded-full border-[1.5px] border-ink transition-[transform,background] duration-[280ms] ease-[cubic-bezier(.22,1,.36,1)]"
                    style={{ background: on ? "#50C878" : "#fff", transform: `scale(${on ? 1.28 : 1})` }}
                  >
                    <Icon className="size-7 text-ink" />
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
          style={{ ["--cw" as string]: "calc(var(--ow) * 0.62)", width: "var(--cw)", left: "calc(25% - var(--cw) / 2)", top: "calc(50% - var(--cw) * 0.2)" }}
        >
          {callouts.map((c) => (
            <div
              key={c.label}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-[2px] border border-ink bg-white px-2.5 py-1.5 font-mono text-[11.5px] font-medium tracking-[.06em] whitespace-nowrap text-ink uppercase"
              style={{ left: c.left, top: c.top }}
            >
              <span className="size-2 rounded-full border border-ink bg-green-500" />
              {c.label}
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
