import { useState } from "react";
import PartitionController from "./partitions/PartitionController";
import PartitionsList from "./partitions/PartitionsList";
import ProcessController from "./processes/ProcessesController";
import ProcessesList from "./processes/ProcessesList";

export interface IPartition {
  id: number;
  size: number;
  used: number;
}

export interface IProcess {
  id: number;
  size: number;
}

const initialPartitions: IPartition[] = [
  {
    id: 1,
    size: 20,
    used: 15,
  },
];

export default function StaticAllocationView() {
  const [partitions, setPartitions] = useState<IPartition[]>(initialPartitions);
  const [processes, setProcesses] = useState<IProcess[]>([]);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const hasPartitionsAndProcesses =
    partitions.length > 0 && processes.length > 0;

  const addPartition = (size: number) => {
    const newPartition: IPartition = {
      id: partitions.length + 1,
      size,
      used: 0,
    };
    setPartitions([...partitions, newPartition]);
  };

  const removePartition = (id: number) => {
    const newPartitions = partitions.filter((p) => p.id !== id);
    setPartitions(newPartitions);
  };

  const addProcess = (size: number) => {
    const newPartition: IProcess = {
      id: processes.length + 1,
      size,
    };
    setProcesses([...processes, newPartition]);
  };

  const removeProcess = (id: number) => {
    const newPartitions = processes.filter((p) => p.id !== id);
    setProcesses(newPartitions);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {!isSimulationRunning && (
            <PartitionController
              onAddPartition={addPartition}
              onClearPartitions={() => setPartitions([])}
            />
          )}
          <PartitionsList
            partitions={partitions}
            onPartitionRemoved={removePartition}
            isSimulationRunning={isSimulationRunning}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {!isSimulationRunning && (
            <ProcessController
              onAddProcess={addProcess}
              onClearProcesses={() => setProcesses([])}
            />
          )}
          <ProcessesList
            processes={processes}
            onProcessRemoved={removeProcess}
            isSimulationRunning={isSimulationRunning}
          />
        </div>
      </div>
      <button
        style={{
          backgroundColor: hasPartitionsAndProcesses
            ? isSimulationRunning
              ? "#e74c3c"
              : "#2ecc71"
            : "#7f8c8d",
          color: "white",
          padding: "15px",
          borderRadius: "8px",
          cursor: "pointer",
          outline: "none",
          border: "none",
          width: "200px",
        }}
        disabled={!hasPartitionsAndProcesses}
        onClick={() => setIsSimulationRunning(!isSimulationRunning)}
      >
        {isSimulationRunning ? "Stop Simulation" : "Start Simulation"}
      </button>
      {!hasPartitionsAndProcesses && (
        <div>Add partitions and processes to start the simulation</div>
      )}
    </div>
  );
}
