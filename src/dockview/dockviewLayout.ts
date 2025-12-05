import type { DockviewApi, DockviewGroupPanel } from "dockview-react";

const getGroupForPanel = (
  api: DockviewApi,
  panelId: string
): DockviewGroupPanel | undefined => {
  return api.groups.find((g) => g.panels.some((p) => p.id === panelId));
};

/**
 * Enforce a 75% / 25% vertical split between the Controller (top)
 * and Options (bottom) groups whenever they are both visible.
 */
const setControllerOptionsSplit = (api: DockviewApi): void => {
  const controllerGroup = getGroupForPanel(api, "controller");
  const optionsGroup = getGroupForPanel(api, "options");

  if (!controllerGroup || !optionsGroup) return;
  if (!controllerGroup.api.isVisible || !optionsGroup.api.isVisible) return;

  // Use the current combined height as a baseline. If it’s 0 (e.g. first layout),
  // just use a fallback value; only the ratio matters.
  const totalHeight =
    (controllerGroup.height ?? 0) + (optionsGroup.height ?? 0) || 400;

  const controllerHeight = totalHeight * 0.75;
  const optionsHeight = totalHeight - controllerHeight;

  controllerGroup.api.setSize({ height: controllerHeight });
  optionsGroup.api.setSize({ height: optionsHeight });
};

export function createInitialLayout(api: DockviewApi): void {
  // Explorer
  api.addPanel({
    id: "explorer",
    component: "explorer",
    tabComponent: "noCloseTab",
    title: "Explorer",
  });

  // Controller to the right of explorer
  api.addPanel({
    id: "controller",
    component: "controller",
    tabComponent: "closableTab",
    title: "Controller",
    position: { referencePanel: "explorer", direction: "right" },
  });

  // Multi tree to the right of controller
  api.addPanel({
    id: "multitree",
    component: "multitree",
    tabComponent: "closableTab",
    title: "Multi Tree",
    position: { referencePanel: "controller", direction: "right" },
  });

  // 3D view to the right of multitree, header hidden
  const view3d = api.addPanel({
    id: "view3d",
    component: "view3d",
    title: "3D View",
    position: { referencePanel: "multitree", direction: "right" },
  });
  view3d.group.header.hidden = true;

  // Options below controller
  api.addPanel({
    id: "options",
    component: "options",
    tabComponent: "noCloseTab",
    title: "Options",
    position: { referencePanel: "controller", direction: "below" },
  });

  // Lock groups to prevent tabbing between them
  api.groups.forEach((g) => (g.locked = true));

  // Width presets
  getGroupForPanel(api, "explorer")?.api.setSize({ width: 250 });
  getGroupForPanel(api, "controller")?.api.setSize({ width: 300 });
  getGroupForPanel(api, "multitree")?.api.setSize({ width: 250 });

  // Default vertical split between Controller and Options
  setControllerOptionsSplit(api);
}

export function updateGroupVisibility(
  api: DockviewApi,
  opts: { showController: boolean; showMultiTree: boolean }
): void {
  const controllerGroup = getGroupForPanel(api, "controller");
  const optionsGroup = getGroupForPanel(api, "options");
  const multiTreeGroup = getGroupForPanel(api, "multitree");

  controllerGroup?.api.setVisible(opts.showController);
  optionsGroup?.api.setVisible(opts.showController);
  multiTreeGroup?.api.setVisible(opts.showMultiTree);
  
  // Whenever Controller is visible, enforce the 75/25 split
  if (opts.showController) {
    setControllerOptionsSplit(api);
  }
}
