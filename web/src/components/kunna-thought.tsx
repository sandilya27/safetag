"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import type { Thought } from "@/lib/kunna-brain";

// The little circles that lead from a thought bubble back to the thinker: biggest nearest the bubble.
const TRAIL: [size: number, offset: number, drift: number][] = [
  [12, 5, 3],
  [8, 21, 0],
  [5, 33, -2],
];
export const THOUGHT_GAP = 42;

/**
 * A comic thought bubble for Kunna. The trail of circles points at her, from above or below
 * depending on which side of the screen she is on. Clicking the words opens the chat.
 */
export function KunnaThought({
  thought,
  style,
  above,
  tailX,
  onOpen,
  onGo,
  onChoose,
  onDismiss,
}: {
  thought: Thought;
  style: CSSProperties;
  above: boolean;
  tailX: number;
  onOpen: () => void;
  onGo: () => void;
  onChoose: (question: string) => void;
  onDismiss: () => void;
}) {
  return (
    <div role="status" style={style} className="pointer-events-auto fixed w-[min(248px,calc(100vw-32px))]">
      <div className="kunna-thought relative rounded-[22px] border-2 border-ink bg-white py-3 ps-4 pe-9" style={{ transformOrigin: `${tailX}px ${above ? "calc(100% + 40px)" : "-40px"}` }}>
        <button type="button" onClick={onOpen} className="cursor-pointer border-0 bg-transparent p-0 text-start font-sans text-[14px] leading-[1.4] text-ink">
          {thought.text}
        </button>
        {thought.choices && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {thought.choices.map(([label, question]) => (
              <button key={label} type="button" onClick={() => onChoose(question)} className="min-h-8 cursor-pointer rounded-full border-[1.5px] border-ink bg-white px-3 text-[13px] font-medium text-ink hover:bg-green-50">
                {label}
              </button>
            ))}
          </div>
        )}
        {thought.cta && (
          <Link href={thought.cta[1]} onClick={onGo} className="mt-2 flex w-fit items-center gap-1 text-[13px] font-semibold text-green-700 underline decoration-1 underline-offset-[3px] hover:text-ink">
            {thought.cta[0]}
            <ArrowRight className="size-3.5" />
          </Link>
        )}
        <button type="button" onClick={onDismiss} aria-label="Hush, no more thoughts" className="absolute end-0.5 top-0.5 flex size-9 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-grey-600 hover:text-ink">
          <X className="size-4" />
        </button>
      </div>
      <div aria-hidden="true" className="kunna-trail pointer-events-none absolute inset-x-0" style={above ? { top: "100%" } : { bottom: "100%" }}>
        {TRAIL.map(([size, offset, drift], i) => (
          <i
            key={size}
            className="absolute block rounded-full border-2 border-ink bg-white"
            style={{ width: size, height: size, left: tailX + drift - size / 2, [above ? "top" : "bottom"]: offset, animationDelay: `${i * 70}ms`, transformOrigin: "center" } as CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}
