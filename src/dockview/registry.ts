import type React from "react";
import type { IDockviewPanelProps } from "dockview-react";

import { ExplorerPanel } from "./panels/ExplorerPanel";
import { ControllerPanel } from "./panels/ControllerPanel";
import { OptionsPanel } from "./panels/OptionsPanel";
import { MultiTreePanel } from "./panels/MultiTreePanel";
import { View3DPanel } from "./panels/View3DPanel";
import { NoCloseTab, ClosableTab } from "./components/Tabs";

export const components: Record<string, React.FC<IDockviewPanelProps>> = {
  explorer: ExplorerPanel,
  controller: ControllerPanel,
  options: OptionsPanel,
  multitree: MultiTreePanel,
  view3d: View3DPanel,
};

export const tabComponents = {
  noCloseTab: NoCloseTab,
  closableTab: ClosableTab,
};
