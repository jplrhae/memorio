import { IProcess } from "../StaticAllocationView";

interface IProcessesListProps {
  processes: IProcess[];
  onProcessRemoved: (id: number) => void;
  isSimulationRunning: boolean;
}

export default function ProcessesList(props: IProcessesListProps) {
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
      {props.processes.length === 0 ? (
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid #34495e",
          }}
        >
          No processes added.
        </div>
      ) : (
        props.processes.map((process) => (
          <div
            key={process.id}
            style={{
              border: "1px dotted #34495e",
              display: "flex",
              backgroundColor: process.isLocked
                ? "#e74c3c"
                : process.allocatedIn
                ? "#2ecc71"
                : "#3498db",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px",
            }}
          >
            <div style={{ fontWeight: "bold" }}>PR{process.id}</div>
            <div>{process.size}kb</div>
            <div>
              {process.allocatedIn
                ? `Allocated in partition ${process.allocatedIn.id}`
                : "Not allocated"}
            </div>
            {process.allocatedIn && (
              <button
                onClick={() => props.onProcessRemoved(process.id)}
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
                Kill
              </button>
            )}
            {!props.isSimulationRunning && (
              <button
                onClick={() => props.onProcessRemoved(process.id)}
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
