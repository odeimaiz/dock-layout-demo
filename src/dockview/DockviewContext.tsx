import { createContext, useContext } from "react";
import type { DockviewApi } from "dockview-react";

export type DockviewMode = "model" | "simulation" | "postpro";

export interface DockviewContextValue {
  api: DockviewApi | null;
  mode: DockviewMode;
  setMode: (mode: DockviewMode) => void;
  showController: boolean;
  setShowController: (value: boolean) => void;
  showMultiTree: boolean;
  setShowMultiTree: (value: boolean) => void;
}

export const DockviewContext = createContext<DockviewContextValue | undefined>(
  undefined
);

export function useDockview(): DockviewContextValue {
  const ctx = useContext(DockviewContext);
  if (!ctx) {
    throw new Error("useDockview must be used within a DockviewContext provider");
  }
  return ctx;
}
