import { useEffect, useState } from "react";
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
  allocatedIn: IPartition | null;
}

export interface ISimulationData {
  id: number;
  date: Date;
  text: string;
}

export default function StaticAllocationView() {
  const [partitions, setPartitions] = useState<IPartition[]>([]);
  const [processes, setProcesses] = useState<IProcess[]>([]);
  const [simulations, setSimulations] = useState<ISimulationData[]>([]);

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
      allocatedIn: null,
    };
    setProcesses([...processes, newPartition]);
  };

  const removeProcess = (id: number) => {
    const newPartitions = processes.filter((p) => p.id !== id);
    setProcesses(newPartitions);
  };

  const toggleSimulation = () => {
    // If the simulation is running, stop it and clear the data
    if (isSimulationRunning) {
      setIsSimulationRunning(false);

      // Clear the "used" for partitions
      setPartitions((prevPartitions) =>
        prevPartitions.map((partition) => ({ ...partition, used: 0 }))
      );

      // Clear the "allocatedIn" for processes
      setProcesses((prevProcesses) =>
        prevProcesses.map((process) => ({ ...process, allocatedIn: null }))
      );

      // Clear the simulation log
      setSimulations([]);
    } else {
      // If the simulation is not running, start it
      setIsSimulationRunning(true);
    }
  };

  const allocateProcesses = () => {
    // Your simulation logic here
    // This example assumes a very basic allocation where each process
    // is assigned to the first available partition that can accommodate its size

    const processesToAllocate = processes.filter(
      (process) => process.allocatedIn === null
    );

    for (const process of processesToAllocate) {
      console.log("Allocating process", process.id);

      const availablePartition = partitions.find(
        (partition) => !partition.used && partition.size >= process.size
      );

      if (availablePartition) {
        console.log(
          "Found available partition",
          availablePartition.id,
          "for process",
          process.id
        );
        // Assign the process to the partition
        process.allocatedIn = availablePartition;

        // Update the partition usage
        availablePartition.used = process.size;
        setSimulations((prevSimulations) => [
          ...prevSimulations,
          {
            id: prevSimulations.length + 1,
            date: new Date(),
            text: `Process ${process.id} allocated in partition ${availablePartition.id}`,
          },
        ]);
      } else {
        setSimulations((prevSimulations) => [
          ...prevSimulations,
          {
            id: prevSimulations.length + 1,
            date: new Date(),
            text: `No available partitions for process ${process.id}`,
          },
        ]);
        console.log("No available partitions for process", process.id);
      }
    }
  };

  useEffect(() => {
    if (isSimulationRunning) {
      const intervalId = setInterval(() => {
        // Simulate process allocation
        allocateProcesses();
        // Update state to trigger re-render with new allocations
        setProcesses([...processes]);
      }, 1000); // Adjust the interval as needed

      // Return a cleanup function to stop the simulation when the component unmounts
      return () => clearInterval(intervalId);
    }
  }, [isSimulationRunning, processes, partitions]);

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
        onClick={toggleSimulation}
      >
        {isSimulationRunning ? "Stop Simulation" : "Start Simulation"}
      </button>
      {!hasPartitionsAndProcesses && (
        <div>Add partitions and processes to start the simulation</div>
      )}
      {simulations.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginTop: "20px",
            width: "100%",
          }}
        >
          <div style={{ fontWeight: "bold" }}>Simulation Log</div>
          {simulations.map((simulation) => (
            <div
              key={simulation.id}
              style={{
                border: "1px solid #34495e",
                borderRadius: "5px",
                padding: "10px",
                background: "#ecf0f1",
              }}
            >
              {simulation.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
