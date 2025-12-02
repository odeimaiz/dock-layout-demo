export const dockviewStore = {
  api: null as any,

  showController: true,
  showMultiTree: true,

  setShowController(value: boolean) {
    this.showController = value;
  },

  setShowMultiTree(value: boolean) {
    this.showMultiTree = value;
  }
};
