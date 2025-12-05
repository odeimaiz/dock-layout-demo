import type React from "react";
import { useDockview } from "../DockviewContext";

export const ExplorerHeader: React.FC = () => {
  const {
    mode,
    setMode,
    showController,
    setShowController,
    showMultiTree,
    setShowMultiTree,
    api,
  } = useDockview();

  const toggleController = () => {
    if (!api) return;
    setShowController(!showController);
    // visibility synced by DockviewWorkspace effect
  };

  const toggleMultiTree = () => {
    if (!api) return;
    setShowMultiTree(!showMultiTree);
  };

  return (
    <div className="explorer-header">
      <div className="explorer-header-left">
        <button
          className={`mode-btn ${mode === "model" ? "active" : ""}`}
          onClick={() => setMode("model")}
        >
          M
        </button>
        <button
          className={`mode-btn ${mode === "simulation" ? "active" : ""}`}
          onClick={() => setMode("simulation")}
        >
          S
        </button>
        <button
          className={`mode-btn ${mode === "postpro" ? "active" : ""}`}
          onClick={() => setMode("postpro")}
        >
          P
        </button>
      </div>

      <div className="panel-buttons">
        <button
          className={`panel-toggle-btn ${showController ? "active" : ""}`}
          onClick={toggleController}
        >
          Ctrls
        </button>
        <button
          className={`panel-toggle-btn ${showMultiTree ? "active" : ""}`}
          onClick={toggleMultiTree}
        >
          Tree
        </button>
      </div>
    </div>
  );
};
