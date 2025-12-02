import { useState } from "react";
import { DockviewReact } from "dockview-react";
import "dockview-react/dist/styles/dockview.css";

// Single component (for now)
const components = {
  default: (props: any) => {
    return <div style={{ padding: 10 }}>Hello from Dockview</div>;
  },
};

export default function App() {
  const [explorerWidth, setExplorerWidth] = useState(220);
  const [dragging, setDragging] = useState(false);

  const onMouseDown = (e: any) => {
    setDragging(true);
  };

  const onMouseMove = (e: any) => {
    if (!dragging) return;
    const newWidth = Math.max(150, Math.min(400, e.clientX));
    setExplorerWidth(newWidth);
  };

  const onMouseUp = () => setDragging(false);

  const onReady = (event: any) => {
    // Explorer
    event.api.addPanel({
      id: "explorer",
      component: "default",
      title: "Explorer",
    });

    // Controller
    event.api.addPanel({
      id: "controller",
      component: "default",
      title: "Controller",
      position: {
        direction: "right", // place to the right of Explorer
        referencePanel: "explorer",
      },
    });

    // Options
    event.api.addPanel({
      id: "options",
      component: "default",
      title: "Options",
      position: {
        direction: "below", // place below Controller
        referencePanel: "controller",
      },
    });
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      {/* Dockview region */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <DockviewReact
          components={components}
          onReady={onReady}
          className="dockview-theme-dark"
        />
      </div>
    </div>
  );
}
