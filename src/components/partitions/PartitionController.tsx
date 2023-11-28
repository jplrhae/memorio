import React, { useState, ChangeEvent, FormEvent } from "react";

interface PartitionFormProps {
  onAddPartition: (size: number) => void;
  onClearPartitions: () => void;
}

const PartitionForm: React.FC<PartitionFormProps> = ({
  onAddPartition,
  onClearPartitions,
}) => {
  const [partitionSize, setPartitionSize] = useState<number>(0);

  const handleSizeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newSize = parseFloat(event.target.value);
    setPartitionSize(newSize);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (partitionSize > 0) {
      onAddPartition(partitionSize);
      setPartitionSize(0);
    } else {
      onAddPartition(Math.floor(Math.random() * 10) + 1);
    }
  };

  return (
    <>
      <form
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        onSubmit={handleSubmit}
      >
        <label>
          Partition Size (KB):
          <input
            type="number"
            value={partitionSize}
            onChange={handleSizeChange}
          />
        </label>
        <button type="submit" disabled={partitionSize <= 0}>
          Add Partition
        </button>
        <button type="submit">Add Random Partition</button>
      </form>
      <button onClick={() => onClearPartitions()}>Clear All Partitions</button>
    </>
  );
};

export default PartitionForm;
