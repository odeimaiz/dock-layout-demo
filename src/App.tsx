import { useState } from "react";
import "dockview-react/dist/styles/dockview.css";
import "./App.css";

import { DockviewWorkspace } from "./dockview/DockviewWorkspace";
import type { DockviewMode } from "./dockview/DockviewContext";

export default function App() {
  const [mode, setMode] = useState<DockviewMode>("model");
  const [showController, setShowController] = useState(true);
  const [showMultiTree, setShowMultiTree] = useState(false);

  return (
    <div className="app-container">
      <div className="navbar">
        {{
          model: "Model",
          simulation: "Simulation",
          postpro: "Post Processing",
        }[mode]}
      </div>

      <div className="dock-container">
        <DockviewWorkspace
          mode={mode}
          onModeChange={setMode}
          showController={showController}
          onShowControllerChange={setShowController}
          showMultiTree={showMultiTree}
          onShowMultiTreeChange={setShowMultiTree}
        />
      </div>

      <div className="footer">Footer</div>
    </div>
  );
}
