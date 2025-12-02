import { useState } from "react";
import { DockviewReact } from "dockview-react";
import "dockview-react/dist/styles/dockview.css";
import { dockviewStore } from "./dockviewStore";

// ─────────────────────────────────────────────
// Panel components
// ─────────────────────────────────────────────

const ExplorerPanel = () => {

  const toggleController = () => {
    const api = dockviewStore.api;
    if (!api) return;

    if (dockviewStore.showController) {
      const panel = api.panels.find((p: any) => p.id === "controllergroup");
      if (panel) api.removePanel(panel);
      dockviewStore.setShowController(false);
    } else {
      api.addPanel({
        id: "controllergroup",
        component: "controllergroup",
        title: "Controller",
        position: { referencePanel: "explorer", direction: "right" }
      });
      dockviewStore.setShowController(true);
    }
  };

  const toggleMultiTree = () => {
    const api = dockviewStore.api;
    if (!api) return;

    if (dockviewStore.showMultiTree) {
      const panel = api.panels.find((p: any) => p.id === "multitree");
      if (panel) api.removePanel(panel);
      dockviewStore.setShowMultiTree(false);
    } else {
      api.addPanel({
        id: "multitree",
        component: "multitree",
        title: "Multi Tree",
        position: { referencePanel: "controllergroup", direction: "right" }
      });
      dockviewStore.setShowMultiTree(true);
    }
  };

  return (
    <div style={{ padding: 10, color: "white" }}>
      <h3>Explorer</h3>

      <button onClick={toggleController}>
        Toggle Controller
      </button>

      <br /><br />

      <button onClick={toggleMultiTree}>
        Toggle Multi Tree
      </button>
    </div>
  );
};


const ControllerGroupPanel = () => {
  const [topHeight, setTopHeight] = useState(150);
  const [dragging, setDragging] = useState(false);

  const onMouseDown = () => setDragging(true);
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging) return;
    // Vertical split: Controller (top) / Options (bottom)
    const newHeight = Math.max(80, Math.min(200, e.clientY - 70)); // 70px navbar
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
      {/* Controller (top) */}
      <div style={{ height: topHeight, padding: 10 }}>
        <h3>Controller</h3>
        <p>Controller area</p>
      </div>

      {/* Horizontal splitter inside controller group */}
      <div
        onMouseDown={onMouseDown}
        style={{
          height: 6,
          background: "#555",
          cursor: "row-resize",
          userSelect: "none",
        }}
      />

      {/* Options (bottom) */}
      <div style={{ flex: 1, padding: 10 }}>
        <h3>Options</h3>
        <p>Options area</p>
      </div>
    </div>
  );
};

const MultiTree = () => {
  return (
    <div style={{ padding: 10, color: "white" }}>
      <p>This is Multi Tree content</p>
    </div>
  );
};

const View3DPanel = () => {
  return (
    <div
      style={{
        padding: 10,
        height: "100%",
        background: "#111",
        color: "white",
      }}
    >
      <h3>3D View</h3>
      <p>This is where the 3D scene will go.</p>
    </div>
  );
};


export default function App() {
  const onReady = (event: any) => {
    const api = event.api;
    dockviewStore.api = api;

    // Left: Explorer
    event.api.addPanel({
      id: "explorer",
      component: "explorer",
      title: "Explorer",
    });

    // Middle: ControllerGroup
    event.api.addPanel({
      id: "controllergroup",
      component: "controllergroup",
      title: "Controller",
      position: {
        referencePanel: "explorer",
        direction: "right",
      },
    });

    /* hidden on startup
    // Multi Tree (middle)
    event.api.addPanel({
      id: "multitree",
      component: "multitree",
      title: "Multi Tree",
      position: {
        referencePanel: "controllergroup",
        direction: "right"
      }
    });
    */

    // 3D View panel (right)
    event.api.addPanel({
      id: "view3d",
      component: "view3d",
      title: "3D View",
      position: {
        // referencePanel: "multitree",
        referencePanel: "controllergroup",
        direction: "right",
      },
    });

    // Resize Explorer to 300px
    const explorerPanel = api.panels.find((p: any) => p.id === "explorer");
    if (explorerPanel) {
      explorerPanel.group.api.setSize({ width: 300 });
    }

    // Resize ControllerGroup to 300px
    const controllerPanel = api.panels.find((p: any) => p.id === "controllergroup");
    if (controllerPanel) {
      controllerPanel.group.api.setSize({ width: 300 });
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
      {/* Navbar */}
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

      {/* Middle: Dockview fills the whole row */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <DockviewReact
          components={{
            explorer: ExplorerPanel,
            controllergroup: ControllerGroupPanel,
            multitree: MultiTree,
            view3d: View3DPanel
          }}
          onReady={onReady}
          className="dockview-theme-dark"
        />
      </div>

      {/* Footer */}
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
