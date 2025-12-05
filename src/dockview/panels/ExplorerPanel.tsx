import type React from "react";
import type { IDockviewPanelProps } from "dockview-react";
import { ExplorerHeader } from "../components/ExplorerHeader";

export const ExplorerPanel: React.FC<IDockviewPanelProps> = () => {
  return (
    <div className="panel-container">
      <ExplorerHeader />
      <div className="panel-body">Explorer content...</div>
    </div>
  );
};
