import { IPartition } from "./PartitionsView";

interface IPartitionsListProps {
  partitions: IPartition[];
  onPartitionRemoved: (id: number) => void;
}

export default function PartitionsList(props: IPartitionsListProps) {
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
      {props.partitions.length === 0 ? (
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid #34495e", // Border to separate when no partitions are added
          }}
        >
          No partitions added.
        </div>
      ) : (
        props.partitions.map((partition) => (
          <div
            key={partition.id}
            style={{
              border: "1px dotted #34495e", // Dotted border
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px",
            }}
          >
            <div>{partition.used}kb</div>
            <div>/</div>
            <div>{partition.size}kb</div>
            <div>
              <button
                onClick={() => props.onPartitionRemoved(partition.id)}
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
            </div>
          </div>
        ))
      )}
    </div>
  );
}
