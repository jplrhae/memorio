import React, { useState, ChangeEvent, FormEvent } from "react";

interface IProcessesFormProps {
  onAddProcess: (size: number) => void;
  onClearProcesses: () => void;
}

export default function ProcessController(props: IProcessesFormProps) {
  const [processSize, setProcessSize] = useState<number>(0);

  const handleSizeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newSize = parseFloat(event.target.value);
    setProcessSize(newSize);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (processSize > 0) {
      props.onAddProcess(processSize);
      setProcessSize(0);
    } else {
      props.onAddProcess(Math.floor(Math.random() * 10) + 1);
    }
  };

  return (
    <>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px", // Increased gap for better spacing
          backgroundColor: "#2c3e50", // Dark background color
          padding: "15px",
          borderRadius: "8px",
          boxShadow: "0 5px 5px rgba(0, 0, 0, 0.1)", // Subtle shadow
        }}
        onSubmit={handleSubmit}
      >
        <label style={{ color: "white" }}>
          Process Size (KB):
          <input
            type="number"
            value={processSize}
            onChange={handleSizeChange}
            style={{
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #34495e", // Border color
            }}
          />
        </label>
        <button
          type="submit"
          disabled={processSize <= 0}
          style={{
            backgroundColor: processSize <= 0 ? "#7f8c8d" : "#3498db", // Button color
            color: processSize <= 0 ? "black" : "white",
            padding: "10px",
            borderRadius: "5px",
            cursor: processSize > 0 ? "pointer" : "not-allowed",
            outline: "none",
            border: "none",
          }}
        >
          Add Process
        </button>
        <button
          type="submit"
          style={{
            backgroundColor: "#2ecc71", // Different button color
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            cursor: "pointer",
            outline: "none",
            border: "none",
          }}
        >
          Add Random Process
        </button>
      </form>
      <button
        onClick={() => props.onClearProcesses()}
        style={{
          backgroundColor: "#e74c3c", // Red color for clear button
          color: "white",
          padding: "10px",
          borderRadius: "5px",
          cursor: "pointer",
          outline: "none",
          border: "none",
        }}
      >
        Clear All Processes
      </button>
    </>
  );
}
