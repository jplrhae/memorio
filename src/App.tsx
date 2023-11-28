import { useState } from "react";
import "./App.css";
import TabBar from "./components/TabBar";
import StaticAllocationView from "./components/StaticAllocationView";
import DynamicAllocationView from "./components/DynamicAllocationView";

const views = ["static", "dynamic"];

export interface IPartition {
  id: number;
  size: number;
  used: number;
}

export interface IProgram {
  id: number;
  size: number;
  allocatedIn: IPartition | null;
  isAllocated?: boolean;
  isLocked?: boolean;
}

export interface ISimulationData {
  id: number;
  date: Date;
  text: string;
}

function App() {
  const [selectedView, setSelectedView] = useState<string>("static");

  const renderView = (view: string) => {
    switch (view) {
      case "static":
        return (
          <div>
            <h1>Partitioned Static Relocatable Allocation</h1>
            <p>
              In Partitioned Static Relocatable Allocation, programs are
              allocated in any fixed-size partitions that can accomodate them.
              <br /> Add partitions and programs, then observe how they are
              allocated by running the simulation.
            </p>
            <StaticAllocationView />
          </div>
        );
      case "dynamic":
        return (
          <div>
            <h1>Dynamic Partitioned Allocation</h1>
            <p>
              This view will be used to demonstrate dynamic memory allocation.
            </p>
            <DynamicAllocationView />
          </div>
        );
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
