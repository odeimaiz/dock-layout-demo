import { DockviewReact } from "dockview-react";
import "dockview-react/dist/styles/dockview.css";

const components = {
  default: (props: any) => {
    return <div style={{ padding: 10 }}>Hello from Dockview</div>;
  },
};

export default function App() {
  const onReady = (event: any) => {
    // Add ONE panel so we can verify the library works
    event.api.addPanel({
      id: "panel_1",
      component: "default",
      title: "Panel 1",
    });
  };

  return (
    <div
      className="dockview-theme-dark"
      style={{ width: "100vw", height: "100vh" }}
    >
      <DockviewReact components={components} onReady={onReady} />
    </div>
  );
}
