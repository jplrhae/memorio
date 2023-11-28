import { useState } from "react";
import ProcessesList from "./ProcessesList";
import ProcessController from "./ProcessesController";

export interface IProcess {
  id: number;
  size: number;
}

export default function PartitionsView() {
  const [processes, setProcesses] = useState<IProcess[]>([]);

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
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <ProcessController
        onAddProcess={addProcess}
        onClearProcesses={() => setProcesses([])}
      />
      <ProcessesList processes={processes} onProcessRemoved={removeProcess} />
    </div>
  );
}
