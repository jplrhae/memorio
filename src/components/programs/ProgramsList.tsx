import { IProgram } from "../../App";

interface IProgramsListProps {
  programs: IProgram[];
  onProgramRemoved: (id: number) => void;
  isSimulationRunning: boolean;
}

export default function ProgramsList(props: IProgramsListProps) {
  return (
    <div
      style={{
        border: "1px solid #34495e",
        display: "flex",
        flexDirection: "column",
        width: "400px",
        textAlign: "center",
        borderRadius: "5px",
        overflow: "hidden",
      }}
    >
      {props.programs.length === 0 ? (
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid #34495e",
          }}
        >
          No programs added.
        </div>
      ) : (
        props.programs.map((program) => (
          <div
            key={program.id}
            style={{
              border: "1px dotted #34495e",
              display: "flex",
              backgroundColor: program.isLocked
                ? "#e74c3c"
                : program.allocatedIn
                ? "#2ecc71"
                : "#3498db",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px",
            }}
          >
            <div style={{ fontWeight: "bold" }}>PR{program.id}</div>
            <div>{program.size}kb</div>
            <div>
              {program.allocatedIn
                ? `Allocated in partition ${program.allocatedIn.id}`
                : "Not allocated"}
            </div>
            {program.allocatedIn && (
              <button
                onClick={() => props.onProgramRemoved(program.id)}
                style={{
                  backgroundColor: "#e74c3c",
                  color: "white",
                  padding: "8px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  outline: "none",
                  border: "none",
                }}
              >
                kill
              </button>
            )}
            {!props.isSimulationRunning && (
              <button
                onClick={() => props.onProgramRemoved(program.id)}
                style={{
                  backgroundColor: "#e74c3c",
                  color: "white",
                  padding: "8px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  outline: "none",
                  border: "none",
                }}
              >
                Remove
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
