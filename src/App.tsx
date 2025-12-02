import { useState } from "react";
import { DockviewReact } from "dockview-react";
import "dockview-react/dist/styles/dockview.css";

// ─────────────────────────────────────────────────────────────
// Panel Components
// ─────────────────────────────────────────────────────────────

const ExplorerPanel = () => {
  return (
    <div style={{ padding: 10, color: "white" }}>
      <p>This is Explorer content</p>
    </div>
  );
};

const ControllerGroupPanel = () => {
  const [topHeight, setTopHeight] = useState(150);
  const [dragging, setDragging] = useState(false);

  const onMouseDown = () => setDragging(true);
  const onMouseMove = (e: any) => {
    if (!dragging) return;
    const newHeight = Math.max(80, Math.min(400, e.clientY - 50)); // subtract navbar height
    setTopHeight(newHeight);
  };
  const onMouseUp = () => setDragging(false);

  return (
    <div
      style={{ height: "100%", display: "flex", flexDirection: "column", color: "white" }}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      {/* Controller (top) */}
      <div style={{ height: topHeight, padding: 10 }}>
        <p>Controller area</p>
      </div>

      {/* Horizontal Splitter */}
      <div
        onMouseDown={onMouseDown}
        style={{
          height: "6px",
          background: "#555",
          cursor: "row-resize"
        }}
      />

      {/* Options (bottom) */}
      <div style={{ flex: 1, padding: 10 }}>
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
        color: "white"
      }}
    >
      <h3>3D View</h3>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// App Layout
// ─────────────────────────────────────────────────────────────

const components = {
  explorer: ExplorerPanel,
  controllergroup: ControllerGroupPanel,
  multitree: MultiTree,
  view3d: View3DPanel
};

export default function App() {
  const [explorerWidth, setExplorerWidth] = useState(220);
  const [dragging, setDragging] = useState(false);

  // Horizontal splitter for Explorer width
  const onMouseDown = () => setDragging(true);
  const onMouseMove = (e: any) => {
    if (!dragging) return;
    const newWidth = Math.max(150, Math.min(400, e.clientX));
    setExplorerWidth(newWidth);
  };
  const onMouseUp = () => setDragging(false);

  // Initialize Dockview layout
  const onReady = (event: any) => {
    // Explorer panel (left)
    event.api.addPanel({
      id: "explorer",
      component: "explorer",
      title: "Explorer"
    });

    // ControllerGroup panel (middle)
    event.api.addPanel({
      id: "controllergroup",
      component: "controllergroup",
      title: "Controller",
      position: {
        referencePanel: "explorer",
        direction: "right"
      }
    });

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

    // 3D View panel (right)
    event.api.addPanel({
      id: "view3d",
      component: "view3d",
      title: "",
      position: {
        referencePanel: "multitree",
        direction: "right"
      }
    });

    // Disable floating & close for 3D view header
    // Also remove header entirely
    // const panel3D = event.api.getPanel("view3d");
    // panel3D?.api.setHeaderVisibility(false);
    // panel3D?.api.setCanFloat(false);
    // panel3D?.api.setCanClose(false);
  };

  return (
    <div
      style={{ height: "100vh", width: "100vw", display: "flex", flexDirection: "column" }}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      {/* Top NavBar */}
      <div
        style={{
          height: "70px",
          background: "#1a1a1a",
          color: "white",
          display: "flex",
          alignItems: "center",
          paddingLeft: "10px"
        }}
      >
        Navbar
      </div>

      {/* Content row */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Dockview region */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <DockviewReact
            components={components}
            onReady={onReady}
            className="dockview-theme-dark"
          />
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          height: "30px",
          background: "#1a1a1a",
          color: "white",
          display: "flex",
          alignItems: "center",
          paddingLeft: "10px",
          borderTop: "1px solid #333"
        }}
      >
        Footer
      </div>
    </div>
  );
}
