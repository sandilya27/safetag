"use client";

import { useEffect, useRef } from "react";

/**
 * Millimetre rule under the header on inner pages; the green jaw reads how far down the
 * page you are. Written straight to the element's transform once per frame (no React
 * state), so it works in every browser, including Safari before scroll-driven animations.
 */
export function ReadingRule() {
  const jaw = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const paint = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (jaw.current) jaw.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    };
    const onScroll = () => {
      frame ||= requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return (
    <div aria-hidden="true" className="reading-rule pointer-events-none fixed inset-x-0 top-(--header) z-40 h-[7px]">
      {/* Inline transform, not a scale-x utility: Tailwind's `scale` property would compound with it. */}
      <div ref={jaw} className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-green-500" style={{ transform: "scaleX(0)" }} />
    </div>
  );
}
