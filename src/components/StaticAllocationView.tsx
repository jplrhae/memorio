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
  isLocked?: boolean;
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
  const [strategy, setStrategy] = useState<string>("first-fit");
  const [doGenerateLogs, setDoGenerateLogs] = useState<boolean>(true);

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
    const processToRemove = processes.find((p) => p.id === id);
    if (processToRemove?.allocatedIn) {
      const partitionAllocated = processToRemove.allocatedIn;
      addSimulationLog(
        `Killed process ${id} which was allocated in partition ${partitionAllocated.id}, freeing ${partitionAllocated.used}kb.`
      );
      partitions.find((p) => p.id === partitionAllocated.id)!.used = 0;
      const processesToUnlock = processes.filter(
        (process) => process.size <= partitionAllocated.size
      );
      for (const process of processesToUnlock) {
        process.isLocked = false;
      }
    }

    const newProcesses = processes.filter((p) => p.id !== id);
    setProcesses(newProcesses);
  };

  const addSimulationLog = (text: string) => {
    if (!doGenerateLogs) return;

    setSimulations((prevSimulations) => [
      ...prevSimulations,
      {
        id: prevSimulations.length + 1,
        date: new Date(),
        text,
      },
    ]);
  };

  const toggleSimulation = () => {
    if (isSimulationRunning) {
      setIsSimulationRunning(false);

      setPartitions((prevPartitions) =>
        prevPartitions.map((partition) => ({ ...partition, used: 0 }))
      );

      setProcesses((prevProcesses) =>
        prevProcesses.map((process) => ({
          ...process,
          allocatedIn: null,
          isLocked: false,
        }))
      );
    } else {
      setIsSimulationRunning(true);
      setSimulations([]);
    }
  };

  const getPartitionFragmentationsInKbytes = () => {
    return partitions.reduce((acc, partition) => {
      return acc + partition.size - partition.used;
    }, 0);
  };

  const getPartitionFragmentationsInPercentage = () => {
    const totalFragmentation = partitions.reduce((acc, partition) => {
      return acc + partition.size - partition.used;
    }, 0);

    return (
      (totalFragmentation /
        partitions.reduce((acc, partition) => {
          return acc + partition.size;
        }, 0)) *
      100
    ).toFixed(2);
  };

  const getPartitionOccupationPercentage = (used: number, size: number) => {
    return ((used / size) * 100).toFixed(2);
  };

  const allocateProcesses = () => {
    const processesToAllocate = processes.filter(
      (process) => process.allocatedIn === null && !process.isLocked
    );

    if (processesToAllocate.length === 0) {
      addSimulationLog("No other processes can be allocated.");
      console.log("No processes to allocate");
      return;
    }

    for (const process of processesToAllocate) {
      console.log("Allocating process", process.id);

      let availablePartition: IPartition | undefined;
      if (strategy === "first-fit") {
        availablePartition = partitions.find(
          (partition) => !partition.used && partition.size >= process.size
        );
      } else {
        const sortedPartitions = partitions
          .filter(
            (partition) => !partition.used && partition.size >= process.size
          )
          .sort((a, b) => a.size - b.size);

        availablePartition = sortedPartitions[0];
      }

      if (availablePartition !== undefined) {
        console.log(
          "Found available partition",
          availablePartition.id,
          "for process",
          process.id
        );
        process.allocatedIn = availablePartition;

        availablePartition.used = process.size;
        addSimulationLog(
          `Process ${process.id} allocated in partition ${
            availablePartition.id
          }, occupying ${process.size} of ${
            availablePartition.size
          }kb (${getPartitionOccupationPercentage(
            process.size,
            availablePartition.size
          )}%)`
        );
      } else {
        addSimulationLog(
          `No available partitions for process ${process.id} (with size ${
            process.size
          }kb). Fragmentation is ${getPartitionFragmentationsInKbytes()}kb, representing ${getPartitionFragmentationsInPercentage()}% of total space.`
        );
        process.isLocked = true;

        console.log("No available partitions for process", process.id);
      }
    }
  };

  useEffect(() => {
    if (isSimulationRunning) {
      const intervalId = setInterval(() => {
        allocateProcesses();
        setProcesses([...processes]);
      }, 2000);

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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <button
          style={{
            backgroundColor: isSimulationRunning
              ? "#e74c3c"
              : hasPartitionsAndProcesses
              ? "#2ecc71"
              : "#7f8c8d",
            color: "white",
            padding: "15px",
            borderRadius: "8px",
            cursor: "pointer",
            outline: "none",
            border: "none",
            width: "200px",
          }}
          disabled={!isSimulationRunning && !hasPartitionsAndProcesses}
          onClick={toggleSimulation}
        >
          {isSimulationRunning ? "Stop Simulation" : "Start Simulation"}
        </button>
        <div style={{ display: "flex" }}>
          <div
            style={{
              color: strategy === "first-fit" ? "blue" : "black",
              cursor: "pointer",
            }}
            onClick={() => setStrategy("first-fit")}
          >
            [ first-fit ]
          </div>
          <div
            style={{
              color: strategy === "best-fit" ? "blue" : "black",
              cursor: "pointer",
            }}
            onClick={() => setStrategy("best-fit")}
          >
            [ best-fit ]
          </div>
        </div>
      </div>
      {!hasPartitionsAndProcesses && (
        <div>Add partitions and processes to start the simulation</div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginTop: "20px",
          width: "100%",
        }}
      >
        <div style={{ fontWeight: "bold" }}>
          Simulation Log{" "}
          <span
            style={{
              color: "blue",
              marginLeft: 9,
              cursor: "pointer",
              fontSize: 14,
              userSelect: "none",
            }}
            onClick={() => setDoGenerateLogs(!doGenerateLogs)}
          >
            {doGenerateLogs ? "on" : "off"}
          </span>{" "}
          <span
            style={{
              color: "red",
              marginLeft: 9,
              cursor: "pointer",
              fontSize: 14,
              userSelect: "none",
            }}
            onClick={() => setSimulations([])}
          >
            clear
          </span>
        </div>
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
            {simulation.date.toUTCString()} - {simulation.text}
          </div>
        ))}
      </div>
    </div>
  );
}
