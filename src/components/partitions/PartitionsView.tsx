import { useState } from "react";
import PartitionController from "./PartitionController";
import PartitionsList from "./PartitionsList";

export interface IPartition {
  id: number;
  size: number;
  used: number;
}

export default function PartitionsView() {
  const [partitions, setPartitions] = useState<IPartition[]>([]);

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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <PartitionController
        onAddPartition={addPartition}
        onClearPartitions={() => setPartitions([])}
      />
      <PartitionsList
        partitions={partitions}
        onPartitionRemoved={removePartition}
      />
    </div>
  );
}
