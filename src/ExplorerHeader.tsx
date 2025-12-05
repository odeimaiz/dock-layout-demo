import type React from "react";
import { dockviewStore } from "./dockviewStore";

export type ExplorerHeaderProps = {
  onToggleController: () => void;
  onToggleMultiTree: () => void;
};

export const ExplorerHeader: React.FC<ExplorerHeaderProps> = ({
  onToggleController,
  onToggleMultiTree,
}) => {
  return (
    <div className="explorer-header">
      <div className="explorer-header-left">
        <button
          className={`mode-btn ${
            dockviewStore.appMode === "model" ? "active" : ""
          }`}
          onClick={() => dockviewStore.setAppMode("model")}
        >
          M
        </button>
        <button
          className={`mode-btn ${
            dockviewStore.appMode === "simulation" ? "active" : ""
          }`}
          onClick={() => dockviewStore.setAppMode("simulation")}
        >
          S
        </button>
        <button
          className={`mode-btn ${
            dockviewStore.appMode === "postpro" ? "active" : ""
          }`}
          onClick={() => dockviewStore.setAppMode("postpro")}
        >
          P
        </button>
      </div>

      <div className="panel-buttons">
        <button
          className={`panel-toggle-btn ${
            dockviewStore.showController ? "active" : ""
          }`}
          onClick={onToggleController}
        >
          Ctrls
        </button>
        <button
          className={`panel-toggle-btn ${
            dockviewStore.showMultiTree ? "active" : ""
          }`}
          onClick={onToggleMultiTree}
        >
          Tree
        </button>
      </div>
    </div>
  );
};

export default ExplorerHeader;
