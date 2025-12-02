export const dockviewStore = {
  api: null as any,

  showController: true,
  showMultiTree: false,   // ← hidden on startup

  setShowController(value: boolean) {
    this.showController = value;
  },

  setShowMultiTree(value: boolean) {
    this.showMultiTree = value;
  }
};
