import { useEffect, useState } from "react";
import PartitionController from "./partitions/PartitionController";
import PartitionsList from "./partitions/PartitionsList";
import ProgramsController from "./programs/ProgramsController";
import ProgramsList from "./programs/ProgramsList";

export interface IPartition {
  id: number;
  size: number;
  used: number;
}

export interface IProgram {
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
  const [programs, setPrograms] = useState<IProgram[]>([]);
  const [simulations, setSimulations] = useState<ISimulationData[]>([]);
  const [strategy, setStrategy] = useState<string>("first-fit");
  const [doGenerateLogs, setDoGenerateLogs] = useState<boolean>(true);
  const [initialPartitions, setInitialPartitions] = useState<IPartition[]>([]);
  const [initialPrograms, setInitialPrograms] = useState<IProgram[]>([]);

  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const hasPartitionsAndPrograms = partitions.length > 0 && programs.length > 0;

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

  const addProgram = (size: number) => {
    const newPartition: IProgram = {
      id: programs.length + 1,
      size,
      allocatedIn: null,
    };
    setPrograms([...programs, newPartition]);
  };

  const removeProgram = (id: number) => {
    const programToRemove = programs.find((p) => p.id === id);
    if (programToRemove?.allocatedIn) {
      const partitionAllocated = programToRemove.allocatedIn;
      addSimulationLog(
        `Killed program ${id} which was allocated in partition ${partitionAllocated.id}, freeing ${partitionAllocated.used}kb.`
      );
      partitions.find((p) => p.id === partitionAllocated.id)!.used = 0;
      const programsToUnlock = programs.filter(
        (program) => program.size <= partitionAllocated.size
      );
      for (const program of programsToUnlock) {
        program.isLocked = false;
      }
    }

    const newPrograms = programs.filter((p) => p.id !== id);
    setPrograms(newPrograms);
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

  const downloadSimulationLog = () => {
    const partitionsData = initialPartitions.reduce((acc, partition) => {
      return `${acc}Partition ${partition.id} - ${partition.size}kb\n`;
    }, "");
    const programsData = initialPrograms.reduce((acc, program) => {
      return `${acc}Program ${program.id} - ${program.size}kb\n`;
    }, "");
    const simulationLog = simulations.reduce((acc, simulation) => {
      return `${acc}${simulation.date.toUTCString()} - ${simulation.text}\n`;
    }, "");
    const simulationData = `Allocation method: Static Partitioned Relocatable Allocation\nStrategy: ${strategy}\n\nPartitions:\n${partitionsData}\nPrograms:\n${programsData}\nSimulation Log:\n${simulationLog}`;

    const element = document.createElement("a");
    const file = new Blob([simulationData], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = "simulation-log.txt";
    document.body.appendChild(element);
    element.click();
  };

  const toggleSimulation = () => {
    if (isSimulationRunning) {
      setIsSimulationRunning(false);

      setPartitions((prevPartitions) =>
        prevPartitions.map((partition) => ({ ...partition, used: 0 }))
      );

      setPrograms((previousPrograms) =>
        previousPrograms.map((program) => ({
          ...program,
          allocatedIn: null,
          isLocked: false,
        }))
      );
    } else {
      setIsSimulationRunning(true);
      setInitialPartitions([...partitions]);
      setInitialPrograms([...programs]);
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

  const allocatePrograms = () => {
    const programsToAllocate = programs.filter(
      (program) => program.allocatedIn === null && !program.isLocked
    );

    if (programsToAllocate.length === 0) {
      addSimulationLog("No other programs can be allocated.");
      console.log("No programs to allocate");
      return;
    }

    for (const program of programsToAllocate) {
      console.log("Allocating program", program.id);

      let availablePartition: IPartition | undefined;
      if (strategy === "first-fit") {
        availablePartition = partitions.find(
          (partition) => !partition.used && partition.size >= program.size
        );
      } else {
        const sortedPartitions = partitions
          .filter(
            (partition) => !partition.used && partition.size >= program.size
          )
          .sort((a, b) => a.size - b.size);

        availablePartition = sortedPartitions[0];
      }

      if (availablePartition !== undefined) {
        console.log(
          "Found available partition",
          availablePartition.id,
          "for program",
          program.id
        );
        program.allocatedIn = availablePartition;

        availablePartition.used = program.size;
        addSimulationLog(
          `Program ${program.id} allocated in partition ${
            availablePartition.id
          }, occupying ${program.size} of ${
            availablePartition.size
          }kb (${getPartitionOccupationPercentage(
            program.size,
            availablePartition.size
          )}%)`
        );
      } else {
        addSimulationLog(
          `No available partitions for program ${program.id} (with size ${
            program.size
          }kb). Fragmentation is ${getPartitionFragmentationsInKbytes()}kb, representing ${getPartitionFragmentationsInPercentage()}% of total space.`
        );
        program.isLocked = true;

        console.log("No available partitions for program", program.id);
      }
    }
  };

  useEffect(() => {
    if (isSimulationRunning) {
      const intervalId = setInterval(() => {
        allocatePrograms();
        setPrograms([...programs]);
      }, 2000);

      return () => clearInterval(intervalId);
    }
  }, [isSimulationRunning, programs, partitions]);

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
            <ProgramsController
              onAddProgram={addProgram}
              onClearPrograms={() => setPrograms([])}
            />
          )}
          <ProgramsList
            programs={programs}
            onProgramRemoved={removeProgram}
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
              : hasPartitionsAndPrograms
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
          disabled={!isSimulationRunning && !hasPartitionsAndPrograms}
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
      {!hasPartitionsAndPrograms && (
        <div>Add partitions and programs to start the simulation</div>
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
          {simulations.length > 0 && (
            <span
              style={{
                color: "green",
                marginLeft: 9,
                cursor: "pointer",
                fontSize: 14,
                userSelect: "none",
              }}
              onClick={() => downloadSimulationLog()}
            >
              download
            </span>
          )}
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
