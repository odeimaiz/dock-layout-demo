import { useEffect, useState } from "react";
import { DockviewReact } from "dockview-react";
import type { DockviewApi, DockviewReadyEvent, IDockviewPanel, IDockviewPanelProps } from "dockview-react";
import "dockview-react/dist/styles/dockview.css";
import { dockviewStore } from "./dockviewStore";
import "./App.css";


// ─────────────────────────────────────────────
// Panel components
// ─────────────────────────────────────────────

const showExplorerPanel = (api: DockviewApi) => {
  api.addPanel({
    id: "explorer",
    component: "explorer",
    title: "Explorer",
  });
}

const showControllerGroupPanel = (api: DockviewApi) => {
  api.addPanel({
    id: "controllergroup",
    component: "controllergroup",
    title: "Controller",
    position: { referencePanel: "explorer", direction: "right" }
  });
}

const hideControllerGroupPanel = (api: DockviewApi) => {
  const panel = api.panels.find((p: IDockviewPanel) => p.id === "controllergroup");
  if (panel) {
    api.removePanel(panel)
  };
}

const showMultiTreePanel = (api: DockviewApi) => {
  api.addPanel({
    id: "multitree",
    component: "multitree",
    title: "Multi Tree",
    position: { referencePanel: "controllergroup", direction: "right" }
  });
}

const hideMultiTreePanel = (api: DockviewApi) => {
  const panel = api.panels.find((p: IDockviewPanel) => p.id === "multitree");
  if (panel) api.removePanel(panel);
}

const showView3DPanel = (api: DockviewApi) => {
  api.addPanel({
    id: "view3d",
    component: "view3d",
    title: "3D View",
    position: {
      // referencePanel: "multitree",
      referencePanel: "controllergroup",
      direction: "right",
    },
  });
}

const ExplorerPanel = () => {
  // Local “tick” just to force React to re-render
  const [, setVersion] = useState(0);

  useEffect(() => {
    const unsubscribe = dockviewStore.subscribe(() => {
      setVersion(v => v + 1); // 🔥 re-render ExplorerPanel
    });

    return unsubscribe;
  }, []);

  const toggleController = () => {
    const api = dockviewStore.api;
    if (!api) return;

    if (dockviewStore.showController) {
      hideControllerGroupPanel(api);
    } else {
      showControllerGroupPanel(api);
    }
    dockviewStore.setShowController(!dockviewStore.showController);
  };

  const toggleMultiTree = () => {
    const api = dockviewStore.api;
    if (!api) return;

    if (dockviewStore.showMultiTree) {
      hideMultiTreePanel(api);
    } else {
      showMultiTreePanel(api);
    }
    dockviewStore.setShowMultiTree(!dockviewStore.showMultiTree);
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

      {/* Body */}
      <div style={{ padding: 10, overflow: "auto" }}>
        {/* Optional: folder tree or content here */}
      </div>
    </div>
  );
};

const ControllerGroupPanel = () => {
  const [topHeight, setTopHeight] = useState(150);
  const [dragging, setDragging] = useState(false);

  const onMouseDown = () => setDragging(true);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const newHeight = Math.max(80, Math.min(200, e.clientY - 70)); 
    setTopHeight(newHeight);
  };

  const onMouseUp = () => setDragging(false);

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        color: "white",
      }}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      <div style={{ height: topHeight, padding: 10 }}>
        <h3>Controller</h3>
        <p>Controller area</p>
      </div>

      <div
        onMouseDown={onMouseDown}
        style={{
          height: 6,
          background: "#555",
          cursor: "row-resize",
          userSelect: "none",
        }}
      />

      <div style={{ flex: 1, padding: 10 }}>
        <h3>Options</h3>
        <p>Options area</p>
      </div>
    </div>
  );
};

const MultiTree = () => (
  <div style={{ padding: 10, color: "white" }}>
    <p>This is Multi Tree content</p>
  </div>
);

const View3DPanel = () => (
  <div style={{ padding: 10, height: "100%", background: "#111", color: "white" }}>
    <h3>3D View</h3>
    <p>This is where the 3D scene will go.</p>
  </div>
);

const components: Record<string, React.FC<IDockviewPanelProps>> = {
  explorer: ExplorerPanel,
  controllergroup: ControllerGroupPanel,
  multitree: MultiTree,
  view3d: View3DPanel,
};

// ─────────────────────────────────────────────
// Main App
// ─────────────────────────────────────────────

export default function App() {
  const onReady = (event: DockviewReadyEvent) => {
    const api = event.api;
    dockviewStore.api = api;

    // Explorer
    showExplorerPanel(api);

    // ControllerGroup
    showControllerGroupPanel(api);

    // Multi Tree
    // hidden on startup
    // showMultiTreePanel(api);

    // 3D View
    showView3DPanel(api);

    // Resize Explorer → 300
    const explorerPanel = api.panels.find((p: IDockviewPanel) => p.id === "controllergroup");
    if (explorerPanel) explorerPanel.group.api.setSize({ width: 300 });

    // Resize Controller → 300
    const controllerPanel = api.panels.find((p: IDockviewPanel) => p.id === "controllergroup");
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
