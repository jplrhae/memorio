import { useState } from "react";
import "./App.css";
import TabBar from "./components/TabBar";
import StaticAllocationView from "./components/StaticAllocationView";

const views = ["static", "dynamic", "both"];

function App() {
  const [selectedView, setSelectedView] = useState<string>("static");

  const renderView = (view: string) => {
    switch (view) {
      case "static":
        return (
          <div>
            <h1>Static Allocation (relocatable)</h1>
            <p>
              In relocatable static allocation, processes are allocated in
              fixed-size partitions that can accomodate them.
              <br /> Add partitions and processes, then observe how they are
              allocated by running the simulation.
            </p>
            <StaticAllocationView />
          </div>
        );
      case "dynamic":
        return (
          <div>
            <h1>Dynamic Allocation</h1>
            <p>
              This view will be used to demonstrate dynamic memory allocation.
            </p>
          </div>
        );
      case "both":
        return (
          <div>
            <h1>Both Views</h1>
            <p>
              This view will be used to demonstrate both static and dynamic
              memory allocation.
            </p>
          </div>
        );
      default:
        return <div>Invalid View</div>;
    }
  };

  return (
    <>
      <TabBar
        onTabChange={setSelectedView}
        selectedView={selectedView}
        views={views}
      />
      <div style={{ margin: "20px" }}>{renderView(selectedView)}</div>
    </>
  );
}

export default App;
