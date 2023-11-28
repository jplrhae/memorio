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
        border: "1px solid #34495e", // Darker border color
        display: "flex",
        flexDirection: "column",
        width: "400px",
        textAlign: "center",
        borderRadius: "5px",
        overflow: "hidden", // Hide overflowing content
      }}
    >
      {props.processes.length === 0 ? (
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid #34495e", // Border to separate when no partitions are added
          }}
        >
          No processes added.
        </div>
      ) : (
        props.processes.map((process) => (
          <div
            key={process.id}
            style={{
              border: "1px dotted #34495e", // Dotted border
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px",
            }}
          >
            <div>{process.size}kb</div>
            {!props.isSimulationRunning && (
              <button
                onClick={() => props.onProcessRemoved(process.id)}
                style={{
                  backgroundColor: "#e74c3c", // Red color for remove button
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
