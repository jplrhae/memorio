import { IPartition } from "../../App";

interface IPartitionsListProps {
  partitions: IPartition[];
  onPartitionRemoved: (id: number) => void;
  isSimulationRunning: boolean;
}

export default function PartitionsList(props: IPartitionsListProps) {
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
      {props.partitions.length === 0 ? (
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid #34495e",
          }}
        >
          No partitions added.
        </div>
      ) : (
        props.partitions.map((partition) => (
          <div
            key={partition.id}
            style={{
              border: "1px dotted #34495e",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px",
              background: `linear-gradient(to right, #2ecc71 ${
                (partition.used / partition.size) * 100
              }%, #3498db ${(partition.used / partition.size) * 100}%)`,
            }}
          >
            <div style={{ fontWeight: "bold" }}>PT{partition.id}</div>
            <div>{partition.used}kb</div>
            <div>/</div>
            <div>{partition.size}kb</div>
            {!props.isSimulationRunning && (
              <button
                onClick={() => props.onPartitionRemoved(partition.id)}
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
