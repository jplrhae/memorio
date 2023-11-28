import { useEffect, useState } from "react";
import { IProgram, ISimulationData } from "../App";
import ProgramsController from "./programs/ProgramsController";
import ProgramsList from "./programs/ProgramsList";
import TotalMemoryController from "./TotalMemoryController";
import TotalMemoryList from "./TotalMemoryList";

export interface IDynamicAllocationData {
  totalSize: number;
  allocatedPrograms: IProgram[];
}

export default function DynamicAllocationView() {
  const [programs, setPrograms] = useState<IProgram[]>([]);
  const [initialPrograms, setInitialPrograms] = useState<IProgram[]>([]);
  const [dynamicAllocationData, setDynamicAllocationData] =
    useState<IDynamicAllocationData>({
      totalSize: 0,
      allocatedPrograms: [],
    });
  const [isSimulationRunning, setIsSimulationRunning] =
    useState<boolean>(false);
  const [doGenerateLogs, setDoGenerateLogs] = useState<boolean>(true);
  const [simulations, setSimulations] = useState<ISimulationData[]>([]);
  const hasProgramsAndTotalSize =
    programs.length > 0 && dynamicAllocationData.totalSize > 0;
  const [strategy, setStrategy] = useState<"first-fit" | "best-fit">(
    "first-fit"
  );

  const addProgram = (size: number) => {
    const newProgram: IProgram = {
      id: programs.length + 1,
      size,
      allocatedIn: null,
    };
    setPrograms([...programs, newProgram]);
  };

  const removeProgram = (id: number) => {
    const programToRemove = programs.find((p) => p.id === id);
    if (programToRemove?.isAllocated) {
      const totalSize = dynamicAllocationData.totalSize;
      
      addSimulationLog(
        `Killed program ${id} which was allocated, freeing ${programToRemove.size}kb.`
        );
        const newAllocatedProgramsList = dynamicAllocationData.allocatedPrograms.filter((p) => (p.id !== id));
      let totalUsedSize = 0;
      newAllocatedProgramsList.forEach(program => {
        totalUsedSize = totalUsedSize + program.size;
      });
      
      const availableSize = totalSize - totalUsedSize;
      const programsToUnlock = programs.filter((p) => (p.size <= availableSize));
      for (const program of programsToUnlock) {
        program.isLocked = false;
      }
      setDynamicAllocationData({...dynamicAllocationData, allocatedPrograms: newAllocatedProgramsList});
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

  const toggleSimulation = () => {
    if (isSimulationRunning) {
      setIsSimulationRunning(false);

      setPrograms((previousPrograms) =>
        previousPrograms.map((program) => ({
          ...program,
          allocatedIn: null,
          isAllocated: false,
          isLocked: false,
        }))
      );
      setDynamicAllocationData({...dynamicAllocationData, allocatedPrograms: []});
    } else {
      setIsSimulationRunning(true);
      setInitialPrograms([...programs]);
      setSimulations([]);
    }
  };

  const downloadSimulationLog = () => {
    const programsData = initialPrograms.reduce((acc, program) => {
      return `${acc}Program ${program.id} - ${program.size}kb\n`;
    }, "");
    const simulationLog = simulations.reduce((acc, simulation) => {
      return `${acc}${simulation.date.toUTCString()} - ${simulation.text}\n`;
    }, "");
    const simulationData = `Allocation method: Dynamic Partitioned Allocation\nStrategy: ${strategy}\n\nTotal size: ${dynamicAllocationData}\nPrograms:\n${programsData}\nSimulation Log:\n${simulationLog}`;

    const element = document.createElement("a");
    const file = new Blob([simulationData], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = "simulation-log-dynamic.txt";
    document.body.appendChild(element);
    element.click();
  };

  const allocatePrograms = () => {
    console.log("Allocating...");
    
    const programsToAllocate = programs.filter(
      (program) => !program.isAllocated && !program.isLocked
    );
    
    if (programsToAllocate.length === 0) {
      addSimulationLog("No other programs can be allocated.");
      return;
    }

    console.log(programsToAllocate);

    let totalUsedSize = 0;

    dynamicAllocationData.allocatedPrograms.forEach((program) => {
      totalUsedSize = totalUsedSize + program.size
    });

    console.log("Total used size is", totalUsedSize);

    let availableSize = dynamicAllocationData.totalSize - totalUsedSize;

    console.log("Available size", availableSize);

    for (const program of programsToAllocate) {
      console.log("Allocating program", program.id);

        if (program.size <= availableSize) {
          console.log(
            "Program",
            program.id,
            "fits in total allocation"
          );
          dynamicAllocationData.allocatedPrograms.push(program);
          program.isAllocated = true;
          addSimulationLog(
            `Program ${program.id} allocated in memory occupying ${program.size}kb of ${
              availableSize
            }kb. Total size was ${dynamicAllocationData.totalSize}`
            );
            availableSize = availableSize - program.size;
        } else {
          addSimulationLog(
            `Program ${program.id} (with size ${
              program.size
            }kb) cannot be allocated in total memory. Available space is ${availableSize}kb.`
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
  }, [isSimulationRunning, programs]);

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
            <TotalMemoryController
              onSetTotalSize={(newSize) =>
                setDynamicAllocationData({
                  ...dynamicAllocationData,
                  totalSize: newSize,
                })
              }
              onClearTotalSize={() =>
                setDynamicAllocationData({
                  ...dynamicAllocationData,
                  totalSize: 0,
                })
              }
            />
          )}
          <TotalMemoryList
            dynamicAllocationData={dynamicAllocationData}
            isSimulationRunning={isSimulationRunning}
            onProgramRemoved={removeProgram}
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
              : hasProgramsAndTotalSize
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
          disabled={!isSimulationRunning && !hasProgramsAndTotalSize}
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
        </div>
      </div>
      {!hasProgramsAndTotalSize && (
        <div>
          Add programs and set a total allocation size to start the simulation
        </div>
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
