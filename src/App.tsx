import { useEffect, useState } from "react";
import { DockviewReact } from "dockview-react";
import type { DockviewApi, DockviewReadyEvent, IDockviewPanel, IDockviewPanelProps } from "dockview-react";
import "dockview-react/dist/styles/dockview.css";
import { dockviewStore } from "./dockviewStore";
import "./App.css";

let isRebuilding = false;

function rebuildLayout(api: DockviewApi) {
  isRebuilding = true;

  // Remove everything
  api.panels.forEach(p => api.removePanel(p));

  api.addPanel({
    id: "explorer",
    component: "explorer",
    tabComponent: "noCloseTab",
    title: "Explorer",
  });

  let lastRight = "explorer"; // track where next panel attaches

  if (dockviewStore.showController) {
    api.addPanel({
      id: "controller",
      component: "controller",
      title: "Controller",
      position: {
        referencePanel: lastRight,
        direction: "right"
      }
    });
    lastRight = "controller";
  }

  if (dockviewStore.showMultiTree) {
    api.addPanel({
      id: "multitree",
      component: "multitree",
      title: "Multi Tree",
      position: {
        referencePanel: lastRight,
        direction: "right"
      }
    });
    lastRight = "multitree";
  }

  const view3d = api.addPanel({
    id: "view3d",
    component: "view3d",
    title: "3D View",
    position: {
      referencePanel: lastRight,
      direction: "right"
    }
  });
  view3d.group.header.hidden = true;

  if (dockviewStore.showController) {
    api.addPanel({
      id: "options",
      component: "options",
      tabComponent: "noCloseTab",
      title: "Options",
      position: {
        referencePanel: "controller",
        direction: "below"
      }
    });
  }

  // Lock all panels so they can't accept "within" (tab) drops
  api.panels.forEach((p: IDockviewPanel) => {
    p.group.locked = true;
  });

  isRebuilding = false;
}

const ExplorerPanel: React.FC<IDockviewPanelProps> = () => {
  // Local “tick” just to force React to re-render
  const [, setVersion] = useState(0);

  useEffect(() => {
    const unsub = dockviewStore.subscribe(() => {
      setVersion(v => v + 1);
    });
    return unsub;
  }, []);

  const toggleController = () => {
    dockviewStore.setShowController(!dockviewStore.showController);
    rebuildLayout(dockviewStore.api!);
  };

  const toggleMultiTree = () => {
    dockviewStore.setShowMultiTree(!dockviewStore.showMultiTree);
    rebuildLayout(dockviewStore.api!);
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
    This is Multi Tree content
  </div>
);

const View3DPanel: React.FC<IDockviewPanelProps> = () => (
  <div style={{ padding: 10, height: "100%", background: "#111", color: "white" }}>
    This is where the 3D scene will go.
  </div>
);

const tabComponents = {
  noCloseTab: (props: IDockviewPanelProps) => {
    return (
      <div style={{ width: "100%", paddingTop: "6px", paddingLeft: "0px", paddingRight: "0px" }}>
        {props.api.title}
      </div>
    );
  },
};

const components: Record<string, React.FC<IDockviewPanelProps>> = {
  explorer: ExplorerPanel,
  controller: ControllerPanel,
  options: OptionsPanel,
  multitree: MultiTreePanel,
  view3d: View3DPanel,
};


export default function App() {
  const [, setVersion] = useState(0);

  useEffect(() => {
    const unsub = dockviewStore.subscribe(() => {
      setVersion(v => v + 1);
    });
    return unsub;
  }, []);

  const onReady = (event: DockviewReadyEvent) => {
    const api = event.api;
    dockviewStore.api = api;

    api.onDidRemovePanel((panel) => {
      if (isRebuilding) return; // ignore events during rebuild

      const id = panel.id;
      if (id === "controller") {
        dockviewStore.setShowController(false); // update toggle
        rebuildLayout(api); // hide Options too
      }
      if (id === "multitree") {
        dockviewStore.setShowMultiTree(false); // update toggle
        rebuildLayout(api);
      }
    });

    rebuildLayout(api);

    // Resize Explorer → 300
    const explorerPanel = api.panels.find((p: IDockviewPanel) => p.id === "explorer");
    if (explorerPanel) explorerPanel.group.api.setSize({ width: 300 });

    // Resize Controller → 300
    const controllerPanel = api.panels.find((p: IDockviewPanel) => p.id === "controller");
    if (controllerPanel) controllerPanel.group.api.setSize({ width: 300 });

    // Hide header 3D View's caption bar
    const view3DPanel = api.panels.find((p: IDockviewPanel) => p.id === "view3d");
    if (view3DPanel) {
      view3DPanel.group.header.hidden = true;
    }
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
