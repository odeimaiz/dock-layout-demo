import { useEffect, useState } from "react";
import { DockviewReact } from "dockview-react";
import type { DockviewApi, DockviewReadyEvent, IDockviewPanel, IDockviewPanelProps } from "dockview-react";
import "dockview-react/dist/styles/dockview.css";
import { dockviewStore } from "./dockviewStore";
import "./App.css";


const initExplorerPanel = (api: DockviewApi) => {
  api.addPanel({
    id: "explorer",
    component: "explorer",
    title: "Explorer",
  });
}

const initControllerPanel = (api: DockviewApi) => {
  api.addPanel({
    id: "controller",
    component: "controller",
    title: "Controller",
    position: { referencePanel: "explorer", direction: "right" }
  });
}

const initOptionsPanel = (api: DockviewApi) => {
  api.addPanel({
    id: "options",
    component: "options",
    title: "Options",
    position: { referencePanel: "controller", direction: "below" }
  });
}

const initMultiTreePanel = (api: DockviewApi) => {
  api.addPanel({
    id: "multitree",
    component: "multitree",
    title: "Multi Tree",
    position: { referencePanel: "controller", direction: "right" }
  });
}

const initView3DPanel = (api: DockviewApi) => {
  api.addPanel({
    id: "view3d",
    component: "view3d",
    title: "3D View",
    position: {
      referencePanel: "multitree",
      direction: "right",
    },
  });
}

function rebuildLayout(api: DockviewApi) {
  // Remove everything except Explorer
  api.panels.forEach(p => {
    if (p.id !== "explorer") api.removePanel(p);
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
      title: "Options",
      position: {
        referencePanel: "controller",
        direction: "below"
      }
    });
    // options.api.setCanClose(false);
    // options.api.setCanMove(false);
    // options.api.setCanFloat(false);
  }

  // Lock all panels so they can't accept "within" (tab) drops
  api.panels.forEach((p: IDockviewPanel) => {
    p.group.locked = true;
  });
}

const ExplorerPanel: React.FC<IDockviewPanelProps> = () => {
  // Local “tick” just to force React to re-render
  const [, setVersion] = useState(0);

  useEffect(() => {
    const unsubscribe = dockviewStore.subscribe(() => {
      setVersion(v => v + 1); // re-render ExplorerPanel
    });

    return unsubscribe;
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
      
      {/* Header */}
      <div className="explorer-header">
        <div>Explorer</div>

        <div className="explorer-buttons">

          <button
            className={
              "explorer-toggle" + (dockviewStore.showController ? " active" : "")
            }
            onClick={toggleController}
          >
            Ctrls
          </button>

          <button
            className={
              "explorer-toggle" + (dockviewStore.showMultiTree ? " active" : "")
            }
            onClick={toggleMultiTree}
          >
            Tree
          </button>

        </div>
      </div>

      <div style={{ padding: 10, overflow: "auto" }}>
        <p>Explorer content...</p>
      </div>
    </div>
  );
};

const ControllerPanel: React.FC<IDockviewPanelProps> = () => {
  return (
    <div style={{ padding: 10, color: "white" }}>
      <p>Controller content...</p>
    </div>
  );
};

const OptionsPanel: React.FC<IDockviewPanelProps> = () => {
  return (
    <div style={{ padding: 10, color: "white" }}>
      <p>Options content...</p>
    </div>
  );
};

const MultiTreePanel: React.FC<IDockviewPanelProps> = () => (
  <div style={{ padding: 10, color: "white" }}>
    <p>This is Multi Tree content</p>
  </div>
);

const View3DPanel: React.FC<IDockviewPanelProps> = () => (
  <div style={{ padding: 10, height: "100%", background: "#111", color: "white" }}>
    <p>This is where the 3D scene will go.</p>
  </div>
);

const components: Record<string, React.FC<IDockviewPanelProps>> = {
  explorer: ExplorerPanel,
  controller: ControllerPanel,
  options: OptionsPanel,
  multitree: MultiTreePanel,
  view3d: View3DPanel,
};


export default function App() {
  const onReady = (event: DockviewReadyEvent) => {
    const api = event.api;
    dockviewStore.api = api;

    initExplorerPanel(api);
    initControllerPanel(api);
    initMultiTreePanel(api);
    initView3DPanel(api);
    initOptionsPanel(api);

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
        Navbar
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        <DockviewReact
          components={components}
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
