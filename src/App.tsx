import { useEffect, useState } from "react";
import { DockviewReact } from "dockview-react";
import type {
  DockviewApi,
  DockviewReadyEvent,
  IDockviewPanelProps,
  DockviewGroupPanel,
} from "dockview-react";
import "dockview-react/dist/styles/dockview.css";
import { dockviewStore } from "./dockviewStore";
import "./App.css";

const getGroupForPanel = (api: DockviewApi, panelId: string): DockviewGroupPanel | undefined => {
  return api.groups.find((g) => g.panels.some((p) => p.id === panelId));
};


const ExplorerPanel: React.FC<IDockviewPanelProps> = () => {
  // Local “tick” just to force React to re-render
  const [, setVersion] = useState(0);

  useEffect(() => {
    return dockviewStore.subscribe(() => {
      setVersion(v => v + 1);
    });
  }, []);

  const toggleController = () => {
    const api = dockviewStore.api;
    if (!api) return;

    const nextVisible = !dockviewStore.showController;
    dockviewStore.setShowController(nextVisible);

    const controllerGroup = getGroupForPanel(api, "controller");
    const optionsGroup   = getGroupForPanel(api, "options");

    // show/hide the whole vertical "column":
    controllerGroup?.api.setVisible(nextVisible);
    optionsGroup?.api.setVisible(nextVisible);
  };

  const toggleMultiTree = () => {
    const api = dockviewStore.api;
    if (!api) return;

    const nextVisible = !dockviewStore.showMultiTree;
    dockviewStore.setShowMultiTree(nextVisible);

    const multiTreeGroup = getGroupForPanel(api, "multitree");
    multiTreeGroup?.api.setVisible(nextVisible);
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", color: "white" }}>
      
      <div className="explorer-header">
        <div className="explorer-header-left">
          <button
            className={
              "mode-btn" + (dockviewStore.appMode === "model" ? " active" : "")
            }
            onClick={() => dockviewStore.setAppMode("model")}
          >
            M
          </button>
          <button
            className={
              "mode-btn" + (dockviewStore.appMode === "simulation" ? " active" : "")
            }
            onClick={() => dockviewStore.setAppMode("simulation")}
          >
            S
          </button>
          <button
            className={
              "mode-btn" + (dockviewStore.appMode === "postpro" ? " active" : "")
            }
            onClick={() => dockviewStore.setAppMode("postpro")}
          >
            P
          </button>
        </div>

        <div className="panel-buttons">
          <button
            className={
              "panel-toggle-btn" + (dockviewStore.showController ? " active" : "")
            }
            onClick={toggleController}
          >
            Ctrls
          </button>
          <button
            className={
              "panel-toggle-btn" + (dockviewStore.showMultiTree ? " active" : "")
            }
            onClick={toggleMultiTree}
          >
            Tree
          </button>
        </div>

      </div>

      <div style={{ padding: 10, overflow: "auto" }}>
        Explorer content...
      </div>
    </div>
  );
};

const ControllerPanel: React.FC<IDockviewPanelProps> = () => {
  return (
    <div style={{ padding: 10, color: "white" }}>
      Controller content...
    </div>
  );
};

const OptionsPanel: React.FC<IDockviewPanelProps> = () => {
  return (
    <div style={{ padding: 10, color: "white" }}>
      Options content...
    </div>
  );
};

const MultiTreePanel: React.FC<IDockviewPanelProps> = () => (
  <div style={{ padding: 10, color: "white" }}>
    Multi Tree content...
  </div>
);

const View3DPanel: React.FC<IDockviewPanelProps> = () => (
  <div style={{ padding: 10, height: "100%", background: "#111", color: "white" }}>
    3D scene
  </div>
);

const components: Record<string, React.FC<IDockviewPanelProps>> = {
  explorer: ExplorerPanel,
  controller: ControllerPanel,
  options: OptionsPanel,
  multitree: MultiTreePanel,
  view3d: View3DPanel,
};

const tabComponents = {
  noCloseTab: (props: IDockviewPanelProps) => {
    return (
      <div style={{ width: "100%", paddingTop: "6px", paddingLeft: "0px", paddingRight: "0px" }}>
        {props.api.title}
      </div>
    );
  },
};


export default function App() {
  const [, setVersion] = useState(0);

  useEffect(() => {
    return dockviewStore.subscribe(() => {
      setVersion(v => v + 1);
    });
  }, []);

  const onReady = (event: DockviewReadyEvent) => {
    const api = event.api;
    dockviewStore.api = api;

    // Basic layout, created ONCE
    api.addPanel({
      id: "explorer",
      component: "explorer",
      tabComponent: "noCloseTab",
      title: "Explorer",
    });

    api.addPanel({
      id: "controller",
      component: "controller",
      title: "Controller",
      position: { referencePanel: "explorer", direction: "right" },
    });

    api.addPanel({
      id: "multitree",
      component: "multitree",
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

    api.addPanel({
      id: "options",
      component: "options",
      tabComponent: "noCloseTab",
      title: "Options",
      position: { referencePanel: "controller", direction: "below" },
    });

    // Initial visibilities (from store defaults)
    const controllerGroup = getGroupForPanel(api, "controller");
    const optionsGroup    = getGroupForPanel(api, "options");
    const multiTreeGroup  = getGroupForPanel(api, "multitree");

    // e.g. default: controller visible, multitree hidden
    controllerGroup?.api.setVisible(dockviewStore.showController);
    optionsGroup?.api.setVisible(dockviewStore.showController);
    multiTreeGroup?.api.setVisible(dockviewStore.showMultiTree);

    // Optional: initial widths
    controllerGroup?.api.setSize({ width: 300 });
    const explorerGroup = getGroupForPanel(api, "explorer");
    explorerGroup?.api.setSize({ width: 250 });

    // Lock groups so they can't be tabbed together
    api.groups.forEach((g) => {
      g.locked = true;
    });
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        background: "#111",
      }}
    >
      <div
        style={{
          height: 70,
          background: "#1a1a1a",
          color: "white",
          display: "flex",
          alignItems: "center",
          paddingLeft: 10,
          borderBottom: "1px solid #333",
        }}
      >
        {
          {
            model: "Model",
            simulation: "Simulation",
            postpro: "Post Processing",
          }[dockviewStore.appMode]
        }
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        <DockviewReact
          components={components}
          tabComponents={tabComponents}
          onReady={onReady}
          className="dockview-theme-dark"
        />
      </div>

      <div
        style={{
          height: 30,
          background: "#1a1a1a",
          color: "white",
          display: "flex",
          alignItems: "center",
          paddingLeft: 10,
          borderTop: "1px solid #333",
        }}
      >
        Footer
      </div>
    </div>
  );
}
