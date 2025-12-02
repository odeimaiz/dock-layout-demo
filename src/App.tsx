import { useRef, useState } from "react";
import { DockviewReact } from "dockview-react";
import type { PanelComponentProps } from "dockview-react";
import "dockview/dist/styles/dockview.css";

export default function App() {
  const [explorerWidth, setExplorerWidth] = useState(220);
  const splitterRef = useRef<HTMLDivElement | null>(null);

  // Simple mouse-based drag to resize explorer
  const onMouseDown = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startWidth = explorerWidth;

    const onMove = (ev: MouseEvent) => {
      const newWidth = Math.max(150, startWidth + ev.clientX - startX);
      setExplorerWidth(newWidth);
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      {/* Explorer */}
      <div
        style={{
          width: explorerWidth,
          background: "#2e2e2e",
          color: "white",
          padding: "10px",
          display: "flex",
          flexDirection: "column"
        }}
      >
        Explorer (empty)
      </div>

      {/* Vertical Splitter */}
      <div
        ref={splitterRef}
        onMouseDown={onMouseDown}
        style={{
          width: "4px",
          cursor: "col-resize",
          background: "#444",
        }}
      />

      {/* Docking Host */}
      <div style={{ flex: 1 }}>
        <DockviewReact
          components={{
            view2: View2,
            view3: View3,
          }}
          defaultLayout={{
            views: [
              { id: "view2", component: "view2", position: { direction: "right" } },
              { id: "view3", component: "view3", position: { direction: "below", referencePanel: "view2" } }
            ]
          }}
        />
      </div>
    </div>
  );
}

/*** Empty panel components ***/

function View2(props: PanelComponentProps) {
  return <div style={{ padding: "10px" }}>View 2 (empty)</div>;
}

function View3(props: PanelComponentProps) {
  return <div style={{ padding: "10px" }}>View 3 (empty)</div>;
}
