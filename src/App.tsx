import { useEffect, useState } from "react";
import { DockviewReact } from "dockview-react";
import type {
  DockviewApi,
  DockviewReadyEvent,
  IDockviewPanelProps,
  DockviewGroupPanel,
} from "dockview-react";

import "dockview-react/dist/styles/dockview.css";
import "./App.css";
import { dockviewStore } from "./dockviewStore";

/* -------------------------------------------------------
   Helpers
---------------------------------------------------------*/

const getGroupForPanel = (
  api: DockviewApi,
  panelId: string
): DockviewGroupPanel | undefined => {
  return api.groups.find((g) => g.panels.some((p) => p.id === panelId));
};

/* -------------------------------------------------------
   Panels
---------------------------------------------------------*/

const ExplorerPanel: React.FC<IDockviewPanelProps> = () => {
  const [, setVersion] = useState(0);

  useEffect(() => dockviewStore.subscribe(() => setVersion((v) => v + 1)), []);

  const toggleController = () => {
    const api = dockviewStore.api;
    if (!api) return;

    const isVisible = !dockviewStore.showController;
    dockviewStore.setShowController(isVisible);

    const controller = getGroupForPanel(api, "controller");
    controller?.api.setVisible(isVisible);

    const options = getGroupForPanel(api, "options");
    options?.api.setVisible(isVisible);
  };

  const toggleMultiTree = () => {
    const api = dockviewStore.api;
    if (!api) return;

    const isVisible = !dockviewStore.showMultiTree;
    dockviewStore.setShowMultiTree(isVisible);

    const multitree = getGroupForPanel(api, "multitree");
    multitree?.api.setVisible(isVisible);
  };

  return (
    <div className="panel-container">
      <div className="explorer-header">
        <div className="explorer-header-left">
          <button
            className={`mode-btn ${dockviewStore.appMode === "model" ? "active" : ""}`}
            onClick={() => dockviewStore.setAppMode("model")}
          >
            M
          </button>
          <button
            className={`mode-btn ${dockviewStore.appMode === "simulation" ? "active" : ""}`}
            onClick={() => dockviewStore.setAppMode("simulation")}
          >
            S
          </button>
          <button
            className={`mode-btn ${dockviewStore.appMode === "postpro" ? "active" : ""}`}
            onClick={() => dockviewStore.setAppMode("postpro")}
          >
            P
          </button>
        </div>

        <div className="panel-buttons">
          <button
            className={`panel-toggle-btn ${dockviewStore.showController ? "active" : ""}`}
            onClick={toggleController}
          >
            Ctrls
          </button>
          <button
            className={`panel-toggle-btn ${dockviewStore.showMultiTree ? "active" : ""}`}
            onClick={toggleMultiTree}
          >
            Tree
          </button>
        </div>
      </div>

      <div className="panel-body">Explorer content...</div>
    </div>
  );
};

const ControllerPanel: React.FC<IDockviewPanelProps> = () => (
  <div className="panel-body">Controller content...</div>
);

const OptionsPanel: React.FC<IDockviewPanelProps> = () => (
  <div className="panel-body">Options content...</div>
);

const MultiTreePanel: React.FC<IDockviewPanelProps> = () => (
  <div className="panel-body">Multi Tree content...</div>
);

const View3DPanel: React.FC<IDockviewPanelProps> = () => (
  <div className="panel-body">
    3D scene
  </div>
);

/* -------------------------------------------------------
   Tabs (custom tabComponent)
---------------------------------------------------------*/

const tabComponents = {
  noCloseTab: (props: IDockviewPanelProps) => (
    <div className="no-close-tab">{props.api.title}</div>
  ),

  closableTab: (props: IDockviewPanelProps) => {
    const api = dockviewStore.api;
    if (!api) return null;

    const panelId = props.api.id;

    const handleClose = (e: React.MouseEvent) => {
      e.stopPropagation();

      if (panelId === "controller" || panelId === "options") {
        const controller = getGroupForPanel(api, "controller");
        controller?.api.setVisible(false);
        const options = getGroupForPanel(api, "options");
        options?.api.setVisible(false);
        dockviewStore.setShowController(false);
      }

      if (props.api.id === "multitree") {
        const multitree = getGroupForPanel(api, "multitree");
        multitree?.api.setVisible(false);
        dockviewStore.setShowMultiTree(false);
      }
    };

    return (
      <div className="custom-tab">
        <div className="custom-tab-title">{props.api.title}</div>
        <div className="custom-tab-close" onClick={handleClose}>
          ×
        </div>
      </div>
    );
  },
};

/* -------------------------------------------------------
   Component registry
---------------------------------------------------------*/

const components: Record<string, React.FC<IDockviewPanelProps>> = {
  explorer: ExplorerPanel,
  controller: ControllerPanel,
  options: OptionsPanel,
  multitree: MultiTreePanel,
  view3d: View3DPanel,
};

/* -------------------------------------------------------
   Main App
---------------------------------------------------------*/

export default function App() {
  const [, rerender] = useState(0);
  useEffect(() => dockviewStore.subscribe(() => rerender((v) => v + 1)), []);

  const onReady = (event: DockviewReadyEvent) => {
    const api = (dockviewStore.api = event.api);

    // Build layout once
    api.addPanel({
      id: "explorer",
      component: "explorer",
      tabComponent: "noCloseTab",
      title: "Explorer",
    });

    api.addPanel({
      id: "controller",
      component: "controller",
      tabComponent: "closableTab",
      title: "Controller",
      position: { referencePanel: "explorer", direction: "right" },
    });

    api.addPanel({
      id: "multitree",
      component: "multitree",
      tabComponent: "closableTab",
      title: "Multi Tree",
      position: { referencePanel: "controller", direction: "right" },
    });

    const view3d = api.addPanel({
      id: "view3d",
      component: "view3d",
      title: "3D View",
      position: { referencePanel: "multitree", direction: "right" },
    });
    view3d.group.header.hidden = true;

    // it goes last so that it is below controller
    api.addPanel({
      id: "options",
      component: "options",
      tabComponent: "noCloseTab",
      title: "Options",
      position: { referencePanel: "controller", direction: "below" },
    });

    // Lock groups to prevent tabbing
    api.groups.forEach((g) => (g.locked = true));

    // Width presets
    getGroupForPanel(api, "explorer")?.api.setSize({ width: 250 });
    getGroupForPanel(api, "controller")?.api.setSize({ width: 300 });
    getGroupForPanel(api, "multitree")?.api.setSize({ width: 250 });

    // Apply initial visibility
    getGroupForPanel(api, "controller")?.api.setVisible(dockviewStore.showController);
    getGroupForPanel(api, "options")?.api.setVisible(dockviewStore.showController);
    getGroupForPanel(api, "multitree")?.api.setVisible(dockviewStore.showMultiTree);
  };

  return (
    <div className="app-container">
      <div className="navbar">
        {{
          model: "Model",
          simulation: "Simulation",
          postpro: "Post Processing",
        }[dockviewStore.appMode]}
      </div>

      <div className="dock-container">
        <DockviewReact
          components={components}
          tabComponents={tabComponents}
          onReady={onReady}
        />
      </div>

      <div className="footer">Footer</div>
    </div>
  );
}
