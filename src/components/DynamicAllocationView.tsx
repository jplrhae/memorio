import { useState } from "react";
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
  const [doGenerateLogs, setDoGenerateLogs] = useState<boolean>(false);
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
      addSimulationLog(
        `Killed program ${id} which was allocated, freeing ${programToRemove.size}kb.`
      );
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
