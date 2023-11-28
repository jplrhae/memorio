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
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          backgroundColor: "#2c3e50",
          padding: "15px",
          borderRadius: "8px",
          boxShadow: "0 5px 5px rgba(0, 0, 0, 0.1)",
        }}
        onSubmit={handleSubmit}
      >
        <label style={{ color: "white" }}>
          Partition Size (KB):
          <input
            type="number"
            value={partitionSize}
            onChange={handleSizeChange}
            style={{
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #34495e",
            }}
          />
        </label>
        <button
          type="submit"
          disabled={partitionSize <= 0}
          style={{
            backgroundColor: partitionSize <= 0 ? "#7f8c8d" : "#3498db",
            color: partitionSize <= 0 ? "black" : "white",
            padding: "10px",
            borderRadius: "5px",
            cursor: partitionSize > 0 ? "pointer" : "not-allowed",
            outline: "none",
            border: "none",
          }}
        >
          Add Partition
        </button>
        <button
          type="submit"
          style={{
            backgroundColor: "#2ecc71",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            cursor: "pointer",
            outline: "none",
            border: "none",
          }}
        >
          Add Random Partition
        </button>
      </form>
      <button
        onClick={() => onClearPartitions()}
        style={{
          backgroundColor: "#e74c3c",
          color: "white",
          padding: "10px",
          borderRadius: "5px",
          cursor: "pointer",
          outline: "none",
          border: "none",
        }}
      >
        Clear All Partitions
      </button>
    </>
  );
};

export default PartitionForm;
