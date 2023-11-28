import { IPartition } from "./PartitionsView";

interface IPartitionsListProps {
  partitions: IPartition[];
  onPartitionRemoved: (id: number) => void;
}

export default function PartitionsList(props: IPartitionsListProps) {
  return (
    <div
      style={{
        border: "1px solid black",
        display: "flex",
        flexDirection: "column",
        width: "400px",
        textAlign: "center",
        borderRadius: "5px",
      }}
    >
      {props.partitions.map((partition) => (
        <div
          key={partition.id}
          style={{
            border: "1px dotted black",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 5px",
          }}
        >
          <div>{partition.used}kb</div>
          <div>/</div>
          <div>{partition.size}kb</div>
          <div>
            <button onClick={() => props.onPartitionRemoved(partition.id)}>
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
