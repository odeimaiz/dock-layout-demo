import type { DockviewApi } from "dockview-react";

class DockviewStore {
  listeners = new Set<() => void>();

  // Dockview API reference (set in onReady)
  api: DockviewApi | null = null;

  showController = true;
  showMultiTree = false;

  // NEW: App mode state
  appMode: "model" | "simulation" | "postpro" = "model";

  setShowController(v: boolean) {
    this.showController = v;
    this.emit();
  }

  setShowMultiTree(v: boolean) {
    this.showMultiTree = v;
    this.emit();
  }

  // NEW: setMode
  setAppMode(v: "model" | "simulation" | "postpro") {
    this.appMode = v;
    this.emit();
  }

  subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  emit() {
    for (const fn of this.listeners) fn();
  }
}

export const dockviewStore = new DockviewStore();
