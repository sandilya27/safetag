"use client";

import { useEffect, useRef } from "react";

export type KunnaMood = "idle" | "walk" | "curious" | "happy" | "excited" | "thinking" | "confused" | "drowsy" | "sleeping" | "celebrate";

// The SAFETAG shield, softened into a body. Brand green, ink eyes; personality lives in the eyes and the motion.
const SHIELD = "M32 3 C23 9.5 13 11.5 6 11.5 V33 C6 51 17.5 63 32 69 C46.5 63 58 51 58 33 V11.5 C51 11.5 41 9.5 32 3 Z";
const INK = "#0B0F0E";
const LOOK_X = 2.6;
const LOOK_Y = 2;

function Eye({ x, mood, side }: { x: number; mood: KunnaMood; side: "l" | "r" }) {
  const stroke = { stroke: INK, strokeWidth: 3.6, strokeLinecap: "round" as const, fill: "none" };
  let shape;
  switch (mood) {
    case "happy":
    case "excited":
    case "celebrate":
      shape = <path d="M-5.5 3 Q0 -6 5.5 3" {...stroke} />;
      break;
    case "sleeping":
      shape = <path d="M-4.5 1 H4.5" {...stroke} />;
      break;
    case "drowsy":
      shape = <rect x="-3.5" y="-1" width="7" height="5" rx="2.5" fill={INK} />;
      break;
    case "thinking":
      shape = <rect x="-3" y="-5" width="6" height="10" rx="3" fill={INK} />;
      break;
    case "confused":
      shape = side === "l" ? <rect x="-4" y="-7.5" width="8" height="15" rx="4" fill={INK} /> : <rect x="-3.5" y="-3.5" width="7" height="8" rx="3.5" fill={INK} transform="rotate(-14)" />;
      break;
    default:
      shape = <rect className="kunna-blink" x="-4" y="-7.5" width="8" height="15" rx="4" fill={INK} />;
  }
  return <g transform={`translate(${x} 34)`}>{shape}</g>;
}

const SPARKS: [number, number, number][] = [
  [2, 8, 0],
  [62, 6, 0.35],
  [64, 40, 0.7],
];

/**
 * Kunna, SAFETAG's assistant. Eyes follow the pointer while awake, or a `look` point (viewport coordinates) when given; `mood` picks the eye shape and body motion.
 * All motion is CSS (see globals.css) and switches off under prefers-reduced-motion.
 */
export function Kunna({ mood = "idle", look, className, title }: { mood?: KunnaMood; look?: { x: number; y: number } | null; className?: string; title?: string }) {
  const svg = useRef<SVGSVGElement>(null);
  const eyes = useRef<SVGGElement>(null);
  const awake = mood !== "sleeping" && mood !== "drowsy";

  useEffect(() => {
    const g = eyes.current;
    const el = svg.current;
    if (!g || !el) return;
    if (!awake || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      g.style.transform = "";
      return;
    }
    const aim = (x: number, y: number) => {
      const r = el.getBoundingClientRect();
      if (!r.width) return;
      const dx = (x - (r.left + r.width / 2)) / 220;
      const dy = (y - (r.top + r.height / 2)) / 220;
      g.style.transform = `translate(${Math.max(-1, Math.min(1, dx)) * LOOK_X}px, ${Math.max(-1, Math.min(1, dy)) * LOOK_Y}px)`;
    };
    if (look) {
      aim(look.x, look.y);
      return;
    }
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        aim(e.clientX, e.clientY);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [awake, look]);

  return (
    <svg ref={svg} viewBox="-6 -4 76 78" className={`kunna kunna--${mood} ${className ?? ""}`} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <g className="kunna-body">
        <path d={SHIELD} fill="#50C878" stroke="#50C878" strokeWidth="4" strokeLinejoin="round" />
        <path d="M13 17 C18 18 22 17 25 15" fill="none" stroke="#FFFFFF" strokeOpacity=".55" strokeWidth="3" strokeLinecap="round" />
        <g ref={eyes} className="kunna-eyes">
          <Eye x={22} mood={mood} side="l" />
          <Eye x={42} mood={mood} side="r" />
        </g>
      </g>
      {mood === "celebrate" &&
        SPARKS.map(([x, y, delay]) => (
          <path key={x} className="kunna-spark" d="M0 -5 L1.6 -1.6 L5 0 L1.6 1.6 L0 5 L-1.6 1.6 L-5 0 L-1.6 -1.6 Z" fill="#F2A93B" style={{ translate: `${x}px ${y}px`, animationDelay: `${delay}s` }} />
        ))}
      {(mood === "sleeping" || mood === "drowsy") && (
        <text className="kunna-z" x="52" y="10" fontFamily="var(--font-mono)" fontWeight="600" fontSize="12" fill="#50C878">
          z
        </text>
      )}
    </svg>
  );
}
