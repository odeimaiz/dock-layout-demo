import { useCallback, useEffect, useState } from "react";
import { DockviewReact } from "dockview-react";
import type { DockviewApi, DockviewReadyEvent } from "dockview-react";
import { themeVisualStudio } from "dockview";

import {
  DockviewContext,
  type DockviewContextValue,
  type DockviewMode,
} from "./DockviewContext";
import { components, tabComponents } from "./registry";
import { createInitialLayout, updateGroupVisibility } from "./dockviewLayout";

export interface DockviewWorkspaceProps {
  mode: DockviewMode;
  onModeChange: (mode: DockviewMode) => void;
  showController: boolean;
  onShowControllerChange: (value: boolean) => void;
  showMultiTree: boolean;
  onShowMultiTreeChange: (value: boolean) => void;
}

export function DockviewWorkspace(props: DockviewWorkspaceProps) {
  const [api, setApi] = useState<DockviewApi | null>(null);

  const handleReady = useCallback((event: DockviewReadyEvent) => {
    const dockApi = event.api;
    setApi(dockApi);
    createInitialLayout(dockApi);
  }, []);

  // Keep Dockview groups in sync with React state
  useEffect(() => {
    if (!api) return;
    updateGroupVisibility(api, {
      showController: props.showController,
      showMultiTree: props.showMultiTree,
    });
  }, [api, props.showController, props.showMultiTree]);

  const ctxValue: DockviewContextValue = {
    api,
    mode: props.mode,
    setMode: props.onModeChange,
    showController: props.showController,
    setShowController: props.onShowControllerChange,
    showMultiTree: props.showMultiTree,
    setShowMultiTree: props.onShowMultiTreeChange,
  };

  return (
    <DockviewContext.Provider value={ctxValue}>
      <DockviewReact
        theme={themeVisualStudio}
        components={components}
        tabComponents={tabComponents}
        onReady={handleReady}
      />
    </DockviewContext.Provider>
  );
}
