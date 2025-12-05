import type React from "react";
import type {
  IDockviewPanelProps,
  DockviewApi,
  DockviewGroupPanel,
} from "dockview-react";
import { useDockview } from "../DockviewContext";

const getGroupForPanel = (
  api: DockviewApi,
  panelId: string
): DockviewGroupPanel | undefined => {
  return api.groups.find((g) => g.panels.some((p) => p.id === panelId));
};

export const NoCloseTab: React.FC<IDockviewPanelProps> = (props) => {
  return <div className="no-close-tab">{props.api.title}</div>;
};

export const ClosableTab: React.FC<IDockviewPanelProps> = (props) => {
  const { api, setShowController, setShowMultiTree } = useDockview();

  if (!api) {
    return (
      <div className="custom-tab">
        <div className="custom-tab-title">{props.api.title}</div>
      </div>
    );
  }

  const panelId = props.api.id;

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (panelId === "controller" || panelId === "options") {
      const controller = getGroupForPanel(api, "controller");
      const options = getGroupForPanel(api, "options");

      controller?.api.setVisible(false);
      options?.api.setVisible(false);
      setShowController(false);
    }

    if (panelId === "multitree") {
      const multitree = getGroupForPanel(api, "multitree");
      multitree?.api.setVisible(false);
      setShowMultiTree(false);
    }
  };

  return (
    <div className="custom-tab">
      <div className="custom-tab-title">{props.api.title}</div>
      <div className="custom-tab-close" onClick={handleClose}>
        ×
      </div>
    </div>
  );
};
