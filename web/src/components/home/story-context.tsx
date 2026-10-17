"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

/** Values derived from the scroll story that ordinary sections render. */
export type StoryValues = {
  /** Index (0–7) of the ring service currently at 3 o’clock. */
  active: number;
  /** Eased calibration progress, 0..1. Static mode shows the final readout (1). */
  gauge: number;
};

type StoryState = StoryValues & { setStory: (v: StoryValues) => void };

const StoryContext = createContext<StoryState>({ active: 0, gauge: 1, setStory: () => {} });

export function StoryProvider({ children }: { children: ReactNode }) {
  const [values, setValues] = useState<StoryValues>({ active: 0, gauge: 1 });
  const setStory = useCallback(
    (v: StoryValues) => setValues((p) => (p.active === v.active && p.gauge === v.gauge ? p : v)),
    [],
  );
  return <StoryContext.Provider value={{ ...values, setStory }}>{children}</StoryContext.Provider>;
}

export const useStory = () => useContext(StoryContext);
