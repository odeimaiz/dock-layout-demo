import type { DockviewApi } from "dockview-react";

export const dockviewStore: {
  api: DockviewApi | null;
  showController: boolean;
  showMultiTree: boolean;
  setShowController(value: boolean): void;
  setShowMultiTree(value: boolean): void;
} = {
  api: null,
  showController: true,
  showMultiTree: false,
  setShowController(value) {
    this.showController = value;
  },
  setShowMultiTree(value) {
    this.showMultiTree = value;
  },
};
