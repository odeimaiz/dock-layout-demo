import type { DockviewApi } from "dockview-react";

type Subscriber = () => void;

export const dockviewStore = {
  api: null as DockviewApi | null,

  showController: true,
  showMultiTree: false,

  subscribers: [] as Subscriber[],

  subscribe(fn: Subscriber) {
    this.subscribers.push(fn);
    return () => {
      this.subscribers = this.subscribers.filter((s) => s !== fn);
    };
  },

  notify() {
    this.subscribers.forEach((fn) => fn());
  },

  setShowController(value: boolean) {
    this.showController = value;
    this.notify(); // cause ExplorerPanel to update
  },

  setShowMultiTree(value: boolean) {
    this.showMultiTree = value;
    this.notify(); // cause ExplorerPanel to update
  },
};
